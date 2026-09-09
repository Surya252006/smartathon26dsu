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
  Bot
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

// Official Tamil Nadu Government Emblem Component
function TNEmblem({ className = "w-10 h-10" }) {
  return (
    <div className={`rounded-full bg-emerald-950 border-2 border-amber-400/90 flex items-center justify-center p-1 shadow-xs shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="3" fill="#004d38" />
        <circle cx="50" cy="50" r="42" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Gopuram (Temple Tower) tiers */}
        <rect x="30" y="70" width="40" height="12" rx="1" fill="#fbbf24" />
        <rect x="34" y="60" width="32" height="10" rx="1" fill="#fef3c7" />
        <rect x="38" y="50" width="24" height="10" rx="1" fill="#fbbf24" />
        <rect x="42" y="40" width="16" height="10" rx="1" fill="#fef3c7" />
        <polygon points="50,22 45,40 55,40" fill="#fbbf24" />
        <circle cx="50" cy="20" r="3" fill="#fbbf24" />

        {/* Gopuram Gateway Door */}
        <path d="M46 82 V 72 Q 50 68 54 72 V 82 Z" fill="#004d38" />

        {/* Flanking Laurel Wreath */}
        <path d="M22 48 Q 28 36 40 32" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78 48 Q 72 36 60 32" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
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
  onSearch,
  searchQuery,
  onOpenNotices,
  onOpenGrievance
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [showSearch, setShowSearch] = useState(false);

  // Student name dynamically reactive to localStorage and user edits
  const [profileName, setProfileName] = useState(() => {
    try {
      const saved = localStorage.getItem('tn_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) return parsed.fullName;
      }
    } catch (e) {}
    return currentUser?.profile?.full_name || currentUser?.email?.split('@')[0] || "Surya Suresh";
  });

  // Real-time Student Profile Photo State
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return localStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const updateProfile = () => {
      try {
        const saved = localStorage.getItem('tn_student_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) setProfileName(parsed.fullName);
        }
        setAvatarImage(localStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null);
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
                தமிழ்நாடு அரசு | Government of Tamil Nadu
              </div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white leading-tight group-hover:text-emerald-300 transition">
                TN e-Vidya | Scholarship & Welfare Portal
              </h1>
            </div>
          </div>

          {/* Right Side: EN/Tamil toggle, profile name Surya Suresh, green dot Connected */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* "EN / தமிழ்" Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 sm:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Toggle Regional Language (English / தமிழ்)"
            >
              <Globe size={13} className="text-emerald-400" />
              <span>{currentLang === 'ta' ? 'தமிழ்' : 'EN'} / {currentLang === 'ta' ? 'EN' : 'தமிழ்'}</span>
            </button>

            {/* Profile Section: Avatar & Name "Surya Suresh" */}
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

            {/* Green dot indicating "Connected (Student Login)" */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-emerald-300 font-medium whitespace-nowrap">
                Connected (Student Login)
              </span>
            </div>

            {/* Search Toggle Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition sm:hidden"
              title="Search Schemes"
            >
              <Search size={16} />
            </button>

            {/* Logout button if authenticated */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
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

            {/* 2. My Profile */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
            >
              <User size={15} />
              <span>{t.nav_profile || 'My Profile'}</span>
            </button>

            {/* 3. Eligibility Checker */}
            <button
              onClick={() => setCurrentTab('matcher')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition cursor-pointer ${
                currentTab === 'matcher' || currentTab === 'results'
                  ? 'bg-emerald-800 text-white font-bold shadow-inner ring-1 ring-emerald-600'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-600/70'
              }`}
            >
              <Compass size={15} />
              <span>{t.nav_matcher || 'Eligibility Checker'}</span>
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

          </div>

          {/* Right Side in Secondary Nav: Quick Notice Board Trigger & Search */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onOpenNotices}
              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-100 hover:text-white bg-emerald-800/80 hover:bg-emerald-800 rounded-md transition flex items-center space-x-1.5 border border-emerald-600/50 cursor-pointer"
              title="Official Government Orders (G.O.) & Gazettes"
            >
              <Bell size={12} className="text-amber-300" />
              <span>Official Circulars</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            </button>
          </div>

        </div>
      </nav>

    </header>
  );
}
