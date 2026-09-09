import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  Compass, 
  FileText, 
  Layers, 
  HelpCircle, 
  Globe, 
  Search, 
  X, 
  Bell, 
  LogOut,
  LogIn,
  Bot,
  Sliders,
  ShieldCheck,
  QrCode,
  Database
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

// Official Tamil Nadu Government Emblem Component (Generated Srivilliputhur Gopuram Symbol)
function TNEmblem({ className = "w-10 h-10" }) {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-amber-400 shadow-sm shrink-0 bg-emerald-950 flex items-center justify-center ${className}`}>
      <img 
        src="/tn_temple_emblem.jpg" 
        alt="Government of Tamil Nadu Temple Emblem" 
        className="w-full h-full object-cover scale-105"
      />
    </div>
  );
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onToggleChat,
  isChatOpen,
  currentLang = 'en',
  onSelectLang,
  onOpenNotices,
  onOpenGrievance,
  onOpenAdmin,
  onOpenScanner,
  onOpenEligibilityChecker,
  dbStatus,
  onOpenDbConfig
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [showSearch, setShowSearch] = useState(false);

  // Student name dynamically reactive to sessionStorage and user edits
  const [profileName, setProfileName] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tn_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) return parsed.fullName;
      }
    } catch (e) {}
    return currentUser?.profile?.full_name || currentUser?.email?.split('@')[0] || "";
  });

  // Real-time Student Profile Photo State
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return sessionStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const updateProfile = () => {
      try {
        const saved = sessionStorage.getItem('tn_student_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) setProfileName(parsed.fullName);
        } else {
          setProfileName(currentUser?.profile?.full_name || currentUser?.email?.split('@')[0] || "");
        }
        setAvatarImage(sessionStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null);
      } catch (e) {}
    };
    window.addEventListener('profileUpdated', updateProfile);
    window.addEventListener('avatarUpdated', updateProfile);
    return () => {
      window.removeEventListener('profileUpdated', updateProfile);
      window.removeEventListener('avatarUpdated', updateProfile);
    };
  }, [currentUser]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      setCurrentTab('schemes');
    }
  };

  const toggleLanguage = () => {
    onSelectLang(currentLang === 'ta' ? 'en' : 'ta');
  };

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      
      {/* 1. TOP HEADER (NAVY): bg-slate-900 / #0f2942, white text */}
      <div className="bg-[#0f2942] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left Side: TN Emblem placeholder & Official Government Titles */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Placeholder for TN Emblem */}
            <TNEmblem className="w-10 h-10 sm:w-11 sm:h-11" />

            <div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide">
                {currentLang === 'ta' ? 'தமிழ்நாடு அரசு • உயர்கல்வித் துறை' : 'தமிழ்நாடு அரசு | Government of Tamil Nadu'}
              </div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white leading-tight group-hover:text-emerald-300 transition">
                {currentLang === 'ta' ? 'தமிழ்நாடு இ-வித்யா | நலத்திட்டம் & கல்வி உதவித்தொகை தளம்' : 'TN e-Vidya | Scholarship & Welfare Portal'}
              </h1>
            </div>
          </div>

          {/* Right Side: Cloud Cluster Badge, EN/Tamil toggle, profile name Surya Suresh, Connected */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live Cloud Cluster Connection Pill */}
            <button
              onClick={onOpenDbConfig}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/60 text-white px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer group"
              title="Cloud Database Cluster Status (MongoDB Atlas cluster0.fzucldr & Cloud Firestore). Click to inspect connection."
            >
              <Database size={13} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-300 font-bold hidden sm:inline">{currentLang === 'ta' ? 'கிளவுட் கிளஸ்டர்' : 'Cloud Cluster'}</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                {currentLang === 'ta' ? 'நேரலை' : 'LIVE'}
              </span>
            </button>

            {/* "EN / தமிழ்" Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 sm:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Toggle Regional Language (English / தமிழ்)"
            >
              <Globe size={13} className="text-emerald-400" />
              <span>{currentLang === 'ta' ? 'தமிழ்' : 'EN'} / {currentLang === 'ta' ? 'EN' : 'தமிழ்'}</span>
            </button>

            {/* Profile / Login Section */}
            {currentUser ? (
              <>
                <div 
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center space-x-2 cursor-pointer group"
                  title="View Student Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center border border-emerald-500 shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition overflow-hidden shrink-0">
                    {avatarImage ? (
                      <img src={avatarImage} alt={profileName} className="w-full h-full object-cover" />
                    ) : (
                      profileName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition hidden xs:inline">
                    {profileName}
                  </span>
                </div>

                {/* Green dot indicating "Connected (Student/Admin Login)" */}
                <div className="hidden md:flex items-center space-x-1.5 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-emerald-300 font-medium whitespace-nowrap">
                    {currentUser?.role === 'admin' 
                      ? (currentLang === 'ta' ? 'இணைக்கப்பட்டது (நிர்வாகி)' : 'Connected (Admin)') 
                      : (currentLang === 'ta' ? 'இணைக்கப்பட்டது (மாணவர்)' : 'Connected (Student)')}
                  </span>
                </div>

                {/* Quick Account Switcher */}
                <button
                  onClick={onOpenAuth}
                  className="hidden lg:flex items-center space-x-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md border border-slate-700 transition cursor-pointer"
                  title="Switch or Sign In to another account"
                >
                  <User size={12} />
                  <span>{currentLang === 'ta' ? 'மாற்று' : 'Switch'}</span>
                </button>

                {/* Logout button */}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  title="Sign Out / வெளியேறு"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              /* If NOT Logged In: Prominent Sign In button */
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg border border-emerald-400 shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                title="Student / Admin Sign In (உள்நுழைவு)"
              >
                <LogIn size={13} />
                <span>{currentLang === 'ta' ? 'உள்நுழைவு' : 'Sign In / உள்நுழைவு'}</span>
              </button>
            )}

          </div>

        </div>

        {/* Expandable Mobile Search Bar */}
        {showSearch && (
          <div className="px-4 pb-3 pt-1 border-t border-slate-800 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                placeholder="Search schemes (e.g. Pudhumai Penn, First Graduate)..."
                className="w-full pl-8 pr-4 py-1.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </form>
          </div>
        )}
      </div>

      {/* 2. SECONDARY NAVBAR (FOREST GREEN): Solid green bg-emerald-700 / #006a4e */}
      <nav className="bg-[#006a4e] text-white shadow-xs border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-1">
          
          {/* Horizontal Flex Layout with Lucide Icons */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 py-1 text-xs font-semibold whitespace-nowrap">
            
            {/* 1. Home */}
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
            >
              <Home size={15} />
              <span>{t.nav_home || 'Home'}</span>
            </button>

            {/* 2. Student Bio-Data Form */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
              title="View, enter, and edit full student bio-data form"
            >
              <FileText size={15} />
              <span>{currentLang === 'ta' ? 'பயோடேட்டா படிவம்' : 'Bio-Data Form'}</span>
            </button>

            {/* 3. Eligibility Checker (Directly Evaluates from Saved Profile) */}
            <button
              onClick={() => onOpenEligibilityChecker ? onOpenEligibilityChecker() : setCurrentTab('matcher')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'matcher' || currentTab === 'results'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
              title="Calculate scholarship eligibility directly from your saved bio-data"
            >
              <Compass size={15} />
              <span>{currentLang === 'ta' ? 'தகுதி சரிபார்ப்பு' : 'Eligibility Checker'}</span>
            </button>

            {/* 4. My Applications */}
            <button
              onClick={() => setCurrentTab('tracker')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'tracker'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
            >
              <FileText size={15} />
              <span>{t.nav_tracker || 'My Applications'}</span>
            </button>

            {/* 5. Scheme Catalog */}
            <button
              onClick={() => setCurrentTab('schemes')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'schemes'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
            >
              <Layers size={15} />
              <span>{t.nav_schemes || 'Scheme Catalog'}</span>
            </button>

            {/* 6. Helpdesk */}
            <button
              onClick={onOpenGrievance}
              className="px-3 py-1.5 rounded-md flex items-center space-x-1.5 text-emerald-100 hover:text-white hover:bg-emerald-600/70 transition cursor-pointer"
              title="Citizen Grievance & Student Helpdesk"
            >
              <HelpCircle size={15} />
              <span>{t.nav_grievance || 'Helpdesk'}</span>
            </button>

            {/* 7. Admin & Rule Builder (Restricted to Government Admins Only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin || (() => setCurrentTab('admin'))}
                className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                    : 'text-amber-200 hover:text-white hover:bg-emerald-600/70'
                }`}
                title="Government Administrator Rule Builder & Scheme Configuration"
              >
                <Sliders size={15} className="text-amber-300" />
                <span>{currentLang === 'ta' ? 'நிர்வாகி விதிகள்' : 'Admin Rules'}</span>
              </button>
            )}

            {/* If not logged in, also show Sign In in secondary nav */}
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-md flex items-center space-x-1.5 bg-emerald-950/80 text-amber-300 hover:text-white hover:bg-emerald-900 border border-amber-400/40 font-bold transition cursor-pointer"
              >
                <LogIn size={15} />
                <span>{t.nav_login || (currentLang === 'ta' ? 'உள்நுழைவு' : 'Sign In')}</span>
              </button>
            )}

          </div>

          {/* Right Side in Secondary Nav: Quick e-Sevai Scanner & Circulars */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenScanner}
              className="px-2.5 py-1 text-[11px] font-bold text-amber-200 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 rounded-md transition flex items-center space-x-1.5 border border-amber-400/50 cursor-pointer shadow-xs"
              title="e-Sevai Document Scanner & Live Multi-Field Cross-Verification"
            >
              <QrCode size={13} className="text-amber-300" />
              <span>{currentLang === 'ta' ? 'இ-சேவை சரிபார்ப்பு' : 'e-Sevai Verify'}</span>
              <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1 py-0.2 rounded font-mono">LIVE</span>
            </button>

            <button
              onClick={onOpenNotices}
              className="hidden lg:flex px-2.5 py-1 text-[11px] font-semibold text-emerald-100 hover:text-white bg-emerald-800/80 hover:bg-emerald-800 rounded-md transition items-center space-x-1.5 border border-emerald-600/50 cursor-pointer"
              title="Official Government Orders (G.O.) & Gazettes"
            >
              <Bell size={12} className="text-amber-300" />
              <span>{currentLang === 'ta' ? 'அரசாணைகள்' : 'Official Circulars'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            </button>
          </div>

        </div>
      </nav>

    </header>
  );
}
