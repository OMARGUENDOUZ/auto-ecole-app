export enum InstructorStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Instructor {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    categories: string[]; // e.g., ['B', 'C1']
    status: InstructorStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateInstructorInput {
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    categories: string[];
    status: InstructorStatus;
}

export interface UpdateInstructorInput extends Partial<CreateInstructorInput> {
    id: number;
}
