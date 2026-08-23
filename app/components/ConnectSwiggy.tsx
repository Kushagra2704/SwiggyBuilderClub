"use client";

import type { AuthStatus } from "@/types";

interface Props {
  status: AuthStatus;
  onDisconnect: () => void;
}

export default function ConnectSwiggy({ status, onDisconnect }: Props) {
  if (status.connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-xs text-gray-400">Connected to Swiggy</span>
        <button
          onClick={onDisconnect}
          className="ml-auto text-xs text-gray-500 underline hover:text-gray-300 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/swiggy"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC8019] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path
          fillRule="evenodd"
          d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
          clipRule="evenodd"
        />
      </svg>
      Connect Swiggy Account
    </a>
  );
}
