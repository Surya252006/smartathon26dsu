import React, { useState } from 'react';
import { X, Lock, Mail, User, MapPin, Building, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [community, setCommunity] = useState('BC');
  const [district, setDistrict] = useState('Chennai');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const url = mode === 'login' 
      ? 'http://localhost:8000/api/auth/login' 
      : 'http://localhost:8000/api/auth/register';

    const payload = mode === 'login' 
      ? { email, password }
      : { email, password, full_name: fullName, community, district };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed. Please check credentials.");
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (type) => {
    if (type === 'admin') {
      setEmail('admin@tnega.tn.gov.in');
      setPassword('admin2026');
      setFullName('TNeGA Admin Officer');
      setCommunity('OC');
      setDistrict('Chennai');
    } else if (type === 'priya') {
      setEmail('priya.demo@dsu.tn.gov.in');
      setPassword('tnstudent2026');
      setFullName('Priya M');
      setCommunity('BC');
      setDistrict('Pudukkottai');
    } else {
      setEmail('karthik.demo@dsu.tn.gov.in');
      setPassword('tnstudent2026');
      setFullName('Karthikeyan R');
      setCommunity('OC');
      setDistrict('Chennai');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            <span>Student & Admin Access</span>
          </div>
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Sign In to Portal' : 'Register New Student'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your saved eligibility roadmaps and e-Sevai document check records.
          </p>
        </div>

        {/* Quick Demo Fill for Judges */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-3 flex items-center justify-between text-xs">
          <span className="text-emerald-900 font-bold flex items-center">
            <Sparkles size={13} className="text-amber-500 mr-1" /> Quick Fill:
          </span>
          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('priya')}
              className="text-[11px] px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 font-medium transition cursor-pointer"
            >
              Priya (BC)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('karthik')}
              className="text-[11px] px-2 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 font-medium transition cursor-pointer"
            >
              Karthik (OC)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="text-[11px] px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg border border-purple-300 font-bold transition cursor-pointer"
              title="Sign in as TNeGA System Administrator"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'login' 
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In (உள்நுழைவு)
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              mode === 'register' 
                ? 'bg-white text-slate-900 border-b-2 border-emerald-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Registration (புதிய பதிவு)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name as in 10th / 12th Marksheet
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya M"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email / Student ID
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
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

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Community
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="OC">OC</option>
                  <option value="BC">BC</option>
                  <option value="MBC">MBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="SCC">SCC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Home District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Salem">Salem</option>
                  <option value="Pudukkottai">Pudukkottai</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Other">Other Districts (TN)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-md cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-1" />
                <span>Verifying Student Records...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Portal' : 'Create Student Account'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Secured by Tamil Nadu Higher Education Welfare Verification Protocol
        </div>

      </div>
    </div>
  );
}
