import { Student } from '@/src/types/candidat';

export enum PaymentStatus {
    PAID = 'PAID',
    NOT_PAID = 'NOT_PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
}

/**
 * Détail de la décomposition d'une facture par poste (clé = libellé, valeur = montant en centimes ou unités).
 * Exemple : { "Cours de conduite": 12000, "Examen code": 3000 }
 */
export type InvoiceBreakdown = Record<string, number>;

export interface Invoice {
    id: number;
    studentId: number;
    status: PaymentStatus;
    baseCourseFee: number;
    examUnitFee: number;
    stampUnitFee: number;
    totalAmount: number;
    paidAmount: number;
    /** Décomposition des frais — null si non renseignée */
    breakdown?: InvoiceBreakdown | null;
    paymentHistory?: Payment[];
}

export interface Payment {
    id: number;
    amount: number;
    date: string;
    /** L'étudiant associé : objet complet (eager) ou son identifiant (lazy) */
    student: Student | number;
    status: PaymentStatus;
}
