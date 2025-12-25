'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCandidat } from '@/hooks/use-candidats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateCandidatContent() {
  const router = useRouter();
  const createCandidat = useCreateCandidat();
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // ✅ Fonction helper pour obtenir la date actuelle au bon format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    birthDate: '',
    placeOfBirth: '',
    gender: '',
    
    // Contact
    phoneNumber: '',
    address: '',
    
    // Parents
    fatherFirstName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherLastName: '',
    
    // Formation
    requestedLicense: 'B',
    inscriptionSchoolDate: getTodayString(),
    inscriptionDate: getTodayString(), // ✅ Format yyyy-MM-dd garanti
    
    // Optionnel
    inscriptionId: '',
    schoolId: '',
    
    // Photo
    photoBase64: null as string | null,
  });

  const handleChange = (field: string, value: string) => {
    console.log('🔵 Modification:', field, '=', value); // Debug
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhotoPreview(base64);
      setFormData((prev) => ({ ...prev, photoBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        birthDate: new Date(formData.birthDate).toISOString(),
        placeOfBirth: formData.placeOfBirth || null,
        gender: formData.gender || null,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        fatherName: formData.fatherFirstName
          ? {
              firstName: formData.fatherFirstName,
              lastName: formData.fatherLastName,
            }
          : null,
        motherName: formData.motherFirstName
          ? {
              firstName: formData.motherFirstName,
              lastName: formData.motherLastName,
            }
          : null,
        requestedLicense: formData.requestedLicense,
        inscriptionSchoolDate: new Date(formData.inscriptionSchoolDate).toISOString(),
        inscriptionDate: new Date(formData.inscriptionDate).toISOString(),
        inscriptionId: formData.inscriptionId || null,
        schoolId: formData.schoolId || null,
        status: 'REGISTERED',
        ownedLicense: [],
        photoBase64: formData.photoBase64,
      };

      console.log('📤 Création candidat:', payload);
      
      const newCandidat = await createCandidat.mutateAsync(payload);
      
      toast.success('Candidat créé avec succès');
      router.push(`/candidats/${newCandidat.id}`);
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/candidats">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">Nouveau candidat</h1>
        <p className="text-muted-foreground mt-1">
          Remplissez les informations du candidat
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={photoPreview || ''} alt="Photo" />
              <AvatarFallback className="text-4xl bg-primary/10">
                <User className="w-16 h-16 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photo-upload"
              onChange={handlePhotoUpload}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              {photoPreview ? 'Changer la photo' : 'Ajouter une photo'}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Optionnel - JPG, PNG ou GIF. Max 5 MB.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  placeholder="Ahmed"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  placeholder="Benali"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Date de naissance *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  required
                  className="mt-1"
                  max={getTodayString()}
                />
              </div>

              <div>
                <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                <Input
                  id="placeOfBirth"
                  placeholder="M'Sila"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Genre *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Homme</SelectItem>
                    <SelectItem value="FEMALE">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Téléphone *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="0555123456"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Textarea
                  id="address"
                  placeholder="12 Rue Didouche Mourad, M'Sila"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations parents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fatherFirstName">Prénom du père</Label>
                  <Input
                    id="fatherFirstName"
                    placeholder="Mohammed"
                    value={formData.fatherFirstName}
                    onChange={(e) => handleChange('fatherFirstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fatherLastName">Nom du père</Label>
                  <Input
                    id="fatherLastName"
                    placeholder="Benali"
                    value={formData.fatherLastName}
                    onChange={(e) => handleChange('fatherLastName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motherFirstName">Prénom de la mère</Label>
                  <Input
                    id="motherFirstName"
                    placeholder="Fatima"
                    value={formData.motherFirstName}
                    onChange={(e) => handleChange('motherFirstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="motherLastName">Nom de la mère</Label>
                  <Input
                    id="motherLastName"
                    placeholder="Khelif"
                    value={formData.motherLastName}
                    onChange={(e) => handleChange('motherLastName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requestedLicense">Permis demandé *</Label>
                <Select
                  value={formData.requestedLicense}
                  onValueChange={(value) => handleChange('requestedLicense', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A - Moto</SelectItem>
                    <SelectItem value="A1">A1 - Moto légère</SelectItem>
                    <SelectItem value="B">B - Voiture</SelectItem>
                    <SelectItem value="C">C - Poids lourd</SelectItem>
                    <SelectItem value="D">D - Transport en commun</SelectItem>
                    <SelectItem value="E">E - Remorque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="inscriptionSchoolDate">
                  Date d&apos;inscription(Ecole)*
                </Label>
                <Input
                  id="inscriptionSchoolDate"
                  type="date"
                  value={formData.inscriptionSchoolDate}
                  onChange={(e) => {
                    handleChange('inscriptionSchoolDate', e.target.value);
                  }}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="inscriptionDate">
                  Date d&apos;inscription(Wilaya)
                </Label>
                <Input
                  id="inscriptionDate"
                  type="date"
                  value={formData.inscriptionDate}
                  onChange={(e) => {
                    handleChange('inscriptionDate', e.target.value);
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="inscriptionId">N&deg; d&apos;inscription</Label>
                <Input
                  id="inscriptionId"
                  placeholder="INS-2025-001234"
                  value={formData.inscriptionId}
                  onChange={(e) => handleChange('inscriptionId', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="schoolId">ID École*</Label>
                <Input
                  id="schoolId"
                  placeholder="25/00419"
                  value={formData.schoolId}
                  onChange={(e) => handleChange('schoolId', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/candidats')}
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Création en cours...' : 'Créer le candidat'}
          </Button>
        </div>
      </form>
    </div>
  );
}
