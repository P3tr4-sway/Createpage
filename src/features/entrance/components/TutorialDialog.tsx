import { useMemo, type CSSProperties, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { BookOpen, Clock3, PlayCircle, X } from "lucide-react";
import { useEntranceLocale } from "@/features/entrance/EntranceLocaleContext";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";

const FONT = "var(--app-font-family)";

export type TutorialLesson = {
  id: string;
  title: string;
  duration: string;
  summary: string;
};

export type TutorialDiscussion = {
  id: number;
  user: string;
  text: string;
};

export type TutorialCourse = {
  id: string;
  title: string;
  mentor: string;
  level: string;
  duration: string;
  imageUrl: string;
  summary: string;
  lessons: TutorialLesson[];
  discussions: TutorialDiscussion[];
};

export const tutorialCourses: TutorialCourse[] = [
  {
    id: "t1",
    title: "Build Your First Song Idea",
    mentor: "Maya Chen",
    level: "Beginner",
    duration: "18 min",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    summary:
      "A fast path from empty screen to a song sketch you can keep shaping. Focus is on idea capture, not DAW theory.",
    lessons: [
      { id: "t1-l1", title: "Pick the emotional direction", duration: "4 min", summary: "Start from mood and reference, not tools." },
      { id: "t1-l2", title: "Lay down the core motif", duration: "6 min", summary: "Turn one phrase into a loopable musical center." },
      { id: "t1-l3", title: "Shape a rough structure", duration: "8 min", summary: "Expand the motif into verse, lift, and release." },
    ],
    discussions: [
      { id: 1, user: "Ari", text: "The emotional-direction step is helpful. It keeps me from overthinking plugins first." },
      { id: 2, user: "Nora", text: "Would love a follow-up on turning the rough structure into a full arrangement." },
    ],
  },
  {
    id: "t2",
    title: "Loop Faster Without Losing Feel",
    mentor: "Jonas Reed",
    level: "Beginner",
    duration: "12 min",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    summary:
      "A compact tutorial on getting to a groove quickly while keeping enough movement to stay musical.",
    lessons: [
      { id: "t2-l1", title: "Find the right pocket first", duration: "3 min", summary: "Choose tempo and spacing before stacking sounds." },
      { id: "t2-l2", title: "Layer with contrast", duration: "5 min", summary: "Add one supporting part that changes the feel, not just the volume." },
      { id: "t2-l3", title: "Save three useful variations", duration: "4 min", summary: "Create enough versions to jam or build into a song later." },
    ],
    discussions: [
      { id: 1, user: "Theo", text: "Saving loop variations early is the part I usually skip. Good reminder." },
      { id: 2, user: "Lina", text: "Would be great to have genre-specific examples for this one." },
    ],
  },
  {
    id: "t3",
    title: "Jam Into Something Worth Keeping",
    mentor: "Elena Park",
    level: "Intermediate",
    duration: "15 min",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    summary:
      "Use guided prompts and fast reflection to turn a loose jam into a reusable musical idea.",
    lessons: [
      { id: "t3-l1", title: "Start with a single constraint", duration: "4 min", summary: "Limit key, texture, or tempo so the jam has direction." },
      { id: "t3-l2", title: "Mark the moments that hit", duration: "5 min", summary: "Listen back fast and capture the sections with emotional weight." },
      { id: "t3-l3", title: "Convert the jam into a repeatable seed", duration: "6 min", summary: "Make it easy to reopen and continue later." },
    ],
    discussions: [
      { id: 1, user: "Milan", text: "The constraint idea really helps. Jams get better when I stop trying to keep every option open." },
      { id: 2, user: "Jules", text: "A shortcut for marking good moments during the jam would make this even stronger." },
    ],
  },
  {
    id: "t4",
    title: "Catch a Riff Before It Disappears",
    mentor: "Tara Kim",
    level: "All levels",
    duration: "10 min",
    imageUrl:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    summary:
      "A practical capture flow for guitar or keys players who need to move from instinct to saved idea in seconds.",
    lessons: [
      { id: "t4-l1", title: "Capture first, label later", duration: "3 min", summary: "Don't stop to organize while the idea is still alive." },
      { id: "t4-l2", title: "Keep one playable take", duration: "4 min", summary: "Choose the version with feel, not the cleanest version." },
      { id: "t4-l3", title: "Add the one sentence future note", duration: "3 min", summary: "Leave a clue for your future self about where to take it." },
    ],
    discussions: [
      { id: 1, user: "Ken", text: "The future note idea is small but surprisingly useful when reopening sketches days later." },
      { id: 2, user: "Ava", text: "Would love a version of this flow specifically for voice memos and mobile capture." },
    ],
  },
];

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial: TutorialCourse | null;
}

const tutorialDialogCopyByLocale = {
  en: {
    closeAriaLabel: "Close tutorial dialog",
    tutorial: "Tutorial",
    lessons: "Lessons",
    discussion: "Discussion",
    mentor: "Mentor",
    lessonUnit: "lessons",
    messageUnit: "messages",
    partLabel: (index: number) => `Part ${index}`,
    levelLabels: {
      Beginner: "Beginner",
      Intermediate: "Intermediate",
      "All levels": "All levels",
    },
    levelSuffix: "level",
  },
  "zh-CN": {
    closeAriaLabel: "关闭教程弹窗",
    tutorial: "教程",
    lessons: "课程内容",
    discussion: "讨论",
    mentor: "导师",
    lessonUnit: "节课程",
    messageUnit: "条消息",
    partLabel: (index: number) => `第 ${index} 节`,
    levelLabels: {
      Beginner: "初级",
      Intermediate: "中级",
      "All levels": "全级别",
    },
    levelSuffix: "难度",
  },
} as const;

