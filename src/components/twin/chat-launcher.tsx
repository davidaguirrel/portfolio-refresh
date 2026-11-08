"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// The chat code (AI SDK and Markdown) only downloads after the first click,
// so it never slows down the page for visitors who don't open the chat
const ChatPanel = dynamic(
  () => import("../../lib/twin/chat-panel").then((module) => module.ChatPanel),
  { ssr: false },
);

const PANEL_ID = "twin-chat";

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  // Stays true after the first open, so closing keeps the conversation
  const [loaded, setLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    setLoaded(true);
    setOpen((isOpen) => !isOpen);
  }

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {loaded && <ChatPanel id={PANEL_ID} open={open} onClose={close} />}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={loaded ? PANEL_ID : undefined}
        className="flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-cyan-700 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 motion-safe:hover:-translate-y-0.5"
      >
        <span aria-hidden="true">{open ? "✕" : "✦"}</span>
        {open ? "Close chat" : "Ask my AI twin"}
      </button>
    </div>
  );
}
