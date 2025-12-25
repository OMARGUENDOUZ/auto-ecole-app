export enum ExamStatus {
  PLANNED = 'PLANNED',
  CANCELLED = 'CANCELLED',
  PASSED = 'PASSED'
}

export enum ExamCategory {
  CODE = 'CODE',
  CONDUITE = 'CONDUITE'
}

export enum ExamResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING'
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



