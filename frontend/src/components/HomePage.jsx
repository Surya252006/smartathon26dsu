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
  Trash2
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function HomePage({ 
  onStartMatcher, 
  onViewSchemes, 
  currentLang = 'en',
  currentUser = null,
  onNavigateTab = null,
  onOpenGrievance = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Student Profile Image State (Persisted in localStorage)
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(() => {
    try {
      return localStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null;
    } catch (e) {
      return null;
    }
  });

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
      window.dispatchEvent(new Event('avatarUpdated'));
      const savedUser = localStorage.getItem('tn_scholarship_user');
      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        if (userObj.profile) delete userObj.profile.avatar;
        localStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
      }
    } catch (err) {}
  };

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
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Candidate Snapshot
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Profile
                </span>
              </div>

              {/* Profile section: square photo placeholder on left, compact list on right */}
              <div className="flex items-start space-x-4">
                
                {/* Square Profile Photo with 1-Click Upload */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-md bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition shadow-2xs"
                      title="Click to upload your student photo (JPG/PNG)"
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Surya Suresh" 
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

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-emerald-700 font-semibold cursor-pointer hover:underline flex items-center space-x-1 mt-1.5"
                  >
                    <Camera size={10} />
                    <span>{profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>
                </div>

                {/* Compact List of Credentials */}
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Name</span>
                    <strong className="text-slate-900 font-semibold truncate ml-2">Surya Suresh</strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Gender</span>
                    <span className="text-slate-800 font-medium">Male</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Community</span>
                    <span className="text-slate-800 font-semibold bg-slate-100 px-1.5 py-0.2 rounded font-mono">BC</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Income</span>
                    <span className="text-slate-900 font-semibold font-mono">₹1,40,000</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">12th Marks</span>
                    <span className="text-emerald-700 font-bold font-mono">88.5%</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">Course</span>
                    <span className="text-slate-800 font-medium truncate ml-2">B.E CSE</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500 font-medium">FG</span>
                    <span className="inline-flex items-center text-emerald-700 font-bold">Yes</span>
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
              
              {/* Title with star icons: "Optimal Stacking Recommendation (Max Benefit): ₹37,000 /yr" */}
              <div className="flex items-center space-x-2 pb-4 border-b border-emerald-600/60">
                <Sparkles size={20} className="text-amber-300 fill-amber-300 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Optimal Stacking Recommendation (Max Benefit): <span className="text-amber-200 font-mono">₹37,000 /yr</span>
                </h3>
              </div>

              {/* Inside green card, two schemes separated by faint borders */}
              <div className="divide-y divide-emerald-600/50">
                
                {/* Scheme 1: Pudhumai Penn Thittam (₹12,000/yr) */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        1. Pudhumai Penn Thittam (₹12,000/yr)
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      Monthly financial assistance of ₹1,000 directly credited via Direct Benefit Transfer (DBT) to student Aadhaar-seeded bank account.
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply('Pudhumai Penn Thittam', '₹12,000/yr')}
                    className="bg-white hover:bg-emerald-50 text-[#006a4e] font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Scheme 2: First Graduate Fee Concession (₹25,000/yr) */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        2. First Graduate Fee Concession (₹25,000/yr)
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      100% Tuition Fee Concession automatically credited directly to the college academic cell via Single Window Counseling.
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply('First Graduate Fee Concession', '₹25,000/yr')}
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
                <span className="text-slate-800 font-semibold">Surya Suresh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sanction Category:</span>
                <span className="text-slate-800">BC Welfare & First Graduate</span>
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

    </div>
  );
}
