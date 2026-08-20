import type { Matter, S56Deadline, Viewer, Enquiry } from './types'

/**
 * Synthetic data for local development and demos.
 *
 * ⛔ INVENTED PEOPLE. Shaped to match the register's distribution — offices,
 * stages, the long tail of dormancy — but no real name, email or number appears
 * here and none ever may. Real client data does not go on a laptop.
 *
 * The shapes deliberately mirror awkward real cases the build has hit:
 *   · two clients sharing one email address (rows 22 and 23 of their own list)
 *   · a matter with no consultant assigned
 *   · a file dormant far longer than the chase threshold
 */
export const DEMO_MATTERS: Matter[] = [
  { client_code:'YM-2026-00001', full_name:'A. NGUYEN', office:'BRISBANE', team:'Filipino',
    consultant:'Rey', visa_type:'485', processing_stage:'Documents Pending', visa_outcome:'Pending',
    visa_expiry:'2026-08-26', last_contact:'2026-08-14', next_due:'2026-08-21',
    docs_outstanding:'Bank statements, Health insurance certificate' },
  { client_code:'YM-2026-00002', full_name:'B. SHARMA', office:'BRISBANE', team:'Indian',
    consultant:'RJ', visa_type:'482', processing_stage:'Documents Pending', visa_outcome:'Pending',
    visa_expiry:'2026-09-12', last_contact:'2026-07-29', next_due:'2026-08-05',
    docs_outstanding:'Employment contract' },
  { client_code:'YM-2026-00003', full_name:'C. REYES', office:'TOWNSVILLE', team:'Filipino',
    consultant:'Star', visa_type:'189', processing_stage:'Lodged', visa_outcome:'Pending',
    visa_expiry:'2027-01-04', last_contact:'2026-08-18', next_due:null, docs_outstanding:null },
  { client_code:'YM-2026-00004', full_name:'D. SINGH', office:'BRISBANE', team:'Indian',
    consultant:'Priyanka', visa_type:'500', processing_stage:'Awaiting Outcome',
    visa_outcome:'Pending', visa_expiry:'2026-10-30', last_contact:'2026-08-19',
    next_due:null, docs_outstanding:null },
  // no consultant assigned — a real state in their data, and the UI must not crash on it
  { client_code:'YM-2026-00005', full_name:'E. TAN', office:'TOWNSVILLE', team:'Filipino',
    consultant:null, visa_type:'491', processing_stage:'Documents Pending', visa_outcome:'Pending',
    visa_expiry:'2026-11-15', last_contact:'2026-07-19', next_due:'2026-07-26',
    docs_outstanding:'Skills assessment, Police check' },
  { client_code:'YM-2026-00006', full_name:'F. KAUR', office:'BRISBANE', team:'Indian',
    consultant:'Inder', visa_type:'820/801', processing_stage:'Granted' as never,
    visa_outcome:'Granted', visa_expiry:null, last_contact:'2026-08-01',
    next_due:null, docs_outstanding:null },
]

export const DEMO_S56: S56Deadline[] = [
  { id:1, client_code:'YM-2026-00001', client_name:'A. NGUYEN', office:'BRISBANE', subclass:'485',
    letter_date:'2026-08-14', days_allowed:28, due_date_legal:'2026-09-12',
    due_date_internal:'2026-09-10',
    deadline_sentence:'You have 28 days starting on the day after we emailed this request to give us the information we have asked for.',
    needs_review:false },
  { id:2, client_code:'YM-2026-00005', client_name:'E. TAN', office:'TOWNSVILLE', subclass:'491',
    letter_date:'2026-08-18', days_allowed:14, due_date_legal:'2026-09-02',
    due_date_internal:'2026-08-31',
    // ⚠️ 14 days, not 28. The spec is explicit that the number is parsed, never
    // assumed — this row exists so the UI is never built against a hardcoded 28.
    deadline_sentence:'You have 14 days starting on the day after we emailed this request.',
    needs_review:true },
]

export const DEMO_VIEWERS: Record<string, Viewer> = {
  director:   { role:'director', office:null,         clientCode:null,            displayName:'Robinder — Director' },
  brisbane:   { role:'manager',  office:'BRISBANE',   clientCode:null,            displayName:'Branch manager — Brisbane' },
  townsville: { role:'manager',  office:'TOWNSVILLE', clientCode:null,            displayName:'Branch manager — Townsville' },
  client:     { role:'client',   office:null,         clientCode:'YM-2026-00001', displayName:'Client portal — A. NGUYEN' },
}

export const DEMO_ENQUIRIES: Enquiry[] = [
  { id:1, enquiry_date:'2026-08-19', name:'Priya R.', phone:'0400 111 222', email:'priya@example.com',
    channel:'Facebook', visa_interest:'500', office:'BRISBANE', assigned_to:'Rey',
    status:'New', follow_up_due:'2026-08-26', last_contact:null },
  { id:2, enquiry_date:'2026-08-18', name:'Chen W.', phone:'0400 333 444', email:'chen@example.com',
    channel:'Website', visa_interest:'485', office:'BRISBANE', assigned_to:'RJ',
    status:'Contacted', follow_up_due:'2026-08-25', last_contact:'2026-08-19' },
  { id:3, enquiry_date:'2026-08-16', name:'Amara O.', phone:'0400 555 666', email:null,
    channel:'WhatsApp', visa_interest:'482', office:'TOWNSVILLE', assigned_to:'Star',
    status:'New', follow_up_due:'2026-08-23', last_contact:null },
  // a number and no name — any view that drops these under-reports the pipeline
  { id:4, enquiry_date:'2026-08-15', name:null, phone:'0400 777 888', email:null,
    channel:'Phone', visa_interest:null, office:'BRISBANE', assigned_to:null,
    status:'New', follow_up_due:'2026-08-22', last_contact:null },
  { id:5, enquiry_date:'2026-08-11', name:'Sofia M.', phone:'0400 999 000', email:'sofia@example.com',
    channel:'Referral', visa_interest:'189', office:'BRISBANE', assigned_to:'Priyanka',
    status:'Pending Decision', follow_up_due:'2026-08-18', last_contact:'2026-08-12' },
  { id:6, enquiry_date:'2026-07-17', name:'Ken T.', phone:'0401 222 333', email:'ken@example.com',
    channel:'Instagram', visa_interest:'600', office:'TOWNSVILLE', assigned_to:'Cristelle',
    status:'Not Proceeding', follow_up_due:null, last_contact:'2026-07-21' },
]
