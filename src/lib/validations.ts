import { z } from 'zod';

// Validation d'email
const emailSchema = z.string().email('Format d\'email invalide');

// Validation de téléphone (format international)
const phoneSchema = z
  .string()
  .min(8, 'Le téléphone doit avoir au moins 8 caractères')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Le format du téléphone est invalide');

// Validation de date (âge minimum 18 ans)
const birthDateSchema = z.string().refine(
  (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  },
  { message: 'L\'âge minimum requis est de 18 ans' }
).refine(
  (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate <= today;
  },
  { message: 'La date de naissance ne peut pas être dans le futur' }
);

// Schema de base pour candidat
export const candidatFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  phoneNumber: phoneSchema,
  address: z
    .string()
    .min(5, 'L\'adresse doit avoir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .trim(),
  birthDate: birthDateSchema,
  email: emailSchema.optional(),
});

export type CandidatFormData = z.infer<typeof candidatFormSchema>;

// Utilitaires de validation
export const validators = {
  email: emailSchema,
  phone: phoneSchema,
  birthDate: birthDateSchema,
  
  // Sanitization
  sanitizeString: (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
  },
  
  // Validation de format téléphone algérien
  algerianPhone: z
    .string()
    .regex(/^(0|\+213)[5-7]\d{8}$/, 'Format de téléphone algérien invalide (ex: 0555123456)'),
};