export function TutorialDialog({ open, onOpenChange, tutorial }: TutorialDialogProps) {
  const locale = useEntranceLocale();
  const copy = tutorialDialogCopyByLocale[locale];
  const portalContainer = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : document.getElementById("design-workbench-portal-root") || document.body,
    [],
  );
  const inverseScale = "var(--workbench-inverse-scale, 1)";
  const inWorkbenchPortal = portalContainer?.id === "design-workbench-portal-root";

  if (!tutorial) {
    return null;
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal container={portalContainer}>
        <div
          style={{
            position: inWorkbenchPortal ? "absolute" : "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: `scale(${inverseScale})`,
            transformOrigin: "center center",
            overflow: "hidden",
            pointerEvents: "auto",
            zIndex: 340,
          }}
        >
          <DialogPrimitive.Overlay
            className={inWorkbenchPortal ? "absolute inset-0" : "fixed inset-0"}
            style={{ backgroundColor: "rgba(6, 8, 14, 0.58)" }}
          />

          <DialogPrimitive.Content
            className={inWorkbenchPortal ? "absolute" : "fixed"}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(920px, calc(100% - 72px))",
              height: "min(760px, calc(100% - 72px))",
              maxWidth: 920,
              maxHeight: 760,
              display: "flex",
              flexDirection: "column",
              padding: 0,
              borderRadius: 30,
              border: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--background) 94%, rgba(10,12,18,0.92) 6%)",
              boxShadow: "0 36px 100px rgba(0,0,0,0.34)",
              fontFamily: FONT,
              outline: "none",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={copy.closeAriaLabel}
              className="tablet-icon-target tablet-pressable absolute top-5 right-5 z-10 flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.14)",
                backgroundColor: "rgba(0,0,0,0.26)",
                color: "white",
              }}
            >
              <X size={18} strokeWidth={1.8} />
            </button>

            <div className="relative" style={{ minHeight: 250, flexShrink: 0 }}>
              <ImageWithFallback
                src={tutorial.imageUrl}
                alt={tutorial.title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(0.55)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.24) 40%, rgba(12,12,12,0.88) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0" style={{ padding: "0 28px 26px" }}>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {copy.tutorial}
                </p>
                <DialogPrimitive.Title
                  style={{
                    marginTop: 10,
                    color: "white",
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1.02,
                    letterSpacing: "-0.04em",
                    maxWidth: 540,
                  }}
                >
                  {tutorial.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description
                  style={{
                    marginTop: 10,
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    lineHeight: 1.5,
                    maxWidth: 620,
                  }}
                >
                  {tutorial.summary}
                </DialogPrimitive.Description>
                <div className="mt-4 flex flex-wrap gap-2">
                  <MetaChip icon={<BookOpen size={14} strokeWidth={1.8} />} label={`${tutorial.lessons.length} ${copy.lessonUnit}`} />
                  <MetaChip icon={<Clock3 size={14} strokeWidth={1.8} />} label={tutorial.duration} />
                  <MetaChip
                    icon={<PlayCircle size={14} strokeWidth={1.8} />}
                    label={`${copy.levelLabels[tutorial.level as keyof typeof copy.levelLabels] ?? tutorial.level} ${copy.levelSuffix}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ padding: "24px 24px 28px" }}>
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 style={sectionTitleStyle}>{copy.lessons}</h3>
                  <p style={sectionHintStyle}>{copy.mentor}: {tutorial.mentor}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {tutorial.lessons.map((lesson, index) => (
                    <article
                      key={lesson.id}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 22,
                        border: "1px solid var(--border)",
                        backgroundColor: "color-mix(in srgb, var(--card) 84%, transparent)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p style={lessonIndexStyle}>{copy.partLabel(index + 1)}</p>
                          <h4 style={lessonTitleStyle}>{lesson.title}</h4>
                        </div>
                        <span style={lessonDurationStyle}>{lesson.duration}</span>
                      </div>
                      <p style={lessonSummaryStyle}>{lesson.summary}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section style={{ marginTop: 24 }}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 style={sectionTitleStyle}>{copy.discussion}</h3>
                  <p style={sectionHintStyle}>{tutorial.discussions.length} {copy.messageUnit}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {tutorial.discussions.map((post) => (
                    <article
                      key={post.id}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 22,
                        border: "1px solid var(--border)",
                        backgroundColor: "color-mix(in srgb, var(--soft-surface) 88%, transparent)",
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {post.user.slice(0, 1)}
                        </div>
                        <span style={discussionUserStyle}>{post.user}</span>
                      </div>
                      <p style={discussionBodyStyle}>{post.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function MetaChip({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{
        height: 34,
        padding: "0 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "white",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const sectionHintStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

const lessonIndexStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const lessonTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--foreground)",
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.2,
};

const lessonDurationStyle: CSSProperties = {
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const lessonSummaryStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "var(--secondary)",
  fontSize: 14,
  lineHeight: 1.5,
};

const discussionUserStyle: CSSProperties = {
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 700,
};

const discussionBodyStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 14,
  lineHeight: 1.5,
};
