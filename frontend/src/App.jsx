import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Building2, PhoneCall, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProfileForm from './components/ProfileForm';
import ResultsDashboard from './components/ResultsDashboard';
import SchemesDirectory from './components/SchemesDirectory';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import SideAiChat from './components/SideAiChat';
import DbConfigModal from './components/DbConfigModal';
import { DEMO_PERSONAS } from './data/demoPersonas';
import { TRANSLATIONS } from './utils/translations';

function App() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'matcher', 'results', 'schemes'
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Regional Language State (Handwritten Note Item #5)
  const [currentLang, setCurrentLang] = useState('en');

  // Global Scheme Search State (Handwritten Note Item #6)
  const [searchQuery, setSearchQuery] = useState('');

  // Database Connection State (MongoDB Atlas & SQLite)
  const [dbStatus, setDbStatus] = useState(null);
  const [showDbModal, setShowDbModal] = useState(false);

  // Persistent AI Side Assistant state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load saved student session and database status on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('tn_scholarship_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedLang = localStorage.getItem('tn_portal_lang');
      if (savedLang) {
        setCurrentLang(savedLang);
      }
    } catch (e) {
      console.warn("Could not parse saved storage", e);
    }

    // Fetch initial database status
    fetch('http://localhost:8000/api/db/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => console.warn("Database status check notice", err));
  }, []);

  const handleSelectLang = (lang) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('tn_portal_lang', lang);
    } catch (e) {}
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('tn_scholarship_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tn_scholarship_user');
    } catch (e) {}
  };

  const handleEvaluate = async (formData) => {
    setCurrentProfile(formData);
    setIsEvaluating(true);
    setCurrentTab('matcher');

    // Persist to currentUser and backend if student is authenticated
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        profile: {
          ...(currentUser.profile || {}),
          ...formData
        }
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('tn_scholarship_user', JSON.stringify(updatedUser));
        if (currentUser.user_id) {
          fetch('http://localhost:8000/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: currentUser.user_id,
              profile_data: formData
            })
          }).catch(() => {});
        }
      } catch (e) {}
    }

    try {
      const response = await fetch('http://localhost:8000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setResult(data);
      setCurrentTab('results');
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate profile. Please check if the backend is running at http://localhost:8000.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentProfile(null);
    setCurrentTab('matcher');
  };

  const injectPersona = async (personaId) => {
    const persona = DEMO_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      await handleEvaluate(persona.payload);
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Official Government Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        searchQuery={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          if (currentTab !== 'schemes') setCurrentTab('schemes');
        }}
        dbStatus={dbStatus}
        onOpenDbConfig={() => setShowDbModal(true)}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* VIEW A: Home Page */}
        {currentTab === 'home' && (
          <HomePage
            onStartMatcher={() => setCurrentTab('matcher')}
            onInjectPersona={injectPersona}
            onViewSchemes={() => setCurrentTab('schemes')}
            onOpenAuth={() => setShowAuthModal(true)}
            currentLang={currentLang}
          />
        )}

        {/* VIEW B: Eligibility Matcher / Form */}
        {currentTab === 'matcher' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                Step 1 of 2 • Student Profile
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Check Higher Education Scheme Eligibility
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Fill in your accurate academic credentials and community certificates. Our MWIS constraint solver cross-references 18+ welfare rules to find the highest legal payout.
              </p>
            </div>

            {isEvaluating ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-slate-200">
                <div className="relative mb-4">
                  <Loader2 className="animate-spin text-emerald-700" size={54} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Optimizing Scholarship Allocation...
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 text-center max-w-sm">
                  Checking mutual exclusivity matrices, quota provisions, and scoring merit-cum-means probabilities...
                </p>
              </div>
            ) : (
              <ProfileForm 
                onSubmit={handleEvaluate} 
                currentLang={currentLang} 
                currentUser={currentUser}
                currentProfile={currentProfile}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            )}
          </div>
        )}

        {/* VIEW C: Results Dashboard */}
        {currentTab === 'results' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentTab('home')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center space-x-1 cursor-pointer"
              >
                <span>← Back to Portal Home</span>
              </button>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Official Result • Policy Compliant
              </span>
            </div>
            <ResultsDashboard 
              result={result} 
              profile={currentProfile} 
              currentUser={currentUser}
              onReset={handleReset} 
              currentLang={currentLang}
            />
          </div>
        )}

        {/* VIEW D: Schemes Directory */}
        {currentTab === 'schemes' && (
          <SchemesDirectory
            onBackToHome={() => setCurrentTab('home')}
            onApplyWithProfile={() => setCurrentTab('matcher')}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            currentLang={currentLang}
          />
        )}

        {/* VIEW E: Dedicated Student Profile Page */}
        {currentTab === 'profile' && (
          <ProfilePage
            user={currentUser}
            profile={currentProfile || currentUser?.profile}
            result={result}
            onNavigateTab={setCurrentTab}
            currentLang={currentLang}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* 3. Persistent Side AI Chatbox with Voice Chat & Reply */}
      <SideAiChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(prev => !prev)}
        currentProfile={currentProfile}
        currentResult={result}
        currentLang={currentLang}
      />

      {/* 4. Student Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 5. Cloud Database Modal (MongoDB Atlas & SQLite Dual-Sync) */}
      <DbConfigModal
        isOpen={showDbModal}
        onClose={() => setShowDbModal(false)}
        dbStatus={dbStatus}
        onUpdateStatus={(newStatus) => setDbStatus(newStatus)}
      />

      {/* 6. Official Civic Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Building2 size={16} className="text-emerald-400" />
                <span>{t.portal_name} • {t.dept_title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
                An official Tamil Nadu e-Governance initiative designed to bridge the accessibility gap for 1.2 Lakh rural and first-generation college students across Tamil Nadu with zero entitlement collisions.
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-emerald-400 font-medium pt-1">
                <span>Direct Benefit Transfer (DBT) Enabled</span>
                <span>•</span>
                <span>TNeGA Aligned</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Portals</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://www.pudhumaipenn.tn.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">Penkalvi (Pudhumai Penn)</a></li>
                <li><a href="https://www.tneaonline.org" target="_blank" rel="noreferrer" className="hover:text-white transition">TNEA First Graduate</a></li>
                <li><a href="https://ssp.tn.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">TN SSP Post-Matric</a></li>
                <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">National Scholarship Portal (NSP)</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Citizen Helplines</h4>
              <p className="text-[11px] text-slate-400">Toll-free Student Guidance:</p>
              <p className="text-sm font-bold text-emerald-400">14417 / 1800-425-1333</p>
              <p className="text-[10px] text-slate-500">Available Mon-Sat 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© 2026 Government of Tamil Nadu. Department of Higher Education & Tamil Nadu e-Governance Agency (TNeGA). All rights reserved.</p>
            <div className="flex space-x-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Entitlement</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">e-District Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
