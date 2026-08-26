"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

const CORRECTIONS: [RegExp, string][] = [
  [/\b(insta\s?mart|instrument|instagram|instamart|instant mart|insta mark|instem art|in stomach|instam art|insta mart|instamar|instmart|insta-mart|into mart|instant mark|instomert|instamort|instument|in summer|in stammer|instamet|instameet|in stemmer)\b/gi, "Instamart"],
  [/\b(swiggy|ziggy|wiggy|sugary|swiggie|sweegy|swigy|sweeti|sweetie|switchy|swigie|swigi|swiggi)\b/gi, "Swiggy"],
  [/\b(dine\s?out|dinout|dine out)\b/gi, "Dineout"],
  [/\b(biryani|bryani|biriyani|beriani)\b/gi, "biryani"],
  [/\b(behrouz|behroz|be rows|bahrooz)\b/gi, "Behrouz"],
  [/\b(haldiram[s']?|haldi ram|haldirams)\b/gi, "Haldiram's"],
  [/\b(g\s?pay|gpay|google\s?pay|ji\s?pay|ji\s?per|repair|g\.pay|geopay|geo pay)\b/gi, "GPay"],
  [/\b(phone\s?pe|phonepay|phone\s?pay|phon pe|fon pe|fonpe)\b/gi, "PhonePe"],
  [/\b(pay\s?tm|paitem|pay\s?team|paytm)\b/gi, "Paytm"],
  [/\b(cred|thread|tread|crid|kredit|credit app)\b/gi, "CRED"],
  [/\b(super\s?\.?\s?money|superdot money|super money|super\.money)\b/gi, "super.money"],
  [/\b(bhim|beam|beem|bim)\b/gi, "BHIM"],
];

function correctTranscript(text: string): string {
  return CORRECTIONS.reduce((t, [pattern, replacement]) => t.replace(pattern, replacement), text);
}

export default function VoiceButton({ onTranscript, disabled }: Props) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const listenRef = useRef(listening);
  listenRef.current = listening;

  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setSupported(true);
    const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-GB";

    recognition.onresult = (e) => {
      const raw = e.results[0][0].transcript.trim();
      const transcript = correctTranscript(raw);
      if (transcript) onTranscriptRef.current(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggle = useCallback(() => {
    if (!recognitionRef.current || disabled) return;
    if (listenRef.current) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis?.cancel();
      setListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        setListening(false);
      }
    }
  }, [disabled]);

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      aria-label={listening ? "Tap to stop" : "Tap to speak"}
      className={[
        "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all select-none",
        listening
          ? "bg-[#FC8019] shadow-[0_0_0_8px_rgba(252,128,25,0.25)]"
          : "bg-[#FC8019]/90 hover:bg-[#FC8019]",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full animate-ping bg-[#FC8019]/40" />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-white"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2Z" />
      </svg>
    </button>
  );
}
