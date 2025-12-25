'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCandidat } from '@/hooks/use-candidats';
import { toast } from 'sonner';

interface CandidatInfoEditProps {
  candidat: any;
  onClose: () => void;
}

export default function CandidatInfoEdit({ candidat, onClose }: CandidatInfoEditProps) {
  const updateCandidat = useUpdateCandidat();
  
  const [formData, setFormData] = useState({
    inscriptionId: candidat.inscriptionId || '',
    phoneNumber: candidat.phoneNumber || '',
    address: candidat.address || '',
    placeOfBirth: candidat.placeOfBirth || '',
    gender: candidat.gender || '',
    requestedLicense: candidat.requestedLicense || 'B',
    fatherFirstName: candidat.fatherName?.firstName || '',
    fatherLastName: candidat.fatherName?.lastName || '',
    motherFirstName: candidat.motherName?.firstName || '',
    motherLastName: candidat.motherName?.lastName || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    await updateCandidat.mutateAsync({
      id: candidat.id,
      name: candidat.name,
      birthDate: candidat.birthDate,
      schoolId: candidat.schoolId,
      status: candidat.status,
      inscriptionSchoolDate: candidat.inscriptionSchoolDate,
      inscriptionDate: candidat.inscriptionDate,
      ownedLicense: candidat.ownedLicense || [],
      photoBase64: candidat.photoBase64,
      inscriptionId: formData.inscriptionId || null,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      placeOfBirth: formData.placeOfBirth || null,
      gender: formData.gender || null,
      requestedLicense: formData.requestedLicense,
      fatherName: {
        firstName: formData.fatherFirstName,
        lastName: formData.fatherLastName,
      },
      motherName: {
        firstName: formData.motherFirstName,
        lastName: formData.motherLastName,
      },
    });
    
    toast.success('Informations mises à jour');
    onClose();
  } catch (error) {
    toast.error('Erreur lors de la mise à jour');
  } finally {
    setIsSaving(false);
  }
};


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Informations générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscriptionId">N&deg; d&apos;inscription</Label>
                <Input
                  id="inscriptionId"
                  placeholder="INS-2025-001234"
                  value={formData.inscriptionId}
                  onChange={(e) => handleChange('inscriptionId', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optionnel - Peut être ajouté plus tard
                </p>
              </div>

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
                <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                <Input
                  id="placeOfBirth"
                  placeholder="Alger"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Genre</Label>
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

              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse *</Label>
                <Textarea
                  id="address"
                  placeholder="12 Rue Didouche Mourad, Alger"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="requestedLicense">Permis demandé</Label>
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
            </div>
          </div>

          {/* Informations parents */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Informations parents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
