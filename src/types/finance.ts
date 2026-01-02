export enum PaymentStatus {
    PAID = 'PAID',
    NOT_PAID = 'NOT_PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export interface Invoice {
    id: number;
    studentId: number;
    status: PaymentStatus;
    baseCourseFee: number;
    examUnitFee: number;
    stampUnitFee: number;
    totalAmount: number;
    paidAmount: number;
    breakdown?: string; // JSON string
    paymentHistory?: Payment[];
}

export interface Payment {
    id: number;
    amount: number;
    date: string;
    student: any;
    status: PaymentStatus;
}
