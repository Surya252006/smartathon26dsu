import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Landmark, 
  FileText, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Phone, 
  Calendar,
  HelpCircle,
  ExternalLink,
  Printer
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

// Sample verified applications in system
const SAMPLE_APPLICATIONS = {
  'TNEV-2026-849204': {
    refId: 'TNEV-2026-849204',
    studentName: 'Priya Murugesan',
    community: 'BC (Backward Class)',
    course: 'B.E. Computer Science (2nd Year)',
    college: 'Government College of Technology, Coimbatore',
    schemes: [
      { name: 'Moovalur Ramamirtham Pudhumai Penn Scheme', amount: '₹1,000 / month (₹12,000 / yr)', type: 'DBT Cash' },
      { name: 'First Graduate Tuition Fee Concession', amount: '₹25,000 / year', type: 'Direct College Fee Waiver' }
    ],
    totalAnnualAid: 37000,
    currentStep: 4, // 1 to 5
    dbtStatus: 'disbursed',
    bankAccount: 'State Bank of India (A/c ending in •••• 4912 - Aadhaar Seeded)',
    utrNumber: 'TNGOV202609010482914',
    steps: [
      {
        stepNumber: 1,
        title: 'Application Submitted Online',
        titleTa: 'விண்ணப்பம் இணையவழியில் சமர்ப்பிக்கப்பட்டது',
        authority: 'TN e-Vidya Citizen Portal',
        date: '10 July 2026, 11:30 AM',
        status: 'completed',
        remarks: 'All 6 e-Sevai certificate codes submitted and digitally validated.'
      },
      {
        stepNumber: 2,
        title: 'Tahsildar e-District Certificate Verification',
        titleTa: 'வட்டாட்சியர் சான்றிதழ் சரிபார்ப்பு',
        authority: 'Revenue Department, Pudukkottai Taluk',
        date: '18 July 2026, 04:15 PM',
        status: 'completed',
        remarks: 'Income (REV-INC-01) and Community (REV-COM-02) certificates verified as authentic.'
      },
      {
        stepNumber: 3,
        title: 'College Nodal Officer Bonafide Verification',
        titleTa: 'கல்லூரி அலுவலர் வருகை & சேர்க்கை ஒப்புதல்',
        authority: 'Dean of Student Affairs, GCT Coimbatore',
        date: '02 August 2026, 02:40 PM',
        status: 'completed',
        remarks: 'Confirmed 85% attendance, 1st Graduate eligibility, and 7.5% Govt School quota.'
      },
      {
        stepNumber: 4,
        title: 'Directorate of Collegiate Education (DCE) Sanction',
        titleTa: 'உயர்கல்வித் துறை நிதி ஒதுக்கீடு அனுமதி',
        authority: 'Higher Education Dept, Govt of Tamil Nadu',
        date: '25 August 2026, 10:05 AM',
        status: 'completed',
        remarks: 'Sanction Order G.O. (Ms) No. 47/2026 signed. Allocation code: DCE-TN-SCH-08492.'
      },
      {
        stepNumber: 5,
        title: 'Treasury Direct Benefit Transfer (DBT) Credit',
        titleTa: 'வங்கி கணக்கில் நேரடி உதவித்தொகை வரவு (DBT)',
        authority: 'Public Financial Management System (PFMS) / NPCI',
        date: '01 September 2026, 06:15 PM',
        status: 'completed',
        remarks: 'Monthly stipend of ₹1,000 successfully credited. Next payment scheduled: 01 Oct 2026.'
      }
    ]
  },
  'TNEV-2026-102941': {
    refId: 'TNEV-2026-102941',
    studentName: 'Karthikeyan R',
    community: 'OC (Open Competition)',
    course: 'M.B.B.S. (1st Year)',
    college: 'Madras Medical College, Chennai',
    schemes: [
      { name: 'PM-USP Central Sector Scheme of Scholarship (CSSS)', amount: '₹12,000 / year', type: 'NSP Merit DBT' }
    ],
    totalAnnualAid: 12000,
    currentStep: 3,
    dbtStatus: 'processing',
    bankAccount: 'Indian Overseas Bank (A/c ending in •••• 8201)',
    utrNumber: 'Pending College Verification',
    steps: [
      {
        stepNumber: 1,
        title: 'Application Submitted Online',
        titleTa: 'விண்ணப்பம் இணையவழியில் சமர்ப்பிக்கப்பட்டது',
        authority: 'TN e-Vidya Citizen Portal',
        date: '15 August 2026, 09:10 AM',
        status: 'completed',
        remarks: 'Board marks (94.2%) and National Scholarship Portal (NSP) link verified.'
      },
      {
        stepNumber: 2,
        title: 'Tahsildar e-District Certificate Verification',
        titleTa: 'வட்டாட்சியர் சான்றிதழ் சரிபார்ப்பு',
        authority: 'Tahsildar Office, Egmore Chennai',
        date: '22 August 2026, 03:30 PM',
        status: 'completed',
        remarks: 'Income threshold certificate verified under ₹4.5 Lakh limit.'
      },
      {
        stepNumber: 3,
        title: 'College Nodal Officer Bonafide Verification',
        titleTa: 'கல்லூரி அலுவலர் வருகை & சேர்க்கை ஒப்புதல்',
        authority: 'MMC Chennai Academic Cell',
        date: 'Pending Inspection',
        status: 'in_progress',
        remarks: 'Awaiting college bonafide endorsement from Institutional Nodal Officer (INO).'
      },
      {
        stepNumber: 4,
        title: 'Directorate of Collegiate Education (DCE) Sanction',
        titleTa: 'உயர்கல்வித் துறை நிதி ஒதுக்கீடு அனுமதி',
        authority: 'Higher Education Dept, Govt of Tamil Nadu',
        date: 'Scheduled after Step 3',
        status: 'upcoming',
        remarks: 'Will be initiated once college bonafide is endorsed.'
      },
      {
        stepNumber: 5,
        title: 'Treasury Direct Benefit Transfer (DBT) Credit',
        titleTa: 'வங்கி கணக்கில் நேரடி உதவித்தொகை வரவு (DBT)',
        authority: 'Public Financial Management System (PFMS) / NPCI',
        date: 'Pending Final Sanction',
        status: 'upcoming',
        remarks: 'Funds will be transferred directly via Aadhaar-linked bank account.'
      }
    ]
  }
};

