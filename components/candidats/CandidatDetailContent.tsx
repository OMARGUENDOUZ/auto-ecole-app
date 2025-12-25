'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCandidat, useUpdateCandidat } from '@/hooks/use-candidats';
import { useExams } from '@/hooks/use-exams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  Award,
  User,
  Camera,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { formatDate, formatPhoneNumber, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import CandidatPhotoUpload from './CandidatPhotoUpload';
import CandidatInfoEdit from './CandidatInfoEdit';
import ExamCard from './ExamCard';

export default function CandidatDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string) : undefined;
  
  const { data: candidat, isLoading, error } = useCandidat(id || 0);
  const { data: exams } = useExams(id);
  const updateCandidat = useUpdateCandidat();
  
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !candidat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2">Candidat non trouvé</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/candidats">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    return `${candidat.name.firstName.charAt(0)}${candidat.name.lastName.charAt(0)}`.toUpperCase();
  };

const handlePhotoUpload = async (photoBase64: string) => {
  try {
    await updateCandidat.mutateAsync({
      id: candidat.id,
      photoBase64,
    });
    setIsPhotoDialogOpen(false);
    toast.success('Photo mise à jour');
  } catch (error) {
    toast.error('Erreur lors de la mise à jour');
  }
};


  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header avec bouton retour */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/candidats">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      {/* Section Photo de profil + Infos principales */}
      <Card className="mb-6">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center">
            {/* Photo de profil */}
            <div className="relative group mb-4">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={candidat.photoBase64 || ''} alt={getInitials()} />
                <AvatarFallback className="text-4xl font-semibold bg-primary/10">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              {/* Bouton upload photo au hover */}
              <button
                onClick={() => setIsPhotoDialogOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>

            {/* Nom et statut */}
            <h1 className="text-3xl font-bold text-center mb-2">
              {candidat.name.firstName} {candidat.name.lastName}
            </h1>

            {/* Infos rapides */}
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              {candidat.inscriptionId && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{candidat.inscriptionId}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(candidat.birthDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{formatPhoneNumber(candidat.phoneNumber)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Informations personnelles */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingInfo(!isEditingInfo)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem 
                label="Lieu de naissance" 
                value={candidat.placeOfBirth || '-'} 
              />
              <InfoItem 
                label="Genre" 
                value={candidat.gender === 'MALE' ? 'Homme' : candidat.gender === 'FEMALE' ? 'Femme' : '-'} 
              />
              <InfoItem 
                label="Adresse" 
                value={candidat.address}
                icon={<MapPin className="w-4 h-4" />}
              />
              <InfoItem 
                label="Téléphone" 
                value={formatPhoneNumber(candidat.phoneNumber)}
                icon={<Phone className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations parents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem 
                label="Père" 
                value={candidat.fatherName 
                  ? `${candidat.fatherName.firstName} ${candidat.fatherName.lastName || ''}`
                  : '-'
                } 
              />
              <InfoItem 
                label="Mère" 
                value={candidat.motherName 
                  ? `${candidat.motherName.firstName} ${candidat.motherName.lastName || ''}`
                  : '-'
                } 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem 
                label="N° Inscription" 
                value={candidat.inscriptionId || 'Non attribué'}
                editable
              />
              <InfoItem 
                label="Date d'inscription" 
                value={candidat.inscriptionDate ? formatDate(candidat.inscriptionDate) : '-'} 
              />
              <InfoItem 
                label="Permis demandé" 
                value={candidat.requestedLicense}
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Examens */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Examens</CardTitle>
              <p className="text-sm text-muted-foreground">
                {exams?.length || 0} examen{(exams?.length || 0) > 1 ? 's' : ''} programmé{(exams?.length || 0) > 1 ? 's' : ''}
              </p>
            </CardHeader>
            <CardContent>
              {exams && exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun examen programmé</p>
                  <Button variant="outline" className="mt-4">
                    Programmer un examen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CandidatPhotoUpload
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
        onUpload={handlePhotoUpload}
        currentPhoto={candidat.photoBase64}
      />

      {isEditingInfo && (
        <CandidatInfoEdit
          candidat={candidat}
          onClose={() => setIsEditingInfo(false)}
        />
      )}
    </div>
  );
}

// Composant InfoItem réutilisable
function InfoItem({ 
  label, 
  value, 
  icon,
  editable = false 
}: { 
  label: string; 
  value: string; 
  icon?: React.ReactNode;
  editable?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-medium">{value}</p>
        </div>
      </div>
      {editable && (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
