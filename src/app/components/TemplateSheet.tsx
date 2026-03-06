import { createPortal } from "react-dom";
import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Heart,
  Bookmark,
  Play,
  Clock,
  Music,
  Users,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const FONT = "var(--app-font-family)";

interface TemplateData {
  title: string;
  author: string;
  imageUrl: string;
  avatarInitial: string;
  email?: string;
  comments?: Array<{
    id: number;
    user: string;
    text: string;
  }>;
}

interface TemplateSheetProps {
  open: boolean;
  onClose: () => void;
  template: TemplateData | null;
  mode?: "template" | "song" | "guitar";
}

/* mock album art grid for this creator */
const albumArt = [
  "https://images.unsplash.com/photo-1676068368612-1c8b3e2afed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFsYnVtJTIwY292ZXIlMjBhcnQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI2MjgyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1551619276-f77b2c749711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwbW9kZXJuJTIwYXJ0JTIwZGFya3xlbnwxfHx8fDE3NzI2Mzc5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1610716632424-4d45990bcd48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMG1peGluZyUyMGJvYXJkJTIwZGFya3xlbnwxfHx8fDE3NzI2Mzc5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const mockStats = {
  plays: "2.4k",
  likes: "318",
  comments: "0",
  remixes: "47",
  bpm: 82,
  key: "Dm",
  duration: "3:42",
  genre: "Neo-Soul",
};

const mockSongStats = {
  plays: "18.7k",
  likes: "1.2k",
  comments: "86",
  remixes: "0",
  bpm: 92,
  key: "Am",
  duration: "3:12",
  genre: "Alt Pop",
};

const mockGuitarStats = {
  plays: "9.6k",
  likes: "742",
  comments: "29",
  remixes: "0",
  bpm: 96,
  key: "Em",
  duration: "0:58",
  genre: "Guitar Performance",
};

const songComments = [
  { id: 1, user: "Ari", text: "Love the chord movement in the hook." },
  { id: 2, user: "Min", text: "Drums hit hard, maybe lift vocal at 2:10." },
  { id: 3, user: "Ken", text: "Could be a great template base for remix." },
];

