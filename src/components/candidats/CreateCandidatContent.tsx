'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCreateCandidat } from '@/src/hooks/use-candidats';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/src/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { ArrowLeft, Camera, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GENDER_OPTIONS, LICENSE_OPTIONS } from '@/src/lib/constants';
import OwnedLicensesField from './OwnedLicensesField';
import { compressImage, validateImageFile, getBase64Size } from '@/src/lib/image-utils';

// Schema de validation pour un permis
const licenseSchema = z.object({
  obtentionDate: z.string().min(1, 'Date d\'obtention requise'),
  licenseNumber: z.string()
    .min(1, 'Numéro de permis requis')
    .regex(/^\d+$/, 'Le numéro doit contenir uniquement des chiffres'),
  licenseCategory: z.string().min(1, 'Catégorie requise'),
  issueDate: z.string().min(1, 'Date de délivrance requise'),
  issuingAuthority: z.string().min(1, 'Autorité de délivrance requise'),
  expirationDate: z.string().min(1, 'Date d\'expiration requise'),
}).refine((data) => {
  if (!data.obtentionDate || !data.issueDate) return true;
  return new Date(data.issueDate) >= new Date(data.obtentionDate);
}, {
  message: 'La date de délivrance doit être après la date d\'obtention',
  path: ['issueDate'],
}).refine((data) => {
  if (!data.issueDate || !data.expirationDate) return true;
  return new Date(data.expirationDate) > new Date(data.issueDate);
}, {
  message: 'La date d\'expiration doit être après la date de délivrance',
  path: ['expirationDate'],
});

// Schema complet du formulaire
const createCandidatSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  birthDate: z.string().min(1, 'Date de naissance requise'),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().min(1, 'Téléphone requis'),
  address: z.string().min(1, 'Adresse requise'),
  fatherFirstName: z.string().optional(),
  fatherLastName: z.string().optional(),
  motherFirstName: z.string().optional(),
  motherLastName: z.string().optional(),
  requestedLicense: z.string().min(1, 'Permis demandé requis'),
  inscriptionSchoolDate: z.string().min(1, 'Date d\'inscription requise'),
  inscriptionDate: z.string().optional(),
  inscriptionId: z.string().optional(),
  schoolId: z.string().min(1, 'ID école requis'),
  photoBase64: z.string().nullable().optional(),
  ownedLicense: z.array(licenseSchema).optional(),
});

export type CreateCandidatFormData = z.infer<typeof createCandidatSchema>;

export default function CreateCandidatContent() {
  const router = useRouter();
  const createCandidat = useCreateCandidat();
  const translations = useTranslations('candidats');
  const licenseTranslations = useTranslations('license');
  const logTranslations = useTranslations('logs');
  const placeholderTranslations = useTranslations('placeHolders');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ar';

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const form = useForm<CreateCandidatFormData>({
    resolver: zodResolver(createCandidatSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      placeOfBirth: '',
      gender: '',
      phoneNumber: '',
      address: '',
      fatherFirstName: '',
      fatherLastName: '',
      motherFirstName: '',
      motherLastName: '',
      requestedLicense: 'B',
      inscriptionSchoolDate: getTodayString(),
      inscriptionDate: getTodayString(),
      inscriptionId: '',
      schoolId: '',
      photoBase64: null,
      ownedLicense: [],
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || logTranslations('imageSelection'));
      return;
    }

    try {
      // Compresser et convertir en Base64
      const base64 = await compressImage(file);
      setPhotoPreview(base64);
      form.setValue('photoBase64', base64);
      
      const sizeKB = getBase64Size(base64);
      if (sizeKB > 500) {
        toast.success(
          logTranslations('imageCompressed') || 
          `Image compressée à ${sizeKB}KB`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : logTranslations('imageUploadError') || 'Erreur lors de l\'upload de l\'image'
      );
    }
  };

  const onSubmit = async (data: CreateCandidatFormData) => {
    try {
      const payload = {
        name: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        birthDate: new Date(data.birthDate).toISOString(),
        placeOfBirth: data.placeOfBirth || null,
        gender: data.gender || null,
        phoneNumber: data.phoneNumber,
        address: data.address,
        fatherName:
          data.fatherFirstName || data.fatherLastName
            ? {
                firstName: data.fatherFirstName || '',
                lastName: data.fatherLastName || '',
              }
            : null,
        motherName:
          data.motherFirstName || data.motherLastName
            ? {
                firstName: data.motherFirstName || '',
                lastName: data.motherLastName || '',
              }
            : null,
        requestedLicense: data.requestedLicense,
        inscriptionSchoolDate: new Date(data.inscriptionSchoolDate).toISOString(),
        inscriptionDate: data.inscriptionDate
          ? new Date(data.inscriptionDate).toISOString()
          : new Date(data.inscriptionSchoolDate).toISOString(),
        inscriptionId: data.inscriptionId || null,
        schoolId: data.schoolId,
        status: 'REGISTERED',
        ownedLicense:
          data.ownedLicense?.map((license) => ({
            obtentionDate: new Date(license.obtentionDate).toISOString(),
            licenseNumber: parseInt(license.licenseNumber),
            licenseCategory: license.licenseCategory,
            issueDate: new Date(license.issueDate).toISOString(),
            issuingAuthority: license.issuingAuthority,
            expirationDate: new Date(license.expirationDate).toISOString(),
          })) || [],
        photoBase64: data.photoBase64,
      };

      const newCandidat = await createCandidat.mutateAsync(payload);
      toast.success(logTranslations('createCandidatSuccess'));
      router.push(`/${locale}/candidats/${newCandidat.id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message 
        || logTranslations('errorInCreation');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${locale}/candidats`}>
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            {translations('back')}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{translations('newCandidat')}</h1>
        <p className="text-muted-foreground mt-2">{translations('createSubtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo de profil */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('profilePhoto')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar
                className="h-32 w-32 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <AvatarImage src={photoPreview || undefined} />
                <AvatarFallback>
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {photoPreview ? translations('changePhoto') : translations('addPhoto')}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {translations('photoHint')}
              </p>
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('firstName')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('firstName')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('lastName')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('lastName')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('birthDate')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          max={getTodayString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('placeOfBirth')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('msila')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('gender')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translations('select')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translations(option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('contact')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations('phone')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={placeholderTranslations('phone')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations('address')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={placeholderTranslations('address')} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Parents */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('parentInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fatherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('fatherFirstName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('mohammed')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('fatherLastName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('benali')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('motherFirstName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('fatima')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('motherLastName')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('khelif')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Formation */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('generalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestedLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('requestedLicense')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translations('allLicenses')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LICENSE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {licenseTranslations(option.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inscriptionSchoolDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('inscriptionSchoolDate')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inscriptionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('inscriptionDate')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inscriptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations('inscriptionId')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('inscriptionIdPlaceholder') || '00123'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schoolId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations('schoolId')} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={placeholderTranslations('schoolIdPlaceholder') || '00145'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permis obtenus */}
          <Card>
            <CardHeader>
              <CardTitle>{translations('ownedLicenses')}</CardTitle>
            </CardHeader>
            <CardContent>
              <OwnedLicensesField control={form.control} />
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/candidats`)}
              disabled={form.formState.isSubmitting}
            >
              {translations('cancel')}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting ? translations('saving') : translations('createButton')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
