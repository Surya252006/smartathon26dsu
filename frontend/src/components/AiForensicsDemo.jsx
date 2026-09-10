import React, { useState } from 'react';
import { 
  UploadCloud, 
  Scan, 
  Fingerprint, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search,
  FileBadge,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export default function AiForensicsDemo() {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'results'

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('results');
    }, 3500);
  };

  const resetScan = () => {
    setScanState('idle');
  };

  return (
    <div className="bg-slate-900 text-slate-200 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden mt-8">
      {/* Background Tech Overlay */}
      <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
        <Fingerprint size={400} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)] shrink-0">
            <Scan size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              AI Fraud & Tamper Detection Engine
            </h2>
            <p className="text-sm text-slate-400 mt-1">Government-Grade Pixel Forensics & Metadata Auditing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Upload & Document Area */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-auto lg:h-[450px] bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
              
              {scanState === 'idle' ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <FileBadge size={56} className="text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Tamil Nadu Income Certificate.pdf</h3>
                  <p className="text-xs text-slate-400 mb-8 bg-slate-900/50 inline-block px-3 py-1 rounded-full border border-slate-700">Ref: TN-INC-2026/8941</p>
                  
                  <button 
                    onClick={handleScan}
                    className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.4)] mx-auto cursor-pointer active:scale-95"
                  >
                    <Search size={18} />
                    Run AI Forensics Scan
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-slate-100 p-6 flex flex-col relative overflow-hidden animate-in fade-in duration-500">
                  {/* Mock Certificate Visual */}
                  <div className="w-full h-8 bg-amber-600/20 rounded mb-4 border border-amber-600/30"></div>
                  <div className="w-3/4 h-3 bg-slate-300 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-slate-300 rounded mb-8"></div>
                  <div className="w-full h-px bg-slate-300 mb-8"></div>
                  
                  <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mb-2 font-mono px-2">
                    <span>NAME: M. KARTHIK</span>
                    <span className="relative">
                      INCOME: ₹40,000
                      {scanState === 'results' && (
                        <span className="absolute -inset-1 border-2 border-rose-500 rounded animate-pulse"></span>
                      )}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-200 rounded mb-8 mt-2"></div>
                  <div className="w-2/3 h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="w-1/3 h-4 bg-slate-200 rounded mb-2"></div>
                  
                  {/* The Scanning Laser Line */}
                  {scanState === 'scanning' && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                      <div className="w-full h-1 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/10 mix-blend-overlay"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <Loader2 size={48} className="text-rose-600 animate-spin opacity-80" />
                        <span className="mt-2 text-rose-700 font-black tracking-widest text-sm bg-white/90 px-3 py-1 rounded shadow-lg border border-rose-200">ANALYZING PIXELS</span>
                      </div>
                    </div>
                  )}

                  {scanState === 'results' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-in zoom-in-50 duration-500">
                      <div className="border-4 border-rose-600 text-rose-600 font-black text-4xl px-6 py-2 transform -rotate-12 rounded-xl bg-white/95 shadow-2xl tracking-widest backdrop-blur-md">
                        FORGED
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {scanState === 'results' && (
              <button 
                onClick={resetScan}
                className="w-full py-2 text-sm text-slate-500 hover:text-white transition font-medium cursor-pointer"
              >
                Reset Forensic Engine
              </button>
            )}
          </div>

          {/* Right: Forensic Results Dashboard */}
          <div className="flex flex-col justify-center h-full">
            {scanState === 'idle' ? (
              <div className="text-center text-slate-500 space-y-4 animate-in fade-in">
                <ShieldAlert size={56} className="mx-auto opacity-20" />
                <p className="max-w-xs mx-auto text-sm leading-relaxed">
                  Upload a document and run the forensics engine to detect tampering, pixel manipulation, and metadata inconsistencies.
                </p>
              </div>
            ) : scanState === 'scanning' ? (
              <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                  <span className="font-mono text-indigo-400 text-sm tracking-widest">SCAN PROGRESS</span>
                  <span className="font-mono font-bold text-white text-lg">74%</span>
                </div>
                <div className="space-y-4 font-mono text-xs sm:text-sm text-slate-400">
                  <p className="flex items-center gap-3"><Loader2 size={14} className="animate-spin text-indigo-400 shrink-0"/> <span className="text-white">Extracting EXIF Metadata...</span></p>
                  <p className="flex items-center gap-3"><Loader2 size={14} className="animate-spin text-indigo-400 shrink-0"/> <span className="text-white">Performing Error Level Analysis (ELA)...</span></p>
                  <p className="flex items-center gap-3"><Loader2 size={14} className="animate-spin text-indigo-400 shrink-0"/> Checking Font Micro-signatures...</p>
                  <p className="flex items-center gap-3 opacity-50"><Loader2 size={14} className="text-transparent shrink-0"/> Cross-referencing revenue signatures...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                {/* Risk Score Banner */}
                <div className="bg-gradient-to-r from-rose-500/20 to-rose-900/20 border border-rose-500/50 p-5 rounded-2xl flex items-center gap-5 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                  <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] shrink-0 ring-4 ring-rose-500/20">
                    92%
                  </div>
                  <div>
                    <h3 className="text-rose-400 font-bold text-xl leading-none mb-1.5 tracking-wide">HIGH RISK</h3>
                    <p className="text-xs text-rose-200/70 uppercase tracking-widest font-mono">Flagged for manual officer review</p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-300">Metadata Integrity</span>
                    <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest"><CheckCircle2 size={18}/> PASSED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-rose-950/30 rounded-xl border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                    <span className="text-slate-200 relative z-10">Font Consistency</span>
                    <span className="flex items-center gap-2 text-rose-400 font-bold tracking-widest relative z-10"><XCircle size={18}/> FAILED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-300">QR Code Signature</span>
                    <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest"><CheckCircle2 size={18}/> PASSED</span>
                  </div>
                </div>

                {/* AI Detailed Findings */}
                <div className="p-5 bg-slate-800/90 rounded-xl border-l-4 border-rose-500 shadow-lg relative overflow-hidden">
                  {/* Subtle hazard stripes background */}
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f43f5e 10px, #f43f5e 20px)' }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-rose-400 font-bold mb-3">
                      <AlertTriangle size={20} />
                      <span className="tracking-wide">AI Tamper Detection Log</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Pixel distortion detected at <strong className="text-white bg-slate-700 px-1.5 py-0.5 rounded">Annual Income</strong> field using Error Level Analysis. 
                    </p>
                    <div className="mt-4 p-4 bg-slate-900/80 rounded-lg border border-slate-700 font-mono text-sm flex flex-col gap-2">
                      <span className="text-slate-400">Original Value: <span className="text-emerald-400 line-through">₹2,40,000</span></span>
                      <span className="text-slate-400">Edited To: <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded">₹40,000</span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Inline styles for the scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
