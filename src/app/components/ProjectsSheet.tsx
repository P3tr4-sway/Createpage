import { useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, Music, Clock, MoreHorizontal, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEntranceLocale } from "../../modules/entrance/EntranceLocaleContext";

export interface ProjectEntry {
  id: string;
  title: string;
  type: "track" | "loop" | "remix" | "stem";
  updatedAt: string;
  bpm?: number;
  key?: string;
  imageUrl: string;
}

const allProjects: ProjectEntry[] = [
  {
    id: "p1",
    title: "Late-Night Neo-Soul Improv in D Minor",
    type: "track",
    updatedAt: "2 hours ago",
    bpm: 82,
    key: "Dm",
    imageUrl:
      "https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwY29uY2VydCUyMGNyb3dkJTIwbXVzaWN8ZW58MXx8fHwxNzcyNDg4MDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p2",
    title: "Broken-Beat Groove with Swing Feel",
    type: "loop",
    updatedAt: "5 hours ago",
    bpm: 110,
    key: "G",
    imageUrl:
      "https://images.unsplash.com/photo-1518132977555-6bce51766237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2F0aGVkcmFsJTIwYXJjaGl0ZWN0dXJlJTIwYW1iaWVudHxlbnwxfHx8fDE3NzI2MTA5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p3",
    title: "Slow Ocean-Like Ambience with Movement",
    type: "track",
    updatedAt: "Yesterday",
    bpm: 68,
    key: "C",
    imageUrl:
      "https://images.unsplash.com/photo-1768943913492-bb89bf0672af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZSUyMG1peGluZyUyMG11c2ljfGVufDF8fHx8MTc3MjYxMDk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p4",
    title: "Vocal-Only Groove from a Classic Pop Song",
    type: "stem",
    updatedAt: "Yesterday",
    imageUrl:
      "https://images.unsplash.com/photo-1761638174184-122e41283194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjB2b2NhbGlzdCUyMG1pY3JvcGhvbmUlMjBzdHVkaW98ZW58MXx8fHwxNzcyNjEwOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p5",
    title: "80s Ballad Turned into Ambient Scene",
    type: "remix",
    updatedAt: "2 days ago",
    bpm: 95,
    key: "Eb",
    imageUrl:
      "https://images.unsplash.com/photo-1700224174799-1ac666263d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNhc3NldHRlJTIwdGFwZSUyMHZpbnRhZ2V8ZW58MXx8fHwxNzcyNTc1MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p6",
    title: "Short Loop Turned into a Full Song Structure",
    type: "loop",
    updatedAt: "3 days ago",
    bpm: 126,
    key: "Am",
    imageUrl:
      "https://images.unsplash.com/photo-1761503556208-d8d9efd02d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBzdHJpbmdzJTIwY2xvc2UlMjB1cCUyMG11c2ljaWFufGVufDF8fHx8MTc3MjYxMDk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p7",
    title: "Midnight Drift — Ambient Synth Layers",
    type: "track",
    updatedAt: "4 days ago",
    bpm: 72,
    key: "F#m",
    imageUrl:
      "https://images.unsplash.com/photo-1760507388320-2500b019f3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aGVzaXplciUyMGtleWJvYXJkJTIwYW1iaWVudCUyMGRhcmslMjBuZW9ufGVufDF8fHx8MTc3MjYxNzM0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p8",
    title: "Crate Digger Sessions Vol. 3",
    type: "remix",
    updatedAt: "5 days ago",
    bpm: 90,
    key: "Bb",
    imageUrl:
      "https://images.unsplash.com/photo-1659117675918-69ec794c64f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMHBsYXllciUyMHR1cm50YWJsZSUyMGRhcmt8ZW58MXx8fHwxNzcyNjE3MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p9",
    title: "Raw Trap Drum Take, One Shot",
    type: "stem",
    updatedAt: "1 week ago",
    bpm: 140,
    imageUrl:
      "https://images.unsplash.com/photo-1696245843884-3fbc53aad9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnVtJTIwa2l0JTIwcGVyY3Vzc2lvbiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzI2MTczMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "p10",
    title: "Slap Bass Groove in G",
    type: "loop",
    updatedAt: "1 week ago",
    bpm: 100,
    key: "G",
    imageUrl:
      "https://images.unsplash.com/photo-1761596897055-5c2ae7f56290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNzJTIwZ3VpdGFyJTIwc3RyaW5ncyUyMGNsb3NlJTIwdXAlMjBkYXJrfGVufDF8fHx8MTc3MjYxNzMzOHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const typeColorMap: Record<string, string> = {
  track: "var(--primary)",
  loop: "#4ECDC4",
  remix: "#FF6B6B",
  stem: "#A78BFA",
};

const FONT = "var(--app-font-family)";

const projectsCopyByLocale = {
  en: {
    closeAriaLabel: "Close my projects dialog",
    title: "My Projects",
    projectsLabel: (count: number) => `${count} projects`,
    searchPlaceholder: "Search projects…",
    filterLabels: {
      all: "All",
      track: "Song",
      loop: "Loop",
      remix: "Remix",
      stem: "Stem",
    },
    typeLabels: {
      track: "Song",
      loop: "Loop",
      remix: "Remix",
      stem: "Stem",
    },
    updatedAtLabels: {
      "2 hours ago": "2 hours ago",
      "5 hours ago": "5 hours ago",
      Yesterday: "Yesterday",
      "2 days ago": "2 days ago",
      "3 days ago": "3 days ago",
      "4 days ago": "4 days ago",
      "5 days ago": "5 days ago",
      "1 week ago": "1 week ago",
    },
    noProjects: "No projects found",
  },
  "zh-CN": {
    closeAriaLabel: "关闭我的项目弹窗",
    title: "我的项目",
    projectsLabel: (count: number) => `${count} 个项目`,
    searchPlaceholder: "搜索项目…",
    filterLabels: {
      all: "全部",
      track: "歌曲",
      loop: "Loop",
      remix: "Remix",
      stem: "Stem",
    },
    typeLabels: {
      track: "歌曲",
      loop: "Loop",
      remix: "Remix",
      stem: "Stem",
    },
    updatedAtLabels: {
      "2 hours ago": "2 小时前",
      "5 hours ago": "5 小时前",
      Yesterday: "昨天",
      "2 days ago": "2 天前",
      "3 days ago": "3 天前",
      "4 days ago": "4 天前",
      "5 days ago": "5 天前",
      "1 week ago": "1 周前",
    },
    noProjects: "没有找到项目",
  },
} as const;

interface ProjectsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectsSheet({ open, onOpenChange }: ProjectsSheetProps) {
  const locale = useEntranceLocale();
  const copy = projectsCopyByLocale[locale];
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const portalContainer = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : document.getElementById("design-workbench-portal-root") || document.body,
    [],
  );
  const inverseScale = "var(--workbench-inverse-scale, 1)";
  const inWorkbenchPortal = portalContainer?.id === "design-workbench-portal-root";

  const filters = ["all", "track", "loop", "remix", "stem"];

  const filtered = allProjects.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.type === activeFilter;
    const matchesSearch =
      search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              gap: 20,
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
                border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--background) 82%, transparent)",
                color: "var(--foreground)",
              }}
            >
              <X size={18} strokeWidth={1.8} />
            </button>

            <div
              className="border-b"
              style={{
                padding: "28px 28px 20px",
                borderColor: "color-mix(in srgb, var(--border) 74%, transparent)",
              }}
            >
              <DialogPrimitive.Title
                style={{
                  color: "var(--foreground)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: "var(--font-weight-bold)",
                  fontFamily: FONT,
                }}
              >
                {copy.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                style={{
                  marginTop: 6,
                  color: "var(--secondary)",
                  fontSize: "var(--text-sm)",
                  fontFamily: FONT,
                }}
              >
                {copy.projectsLabel(allProjects.length)}
              </DialogPrimitive.Description>
            </div>

            <div style={{ padding: "0 28px" }}>
              <div
                className="flex items-center gap-3 rounded-[18px] border px-4 py-3"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                }}
              >
                <Search
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--secondary)", flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    color: "var(--foreground)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    fontFamily: FONT,
                  }}
                />
              </div>
            </div>

            <div
              className="flex gap-2 overflow-x-auto"
              style={{ padding: "0 28px 2px", WebkitOverflowScrolling: "touch" }}
            >
              {filters.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="tablet-touch-target tablet-pressable whitespace-nowrap"
                  style={{
                    backgroundColor:
                      activeFilter === f
                        ? "var(--chip-active-bg)"
                        : "transparent",
                    color:
                      activeFilter === f
                        ? "var(--chip-active-text)"
                        : "var(--secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: FONT,
                    padding: "0 14px",
                    borderRadius: 999,
                    border: `1px solid ${
                      activeFilter === f
                        ? "var(--chip-active-border)"
                        : "var(--border)"
                    }`,
                    textTransform: "capitalize",
                    letterSpacing: "0.04em",
                  }}
                >
                  {copy.filterLabels[f as keyof typeof copy.filterLabels]}
                </button>
              ))}
            </div>

            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "0 20px 22px" }}
            >
              <div
                className="flex flex-col gap-1"
                style={{
                  padding: 8,
                  borderRadius: 24,
                  backgroundColor: "color-mix(in srgb, var(--surface-glass) 78%, transparent)",
                }}
              >
                {filtered.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className="tablet-touch-target tablet-pressable tablet-hover-soft flex w-full items-center gap-4 rounded-[18px] text-left"
                    style={{
                      padding: "12px 14px",
                      fontFamily: FONT,
                      background: "transparent",
                    }}
                  >
                    <div
                      className="relative overflow-hidden flex-shrink-0"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                      }}
                    >
                      <ImageWithFallback
                        src={project.imageUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "brightness(0.7)" }}
                      />
                      <div
                        className="absolute bottom-1 left-1"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "9999px",
                          backgroundColor: typeColorMap[project.type] || "var(--secondary)",
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          color: "var(--foreground)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          fontFamily: FONT,
                          lineHeight: 1.3,
                          margin: 0,
                        }}
                      >
                        {project.title}
                      </p>
                      <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                        <span
                          style={{
                            color: typeColorMap[project.type] || "var(--secondary)",
                            fontSize: "var(--text-sm)",
                            fontFamily: FONT,
                            textTransform: "capitalize",
                            opacity: 0.8,
                          }}
                          >
                          {copy.typeLabels[project.type]}
                        </span>
                        {project.bpm && (
                          <span
                            style={{
                              color: "var(--secondary)",
                              fontSize: "var(--text-sm)",
                              fontFamily: FONT,
                              opacity: 0.5,
                            }}
                          >
                            {project.bpm} bpm
                          </span>
                        )}
                        {project.key && (
                          <span
                            style={{
                              color: "var(--secondary)",
                              fontSize: "var(--text-sm)",
                              fontFamily: FONT,
                              opacity: 0.5,
                            }}
                          >
                            {project.key}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1" style={{ color: "var(--secondary)", opacity: 0.5 }}>
                        <Clock size={12} strokeWidth={1.5} />
                        <span
                          style={{
                            fontSize: "var(--text-sm)",
                            fontFamily: FONT,
                          }}
                        >
                          {copy.updatedAtLabels[project.updatedAt as keyof typeof copy.updatedAtLabels]}
                        </span>
                      </div>
                      <MoreHorizontal
                        size={16}
                        strokeWidth={1.5}
                        style={{ color: "var(--secondary)", opacity: 0.4 }}
                      />
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && (
                  <div
                    className="flex flex-col items-center justify-center py-12"
                    style={{ color: "var(--secondary)", opacity: 0.5 }}
                  >
                    <Music size={32} strokeWidth={1} />
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        fontFamily: FONT,
                        marginTop: 12,
                      }}
                    >
                      {copy.noProjects}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Export recent projects for use in MainContent chips
export const recentProjects = allProjects.slice(0, 5);
