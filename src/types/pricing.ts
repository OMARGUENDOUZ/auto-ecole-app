export interface Pricing {
    id: number;
    licenseCategory: 'A' | 'B' | 'C' | 'D';
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
