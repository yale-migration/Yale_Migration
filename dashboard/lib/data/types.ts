/** Their vocabulary, not ours (D-51..56). Never re-label these in the UI. */
export type ProcessingStage =
  | 'Enquiry' | 'Engaged' | 'Documents Pending' | 'Documents Complete'
  | 'Ready for Lodgement' | 'Lodged' | 'Awaiting Outcome' | 'Closed'

export type VisaOutcome = 'Pending' | 'Granted' | 'Refused' | 'Withdrawn'
export type Office = 'BRISBANE' | 'TOWNSVILLE' | 'PHILIPPINES'
export type Role = 'client' | 'manager' | 'director'

export interface Matter {
  client_code: string
  full_name: string
  office: Office
  team: string | null
  consultant: string | null
  visa_type: string | null
  processing_stage: ProcessingStage | null
  visa_outcome: VisaOutcome | null
  visa_expiry: string | null
  last_contact: string | null
  next_due: string | null
  docs_outstanding: string | null
}

export interface S56Deadline {
  id: number
  client_code: string | null
  client_name: string | null
  office: Office
  subclass: string | null
  letter_date: string | null
  days_allowed: number | null
  due_date_legal: string | null
  due_date_internal: string | null
  deadline_sentence: string | null
  needs_review: boolean
}

export interface Viewer {
  role: Role
  office: Office | null
  clientCode: string | null
  displayName: string
}

export interface Enquiry {
  id: number
  enquiry_date: string | null
  name: string | null          // 🔑 nullable — 82 rows in their own log are a number and no name
  phone: string | null
  email: string | null
  channel: string | null
  visa_interest: string | null
  office: Office | null        // 🔴 null after a live sync — the sheet has no office column (D-389)
  location: string | null      // Onshore / Offshore — sheet column G
  assigned_to: string | null
  status: string | null
  follow_up_due: string | null
  last_contact: string | null
}
