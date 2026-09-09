import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  PhoneCall, 
  Globe, 
  Compass, 
  Home, 
  FileText, 
  Bot, 
  Search, 
  Database,
  CheckCircle2,
  AlertCircle,
  X,
  Bell,
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

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
  dbStatus,
  onOpenDbConfig,
  onOpenNotices,
  onOpenGrievance
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      setCurrentTab('schemes');
    }
  };

  const isMongoConnected = dbStatus?.mongodb?.connected;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      
      {/* Top Utility Bar (Official Government Portal style) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-emerald-400">{t.govt_title}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-400">{t.dept_title}</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-emerald-300 font-medium font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">TNeGA Secure Portal • Ver 2.4</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Database Status Indicator - Visible ONLY for Admin role */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenDbConfig}
                className="flex items-center space-x-1.5 hover:text-white transition px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 cursor-pointer"
                title="Admin Control: Configure MongoDB Atlas or SQLite Sync"
              >
                <Database size={11} className={isMongoConnected ? "text-emerald-400" : "text-amber-400"} />
                <span className="hidden xs:inline text-[10px]">
                  {isMongoConnected ? "MongoDB Atlas: Live" : "DB: SQLite (Sync Ready)"}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isMongoConnected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
              </button>
            )}

            <a href="tel:14417" className="flex items-center hover:text-white transition">
              <PhoneCall size={12} className="mr-1 text-emerald-400" />
              <span>{t.student_helpline}: <strong className="text-white">14417</strong></span>
            </a>

            {/* Official G.O. & Helpdesk Quick Links */}
            <button
              onClick={onOpenNotices}
              className="hidden md:flex items-center space-x-1.5 hover:text-white transition px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] cursor-pointer"
              title="Official Circulars & Government Orders"
            >
              <Bell size={11} className="text-amber-400" />
              <span>G.O. Circulars</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>

            <button
              onClick={onOpenGrievance}
              className="hidden sm:flex items-center space-x-1.5 hover:text-white transition px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] cursor-pointer"
              title="Citizen Grievance & Student Helpdesk"
            >
              <HelpCircle size={11} className="text-emerald-400" />
              <span>Helpdesk</span>
            </button>

            {/* Regional Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-0.5 rounded border border-slate-700 text-[11px] font-medium transition cursor-pointer"
              >
                <Globe size={12} className="text-emerald-400" />
                <span>{languages.find(l => l.code === currentLang)?.native || 'English'}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-slate-800 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                    Select Language
                  </div>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLang(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between transition cursor-pointer ${
                        currentLang === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/50' : ''
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Official Urgent Announcement Ticker Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-slate-800 text-[11px] py-1.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-600 text-white uppercase tracking-wider shrink-0 animate-pulse">
              Active G.O.
            </span>
            <span className="truncate font-medium text-slate-800">
              {currentLang === 'ta' 
                ? 'அரசாணை எண் 47/2026: முதல் பட்டதாரி & புதுமைப் பெண் மூன்றாம் கட்ட விண்ணப்பங்கள் துவக்கம்! கடைசி தேதி: அக் 31.' 
                : 'G.O. (Ms) 47/2026: Pudhumai Penn Phase-III & First Graduate fee waiver portal active. Application window open.'}
            </span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 text-[11px]">
            <button
              onClick={onOpenNotices}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 flex items-center space-x-1 cursor-pointer"
            >
              <span>{currentLang === 'ta' ? 'அறிவிப்பை காண்க' : 'View Circulars'}</span>
            </button>
            <span className="text-slate-300 hidden xs:inline">|</span>
            <button
              onClick={() => setCurrentTab('tracker')}
              className="font-bold text-slate-700 hover:text-slate-950 underline underline-offset-2 hidden xs:inline cursor-pointer"
            >
              <span>{currentLang === 'ta' ? 'விண்ணப்ப நிலை' : 'Track Status'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Authority Seal */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                {t.portal_name}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 hidden xs:inline">
                Official
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden lg:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Global Search Box (Handwritten Note #6) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm mx-4 relative items-center"
        >
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            onFocus={() => {
              if (currentTab !== 'schemes') setCurrentTab('schemes');
            }}
            placeholder={t.search_placeholder}
            className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearch && onSearch('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </form>

        {/* Center Nav Links */}
        <nav className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              currentTab === 'home' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home size={14} />
            <span>{t.nav_home}</span>
          </button>

          <button
            onClick={() => setCurrentTab('matcher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              currentTab === 'matcher' || currentTab === 'results'
                ? 'bg-emerald-50 text-emerald-800 font-bold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass size={14} />
            <span>{t.nav_matcher}</span>
          </button>

          <button
            onClick={() => setCurrentTab('schemes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              currentTab === 'schemes' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText size={14} />
            <span>{t.nav_schemes}</span>
          </button>

          <button
            onClick={() => setCurrentTab('tracker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              currentTab === 'tracker' 
                ? 'bg-emerald-50 text-emerald-800 font-bold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Clock size={14} />
            <span>{t.nav_tracker}</span>
          </button>

          <button
            onClick={onOpenNotices}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 relative cursor-pointer"
            title="Official Government Orders & Circulars"
          >
            <Bell size={14} className="text-amber-600" />
            <span>{t.nav_notices}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1"></span>
          </button>

          <button
            onClick={onOpenGrievance}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
            title="Citizen Grievance & Student Helpdesk"
          >
            <HelpCircle size={14} className="text-emerald-600" />
            <span>{t.nav_grievance}</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setCurrentTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                currentTab === 'profile' 
                  ? 'bg-emerald-50 text-emerald-800 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User size={14} />
              <span>{t.nav_profile}</span>
            </button>
          )}
        </nav>

        {/* Right Actions: AI Assistant & Auth */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* AI Side Assistant Toggle Button */}
          <button
            onClick={onToggleChat}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs cursor-pointer ${
              isChatOpen
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Bot size={15} />
            <span className="hidden sm:inline">{t.nav_ai_advisor}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setCurrentTab('profile')}
                className="flex items-center space-x-2 text-left hover:opacity-85 transition cursor-pointer group"
                title="View My Student Profile / என் விவரம்"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs group-hover:ring-2 group-hover:ring-emerald-500 transition shadow-xs">
                  {(currentUser.profile?.full_name || currentUser.email || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="text-right hidden md:block">
                  <span className="block text-xs font-bold text-slate-900 truncate max-w-[110px] group-hover:text-emerald-700 transition">
                    {currentUser.profile?.full_name || currentUser.email}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {currentUser.role === 'admin' ? 'Administrator' : (currentUser.profile?.community || 'Student')}
                  </span>
                </div>
              </button>
              <button
                onClick={onLogout}
                title={t.nav_logout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-xs cursor-pointer"
            >
              <User size={14} />
              <span>{t.nav_login}</span>
            </button>
          )}

        </div>

      </div>

      {/* Mobile Search Input & Quick Action Pills */}
      <div className="md:hidden px-4 pb-2.5 pt-1 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            onFocus={() => {
              if (currentTab !== 'schemes') setCurrentTab('schemes');
            }}
            placeholder={t.search_placeholder}
            className="w-full pl-8 pr-4 py-1.5 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <button
            onClick={() => setCurrentTab('tracker')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium flex items-center space-x-1 border cursor-pointer ${
              currentTab === 'tracker' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Clock size={12} />
            <span>{t.nav_tracker}</span>
          </button>
          <button
            onClick={onOpenNotices}
            className="px-2.5 py-1 rounded-full whitespace-nowrap font-medium flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200 cursor-pointer"
          >
            <Bell size={12} className="text-amber-600" />
            <span>{t.nav_notices}</span>
          </button>
          <button
            onClick={onOpenGrievance}
            className="px-2.5 py-1 rounded-full whitespace-nowrap font-medium flex items-center space-x-1 bg-emerald-50 text-emerald-900 border border-emerald-200 cursor-pointer"
          >
            <HelpCircle size={12} className="text-emerald-600" />
            <span>{t.nav_grievance}</span>
          </button>
        </div>
      </div>

    </header>
  );
}
