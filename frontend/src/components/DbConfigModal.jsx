import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck, Server } from 'lucide-react';

export default function DbConfigModal({ isOpen, onClose, dbStatus, onUpdateStatus }) {
  const [username, setUsername] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const isMongoConnected = dbStatus?.mongodb?.connected;

  const handleTestConnect = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/db/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      const data = await response.json();
      setTestResult(data);
      if (onUpdateStatus && data.status) {
        onUpdateStatus(data.status);
      }
    } catch (err) {
      console.error(err);
      setTestResult({ success: false, error: "Network error connecting to backend API." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base">Cloud Database Engine</h3>
              <p className="text-xs text-slate-400">MongoDB Atlas & SQLite Dual-Driver</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Status Badges */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* SQLite Status */}
            <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center space-x-1.5 mb-1">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span className="text-xs font-bold text-emerald-900">Local Engine</span>
              </div>
              <strong className="block text-xs text-slate-900">SQLite app.db</strong>
              <span className="text-[10px] text-emerald-700">100% Active & Resilient</span>
            </div>

            {/* MongoDB Status */}
            <div className={`p-3.5 rounded-2xl border ${
              isMongoConnected 
                ? 'border-emerald-200 bg-emerald-50/50' 
                : 'border-amber-200 bg-amber-50/50'
            }`}>
              <div className="flex items-center space-x-1.5 mb-1">
                {isMongoConnected ? (
                  <CheckCircle2 size={14} className="text-emerald-700" />
                ) : (
                  <AlertCircle size={14} className="text-amber-600" />
                )}
                <span className="text-xs font-bold text-slate-900">MongoDB Atlas</span>
              </div>
              <strong className="block text-xs text-slate-900 truncate">cluster0.fzucldr</strong>
              <span className={`text-[10px] font-semibold ${isMongoConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isMongoConnected ? 'Synced & Live' : 'Auth Required'}
              </span>
            </div>

          </div>

          {/* Explanation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start space-x-2">
              <Server size={15} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Cluster Connection String:</strong>
                <code className="text-[11px] text-emerald-800 break-all font-mono">
                  mongodb+srv://&lt;db_username&gt;:***@cluster0.fzucldr.mongodb.net
                </code>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your registered student profiles, evaluations, and roadmaps are mirrored across both local SQLite and your MongoDB Atlas cluster.
            </p>
          </div>

          {/* Test & Configure Form */}
          <form onSubmit={handleTestConnect} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                MongoDB Atlas Username
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g. tnega_admin)..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Password <code className="font-mono text-slate-600">YwNJOZkLIRefHTaU</code> is preset from your connection URI.
              </p>
            </div>

            <button
              type="submit"
              disabled={isTesting || !username.trim()}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-emerald-400" />
                  <span>Verifying Atlas Authentication...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Authenticate & Sync Atlas</span>
                </>
              )}
            </button>
          </form>

          {/* Test Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {testResult.success ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Success! MongoDB Atlas cluster connected and syncing.</span>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Authentication Unsuccessful</strong>
                    <span className="text-[11px]">
                      {testResult.status?.mongodb?.error_reason || testResult.error || "Please verify username in MongoDB Atlas Console."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
