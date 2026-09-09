import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function SideAiChat({ isOpen, onClose, currentProfile, currentResult, currentLang = 'en' }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: currentLang === 'ta'
        ? 'வணக்கம்! நான் உங்கள் தமிழ்நாடு உயர்கல்வி இ-வித்யா AI ஆலோசகர். உதவித்தொகை தகுதி, வட்டாட்சியர் சான்றிதழ்கள், புதுமைப் பெண் அல்லது மத்திய திட்டங்கள் பற்றி தமிழில் கேட்கலாம்.'
        : 'Vanakkam! I am your Tamil Nadu e-Governance Higher Education Advisor. You can ask me questions about scholarship eligibility, Tahsildar documents, or mutual exclusivity rules in Tamil, Tanglish, or English.\n\nவணக்கம்! உதவித்தொகை மற்றும் அரசு சலுகைகள் குறித்த உங்கள் சந்தேகங்களை தமிழில் கேட்கலாம்.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Voice Input (Speech-to-Text) State
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState(currentLang === 'ta' ? 'ta-IN' : 'en-IN');
  const recognitionRef = useRef(null);

  // Available Browser Voices
  const [availableVoices, setAvailableVoices] = useState([]);

  // Voice Output (Text-to-Speech) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Sync default speech recognition lang if currentLang changes
  useEffect(() => {
    setSpeechLang(currentLang === 'ta' ? 'ta-IN' : 'en-IN');
  }, [currentLang]);

  // Load and cache browser voices dynamically
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          setAvailableVoices(vList);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Initialize Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Brave.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // High-clarity markdown & syntax stripper for crystal-clear TTS audio
  const cleanSpeechText = (raw) => {
    if (!raw) return '';
    return raw
      .replace(/[\*\_#`~]/g, '') // remove markdown formatting symbols
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // convert [text](url) -> text
      .replace(/https?:\/\/\S+/g, 'link') // replace raw urls with "link"
      .replace(/^[\s-•*]+/gm, '') // remove bullet list dashes and dots
      .replace(/^\d+\.\s+/gm, '') // remove number prefixes
      .replace(/[|]/g, ' ') // remove table dividers
      .replace(/[–—]/g, '-')
      .replace(/\n+/g, '. ') // convert line breaks to smooth speech pauses
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Text-to-Speech Output with Tamil & English voice targeting
  const speakText = (text, index = null) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // If already speaking the same text, cancel
    if (isSpeaking && speakingIndex === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanSpeechText(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto-detect Tamil characters or Tamil locale
    const hasTamil = /[\u0B80-\u0BFF]/.test(text) || currentLang === 'ta';
    
    // Get fresh voices list
    const voices = availableVoices.length > 0 
      ? availableVoices 
      : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);

    let matchedVoice = null;
    if (hasTamil) {
      // Look for dedicated Tamil voices (e.g. Google Tamil, Microsoft Valluvar/Pallavi, ta-IN)
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith('ta') || v.name.toLowerCase().includes('tamil')) ||
                     voices.find(v => v.lang.includes('IN') && (v.name.toLowerCase().includes('india') || v.lang.startsWith('hi')));
    } else {
      // Look for crisp Indian English voice (e.g. en-IN, Microsoft Heera, Google English India)
      matchedVoice = voices.find(v => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india')) ||
                     voices.find(v => v.lang.toLowerCase().startsWith('en'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = hasTamil ? 'ta-IN' : 'en-IN';
    utterance.rate = hasTamil ? 0.90 : 0.94; // Natural cadence, highly intelligible
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingIndex(index);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
    }
  };

  const handleSend = async (customText = null) => {
    const text = customText || inputMessage;
    if (!text.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newHistory = [...messages, { role: 'user', content: text }];
    setMessages(newHistory);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile_context: currentProfile || {},
          evaluation_context: currentResult || {},
          chat_history: newHistory.slice(-6)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Advisory API error");

      const replyMsg = { role: 'model', content: data.reply };
      setMessages(prev => {
        const nextMsgs = [...prev, replyMsg];
        if (autoSpeak) {
          setTimeout(() => speakText(data.reply, nextMsgs.length - 1), 300);
        }
        return nextMsgs;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: "I am temporarily offline. Please ensure the backend is running at http://localhost:8000." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4.5 py-3.5 rounded-full shadow-2xl flex items-center space-x-3 transition transform hover:scale-105 border border-slate-700 cursor-pointer"
        aria-label="Open AI Advisor"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
          <Bot size={16} />
        </div>
        <div className="text-left">
          <span className="block text-xs font-bold leading-tight">AI Advisor • குரல் ஆலோசகர்</span>
          <span className="text-[10px] text-emerald-300 font-normal">Voice & Chat Enabled</span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* 1. HEADER */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm">TN e-Governance Advisor</h3>
              <span className="text-[9px] bg-emerald-400/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                Voice Enabled
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Gemini 2.5 • தமிழ் / English Speech
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Stop Audio Button if playing */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-2 py-1 bg-red-600/30 text-red-300 hover:bg-red-600/50 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition"
              title="Stop voice playback"
            >
              <VolumeX size={12} />
              <span>Stop Voice</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800 cursor-pointer"
            title="Close AI side drawer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. VOICE CONTROLS & LANGUAGE BAR */}
      <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400">Voice Mode:</span>
          <button
            onClick={() => setSpeechLang(prev => prev === 'ta-IN' ? 'en-IN' : 'ta-IN')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition"
          >
            <Globe2 size={11} className="text-emerald-400" />
            <span>{speechLang === 'ta-IN' ? 'தமிழ் (Tamil)' : 'English (India)'}</span>
          </button>
        </div>

        <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[11px]">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="w-3.5 h-3.5 text-emerald-600 rounded bg-slate-700 border-slate-600 focus:ring-0"
          />
          <span className={autoSpeak ? "text-emerald-400 font-medium" : "text-slate-400"}>
            Auto-Speak Replies
          </span>
        </label>
      </div>

      {/* 3. SUGGESTED QUICK QUESTIONS */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 overflow-x-auto text-[11px] whitespace-nowrap flex items-center gap-1.5 scrollbar-none">
        <span className="text-slate-400 font-bold shrink-0">Quick:</span>
        <button
          onClick={() => handleSend("Why was CSSS rejected?")}
          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-medium transition cursor-pointer"
        >
          Why CSSS rejected?
        </button>
        <button
          onClick={() => handleSend("ஏன் எனக்கு CSSS கிடைக்கவில்லை?")}
          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-medium transition cursor-pointer"
        >
          ஏன் CSSS கிடைக்கவில்லை?
        </button>
        <button
          onClick={() => handleSend("How to get Vetri Free Laptop?")}
          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-medium transition cursor-pointer"
        >
          Vetri Laptop Scheme
        </button>
        <button
          onClick={() => handleSend("How to apply for Pudhumai Penn?")}
          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-medium transition cursor-pointer"
        >
          Pudhumai Penn Apply
        </button>
      </div>

      {/* 4. MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed relative group ${
              msg.role === 'user'
                ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 mb-1 border-b border-slate-100 pb-1">
                  <div className="flex items-center space-x-1.5">
                    <span>Tamil Nadu AI Advisor</span>
                    {speakingIndex === idx && (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-semibold animate-pulse">
                        Speaking...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {/* Speak Button */}
                    <button
                      onClick={() => speakText(msg.content, idx)}
                      className={`p-1 rounded hover:bg-slate-100 transition ${
                        speakingIndex === idx ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title={speakingIndex === idx ? "Stop audio" : "Listen to voice reply (வாசித்து காட்டு)"}
                    >
                      {speakingIndex === idx ? <VolumeX size={12} className="text-red-500" /> : <Volume2 size={12} />}
                    </button>
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition"
                      title="Copy advice text"
                    >
                      {copiedIndex === idx ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              )}
              <p className="whitespace-pre-line text-xs">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-bl-xs text-xs text-slate-500 flex items-center space-x-2">
              <Loader2 size={15} className="animate-spin text-emerald-600" />
              <span>Analyzing scholarship rules with Gemini 2.5...</span>
            </div>
          </div>
        )}

        {isListening && (
          <div className="flex justify-center">
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Listening to voice in {speechLang === 'ta-IN' ? 'Tamil' : 'English'}... Speak now</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. INPUT FORM WITH MIC BUTTON */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          {/* Voice input mic button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0 border ${
              isListening 
                ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
            }`}
            title={isListening ? "Stop listening" : `Click to speak (${speechLang === 'ta-IN' ? 'Tamil' : 'English'})`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Type or click mic to speak in ${speechLang === 'ta-IN' ? 'Tamil' : 'English'}...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl transition shadow-xs cursor-pointer shrink-0"
            title="Send query"
          >
            <Send size={15} />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>Mic: {speechLang === 'ta-IN' ? 'தமிழ் (Tamil)' : 'English'}</span>
          <span>Text-to-Speech Ready</span>
        </div>
      </div>

    </div>
  );
}