export function TemplateSheet({
  open,
  onClose,
  template,
  mode = "template",
}: TemplateSheetProps) {
  if (!template) return null;
  const isSong = mode === "song";
  const isGuitar = mode === "guitar";
  const stats = isSong ? mockSongStats : isGuitar ? mockGuitarStats : mockStats;
  const commentList = isSong
    ? songComments
    : isGuitar
      ? template.comments ?? []
      : [];
  const inverseScale = "var(--workbench-inverse-scale, 1)";
  const portalRoot = useMemo(() => {
    if (typeof document === "undefined") return null;
    return (
      document.getElementById("design-workbench-portal-root") || document.body
    );
  }, []);
  const inWorkbenchPortal = portalRoot?.id === "design-workbench-portal-root";
  const panelWidth = 620;

  const content = (
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: inWorkbenchPortal ? "absolute" : "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: `scale(${inverseScale})`,
            transformOrigin: "top right",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Backdrop */}
          <motion.div
            className={`${inWorkbenchPortal ? "absolute" : "fixed"} inset-0 z-50`}
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className={`${inWorkbenchPortal ? "absolute" : "fixed"} top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden`}
            style={{
              width: panelWidth,
              backgroundColor: "var(--background)",
              borderLeft: "1px solid var(--border)",
              fontFamily: FONT,
            }}
            initial={{ x: panelWidth }}
            animate={{ x: 0 }}
            exit={{ x: panelWidth }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            {/* Header area — hero image */}
            <div className="relative" style={{ height: 240, flexShrink: 0 }}>
              <ImageWithFallback
                src={template.imageUrl}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.5)" }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to top, var(--background) 0%, transparent 60%)",
                }}
              >
                <button
                  type="button"
                  aria-label={isSong ? "Play song preview" : isGuitar ? "Play guitar clip preview" : "Play template preview"}
                  className="tablet-icon-target tablet-pressable tablet-hover-fade flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "var(--on-image-control-bg)",
                    border: "1px solid var(--on-image-control-border)",
                    color: "var(--on-image-primary)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Play size={22} strokeWidth={1.5} style={{ marginLeft: 2 }} />
                </button>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close detail sheet"
                className="tablet-icon-target tablet-pressable tablet-hover-fade absolute top-4 right-4 flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "var(--on-image-control-bg)",
                  border: "none",
                  color: "var(--on-image-primary)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
                <p
                  style={{
                    color: "var(--on-image-secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: FONT,
                    margin: 0,
                    marginBottom: 4,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {isSong ? "Song" : isGuitar ? "Guitar Clip" : "Template"}
                </p>
                <h3
                  style={{
                    color: "var(--on-image-primary)",
                    fontSize: "var(--text-xl)",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: FONT,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {template.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
              {/* Author & actions row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: "var(--secondary)",
                      color: "var(--secondary-foreground)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-bold)",
                      fontFamily: FONT,
                    }}
                  >
                    {template.avatarInitial}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--foreground)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-bold)",
                        fontFamily: FONT,
                        margin: 0,
                      }}
                    >
                      {template.author}
                    </p>
                    <p
                      style={{
                        color: "var(--secondary)",
                        fontSize: 13,
                        fontWeight: "var(--font-weight-normal)",
                        fontFamily: FONT,
                        margin: 0,
                      }}
                    >
                      {isGuitar ? "Guitarist" : "Creator"}
                    </p>
                    {isGuitar && template.email ? (
                      <p
                        style={{
                          color: "var(--secondary)",
                          fontSize: 12,
                          fontWeight: "var(--font-weight-normal)",
                          fontFamily: FONT,
                          margin: 0,
                          marginTop: 2,
                        }}
                      >
                        {template.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Action icons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Like item"
                    className="tablet-icon-target tablet-pressable tablet-hover-fade flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "var(--muted)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Save item"
                    className="tablet-icon-target tablet-pressable tablet-hover-fade flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "var(--muted)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <Bookmark size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <StatItem icon={<Play size={14} strokeWidth={1.5} />} label={stats.plays} />
                <StatItem icon={<Heart size={14} strokeWidth={1.5} />} label={stats.likes} />
                <StatItem
                  icon={
                    isSong || isGuitar ? (
                      <MessageCircle size={14} strokeWidth={1.5} />
                    ) : (
                      <Users size={14} strokeWidth={1.5} />
                    )
                  }
                  label={
                    isSong || isGuitar
                      ? `${stats.comments} comments`
                      : `${stats.remixes} remixes`
                  }
                />
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: stats.genre },
                  { label: `${stats.bpm} BPM` },
                  { label: stats.key },
                  { label: stats.duration, icon: <Clock size={12} strokeWidth={1.5} /> },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    className="flex items-center gap-1.5"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      fontSize: 13,
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: FONT,
                      padding: "6px 14px",
                      borderRadius: "var(--radius-tooltip)",
                      border: "1px solid var(--border)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {tag.icon}
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Remix CTA */}
              <button
                type="button"
                className="tablet-touch-target tablet-pressable tablet-hover-fade flex w-full items-center justify-center gap-3"
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-bold)",
                  fontFamily: FONT,
                  padding: "0 18px",
                  minHeight: "var(--touch-target-comfortable)",
                  borderRadius: "var(--radius-tooltip)",
                  border: "none",
                  letterSpacing: "0.04em",
                }}
              >
                <Music size={18} strokeWidth={1.8} />
                {isSong ? "Open Song" : isGuitar ? "Watch Clip" : "Use This Template"}
              </button>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  backgroundColor: "var(--border)",
                }}
              />

              {isSong || isGuitar ? (
                <div>
                  <p
                    style={{
                      color: "var(--secondary)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: FONT,
                      margin: 0,
                      marginBottom: 14,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Comments
                  </p>
                  <div className="flex flex-col gap-2">
                    {commentList.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--muted)",
                          borderRadius: "var(--radius)",
                          padding: "10px 12px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: "var(--foreground)",
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-bold)",
                            fontFamily: FONT,
                            lineHeight: 1.2,
                          }}
                        >
                          {comment.user}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginTop: 4,
                            color: "var(--secondary)",
                            fontSize: "13px",
                            fontWeight: "var(--font-weight-normal)",
                            fontFamily: FONT,
                            lineHeight: 1.4,
                          }}
                        >
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      color: "var(--secondary)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: FONT,
                      margin: 0,
                      marginBottom: 16,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    More by {template.author}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {albumArt.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        <ImageWithFallback
                          src={src}
                          alt={`Album art ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!portalRoot) {
    return content;
  }

  return createPortal(content, portalRoot);
}

function StatItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-1.5"
      style={{
        color: "var(--secondary)",
        fontSize: 13,
        fontWeight: "var(--font-weight-medium)",
        fontFamily: FONT,
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
