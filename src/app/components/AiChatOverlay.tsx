import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";

interface AiChatOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function AiChatOverlay({ open, onClose }: AiChatOverlayProps) {
  const [draft, setDraft] = useState("");
  const previewMessages = [
    { id: 1, role: "agent", text: "I can help refactor layout, colors, and button hierarchy." },
    { id: 2, role: "user", text: "Make this entrance page feel native to ChatGPT UI." },
    { id: 3, role: "agent", text: "Done. I will keep system-like color, spacing, and simple rounded shapes." },
  ] as const;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const handleSubmit = () => {
    const nextDraft = draft.trim();
    if (!nextDraft) {
      return;
    }

    setDraft("");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-[90] flex items-center justify-center px-4 py-6 sm:px-6"
          style={{
            backgroundColor: "var(--overlay-scrim)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex h-full max-h-[740px] w-full max-w-[920px] flex-col overflow-hidden border border-border"
            style={{
              borderRadius: 24,
              backgroundColor: "var(--float-surface)",
              boxShadow: "var(--float-shadow)",
            }}
            initial={{ opacity: 0, y: 18, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.985 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7"
              style={{ backgroundColor: "var(--float-surface-muted)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center border border-border"
                  style={{
                    borderRadius: 12,
                    backgroundColor: "var(--icon-subtle-bg)",
                  }}
                >
                  <Sparkles size={17} style={{ color: "var(--foreground)" }} />
                </span>
                <div>
                  <p
                    className="leading-none"
                    style={{
                      color: "var(--foreground)",
                      fontWeight: 600,
                      fontSize: 19,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    AI Chat
                  </p>
                  <p
                    className="mt-1 leading-none"
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    Ask, plan, and generate with your agent.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close AI chat"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center border border-border transition-colors"
                style={{
                  borderRadius: 9999,
                  color: "var(--secondary)",
                  backgroundColor: "var(--float-surface-muted)",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
              <div
                className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1"
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  backgroundColor: "var(--float-surface-muted)",
                }}
              >
                Fullscreen AI chat field
              </div>

              <div
                className="flex-1 overflow-y-auto rounded-2xl border border-border p-4 sm:p-5"
                style={{ backgroundColor: "var(--float-surface-soft)" }}
              >
                <div className="mx-auto flex h-full max-w-[760px] flex-col gap-2.5">
                  {previewMessages.map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <div
                        key={message.id}
                        className="flex"
                        style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
                      >
                        <div
                          style={{
                            maxWidth: "82%",
                            borderRadius: isUser ? 14 : 12,
                            padding: "10px 12px",
                            backgroundColor: isUser ? "var(--chat-user-bg)" : "var(--chat-agent-bg)",
                            color: isUser ? "var(--chat-user-fg)" : "var(--chat-agent-fg)",
                            border: isUser
                              ? "1px solid var(--chat-user-border)"
                              : "1px solid var(--chat-agent-border)",
                            fontSize: 14,
                            lineHeight: 1.45,
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="mt-4 rounded-2xl border border-border p-3.5"
                style={{ backgroundColor: "var(--float-surface)" }}
              >
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                      event.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Message AI Agent..."
                  className="w-full resize-none border-0 bg-transparent outline-none"
                  rows={3}
                  style={{
                    color: "var(--foreground)",
                    fontSize: 15,
                    lineHeight: 1.5,
                    fontFamily: "var(--app-font-family)",
                  }}
                />
                <div className="mt-3 flex items-center justify-between">
                  <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                    Ctrl/Cmd + Enter to send
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 transition-all"
                    style={{
                      backgroundColor: "var(--solid-button-bg)",
                      color: "var(--solid-button-fg)",
                      border: "1px solid var(--solid-button-border)",
                      fontWeight: 600,
                      fontSize: 13,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
