import React, { useState, useEffect } from 'react';
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
  Sparkles,
  User,
  CheckCircle2,
  RefreshCw,
  Edit3,
  MapPin,
  IndianRupee,
  Award,
  ArrowRight
} from 'lucide-react';
import VoiceAssistModal from './VoiceAssistModal';
import { TRANSLATIONS } from '../utils/translations';

const extractFormData = (user, profile) => {
  // 0. Check localStorage tn_student_profile edited by student
  try {
    const savedProfile = localStorage.getItem('tn_student_profile');
    if (savedProfile) {
      const sp = JSON.parse(savedProfile);
      if (sp.fullName) {
        return {
          full_name: sp.fullName,
          age: sp.age ? String(sp.age) : '18',
          gender: sp.gender || 'male',
          community: sp.community || 'BC',
          state: 'Tamil Nadu',
          district: sp.district || 'Pudukkottai',
          residence_type: sp.residence_type || 'Rural',

          degree: sp.degree || 'Undergraduate (UG)',
          current_course: (sp.currentCourse && sp.currentCourse.includes('Engineering')) ? 'Engineering' : (sp.currentCourse || 'Engineering'),
          college_name: sp.college_name || 'Anna University Affiliated Engineering College',
          college_type: sp.college_type || 'Government Aided',
          year_of_study: sp.year_of_study || '1st Year (Fresher)',
          board_percentage: sp.boardPercentage ? String(sp.boardPercentage) : '88.5',
          admission_mode: 'govt_counseling_single_window',

          annual_income: sp.annualIncome ? String(sp.annualIncome) : '140000',
          has_income_certificate: 'yes',
          is_first_graduate: sp.isFirstGraduate !== undefined ? sp.isFirstGraduate : true,
          siblings_in_college: 'None',

          schooling_type: sp.schoolingType || 'tn_govt_school_6_to_12',
          is_differently_abled: false,
          disability_percentage: '',
          special_category: '7.5% Govt School Quota',
          available_docs: [
            'income_certificate', 
            'community_certificate', 
            'first_graduate_certificate', 
            'bonafide_certificate', 
            'marksheet', 
            'aadhaar_bank'
          ]
        };
      }
    }
  } catch (e) {}

  // 1. If profile was already evaluated in current session
  if (profile && (profile.full_name || profile.community)) {
    return {
      full_name: profile.full_name || '',
      age: profile.age ? String(profile.age) : '18',
      gender: profile.gender || 'female',
      community: profile.community || 'BC',
      state: profile.state || 'Tamil Nadu',
      district: profile.district || 'Chennai',
      residence_type: profile.residence_type || 'Urban',

      degree: profile.degree || 'Undergraduate (UG)',
      current_course: profile.current_course || 'Engineering',
      college_name: profile.college_name || '',
      college_type: profile.college_type || 'Government',
      year_of_study: profile.year_of_study || '1st Year (Fresher)',
      board_percentage: profile.board_percentage ? String(profile.board_percentage) : '',
      admission_mode: profile.admission_mode || 'govt_counseling_single_window',

      annual_income: profile.annual_income ? String(profile.annual_income) : '',
      has_income_certificate: 'yes',
      is_first_graduate: profile.is_first_graduate !== undefined ? profile.is_first_graduate : true,
      siblings_in_college: 'None',

      schooling_type: profile.schooling_type || 'tn_govt_school_6_to_12',
      is_differently_abled: Boolean(profile.is_differently_abled),
      disability_percentage: profile.disability_percentage ? String(profile.disability_percentage) : '',
      special_category: profile.special_category || 'None',
      available_docs: profile.available_docs || [
        'income_certificate', 
        'community_certificate', 
        'first_graduate_certificate', 
        'bonafide_certificate', 
        'marksheet', 
        'aadhaar_bank'
      ]
    };
  }

  // 2. Default clean student profile
  return {
    full_name: 'Surya Suresh',
    age: '18',
    gender: 'male',
    community: 'BC',
    state: 'Tamil Nadu',
    district: 'Pudukkottai',
    residence_type: 'Rural',

    degree: 'Undergraduate (UG)',
    current_course: 'Engineering',
    college_name: 'Govt College of Technology / Engineering',
    college_type: 'Government',
    year_of_study: '1st Year (Fresher)',
    board_percentage: '88.5',
    admission_mode: 'govt_counseling_single_window',

    annual_income: '140000',
    has_income_certificate: 'yes',
    is_first_graduate: true,
    siblings_in_college: 'None',

    schooling_type: 'tn_govt_school_6_to_12',
    is_differently_abled: false,
    disability_percentage: '',
    special_category: '7.5% Govt School Quota',
    available_docs: [
      'income_certificate', 
      'community_certificate', 
      'first_graduate_certificate', 
      'bonafide_certificate', 
      'marksheet', 
      'aadhaar_bank'
    ]
  };
};

