import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  AlertCircle,
  Landmark,
  FileText,
  Search,
  Check,
  ChevronRight,
  Loader2,
  X,
  Link as LinkIcon,
  QrCode,
  WifiOff,
  Wifi,
  HardDrive,
  RefreshCw,
  Network
} from 'lucide-react';
import AiForensicsDemo from './AiForensicsDemo';

export default function HackathonDemoFeatures() {
  const [lang, setLang] = useState('en');
  const isTa = lang === 'ta';

  // State for DigiLocker Modal
  const [showDigilocker, setShowDigilocker] = useState(false);
  const [dlStep, setDlStep] = useState('initial'); // 'initial', 'aadhaar', 'otp', 'verifying', 'success'
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [otp, setOtp] = useState('');

  // State for DBT Validator
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [dbtStatus, setDbtStatus] = useState('idle'); // 'idle', 'loading', 'success'

  // State for Future Scope Features
  const [blockchainState, setBlockchainState] = useState('idle'); // 'idle', 'generating', 'success'
  const [erupiState, setErupiState] = useState('idle'); // 'idle', 'generating', 'success'
  const [isOffline, setIsOffline] = useState(false);
  const [syncState, setSyncState] = useState('synced'); // 'synced', 'offline_saved', 'syncing'

  const t = {
    title: isTa ? 'ஸ்மார்ட்டத்தான் 2026 டெமோ அம்சங்கள்' : 'Smartathon 2026 Live Demo Features',
    digiBtn: isTa ? 'DigiLocker மூலம் சரிபார்க்க' : 'Fetch & Verify via DigiLocker',
    dbtTitle: isTa ? 'NPCI / DBT வங்கி மேப்பிங் நிலை' : 'NPCI / DBT Bank Mapping Status',
    trackerTitle: isTa ? 'விண்ணப்ப நிலை கண்காணிப்பு' : 'Application Status Tracker',
  };

  // Handlers for DigiLocker Mock
  const handleDigilockerStart = () => {
    setShowDigilocker(true);
    setDlStep('aadhaar');
    setAadhaarNum('');
    setOtp('');
  };

  const handleAadhaarSubmit = () => {
    setDlStep('otp');
  };

  const handleOtpSubmit = () => {
    setDlStep('verifying');
    setTimeout(() => {
      setDlStep('success');
    }, 2000);
  };

  const handleFinalizeData = () => {
    const mockProfile = {
      fullName: "Karthik Subramaniam (Verified)",
      aadhaarNumber: aadhaarNum || "8492 4829 1928",
      community: "OBC",
      familyIncome: "72000",
      firstGraduate: "yes",
      student_type: "college",
      degree: "B.E. Computer Science",
      verified_by: "DigiLocker API"
    };
    sessionStorage.setItem('tn_student_profile', JSON.stringify(mockProfile));
    window.dispatchEvent(new Event('profileUpdated'));
    window.location.href = '/?tab=profile'; // Redirect to profile tab
  };

  // Handler for DBT Mock
  const handleDbtCheck = () => {
    if (!aadhaarInput) return;
    setDbtStatus('loading');
    setTimeout(() => {
      setDbtStatus('success');
    }, 1500);
  };

  // Handlers for Future Features
  const handleBlockchain = () => {
    setBlockchainState('generating');
    setTimeout(() => setBlockchainState('success'), 2000);
  };

  const handleErupi = () => {
    setErupiState('generating');
    setTimeout(() => setErupiState('success'), 1500);
  };

  const toggleOffline = () => {
    if (!isOffline) {
      setIsOffline(true);
      setSyncState('offline_saved');
    } else {
      setIsOffline(false);
      setSyncState('syncing');
      setTimeout(() => setSyncState('synced'), 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Header & Lang Toggle */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xl">
            S
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition cursor-pointer ${!isTa ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang('ta')}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition cursor-pointer ${isTa ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* FEATURE 1: DigiLocker Integration */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {isTa ? 'ஆவண சரிபார்ப்பு இயந்திரம்' : 'Instant Document Verification'}
              </h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {isTa 
                ? 'உங்கள் வருமான மற்றும் சாதி சான்றிதழ்களை அப்லோட் செய்ய தேவையில்லை. DigiLocker மூலம் நேரடியாக அரசு தரவுத்தளத்திலிருந்து சரிபார்க்கலாம்.' 
                : 'Eliminate manual document uploads. Securely fetch and cryptographically verify Income and Community certificates directly from Government registries via DigiLocker.'}
            </p>

            <button 
              onClick={handleDigilockerStart}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1C4E80] hover:bg-[#153a60] text-white rounded-xl font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShieldCheck size={20} className="text-blue-200" />
              <span>{t.digiBtn}</span>
            </button>

            {/* Display verified badges if demo completed */}
            {dlStep === 'success' && !showDigilocker && (
              <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-medium text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Aadhaar KYC Verified
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-medium text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Community Certificate (OBC) Verified
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-medium text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Income: ₹72,000/yr (Auto-extracted)
                </div>
              </div>
            )}
          </div>

          {/* FEATURE 2: NPCI / DBT Mapping */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Landmark size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {t.dbtTitle}
              </h2>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter 12-digit Aadhaar / Beneficiary ID"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
              />
              <button 
                onClick={handleDbtCheck}
                disabled={dbtStatus === 'loading'}
                className="px-5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl transition flex items-center justify-center font-semibold cursor-pointer"
              >
                {dbtStatus === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </button>
            </div>

            {dbtStatus === 'success' && (
              <div className="mt-6 p-5 bg-slate-900 rounded-2xl border border-slate-800 text-slate-300 font-mono text-sm space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">NPCI Mapper Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5"><Check size={14}/> ACTIVE</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">DBT Seeding:</span>
                  <span className="text-emerald-400 font-bold">YES</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Linked Bank Account:</span>
                  <span className="text-white">State Bank of India</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* FEATURE 3: Vertical Stepper / Application Tracker */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
              {t.trackerTitle}
            </h2>
            
            <div className="relative pl-6 space-y-8 border-l-2 border-slate-100">
              
              {/* Step 1: Done */}
              <div className="relative">
                <div className="absolute -left-[35px] bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Application Submitted</h4>
                  <p className="text-xs text-slate-500 mt-1">Ref ID: TN-SCH-847291 • Oct 24, 2026</p>
                </div>
              </div>

              {/* Step 2: Done */}
              <div className="relative">
                <div className="absolute -left-[35px] bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">AI Eligibility & MWIS Graph Match</h4>
                  <p className="text-xs text-slate-500 mt-1">Cross-verified against 47 schemes. Zero collisions detected.</p>
                </div>
              </div>

              {/* Step 3: Done */}
              <div className="relative">
                <div className="absolute -left-[35px] bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">e-Sevai / DigiLocker Verification</h4>
                  <p className="text-xs text-slate-500 mt-1">Income & Community registries validated.</p>
                </div>
              </div>

              {/* Step 4: In Progress */}
              <div className="relative">
                <div className="absolute -left-[35px] bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white shadow-indigo-500/30">
                  {/* Pulsing ring */}
                  <span className="absolute w-full h-full rounded-full bg-indigo-400 animate-ping opacity-50"></span>
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">College Approver Desk</h4>
                  <p className="text-xs text-indigo-500/80 mt-1 font-medium">Pending Principal Signature</p>
                  <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      Your application is queued at the institution nodal officer desk for final attendance verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5: Pending */}
              <div className="relative">
                <div className="absolute -left-[35px] bg-slate-200 text-slate-400 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white">
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
                </div>
                <div className="opacity-50">
                  <h4 className="font-bold text-slate-600 text-sm">Direct Benefit Transfer (DBT)</h4>
                  <p className="text-xs text-slate-500 mt-1">Waiting for treasury clearance</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* AI Forensics Engine - Full Width Section */}
      <AiForensicsDemo />

      {/* FUTURE SCOPE / HIGH-IMPACT PROTOTYPES */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">GovTech Innovations (Future Scope)</h2>
        <p className="text-slate-500 mb-8">Advanced features to present to Hackathon Judges.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Blockchain Ledger */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-3 bg-slate-900 text-cyan-400 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
              <Network size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Blockchain Tracker</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">Anti-corruption distributed ledger for fund disbursement.</p>
            
            {blockchainState === 'idle' ? (
              <button onClick={handleBlockchain} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                <LinkIcon size={16} /> Generate Smart Contract
              </button>
            ) : blockchainState === 'generating' ? (
              <div className="py-2.5 flex justify-center items-center gap-2 text-cyan-600 font-bold bg-cyan-50 rounded-xl">
                <Loader2 size={18} className="animate-spin" /> Mining Block...
              </div>
            ) : (
              <div className="bg-slate-900 text-cyan-400 p-3 rounded-xl font-mono text-[10px] space-y-2 animate-in fade-in">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Txn Hash:</span>
                  <span className="text-white truncate max-w-[120px]">0x7aF9c82...9B4e</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Nodes:</span>
                  <span className="text-white">4/4 Validated</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold mt-2">
                  <CheckCircle2 size={14} /> Fund Secured
                </div>
              </div>
            )}
          </div>

          {/* 2. e-RUPI Voucher */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
              <QrCode size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">e-RUPI Voucher</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">Purpose-specific digital payment. Cannot be misused.</p>
            
            {erupiState === 'idle' ? (
              <button onClick={handleErupi} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                <QrCode size={16} /> Issue e-RUPI
              </button>
            ) : erupiState === 'generating' ? (
              <div className="py-2.5 flex justify-center items-center gap-2 text-blue-600 font-bold bg-blue-50 rounded-xl">
                <Loader2 size={18} className="animate-spin" /> Generating...
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                  <QrCode size={40} className="text-slate-800" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-blue-900 text-sm">₹50,000</p>
                  <p className="text-blue-700/70 font-semibold leading-tight">Tuition Fee Only</p>
                  <p className="text-slate-400 text-[9px]">Valid at: DSU College</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Offline Village Mode */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
            {isOffline && <div className="absolute inset-0 border-4 border-rose-500 rounded-3xl pointer-events-none"></div>}
            
            <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 transition-colors ${isOffline ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isOffline ? <WifiOff size={24} /> : <Wifi size={24} />}
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 text-lg">Offline Sync</h3>
              <button 
                onClick={toggleOffline}
                className={`w-10 h-5 rounded-full relative transition-colors ${isOffline ? 'bg-rose-500' : 'bg-emerald-500'} cursor-pointer`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isOffline ? 'left-0.5' : 'translate-x-5'}`}></div>
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 flex-1">Works seamlessly in rural areas without internet.</p>
            
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              {syncState === 'synced' && (
                <>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">Cloud Synced</span>
                </>
              )}
              {syncState === 'offline_saved' && (
                <>
                  <HardDrive size={18} className="text-rose-500" />
                  <span className="text-xs font-bold text-slate-700">Saved to Local Device</span>
                </>
              )}
              {syncState === 'syncing' && (
                <>
                  <RefreshCw size={18} className="text-blue-500 animate-spin" />
                  <span className="text-xs font-bold text-blue-700">Restoring Internet... Syncing</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DigiLocker Overlay Modal */}
      {showDigilocker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-[#1C4E80] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="font-bold text-sm">DigiLocker Verification</span>
              </div>
              <button onClick={() => setShowDigilocker(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {dlStep === 'aadhaar' && (
                <div className="space-y-5 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Aadhaar Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">Enter your 12-digit Aadhaar number to fetch documents from DigiLocker.</p>
                  </div>
                  <input 
                    type="text" 
                    maxLength={12}
                    placeholder="Enter 12-digit Aadhaar"
                    className="w-full text-center tracking-[0.2em] font-mono text-xl py-3 border-b-2 border-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
                    value={aadhaarNum}
                    onChange={(e) => setAadhaarNum(e.target.value.replace(/\D/g, ''))}
                  />
                  <button 
                    onClick={handleAadhaarSubmit}
                    disabled={aadhaarNum.length !== 12}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {dlStep === 'otp' && (
                <div className="space-y-5 text-center animate-in slide-in-from-right-4 duration-300">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Enter OTP</h3>
                    <p className="text-xs text-slate-500 mt-1">An OTP has been sent to Aadhaar linked mobile number ending with ******{(aadhaarNum || '8291').slice(-4)}</p>
                  </div>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 border-b-2 border-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onClick={() => setOtp('123456')} // Auto-fill for demo
                  />
                  <button 
                    onClick={handleOtpSubmit}
                    disabled={otp.length !== 6}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Verify & Fetch Documents
                  </button>
                </div>
              )}

              {dlStep === 'verifying' && (
                <div className="space-y-4 text-center py-6">
                  <Loader2 size={40} className="animate-spin text-blue-600 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-sm">Connecting to DigiLocker Gateway...</h3>
                  <p className="text-xs text-slate-500">Decrypting digital signatures securely.</p>
                </div>
              )}

              {dlStep === 'success' && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in-50">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-bold text-emerald-700 text-lg">Verification Successful!</h3>
                  <p className="text-xs text-slate-500">Certificates imported into your profile.</p>
                  <button 
                    onClick={handleFinalizeData}
                    className="w-full py-3 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Auto-Fill Bio-Data Form</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
