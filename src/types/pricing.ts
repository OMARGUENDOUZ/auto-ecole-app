import { LicenseCategory } from '@/src/types/common';

export interface Pricing {
    id: number;
    licenseCategory: LicenseCategory;
    baseCourseFee: number;
    examUnitFee: number;
    stampUnitFee: number;
    active: boolean;
    maxVehicles: number;
    candidatesPerVehicle: number;
    billExamOnJustifiedAbsence: boolean;
    billStampOnJustifiedAbsence: boolean;
    billExamOnUnjustifiedAbsence: boolean;
    billStampOnUnjustifiedAbsence: boolean;
}
