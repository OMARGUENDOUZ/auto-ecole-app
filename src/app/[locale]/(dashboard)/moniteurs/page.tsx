'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  CreditCard,
  User,
} from 'lucide-react';
import {
  useInstructors,
  useCreateInstructor,
  useUpdateInstructor,
  useDeleteInstructor,
} from '@/src/hooks/use-instructors';
import { Instructor, InstructorStatus } from '@/src/types/instructor';
import InstructorDialog from '@/src/components/moniteurs/InstructorDialog';

export default function MoniteursPage() {
  const t = useTranslations('instructors');
  const tc = useTranslations('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const { data: instructors = [], isLoading } = useInstructors();
  const createInstructor = useCreateInstructor();
  const updateInstructor = useUpdateInstructor();
  const deleteInstructor = useDeleteInstructor();

  const filteredInstructors = instructors.filter(
    (ins) =>
      ins.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: any) => {
    createInstructor.mutate(data, {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  const handleUpdate = (data: any) => {
    if (editingInstructor) {
      updateInstructor.mutate(
        { ...data, id: editingInstructor.id },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingInstructor(null);
          },
        }
      );
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t('deleteConfirm'))) {
      deleteInstructor.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={() => {
          setEditingInstructor(null);
          setIsDialogOpen(true);
        }} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t('addInstructor')}
        </Button>
      </div>

      <Card className="border-none shadow-premium bg-white/80 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('noInstructors')} // Or a search label if available
              className="pl-10 max-w-sm border-gray-200"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">{tc('loading')}</div>
          ) : filteredInstructors.length === 0 ? (
            <div className="py-20 text-center">
              <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground font-medium">{t('noInstructors')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead>{t('lastName')}</TableHead>
                    <TableHead>{t('firstName')}</TableHead>
                    <TableHead>{t('phone')}</TableHead>
                    <TableHead>{t('licenseNumber')}</TableHead>
                    <TableHead>{t('categories')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead className="text-right">{tc('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstructors.map((instructor) => (
                    <TableRow key={instructor.id} className="group hover:bg-gray-50/50 transition-colors border-gray-100">
                      <TableCell className="font-semibold text-gray-900">{instructor.lastName}</TableCell>
                      <TableCell className="text-gray-700">{instructor.firstName}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-primary/60" />
                          {instructor.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <CreditCard className="w-3 h-3 mr-2 text-primary/60" />
                          {instructor.licenseNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {instructor.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={instructor.status === InstructorStatus.ACTIVE ? 'success' : 'danger'}
                          className="font-medium"
                        >
                          {instructor.status === InstructorStatus.ACTIVE ? t('active') : t('inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => handleEdit(instructor)}>
                              <Edit className="w-4 h-4 mr-2" /> {tc('edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(instructor.id)}
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> {tc('delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InstructorDialog
        instructor={editingInstructor}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingInstructor ? handleUpdate : handleCreate}
        isSubmitting={createInstructor.isPending || updateInstructor.isPending}
      />
    </div>
  );
}
