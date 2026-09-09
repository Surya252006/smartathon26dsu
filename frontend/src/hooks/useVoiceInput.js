import { useState, useEffect, useRef } from 'react';

export function useVoiceInput() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript + ' ';
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => {
        // If it's just updating interim, we only want to append final results.
        // For a hackathon, just joining them works okay, but better to just set the full string.
        // Actually, speech recognition builds the whole string in event.results if continuous is true.
        let fullStr = '';
        for (let i = 0; i < event.results.length; i++) {
            fullStr += event.results[i][0].transcript;
        }
        return fullStr;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'no-speech') {
        // Ignore timeout errors
        return;
      }
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = (locale = 'ta-IN') => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = locale;
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
}
