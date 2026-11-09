"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// The chat code (AI SDK and Markdown) only downloads after the first click,
// so it never slows down the page for visitors who don't open the chat
const ChatPanel = dynamic(
  () => import("./chat-panel").then((module) => module.ChatPanel),
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

  // Give focus back to the button after closing, so keyboard users don't get
  // lost. It runs after the render, once the button is visible again on phones.
  useEffect(() => {
    if (loaded && !open) buttonRef.current?.focus();
  }, [loaded, open]);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {loaded && (
        <ChatPanel id={PANEL_ID} open={open} onClose={() => setOpen(false)} />
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={loaded ? PANEL_ID : undefined}
        className={`items-center gap-3 rounded-full bg-linear-to-r from-violet-600 to-cyan-700 p-1 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 motion-safe:hover:-translate-y-0.5 sm:pr-5 ${
          // On phones the open panel fills the screen and has its own close button
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* Decorative: the button's name comes from the text next to it */}
        <Image
          src="/twin-avatar.jpg"
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full"
        />
        {/* Hidden on phones to keep the button small, but always read aloud */}
        <span className="sr-only sm:not-sr-only">
          {open ? "Close chat" : "Ask my AI twin"}
        </span>
      </button>
    </div>
  );
}
