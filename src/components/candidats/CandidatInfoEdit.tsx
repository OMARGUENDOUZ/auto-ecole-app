'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { useUpdateCandidat } from '@/src/hooks/use-candidats';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { GENDER_OPTIONS, LICENSE_OPTIONS} from '@/src/lib/constants';
import { Student } from '@/src/types/candidat';

interface CandidatInfoEditProps {
  candidat: Student;
  onClose: () => void;
}

export default function CandidatInfoEdit({ candidat, onClose }: CandidatInfoEditProps) {
  const updateCandidat = useUpdateCandidat();
  const t = useTranslations('candidats');
  const tLicense = useTranslations('license');
  const tPlaceholders = useTranslations('placeHolders');
  
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
    
    toast.success(t('updateSuccess'));
    onClose();
  } catch (error) {
    toast.error(t('updateError'));
  } finally {
    setIsSaving(false);
  }
};


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('edit')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              {t('generalInfo')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscriptionId">{t('inscriptionId')}</Label>
                <Input
                  id="inscriptionId"
                  placeholder={tPlaceholders('inscriptionIdPlaceholder') || '001234'}
                  value={formData.inscriptionId}
                  onChange={(e) => handleChange('inscriptionId', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">{t('phone')} *</Label>
                <Input
                  id="phoneNumber"
                  placeholder={tPlaceholders('phonePlaceholder') || '0555123456'}
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="placeOfBirth">{t('placeOfBirth')}</Label>
                <Input
                  id="placeOfBirth"
                  placeholder={tPlaceholders('placeOfBirthPlaceholder') || 'Alger'}
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">{t('gender')}</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('select')} />
                  </SelectTrigger>
                  <SelectContent> 
                              {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {t(option.label)}
                                </SelectItem>
                              ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">{t('address')} *</Label>
                <Textarea
                  id="address"
                  placeholder={tPlaceholders('addressPlaceholder') || '12 Rue Didouche Mourad, Alger'}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="requestedLicense">{t('requestedLicense')}</Label>
                <Select
                  value={formData.requestedLicense}
                  onValueChange={(value) => handleChange('requestedLicense', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
            {LICENSE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {tLicense(option.labelKey)}
              </SelectItem>
            ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations parents */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              {t('parentInfo')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherFirstName">{t('fatherFirstName')}</Label>
                <Input
                  id="fatherFirstName"
                  placeholder={tPlaceholders('mohammed')}
                  value={formData.fatherFirstName}
                  onChange={(e) => handleChange('fatherFirstName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fatherLastName">{t('fatherLastName')}</Label>
                <Input
                  id="fatherLastName"
                  placeholder={tPlaceholders('benali')}
                  value={formData.fatherLastName}
                  onChange={(e) => handleChange('fatherLastName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="motherFirstName">{t('motherFirstName')}</Label>
                <Input
                  id="motherFirstName"
                  placeholder={tPlaceholders('fatima')}
                  value={formData.motherFirstName}
                  onChange={(e) => handleChange('motherFirstName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="motherLastName">{t('motherLastName')}</Label>
                <Input
                  id="motherLastName"
                  placeholder={tPlaceholders('khelif')}
                  value={formData.motherLastName}
                  onChange={(e) => handleChange('motherLastName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
