// Re-export depuis common.ts pour rétrocompatibilité
export type { PaginatedResponse, LicenseCategory } from '@/src/types/common';

export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_TRAINING = 'IN_TRAINING',
  READY_FOR_EXAM = 'READY_FOR_EXAM',
  EXAM_SCHEDULED = 'EXAM_SCHEDULED',
  LICENSED = 'LICENSED',
  DROPPED_OUT = 'DROPPED_OUT',
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface HumanName {
  firstName: string;
  lastName: string;
}

export interface Student {
  id: number;
  inscriptionId: string;
  inscriptionDate: string;
  govInscriptionId?: string;
  govInscriptionDate?: string;
  schoolId?: string;
  inscriptionSchoolDate?: string;
  status: StudentStatus;
  name: HumanName;
  birthDate: string;
  placeOfBirth?: string;
  gender: GenderType | null;
  fatherName?: HumanName;
  motherName?: HumanName;
  address: string;
  phoneNumber: string;
  requestedLicense: import('@/src/types/common').LicenseCategory;
  ownedLicense?: License[] | null;
  photoBase64?: string;
  nextExam?: string;
}

export interface License {
  obtentionDate: string;
  licenseNumber: number;
  licenseCategory: import('@/src/types/common').LicenseCategory;
  issueDate: string;
  issuingAuthority: string;
  expirationDate: string;
}

export interface StudentFilters {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: StudentStatus;
  requestedLicense?: import('@/src/types/common').LicenseCategory;
  page?: number;
  limit?: number;
}

/**
 * Payload pour la création et la mise à jour d'un étudiant.
 * Contient uniquement les champs éditables (pas les champs générés par le backend).
 */
export interface StudentRequest {
  name: HumanName;
  birthDate: string;
  gender: GenderType | null;
  address: string;
  phoneNumber: string;
  requestedLicense: import('@/src/types/common').LicenseCategory;
  status: StudentStatus;
  schoolId?: string;
  placeOfBirth?: string;
  fatherName?: HumanName;
  motherName?: HumanName;
  photoBase64?: string;
}
