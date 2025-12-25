'use client';

import { useQuery } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/lib/api';
import { ExamSlot, ExamCategory, ExamStatus } from '@/types/exam';
import { useExamStudents, useCreateExamStudent, useDeleteExamStudent } from '@/hooks/use-exam-slots';
import { formatDate, formatPhoneNumber } from '@/lib/utils';

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
}

interface ExamSlotStudentListProps {
  examSlot: ExamSlot;
}

export default function ExamSlotStudentList({ examSlot }: ExamSlotStudentListProps) {
  const { data: studentsInTraining } = useQuery({
    queryKey: ['students', 'IN_TRAINING'],
    queryFn: async () => {
      const { data } = await api.get<Student[]>('/Student', {
        params: { status: 'IN_TRAINING' },
      });
      return data;
    },
  });

  const { data: examStudents } = useExamStudents(examSlot.id);
  const createExamStudent = useCreateExamStudent();
  const deleteExamStudent = useDeleteExamStudent();

  const isStudentAssigned = (studentId: number) => {
    return examStudents?.some((es) => es.studentId === studentId);
  };

  const getExamStudentId = (studentId: number) => {
    return examStudents?.find((es) => es.studentId === studentId)?.id;
  };

  const handleToggle = (student: Student, checked: boolean) => {
    if (checked) {
      createExamStudent.mutate({
        studentId: student.id,
        examSlotId: examSlot.id,
        category: ExamCategory.CODE,
        status: ExamStatus.PLANNED,
        date: examSlot.examDate,
      });
    } else {
      const examStudentId = getExamStudentId(student.id);
      if (examStudentId) {
        deleteExamStudent.mutate(examStudentId);
      }
    }
  };

  // Fonction pour formater le nom complet
  const getFullName = (student: Student) => {
    const fullName = `${student.name.firstName} ${student.name.lastName}`;
    
    if (student.fatherName?.firstName) {
      return `${fullName} (${student.fatherName.firstName})`;
    } else if (student.motherName?.firstName) {
      return `${fullName} (${student.motherName.firstName})`;
    }
    
    return fullName;
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {studentsInTraining?.length || 0} candidat(s) en formation disponible(s)
      </p>

      {studentsInTraining && studentsInTraining.length > 0 ? (
        <div className="space-y-2">
          {studentsInTraining.map((student) => {
            const isAssigned = isStudentAssigned(student.id);
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition ${
                  isAssigned ? 'bg-green-50 border-green-200' : 'hover:bg-accent'
                }`}
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                  {/* Colonne 1: Nom complet + ID inscription */}
                  <div>
                    <p className="font-semibold text-sm">
                      {getFullName(student)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.inscriptionId}
                    </p>
                  </div>

                  {/* Colonne 2: Date de naissance */}
                  <div>
                    <p className="text-xs text-muted-foreground">Né(e) le</p>
                    <p className="text-sm font-medium">
                      {formatDate(student.birthDate)}
                    </p>
                  </div>

                  {/* Colonne 3: Téléphone */}
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium">
                      {formatPhoneNumber(student.phoneNumber)}
                    </p>
                  </div>

                  {/* Colonne 4: Badge status */}
                  <div className="flex items-center justify-end gap-3">
                    {isAssigned && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        Assigné
                      </Badge>
                    )}
                    <Switch
                      checked={isAssigned}
                      onCheckedChange={(checked) => handleToggle(student, checked)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Aucun candidat en formation
        </p>
      )}
    </div>
  );
}
