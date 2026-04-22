export interface Person {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Iban {
  id: string;
  label: string;
  iban: string;
  personId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  brand: string;
  maxCashback: number;
  startDate: string;
  endDate: string;
  url: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';

export interface Submission {
  id: string;
  dealId: string;
  personId: string;
  ibanId: string;
  amount: number;
  status: SubmissionStatus;
  submittedAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
