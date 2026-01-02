'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Input } from '@/src/components/ui/input';
import api from '@/src/lib/api';
import { ExamSlot, ExamCategory, ExamStatus } from '@/src/types/exam';
import { useExamStudents, useCreateExamStudent, useDeleteExamStudent } from '@/src/hooks/use-exam-slots';
import { formatDate } from '@/src/lib/utils';
import { exportToCSV } from '@/src/lib/export';
import { Search, FileDown, Plus, Trash2, CheckCircle2, CreditCard } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/src/components/ui/dropdown-menu"
import { PaymentDialog } from '@/src/components/finance/PaymentDialog';
import { ExamResult } from '@/src/types/exam';
import { useUpdateExamStudent } from '@/src/hooks/use-exam-slots';
import { useTranslations } from 'next-intl';

interface Student {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
  fatherName?: {
    firstName: string;
  };
  motherName?: {
    firstName: string;
  };
  birthDate: string;
  phoneNumber: string;
  inscriptionId: string;
  status: string;
  nextExam?: string;
  lastExam?: {
    category: string;
    result: string;
    date: string;
  };
}

interface ExamSlotStudentListProps {
  examSlot: ExamSlot;
}

export default function ExamSlotStudentList({ examSlot }: ExamSlotStudentListProps) {
  const t = useTranslations('exams');
  const tf = useTranslations('finance');
  const [activeTab, setActiveTab] = useState('selection');
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'fr';

  const { data: studentsInTraining = [] } = useQuery({
    queryKey: ['students', 'IN_TRAINING'],
    queryFn: async () => {
      const { data } = await api.get('/Student', {
        params: { status: 'IN_TRAINING' },
      });

      if (Array.isArray(data)) {
        return data as Student[];
      }

      // Handle both array and paginated response
      if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as any).content)) {
        return (data as any).content as Student[];
      }

      console.warn("Unexpected response format for students:", data);
      return [] as Student[];
    },
  });

  const { data: examStudents } = useExamStudents(examSlot.id);
  const createExamStudent = useCreateExamStudent();
  const deleteExamStudent = useDeleteExamStudent();
  const updateExamStudent = useUpdateExamStudent();
  const [paymentStudent, setPaymentStudent] = useState<{ id: number, name: string } | null>(null);

  const isStudentAssigned = (studentId: number) => {
    return examStudents?.some((es) => es.studentId === studentId);
  };

  const handleResultUpdate = (examStudentId: number, result: ExamResult) => {
    let newStatus = ExamStatus.PASSED;
    if (result === ExamResult.PENDING) newStatus = ExamStatus.PLANNED;

    updateExamStudent.mutate({
      id: examStudentId,
      result: result,
      status: newStatus
    });
  };

  const handleAssign = (student: Student, category: ExamCategory) => {
    createExamStudent.mutate({
      studentId: student.id,
      examSlotId: examSlot.id,
      category: category,
      status: ExamStatus.PLANNED,
      date: examSlot.examDate,
    });
  };

  const handleUnassign = (examStudentId: number) => {
    deleteExamStudent.mutate(examStudentId);
  };

  const handleExport = () => {
    if (!examStudents || examStudents.length === 0) return;

    const exportData = examStudents.map(es => {
      const studentDetails = Array.isArray(studentsInTraining) ? studentsInTraining.find(s => s.id === es.studentId) : undefined;
      return {
        [t('idLabel') || 'ID Inscription']: studentDetails?.inscriptionId || 'N/A',
        [t('lastNameLabel') || 'Nom']: studentDetails?.name.lastName || 'N/A',
        [t('firstNameLabel') || 'Prénom']: studentDetails?.name.firstName || 'N/A',
        [t('birthDateLabel') || 'Date de Naissance']: studentDetails ? formatDate(studentDetails.birthDate) : 'N/A',
        [t('phoneLabel') || 'Téléphone']: studentDetails ? studentDetails.phoneNumber : 'N/A',
        [t('categoryLabel') || 'Catégorie']: es.category,
        [t('statusLabel') || 'Status Examen']: es.status
      }
    });

    exportToCSV(exportData, `participants_examen_${examSlot.examDate}`);
  };

  const getFullName = (student: Student) => {
    const fullName = `${student.name.firstName} ${student.name.lastName}`;
    if (student.fatherName?.firstName) {
      return `${fullName} (${student.fatherName.firstName})`;
    } else if (student.motherName?.firstName) {
      return `${fullName} (${student.motherName.firstName})`;
    }
    return fullName;
  };

  const filteredEligibleStudents = (Array.isArray(studentsInTraining) ? studentsInTraining : []).filter(student => {
    const isAssigned = isStudentAssigned(student.id);
    if (isAssigned) return false;

    const matchesSearch = getFullName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.inscriptionId.includes(searchTerm);
    return matchesSearch;
  }) || [];

  const assignedStudentsList = examStudents?.map(es => {
    const details = Array.isArray(studentsInTraining) ? studentsInTraining.find(s => s.id === es.studentId) : undefined;
    return { ...es, details };
  }) || [];

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case ExamResult.PASS: return "bg-green-500";
      case ExamResult.FAIL: return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case ExamResult.PASS: return t('admitted');
      case ExamResult.FAIL: return t('refused');
      case ExamResult.ABSENT_UNJUSTIFIED: return t('absentUnjustified');
      case ExamResult.ABSENT_JUSTIFIED: return t('absentJustified');
      case ExamResult.PENDING: return t('pending');
      default: return result;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="selection">{t('selection')} ({filteredEligibleStudents.length})</TabsTrigger>
          <TabsTrigger value="participants">{t('participants')} ({examStudents?.length || 0})</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {activeTab === 'selection' && (
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('searchPlaceholder')}
                className="pl-9"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {activeTab === 'participants' && (
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                {t('exportList')}
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="selection" className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredEligibleStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('noEligibleStudents')}</p>
          ) : (
            filteredEligibleStudents.map(student => {
              const isAssigned = isStudentAssigned(student.id);
              const nextExam = student.nextExam;

              return (
                <div key={student.id} className={`flex items-center justify-between p-3 rounded-md border ${isAssigned ? 'bg-primary/5 border-primary/20' : 'hover:bg-accent'}`}>
                  <div className="flex flex-col">
                    <span className="font-medium">{getFullName(student)}</span>
                    <span className="text-xs text-muted-foreground">ID: {student.inscriptionId} • {formatDate(student.birthDate)}</span>
                    {student.lastExam ? (
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {t('lastExam')}: {student.lastExam.category} ({getResultLabel(student.lastExam.result)}) le {formatDate(student.lastExam.date)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground mt-1">{t('noExamsPassed')}</span>
                    )}
                  </div>
                  {isAssigned ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {t('assigned')}
                    </Badge>
                  ) : (
                    <div className="flex gap-2">
                      {nextExam && (
                        <Button size="sm" onClick={() => handleAssign(student, nextExam as ExamCategory)}>
                          <Plus className="w-4 h-4 mr-1" /> {nextExam}
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>{t('forceAdd')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAssign(student, ExamCategory.CODE)}>
                            {t('code')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssign(student, ExamCategory.CRENEAU)}>
                            {t('creneau')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssign(student, ExamCategory.CONDUITE)}>
                            {t('conduite')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="participants" className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {(!examStudents || examStudents.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">{t('noParticipants')}</p>
              <Button variant="link" onClick={() => setActiveTab('selection')}>
                {t('goToSelection')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {assignedStudentsList.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:shadow-sm transition-shadow">
                  {item.details ? (
                    <div className="flex flex-col">
                      <span className="font-medium">{getFullName(item.details)}</span>
                      <span className="text-xs text-muted-foreground">{item.details.inscriptionId} • {item.details.phoneNumber}</span>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.result && item.result !== ExamResult.PENDING && (
                          <Badge className={getResultBadgeColor(item.result)}>{getResultLabel(item.result)}</Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium text-destructive">{t('missingInfo')} (ID: {item.studentId})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {item.details && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPaymentStudent({
                          id: item.studentId,
                          name: `${item.details!.name.firstName} ${item.details!.name.lastName}`
                        })}
                      >
                        <CreditCard className="lucide lucide-credit-card h-4 w-4 text-primary" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t('result')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{t('updateResult')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResultUpdate(item.id, ExamResult.PASS)}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> {t('admitted')} (PASS)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResultUpdate(item.id, ExamResult.FAIL)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-600" /> {t('refused')} (FAIL)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResultUpdate(item.id, ExamResult.ABSENT_UNJUSTIFIED)}>
                          {t('absentUnjustified')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResultUpdate(item.id, ExamResult.ABSENT_JUSTIFIED)}>
                          {t('absentJustified')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResultUpdate(item.id, ExamResult.PENDING)}>
                          {t('pending')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleUnassign(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PaymentDialog
        open={!!paymentStudent}
        onOpenChange={(open) => !open && setPaymentStudent(null)}
        studentId={paymentStudent?.id || null}
        studentName={paymentStudent?.name}
      />
    </div>
  );
}
