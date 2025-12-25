import { z } from 'zod';

export const candidatFormSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  phoneNumber: z.string().min(8, 'Le téléphone doit avoir au moins 8 caractères'),
  address: z.string().min(5, 'L\'adresse doit avoir au moins 5 caractères'),
});

export type CandidatFormData = z.infer<typeof candidatFormSchema>;
