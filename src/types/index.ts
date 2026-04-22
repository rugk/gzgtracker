// Core data types for GzGTracker

export interface Person {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contacts: Contact[]
  createdAt: string
  updatedAt?: string
}

export interface Contact {
  type: 'email' | 'phone' | 'address'
  value: string
}

export interface Iban {
  id: string
  iban: string
  bankName: string
  owners: string[] // array of person IDs
  createdAt: string
  updatedAt?: string
}

export interface Deal {
  id: string
  company: string
  product: string
  cashbackAmount: number
  cashbackType: 'full' | 'partial' | 'fixed'
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'renewed'
  conditions: string
  participationLimits: string
  notes: string
  source: 'manual' | 'community' | 'platform'
  platform: string
  createdAt: string
  updatedAt?: string
}

export interface Submission {
  id: string
  dealId: string
  personId: string
  ibanId: string
  contactUsed: string
  submissionDate: string
  purchaseDate: string
  purchaseAmount: number
  receiptReference: string
  status: 'submitted' | 'approved' | 'paid' | 'rejected'
  paymentReceivedDate: string | null
  notes: string
  createdAt: string
  updatedAt?: string
}

export interface Settings {
  locale: 'en' | 'de'
  theme: 'light' | 'dark' | 'auto'
}

export interface ExportData {
  version: string
  exportDate: string
  data: {
    people?: Person[]
    ibans?: Iban[]
    deals?: Deal[]
    submissions?: Submission[]
    settings?: Settings
  }
}

// Form types (for creation, may have optional fields)
export type PersonForm = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>
export type IbanForm = Omit<Iban, 'id' | 'createdAt' | 'updatedAt'>
export type DealForm = Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>
export type SubmissionForm = Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>
