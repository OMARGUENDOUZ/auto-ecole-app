export interface FinancialReport {
    totalRevenue: number;
    totalExpenses: number;
    netBalance: number;
    revenueByMonth: {
        month: string;
        amount: number;
    }[];
}

export interface ExamSuccessStats {
    category: string;
    totalExams: number;
    passed: number;
    failed: number;
    absent: number;
    successRate: number;
}

export interface RegistrationStats {
    month: string;
    count: number;
}

export interface DashboardStats {
    financial: FinancialReport;
    examSuccess: ExamSuccessStats[];
    registrations: RegistrationStats[];
}
