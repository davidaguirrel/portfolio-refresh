"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { chatErrorMessage } from "@/lib/twin/chat-errors";
import { MAX_MESSAGES, MAX_USER_CHARS } from "@/lib/twin/message-limits";

const EXAMPLES = [
  "Tell me about your background and experience.",
  "What are you looking for in your next role?",
  "What are your strongest technical skills?",
  "How can I get in touch with you?",
];

// Only the simple Markdown the prompt allows. Anything else shows as plain text.
const ALLOWED_ELEMENTS = ["p", "strong", "em", "ul", "ol", "li", "a", "br"];

type ChatPanelProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ id, open, onClose }: ChatPanelProps) {
  // useChat keeps the messages and POSTs them to /api/chat by default
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    clearError,
    stop,
  } = useChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";
  // Leave room for the reply, so the API never sees more than MAX_MESSAGES
  const full = messages.length >= MAX_MESSAGES - 1;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy || full) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  function startOver() {
    // Stop an answer that's still arriving, so it can't land in the new chat
    if (busy) void stop();
    setMessages([]);
    clearError();
    inputRef.current?.focus();
  }

  return (
    <section
      id={id}
      hidden={!open}
      aria-label="Chat with David's AI twin"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className="fixed inset-0 flex flex-col overflow-hidden bg-surface sm:static sm:h-[min(34rem,calc(100dvh-7rem))] sm:w-96 sm:rounded-2xl sm:border sm:border-border sm:shadow-card"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display font-semibold">David’s AI twin</h2>
          <p className="text-xs text-muted">
            Answers about my career. It can make mistakes.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startOver}
              className="rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-fg"
            >
              New chat
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-md p-1 text-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </div>
      </header>

      <div role="log" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-muted">
              Hi! I’m David’s AI twin. Ask me about my experience, skills or
              projects.
            </p>
            <ul className="mt-4 flex flex-col items-start gap-2">
              {EXAMPLES.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    onClick={() => send(example)}
                    className="rounded-full border border-border px-3 py-1.5 text-left text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          if (!text) return null;

          return message.role === "user" ? (
            <p
              key={message.id}
              className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-sm whitespace-pre-wrap text-bg"
            >
              {text}
            </p>
          ) : (
            <div
              key={message.id}
              className="max-w-[90%] space-y-2 text-sm leading-relaxed [&_a]:text-accent [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            >
              <Markdown
                allowedElements={ALLOWED_ELEMENTS}
                unwrapDisallowed
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {text}
              </Markdown>
            </div>
          );
        })}

        {status === "submitted" && (
          <p className="text-sm text-muted motion-safe:animate-pulse">
            Thinking…
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {chatErrorMessage(error)}
          </p>
        )}

        {full && (
          <p className="text-sm text-muted">
            This chat is full.{" "}
            <button
              type="button"
              onClick={startOver}
              className="font-semibold text-accent underline"
            >
              Start over
            </button>
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-border p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={MAX_USER_CHARS}
          disabled={full}
          placeholder="Ask about my experience…"
          aria-label="Your message"
          className="min-w-0 flex-1 rounded-full border border-border bg-bg px-4 py-2 text-base placeholder:text-muted focus:border-accent focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={busy || full || !input.trim()}
          className="rounded-full bg-linear-to-r from-violet-600 to-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          Send
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-muted">
        Messages are processed by Anthropic to answer you. Please don’t share
        private information.
      </p>
    </section>
  );
}
