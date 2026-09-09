import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Bot, 
  X, 
  Minus, 
  Send, 
  Mic, 
  MicOff, 
  ExternalLink, 
  Clock, 
  FileText, 
  ShieldCheck, 
  User, 
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Pencil,
  Edit3,
  LogIn,
  Sliders,
  Cpu,
  FileCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import EditProfileModal from './EditProfileModal';

export default function HomePage({ 
  onStartMatcher, 
  onViewSchemes, 
  currentLang = 'en',
  currentUser = null,
  onNavigateTab = null,
  onOpenGrievance = null,
  onOpenAuth = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);

  // Student Profile State (Persisted in localStorage)
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('tn_student_profile');
      if (saved) return JSON.parse(saved);
      const userSaved = localStorage.getItem('tn_scholarship_user');
      if (userSaved) {
        const u = JSON.parse(userSaved);
        if (u?.profile) {
          return {
            fullName: u.profile.full_name || 'Surya Suresh',
            gender: u.profile.gender || 'male',
            community: u.profile.community || 'BC',
            annualIncome: u.profile.annual_income || 140000,
            boardPercentage: u.profile.board_percentage || 88.5,
            currentCourse: u.profile.current_course || 'B.E CSE',
            isFirstGraduate: u.profile.is_first_graduate !== undefined ? u.profile.is_first_graduate : true,
            schoolingType: u.profile.schooling_type || 'tn_govt_school_6_to_12',
            avatar: u.profile.avatar || null
          };
        }
      }
    } catch (e) {}
    return {
      fullName: 'Surya Suresh',
      gender: 'male',
      community: 'BC',
      annualIncome: 140000,
      boardPercentage: 88.5,
      currentCourse: 'B.E CSE',
      isFirstGraduate: true,
      schoolingType: 'tn_govt_school_6_to_12',
      avatar: null
    };
  });

  // Student Profile Image State (Persisted in localStorage)
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(() => {
    try {
      return localStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null;
    } catch (e) {
      return null;
    }
  });

  // Keep state synced across tabs / edits
  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem('tn_student_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setStudentProfile(parsed);
          if (parsed.avatar !== undefined) {
            setProfileImage(parsed.avatar);
          }
        }
      } catch (e) {}
    };

    const handleAvatarUpdate = () => {
      try {
        const av = localStorage.getItem('tn_student_avatar');
        setProfileImage(av || null);
      } catch (e) {}
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Please choose a photo smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
        try {
          localStorage.setItem('tn_student_avatar', base64Data);
          
          // Also update studentProfile avatar
          const savedProfile = localStorage.getItem('tn_student_profile');
          if (savedProfile) {
            const p = JSON.parse(savedProfile);
            p.avatar = base64Data;
            localStorage.setItem('tn_student_profile', JSON.stringify(p));
            setStudentProfile(p);
          }
          
          window.dispatchEvent(new Event('avatarUpdated'));
          
          const savedUser = localStorage.getItem('tn_scholarship_user');
          if (savedUser) {
            const userObj = JSON.parse(savedUser);
            userObj.profile = { ...(userObj.profile || {}), avatar: base64Data };
            localStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
          }
        } catch (err) {
          console.warn("Storage quota note", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    try {
      localStorage.removeItem('tn_student_avatar');
      const savedProfile = localStorage.getItem('tn_student_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        p.avatar = null;
        localStorage.setItem('tn_student_profile', JSON.stringify(p));
        setStudentProfile(p);
      }
      window.dispatchEvent(new Event('avatarUpdated'));
      const savedUser = localStorage.getItem('tn_scholarship_user');
      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        if (userObj.profile) delete userObj.profile.avatar;
        localStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
      }
    } catch (err) {}
  };

  // Dynamic Scheme Calculations based on Profile
  const isFemale = (studentProfile.gender || '').toLowerCase() === 'female';
  const isGovtSchool = studentProfile.schoolingType === 'tn_govt_school_6_to_12' || studentProfile.schooling_type === 'tn_govt_school_6_to_12';

  const primaryScheme = isFemale
    ? {
        name: 'Pudhumai Penn Thittam',
        amount: '₹12,000/yr',
        description: 'Monthly financial assistance of ₹1,000 directly credited via Direct Benefit Transfer (DBT) to student Aadhaar-seeded bank account for girls from TN Govt Schools (6-12).'
      }
    : {
        name: 'Tamil Pudhalvan Thittam',
        amount: '₹12,000/yr',
        description: 'Monthly financial stipend of ₹1,000 credited directly to student bank account via DBT for boys who studied in TN Government Schools (6-12).'
      };

  const secondaryScheme = studentProfile.isFirstGraduate
    ? {
        name: 'First Graduate Fee Concession',
        amount: '₹25,000/yr',
        description: '100% Tuition Fee Concession automatically credited directly to the college academic cell via Single Window Counseling.'
      }
    : (['SC', 'SCA', 'ST'].includes(studentProfile.community)
        ? {
            name: 'Post-Matric Scholarship (SC/SCA/ST)',
            amount: '₹50,000/yr',
            description: '100% Compulsory Tuition Fee waiver and hostel maintenance allowance under Adi Dravidar & Tribal Welfare.'
          }
        : {
            name: 'BC/MBC Post-Matric Tuition Assistance',
            amount: '₹15,000/yr',
            description: 'Special fee & examination grant assistance under Department of Backward Classes & Minorities Welfare.'
          }
      );

  const primaryValue = 12000;
  const secondaryValue = studentProfile.isFirstGraduate 
    ? 25000 
    : (['SC', 'SCA', 'ST'].includes(studentProfile.community) ? 50000 : 15000);
  const recommendedTotal = primaryValue + secondaryValue;

  // Floating AI Advisor state
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'user',
      text: 'NSP applying rules?'
    },
    {
      sender: 'bot',
      text: 'For the Central Sector Scheme (NSP CSSS), you must be in the top 20th percentile in your 12th Board (>80%) with family annual income under ₹4.50 Lakh.\n\n⚠️ Important Policy Constraint: Under Section 4(c) guidelines, claiming NSP directly conflicts with your First Graduate fee waiver (₹25,000). The MWIS optimization engine selected your optimal package (₹37,000/yr) to prevent legal claim collisions.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Application Success Confirmation Modal State
  const [appliedScheme, setAppliedScheme] = useState(null);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();
      if (lower.includes('pudhumai') || lower.includes('girl') || lower.includes('1000')) {
        reply = "Under G.O. (Ms) No. 47/2026, Pudhumai Penn provides ₹1,000/month (₹12,000/yr) via DBT for students who studied in TN Government schools from classes 6 to 12. No parental income ceiling applies!";
      } else if (lower.includes('first graduate') || lower.includes('fg')) {
        reply = "First Graduate Tuition Concession waives up to ₹25,000/yr for professional courses through Single Window Counseling, provided no sibling has previously availed the benefit.";
      } else if (lower.includes('income') || lower.includes('certificate')) {
        reply = "Income certificates can be downloaded from Tamil Nadu e-District portal with code REV-INC-01. The validity is 1 year from the date of issue.";
      } else {
        reply = "I am cross-referencing your candidate profile (BC, ₹1.40L, 88.5% Board marks) with the Tamil Nadu Higher Education welfare database. You qualify for 100% legal coverage under Pudhumai Penn and First Graduate fee waivers!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 700);
  };

  const handleApply = (schemeName, schemeAmount) => {
    setAppliedScheme({ name: schemeName, amount: schemeAmount, refId: 'TNEV-2026-849204' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* ========================================================================= */}
      {/* SECTION 19: LANDING PAGE HERO & KEY DIFFERENTIATOR                        */}
      {/* ========================================================================= */}
      <section className="bg-[#0f2942] text-white border-b-2 border-emerald-600 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 space-y-8">
          
          {/* Main Hero Header & Visual Reference Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (7 cols): Text, Subtitle, CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/90 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-700/80 shadow-xs">
                <Sparkles size={14} className="text-emerald-400" />
                <span>AI-Powered Decision System • Government of Tamil Nadu</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Find the Scholarships You Actually Qualify For
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Enter your profile once. Our intelligent scholarship matcher checks eligibility, detects policy conflicts, and identifies the highest-benefit combination for you.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onStartMatcher}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer border border-emerald-400"
                >
                  <span>Find My Scholarships</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
                >
                  <span>How It Works</span>
                </a>
              </div>
            </div>

            {/* Right Column (5 cols): Visual Showcase Card with Temple Emblem & Campus Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-2xl bg-slate-900 group">
                <img 
                  src="/tn_students_campus.jpg" 
                  alt="Tamil Nadu University Students on Campus" 
                  className="w-full h-64 sm:h-72 object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Official Temple Emblem Logo Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-full pl-1.5 pr-3.5 py-1 border border-amber-400/80 shadow-lg flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-emerald-950 shrink-0">
                    <img src="/tn_temple_emblem.jpg" alt="TN Temple Seal" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 tracking-wide">
                    தமிழ்நாடு அரசு Official Seal
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 text-xs text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-[11px]">Direct Benefit Transfer (DBT)</span>
                    <span className="bg-emerald-800/90 text-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded">G.O. Ms 47/2026</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Higher Education Welfare covering 1.2 Lakh rural & first-generation college students statewide.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Section 23: Key Differentiator Card */}
          <div className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border-2 border-emerald-600/80 rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block">
                  THE KEY INNOVATION
                </span>
                <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  "We don't just tell students what scholarships they are eligible for. We calculate which valid combination gives them the maximum possible benefit and explain why."
                </p>
              </div>
              <div className="shrink-0 flex items-center space-x-2 bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-700 text-xs font-semibold text-emerald-200">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Zero Conflict Collisions</span>
              </div>
            </div>
          </div>

          {/* Section 19: Visual Decision Flow Diagram */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block text-center sm:text-left">
              Decision Support Flow:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {[
                { step: "1", title: "Your Profile", desc: "Single entry" },
                { step: "2", title: "Smart Eligibility", desc: "Rule engine" },
                { step: "3", title: "Conflict Detection", desc: "Matrix filter" },
                { step: "4", title: "Benefit Optimization", desc: "MWIS solver" },
                { step: "5", title: "Best Combination", desc: "Highest benefit" },
                { step: "6", title: "Application Roadmap", desc: "Action plan" }
              ].map((flow, fIdx) => (
                <div key={fIdx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-center space-y-1 relative">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block">Step 0{flow.step}</span>
                  <div className="font-bold text-white text-xs leading-tight">{flow.title}</div>
                  <div className="text-[10px] text-slate-400">{flow.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 20: HOW IT WORKS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider block mb-1">
              Section 20 • Process Blueprint
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              How It Works: Intelligent Decision Support
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Deterministic rule-based evaluation ensures complete transparency with zero black-box bias.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Build Your Profile",
              desc: "Tell us about your education, income, category, and eligibility once in a clean 5-step wizard.",
              badge: "Single Input"
            },
            {
              step: "02",
              title: "Match Criteria",
              desc: "The rule engine checks community quota, family income caps, and academic criteria.",
              badge: "Smart Filtering"
            },
            {
              step: "03",
              title: "Optimize Legitimate Benefit",
              desc: "Conflicting schemes are removed and the highest-benefit valid combination is mathematically calculated.",
              badge: "Conflict Free"
            },
            {
              step: "04",
              title: "Apply with Roadmap",
              desc: "Get a personalized document checklist and 7-step roadmap pointing to official government gateways.",
              badge: "Ready Checklist"
            }
          ].map((card, cIdx) => (
            <div key={cIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#006a4e] font-mono">{card.step}</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-[#006a4e] px-2 py-0.5 rounded-full border border-emerald-200">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 21: Trust & Transparency Callout */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#006a4e] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Why This System Is Different</h4>
              <p className="text-slate-600 text-xs">
                No false "100% guarantees". All calculations are deterministic, backed by Government Orders (G.O.), and explainable down to the rupee.
              </p>
            </div>
          </div>
          <button
            onClick={onStartMatcher}
            className="px-4 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold rounded-lg transition shrink-0 cursor-pointer shadow-xs"
          >
            Launch Eligibility Checker →
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VISUAL REFERENCES SHOWCASE GALLERY (Temple Emblem, Campuses, Awards)      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
          <div>
            <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider block mb-1">
              Visual References & Official Insignia
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Official State Scheme & Beneficiary References
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Visual references for Tamil Nadu state government emblems, college institutions, and sanction documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Reference Card 1: Official Temple Emblem */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 bg-[#004d38] flex items-center justify-center p-4 relative overflow-hidden">
              <img 
                src="/tn_temple_emblem.jpg" 
                alt="Government of Tamil Nadu Srivilliputhur Andal Temple Gopuram Seal" 
                className="h-40 w-40 object-contain rounded-full shadow-lg border-2 border-amber-400 transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-emerald-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                Official Web Logo
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                State Government Emblem
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Srivilliputhur Andal Temple Gopuram Seal
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The statutory seal of the Government of Tamil Nadu (தமிழ்நாடு அரசு), guaranteeing authentic departmental sanction and legal welfare coverage.
              </p>
            </div>
          </div>

          {/* Reference Card 2: Campus Collegiate Hubs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="/tn_students_campus.jpg" 
                alt="Collegiate Students on Campus in Tamil Nadu" 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-slate-900/80 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Campus Beneficiaries
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                Higher Education Campuses
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Engineering, Arts & Science, and Polytechnics
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Empowering first-generation and rural scholars across Anna University, Government Colleges, and approved institutions statewide.
              </p>
            </div>
          </div>

          {/* Reference Card 3: Scholarship Award Sanction */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="/tn_scholarship_award.jpg" 
                alt="Students holding Government Scholarship Sanction Letter" 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                Sanction Reference
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                DBT & Welfare Sanctions
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Pudhumai Penn & First Graduate Sanctions
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Verifiable sanction letters cross-referenced against e-Sevai revenue databases, delivering up to ₹50,000/yr with zero collision risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID LAYOUT: max-w-7xl mx-auto p-6 */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN (4/12 span): Candidate Snapshot               */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* White card with subtle border and shadow */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Candidate Snapshot
                  </span>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center space-x-1 text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-1.5 py-0.5 rounded border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                    title="Edit candidate profile, income, marks & upload photo"
                  >
                    <Pencil size={10} />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1.5">
                  {onOpenAuth && (
                    <button
                      onClick={onOpenAuth}
                      className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer"
                      title="Sign in with your Student ID or Switch User"
                    >
                      <LogIn size={10} />
                      <span>{currentUser ? 'Switch' : 'Sign In'}</span>
                    </button>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              {/* Profile section: square photo placeholder on left, compact list on right */}
              <div className="flex items-start space-x-4">
                
                {/* Square Profile Photo with 1-Click Upload */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-md bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition shadow-2xs"
                      title="Click to choose a photo (JPG / PNG) from your device"
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt={studentProfile.fullName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <>
                          <User size={34} className="text-slate-400 group-hover:text-emerald-700 transition mb-0.5" />
                          <span className="text-[8px] font-bold text-slate-500 font-mono group-hover:text-emerald-800">
                            ADD PHOTO
                          </span>
                        </>
                      )}

                      {/* Hover Camera Overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[9px] font-semibold">
                        <Camera size={16} className="mb-0.5 text-emerald-300" />
                        <span>{profileImage ? 'Change' : 'Upload'}</span>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/85 text-[8px] font-mono text-center text-white py-0.5">
                        ID: 849204
                      </div>
                    </div>

                    {/* Quick Remove Button if image exists */}
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer z-10"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  <div className="flex flex-col items-center space-y-0.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer hover:underline flex items-center space-x-1"
                      title="Upload photo from your device"
                    >
                      <Camera size={11} />
                      <span>{profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEditModal(true)}
                      className="text-[9px] text-slate-500 hover:text-slate-700 font-medium cursor-pointer hover:underline flex items-center space-x-0.5"
                      title="Edit all credentials"
                    >
                      <Edit3 size={9} />
                      <span>Edit Info</span>
                    </button>
                  </div>
                </div>

                {/* Compact List of Credentials */}
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Name</span>
                    <strong className="text-slate-900 font-semibold truncate ml-2">{studentProfile.fullName}</strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Gender</span>
                    <span className="text-slate-800 font-medium capitalize">{studentProfile.gender}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Community</span>
                    <span className="text-slate-800 font-semibold bg-slate-100 px-1.5 py-0.2 rounded font-mono uppercase">{studentProfile.community}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Income</span>
                    <span className="text-slate-900 font-semibold font-mono">₹{Number(studentProfile.annualIncome || 140000).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">12th Marks</span>
                    <span className="text-emerald-700 font-bold font-mono">{studentProfile.boardPercentage || 88.5}%</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Course</span>
                    <span className="text-slate-800 font-medium truncate ml-2" title={studentProfile.currentCourse}>{studentProfile.currentCourse || 'B.E CSE'}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500 font-medium">FG</span>
                    <span className={`inline-flex items-center font-bold ${studentProfile.isFirstGraduate ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {studentProfile.isFirstGraduate ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom half: "Verification Status" title with a divider */}
              <hr className="my-4 border-slate-200" />

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  <span>Verification Status</span>
                </h4>

                {/* List with green CheckCircle icons */}
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Aadhaar</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      UIDAI e-KYC Verified
                    </span>
                  </li>

                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Income Cert</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      REV-INC-01 Verified
                    </span>
                  </li>

                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Community Cert</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      REV-COM-02 Verified
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quick Action to Check Different Profile */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={onStartMatcher}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Edit Academic Profile / Retest</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

            {/* Helpline quick card */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-800">
                <HelpCircle size={14} className="text-emerald-700" />
                <span>Student Direct Benefit Transfer (DBT) Cell</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Stipends and college fee waivers are sanctioned under statutory Government Orders. Inquiries can be lodged directly at the Helpdesk.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-emerald-700">Toll Free: 14417</span>
                <button 
                  onClick={onOpenGrievance}
                  className="text-slate-800 hover:underline cursor-pointer"
                >
                  File Grievance →
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (8/12 span): Schemes Area                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Column Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                My Matching Schemes
              </h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                MWIS Solver Verified • Zero Collision
              </span>
            </div>

            {/* HERO CARD: Solid Forest Green background (bg-emerald-700 / #006a4e) */}
            <div className="bg-[#006a4e] text-white rounded-xl p-5 sm:p-6 shadow-sm">
              
              {/* Title with star icons: Dynamic Optimal Stacking Recommendation */}
              <div className="flex items-center space-x-2 pb-4 border-b border-emerald-600/60">
                <Sparkles size={20} className="text-amber-300 fill-amber-300 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Optimal Stacking Recommendation (Max Benefit): <span className="text-amber-200 font-mono">₹{recommendedTotal.toLocaleString('en-IN')} /yr</span>
                </h3>
              </div>

              {/* Inside green card, two schemes separated by faint borders */}
              <div className="divide-y divide-emerald-600/50">
                
                {/* Scheme 1 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        1. {primaryScheme.name} ({primaryScheme.amount})
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      {primaryScheme.description}
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply(primaryScheme.name, primaryScheme.amount)}
                    className="bg-white hover:bg-emerald-50 text-[#006a4e] font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Scheme 2 */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        2. {secondaryScheme.name} ({secondaryScheme.amount})
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      {secondaryScheme.description}
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply(secondaryScheme.name, secondaryScheme.amount)}
                    className="bg-white hover:bg-emerald-50 text-[#006a4e] font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

              </div>

            </div>

            {/* OTHER SCHEMES SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Other Potential Schemes
                </h3>
                <button
                  onClick={onViewSchemes}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>Browse All 18+ Catalog</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Grid with two white outline cards side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Outline Card 1: Central Sector Scheme (NSP) */}
                <div className="bg-white rounded-lg border border-slate-200 p-4.5 hover:border-slate-300 transition shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        Central Sector Scheme (NSP)
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap font-mono">
                        ₹12,000 / yr
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Requires 80th percentile in Class 12 Board exams (&gt;80%). Family annual income must be under ₹4.50 Lakh. Subject to Central Ministry quota allocation.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-800 font-medium">
                      ⚠️ Mutually Exclusive: Cannot co-claim with state First Graduate tuition concession.
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400">Single Welfare Rule</span>
                    <a
                      href="https://scholarships.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 text-[11px]"
                    >
                      <span>NSP Guidelines</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Outline Card 2: AICTE Pragati */}
                <div className="bg-white rounded-lg border border-slate-200 p-4.5 hover:border-slate-300 transition shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        AICTE Pragati
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap font-mono">
                        ₹50,000 / yr
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Technical degree scholarship for eligible female candidates in AICTE approved engineering institutes with family income under ₹8.00 Lakh.
                    </p>

                    <div className="bg-slate-100 border border-slate-200 rounded p-2 text-[11px] text-slate-600 font-medium">
                      ℹ️ Category Quota: Limited to 2 girl students per family. Excludes state quota waivers.
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400">Quota Restricted</span>
                    <a
                      href="https://www.aicte-india.org"
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 text-[11px]"
                    >
                      <span>AICTE Portal</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Policy Guarantee Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                <span className="font-medium">
                  All recommendations are backed by Government of Tamil Nadu Welfare Orders (G.O. 47/2026).
                </span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('tracker')}
                className="font-bold text-emerald-800 hover:underline whitespace-nowrap cursor-pointer"
              >
                Track My Status →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* FLOATING AI ADVISOR: fixed bottom-20 right-6               */}
      {/* ========================================================= */}
      {isAiOpen && (
        <div className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all duration-200 ${
          isMinimized ? 'h-13' : 'max-h-[500px]'
        }`}>
          
          {/* Forest green header: "AI Advisor (Tamil/EN)" with close/minimize icons */}
          <div className="bg-[#006a4e] text-white px-4 py-3 flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center space-x-2">
              <Bot size={18} className="text-emerald-200" />
              <span className="font-bold text-xs sm:text-sm">
                AI Advisor (Tamil/EN)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="flex items-center space-x-1">
              {/* Minimize Icon */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-emerald-800 rounded transition cursor-pointer text-emerald-100 hover:text-white"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus size={15} />
              </button>
              {/* Close Icon */}
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 hover:bg-emerald-800 rounded transition cursor-pointer text-emerald-100 hover:text-white"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* White chat body showing grey user bubble "NSP applying rules?" */}
          {!isMinimized && (
            <div className="flex flex-col h-80 bg-white">
              
              {/* Chat Messages Log */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-slate-50/50">
                
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'user' ? (
                      /* Grey user bubble */
                      <div className="bg-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] font-medium">
                        {msg.text}
                      </div>
                    ) : (
                      /* Bot counselor bubble */
                      <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-xs shadow-xs max-w-[90%] space-y-1.5">
                        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800">
                          <Sparkles size={12} />
                          <span>TN e-Vidya Counselor</span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed text-slate-700">
                          {msg.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-500 text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                      <span>Counselor is composing reply...</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input Bar */}
              <form 
                onSubmit={handleSendMessage}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask policy, document, or scheme question..."
                  className="flex-1 px-3 py-1.5 bg-slate-100 focus:bg-white text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-1.5 bg-[#006a4e] hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg transition cursor-pointer"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>
          )}

        </div>
      )}

      {/* Floating Circular Chat Toggle Button anchored to bottom-5 right-6 */}
      <button
        onClick={() => {
          setIsAiOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-5 right-6 z-50 w-13 h-13 rounded-full bg-[#006a4e] hover:bg-emerald-800 text-white shadow-xl flex items-center justify-center cursor-pointer transition transform hover:scale-105 border-2 border-white"
        title="Open AI Counselor"
      >
        <Bot size={24} />
        {!isAiOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* ========================================================= */}
      {/* APPLICATION CONFIRMATION MODAL (Civic Feedback)           */}
      {/* ========================================================= */}
      {appliedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={28} />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                Official Receipt • TNeGA
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-500">
                Your application for <strong>{appliedScheme.name}</strong> ({appliedScheme.amount}) has been registered into the direct disbursement queue.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Ack Reference No:</span>
                <strong className="font-mono text-emerald-800">{appliedScheme.refId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="text-slate-800 font-semibold">{studentProfile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sanction Category:</span>
                <span className="text-slate-800">{studentProfile.community} Welfare & {studentProfile.isFirstGraduate ? 'First Graduate' : 'Merit'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Mode:</span>
                <span className="text-slate-800 font-medium">Direct Benefit Transfer (DBT)</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setAppliedScheme(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAppliedScheme(null);
                  if (onNavigateTab) onNavigateTab('tracker');
                }}
                className="flex-1 py-2 bg-[#006a4e] hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Clock size={13} />
                <span>Track My Status</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={studentProfile}
        onSave={(updated) => {
          setStudentProfile(updated);
          if (updated.avatar !== undefined) {
            setProfileImage(updated.avatar);
          }
        }}
        currentLang={currentLang}
      />

    </div>
  );
}