export default function ApplicationTracker({ 
  currentUser, 
  currentProfile, 
  currentLang = 'en', 
  onBackToHome,
  onOpenGrievance
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  // Default search query to active user or sample
  const defaultQuery = currentUser?.user_id 
    ? `TNEV-2026-${currentUser.user_id.slice(-6).toUpperCase()}` 
    : 'TNEV-2026-849204';

  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [activeApplication, setActiveApplication] = useState(SAMPLE_APPLICATIONS['TNEV-2026-849204']);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (SAMPLE_APPLICATIONS[clean]) {
      setActiveApplication(SAMPLE_APPLICATIONS[clean]);
      setNotFound(false);
    } else if (clean.includes('KARTHIK') || clean.endsWith('102941')) {
      setActiveApplication(SAMPLE_APPLICATIONS['TNEV-2026-102941']);
      setNotFound(false);
    } else {
      // Dynamically generate a live tracked application based on current user / query
      const dynamicApp = {
        refId: clean.startsWith('TNEV') ? clean : `TNEV-2026-${clean.slice(-6)}`,
        studentName: currentProfile?.full_name || currentUser?.profile?.full_name || 'Candidate ' + clean.slice(-4),
        community: currentProfile?.community || currentUser?.profile?.community || 'BC',
        course: currentProfile?.current_course || 'Higher Education Degree',
        college: 'Affiliated Institution, Tamil Nadu',
        schemes: [
          { name: 'Tamil Nadu State Welfare Scholarship', amount: '₹12,000 / year', type: 'DBT' }
        ],
        totalAnnualAid: 12000,
        currentStep: 2,
        dbtStatus: 'in_verification',
        bankAccount: 'Aadhaar Seeded Nationalized Bank',
        utrNumber: 'Under Nodal Scrutiny',
        steps: [
          {
            stepNumber: 1,
            title: 'Application Submitted Online',
            titleTa: 'விண்ணப்பம் இணையவழியில் சமர்ப்பிக்கப்பட்டது',
            authority: 'TN e-Vidya Citizen Portal',
            date: '02 September 2026, 10:00 AM',
            status: 'completed',
            remarks: 'Application validated and sent to Revenue Tahsildar desk.'
          },
          {
            stepNumber: 2,
            title: 'Tahsildar e-District Certificate Verification',
            titleTa: 'வட்டாட்சியர் சான்றிதழ் சரிபார்ப்பு',
            authority: 'Taluk Office, Revenue Administration',
            date: 'In Progress (SLA: 48 Hrs)',
            status: 'in_progress',
            remarks: 'Under verification by e-District Nodal Officer.'
          },
          {
            stepNumber: 3,
            title: 'College Nodal Officer Bonafide Verification',
            titleTa: 'கல்லூரி அலுவலர் வருகை & சேர்க்கை ஒப்புதல்',
            authority: 'Institutional Nodal Officer',
            date: 'Scheduled next',
            status: 'upcoming',
            remarks: 'Will verify college enrollment.'
          },
          {
            stepNumber: 4,
            title: 'Directorate of Collegiate Education (DCE) Sanction',
            titleTa: 'உயர்கல்வித் துறை நிதி ஒதுக்கீடு அனுமதி',
            authority: 'Higher Education Dept, Govt of Tamil Nadu',
            date: 'Pending Verification',
            status: 'upcoming',
            remarks: 'Statutory audit allocation.'
          },
          {
            stepNumber: 5,
            title: 'Treasury Direct Benefit Transfer (DBT) Credit',
            titleTa: 'வங்கி கணக்கில் நேரடி உதவித்தொகை வரவு (DBT)',
            authority: 'PFMS / Treasury Electronic Transfer',
            date: 'Pending Sanction',
            status: 'upcoming',
            remarks: 'Direct electronic credit to bank account.'
          }
        ]
      };
      setActiveApplication(dynamicApp);
      setNotFound(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Navigation & Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
              <Landmark size={14} />
              <span>TN e-Vidya • Statutory Application & DBT Tracking Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentLang === 'ta' ? 'உதவித்தொகை விண்ணப்ப நிலை கண்காணிப்பு' : 'Scholarship Application & DBT Tracker'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'ta'
                ? 'உங்கள் விண்ணப்ப எண் (Ack Ref No), ஆதார் அல்லது மொபைல் எண்ணை உள்ளிட்டு வட்டாட்சியர் சரிபார்ப்பு மற்றும் வங்கி நேரடி பரிமாற்ற (DBT) நிலையை உடனுக்குடன் கண்காணிக்கவும்.'
                : 'Enter your Acknowledgement Reference Number (Ack No) to track real-time verification milestones across Tahsildar e-District, College Bonafide Nodal Officer, and Treasury DBT disbursements.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer border border-white/10"
            >
              ← Back to Portal Home
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Widget */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Application Ref No (e.g. TNEV-2026-849204 or TNEV-2026-102941)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e] font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Search size={15} />
            <span>{currentLang === 'ta' ? 'நிலையை சரிபார்க்க' : 'Track Status'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Quick Test Acknowledgement IDs:</span>
          <button 
            type="button" 
            onClick={() => { setSearchQuery('TNEV-2026-849204'); setActiveApplication(SAMPLE_APPLICATIONS['TNEV-2026-849204']); }}
            className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-mono hover:bg-emerald-100 transition cursor-pointer"
          >
            TNEV-2026-849204 (Priya - DBT Disbursed)
          </button>
          <button 
            type="button" 
            onClick={() => { setSearchQuery('TNEV-2026-102941'); setActiveApplication(SAMPLE_APPLICATIONS['TNEV-2026-102941']); }}
            className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200 font-mono hover:bg-blue-100 transition cursor-pointer"
          >
            TNEV-2026-102941 (Karthik - In Progress)
          </button>
        </div>
      </div>

      {/* Active Application Record Card */}
      {activeApplication && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Header Strip */}
          <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono font-bold uppercase">
                <span>Application Reference: {activeApplication.refId}</span>
              </div>
              <h2 className="text-xl font-bold mt-0.5">
                {activeApplication.studentName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeApplication.course} • {activeApplication.college}
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Statutory Entitlement Amount
              </span>
              <strong className="text-xl font-mono text-emerald-400">
                ₹{activeApplication.totalAnnualAid.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-300">/ yr</span>
              </strong>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border mt-1 ${
                activeApplication.dbtStatus === 'disbursed' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {activeApplication.dbtStatus === 'disbursed' ? '● DBT ELECTRONICALLY CREDITED' : '● UNDER NODAL VERIFICATION'}
              </span>
            </div>
          </div>

          {/* Bank & Payment Information Strip */}
          <div className="bg-emerald-50/60 border-b border-emerald-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Bank Account Seeded:</span>
              <strong className="text-slate-900 font-semibold">{activeApplication.bankAccount}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Treasury UTR / Transaction No:</span>
              <strong className="text-slate-900 font-mono">{activeApplication.utrNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Approved Welfare Schemes:</span>
              <strong className="text-[#006a4e]">{activeApplication.schemes.map(s => s.name).join(', ')}</strong>
            </div>
          </div>

          {/* Visual Milestone Stepper */}
          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center space-x-2">
              <ShieldCheck size={16} className="text-[#006a4e]" />
              <span>Official 5-Tier Verification & Disbursement Lifecycle</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {activeApplication.steps.map((step, idx) => {
                const isDone = step.status === 'completed';
                const isCurrent = step.status === 'in_progress';

                return (
                  <div key={idx} className="relative group">
                    {/* Node Dot Icon */}
                    <div className={`absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border-2 transition ${
                      isDone 
                        ? 'bg-[#006a4e] border-[#006a4e] text-white shadow-xs' 
                        : isCurrent 
                          ? 'bg-amber-500 border-amber-500 text-white animate-pulse' 
                          : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 size={14} />
                      ) : isCurrent ? (
                        <Clock size={14} />
                      ) : (
                        <span className="text-[10px] font-bold">{step.stepNumber}</span>
                      )}
                    </div>

                    {/* Step Card Details */}
                    <div className={`p-4 rounded-xl border transition ${
                      isDone 
                        ? 'bg-white border-slate-200 shadow-xs' 
                        : isCurrent 
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs' 
                          : 'bg-slate-50/60 border-slate-200 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            isDone ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isCurrent ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}>
                            Stage {step.stepNumber} • {isDone ? 'Approved' : isCurrent ? 'In Progress' : 'Upcoming'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {currentLang === 'ta' && step.titleTa ? step.titleTa : step.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center">
                          <Calendar size={11} className="mr-1 text-slate-400" />
                          {step.date}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 mt-2 pt-2 border-t border-slate-100">
                        <span><strong>Competent Authority:</strong> {step.authority}</span>
                        <span className="text-slate-500 italic">{step.remarks}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Strip */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <HelpCircle size={15} className="text-slate-400" />
                <span>Need assistance with delayed verification? Call toll-free student helpline: <strong>14417</strong></span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {onOpenGrievance && (
                  <button
                    type="button"
                    onClick={onOpenGrievance}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition cursor-pointer border border-slate-300 flex items-center justify-center space-x-1.5"
                  >
                    <span>Raise Grievance Ticket</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print Acknowledgement</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
