"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VoiceButton from "./VoiceButton";
import MessageBubble from "./MessageBubble";
import ConnectSwiggy from "./ConnectSwiggy";
import type { AuthStatus, ConversationMessage, Message } from "@/types";

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm Swiggy Concierge. Connect your Swiggy account to order food, groceries, or book a table — all by voice.",
  timestamp: Date.now(),
};

// Named voices to try in order. Indian English voices have no consistent name
// across devices, so we first scan by lang="en-IN", then fall back to these.
const VOICE_PREFS = [
  "Google UK English Female",
  "Moira",           // macOS Irish (female)
  "Samantha",        // macOS / iOS (female)
  "Karen",           // macOS Australian (female)
  "Microsoft Zira",  // Windows (female)
  "Microsoft Eva",   // Windows (female)
  "Microsoft Aria",  // Windows 11 (female)
  "Google US English",
];

let _bestVoice: SpeechSynthesisVoice | null = null;

function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer named UK/female voices in order.
  for (const name of VOICE_PREFS) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }

  // On Android, cloud voices (localService: false) sound far better than local ones.
  // Try cloud en-GB first, then cloud en-US, then any en-GB, then any English.
  return (
    voices.find((v) => v.lang === "en-GB" && !v.localService) ||
    voices.find((v) => v.lang === "en-US" && !v.localService) ||
    voices.find((v) => v.lang === "en-GB") ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold**
    .replace(/\*(.+?)\*/g, "$1")        // *italic*
    .replace(/__(.+?)__/g, "$1")        // __bold__
    .replace(/_(.+?)_/g, "$1")          // _italic_
    .replace(/`(.+?)`/g, "$1")          // `code`
    .replace(/#{1,6}\s*/g, "")          // # headings
    .replace(/^\s*[-*+]\s+/gm, "")      // bullet points
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [links](url)
    .replace(/[🍿🥤🍫🎬]/gu, "")      // emojis
    .trim();
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
  const voice = _bestVoice ?? pickBestVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }
  utterance.rate = 1.15;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export default function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ connected: false });
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<ConversationMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pre-load and cache the best available TTS voice.
  // Browsers populate getVoices() asynchronously so we listen for the event.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => { _bestVoice = pickBestVoice(); };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((s: AuthStatus) => setAuthStatus(s))
      .catch(() => {});
  }, []);

  // Fetch user's location once on mount using browser Geolocation + Nominatim reverse geocode
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "User-Agent": "SwiggyConciereApp/1.0" } }
          );
          const data = await res.json();
          const a = data.address ?? {};
          // Build a short readable label: neighbourhood + city
          const label = [
            a.neighbourhood || a.suburb || a.village || a.road,
            a.city || a.town || a.county || a.state_district,
            a.state,
          ]
            .filter(Boolean)
            .slice(0, 2)
            .join(", ");
          setUserLocation(label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setUserLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      },
      () => {} // permission denied — silently skip, agent will ask if needed
    );
  }, []);

  // Handle auth redirect params (only if widget not already handled)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    if (!auth) return;
    window.history.replaceState({}, "", "/");

    if (auth === "success") {
      setAuthStatus({ connected: true });
      setOpen(true);
      const msg =
        "Your Swiggy account is connected! What would you like to order?";
      addAssistantMessage(msg);
      speak(msg);
    } else {
      const reason = params.get("reason") ?? "unknown";
      setOpen(true);
      addAssistantMessage(
        `Couldn't connect your Swiggy account (${reason}). Try again?`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);


  function addAssistantMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: Date.now(),
      },
    ]);
  }

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setInput("");

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      const updatedHistory: ConversationMessage[] = [
        ...conversationRef.current,
        { role: "user", content: trimmed },
      ];
      conversationRef.current = updatedHistory;

      const loadingId = `loading-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: loadingId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          isLoading: true,
        },
      ]);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedHistory, location: userLocation }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId ? { ...m, isLoading: false, content: "" } : m
          )
        );

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let event: { type: string; text?: string; message?: string };
            try {
              event = JSON.parse(raw);
            } catch {
              continue;
            }

            if (event.type === "reset") {
              // Tool call started — clear any pre-tool narration already streamed
              assistantText = "";
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === loadingId ? { ...m, content: "", isLoading: true } : m
                )
              );
            } else if (event.type === "text" && event.text) {
              assistantText += event.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === loadingId ? { ...m, content: assistantText, isLoading: false } : m
                )
              );
            } else if (event.type === "error") {
              throw new Error(event.message ?? "Stream error");
            }
          }
        }

        conversationRef.current = [
          ...updatedHistory,
          { role: "assistant", content: assistantText },
        ];

        if (assistantText) speak(assistantText);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, isLoading: false, content: `Error: ${msg}` }
              : m
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  async function handleDisconnect() {
    await fetch("/api/auth/status", { method: "DELETE" });
    setAuthStatus({ connected: false });
    addAssistantMessage("Disconnected from Swiggy. Connect again anytime.");
  }

  return (
    <>
      {/* Expanded panel */}
      {open && (
        <div className="fixed bottom-[5.5rem] md:bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-50 flex w-[calc(100vw-1rem)] max-w-[360px] max-h-[560px] md:max-h-[600px] flex-col overflow-hidden rounded-2xl bg-[#111] shadow-2xl ring-1 ring-white/10">
          {/* Panel header */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-[#0A0A0A] px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FC8019]">
              <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-none">
                Swiggy Concierge
              </p>
              {userLocation ? (
                <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-[#FC8019] truncate">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5 shrink-0">
                    <path d="M8 1C5.51 1 3.5 3.01 3.5 5.5c0 3.28 4.5 9.5 4.5 9.5s4.5-6.22 4.5-9.5C12.5 3.01 10.49 1 8 1zm0 6.25c-.97 0-1.75-.78-1.75-1.75S7.03 3.75 8 3.75 9.75 4.53 9.75 5.5 8.97 7.25 8 7.25z" />
                  </svg>
                  {userLocation}
                </p>
              ) : (
                <p className="mt-0.5 text-[10px] text-gray-500">AI Food Assistant</p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  authStatus.connected ? "bg-green-400" : "bg-gray-600",
                ].join(" ")}
              />
              <button
                onClick={() => setOpen(false)}
                className="ml-1 rounded-md p-1 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 bg-[#0A0A0A] px-3 pb-3 pt-2 space-y-2">
            {!authStatus.connected && (
              <ConnectSwiggy
                status={authStatus}
                onDisconnect={handleDisconnect}
              />
            )}
            {authStatus.connected && (
              <ConnectSwiggy
                status={authStatus}
                onDisconnect={handleDisconnect}
              />
            )}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Type a message…"
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#FC8019]/50 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FC8019] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                </svg>
              </button>
              <VoiceButton onTranscript={sendMessage} disabled={loading} />
            </div>
            <p className="text-center text-[9px] text-gray-700">
              Tap mic to speak · Enter to send
            </p>
          </div>
        </div>
      )}

      {/* Floating button — hidden when panel is open */}
      {!open && <button
        onClick={() => setOpen(true)}
        onTouchEnd={(e) => { e.preventDefault(); setOpen(true); }}
        aria-label="Open Swiggy Concierge"
        className="fixed bottom-20 md:bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FC8019] text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(252,128,25,0.4)] sm:right-6"
      >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2Z" />
          </svg>

        {/* Notification dot when disconnected */}
        {!authStatus.connected && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            !
          </span>
        )}
      </button>}
    </>
  );
}
