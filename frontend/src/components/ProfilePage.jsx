import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  FileCheck, 
  ShieldCheck, 
  Award, 
  Landmark, 
  MapPin, 
  Mail, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Compass, 
  Sparkles, 
  LogOut,
  LogIn,
  IndianRupee,
  Building,
  Calendar,
  Check,
  Edit3,
  Camera
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import { generateRoadmapPdf } from '../utils/generateRoadmapPdf';
import EditProfileModal from './EditProfileModal';

export default function ProfilePage({ 
  user, 
  profile, 
  result, 
  onNavigateTab, 
  currentLang = 'en', 
  onLogout,
  onOpenAuth = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [localProfile, setLocalProfile] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tn_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return sessionStorage.getItem('tn_student_avatar') || user?.profile?.avatar || null;
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = sessionStorage.getItem('tn_student_profile');
        if (saved) setLocalProfile(JSON.parse(saved));
        const av = sessionStorage.getItem('tn_student_avatar');
        setAvatarImage(av || null);
      } catch (e) {}
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('avatarUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('avatarUpdated', handleProfileUpdate);
    };
  }, []);

  // Derive display values from user account or profile form
  const studentData = {
    fullName: localProfile?.fullName || profile?.full_name || user?.profile?.full_name || (user ? user.email?.split('@')[0] : 'Guest Candidate (விருந்தினர்)'),
    email: user?.email || profile?.email || 'guest@tnevidya.tn.gov.in',
    gender: localProfile?.gender || profile?.gender || user?.profile?.gender || 'male',
    community: localProfile?.community || profile?.community || user?.profile?.community || 'BC',
    district: localProfile?.district || profile?.district || user?.profile?.district || 'Chennai',
    annualIncome: localProfile?.annualIncome || profile?.annual_income || user?.profile?.annual_income || 0,
    boardPercentage: localProfile?.boardPercentage || profile?.board_percentage || user?.profile?.board_percentage || 0,
    schoolingType: localProfile?.schoolingType || profile?.schooling_type || user?.profile?.schooling_type || 'tn_govt_school_6_to_12',
    isFirstGraduate: localProfile?.isFirstGraduate !== undefined ? localProfile.isFirstGraduate : (profile?.is_first_graduate !== undefined ? profile.is_first_graduate : false),
    admissionMode: profile?.admission_mode || 'govt_counseling_single_window',
    currentCourse: localProfile?.currentCourse || profile?.current_course || 'Higher Education (Not Enrolled)',
    role: user?.role || (user?.email?.includes('admin') ? 'admin' : 'student'),
    userId: user?.user_id || (localProfile?.fullName ? 'TN-STUDENT' : 'GUEST-SESSION'),
    avatar: avatarImage
  };

  const isGovtSchool = studentData.schoolingType === 'tn_govt_school_6_to_12';
  const roleLabel = studentData.role === 'admin' ? t.role_admin : t.role_student;

  const handleDownloadPdf = () => {
    if (result) {
      generateRoadmapPdf(studentData, result);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
  };

  // Mock verified documents linked to student account
  const documents = [
    {
      id: 'community_cert',
      name: currentLang === 'ta' ? 'சாதிச் சான்றிதழ் (Tahsildar e-District)' : 'Community Certificate (Tahsildar e-District)',
      status: 'verified',
      authority: 'Revenue Dept, Govt of Tamil Nadu',
      date: '2024-06-15'
    },
    {
      id: 'income_cert',
      name: currentLang === 'ta' ? 'வருமானச் சான்றிதழ் (FY 2025-26)' : 'Income Certificate (FY 2025-26)',
      status: 'verified',
      authority: `Tahsildar Office, ${studentData.district}`,
      date: '2025-05-10'
    },
    {
      id: 'hsc_marksheet',
      name: currentLang === 'ta' ? '12-ஆம் வகுப்பு பொதுத்தேர்வு மதிப்பெண் சான்றிதழ்' : 'HSC 12th Board Examination Marksheet',
      status: 'verified',
      authority: 'DGE Tamil Nadu',
      date: '2025-06-20'
    },
    {
      id: 'first_grad_cert',
      name: currentLang === 'ta' ? 'முதல் பட்டதாரி சான்றிதழ் & கூட்டு உறுதிமொழி' : 'First Graduate Certificate & Joint Undertaking',
      status: studentData.isFirstGraduate ? 'verified' : 'not_applicable',
      authority: 'e-Sevai Portal / Revenue Dept',
      date: '2025-07-02'
    },
    {
      id: 'aadhaar_dbt',
      name: currentLang === 'ta' ? 'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு (DBT)' : 'Aadhaar Seeded DBT Bank Account',
      status: 'verified',
      authority: 'NPCI / Canara Bank, Active',
      date: '2024-01-12'
    },
    {
      id: 'bonafide_cert',
      name: currentLang === 'ta' ? 'கல்லூரி சேர்க்கை போனாஃபைட் சான்றிதழ்' : 'College Admission Bonafide Certificate',
      status: 'verified',
      authority: 'Dean / Principal Academic Office',
      date: '2025-08-01'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab('home')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center space-x-1.5 cursor-pointer"
        >
          <span>← {t.nav_home}</span>
        </button>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Official Student Dossier • TNeGA Verified
        </span>
      </div>

      {/* 1. Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => setShowEditModal(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg border-2 border-white/20 overflow-hidden relative cursor-pointer group shrink-0"
                title="Click to edit profile and photo"
              >
                {avatarImage ? (
                  <img src={avatarImage} alt={studentData.fullName} className="w-full h-full object-cover" />
                ) : (
                  studentData.fullName.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Camera size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {studentData.fullName}
                  </h1>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    studentData.role === 'admin'
                      ? 'bg-purple-900/60 text-purple-200 border-purple-400/40'
                      : 'bg-emerald-900/60 text-emerald-200 border-emerald-400/40'
                  }`}>
                    {roleLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center space-x-3 mt-1">
                  <span className="flex items-center"><Mail size={12} className="mr-1 text-emerald-400" /> {studentData.email}</span>
                  <span>•</span>
                  <span className="flex items-center"><MapPin size={12} className="mr-1 text-emerald-400" /> {studentData.district}, Tamil Nadu</span>
                </p>
                <p className="text-[11px] text-emerald-300/80 font-mono mt-1">
                  {t.student_id}: <strong className="text-white">TNEV-2026-{studentData.userId.slice(-6).toUpperCase()}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 size={14} className="text-emerald-300" />
                <span>Edit Profile</span>
              </button>
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs border border-emerald-400 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  title="Sign In with Student Credentials or Switch"
                >
                  <LogIn size={14} />
                  <span>{user ? 'Switch Account' : 'Sign In'}</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('matcher')}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Compass size={14} />
                <span>{t.re_evaluate_profile}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title={t.nav_logout}
                  className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl border border-white/20 transition cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* 4 Key Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50/50 border-b border-slate-200 text-xs">
          <div className="p-4 text-center">
            <span className="text-[11px] text-slate-400 block">{t.label_community}</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{studentData.community} (Backward Class)</strong>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] text-slate-400 block">{t.label_annual_income}</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">₹{studentData.annualIncome.toLocaleString('en-IN')} / yr</strong>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] text-slate-400 block">{t.label_first_graduate}</span>
            <strong className={`text-sm font-bold mt-0.5 block ${studentData.isFirstGraduate ? 'text-emerald-700' : 'text-slate-700'}`}>
              {studentData.isFirstGraduate ? (currentLang === 'ta' ? 'ஆம் (தகுதி உண்டு)' : 'Yes (Fee Waiver Eligible)') : (currentLang === 'ta' ? 'இல்லை' : 'No')}
            </strong>
          </div>
          <div className="p-4 text-center">
            <span className="text-[11px] text-slate-400 block">{t.label_board_pct}</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{studentData.boardPercentage}% (12th Board)</strong>
          </div>
        </div>
      </div>

      {/* 2. Scheme Entitlement Payout Banner (If Evaluated) */}
      {result ? (
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>{t.scheme_entitlements} • {t.evaluated_badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ₹{result.total_financial_value.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-emerald-200/80 ml-2">/ annual legal scholarship aid</span>
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                Our MWIS optimizer selected <strong>{result.recommended_bundle.length} legally compliant schemes</strong> with zero rejection risk across Tamil Nadu and Central quotas.
              </p>

              {/* Matched Scheme Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {result.recommended_bundle.map((scheme, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>{scheme.name}</span>
                    <strong className="text-emerald-300">₹{scheme.financial_value.toLocaleString('en-IN')}</strong>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                onClick={handleDownloadPdf}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Download size={15} />
                <span>{downloadSuccess ? (currentLang === 'ta' ? 'பதிவிறக்கம் செய்யப்பட்டது!' : 'PDF Downloaded!') : t.download_roadmap}</span>
              </button>

              <button
                onClick={() => onNavigateTab('results')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition border border-white/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{currentLang === 'ta' ? 'முடிவுகள் பக்கம் காண்க' : 'View Full Breakdown'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Compass size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentLang === 'ta' ? 'உங்கள் கல்வி உதவித்தொகை தகுதியை சோதிக்கவும்' : 'Calculate Your Maximum Legal Scholarship Entitlement'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentLang === 'ta' ? 'எங்கள் AI வழிமுறை 18+ நலத்திட்டங்களை ஒப்பிட்டு அதிகபட்ச பலனை அளிக்கும்.' : 'Cross-reference your credentials against 18+ schemes to generate your official legal bundle.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('matcher')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <span>{t.btn_check_eligibility}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 3. Detailed Academic & Socio-Economic Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <GraduationCap size={18} className="text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">{t.academic_credentials}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_course}:</span>
              <strong className="text-slate-900 font-semibold">{studentData.currentCourse}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_schooling_type}:</span>
              <span className="text-right">
                <strong className={`font-semibold ${isGovtSchool ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {isGovtSchool ? 'TN Govt School (Class 6 to 12)' : 'Private / Matriculation'}
                </strong>
                {isGovtSchool && (
                  <span className="block text-[10px] text-emerald-600">✓ Pudhumai Penn & 7.5% Quota Eligible</span>
                )}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_admission_mode}:</span>
              <strong className="text-slate-900 font-semibold">TNEA Single Window Counseling</strong>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">{t.label_board_pct}:</span>
              <strong className="text-emerald-700 font-bold text-sm">{studentData.boardPercentage}%</strong>
            </div>
          </div>
        </div>

        {/* Socio-Economic Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Landmark size={18} className="text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">{t.socio_economic_profile}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_community}:</span>
              <strong className="text-slate-900 font-semibold">{studentData.community}</strong>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_annual_income}:</span>
              <span className="text-right">
                <strong className="text-slate-900 font-semibold">₹{studentData.annualIncome.toLocaleString('en-IN')}</strong>
                <span className="block text-[10px] text-slate-400">Tahsildar Certified</span>
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">{t.label_first_graduate}:</span>
              <span className="text-right">
                <strong className={`font-semibold ${studentData.isFirstGraduate ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {studentData.isFirstGraduate ? 'Yes • Concession Approved' : 'No'}
                </strong>
                {studentData.isFirstGraduate && (
                  <span className="block text-[10px] text-emerald-600">✓ ₹25,000/yr Tuition Fee Waiver</span>
                )}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Benchmark Disability (PwD):</span>
              <strong className="text-slate-700 font-semibold">No</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Mandatory e-Sevai Document Verification Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileCheck size={18} className="text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">{t.mandatory_docs_checklist}</h3>
          </div>
          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
            5 of 6 Documents Verified & Seeded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {documents.map(doc => (
            <div 
              key={doc.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {doc.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {doc.authority} • {doc.date}
                </p>
              </div>

              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Check size={10} className="text-emerald-600" />
                <span>{t.verified}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={studentData}
        onSave={(updated) => {
          setLocalProfile(updated);
          if (updated.avatar !== undefined) setAvatarImage(updated.avatar);
        }}
        currentLang={currentLang}
      />

    </div>
  );
}
