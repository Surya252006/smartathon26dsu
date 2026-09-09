import React, { useState } from 'react';
import { Mic, X, Globe, Loader2 } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

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
    
    try {
      // In a real app, send to POST /api/parse-query
      const response = await fetch('http://localhost:8000/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      });
      const data = await response.json();
      
      onFillForm(data.parsed_profile);
      onClose();
    } catch (err) {
      console.error("Failed to parse", err);
      // Fallback for hackathon demo if backend is not running
      alert("Failed to reach backend NLP. Using static demo data.");
      onFillForm({
        gender: "female",
        community: "SC",
        annual_income: 150000,
        is_first_graduate: true,
        schooling_type: "tn_govt_school_6_to_12",
        board_percentage: 88,
        admission_mode: "govt_counseling_single_window",
        current_course: "Engineering",
        is_differently_abled: false
      });
      onClose();
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-blue-100 hover:text-white transition">
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="text-blue-200" size={20} />
            <select 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
              className="bg-transparent border-b border-blue-300 text-white font-medium focus:outline-none focus:border-white pb-1"
            >
              <option value="ta-IN" className="text-gray-900">தமிழ் (Tamil)</option>
              <option value="en-IN" className="text-gray-900">English (India)</option>
            </select>
          </div>
          <h2 className="text-2xl font-bold">Voice Assistant</h2>
          <p className="text-blue-100 text-sm mt-1">Speak naturally to fill the form automatically.</p>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
          <button 
            onClick={toggleListen}
            className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
              isListening ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
            )}
            <Mic size={40} className={isListening ? 'animate-pulse' : ''} />
          </button>
          
          <div className="mt-6 text-center w-full min-h-[80px]">
            {isListening ? (
              <p className="text-gray-800 text-lg animate-pulse">
                {transcript || "Listening..."}
              </p>
            ) : (
              <p className="text-gray-500 italic">
                {transcript || "Tap the microphone and start speaking..."}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleProcess}
            disabled={!transcript.trim() || isProcessing}
            className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-medium transition-colors"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
            ) : (
              "Fill Form with Voice / குரல் மூலம் நிரப்புக"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
