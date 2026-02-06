import { useCallback, useEffect, useRef } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string, options?: SpeechOptions) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const synth = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (isSupported) {
      synth.current = window.speechSynthesis;
    }

    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported || !synth.current) {
      console.warn('Speech synthesis is not supported');
      return;
    }

    // Cancel any ongoing speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = 'en-PK'; // Set Pakistani English

    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      // Try to get Pakistani or Indian English voice
      const voices = synth.current.getVoices();
      
      // Priority order for voice selection
      const preferredVoice = 
        voices.find(v => v.lang === 'en-PK') || // Pakistani English
        voices.find(v => v.lang === 'en-IN') || // Indian English (similar accent)
        voices.find(v => v.lang === 'en-GB' && v.name.includes('Female')) || // British English female
        voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
        voices.find(v => v.lang.includes('en')) ||
        voices[0];
        
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected voice:', preferredVoice.name, preferredVoice.lang);
      }
    }

    utterance.onend = () => {
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    synth.current.speak(utterance);
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
      utteranceRef.current = null;
    }
  }, []);

  const isSpeaking = synth.current?.speaking || false;

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported
  };
};