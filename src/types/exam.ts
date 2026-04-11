export enum ExamStatus {
  /**
   * @deprecated Utiliser SCHEDULED — conservé pour rétrocompatibilité avec les données existantes
   */
  PLANNED = 'PLANNED',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export enum ExamCategory {
  CODE = 'CODE',
  CRENEAU = 'CRENEAU',
  CONDUITE = 'CONDUITE',
}

export enum ExamResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  ABSENT_JUSTIFIED = 'ABSENT_JUSTIFIED',
  ABSENT_UNJUSTIFIED = 'ABSENT_UNJUSTIFIED',
}

export interface Exam {
  id: number;
  studentId: number;
  category: ExamCategory;
  status: ExamStatus;
  result?: ExamResult;
  date?: string;
}

export interface ExamSlot {
  id: number;
  examDate: string;
  wilaya: string;
  center: string;
  deadlineList?: string;
  active: boolean;
}

export interface ExamStudent {
  id: number;
  studentId: number;
  examSlotId: number;
  category: ExamCategory;
  status: ExamStatus;
  result?: ExamResult;
  date: string;
}
