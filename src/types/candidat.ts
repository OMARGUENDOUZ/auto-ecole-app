export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_TRAINING = 'IN_TRAINING',
  READY_FOR_EXAM = 'READY_FOR_EXAM',
  EXAM_SCHEDULED = 'EXAM_SCHEDULED',
  LICENSED = 'LICENSED',
  DROPPED_OUT = 'DROPPED_OUT'
}

export enum LicenseCategory {
  A1 = 'A1',
  A2 = 'A2',
  B = 'B',
  C1 = 'C1',
  C2 = 'C2',
  E = 'E',
  D = 'D'
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
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
  status: StudentStatus;
  name: HumanName;
  birthDate: string;
  placeOfBirth?: string;
  gender: GenderType | null;
  fatherName?: HumanName;
  motherName?: HumanName;
  address: string;
  phoneNumber: string;
  requestedLicense: LicenseCategory;
  ownedLicense?: License[] | null;
  photoBase64?: string;
}


export interface License {
  obtentionDate: string;
  licenseNumber: number;
  licenseCategory: LicenseCategory;
  issueDate: string;
  issuingAuthority: string;
  expirationDate: string;
}

export interface StudentFilters {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: StudentStatus;
  requestedLicense?: LicenseCategory;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}
