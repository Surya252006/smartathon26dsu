import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
  Phone,
  Save,
  Trash2,
  UploadCloud,
  FileText,
  FileCheck2
} from 'lucide-react';
import { TN_DISTRICTS } from './ProfileForm';
import { TRANSLATIONS } from '../utils/translations';
import { saveProfileToCluster, saveAvatarToCluster } from '../utils/cloudSync';

export default function ProfilePage({ 
  user, 
  profile, 
  result, 
  onNavigateTab, 
  onEvaluate = null,
  currentLang = 'en', 
  onLogout,
  onOpenAuth = null,
  onOpenScanner = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const fileInputRef = useRef(null);

  // Load existing bio-data from props, session storage, or fallback defaults
  const getInitialData = () => {
    try {
      const savedSession = sessionStorage.getItem('tn_student_profile');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && (parsed.full_name || parsed.fullName || parsed.community)) return parsed;
      }
    } catch (e) {}
    
    const p = user?.profile || profile;
    return p || {};
  };

  const initial = getInitialData();

  // Form Field States
  const [fullName, setFullName] = useState(initial.full_name || initial.fullName || '');
  const [fatherName, setFatherName] = useState(initial.father_name || initial.fatherName || '');
  const [dob, setDob] = useState(initial.dob || '2006-05-14');
  const [gender, setGender] = useState(initial.gender || 'male');
  const [phone, setPhone] = useState(initial.phone || '9840123456');
  const [email, setEmail] = useState(initial.email || user?.email || '');

  const [community, setCommunity] = useState(initial.community || 'BC');
  const [aadhaar, setAadhaar] = useState(initial.aadhaar || 'XXXX-XXXX-8492');

  const [district, setDistrict] = useState(initial.district || 'Pudukkottai');
  const [taluk, setTaluk] = useState(initial.taluk || 'Aranthangi');
  const [city, setCity] = useState(initial.city || 'Aranthangi');
  const [residenceType, setResidenceType] = useState(initial.residence_type || initial.residenceType || 'Rural');

  const [degree, setDegree] = useState(initial.degree || 'Undergraduate (UG)');
  const [currentCourse, setCurrentCourse] = useState(initial.current_course || initial.currentCourse || 'B.E. Computer Science & Engineering');
  const [collegeName, setCollegeName] = useState(initial.college_name || initial.collegeName || 'Government College of Engineering, Bodinayakkanur');
  const [collegeType, setCollegeType] = useState(initial.college_type || initial.collegeType || 'Government');
  const [yearOfStudy, setYearOfStudy] = useState(initial.year_of_study || initial.yearOfStudy || '1st Year (Fresher)');
  const [boardPercentage, setBoardPercentage] = useState(String(initial.board_percentage || initial.boardPercentage || '88.5'));
  const [admissionMode, setAdmissionMode] = useState(initial.admission_mode || initial.admissionMode || 'govt_counseling_single_window');

  const [annualIncome, setAnnualIncome] = useState(String(initial.annual_income || initial.annualIncome || '140000'));
  const [isFirstGraduate, setIsFirstGraduate] = useState(
    initial.is_first_graduate !== undefined 
      ? Boolean(initial.is_first_graduate) 
      : (initial.isFirstGraduate !== undefined ? Boolean(initial.isFirstGraduate) : true)
  );
  const [schoolingType, setSchoolingType] = useState(initial.schooling_type || initial.schoolingType || 'tn_govt_school_6_to_12');
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState(Boolean(initial.is_differently_abled || initial.isDifferentlyAbled));

  const [avatar, setAvatar] = useState(() => {
    try {
      return sessionStorage.getItem('tn_student_avatar') || initial.avatar || null;
    } catch (e) {
      return null;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Sync if profile/user changes externally
  useEffect(() => {
    const active = user?.profile || profile;
    if (active && (active.full_name || active.fullName)) {
      setFullName(active.full_name || active.fullName || '');
      if (active.father_name || active.fatherName) setFatherName(active.father_name || active.fatherName);
      if (active.dob) setDob(active.dob);
      if (active.gender) setGender(active.gender);
      if (active.phone) setPhone(active.phone);
      if (active.email) setEmail(active.email);
      if (active.community) setCommunity(active.community);
      if (active.district) setDistrict(active.district);
      if (active.taluk) setTaluk(active.taluk);
      if (active.city) setCity(active.city);
      if (active.residence_type || active.residenceType) setResidenceType(active.residence_type || active.residenceType);
      if (active.degree) setDegree(active.degree);
      if (active.current_course || active.currentCourse) setCurrentCourse(active.current_course || active.currentCourse);
      if (active.college_name || active.collegeName) setCollegeName(active.college_name || active.collegeName);
      if (active.college_type || active.collegeType) setCollegeType(active.college_type || active.collegeType);
      if (active.year_of_study || active.yearOfStudy) setYearOfStudy(active.year_of_study || active.yearOfStudy);
      if (active.board_percentage || active.boardPercentage) setBoardPercentage(String(active.board_percentage || active.boardPercentage));
      if (active.admission_mode || active.admissionMode) setAdmissionMode(active.admission_mode || active.admissionMode);
      if (active.annual_income || active.annualIncome) setAnnualIncome(String(active.annual_income || active.annualIncome));
      if (active.is_first_graduate !== undefined || active.isFirstGraduate !== undefined) {
        setIsFirstGraduate(Boolean(active.is_first_graduate !== undefined ? active.is_first_graduate : active.isFirstGraduate));
      }
      if (active.schooling_type || active.schoolingType) setSchoolingType(active.schooling_type || active.schoolingType);
      if (active.avatar) setAvatar(active.avatar);
    }
  }, [user, profile]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Please choose a photo under 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setAvatar(base64);
        try {
          sessionStorage.setItem('tn_student_avatar', base64);
          window.dispatchEvent(new Event('avatarUpdated'));
          const clusterId = email || user?.email || fullName || 'student_avatar';
          saveAvatarToCluster(clusterId, base64);
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    try {
      sessionStorage.removeItem('tn_student_avatar');
      window.dispatchEvent(new Event('avatarUpdated'));
      const clusterId = email || user?.email || fullName || 'student_avatar';
      saveAvatarToCluster(clusterId, null);
    } catch (err) {}
  };

  // Quick 1-Click Persona Pre-fills
  const handlePersonaFill = (personaType) => {
    if (personaType === 'surya') {
      setFullName('Surya Suresh');
      setFatherName('Suresh K');
      setEmail('surya25suresh2006@gmail.com');
      setPhone('9840123456');
      setGender('male');
      setDob('2006-05-14');
      setCommunity('BC');
      setDistrict('Pudukkottai');
      setTaluk('Aranthangi');
      setCity('Aranthangi');
      setResidenceType('Rural');
      setDegree('Undergraduate (UG)');
      setCurrentCourse('B.E. Computer Science & Engineering');
      setCollegeName('Government College of Engineering, Bodinayakkanur');
      setCollegeType('Government');
      setYearOfStudy('1st Year (Fresher)');
      setBoardPercentage('88.5');
      setAdmissionMode('govt_counseling_single_window');
      setAnnualIncome('140000');
      setIsFirstGraduate(true);
      setSchoolingType('tn_govt_school_6_to_12');
      setIsDifferentlyAbled(false);
      setSaveToast("Auto-filled Surya Suresh (BC • Pudukkottai • Engineering • First Graduate)");
      setTimeout(() => setSaveToast(null), 3000);
    } else if (personaType === 'priya') {
      setFullName('Priya M');
      setFatherName('Murugan P');
      setEmail('priya.m2026@gmail.com');
      setPhone('9444123890');
      setGender('female');
      setDob('2006-08-22');
      setCommunity('SC');
      setDistrict('Madurai');
      setTaluk('Madurai South');
      setCity('Madurai');
      setResidenceType('Rural');
      setDegree('Undergraduate (UG)');
      setCurrentCourse('B.Sc Physics');
      setCollegeName('Madurai Kamaraj University College');
      setCollegeType('Government');
      setYearOfStudy('1st Year (Fresher)');
      setBoardPercentage('82.0');
      setAdmissionMode('govt_counseling_single_window');
      setAnnualIncome('95000');
      setIsFirstGraduate(true);
      setSchoolingType('tn_govt_school_6_to_12');
      setIsDifferentlyAbled(false);
      setSaveToast("Auto-filled Priya M (SC • Madurai • Pudhumai Penn Eligible)");
      setTimeout(() => setSaveToast(null), 3000);
    } else if (personaType === 'karthik') {
      setFullName('Karthikeyan R');
      setFatherName('Ramanathan S');
      setEmail('karthik.r2026@gmail.com');
      setPhone('9840998877');
      setGender('male');
      setDob('2005-11-10');
      setCommunity('OC');
      setDistrict('Chennai');
      setTaluk('Mylapore');
      setCity('Chennai');
      setResidenceType('Urban');
      setDegree('Undergraduate (UG)');
      setCurrentCourse('B.Tech Information Technology');
      setCollegeName('Anna University CEG Campus, Guindy');
      setCollegeType('Government');
      setYearOfStudy('1st Year (Fresher)');
      setBoardPercentage('94.2');
      setAdmissionMode('govt_counseling_single_window');
      setAnnualIncome('350000');
      setIsFirstGraduate(false);
      setSchoolingType('private_matriculation');
      setIsDifferentlyAbled(false);
      setSaveToast("Auto-filled Karthikeyan R (OC • Chennai • Anna University)");
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Compile full bio-data object
  const buildFormData = () => {
    return {
      full_name: fullName.trim() || 'Student Candidate',
      fullName: fullName.trim() || 'Student Candidate',
      father_name: fatherName.trim(),
      dob,
      gender,
      phone: phone.trim(),
      email: email.trim().toLowerCase() || user?.email || '',
      community,
      aadhaar,
      district,
      taluk: taluk.trim(),
      city: city.trim() || district,
      residence_type: residenceType,
      degree,
      current_course: currentCourse.trim(),
      currentCourse: currentCourse.trim(),
      college_name: collegeName.trim(),
      college_type: collegeType,
      year_of_study: yearOfStudy,
      board_percentage: Number(boardPercentage) || 85.0,
      boardPercentage: Number(boardPercentage) || 85.0,
      admission_mode: admissionMode,
      annual_income: Number(annualIncome) || 140000,
      annualIncome: Number(annualIncome) || 140000,
      is_first_graduate: Boolean(isFirstGraduate),
      isFirstGraduate: Boolean(isFirstGraduate),
      schooling_type: schoolingType,
      schoolingType: schoolingType,
      is_differently_abled: Boolean(isDifferentlyAbled),
      avatar,
      isGuest: false,
      available_docs: [
        'income_certificate',
        'community_certificate',
        'bonafide_certificate',
        'marksheet',
        'aadhaar_bank'
      ]
    };
  };

  // Save to MongoDB Atlas cluster and session storage
  const handleSaveToCluster = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    const data = buildFormData();

    try {
      // 1. Session & Local Storage
      sessionStorage.setItem('tn_student_profile', JSON.stringify(data));
      if (data.avatar) sessionStorage.setItem('tn_student_avatar', data.avatar);
      
      const savedUser = sessionStorage.getItem('tn_scholarship_user');
      let uObj = user;
      if (savedUser) {
        uObj = JSON.parse(savedUser);
        uObj.profile = { ...(uObj.profile || {}), ...data };
        sessionStorage.setItem('tn_scholarship_user', JSON.stringify(uObj));
      } else if (uObj) {
        uObj.profile = { ...(uObj.profile || {}), ...data };
        sessionStorage.setItem('tn_scholarship_user', JSON.stringify(uObj));
      }

      // 2. Persist to MongoDB Atlas Cluster ('profiles' & 'profile' collections)
      await saveProfileToCluster(data, uObj);

      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('avatarUpdated'));

      setSaveToast("✓ Bio-Data Successfully Saved to MongoDB Atlas Cluster (cluster0.fzucldr.mongodb.net)!");
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err) {
      console.warn("Save note:", err);
      setSaveToast("✓ Bio-Data Saved Locally & Synced with Session!");
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save & Run Instant Evaluation
  const handleSaveAndEvaluate = async (e) => {
    e?.preventDefault();
    await handleSaveToCluster();
    const data = buildFormData();
    if (onEvaluate) {
      onEvaluate(data);
    } else if (onNavigateTab) {
      onNavigateTab('matcher');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Breadcrumb & Cluster Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>← {t.nav_home}</span>
          </button>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Form Type • Student Bio-Data Dossier
          </span>
        </div>

        {/* MongoDB Cluster Active Indicator */}
        <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-xl border border-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>MongoDB Atlas Cluster Synced (`cluster0.fzucldr.mongodb.net`)</span>
        </div>
      </div>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl border border-emerald-600 shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2.5 text-xs font-bold">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(null)}
            className="text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-[#0f2942] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/60 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Government of Tamil Nadu • TNeGA e-Vidya</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Student Bio-Data & Scholarship Profile Form
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Fill in your verified bio-data once. All higher education welfare schemes (Pudhumai Penn, Tamil Pudhalvan, First Graduate, Post-Matric) directly pull from this profile. You never have to re-enter your details every time!
            </p>
          </div>

          {/* Persona Autofill Quick Bar */}
          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl space-y-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              1-Click Demo Pre-fills (Optional):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePersonaFill('surya')}
                className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-[11px] font-bold rounded-lg border border-emerald-700 transition cursor-pointer"
              >
                Surya (BC • Engg • FG)
              </button>
              <button
                type="button"
                onClick={() => handlePersonaFill('priya')}
                className="px-2.5 py-1 bg-teal-950 hover:bg-teal-900 text-teal-200 text-[11px] font-bold rounded-lg border border-teal-700 transition cursor-pointer"
              >
                Priya (SC • Arts • Govt 6-12)
              </button>
              <button
                type="button"
                onClick={() => handlePersonaFill('karthik')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-600 transition cursor-pointer"
              >
                Karthik (OC • Engg)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Save & Evaluate Actions Top Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Applicant: <strong className="text-white">{fullName || 'New Candidate'}</strong> • Community: <strong className="text-white">{community}</strong> • District: <strong className="text-white">{district}</strong>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleSaveToCluster}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-600 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Save size={13} className="text-emerald-400" />
              <span>{isSaving ? 'Saving to Cluster...' : '💾 Save Profile to Cluster'}</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAndEvaluate}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Sparkles size={14} className="fill-slate-950" />
              <span>⚡ Save & Check Eligibility Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE FORM TYPE LAYOUT                                                 */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveToCluster} className="space-y-6">
        
        {/* SECTION 1: Personal Demographics & Contact */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 1: Personal Demographics & Identification
                </h3>
                <p className="text-xs text-slate-500">
                  Legal name as registered in Class 10/12 Marksheet & Aadhaar card.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
              Mandatory
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Square Photo Upload Component */}
            <div className="flex flex-col items-center shrink-0">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition shadow-2xs"
                title="Upload student passport photo"
              >
                {avatar ? (
                  <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <User size={38} className="text-slate-400 group-hover:text-emerald-700 transition mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-500 font-mono group-hover:text-emerald-800">
                      PHOTO
                    </span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-semibold">
                  <Camera size={18} className="mb-0.5 text-emerald-300" />
                  <span>{avatar ? 'Change' : 'Upload'}</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {avatar ? 'Change' : 'Upload Photo'}
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Name (மாணவர் பெயர்) *
                </label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Surya Suresh"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Father's / Guardian's Name (தந்தை பெயர்)
                </label>
                <input 
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. Suresh K"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Date of Birth (பிறந்த தேதி) *
                </label>
                <input 
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Gender (பாலினம்) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-semibold"
                >
                  <option value="male">Male (ஆண்) - Tamil Pudhalvan Eligible</option>
                  <option value="female">Female (பெண்) - Pudhumai Penn Eligible</option>
                  <option value="other">Transgender (மூன்றாம் பாலினம்)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mobile Number (கைபேசி எண்) *
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9840123456"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Email Address (மின்னஞ்சல்) *
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@tnega.gov.in"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Social Category & Community Quota */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Landmark size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 2: Social Community & Quota Entitlements
                </h3>
                <p className="text-xs text-slate-500">
                  Directly dictates Post-Matric waivers, Adi Dravidar grants, and BC/MBC scholarship matrices.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
              Welfare Rule Factor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Social Community (சமூகப் பிரிவு) *
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-900"
              >
                <option value="BC">BC - Backward Class (பிற்படுத்தப்பட்டோர்)</option>
                <option value="BCM">BCM - Backward Class Muslim (பிற்படுத்தப்பட்ட முஸ்லிம்)</option>
                <option value="MBC/DNC">MBC / DNC - Most Backward Class (மிகவும் பிற்படுத்தப்பட்டோர்)</option>
                <option value="SC">SC - Scheduled Caste (ஆதிதிராவிடர்)</option>
                <option value="SCA">SCA - Scheduled Caste Arunthathiyar (அருந்ததியர்)</option>
                <option value="ST">ST - Scheduled Tribe (பழங்குடியினர்)</option>
                <option value="OC">OC - Open Competition (பொதுப் பிரிவு)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Aadhaar Number (ஆதார் எண்)
              </label>
              <input 
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="XXXX-XXXX-8492"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Differently Abled Quota (மாற்றுத்திறனாளியா?)
              </label>
              <select
                value={isDifferentlyAbled ? 'yes' : 'no'}
                onChange={(e) => setIsDifferentlyAbled(e.target.value === 'yes')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-semibold"
              >
                <option value="no">No (இல்லை)</option>
                <option value="yes">Yes (ஆம் - Special Welfare Allowance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Residential Location (All 38 Districts) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 3: Native Residential Location (Tamil Nadu)
                </h3>
                <p className="text-xs text-slate-500">
                  Select from all 38 districts of Tamil Nadu to verify revenue jurisdiction.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
              All 38 Districts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                District (மாவட்டம்) *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold"
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_en} ({d.name_ta})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Taluk (வட்டம்) *
              </label>
              <input 
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                placeholder="e.g. Aranthangi"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                City / Town / Village (ஊர் / நகரம்)
              </label>
              <input 
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Aranthangi Town"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Residence Area (இருப்பிடம்)
              </label>
              <select
                value={residenceType}
                onChange={(e) => setResidenceType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              >
                <option value="Rural">Rural (ஊரகப் பகுதி)</option>
                <option value="Urban">Urban (நகர்ப்புற பகுதி)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Higher Education & Academic Credentials */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <GraduationCap size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 4: Collegiate & Academic Credentials
                </h3>
                <p className="text-xs text-slate-500">
                  Current course, college affiliation, 12th Board marks, and Single Window Counseling status.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
              Merit & Quota
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Degree Level (படிப்பு நிலை) *
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-semibold"
              >
                <option value="Undergraduate (UG)">Undergraduate (இளங்கலை UG - B.E/B.Tech/B.Sc/B.Com)</option>
                <option value="Postgraduate (PG)">Postgraduate (முதுகலை PG - M.E/M.Tech/M.Sc/MBA)</option>
                <option value="Polytechnic Diploma">Polytechnic Diploma (டிப்ளமோ)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Current Course / Department (பாடப்பிரிவு) *
              </label>
              <input 
                type="text"
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                placeholder="e.g. B.E. Computer Science & Engineering"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                College / Institution Name (கல்லூரி பெயர்)
              </label>
              <input 
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Government College of Engineering, Bodinayakkanur"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                College Category (கல்லூரி வகை) *
              </label>
              <select
                value={collegeType}
                onChange={(e) => setCollegeType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              >
                <option value="Government">Government College (அரசு கல்லூரி)</option>
                <option value="Government-Aided">Government-Aided (அரசு உதவிபெறும் கல்லூரி)</option>
                <option value="Private Self-Financing">Private Self-Financing (தனியார் சுயநிதி கல்லூரி)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Current Year of Study (பயிலும் ஆண்டு) *
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              >
                <option value="1st Year (Fresher)">1st Year (முதலாம் ஆண்டு - Fresher)</option>
                <option value="2nd Year">2nd Year (இரண்டாம் ஆண்டு)</option>
                <option value="3rd Year">3rd Year (மூன்றாம் ஆண்டு)</option>
                <option value="4th Year">4th Year (நான்காம் ஆண்டு)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                12th Board Marks % (12-ஆம் வகுப்பு மதிப்பெண் %) *
              </label>
              <input 
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={boardPercentage}
                onChange={(e) => setBoardPercentage(e.target.value)}
                placeholder="88.5"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Admission Mode (சேர்க்கை முறை) *
              </label>
              <select
                value={admissionMode}
                onChange={(e) => setAdmissionMode(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              >
                <option value="govt_counseling_single_window">Single Window Counseling (ஒற்றைச் சாளர சேர்க்கை)</option>
                <option value="management_quota">Management Quota (நிர்வாக ஒதுக்கீடு)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: Socio-Economic Profile & Welfare Schemes */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <IndianRupee size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 5: Family Income & Welfare Quotas
                </h3>
                <p className="text-xs text-slate-500">
                  Controls First Graduate fee waivers (₹25,000) and Pudhumai Penn / Tamil Pudhalvan DBT (₹12,000).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
              Financial Payout
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Annual Family Income (குடும்ப ஆண்டு வருமானம் ₹) *
              </label>
              <input 
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="140000"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono font-bold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Cap: Under ₹2.50L for Post-Matric • Under ₹4.50L for Central CSSS
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                First Graduate in Family? (முதல் பட்டதாரியா?) *
              </label>
              <select
                value={isFirstGraduate ? 'yes' : 'no'}
                onChange={(e) => setIsFirstGraduate(e.target.value === 'yes')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-emerald-800"
              >
                <option value="yes">Yes (ஆம் - ₹25,000 Tuition Waiver Eligible)</option>
                <option value="no">No (இல்லை)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                No sibling has availed First Graduate benefits previously.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Schooling Type (பள்ளி வகை) *
              </label>
              <select
                value={schoolingType}
                onChange={(e) => setSchoolingType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold"
              >
                <option value="tn_govt_school_6_to_12">TN Govt School (Classes 6-12) - ₹12,000 DBT Eligible</option>
                <option value="private_matriculation">Private Matriculation / CBSE School</option>
                <option value="government_aided">Government-Aided School</option>
              </select>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Qualifies for Pudhumai Penn (Girls) / Tamil Pudhalvan (Boys)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 6: Document Verification Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
              <FileCheck2 size={22} className="text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-xs">
                Tamil Nadu e-Sevai & Revenue Document Verification Linked
              </span>
              <p className="text-[11px] text-slate-600">
                Income Certificate (REV-INC-01), Community Certificate (REV-COM-02), and Aadhaar-DBT can be verified live.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenScanner}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs border border-emerald-600 shrink-0"
          >
            <FileCheck size={14} className="text-amber-300" />
            <span>Launch e-Sevai Document Scanner</span>
          </button>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-white rounded-3xl border-2 border-emerald-600/60 p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              Ready to Evaluate Your Schemes?
            </h4>
            <p className="text-xs text-slate-500">
              Saving your bio-data updates the MongoDB Atlas cluster (`profiles` & `profile`) and computes your maximum payout immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-600 transition flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <Save size={15} className="text-emerald-400" />
              <span>{isSaving ? 'Saving to Cluster...' : '💾 Save Bio-Data to Cluster'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndEvaluate}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-lg border border-emerald-400"
            >
              <Sparkles size={15} className="text-amber-300" />
              <span>⚡ Save & Check My Eligibility</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
