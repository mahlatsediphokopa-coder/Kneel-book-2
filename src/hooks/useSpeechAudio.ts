import { useState, useEffect, useRef } from 'react';

export function useSpeechAudio(texts: string[], onParagraphChange?: (index: number) => void) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSupported, setIsSupported] = useState(true);

  const textsRef = useRef<string[]>(texts);
  const currentIndexRef = useRef<number>(0);
  textsRef.current = texts;

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        if (!selectedVoiceURI) {
          const defaultEn = available.find((v) => v.lang.startsWith('en')) || available[0];
          setSelectedVoiceURI(defaultEn?.voiceURI || '');
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoiceURI]);

  const speakCurrent = (index: number) => {
    if (!('speechSynthesis' in window) || index >= textsRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textsRef.current[index]);
    
    if (selectedVoiceURI) {
      const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.rate = playbackRate;

    utterance.onstart = () => {
      setCurrentIndex(index);
      currentIndexRef.current = index;
      if (onParagraphChange) onParagraphChange(index);
    };

    utterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < textsRef.current.length) {
        speakCurrent(nextIndex);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const play = (fromIndex = 0) => {
    setIsPlaying(true);
    setIsPaused(false);
    speakCurrent(fromIndex);
  };

  const pause = () => {
    if ('speechSynthesis' in window && isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if ('speechSynthesis' in window && isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      play(currentIndex);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
  };

  const togglePlay = () => {
    if (!isPlaying) {
      play(currentIndex);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return {
    isPlaying,
    isPaused,
    currentIndex,
    playbackRate,
    setPlaybackRate,
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    isSupported,
    play,
    pause,
    resume,
    stop,
    togglePlay,
  };
}