export default function ProfileForm({ 
  onSubmit, 
  currentLang = 'en',
  currentUser = null,
  currentProfile = null,
  onOpenAuth = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [step, setStep] = useState(0); // 0 to 4 (5 Steps)
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  
  const STEPS = [
    { title: 'Personal Details', title_ta: 'தனிநபர் விவரங்கள்', sub: 'Name, Gender, Community' },
    { title: 'Academic Details', title_ta: 'கல்வி விவரங்கள்', sub: 'Course, College, Board Marks' },
    { title: 'Family & Income', title_ta: 'வருவாய் & முதல் பட்டதாரி', sub: 'Income & First Graduate' },
    { title: 'Special Eligibility', title_ta: 'சிறப்பு தகுதிகள்', sub: 'Govt School & Quotas' },
    { title: 'Profile Review', title_ta: 'விவரங்கள் சரிபார்த்தல்', sub: 'Review & Verify' }
  ];

  const [formData, setFormData] = useState(() => extractFormData(currentUser, currentProfile));

  useEffect(() => {
    setFormData(extractFormData(currentUser, currentProfile));
  }, [currentUser, currentProfile]);

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

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
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
      code: 'UIDAI-NPCI',
      label: currentLang === 'ta' ? 'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு (DBT Seeding)' : 'Aadhaar NPCI Active Bank Account (DBT)',
      detail: currentLang === 'ta' ? 'மாதாந்திர உதவித்தொகை நேரடியாக வங்கியில் வரவு வைக்கப்படும்.' : 'Necessary for direct monthly DBT disbursements.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-[#0f2942] text-white p-6 sm:p-7 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={14} />
              <span>Multi-Step Intelligent Onboarding Wizard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentLang === 'ta' ? 'மாணவர் தகுதி மதிப்பீட்டு படிவம்' : 'Candidate Scholarship Profile Assessment'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Enter your student profile once. Our MWIS optimization engine checks 18+ statutory rules, detects collisions, and identifies your maximum benefit.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs border border-emerald-500"
              title="Speak naturally in Tamil or English to fill this form"
            >
              <Mic size={14} className="animate-pulse text-amber-300" />
              <span>குரல் வழி உள்ளீடு / Voice Assist</span>
            </button>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-5 gap-2 text-center text-xs">
          {STEPS.map((s, idx) => {
            const isDone = step > idx;
            const isCurrent = step === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setStep(idx)}
                className={`flex flex-col items-center group cursor-pointer transition ${
                  isCurrent ? 'text-white' : (isDone ? 'text-emerald-300' : 'text-slate-500 hover:text-slate-300')
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                  isCurrent 
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/30' 
                    : (isDone ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400')
                }`}>
                  {isDone ? <Check size={14} className="stroke-[3]" /> : idx + 1}
                </div>
                <span className="font-semibold text-[11px] truncate w-full hidden sm:block">
                  {currentLang === 'ta' ? s.title_ta : s.title}
                </span>
                <span className="text-[9px] text-slate-400 truncate w-full hidden md:block">
                  Step {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* ========================================================= */}
        {/* STEP 1: Personal Details                                  */}
        {/* ========================================================= */}
        {step === 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User size={18} className="text-emerald-700" />
                <span>Step 1: Personal Demographics & Social Category</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Basic candidate details to check gender-based stipends and community reservations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Full Name (as per 10th / 12th Certificate) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Surya Suresh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Candidate Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  min="15"
                  max="35"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="18"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male (ஆண் - Eligible for Tamil Pudhalvan)</option>
                  <option value="female">Female (பெண் - Eligible for Pudhumai Penn / Pragati)</option>
                  <option value="transgender">Transgender (திருநங்கை / திருநம்பி)</option>
                </select>
              </div>

              {/* Community Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Community Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BC">BC — Backward Class (பிற்படுத்தப்பட்டோர்)</option>
                  <option value="BCM">BCM — Backward Class Muslim</option>
                  <option value="MBC">MBC / DNC — Most Backward Class / சீர்மரபினர்</option>
                  <option value="SC">SC — Scheduled Caste (ஆதிதிராவிடர்)</option>
                  <option value="SCA">SCA — Scheduled Caste Arunthathiyar</option>
                  <option value="ST">ST — Scheduled Tribe (பழங்குடியினர்)</option>
                  <option value="OC">OC — Open Competition / General</option>
                </select>
              </div>

              {/* Home District */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Home District (Tamil Nadu) <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Salem">Salem</option>
                  <option value="Pudukkottai">Pudukkottai</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Vellore">Vellore</option>
                  <option value="Erode">Erode</option>
                  <option value="Dindigul">Dindigul</option>
                  <option value="Kanchipuram">Kanchipuram</option>
                  <option value="Other TN District">Other Tamil Nadu District</option>
                </select>
              </div>

              {/* Residence Information */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Residence Area
                </label>
                <select
                  name="residence_type"
                  value={formData.residence_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rural">Rural Village Panchayat (கிராமப்புறம்)</option>
                  <option value="Urban">Urban City / Municipal Corporation (நகர்ப்புறம்)</option>
                  <option value="Semi-Urban">Semi-Urban / Town Panchayat</option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: Academic Details                                  */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap size={18} className="text-emerald-700" />
                <span>Step 2: Academic Program & Board Performance</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Degree course, institution type, and 12th board marks for merit-cum-means thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Degree Level */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Degree Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Undergraduate (UG)">Undergraduate (UG / B.E / B.Tech / B.Sc / B.A / MBBS)</option>
                  <option value="Postgraduate (PG)">Postgraduate (PG / M.E / M.Sc / MBA / MCA)</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic (3 Years)</option>
                </select>
              </div>

              {/* Course Discipline */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Course Discipline <span className="text-red-500">*</span>
                </label>
                <select
                  name="current_course"
                  value={formData.current_course}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Engineering">Engineering & Technology (B.E / B.Tech)</option>
                  <option value="Arts & Science">Arts & Science (B.Sc, B.Com, B.A)</option>
                  <option value="Medical">Medical / Dental / Paramedical (MBBS, BDS, B.Pharm)</option>
                  <option value="Law">Law (LLB / BA LLB)</option>
                  <option value="Diploma">Polytechnic / Technical Diploma</option>
                </select>
              </div>

              {/* Institution / College Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="e.g. Government College of Technology, Coimbatore"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* College Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  College Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="college_type"
                  value={formData.college_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Government">Government Autonomous College</option>
                  <option value="Government Aided">Government Aided Institution</option>
                  <option value="Private Self-Financing">Private Self-Financing (Anna Univ / State Univ Affiliated)</option>
                  <option value="Central Institution">Central Institution (IIT, NIT, Central Univ)</option>
                </select>
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Year of Study <span className="text-red-500">*</span>
                </label>
                <select
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1st Year (Fresher)">1st Year (Fresher / Fresh Sanction)</option>
                  <option value="2nd Year">2nd Year (Renewal)</option>
                  <option value="3rd Year">3rd Year (Renewal)</option>
                  <option value="4th Year">4th Year (Final Year Renewal)</option>
                </select>
              </div>

              {/* 12th Board Score */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Class 12th Board Marks (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    required
                    name="board_percentage"
                    value={formData.board_percentage}
                    onChange={handleChange}
                    placeholder="88.5"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-mono font-bold text-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">NSP CSSS requires &gt;80%; AICTE Pragati requires &gt;85%.</span>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: Family & Income Details                           */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <IndianRupee size={18} className="text-emerald-700" />
                <span>Step 3: Family Annual Income & First Graduate Status</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory economic criteria determined from Revenue Department e-District income certificate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Annual Family Income */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Annual Family Income (in ₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    name="annual_income"
                    required
                    min="0"
                    max="2000000"
                    step="5000"
                    value={formData.annual_income}
                    onChange={handleChange}
                    placeholder="140000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    ₹{Number(formData.annual_income || 0).toLocaleString('en-IN')} / Year
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (BC/MBC limit: ₹2.5L; SC/ST limit: ₹2.5L; Central CSSS: ₹4.5L)
                  </span>
                </div>
              </div>

              {/* Income Certificate Status */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  e-District Income Certificate Availability
                </label>
                <select
                  name="has_income_certificate"
                  value={formData.has_income_certificate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="yes">Yes, active Tahsildar e-Certificate with barcode</option>
                  <option value="in_progress">Applied at e-Sevai / Pending Tahsildar approval</option>
                  <option value="no">Not yet applied</option>
                </select>
              </div>

              {/* First Graduate Toggle */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                      <Award size={14} className="text-emerald-700" />
                      <span>First Graduate in Immediate Family (முதல் பட்டதாரி)?</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl">
                      Under G.O. (Ms) No. 85, candidates whose parents or siblings have not completed any degree program are eligible for a 100% Tuition Fee Concession (₹25,000/yr) through Single Window Counseling.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      name="is_first_graduate"
                      checked={formData.is_first_graduate}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: Special Eligibility & Documents                   */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck size={18} className="text-emerald-700" />
                <span>Step 4: Schooling Background, Quotas & Document Readiness</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Schooling type from Class 6 to 12 unlocks statutory DBT allowances (Pudhumai Penn / Tamil Pudhalvan).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Schooling Background */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Classes 6th to 12th Schooling Background <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition ${
                    formData.schooling_type === 'tn_govt_school_6_to_12'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="schooling_type"
                      value="tn_govt_school_6_to_12"
                      checked={formData.schooling_type === 'tn_govt_school_6_to_12'}
                      onChange={handleChange}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block font-bold">TN Government School (6th to 12th)</span>
                      <span className="text-[11px] text-slate-500 font-normal">Qualifies for ₹1,000/mo DBT (Pudhumai Penn / Tamil Pudhalvan) + 7.5% Govt Quota.</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition ${
                    formData.schooling_type === 'govt_aided'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="schooling_type"
                      value="govt_aided"
                      checked={formData.schooling_type === 'govt_aided'}
                      onChange={handleChange}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block font-bold">Government Aided / Matriculation / CBSE</span>
                      <span className="text-[11px] text-slate-500 font-normal">Eligible for Post-Matric, First Graduate, and NSP CSSS merit scholarships.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Differently Abled Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Differently Abled Benchmark Candidate?</span>
                  <input
                    type="checkbox"
                    name="is_differently_abled"
                    checked={formData.is_differently_abled}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
                {formData.is_differently_abled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Disability Percentage (%)</label>
                    <input
                      type="number"
                      name="disability_percentage"
                      min="40"
                      max="100"
                      value={formData.disability_percentage}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Special Category */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Special Reservation Category</label>
                <select
                  name="special_category"
                  value={formData.special_category}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="None">General Student Category</option>
                  <option value="7.5% Govt School Quota">7.5% Tamil Nadu Govt School Preferential Allotment</option>
                  <option value="Single Parent / Orphan">Children of Single Parent / Orphan</option>
                  <option value="Sports Quota">State / National Level Sports Quota</option>
                </select>
              </div>

              {/* Document Readiness Checklist */}
              <div className="md:col-span-2 pt-2">
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center space-x-1.5">
                  <FileCheck2 size={15} className="text-emerald-700" />
                  <span>Available e-Sevai & Academic Documents (Select all you possess):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {documentOptions.map(doc => {
                    const isChecked = formData.available_docs.includes(doc.id);
                    return (
                      <div 
                        key={doc.id}
                        onClick={() => handleDocToggle(doc.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                          isChecked 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 text-emerald-600 rounded focus:ring-emerald-500 pointer-events-none"
                        />
                        <div className="min-w-0">
                          <span className="block text-[11px] font-bold text-slate-900">{doc.label}</span>
                          <span className="text-[10px] text-slate-500 leading-tight block">{doc.detail}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: Profile Review & Confirmation                     */}
        {/* ========================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-700" />
                <span>Step 5: Review Profile & Run Optimization Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your credentials. Clicking "Find My Scholarships" will execute the MWIS algorithm to calculate your optimal legitimate financial benefit.
              </p>
            </div>

            {/* Structured Summary Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Box 1: Personal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <User size={13} className="text-emerald-700" />
                    <span>Personal Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Edit3 size={10} />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{formData.full_name}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Gender / Age:</span> <span className="text-slate-800 capitalize">{formData.gender} • {formData.age} yrs</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Community:</span> <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 rounded">{formData.community}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">District:</span> <span className="text-slate-800">{formData.district}, TN</span></div>
                </div>
              </div>

              {/* Box 2: Academic */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <GraduationCap size={13} className="text-emerald-700" />
                    <span>Academic Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Edit3 size={10} />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-500">Degree & Course:</span> <strong className="text-slate-900 truncate ml-2">{formData.current_course}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Institution:</span> <span className="text-slate-800 truncate ml-2">{formData.college_type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Year of Study:</span> <span className="text-slate-800">{formData.year_of_study}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">12th Board Score:</span> <strong className="text-emerald-700 font-mono">{formData.board_percentage}%</strong></div>
                </div>
              </div>

              {/* Box 3: Income & Family */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <IndianRupee size={13} className="text-emerald-700" />
                    <span>Family & Income</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Edit3 size={10} />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-500">Family Annual Income:</span> <strong className="text-slate-900 font-mono">₹{Number(formData.annual_income).toLocaleString('en-IN')}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">First Graduate Status:</span> <span className={`font-bold ${formData.is_first_graduate ? 'text-emerald-700' : 'text-slate-600'}`}>{formData.is_first_graduate ? 'Yes (Verified)' : 'No'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Income Certificate:</span> <span className="text-emerald-800 capitalize">{formData.has_income_certificate}</span></div>
                </div>
              </div>

              {/* Box 4: Special Eligibility */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck size={13} className="text-emerald-700" />
                    <span>Special Eligibility</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Edit3 size={10} />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-500">6-12 Schooling:</span> <strong className="text-slate-900">{formData.schooling_type === 'tn_govt_school_6_to_12' ? 'TN Govt School' : 'Aided / Private'}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Special Quota:</span> <span className="text-slate-800">{formData.special_category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">e-Sevai Docs Ready:</span> <span className="font-bold text-emerald-700">{formData.available_docs.length} of {documentOptions.length} Documents</span></div>
                </div>
              </div>

            </div>

            {/* Core Principle Assurance Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-950">
              <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Strict Conflict-Free Optimization Guarantee:</strong>
                <p className="text-emerald-800 text-[11px] leading-relaxed mt-0.5">
                  Our system evaluates all 18+ state and central scholarship schemes, eliminates mutual policy collisions (such as dual state/central tuition claims), and calculates the legitimate combination that provides your maximum financial benefit.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Wizard Navigation Footer                                  */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Back / பின்செல்</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <span>Next: {STEPS[step + 1]?.title}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bold text-sm transition flex items-center space-x-2 cursor-pointer shadow-md transform active:scale-98"
            >
              <Sparkles size={16} className="text-amber-300 fill-amber-300" />
              <span>Find My Scholarships / தகுதியான திட்டங்களைக் கண்டறிக</span>
              <ArrowRight size={16} />
            </button>
          )}

        </div>

      </form>

      {/* Voice Assistant Modal */}
      <VoiceAssistModal
        isOpen={isVoiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onFillForm={applyVoiceData}
      />

    </div>
  );
}
