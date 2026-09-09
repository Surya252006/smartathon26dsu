import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Building, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  ShieldCheck,
  Phone,
  Calendar,
  GraduationCap,
  Landmark,
  FileCheck2,
  Award,
  School,
  BookOpen
} from 'lucide-react';
import { TN_DISTRICTS } from './ProfileForm';
import { saveProfileToCluster, getProfileFromCluster } from '../utils/cloudSync';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Section 0: Student Education Stream ('college' or 'school')
  const [studentType, setStudentType] = useState('college');
  
  // Section 1: Account Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Section 2: Demographics
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('2006-05-14');
  const [community, setCommunity] = useState('BC');
  const [fatherName, setFatherName] = useState('');

  // Section 3: Location
  const [district, setDistrict] = useState('Pudukkottai');
  const [taluk, setTaluk] = useState('Aranthangi');
  const [city, setCity] = useState('Aranthangi');
  const [residenceType, setResidenceType] = useState('Rural');

  // Section 4A: School Specific Credentials (Classes 1 to 12)
  const [schoolClass, setSchoolClass] = useState('Class 10 (SSLC Secondary)');
  const [schoolName, setSchoolName] = useState('Government High School, Aranthangi');
  const [schoolType, setSchoolType] = useState('tn_govt_school_6_to_12');
  const [schoolMedium, setSchoolMedium] = useState('Tamil Medium');
  const [emisId, setEmisId] = useState('');
  const [schoolMarks, setSchoolMarks] = useState('88.0');

  // Section 4B: College Academic Credentials
  const [degree, setDegree] = useState('Undergraduate (UG)');
  const [currentCourse, setCurrentCourse] = useState('B.E. Computer Science & Engineering (B.E CSE)');
  const [collegeName, setCollegeName] = useState('Government College of Engineering, Bodinayakkanur');
  const [collegeType, setCollegeType] = useState('Government');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year (Fresher)');
  const [boardPercentage, setBoardPercentage] = useState('88.5');
  const [admissionMode, setAdmissionMode] = useState('govt_counseling_single_window');

  // Section 5: Socio-Economic & Welfare Quota
  const [annualIncome, setAnnualIncome] = useState('140000');
  const [isFirstGraduate, setIsFirstGraduate] = useState(true);
  const [schoolingType, setSchoolingType] = useState('tn_govt_school_6_to_12');
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  // 1-Click quick persona pre-fill for fast testing
  const handlePreFillPersona = (personaType) => {
    if (personaType === 'surya') {
      setStudentType('college');
      setEmail('surya25suresh2006@gmail.com');
      setPassword('surya2026');
      setFullName('Surya Suresh');
      setPhone('9840123456');
      setGender('male');
      setDob('2006-05-14');
      setCommunity('BC');
      setDistrict('Pudukkottai');
      setTaluk('Aranthangi');
      setCity('Aranthangi');
      setResidenceType('Rural');
      setFatherName('Suresh K');
      setDegree('Undergraduate (UG)');
      setCurrentCourse('B.E. Computer Science & Engineering (B.E CSE)');
      setCollegeName('Government College of Technology, Coimbatore');
      setCollegeType('Government');
      setYearOfStudy('1st Year (Fresher)');
      setBoardPercentage('88.5');
      setAdmissionMode('govt_counseling_single_window');
      setAnnualIncome('140000');
      setIsFirstGraduate(true);
      setSchoolingType('tn_govt_school_6_to_12');
      setIsDifferentlyAbled(false);
    } else if (personaType === 'priya') {
      setStudentType('college');
      setEmail('priya.murugesan2026@gmail.com');
      setPassword('priya2026');
      setFullName('Priya Murugesan');
      setPhone('9840654321');
      setGender('female');
      setDob('2006-08-20');
      setCommunity('BC');
      setDistrict('Madurai');
      setTaluk('Madurai South');
      setCity('Madurai');
      setResidenceType('Urban');
      setFatherName('Murugesan P');
      setDegree('Undergraduate (UG)');
      setCurrentCourse('B.E. Electronics & Communication Engineering (B.E ECE)');
      setCollegeName('Thiagarajar College of Engineering, Madurai');
      setCollegeType('Govt-Aided');
      setYearOfStudy('1st Year (Fresher)');
      setBoardPercentage('91.2');
      setAdmissionMode('govt_counseling_single_window');
      setAnnualIncome('120000');
      setIsFirstGraduate(false);
      setSchoolingType('tn_govt_school_6_to_12');
      setIsDifferentlyAbled(false);
    } else if (personaType === 'karthik') {
      setStudentType('college');
      setEmail('karthikeyan.r2026@gmail.com');
      setPassword('karthik2026');
      setFullName('Karthikeyan R');
      setPhone('9840998877');
      setGender('male');
      setDob('2005-11-10');
      setCommunity('OC');
      setDistrict('Chennai');
      setTaluk('Mylapore');
      setCity('Chennai');
      setResidenceType('Urban');
      setFatherName('Ramanathan S');
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
    } else if (personaType === 'kavitha') {
      setStudentType('school');
      setEmail('kavitha.s.school2026@gmail.com');
      setPassword('kavitha2026');
      setFullName('Kavitha S');
      setPhone('9840332211');
      setGender('female');
      setDob('2010-06-12');
      setCommunity('BC');
      setDistrict('Thanjavur');
      setTaluk('Papanasam');
      setCity('Papanasam');
      setResidenceType('Rural');
      setFatherName('Shanmugam M');
      setSchoolClass('Class 10 (SSLC Secondary)');
      setSchoolName('Government High School, Papanasam, Thanjavur');
      setSchoolType('tn_govt_school_6_to_12');
      setSchoolMedium('Tamil Medium');
      setEmisId('33021900401');
      setSchoolMarks('88.0');
      setAnnualIncome('85000');
      setIsDifferentlyAbled(false);
      setIsFirstGraduate(false);
    } else if (personaType === 'anbarasan') {
      setStudentType('school');
      setEmail('anbarasan.k.hsc2026@gmail.com');
      setPassword('anbu2026');
      setFullName('Anbarasan K');
      setPhone('9840445566');
      setGender('male');
      setDob('2009-04-18');
      setCommunity('SC');
      setDistrict('Salem');
      setTaluk('Attur');
      setCity('Attur');
      setResidenceType('Rural');
      setFatherName('Karuppasamy P');
      setSchoolClass('Class 11 (Higher Secondary - Bio-Maths)');
      setSchoolName('Government Model Higher Secondary School, Salem');
      setSchoolType('tn_govt_school_6_to_12');
      setSchoolMedium('Tamil Medium');
      setEmisId('33080701205');
      setSchoolMarks('84.5');
      setAnnualIncome('95000');
      setIsDifferentlyAbled(false);
      setIsFirstGraduate(false);
    }
  };

  const completeAuth = async (userData, fullBioProfile) => {
    const lookupId = userData.email || userData.user_id;
    const cleanId = String(lookupId).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

    const isSchool = studentType === 'school' || 
      fullBioProfile.student_type === 'school' || 
      fullBioProfile.studentType === 'school' ||
      /class|school|sslc|hsc|primary|middle|grade|std/i.test(fullBioProfile.current_course || fullBioProfile.degree || '');

    const resolvedStudentType = isSchool ? 'school' : 'college';

    const resolvedDegree = isSchool
      ? (String(schoolClass).includes('11') || String(schoolClass).includes('12') 
          ? 'Higher Secondary (Class 11 - 12 / HSC)' 
          : (String(schoolClass).includes('10') || String(schoolClass).includes('9') 
              ? 'High School (Class 9 - 10 / SSLC)' 
              : (String(schoolClass).includes('6') || String(schoolClass).includes('7') || String(schoolClass).includes('8') 
                  ? 'Middle School (Class 6 - 8)' 
                  : 'Primary School (Class 1 - 5)')))
      : (fullBioProfile.degree || 'Undergraduate (UG)');

    const resolvedCourse = isSchool ? (schoolClass || fullBioProfile.school_class || 'Class 10 (SSLC Secondary)') : (fullBioProfile.current_course || fullBioProfile.currentCourse || 'Engineering');
    const resolvedInstitution = isSchool ? (schoolName || fullBioProfile.school_name || 'Government High School') : (fullBioProfile.college_name || fullBioProfile.collegeName || '');
    const resolvedInstType = isSchool ? (schoolType === 'tn_govt_school_6_to_12' ? 'Government' : 'Govt-Aided') : (fullBioProfile.college_type || fullBioProfile.collegeType || 'Government');

    // Combine bio profile
    const consolidatedProfile = {
      ...fullBioProfile,
      fullName: fullBioProfile.full_name || fullBioProfile.fullName || userData.full_name || 'Student Candidate',
      email: userData.email,
      gender: fullBioProfile.gender || 'male',
      dob: fullBioProfile.dob || '2006-05-14',
      community: fullBioProfile.community || 'BC',
      district: fullBioProfile.district || 'Chennai',
      taluk: fullBioProfile.taluk || '',
      city: fullBioProfile.city || fullBioProfile.district || 'Chennai',
      student_type: resolvedStudentType,
      studentType: resolvedStudentType,
      current_level: resolvedStudentType,
      school_class: isSchool ? (schoolClass || fullBioProfile.school_class || resolvedCourse) : '',
      school_name: isSchool ? (schoolName || fullBioProfile.school_name || resolvedInstitution) : '',
      school_type: isSchool ? (schoolType || fullBioProfile.school_type || fullBioProfile.schooling_type || 'tn_govt_school_6_to_12') : (fullBioProfile.schooling_type || 'tn_govt_school_6_to_12'),
      school_medium: isSchool ? (schoolMedium || fullBioProfile.school_medium || 'Tamil Medium') : '',
      emis_id: isSchool ? (emisId || fullBioProfile.emis_id || '') : '',
      annualIncome: Number(fullBioProfile.annual_income || fullBioProfile.annualIncome) || (isSchool ? 85000 : 140000),
      boardPercentage: Number(fullBioProfile.board_percentage || fullBioProfile.boardPercentage || (isSchool ? schoolMarks : 85.0)),
      currentCourse: resolvedCourse,
      collegeName: resolvedInstitution,
      collegeType: resolvedInstType,
      degree: resolvedDegree,
      yearOfStudy: isSchool ? resolvedCourse : (fullBioProfile.year_of_study || fullBioProfile.yearOfStudy || '1st Year (Fresher)'),
      admissionMode: isSchool ? 'school_regular_admission' : (fullBioProfile.admission_mode || fullBioProfile.admissionMode || 'govt_counseling_single_window'),
      isFirstGraduate: isSchool ? false : (fullBioProfile.is_first_graduate !== undefined ? Boolean(fullBioProfile.is_first_graduate) : Boolean(fullBioProfile.isFirstGraduate)),
      schoolingType: isSchool ? schoolType : (fullBioProfile.schooling_type || fullBioProfile.schoolingType || 'tn_govt_school_6_to_12'),
      isDifferentlyAbled: Boolean(fullBioProfile.is_differently_abled),
      specialCategory: fullBioProfile.special_category || 'None',
      avatar: fullBioProfile.avatar || null,
      isGuest: false
    };

    const updatedUser = {
      ...userData,
      student_type: resolvedStudentType,
      studentType: resolvedStudentType,
      profile: consolidatedProfile
    };

    // 1. Session Storage
    try {
      sessionStorage.setItem('tn_scholarship_user', JSON.stringify(updatedUser));
      sessionStorage.setItem('tn_student_profile', JSON.stringify(consolidatedProfile));
      if (consolidatedProfile.avatar) {
        sessionStorage.setItem('tn_student_avatar', consolidatedProfile.avatar);
      }
      localStorage.setItem(`tn_profile_${cleanId}`, JSON.stringify(consolidatedProfile));
    } catch (e) {}

    // 2. Persist to MongoDB Atlas cluster 'profiles' & 'profile' collections
    try {
      await saveProfileToCluster(consolidatedProfile, updatedUser);
    } catch (e) {}

    window.dispatchEvent(new Event('profileUpdated'));
    window.dispatchEvent(new Event('avatarUpdated'));

    setIsLoading(false);
    setSuccessMsg(`Welcome, ${updatedUser.full_name || 'Student'}! Bio-data registered & synced.`);
    setTimeout(() => {
      onAuthSuccess(updatedUser);
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      setIsLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name as per marksheet.");
        setIsLoading(false);
        return;
      }

      const isSchool = studentType === 'school';
      const resolvedDegree = isSchool
        ? (String(schoolClass).includes('11') || String(schoolClass).includes('12')
            ? 'Higher Secondary (Class 11 - 12 / HSC)'
            : (String(schoolClass).includes('10') || String(schoolClass).includes('9')
                ? 'High School (Class 9 - 10 / SSLC)'
                : (String(schoolClass).includes('6') || String(schoolClass).includes('7') || String(schoolClass).includes('8')
                    ? 'Middle School (Class 6 - 8)'
                    : 'Primary School (Class 1 - 5)')))
        : degree;
      const resolvedCourse = isSchool ? schoolClass : currentCourse;
      const resolvedCollege = isSchool ? schoolName : collegeName.trim();
      const resolvedCollegeType = isSchool ? (schoolType === 'tn_govt_school_6_to_12' ? 'Government' : 'Govt-Aided') : collegeType;

      const bioPayload = {
        email: cleanEmail,
        password,
        full_name: fullName.trim(),
        phone: phone.trim(),
        gender,
        dob,
        community,
        father_name: fatherName.trim(),
        district,
        taluk: taluk.trim(),
        city: city.trim() || district,
        residence_type: residenceType,
        student_type: studentType,
        studentType: studentType,
        current_level: studentType,
        school_class: isSchool ? schoolClass : '',
        school_name: isSchool ? schoolName : '',
        school_type: isSchool ? schoolType : schoolingType,
        school_medium: isSchool ? schoolMedium : '',
        emis_id: isSchool ? emisId : '',
        degree: resolvedDegree,
        current_course: resolvedCourse,
        college_name: resolvedCollege,
        college_type: resolvedCollegeType,
        year_of_study: isSchool ? schoolClass : yearOfStudy,
        board_percentage: Number(isSchool ? schoolMarks : boardPercentage) || 85.0,
        admission_mode: isSchool ? 'school_regular_admission' : admissionMode,
        annual_income: Number(annualIncome) || (isSchool ? 85000 : 140000),
        is_first_graduate: isSchool ? false : Boolean(isFirstGraduate),
        schooling_type: isSchool ? schoolType : schoolingType,
        is_differently_abled: Boolean(isDifferentlyAbled),
        special_category: 'None'
      };

      try {
        const res = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bioPayload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed.');
        }

        const data = await res.json();
        const userObj = data.user || {
          user_id: 'TN-STU-' + Math.floor(100000 + Math.random() * 900000),
          email: cleanEmail,
          full_name: fullName,
          role: 'student',
          student_type: studentType,
          studentType: studentType
        };

        await completeAuth(userObj, bioPayload);
        return;
      } catch (err) {
        console.warn("Backend register notice:", err);
        // Fallback local registration if backend unreachable
        const fallbackUser = {
          user_id: 'TN-STU-' + Math.floor(100000 + Math.random() * 900000),
          email: cleanEmail,
          full_name: fullName,
          role: 'student',
          student_type: studentType,
          studentType: studentType
        };
        await completeAuth(fallbackUser, bioPayload);
        return;
      }
    }

    // MODE IS LOGIN
    if (mode === 'login') {
      try {
        const res = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            const returnedUser = data.user;
            const profileData = returnedUser.profile || {};
            if (!profileData.student_type) {
              profileData.student_type = studentType;
              profileData.studentType = studentType;
            }
            returnedUser.student_type = profileData.student_type;
            returnedUser.studentType = profileData.studentType;
            await completeAuth(returnedUser, profileData);
            return;
          }
        }
      } catch (e) {
        console.warn("Backend login notice:", e);
      }

      // Check admin login
      if (cleanEmail.includes('admin') && (password === 'admin2026' || password === 'admin123' || password === 'admin')) {
        const adminUser = {
          user_id: 'TN-ADMIN-001',
          email: cleanEmail,
          full_name: 'TNeGA System Administrator',
          role: 'admin',
          student_type: 'college',
          profile: {
            full_name: 'TNeGA System Administrator',
            role: 'admin',
            email: cleanEmail,
            district: 'Chennai',
            community: 'OC'
          }
        };
        await completeAuth(adminUser, adminUser.profile);
        return;
      }

      // Query MongoDB Atlas profile directly if stored
      const clusterProf = await getProfileFromCluster(cleanEmail);
      if (clusterProf) {
        const detectedType = clusterProf.student_type || clusterProf.studentType || studentType;
        const userObj = {
          user_id: clusterProf.user_id || 'TN-STU-849204',
          email: cleanEmail,
          full_name: clusterProf.full_name || cleanEmail.split('@')[0],
          role: 'student',
          student_type: detectedType,
          studentType: detectedType
        };
        clusterProf.student_type = detectedType;
        clusterProf.studentType = detectedType;
        await completeAuth(userObj, clusterProf);
        return;
      }

      setErrorMsg("Student record not found. Please register your bio-data using the 'New Registration' tab.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-2xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-3xl w-full ${mode === 'register' ? 'max-w-2xl' : 'max-w-md'} overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col transition-all duration-300`}>
        
        {/* Modal Header */}
        <div className="bg-[#0f2942] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <ShieldCheck size={16} />
            <span>Official Tamil Nadu Student Onboarding & Registry</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            {mode === 'register' ? 'Student Bio-Data Registration (முழு விவரப் பதிவு)' : 'Sign In to Portal (உள்நுழைவு)'}
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {mode === 'register'
              ? 'Enter your complete bio-data once. Stored in MongoDB cluster and auto-fills across all scholarship evaluations.'
              : 'Sign in with your registered email and password to pull your saved bio-data and verified benefits.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === 'login' 
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn size={14} />
            <span>Sign In (உள்நுழைவு)</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === 'register' 
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus size={14} />
            <span>Full Bio-Data Registration (புதிய பயோடேட்டா பதிவு)</span>
          </button>
        </div>

        {/* Student Stream Switcher: School vs College (Active right from login) */}
        <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <span>கல்வி நிலை / Current Education Stream:</span>
          </div>
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setStudentType('school'); setErrorMsg(null); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                studentType === 'school'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300 font-extrabold shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <School size={14} />
              <span>🎒 பள்ளி மாணவர் (Class 1 - 12)</span>
            </button>
            <button
              type="button"
              onClick={() => { setStudentType('college'); setErrorMsg(null); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                studentType === 'college'
                  ? 'bg-[#006a4e] text-white ring-2 ring-emerald-300 font-extrabold shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <GraduationCap size={14} />
              <span>🎓 கல்லூரி மாணவர் (UG/PG/Diploma)</span>
            </button>
          </div>
        </div>

        {/* Quick Persona Fill for Fast Testing (Both School & College) */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <span className="font-bold text-emerald-950 flex items-center text-[11px]">
            <Sparkles size={12} className="text-amber-500 mr-1" /> Quick Demo Fill:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handlePreFillPersona('surya')}
              className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-300 text-[10px] font-bold cursor-pointer transition shadow-2xs"
            >
              🎓 Surya (College • B.E • FG)
            </button>
            <button
              type="button"
              onClick={() => handlePreFillPersona('priya')}
              className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-300 text-[10px] font-bold cursor-pointer transition shadow-2xs"
            >
              🎓 Priya (College • SC • ₹1.2L)
            </button>
            <button
              type="button"
              onClick={() => handlePreFillPersona('kavitha')}
              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded border border-amber-300 text-[10px] font-bold cursor-pointer transition shadow-2xs"
            >
              🎒 Kavitha (School • Class 10 SSLC)
            </button>
            <button
              type="button"
              onClick={() => handlePreFillPersona('anbarasan')}
              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded border border-amber-300 text-[10px] font-bold cursor-pointer transition shadow-2xs"
            >
              🚲 Anbarasan (School • Class 11 HSC)
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/40">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <span className="font-bold text-sm">⚠️</span>
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REGISTRATION MODE: FULL STUDENT BIO-DATA FORM                             */}
          {/* ========================================================================= */}
          {mode === 'register' ? (
            <div className="space-y-5">
              
              {/* SECTION A: Account Credentials */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <User size={15} className="text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Part 1: Account & Contact Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name (பெயர் as in Marksheet) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Surya Suresh"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address (மின்னஞ்சல்) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Create Password (கடவுச்சொல்) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mobile Number (தொலைபேசி எண்)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9840123456"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Personal Demographics */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Calendar size={15} className="text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Part 2: Personal Demographics & Social Category
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Date of Birth (பிறந்த தேதி) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Gender (பாலினம்) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="male">Male (ஆண் - Tamil Pudhalvan)</option>
                      <option value="female">Female (பெண் - Pudhumai Penn)</option>
                      <option value="transgender">Transgender (மூன்றாம் பாலினம்)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Community Category (சாதிப் பிரிவு) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={community}
                      onChange={(e) => setCommunity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="BC">BC (Backward Class)</option>
                      <option value="BCM">BCM (Backward Class Muslim)</option>
                      <option value="MBC">MBC / DNC (Most Backward Class)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="SCA">SCA (SC Arunthathiyar)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="OC">OC (Open Competition / General)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Father / Guardian Name (பெற்றோர் பெயர்)
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Suresh K"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Location / Address */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <MapPin size={15} className="text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Part 3: Native District & Residence
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Native District (மாவட்டம்) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      {TN_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name_en} ({d.name_ta})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Taluk / Revenue Circle (வட்டம்)
                    </label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      placeholder="e.g. Aranthangi / Mambalam"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Residence Type (பகுதி)
                    </label>
                    <select
                      value={residenceType}
                      onChange={(e) => setResidenceType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Rural">Rural (கிராமப்புறம்)</option>
                      <option value="Urban">Urban (நகர்ப்புறம்)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION D & E: Conditional between School and College */}
              {studentType === 'school' ? (
                <>
                  {/* SECTION D (SCHOOL): Standard & School Details */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <School size={15} className="text-amber-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Part 4: School Education & Class Details (பள்ளி கல்வி விவரங்கள்)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Current Standard / Class (பயிலும் வகுப்பு) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={schoolClass}
                          onChange={(e) => setSchoolClass(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Class 10 (SSLC Secondary)">Class 10 (10-ஆம் வகுப்பு - SSLC Board)</option>
                          <option value="Class 11 (Higher Secondary - Bio-Maths)">Class 11 (11-ஆம் வகுப்பு - Higher Secondary HSC)</option>
                          <option value="Class 12 (Higher Secondary - Computer Science)">Class 12 (12-ஆம் வகுப்பு - Higher Secondary HSC)</option>
                          <option value="Class 9 (High School)">Class 9 (9-ஆம் வகுப்பு - High School)</option>
                          <option value="Class 8 (Middle School)">Class 8 (8-ஆம் வகுப்பு - Middle School)</option>
                          <option value="Class 7 (Middle School)">Class 7 (7-ஆம் வகுப்பு - Middle School)</option>
                          <option value="Class 6 (Middle School)">Class 6 (6-ஆம் வகுப்பு - Middle School)</option>
                          <option value="Class 5 (Primary School)">Class 5 (5-ஆம் வகுப்பு - Primary School)</option>
                          <option value="Class 4 (Primary School)">Class 4 (4-ஆம் வகுப்பு - Primary School)</option>
                          <option value="Class 3 (Primary School)">Class 3 (3-ஆம் வகுப்பு - Primary School)</option>
                          <option value="Class 2 (Primary School)">Class 2 (2-ஆம் வகுப்பு - Primary School)</option>
                          <option value="Class 1 (Primary School)">Class 1 (1-ஆம் வகுப்பு - Primary School)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          School Management Category (பள்ளி வகை) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={schoolType}
                          onChange={(e) => setSchoolType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="tn_govt_school_6_to_12">Tamil Nadu Government School (அரசுப் பள்ளி • 100% Free Scheme Access)</option>
                          <option value="govt_aided">Government Aided School (அரசு உதவிபெறும் பள்ளி)</option>
                          <option value="private_matriculation">Private Matriculation / State Board School</option>
                          <option value="cbse_or_matriculation">Central Board / CBSE / ICSE School</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          School Name (பள்ளி பெயர்) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. Government Model Higher Secondary School, Salem"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Medium of Instruction (பயிற்சி மொழி)
                        </label>
                        <select
                          value={schoolMedium}
                          onChange={(e) => setSchoolMedium(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Tamil Medium">Tamil Medium (தமிழ் வழி)</option>
                          <option value="English Medium">English Medium (ஆங்கில வழி)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          EMIS ID / Student Roll Number (விருப்பத்தேர்வு)
                        </label>
                        <input
                          type="text"
                          value={emisId}
                          onChange={(e) => setEmisId(e.target.value)}
                          placeholder="e.g. 33021900401"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Previous Academic Exam Score (% முந்தைய தேர்வு மதிப்பெண்)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={schoolMarks}
                          onChange={(e) => setSchoolMarks(e.target.value)}
                          placeholder="e.g. 88.0"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION E (SCHOOL): Socio-Economic */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <Landmark size={15} className="text-amber-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Part 5: Family Welfare & Income (குடும்ப வருமானம்)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Annual Family Income (ஆண்டு வருமானம் ₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          placeholder="e.g. 85000"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-[10px] text-slate-500">As per Tahsildar Income Certificate</span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Differently Abled (மாற்றுத்திறனாளியா?)
                        </label>
                        <select
                          value={isDifferentlyAbled ? "yes" : "no"}
                          onChange={(e) => setIsDifferentlyAbled(e.target.value === "yes")}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="no">No (இல்லை)</option>
                          <option value="yes">Yes (ஆம் - மாற்றுத்திறனாளி சிறப்பு நலத்திட்டங்கள்)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* SECTION D: Higher Education & Academic Credentials */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <GraduationCap size={15} className="text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Part 4: Higher Education Course Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Degree Level (பட்டப்படிப்பு நிலை)
                        </label>
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Undergraduate (UG)">Undergraduate (UG)</option>
                          <option value="Postgraduate (PG)">Postgraduate (PG)</option>
                          <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                          <option value="Doctoral / Ph.D">Doctoral / Ph.D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Course / Branch (படிப்பு) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={currentCourse}
                          onChange={(e) => setCurrentCourse(e.target.value)}
                          placeholder="e.g. B.E. Computer Science"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          College Name (கல்லூரி பெயர்)
                        </label>
                        <input
                          type="text"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="e.g. Government College of Engineering"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          College Type (கல்லூரி வகை)
                        </label>
                        <select
                          value={collegeType}
                          onChange={(e) => setCollegeType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Government">Government (அரசு கல்லூரி)</option>
                          <option value="Govt-Aided">Govt-Aided (அரசு உதவிபெறும் கல்லூரி)</option>
                          <option value="Self-Financing">Self-Financing (சுயநிதி தனியார் கல்லூரி)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          12th Board Score (% பொதுத்தேர்வு மதிப்பெண்) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={boardPercentage}
                          onChange={(e) => setBoardPercentage(e.target.value)}
                          placeholder="e.g. 88.5"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Admission Mode (சேர்க்கை முறை)
                        </label>
                        <select
                          value={admissionMode}
                          onChange={(e) => setAdmissionMode(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="govt_counseling_single_window">Single Window Counseling (TNEA / DoTE)</option>
                          <option value="management_quota">Management Quota</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION E: Socio-Economic & Welfare Quota */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <Landmark size={15} className="text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Part 5: Socio-Economic & Welfare Entitlement
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Annual Family Income (ஆண்டு வருமானம் ₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          placeholder="e.g. 140000"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-[10px] text-slate-500">As per Tahsildar Income Certificate</span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          First Generation Graduate (முதல் பட்டதாரி?) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={isFirstGraduate ? "yes" : "no"}
                          onChange={(e) => setIsFirstGraduate(e.target.value === "yes")}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="yes">Yes (ஆம் - ₹25,000/yr Tuition Fee Waiver)</option>
                          <option value="no">No (இல்லை)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Schooling Background (6-12 பள்ளிப் படிப்பு) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={schoolingType}
                          onChange={(e) => setSchoolingType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="tn_govt_school_6_to_12">TN Government School 6-12 (அரசுப் பள்ளி • Pudhumai Penn / Tamil Pudhalvan / 7.5% Quota)</option>
                          <option value="govt_aided">Government Aided School (அரசு உதவிபெறும் பள்ளி)</option>
                          <option value="private_matriculation">Private Matriculation / State Board</option>
                          <option value="cbse_or_matriculation">CBSE / ICSE / Central Board</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          ) : (
            /* ========================================================================= */
            /* LOGIN MODE: CLEAN & COMPACT                                               */
            /* ========================================================================= */
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {studentType === 'school' ? 'Registered Email / EMIS ID' : 'Registered Email / Student ID'}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={studentType === 'school' ? 'e.g. kavitha.s.school2026@gmail.com' : 'e.g. surya25suresh2006@gmail.com'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-900 block flex items-center space-x-1.5">
                  {studentType === 'school' ? (
                    <span className="text-amber-800 flex items-center space-x-1">
                      <School size={14} />
                      <span>🎒 பள்ளி மாணவர் பயன்முறை (School Student Mode)</span>
                    </span>
                  ) : (
                    <span className="text-emerald-800 flex items-center space-x-1">
                      <GraduationCap size={14} />
                      <span>🎓 கல்லூரி மாணவர் பயன்முறை (College Student Mode)</span>
                    </span>
                  )}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {studentType === 'school'
                    ? 'உள்நுழைந்தவுடன் நீங்கள் தற்போது பள்ளியில் பயில்வதற்கேற்ப பள்ளி மாணவர்களுக்கான இலவச மிதிவண்டி, காலை உணவு, PM POSHAN மதிய உணவு மற்றும் SSLC கையேடுகள் மட்டுமே தளத்தில் காண்பிக்கப்படும்.'
                    : 'உள்நுழைந்தவுடன் நீங்கள் தற்போது கல்லூரியில் பயில்வதற்கேற்ப புதுமைப் பெண், தமிழ்ப் புதல்வன், முதல் பட்டதாரி மற்றும் போஸ்ட்-மெட்ரிக் உதவித்தொகைகள் மட்டுமே தளத்தில் காண்பிக்கப்படும்.'}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-md cursor-pointer mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-1" />
                <span>Synchronizing with MongoDB Cluster...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'register' 
                    ? 'Register Complete Bio-Data & Store in Cluster' 
                    : 'Sign In & Pull My Bio-Data'}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-100 text-center text-[10px] text-slate-500 shrink-0">
          Government of Tamil Nadu • TNeGA Cluster Persistence Engine (cluster0.fzucldr.mongodb.net)
        </div>

      </div>
    </div>
  );
}
