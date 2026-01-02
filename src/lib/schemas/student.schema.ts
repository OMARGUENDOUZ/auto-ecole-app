import { z } from 'zod';

// Schema pour un permis individuel
export const licenseSchema = z.object({
  obtentionDate: z.string().min(1, 'Date d\'obtention requise'),
  licenseNumber: z.string()
    .min(1, 'Numéro de permis requis')
    .regex(/^\d+$/, 'Le numéro doit contenir uniquement des chiffres'),
  licenseCategory: z.string().min(1, 'Catégorie requise'),
  issueDate: z.string().min(1, 'Date de délivrance requise'),
  issuingAuthority: z.string().min(1, 'Autorité de délivrance requise'),
  expirationDate: z.string().min(1, 'Date d\'expiration requise'),
}).refine((data) => {
  // Validation: issueDate doit être après obtentionDate
  return new Date(data.issueDate) >= new Date(data.obtentionDate);
}, {
  message: 'La date de délivrance doit être après la date d\'obtention',
  path: ['issueDate'],
}).refine((data) => {
  // Validation: expirationDate doit être après issueDate
  return new Date(data.expirationDate) > new Date(data.issueDate);
}, {
  message: 'La date d\'expiration doit être après la date de délivrance',
  path: ['expirationDate'],
});

// Type TypeScript inféré du schema
export type LicenseFormData = z.infer<typeof licenseSchema>;

// Schema pour le tableau de permis
export const ownedLicensesSchema = z.array(licenseSchema).optional();
