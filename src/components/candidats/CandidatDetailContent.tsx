'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCandidat, useUpdateCandidat } from '@/src/hooks/use-candidats';
import { useExams } from '@/src/hooks/use-exams';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Award,
  User,
  Camera,
  Edit2,
  Clock,
  Shield,
  FileText,
  Building2,
  CalendarClock,
  Users,
  IdCard,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import { formatDate, formatPhoneNumber } from '@/src/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import CandidatPhotoUpload from './CandidatPhotoUpload';
import ScheduleExamDialog from '@/src/components/exams/ScheduleExamDialog';
import CandidatInfoEdit from './CandidatInfoEdit';
import CandidatTabs from './CandidatTabs';
import { useTranslations } from 'next-intl';

import { LucideIcon } from 'lucide-react';
import { License, Student } from '@/src/types/candidat';
import { Exam } from '@/src/types/exam';
import ExamCard from './ExamCard';

// Composant pour afficher une information avec icône
function InfoItem({
  icon: Icon,
  label,
  value,
  variant = 'default',
}: {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'default' | 'badge';
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {variant === 'badge' ? (
          <Badge variant="secondary" className="mt-1">
            {value}
          </Badge>
        ) : (
          <p className="font-medium break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher un permis individuel
function LicenseCard({ license, translations }: { license: License; translations: ReturnType<typeof useTranslations> }) {
  const tLicense = useTranslations('license');

  // Déterminer si le permis est expiré
  const isExpired = new Date(license.expirationDate) < new Date();
  const isExpiringSoon =
    new Date(license.expirationDate) <
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 jours

  return (
    <Card
      className={`border-l-4 ${isExpired
        ? 'border-l-destructive'
        : isExpiringSoon
          ? 'border-l-yellow-500'
          : 'border-l-green-500'
        }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {translations('licenseCategory')} {license.licenseCategory}
              </h4>
              <p className="text-sm text-muted-foreground">
                {translations('licenseNumber')}: {license.licenseNumber}
              </p>
            </div>
          </div>
          {isExpired ? (
            <Badge variant="destructive">{translations('expired')}</Badge>
          ) : isExpiringSoon ? (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-600"
            >
              {translations('expiringSoon')}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-green-500 text-green-600">
              {translations('valid')}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={Calendar}
            label={translations('obtentionDate')}
            value={formatDate(license.obtentionDate)}
          />
          <InfoItem
            icon={FileText}
            label={translations('issueDate')}
            value={formatDate(license.issueDate)}
          />
          <InfoItem
            icon={Building2}
            label={translations('issuingAuthority')}
            value={license.issuingAuthority}
          />
          <InfoItem
            icon={CalendarClock}
            label={translations('expirationDate')}
            value={formatDate(license.expirationDate)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CandidatDetailContent() {
  const t = useTranslations('candidats');
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : undefined;
  const locale = (params?.locale as string) ?? 'ar';

  const { data: candidat, isLoading, error } = useCandidat(id || 0);
  const { data: exams } = useExams(id);
  const updateCandidat = useUpdateCandidat();

  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !candidat) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">{t('notFound')}</p>
          <Link href={`/${locale}/candidats`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${locale}/candidats`}>
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Profil */}
        <div className="lg:col-span-1 space-y-6">
          {/* Photo et nom */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={candidat.photoBase64 || undefined} />
                    <AvatarFallback className="text-2xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 right-0 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsPhotoDialogOpen(true)}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold">
                  {candidat.name.firstName} {candidat.name.lastName}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <IdCard className="h-5 w-5" />
                  {t('personalInfo')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingInfo(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidat.inscriptionId && (
                <InfoItem
                  icon={IdCard}
                  label={t('inscriptionId')}
                  value={candidat.inscriptionId}
                />
              )}
              <InfoItem
                icon={Calendar}
                label={t('birthDate')}
                value={formatDate(candidat.birthDate)}
              />
              {candidat.placeOfBirth && (
                <InfoItem
                  icon={MapPin}
                  label={t('placeOfBirth')}
                  value={candidat.placeOfBirth}
                />
              )}
              {candidat.gender && (
                <InfoItem
                  icon={User}
                  label={t('gender')}
                  value={candidat.gender === 'MALE' ? t('male') : t('female')}
                />
              )}
              <InfoItem
                icon={Phone}
                label={t('phone')}
                value={formatPhoneNumber(candidat.phoneNumber)}
              />
              <InfoItem
                icon={MapPin}
                label={t('address')}
                value={candidat.address}
              />
            </CardContent>
          </Card>

          {/* Informations parents */}
          {(candidat.fatherName || candidat.motherName) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('parentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidat.fatherName && (
                  <InfoItem
                    icon={User}
                    label={t('father')}
                    value={`${candidat.fatherName.firstName} ${candidat.fatherName.lastName}`}
                  />
                )}
                {candidat.motherName && (
                  <InfoItem
                    icon={User}
                    label={t('mother')}
                    value={`${candidat.motherName.firstName} ${candidat.motherName.lastName}`}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('trainingInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={Award}
                  label={t('requestedLicense')}
                  value={candidat.requestedLicense}
                  variant="badge"
                />
                <InfoItem
                  icon={IdCard}
                  label={t('schoolId')}
                  value={candidat.schoolId}
                />
                <InfoItem
                  icon={Calendar}
                  label={t('inscriptionSchoolDate')}
                  value={formatDate(candidat.inscriptionSchoolDate)}
                />
                {candidat.inscriptionDate && (
                  <InfoItem
                    icon={Clock}
                    label={t('inscriptionDate')}
                    value={formatDate(candidat.inscriptionDate)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section Permis Obtenus */}
          {candidat.ownedLicense && candidat.ownedLicense.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>{t('ownedLicenses')}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {candidat.ownedLicense.length} {t('licenses')}
                  </Badge>
                </div>
                <CardDescription>{t('ownedLicensesDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidat.ownedLicense.map((license, index: number) => (
                    <LicenseCard key={index} license={license} translations={t} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* État vide si pas de permis */}
          {(!candidat.ownedLicense || candidat.ownedLicense.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-16 w-16 text-muted-foreground/50 mb-3" />
                <CardTitle className="text-lg mb-2">
                  {t('noOwnedLicenses')}
                </CardTitle>
                <CardDescription className="max-w-sm mb-4">
                  {t('noOwnedLicensesDetailDescription')}
                </CardDescription>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingInfo(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {t('addLicense')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Section Examens */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('exams')}
                </CardTitle>
                <Button size="sm" onClick={() => setIsExamDialogOpen(true)}>{t('addExam')}</Button>
              </div>
            </CardHeader>
            <CardContent>
              {exams && exams.length > 0 ? (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t('noExams')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {candidat && (
        <ScheduleExamDialog
          open={isExamDialogOpen}
          onOpenChange={setIsExamDialogOpen}
          studentId={candidat.id}
          defaultCategory={candidat.nextExam}
        />
      )}

      {isPhotoDialogOpen && (
        <CandidatPhotoUpload
          candidat={candidat}
          onClose={() => setIsPhotoDialogOpen(false)}
        />
      )}

      {isEditingInfo && (
        <CandidatInfoEdit
          candidat={candidat}
          onClose={() => setIsEditingInfo(false)}
        />
      )}
    </div>
  );
}
