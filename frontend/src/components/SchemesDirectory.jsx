import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Laptop,
  Bus,
  Home,
  BookOpen,
  GraduationCap,
  Landmark,
  Building2,
  Award,
  Globe2,
  Layers,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import defaultSchemesCatalog from '../data/allSchemesCatalog.json';

export default function SchemesDirectory({ 
  onBackToHome, 
  onApplyWithProfile, 
  searchQuery: externalSearchQuery = '',
  onSearchChange,
  currentLang = 'en',
  currentUser = null,
  currentProfile = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const isTa = currentLang === 'ta';

  // Detect student stream from logged in account or bio profile
  const userStream = currentUser?.student_type || currentUser?.profile?.student_type || currentProfile?.student_type || currentProfile?.studentType;
  const courseStr = String(currentProfile?.current_course || currentProfile?.currentCourse || currentProfile?.school_class || currentProfile?.schoolClass || currentProfile?.degree || '').toLowerCase();
  const isSchoolUser = userStream === 'school' || (userStream !== 'college' && /class|school|primary|middle|secondary|sslc|hsc|வகுப்பு|பள்ளி|std/i.test(courseStr));
  const isCollegeUser = userStream === 'college' || (userStream !== 'school' && /engineering|degree|ug|pg|diploma|college|b\.e|b\.tech|arts|கல்லூரி/i.test(courseStr));

  // Initialize with bundled 50+ official Tamil Nadu schemes so public link works 100% offline & online
  const [schemes, setSchemes] = useState(defaultSchemesCatalog || []);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [fundingTab, setFundingTab] = useState('all'); // 'all' | 'css' | 'central_sector' | 'state_only' | 'mixed'
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(() => {
    if (isSchoolUser) return 'school';
    if (isCollegeUser) return 'college';
    return 'all';
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync if profile stream switches or updates
  useEffect(() => {
    if (isSchoolUser) setSelectedLevel('school');
    else if (isCollegeUser) setSelectedLevel('college');
  }, [userStream, isSchoolUser, isCollegeUser]);

  // Sync external search query from navbar if changed
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    // Attempt local backend refresh with timeout; fallback is already active
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch('http://localhost:8000/api/schemes?reload=true', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (Array.isArray(data) && data.length > 0) {
          setSchemes(data);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        // Default schemes catalog is already active!
      });
  }, []);

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  // Department list dynamically derived or standard 8 departments
  const departmentsList = [
    { key: 'all', label: isTa ? 'அனைத்து துறைகளும்' : 'All Implementing Departments (அனைத்து துறைகளும்)' },
    { key: 'adw', label: isTa ? 'ஆதிதிராவிடர் & பழங்குடியினர் நலத்துறை' : 'Adi Dravidar & Tribal Welfare (ஆதிதிராவிடர் & பழங்குடியினர் நலத்துறை)', match: 'Adi Dravidar' },
    { key: 'bc_mbc', label: isTa ? 'பிற்படுத்தப்பட்டோர் நலத்துறை' : 'BC, MBC & Minorities Welfare (பிற்படுத்தப்பட்டோர் நலத்துறை)', match: 'Backward Classes' },
    { key: 'school_edu', label: isTa ? 'பள்ளிக் கல்வித் துறை' : 'School Education Department (பள்ளிக் கல்வித் துறை)', match: 'School Education' },
    { key: 'higher_edu', label: isTa ? 'கல்லூரி & உயர்கல்வித் துறை' : 'Collegiate & Higher Education (கல்லூரி & உயர்கல்வித் துறை)', match: 'Collegiate' },
    { key: 'differently_abled', label: isTa ? 'மாற்றுத்திறனாளிகள் நலத்துறை' : 'Differently Abled Welfare (மாற்றுத்திறனாளிகள் நலத்துறை)', match: 'Differently Abled' },
    { key: 'technical_edu', label: isTa ? 'தொழில்நுட்பக் கல்வி இயக்ககம் (DOTE)' : 'Technical Education - DOTE (தொழில்நுட்பக் கல்வி இயக்ககம்)', match: 'Technical Education' },
    { key: 'social_welfare', label: isTa ? 'சமூக நலம் & மகளிர் உரிமை' : 'Social Welfare & Women (சமூக நலம் & மகளிர் உரிமை)', match: 'Social Welfare' },
    { key: 'sports', label: isTa ? 'விளையாட்டு மேம்பாட்டு ஆணையம் (SDAT)' : 'Youth Welfare & Sports - SDAT (விளையாட்டு மேம்பாட்டு ஆணையம்)', match: 'Sports' }
  ];

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: schemes.length,
      css: schemes.filter(s => s.funding_type?.includes('CSS') || s.funding_type?.includes('Centrally Sponsored')).length,
      central_sector: schemes.filter(s => s.funding_type?.includes('Central Sector')).length,
      state_only: schemes.filter(s => s.funding_type?.includes('State-Only') || s.funding_type?.includes('Tamil Nadu-Only')).length,
      mixed: schemes.filter(s => s.funding_type?.includes('Mixed') || s.funding_type?.includes('Flagged')).length
    };
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        scheme.name?.toLowerCase().includes(q) ||
        scheme.name_ta?.toLowerCase().includes(q) ||
        scheme.portal_name?.toLowerCase().includes(q) ||
        scheme.id?.toLowerCase().includes(q) ||
        scheme.department?.toLowerCase().includes(q) ||
        scheme.target_beneficiaries?.toLowerCase().includes(q);

      // Funding Tab
      let matchesFunding = true;
      if (fundingTab === 'css') {
        matchesFunding = scheme.funding_type?.includes('CSS') || scheme.funding_type?.includes('Centrally Sponsored');
      } else if (fundingTab === 'central_sector') {
        matchesFunding = scheme.funding_type?.includes('Central Sector');
      } else if (fundingTab === 'state_only') {
        matchesFunding = scheme.funding_type?.includes('State-Only') || scheme.funding_type?.includes('Tamil Nadu-Only');
      } else if (fundingTab === 'mixed') {
        matchesFunding = scheme.funding_type?.includes('Mixed') || scheme.funding_type?.includes('Flagged');
      }

      // Department filter
      let matchesDept = true;
      if (selectedDept !== 'all') {
        const foundDept = departmentsList.find(d => d.key === selectedDept);
        if (foundDept && foundDept.match) {
          matchesDept = scheme.department?.toLowerCase().includes(foundDept.match.toLowerCase());
        }
      }

      // Community filter
      let matchesCommunity = true;
      if (selectedCommunity !== 'all') {
        const eligible = scheme.criteria?.eligible_communities || [];
        matchesCommunity = eligible.includes(selectedCommunity);
      }

      // Education Level filter
      let matchesLevel = true;
      const courses = scheme.criteria?.allowed_courses || [];
      const d_lower = String(scheme.department || "").toLowerCase();
      const t_lower = String(scheme.target_beneficiaries || "").toLowerCase();
      const name_lower = String(scheme.name || "").toLowerCase();
      const id_lower = String(scheme.id || "").toLowerCase();

      const isSchoolScheme = courses.some(c => /class|school|primary|middle|secondary|sslc|hsc/i.test(c)) ||
        d_lower.includes("school") ||
        t_lower.includes("school") ||
        t_lower.includes("class") ||
        id_lower.includes("school") ||
        id_lower.includes("bicycle") ||
        id_lower.includes("breakfast") ||
        id_lower.includes("poshan") ||
        id_lower.includes("textbook") ||
        id_lower.includes("pre-matric") ||
        id_lower.includes("nmms") ||
        name_lower.includes("school") ||
        name_lower.includes("bicycle");

      if (selectedLevel === 'college') {
        matchesLevel = !isSchoolScheme && (courses.includes('Engineering') || courses.includes('Arts & Science') || courses.includes('Diploma') || courses.includes('Medical') || courses.includes('All') || courses.some(c => /undergraduate|postgraduate|degree|college/i.test(c)));
      } else if (selectedLevel === 'school') {
        matchesLevel = isSchoolScheme;
      } else if (selectedLevel === 'differently_abled') {
        matchesLevel = scheme.criteria?.differently_abled_only === true;
      }

      return matchesSearch && matchesFunding && matchesDept && matchesCommunity && matchesLevel;
    });
  }, [schemes, searchQuery, fundingTab, selectedDept, selectedCommunity, selectedLevel]);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* 1. Header & Title */}
      <div className="border-b border-slate-200 pb-6">
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-1 mb-2.5 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{t.nav_home}</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Landmark size={20} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {isTa ? 'தமிழ்நாடு அரசு மாணவர் நலத்திட்டங்கள் — ஒருங்கிணைந்த தகவல் களஞ்சியம்' : 'Tamil Nadu Student Schemes — Combined Master Reference'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              {isTa 
                ? 'அனைத்து மத்திய (CSS), 100% மத்திய துறை மற்றும் தமிழ்நாடு மாநில நிதியுதவி பெறும் 47+ மாணவர் நலத்திட்டங்களின் முழுமையான அதிகாரப்பூர்வ பட்டியல்.' 
                : 'Complete official catalogue of 47 Student Welfare Schemes (September 2026 Reference) spanning Centrally Sponsored (CSS), 100% Central Sector, and Tamil Nadu State-funded programs across 8 Government departments.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isTa ? `${filteredSchemes.length} / ${schemes.length} திட்டங்கள் செயலில் உள்ளன` : `${filteredSchemes.length} of ${schemes.length} Schemes Active`}</span>
            </span>
          </div>
        </div>

        {/* 2. Official Combined Statistics KPI Cards (Part 3 of Reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <div 
            onClick={() => setFundingTab('all')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              fundingTab === 'all' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
              {isTa ? 'மொத்த திட்டங்கள்' : 'Total Schemes'}
            </div>
            <div className="text-2xl font-black mt-0.5">{counts.all}</div>
            <div className="text-[10px] mt-0.5 opacity-70">
              {isTa ? 'ஒருங்கிணைந்த பட்டியல்' : 'Deduplicated Master List'}
            </div>
          </div>

          <div 
            onClick={() => setFundingTab('css')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              fundingTab === 'css' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
              {isTa ? 'மத்திய-மாநில இணை நிதி (CSS)' : 'CSS (Centre + State)'}
            </div>
            <div className="text-2xl font-black mt-0.5">{counts.css}</div>
            <div className="text-[10px] mt-0.5 opacity-70">
              {isTa ? '60:40 அல்லது 75:25 நிதி' : '60:40 or 75:25 Funding'}
            </div>
          </div>

          <div 
            onClick={() => setFundingTab('central_sector')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              fundingTab === 'central_sector' 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
              {isTa ? '100% மத்திய அரசு நிதி' : 'Central Sector'}
            </div>
            <div className="text-2xl font-black mt-0.5">{counts.central_sector}</div>
            <div className="text-[10px] mt-0.5 opacity-70">
              {isTa ? 'மத்திய அரசு நேரடி நிதி' : '100% GoI Funded'}
            </div>
          </div>

          <div 
            onClick={() => setFundingTab('state_only')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              fundingTab === 'state_only' 
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
              {isTa ? '100% தமிழக அரசு நிதி' : 'TN State-Only'}
            </div>
            <div className="text-2xl font-black mt-0.5">{counts.state_only}</div>
            <div className="text-[10px] mt-0.5 opacity-70">
              {isTa ? 'தமிழ்நாடு அரசு முழு நிதி' : '100% Tamil Nadu Funded'}
            </div>
          </div>

          <div 
            onClick={() => setFundingTab('mixed')}
            className={`p-3.5 rounded-xl border transition cursor-pointer col-span-2 sm:col-span-1 ${
              fundingTab === 'mixed' 
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
              {isTa ? 'கலப்பு / சிறப்பு திட்டங்கள்' : 'Mixed / Flagged'}
            </div>
            <div className="text-2xl font-black mt-0.5">{counts.mixed}</div>
            <div className="text-[10px] mt-0.5 opacity-70">
              {isTa ? 'விடுதிகள் & மானியங்கள்' : 'State Hostels & Grants'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Multi-Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        
        {/* Search Input and Select Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box (6 cols) */}
          <div className="relative md:col-span-5">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder={isTa ? 'திட்டப் பெயர், துறை, அல்லது முக்கிய வார்த்தை கொண்டு தேடவும்...' : 'Search by scheme name, Tamil title, department, or keyword...'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => handleSearchInput('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter (4 cols) */}
          <div className="md:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
            >
              {departmentsList.map(dept => (
                <option key={dept.key} value={dept.key}>{dept.label}</option>
              ))}
            </select>
          </div>

          {/* Community Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{isTa ? 'அனைத்து சமூகம் (All Communities)' : 'All Communities (அனைத்து சமூகம்)'}</option>
              <option value="SC">{isTa ? 'SC (ஆதிதிராவிடர்)' : 'SC (Scheduled Caste)'}</option>
              <option value="ST">{isTa ? 'ST (பழங்குடியினர்)' : 'ST (Scheduled Tribe)'}</option>
              <option value="BC">{isTa ? 'BC (பிற்படுத்தப்பட்டோர்)' : 'BC (Backward Classes)'}</option>
              <option value="MBC">{isTa ? 'MBC / DNC (மிகவும் பிற்படுத்தப்பட்டோர்)' : 'MBC / DNC (Most Backward Classes)'}</option>
              <option value="OC">{isTa ? 'OC / EWS (பொதுப் பிரிவு)' : 'OC (General / EWS)'}</option>
            </select>
          </div>
        </div>

        {/* Level / Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              {isTa ? 'படிப்பு நிலை:' : 'Level:'}
            </span>
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedLevel === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTa ? 'அனைத்து நிலைகள்' : 'All Levels'}
            </button>
            <button
              onClick={() => setSelectedLevel('college')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedLevel === 'college' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTa ? '🎓 கல்லூரி & உயர்கல்வி' : '🎓 College & Higher Ed'}
            </button>
            <button
              onClick={() => setSelectedLevel('school')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedLevel === 'school' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTa ? '🏫 பள்ளி (1-12 வகுப்பு)' : '🏫 School (Class 1–12)'}
            </button>
            <button
              onClick={() => setSelectedLevel('differently_abled')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedLevel === 'differently_abled' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTa ? '♿ மாற்றுத்திறனாளிகள்' : '♿ Differently Abled'}
            </button>
          </div>

          {/* Quick Search Shortcut Tags */}
          <div className="flex items-center gap-1 text-xs text-slate-500 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-400">
              {isTa ? 'விரைவு:' : 'Quick:'}
            </span>
            <button
              onClick={() => handleSearchInput('Pudhumai Penn')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] transition cursor-pointer"
            >
              🌸 Pudhumai Penn
            </button>
            <button
              onClick={() => handleSearchInput('Tamil Pudhalvan')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] transition cursor-pointer"
            >
              👨‍🎓 Tamil Pudhalvan
            </button>
            <button
              onClick={() => handleSearchInput('Laptop')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] transition cursor-pointer"
            >
              💻 Vetri Laptop
            </button>
            <button
              onClick={() => handleSearchInput('Bicycle')}
              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] transition cursor-pointer"
            >
              🚲 Free Bicycle
            </button>
            <button
              onClick={() => handleSearchInput('Breakfast')}
              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded text-[11px] transition cursor-pointer"
            >
              🥣 CM Breakfast
            </button>
            <button
              onClick={() => handleSearchInput('Pre-Matric')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] transition cursor-pointer"
            >
              🎒 Pre-Matric
            </button>
            <button
              onClick={() => handleSearchInput('Overseas')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] transition cursor-pointer"
            >
              ✈️ NOS Overseas
            </button>
            {(searchQuery || selectedDept !== 'all' || selectedCommunity !== 'all' || selectedLevel !== 'all' || fundingTab !== 'all') && (
              <button
                onClick={() => {
                  handleSearchInput('');
                  setSelectedDept('all');
                  setSelectedCommunity('all');
                  setSelectedLevel('all');
                  setFundingTab('all');
                }}
                className="text-[11px] text-red-600 font-bold ml-2 hover:underline cursor-pointer"
              >
                {isTa ? 'அனைத்தையும் மீட்டமை' : 'Reset All'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic Stream Indicator Banner */}
      {(isSchoolUser || isCollegeUser || userStream) && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
          selectedLevel === 'school'
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : (selectedLevel === 'college'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-900')
        }`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {selectedLevel === 'school' ? '🎒' : (selectedLevel === 'college' ? '🎓' : '📚')}
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider flex items-center space-x-2">
                <span>
                  {selectedLevel === 'school'
                    ? (isTa ? 'பள்ளி மாணவர் திட்டங்கள் மட்டுமே காட்டப்படுகின்றன' : 'Showing Only School Student Schemes (Classes 1–12)')
                    : (selectedLevel === 'college'
                        ? (isTa ? 'கல்லூரி & உயர்கல்வி திட்டங்கள் மட்டுமே காட்டப்படுகின்றன' : 'Showing Only College & Higher Education Schemes (UG/PG/Diploma)')
                        : (isTa ? 'அனைத்து கல்வி திட்டங்களும் காட்டப்படுகின்றன' : 'Showing Schemes for All Education Levels'))}
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold border border-slate-200 shadow-2xs">
                  {filteredSchemes.length} {isTa ? 'திட்டங்கள்' : 'Schemes'}
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isTa
                  ? `உங்கள் பயோடேட்டாவின் தற்போதைய கல்வி நிலைக்கு (${currentProfile?.current_course || currentProfile?.school_class || (selectedLevel === 'school' ? 'பள்ளி' : 'கல்லூரி')}) உகந்த திட்டங்கள் பிரத்தியேகமாக வடிகட்டப்பட்டுள்ளன.`
                  : `Filtered specifically for your active study enrollment (${currentProfile?.current_course || currentProfile?.school_class || (selectedLevel === 'school' ? 'School' : 'College')}).`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            {selectedLevel !== 'all' ? (
              <button
                type="button"
                onClick={() => setSelectedLevel('all')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition cursor-pointer"
              >
                {isTa ? 'அனைத்து 47+ திட்டங்களையும் காண்க' : 'Show All 47+ Catalog'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedLevel(isSchoolUser ? 'school' : 'college')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition cursor-pointer"
              >
                {isTa ? 'எனது கல்வித் திட்டங்களுக்கு மட்டும் திரும்பு' : 'Lock Back to My Study Level'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Schemes Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>{isTa ? '47+ தமிழ்நாடு & மத்திய அரசு உதவித்தொகை திட்டங்கள் ஏற்றப்படுகின்றன...' : 'Loading verified 47 Tamil Nadu & Central student schemes...'}</span>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-3">
          <p className="text-base font-semibold text-slate-700">
            {isTa ? 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளுக்கு எந்தத் திட்டமும் பொருந்தவில்லை.' : 'No schemes found matching your selected filters.'}
          </p>
          <p className="text-xs text-slate-500">
            {isTa ? 'தேடல் சொல்லை எளிமைப்படுத்தவும் அல்லது "அனைத்து துறைகளும்" என்பதைத் தேர்ந்தெடுக்கவும்.' : 'Try loosening your search query or selecting "All Implementing Departments".'}
          </p>
          <button
            onClick={() => {
              handleSearchInput('');
              setSelectedDept('all');
              setSelectedCommunity('all');
              setSelectedLevel('all');
              setFundingTab('all');
            }}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            {isTa ? 'அனைத்து வடிகட்டிகளையும் மீட்டமை' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme, idx) => {
            const breakdown = scheme.benefit_breakdown || {};
            const fundingType = scheme.funding_type || '';
            const isCSS = fundingType.includes('CSS') || fundingType.includes('Centrally Sponsored');
            const isCentralSector = fundingType.includes('Central Sector');
            const isStateOnly = fundingType.includes('State-Only') || fundingType.includes('Tamil Nadu-Only');
            const isMixed = fundingType.includes('Mixed') || fundingType.includes('Flagged');

            return (
              <div 
                key={scheme.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Funding Badge + Value */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {isCSS && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {isTa ? `மத்திய-மாநில இணை நிதி (CSS ${scheme.funding_ratio || '60:40'})` : `Centrally Sponsored (CSS ${scheme.funding_ratio || '60:40'})`}
                        </span>
                      )}
                      {isCentralSector && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {isTa ? 'மத்திய அரசு நேரடி நிதி (100% GoI)' : 'Central Sector (100% GoI)'}
                        </span>
                      )}
                      {isStateOnly && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {isTa ? '100% தமிழ்நாடு அரசு முழு நிதி' : '100% Tamil Nadu State Funded'}
                        </span>
                      )}
                      {isMixed && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {isTa ? 'கலப்பு நிதி / மாநில மேலாண்மை' : 'Mixed / State Administered'}
                        </span>
                      )}
                    </div>

                    <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl shrink-0 border border-slate-200">
                      ₹{(scheme.financial_value || 0).toLocaleString('en-IN')}{scheme.category === 'fellowship' ? (isTa ? '/ஆண்டு' : '/yr') : scheme.financial_value > 50000 ? (isTa ? ' பலன்' : ' Benefit') : (isTa ? '/ஆண்டு' : '/yr')}
                    </span>
                  </div>

                  {/* Scheme Names (English + Tamil) */}
                  <div className="space-y-0.5 mb-2.5">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {isTa && scheme.name_ta ? scheme.name_ta : scheme.name}
                    </h3>
                    {scheme.name_ta && !isTa && (
                      <p className="text-xs text-slate-500 font-medium font-sans">
                        {scheme.name_ta}
                      </p>
                    )}
                    {isTa && scheme.name && (
                      <p className="text-xs text-slate-500 font-medium font-sans">
                        {scheme.name}
                      </p>
                    )}
                  </div>

                  {/* Implementing Department */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span className="font-medium text-[11px] truncate">
                      {scheme.department || (isTa ? 'தமிழ்நாடு அரசு' : 'Government of Tamil Nadu')}
                    </span>
                  </div>

                  {/* Target Beneficiaries Box */}
                  <div className="mb-3 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center space-x-1 text-[11px]">
                      <Info size={12} className="text-slate-500" />
                      <span>{isTa ? 'பயனாளிகள் & தகுதி வரம்புகள்:' : 'Target Beneficiaries & Eligibility:'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {scheme.target_beneficiaries || (isTa ? 'தமிழ்நாடு பள்ளி மற்றும் கல்லூரி மாணவர்கள்.' : 'Eligible school and higher education students in Tamil Nadu.')}
                    </p>
                  </div>

                  {/* Attribute Tags */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-600 mb-3">
                    <span className="capitalize font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {isTa ? 'வகை: ' : 'Category: '}{scheme.category?.replace('_', ' ') || 'Welfare'}
                    </span>
                    {scheme.criteria?.govt_school_only && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                        {isTa ? 'அரசுப் பள்ளி (6-12) மட்டும்' : 'Govt School (Class 6–12) Only'}
                      </span>
                    )}
                    {scheme.criteria?.first_graduate_only && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">
                        {isTa ? 'முதல் பட்டதாரி மட்டும்' : 'First Graduate Only'}
                      </span>
                    )}
                    {scheme.criteria?.differently_abled_only && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                        {isTa ? 'மாற்றுத்திறனாளி (≥40%)' : 'Differently Abled (≥40%)'}
                      </span>
                    )}
                    {scheme.criteria?.gender && scheme.criteria.gender !== 'any' && (
                      <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded capitalize font-medium">
                        {isTa 
                          ? (scheme.criteria.gender === 'female' ? 'மாணவிகள் மட்டும்' : 'மாணவர்கள் மட்டும்') 
                          : `${scheme.criteria.gender} Students Only`}
                      </span>
                    )}
                    {scheme.criteria?.max_income && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {isTa ? `வருமானம் ≤ ₹${(scheme.criteria.max_income).toLocaleString('en-IN')}/ஆண்டு` : `Income ≤ ₹${(scheme.criteria.max_income).toLocaleString('en-IN')}/yr`}
                      </span>
                    )}
                  </div>

                  {/* Benefit Breakdown */}
                  {(breakdown.tuition_waiver > 0 || breakdown.maintenance_stipend > 0 || breakdown.book_allowance > 0) && (
                    <div className="bg-slate-50 p-2.5 rounded-xl mb-3 text-[11px] space-y-1 text-slate-600">
                      {breakdown.tuition_waiver > 0 && (
                        <div className="flex justify-between">
                          <span>{isTa ? 'கல்விக் கட்டண விலக்கு / சலுகை:' : 'Tuition Fee Waiver / Coverage:'}</span>
                          <strong>₹{breakdown.tuition_waiver.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      {breakdown.maintenance_stipend > 0 && (
                        <div className="flex justify-between">
                          <span>{isTa ? 'மாதாந்திர DBT உதவித்தொகை / பராமரிப்பு:' : 'Maintenance / Monthly DBT Stipend:'}</span>
                          <strong>₹{breakdown.maintenance_stipend.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      {breakdown.book_allowance > 0 && (
                        <div className="flex justify-between text-indigo-700 font-semibold">
                          <span>{isTa ? 'புத்தகங்கள் / மடிக்கணினி / இதர மதிப்பு:' : 'Books / Equipment / In-Kind Value:'}</span>
                          <strong>₹{breakdown.book_allowance.toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Required Documents */}
                  {scheme.required_docs && scheme.required_docs.length > 0 && (
                    <div className="mb-3 text-[11px] text-slate-600">
                      <strong className="text-slate-800 block mb-1">
                        {isTa ? 'தேவையான சான்றிதழ்கள்:' : 'Required Certificates:'}
                      </strong>
                      <div className="flex flex-wrap gap-1">
                        {scheme.required_docs.map((doc, dIdx) => (
                          <span key={dIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incompatibility notice */}
                  {scheme.mutually_exclusive_with && scheme.mutually_exclusive_with.length > 0 && (
                    <div className="mb-3 text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                      <strong>{isTa ? '⚠️ இதனுடன் இணைக்க இயலாத திட்டங்கள்: ' : '⚠️ Mutually Exclusive With: '}</strong>
                      <span>{scheme.mutually_exclusive_with.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Footer Portal Link & Action */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">
                    {isTa ? 'இணையதளம்: ' : 'Portal: '}<strong className="text-slate-800">{scheme.portal_name || (isTa ? 'துறை தளம்' : 'Departmental')}</strong>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onApplyWithProfile}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      {isTa ? 'தகுதியை சரிபார்' : 'Check Eligibility'}
                    </button>
                    {scheme.portal_url && (
                      <a
                        href={scheme.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                        title={isTa ? 'அதிகாரப்பூர்வ அரசு இணையதளத்தைத் திற' : 'Open official government portal'}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
