import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Lock, MessageCircleQuestion, Pencil, X } from "lucide-react";

interface TutorialNoteProps {
  title: string;
  points: string[];
  style?: CSSProperties;
  panelWidth?: number;
  panelSide?: "left" | "right";
}

const FONT = "'Lava', sans-serif";

export function TutorialNote({
  title,
  points,
  style,
  panelWidth = 320,
  panelSide = "right",
}: TutorialNoteProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedTitle, setSavedTitle] = useState(title);
  const [savedPoints, setSavedPoints] = useState(points);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftText, setDraftText] = useState(points.join("\n"));
  const [triggerPosition, setTriggerPosition] = useState({ top: 24, left: 24 });
  const [panelPosition, setPanelPosition] = useState({ top: 24, left: 24 });
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const TRIGGER_SIZE = 32;
  const TRIGGER_Z_INDEX = 2147483646;
  const PANEL_Z_INDEX = 2147483647;

  const lockEdits = useCallback(() => {
    const normalizedPoints = draftText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    setSavedTitle(draftTitle.trim() || "未命名批注");
    setSavedPoints(
      normalizedPoints.length > 0 ? normalizedPoints : ["请填写这条批注的说明内容。"],
    );
    setIsEditing(false);
  }, [draftText, draftTitle]);

  const closePanel = useCallback(() => {
    if (isEditing) {
      lockEdits();
    }
    setOpen(false);
  }, [isEditing, lockEdits]);

  const updateTriggerPosition = useCallback(() => {
    if (!anchorRef.current) return;
    const anchorRect = anchorRef.current.getBoundingClientRect();
    setTriggerPosition({
      top: anchorRect.top,
      left: anchorRect.left,
    });
  }, []);

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 260;
    const viewportPadding = 12;
    const gap = 12;

    let left =
      panelSide === "right"
        ? triggerRect.right + gap
        : triggerRect.left - panelWidth - gap;
    const minLeft = viewportPadding;
    const maxLeft = window.innerWidth - panelWidth - viewportPadding;
    if (maxLeft < minLeft) {
      left = minLeft;
    } else {
      left = Math.max(minLeft, Math.min(left, maxLeft));
    }

    let top = triggerRect.top;
    const minTop = viewportPadding;
    const maxTop = window.innerHeight - panelHeight - viewportPadding;
    if (maxTop < minTop) {
      top = minTop;
    } else {
      top = Math.max(minTop, Math.min(top, maxTop));
    }

    setPanelPosition({ top, left });
  }, [panelSide, panelWidth]);

  useEffect(() => {
    const handleLayout = () => {
      updateTriggerPosition();
      if (open) {
        updatePanelPosition();
      }
    };

    updateTriggerPosition();
    const frame = requestAnimationFrame(handleLayout);
    window.addEventListener("resize", handleLayout);
    window.addEventListener("scroll", handleLayout, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleLayout);
      window.removeEventListener("scroll", handleLayout, true);
    };
  }, [open, updatePanelPosition, updateTriggerPosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const inTrigger = Boolean(triggerRef.current && target && triggerRef.current.contains(target));
      const inPanel = Boolean(
        panelRef.current && target && panelRef.current.contains(target),
      );
      if (!inTrigger && !inPanel) {
        closePanel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    updatePanelPosition();
    const frame = requestAnimationFrame(updatePanelPosition);

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closePanel, open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    updatePanelPosition();
  }, [open, isEditing, draftText, updatePanelPosition]);

  const panel = open && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={panelRef}
          className="rounded-xl border"
          style={{
            position: "fixed",
            top: panelPosition.top,
            left: panelPosition.left,
            width: panelWidth,
            zIndex: PANEL_Z_INDEX,
            padding: "14px 14px 12px",
            backgroundColor: "rgba(0,0,0,0.96)",
            borderColor: "rgba(255,255,255,0.24)",
            color: "#FFFFFF",
            fontFamily: FONT,
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            {isEditing ? (
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.35)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  padding: "8px 10px",
                  fontSize: 16,
                  fontWeight: "var(--font-weight-bold)",
                  lineHeight: 1.35,
                  fontFamily: FONT,
                  outline: "none",
                }}
              />
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: "var(--font-weight-bold)",
                  color: "#FFFFFF",
                  lineHeight: 1.35,
                }}
              >
                {savedTitle}
              </p>
            )}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    lockEdits();
                    return;
                  }

                  setDraftTitle(savedTitle);
                  setDraftText(savedPoints.join("\n"));
                  setIsEditing(true);
                }}
                className="flex items-center justify-center cursor-pointer"
                aria-label={isEditing ? "Lock tutorial note text" : "Edit tutorial note text"}
                style={{
                  width: 22,
                  height: 22,
                  border: "1px solid rgba(255,255,255,0.32)",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {isEditing ? <Lock size={12} strokeWidth={2} /> : <Pencil size={12} strokeWidth={2} />}
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="flex items-center justify-center cursor-pointer"
                aria-label="Close tutorial note"
                style={{
                  width: 20,
                  height: 20,
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              rows={Math.max(4, savedPoints.length + 1)}
              style={{
                width: "100%",
                marginTop: 10,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.35)",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                padding: "10px 12px",
                fontSize: 14,
                lineHeight: 1.5,
                fontFamily: FONT,
                outline: "none",
                resize: "vertical",
              }}
            />
          ) : (
            <div className="flex flex-col" style={{ gap: 8, marginTop: 10 }}>
              {savedPoints.map((point) => (
                <p
                  key={point}
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {point}
                </p>
              ))}
            </div>
          )}

          {isEditing && (
            <p
              style={{
                margin: 0,
                marginTop: 8,
                fontSize: 12,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              多行会自动拆分为多条批注；点锁图标或关闭即完成并锁定。
            </p>
          )}
        </div>,
        document.body,
      )
    : null;

  const trigger = typeof document !== "undefined"
    ? createPortal(
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85"
          aria-label={open ? "Hide tutorial note" : "Show tutorial note"}
          style={{
            position: "fixed",
            top: triggerPosition.top,
            left: triggerPosition.left,
            width: TRIGGER_SIZE,
            height: TRIGGER_SIZE,
            borderRadius: "9999px",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.75)",
            color: "#0B0B0B",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            zIndex: TRIGGER_Z_INDEX,
          }}
        >
          <MessageCircleQuestion size={16} strokeWidth={1.8} />
        </button>,
        document.body,
      )
    : null;

  return (
    <>
      <div ref={anchorRef} className="absolute" style={style} />
      {trigger}
      {panel}
    </>
  );
}
