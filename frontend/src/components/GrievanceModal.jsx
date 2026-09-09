import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Phone, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';

export default function GrievanceModal({ isOpen, onClose, currentUser, currentProfile, currentLang = 'en' }) {
  const [category, setCategory] = useState('dbt_delay');
  const [fullName, setFullName] = useState(currentProfile?.full_name || currentUser?.profile?.full_name || '');
  const [mobile, setMobile] = useState('9840291823');
  const [email, setEmail] = useState(currentUser?.email || 'student@tnega.gov.in');
  const [ackRef, setAckRef] = useState('TNEV-2026-849204');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        ticketId,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        category,
        ackRef,
        sla: '72 Hours (3 Working Days)',
        status: 'Assigned to Taluk Special Nodal Officer'
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => { setSubmittedTicket(null); onClose(); }}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <HelpCircle size={14} />
            <span>Official Citizen Helpdesk & Grievance Redressal</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold">
            {currentLang === 'ta' ? 'மாணவர் குறைதீர்ப்பு & மேல்முறையீட்டு மையம்' : 'Student Grievance & Appeal Filing Desk'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentLang === 'ta'
              ? 'உதவித்தொகை தாமதம், சான்றிதழ் சிக்கல்கள் அல்லது தகுதி மறுபரிசீலனை குறித்து வட்டாட்சியர் & உயர்கல்வித் துறைக்கு மனு தாக்கல் செய்யுங்கள்.'
              : 'File an official inquiry or appeal regarding delayed DBT stipends, rejected e-Sevai certificates, or college verification delays.'}
          </p>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6">
          {submittedTicket ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#006a4e] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentLang === 'ta' ? 'மனு வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Grievance Registered Successfully!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your grievance petition has been escalated directly to the Directorate of Collegiate Education (DCE) Grievance Cell.
                </p>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 inline-flex items-center space-x-3 mt-2">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Grievance Ticket ID</span>
                    <strong className="text-base font-mono text-emerald-950 font-extrabold">{submittedTicket.ticketId}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(submittedTicket.ticketId)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition cursor-pointer"
                    title="Copy Ticket ID"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Resolution SLA:</span>
                  <strong className="text-slate-800">{submittedTicket.sla}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <strong className="text-[#006a4e]">{submittedTicket.status}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked Application Ref:</span>
                  <strong className="font-mono text-slate-800">{submittedTicket.ackRef || 'N/A'}</strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500">Toll-free student helpline: <strong>14417</strong></span>
                <button
                  onClick={() => { setSubmittedTicket(null); onClose(); }}
                  className="px-5 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter student name..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mobile Number (SMS Updates) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Application Ref No (Ack ID)
                  </label>
                  <input 
                    type="text"
                    value={ackRef}
                    onChange={(e) => setAckRef(e.target.value)}
                    placeholder="e.g. TNEV-2026-849204..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Grievance Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                  >
                    <option value="dbt_delay">Delayed Direct Benefit Transfer (DBT) Payout</option>
                    <option value="cert_rejection">e-Sevai Certificate Rejection or Tahsildar Mismatch</option>
                    <option value="college_nodal">College Nodal Officer Bonafide Verification Pending</option>
                    <option value="first_grad">First Graduate Tuition Fee Waiver Discrepancy</option>
                    <option value="bank_seeding">Bank Account Aadhaar-NPCI Seeding Error</option>
                    <option value="other">Other Statutory Scheme Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Detailed Explanation / Grievance Particulars <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your grievance clearly (e.g. Pudhumai Penn stipend for August not received, Tahsildar income certificate renewal pending at Pudukkottai taluk office)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Official DCE Citizen Charter SLA: 3 Days</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting Petition...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Grievance Petition</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
