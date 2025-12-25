export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_TRAINING = 'IN_TRAINING',
  READY_FOR_EXAM = 'READY_FOR_EXAM',
  EXAM_SCHEDULED = 'EXAM_SCHEDULED',
  LICENSED = 'LICENSED',
  DROPPED_OUT = 'DROPPED_OUT'
}

export enum LicenseCategory {
  A = 'A',
  B = 'B',
  C = 'C',
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
  ownedLicense?: LicenseCategory[] | null;
  photoBase64?: string;
}


export interface StudentFilters {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: StudentStatus;
  requestedLicense?: LicenseCategory;
}
