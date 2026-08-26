"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Message } from "@/types";

interface UpiPayload {
  vpa: string;
  amount: string;
  name: string;
  note?: string;
}

interface PaymentLinkPayload {
  url: string;
  amount: string;
  description: string;
}

interface Props {
  message: Message;
}

type Part = { type: "text" | "upi" | "payment_link"; value: string };

// Split content into text segments, UPI_PAY blocks, and PAYMENT_LINK blocks
function parseContent(content: string): Part[] {
  const parts: Part[] = [];
  const re = /\[(UPI_PAY|PAYMENT_LINK)\]([\s\S]*?)\[\/\1\]/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(content)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: content.slice(last, match.index) });
    }
    const blockType: Part["type"] = match[1] === "UPI_PAY" ? "upi" : "payment_link";
    parts.push({ type: blockType, value: match[2].trim() });
    last = match.index + match[0].length;
  }
  if (last < content.length) {
    parts.push({ type: "text", value: content.slice(last) });
  }
  return parts;
}

function PaymentLinkCard({ raw }: { raw: string }) {
  let payload: PaymentLinkPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  const isUpiIntent = payload.url.startsWith("upi://");

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
      <div className="flex items-center gap-2 border-b border-white/5 bg-[#FC8019]/10 px-3 py-2">
        <span className="text-sm">💳</span>
        <span className="text-xs font-bold text-[#FC8019]">
          {isUpiIntent ? "UPI Payment" : "Payment"}
        </span>
        <span className="ml-auto text-xs font-bold text-white">₹{payload.amount}</span>
      </div>
      <div className="flex flex-col items-center gap-3 p-4">
        {isUpiIntent && (
          <div className="rounded-xl bg-white p-3 shadow-inner">
            <QRCodeSVG value={payload.url} size={160} level="M" includeMargin={false} />
          </div>
        )}
        {payload.description && (
          <p className="text-center text-xs text-gray-300">{payload.description}</p>
        )}
        <a
          href={payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FC8019] py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          {isUpiIntent ? "Open in UPI App" : `Pay ₹${payload.amount} →`}
        </a>
      </div>
    </div>
  );
}

function UpiPayCard({ raw }: { raw: string }) {
  let payload: UpiPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  const upiUrl = `upi://pay?pa=${encodeURIComponent(payload.vpa)}&pn=${encodeURIComponent(payload.name)}&am=${payload.amount}&cu=INR${payload.note ? `&tn=${encodeURIComponent(payload.note)}` : ""}`;

  function copyVpa() {
    navigator.clipboard.writeText(payload.vpa).catch(() => {});
  }

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-[#FC8019]/10 px-3 py-2">
        <span className="text-sm">💳</span>
        <span className="text-xs font-bold text-[#FC8019]">UPI Payment</span>
        <span className="ml-auto text-xs font-bold text-white">₹{payload.amount}</span>
      </div>

      {/* QR */}
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="rounded-xl bg-white p-3 shadow-inner">
          <QRCodeSVG
            value={upiUrl}
            size={160}
            level="M"
            includeMargin={false}
          />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-white">{payload.name}</p>
          {payload.note && (
            <p className="mt-0.5 text-[10px] text-gray-400">{payload.note}</p>
          )}
        </div>

        {/* VPA + copy */}
        <div
          onClick={copyVpa}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition-colors"
          title="Click to copy UPI ID"
        >
          <span className="text-xs text-gray-300 font-mono">{payload.vpa}</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gray-500">
            <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
            <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
          </svg>
        </div>

        {/* Open in UPI app */}
        <a
          href={upiUrl}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FC8019] py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          Open in UPI App
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const parts = parseContent(message.content);

  return (
    <div className={["flex w-full", isUser ? "justify-end" : "justify-start"].join(" ")}>
      {!isUser && (
        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FC8019] text-xs font-bold text-white">
          S
        </div>
      )}

      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-[#2A2A2A] text-white"
            : "rounded-tl-sm bg-[#1E1E1E] text-gray-100",
        ].join(" ")}
      >
        {message.isLoading ? (
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
          </span>
        ) : (
          parts.map((part, i) =>
            part.type === "upi" ? (
              <UpiPayCard key={i} raw={part.value} />
            ) : part.type === "payment_link" ? (
              <PaymentLinkCard key={i} raw={part.value} />
            ) : (
              <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part.value}</span>
            )
          )
        )}
      </div>

      {isUser && (
        <div className="ml-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-xs text-gray-400">
          U
        </div>
      )}
    </div>
  );
}
