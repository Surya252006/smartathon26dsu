import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Mic, 
  Building2, 
  FileText, 
  ShieldCheck, 
  GraduationCap, 
  Landmark, 
  HelpCircle,
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import VoiceAssistModal from './VoiceAssistModal';
import { TRANSLATIONS } from '../utils/translations';

export default function ProfileForm({ onSubmit, currentLang = 'en' }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [step, setStep] = useState(0);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  
  const STEPS = [
    { title: currentLang === 'ta' ? 'கல்வித் தகுதி' : 'Academic Credentials', sub: 'Course & Schooling' },
    { title: currentLang === 'ta' ? 'சமூகம் & வருவாய்' : 'Demographics & Income', sub: 'Category & Ceiling' },
    { title: currentLang === 'ta' ? 'இ-சேவை ஆவணங்கள்' : 'e-Sevai Certificates', sub: 'Document Readiness' }
  ];

  const [formData, setFormData] = useState({
    full_name: "Priya Murugesan",
    schooling_type: "tn_govt_school_6_to_12",
    admission_mode: "govt_counseling_single_window",
    current_course: "Engineering",
    board_percentage: "88.5",
    gender: "female",
    community: "BC",
    annual_income: "120000",
    is_first_graduate: true,
    is_differently_abled: false,
    disability_percentage: "",
    available_docs: [
      'income_certificate', 
      'community_certificate', 
      'first_graduate_certificate', 
      'bonafide_certificate', 
      'marksheet', 
      'aadhaar_bank'
    ]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDocToggle = (docId) => {
    setFormData(prev => {
      const docs = prev.available_docs.includes(docId)
        ? prev.available_docs.filter(d => d !== docId)
        : [...prev.available_docs, docId];
      return { ...prev, available_docs: docs };
    });
  };

  const applyVoiceData = (parsedData) => {
    setFormData(prev => ({ ...prev, ...parsedData }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 2));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      annual_income: Number(formData.annual_income) || 0,
      board_percentage: Number(formData.board_percentage) || 0,
      disability_percentage: formData.is_differently_abled ? (Number(formData.disability_percentage) || 0) : null
    };
    onSubmit(payload);
  };

  const documentOptions = [
    { 
      id: 'income_certificate', 
      code: 'REV-INC-01',
      label: currentLang === 'ta' ? 'வருமானச் சான்றிதழ் (வட்டாட்சியர் அலுவலகம் / இ-சேவை)' : 'Income Certificate (Revenue Dept / Tahsildar e-Sevai)',
      detail: currentLang === 'ta' ? 'கடந்த 6 மாதங்களுக்குள் பெறப்பட்ட அதிகாரப்பூர்வ சான்றிதழ்.' : 'Issued within 6 months via TNeGA / e-District.'
    },
    { 
      id: 'community_certificate', 
      code: 'REV-COM-02',
      label: currentLang === 'ta' ? 'நிரந்தர சாதிச் சான்றிதழ் (வட்டாட்சியர் கையொப்பமிட்டது)' : 'Permanent Community Certificate (Digitally Signed)',
      detail: currentLang === 'ta' ? 'டிஜிட்டல் கையொப்பம் மற்றும் QR குறியீடு உள்ள சான்றிதழ்.' : 'Barcoded card with Tahsildar seal.'
    },
    { 
      id: 'first_graduate_certificate', 
      code: 'DCE-FG-03',
      label: currentLang === 'ta' ? 'முதல் பட்டதாரி சான்றிதழ் & குடும்ப உறுதிமொழி' : 'First Graduate Certificate & Family Undertaking',
      detail: currentLang === 'ta' ? 'குடும்பத்தில் யாருக்கும் பட்டப்படிப்பு இல்லை என்பதற்கான ஆவணம்.' : 'Mandatory for 100% tuition waiver in TNEA.'
    },
    { 
      id: 'bonafide_certificate', 
      code: 'SED-BON-04',
      label: currentLang === 'ta' ? '6-12 அரசுப் பள்ளி பயின்றதற்கான போனாஃபைட் சான்றிதழ்' : '6th-12th TN Govt School UDISE Bonafide Certificate',
      detail: currentLang === 'ta' ? 'தலைமை ஆசிரியர் மற்றும் DEO சான்றொப்பம் அவசியம்.' : 'Prerequisite for Pudhumai Penn / Tamil Pudhalvan / 7.5% quota.'
    },
    { 
      id: 'marksheet', 
      code: 'DGE-MRK-05',
      label: currentLang === 'ta' ? '10 & 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்' : '10th & 12th Board Examination Marksheets',
      detail: currentLang === 'ta' ? 'அரசு தேர்வு இயக்ககம் (DGE) வழங்கிய சான்றிதழ்.' : 'Used for merit-cum-means quota percentiles.'
    },
    { 
      id: 'aadhaar_bank', 
      code: 'NPCI-DBT-06',
      label: currentLang === 'ta' ? 'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு பாஸ்புக் (DBT Active)' : 'Aadhaar Seeded Active DBT Bank Passbook',
      detail: currentLang === 'ta' ? 'NPCI நேரடி மானியப் பரிமாற்றத்திற்கு அவசியமானது.' : 'Required for direct monthly ₹1,000 credit.'
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      
      {/* 1. Official Government Header Bar */}
      <div className="bg-[#0f2942] text-white p-5 sm:p-6 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
              <Landmark size={14} />
              <span>Government of Tamil Nadu • Higher Education Department</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentLang === 'ta' ? 'மாணவர் நல உரிமை மதிப்பீட்டுப் படிவம்' : 'Student Welfare & Entitlement Assessment Form'}
            </h2>
            <p className="text-slate-300 text-xs font-normal">
              Official intake for 47 State & Central higher education scholarships (September 2026 Reference).
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button 
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="flex items-center bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/20 px-3 py-2 rounded-lg transition text-xs font-medium text-slate-200 cursor-pointer"
              title="Speak your details in Tamil or English"
            >
              <Mic size={14} className="mr-1.5 text-emerald-400" />
              <span>குரல்வழி பதிவு / Voice Input</span>
            </button>
            <div className="hidden md:block text-right border-l border-slate-700 pl-3">
              <span className="text-[10px] text-slate-400 block">Form Identifier:</span>
              <span className="font-mono text-xs text-emerald-400 font-semibold">FORM TN-SSP/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Step-Progress Tracker */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="grid grid-cols-3 gap-3 relative">
          {STEPS.map((stepItem, idx) => {
            const isActive = step === idx;
            const isCompleted = step > idx;

            return (
              <div 
                key={idx} 
                onClick={() => setStep(idx)}
                className={`flex items-center space-x-3 p-2.5 rounded-lg border transition cursor-pointer ${
                  isActive 
                    ? 'bg-white border-[#006a4e] shadow-xs' 
                    : isCompleted 
                    ? 'bg-white/80 border-slate-200 hover:border-slate-300' 
                    : 'bg-transparent border-transparent opacity-60'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isCompleted 
                    ? 'bg-[#006a4e] text-white' 
                    : isActive 
                    ? 'bg-[#0f2942] text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-[#006a4e]' : 'text-slate-800'}`}>
                    {stepItem.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate hidden sm:block">
                    {stepItem.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Academic Credentials & Schooling */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap size={18} className="text-[#006a4e]" />
                <span>Step 1: Academic Profile & School Background</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Schooling type directly determines statutory benefits like Pudhumai Penn (₹12,000) and the 7.5% reservation quota.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name of Student (மாணவர் பெயர் - As per 10th / 12th Certificate) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange} 
                  placeholder="e.g. Priya Murugesan" 
                  required 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition" 
                />
              </div>

              {/* Schooling Type */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Type of School Studied (Classes 6 to 12) <span className="text-red-500">*</span>
                </label>
                <select 
                  name="schooling_type" 
                  value={formData.schooling_type} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition"
                >
                  <option value="tn_govt_school_6_to_12">Tamil Nadu Government School (Classes 6–12 continuously) • தமிழ்நாடு அரசுப் பள்ளி</option>
                  <option value="govt_aided">Government Aided School (Tamil Medium) • அரசு உதவிபெறும் பள்ளி</option>
                  <option value="private_cbse">Private Unaided / Matriculation / CBSE School • தனியார் மெட்ரிக் / சி.பி.எஸ்.இ</option>
                  <option value="other">Other State Board / Open School • இதர வாரியம்</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                  <HelpCircle size={12} className="text-slate-400 shrink-0" />
                  <span>Continuous study from Class 6 to 12 in TN Govt schools unlocks Pudhumai Penn, Tamil Pudhalvan, and 7.5% Quota fee exemptions.</span>
                </p>
              </div>

              {/* Admission Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Higher Education Admission Mode <span className="text-red-500">*</span>
                </label>
                <select 
                  name="admission_mode" 
                  value={formData.admission_mode} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition"
                >
                  <option value="govt_counseling_single_window">TNEA / Single Window Government Counseling (ஒற்றைச் சாளர சேர்க்கை)</option>
                  <option value="7.5_percent_govt_quota">7.5% Govt School Preferential Quota (7.5% சிறப்பு முன்னுரிமை இடஒதுக்கீடு)</option>
                  <option value="management_quota">Management / Direct Institutional Quota (நிர்வாக ஒதுக்கீடு)</option>
                </select>
              </div>

              {/* Current Course */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Enrolled Degree / Course Stream <span className="text-red-500">*</span>
                </label>
                <select 
                  name="current_course" 
                  value={formData.current_course} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition"
                >
                  <option value="Engineering">B.E. / B.Tech (Engineering & Technology)</option>
                  <option value="Arts & Science">B.Sc / B.A. / B.Com / BBA (Arts & Science)</option>
                  <option value="Medical">MBBS / BDS / Paramedical / Nursing</option>
                  <option value="Diploma">Polytechnic / 3-Year Engineering Diploma</option>
                </select>
              </div>

              {/* 12th Board Marks */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  12th Board Examination Aggregate Percentage (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="board_percentage" 
                    value={formData.board_percentage} 
                    onChange={handleChange} 
                    placeholder="e.g. 88.5" 
                    required 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition font-mono" 
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Required for competitive Central Sector merit cutoffs (PM-USP CSSS requires 80th percentile; AICTE Pragati requires 85%+).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Demographics, Community & Income */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck size={18} className="text-[#006a4e]" />
                <span>Step 2: Social Category & Family Income</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory quotas and fee waivers operate under strict Government Order (G.O.) income thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Gender (பாலினம்) <span className="text-red-500">*</span>
                </label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition"
                >
                  <option value="female">Female (பெண்) — Eligible for Pudhumai Penn & AICTE Pragati</option>
                  <option value="male">Male (ஆண்) — Eligible for Tamil Pudhalvan</option>
                  <option value="transgender">Transgender (திருநங்கை / திருநம்பி)</option>
                </select>
              </div>

              {/* Community Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Community Category (இடஒதுக்கீட்டுப் பிரிவு) <span className="text-red-500">*</span>
                </label>
                <select 
                  name="community" 
                  value={formData.community} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition"
                >
                  <option value="BC">BC - Backward Classes (பிற்படுத்தப்பட்டோர்)</option>
                  <option value="MBC">MBC / DNC - Most Backward Classes / Denotified (மிகவும் பிற்படுத்தப்பட்டோர்)</option>
                  <option value="SC">SC - Scheduled Caste (ஆதிதிராவிடர்)</option>
                  <option value="ST">ST - Scheduled Tribe (பழங்குடியினர்)</option>
                  <option value="SCC">SCC - Converted Christian from SC (கிறிஸ்தவ ஆதிதிராவிடர்)</option>
                  <option value="OC">OC - Open Category / General (பொதுப் பிரிவு)</option>
                </select>
              </div>

              {/* Annual Income */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Annual Family Income (ஆண்டு குடும்ப வருமானம் - Revenue Certificate) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm text-slate-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    name="annual_income" 
                    value={formData.annual_income} 
                    onChange={handleChange} 
                    placeholder="120000" 
                    required 
                    min="0" 
                    step="1000" 
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-4 py-2.5 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none transition font-mono" 
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1.5">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PMS SC/ST Ceiling: ≤ ₹2,50,000</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">BC/MBC Ceiling: ≤ ₹2,50,000</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">CSSS Ceiling: ≤ ₹4,50,000</span>
                </div>
              </div>

              {/* First Graduate Toggle Box */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_first_graduate" 
                    checked={formData.is_first_graduate} 
                    onChange={handleChange} 
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]" 
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      First Graduate in Family (குடும்பத்தில் முதல் தலைமுறை பட்டதாரி)
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 leading-relaxed">
                      Check this if neither of your parents nor any elder sibling has obtained a university degree. Unlocks 100% tuition concession (up to ₹25,000/yr) with <strong>no parental income ceiling</strong>.
                    </span>
                  </div>
                </label>
              </div>

              {/* Differently Abled Status Box */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_differently_abled" 
                    checked={formData.is_differently_abled} 
                    onChange={handleChange} 
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#006a4e] focus:ring-[#006a4e]" 
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Person with Benchmark Disability (PwD / மாற்றுத்திறனாளி)
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      Possesses a disability certificate or Unique Disability ID (UDID) issued by the Medical Board.
                    </span>
                  </div>
                </label>

                {formData.is_differently_abled && (
                  <div className="pl-7 pt-2 border-t border-slate-200/80">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Disability Percentage (% - as stated in UDID / Medical Certificate)
                    </label>
                    <input 
                      type="number" 
                      name="disability_percentage" 
                      value={formData.disability_percentage} 
                      onChange={handleChange} 
                      placeholder="e.g. 45" 
                      min="40" 
                      max="100" 
                      className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] outline-none font-mono" 
                    />
                    <span className="text-[11px] text-slate-500 block mt-1">Minimum 40% benchmark disability required for AICTE Saksham and State PwD welfare.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Document Readiness & Verification */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck2 size={18} className="text-[#006a4e]" />
                <span>Step 3: Tahsildar & e-Sevai Document Checklist</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our engine uses your document readiness score to determine whether your payout is 100% statutory or requires pending certificates.
              </p>
            </div>

            <div className="space-y-2.5">
              {documentOptions.map((doc) => {
                const isSelected = formData.available_docs.includes(doc.id);

                return (
                  <div 
                    key={doc.id}
                    onClick={() => handleDocToggle(doc.id)}
                    className={`p-3.5 rounded-lg border transition cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'bg-emerald-50/50 border-[#006a4e]' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 border shrink-0 transition ${
                        isSelected 
                          ? 'bg-[#006a4e] border-[#006a4e] text-white' 
                          : 'bg-white border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {doc.label}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {doc.detail}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-100 rounded shrink-0 hidden sm:inline-block">
                      {doc.code}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Document Readiness Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                <ShieldCheck size={16} className="text-[#006a4e]" />
                <span>Document Readiness Score:</span>
                <strong className="text-slate-900">{formData.available_docs.length} of {documentOptions.length} Certificates Verified</strong>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                formData.available_docs.length >= 4 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {formData.available_docs.length >= 4 ? 'e-Sevai Ready' : 'Pending Certificates'}
              </span>
            </div>
          </div>
        )}

        {/* 4. Action Buttons Footer */}
        <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-5 py-2.5 rounded-lg bg-[#0f2942] hover:bg-[#1a3d5f] active:scale-[0.98] text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-6 py-2.5 rounded-lg bg-[#006a4e] hover:bg-[#00523d] active:scale-[0.98] text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <span>மதிப்பீட்டைத் தொடங்குக • Run MWIS Policy Solver →</span>
            </button>
          )}
        </div>

      </form>

      {/* Voice Assistant Modal */}
      <VoiceAssistModal
        isOpen={isVoiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onDataExtracted={applyVoiceData}
      />

    </div>
  );
}
