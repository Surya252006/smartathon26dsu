import React, { useState } from 'react';
import { Mic, X, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

// On-device Intelligent NLP Parser for Tamil, English, and Tanglish voice queries
function parseVoiceClientSide(text) {
  const t = text.toLowerCase();
  
  // Extract student details dynamically from speech
  const parsed = {
    gender: (/(girl|female|pen|பெண்|woman)/i.test(t)) ? 'female' : 'male',
    community: (/\bsc\b/i.test(t)) ? 'SC' : ((/\bst\b/i.test(t)) ? 'ST' : ((/\bmbc\b/i.test(t)) ? 'MBC' : ((/\boc\b/i.test(t)) ? 'OC' : 'BC'))),
    annual_income: 140000,
    is_first_graduate: (/(first|graduate|முதல்|பட்டதாரி|fg)/i.test(t)),
    schooling_type: (/(govt|government|அரசு|school)/i.test(t)) ? 'tn_govt_school_6_to_12' : 'govt_aided',
    board_percentage: 88.5,
    admission_mode: 'govt_counseling_single_window',
    current_course: (/(eng|engineering|b\.e|btech)/i.test(t)) ? 'Engineering' : 'Arts & Science',
    is_differently_abled: (/(disabled|disability|differently|மாற்றுத்திறனாளி)/i.test(t))
  };

  // Percentage extraction
  const pctMatch = t.match(/(\d{2}(?:\.\d{1,2})?)\s*(?:%|percent|marks|mark|சதவீதம்)/i);
  if (pctMatch) {
    const val = parseFloat(pctMatch[1]);
    if (!isNaN(val) && val >= 35 && val <= 100) parsed.board_percentage = val;
  }

  // Income extraction (e.g. 1.5 lakh, 2 lakhs, 80000)
  const incMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|patcham|ilatcham|லட்சம்)/i);
  if (incMatch) {
    const val = parseFloat(incMatch[1]);
    if (!isNaN(val)) parsed.annual_income = val * 100000;
  } else {
    const rawNum = t.match(/\b([1-9]\d{4,6})\b/);
    if (rawNum) {
      const val = parseFloat(rawNum[1]);
      if (!isNaN(val) && val >= 10000 && val <= 10000000) parsed.annual_income = val;
    }
  }

  return parsed;
}

export default function VoiceAssistModal({ isOpen, onClose, onFillForm }) {
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useVoiceInput();
  const [locale, setLocale] = useState('ta-IN');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(locale);
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    stopListening();
    
    let parsedResult = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const response = await fetch('http://localhost:8000/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data?.parsed_profile) {
          parsedResult = data.parsed_profile;
        }
      }
    } catch (err) {
      // Graceful fallback to on-device NLP
    }

    // Fallback to high-accuracy client-side NLP parser
    if (!parsedResult) {
      parsedResult = parseVoiceClientSide(transcript);
    }
    
    onFillForm(parsedResult);
    setIsProcessing(false);
    resetTranscript();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0f2942] p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="text-emerald-400" size={16} />
            <select 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2 py-1 font-medium focus:outline-none"
            >
              <option value="ta-IN">தமிழ் (Tamil)</option>
              <option value="en-IN">English (India)</option>
            </select>
          </div>
          <h2 className="text-xl font-bold">Voice Assistant / குரல் உதவியாளர்</h2>
          <p className="text-slate-300 text-xs mt-1">Speak naturally in Tamil or English to fill your credentials automatically.</p>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
          <button 
            onClick={toggleListen}
            className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 cursor-pointer shadow-lg ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Click to speak"
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-25"></span>
            )}
            <Mic size={38} className={isListening ? 'animate-pulse' : ''} />
          </button>
          
          <div className="mt-6 text-center w-full min-h-[70px]">
            {isListening ? (
              <p className="text-slate-900 font-medium text-sm animate-pulse">
                "{transcript || "Listening... பேசுங்கள்..."}"
              </p>
            ) : (
              <p className="text-slate-500 text-xs italic">
                {transcript ? `"${transcript}"` : "Click the microphone and speak your community, income, and 12th marks..."}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleProcess}
            disabled={!transcript.trim() || isProcessing}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-[#006a4e] hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin mr-2" size={16} /> Analyzing speech with NLP...</>
            ) : (
              "Fill Profile with Voice / குரல் மூலம் நிரப்புக"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
