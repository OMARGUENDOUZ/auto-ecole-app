import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { Student, StudentStatus } from '@/src/types/candidat';
import { formatDate, formatPhoneNumber } from '@/src/lib/utils';
import { PaymentDialog } from '@/src/components/finance/PaymentDialog';
import { Eye, User, MoreHorizontal, Check, RefreshCw, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/src/components/ui/skeleton';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { useUpdateCandidat } from '@/src/hooks/use-candidats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

interface CandidatTableProps {
  candidats: Student[];
  isLoading?: boolean;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-16" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ... imports consolidated at the top

export function CandidatTable({ candidats, isLoading }: CandidatTableProps) {
  const t = useTranslations('candidats');
  const c = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ar';
  const updateCandidat = useUpdateCandidat();
  const [paymentStudent, setPaymentStudent] = useState<{ id: number, name: string } | null>(null);

  const handleStatusChange = (id: number, newStatus: StudentStatus) => {
    updateCandidat.mutate({ id, status: newStatus });
  };

  const getStatusLabelKey = (status: string) => {
    // Mapping to translation keys
    switch (status) {
      case StudentStatus.REGISTERED: return 'registered';
      case StudentStatus.IN_TRAINING: return 'inTraining';
      case StudentStatus.READY_FOR_EXAM: return 'readyForExam';
      case StudentStatus.EXAM_SCHEDULED: return 'examScheduled';
      case StudentStatus.LICENSED: return 'licensed';
      case StudentStatus.DROPPED_OUT: return 'droppedOut';
      default: return status;
    }
  };

  if (isLoading) {
    // ... (keeps same)
    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('phone')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('requestedLicense')}</TableHead>
              <TableHead>{t('inscriptionDate')}</TableHead>
              <TableHead>{c('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableSkeleton />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (candidats.length === 0) {
    // ... (keeps same)
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{t('notFound')}</p>
      </div>
    );
  }

  return (

    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('inscriptionId')}</TableHead>
            <TableHead>{t('lastName')}</TableHead>
            <TableHead>{t('firstName')}</TableHead>
            <TableHead>{t('birthDate')}</TableHead>
            <TableHead>{t('requestedLicense')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead >{t('status')}</TableHead>
            <TableHead className="text-end">{c('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidats.map((candidat) => {
            return (
              <TableRow key={candidat.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm font-medium">
                  {candidat.inscriptionId}
                </TableCell>
                <TableCell className="font-medium">
                  {candidat.name.lastName}
                </TableCell>
                <TableCell>
                  {candidat.name.firstName}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(candidat.birthDate)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {candidat.requestedLicense}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {formatPhoneNumber(candidat.phoneNumber)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        {t(getStatusLabelKey(candidat.status))}
                        <RefreshCw className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>{t('changeStatus')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusChange(candidat.id, StudentStatus.REGISTERED)}>
                        {t('registered')} {candidat.status === StudentStatus.REGISTERED && <Check className="ml-auto h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(candidat.id, StudentStatus.IN_TRAINING)}>
                        {t('inTraining')} {candidat.status === StudentStatus.IN_TRAINING && <Check className="ml-auto h-3 w-3" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(candidat.id, StudentStatus.LICENSED)}>
                        {t('licensed')} {candidat.status === StudentStatus.LICENSED && <Check className="ml-auto h-3 w-3" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentStudent({
                        id: candidat.id,
                        name: `${candidat.name.firstName} ${candidat.name.lastName}`
                      })}
                    >
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </Button>
                    <Link href={`/${locale}/candidats/${candidat.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <PaymentDialog
        open={!!paymentStudent}
        onOpenChange={(open) => !open && setPaymentStudent(null)}
        studentId={paymentStudent?.id || null}
        studentName={paymentStudent?.name}
      />
    </div>
  );
}
