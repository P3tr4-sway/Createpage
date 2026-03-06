import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Search, Music, Clock, MoreHorizontal } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface ProjectsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectsSheet({ open, onOpenChange }: ProjectsSheetProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const portalContainer = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : document.getElementById("design-workbench-portal-root") || document.body,
    [],
  );

  const filters = ["all", "track", "loop", "remix", "stem"];

  const filtered = allProjects.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.type === activeFilter;
    const matchesSearch =
      search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        container={portalContainer}
        className="!w-[480px] !max-w-[480px] flex flex-col"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          fontFamily: FONT,
        }}
      >
        <SheetHeader className="pb-0">
          <SheetTitle
            style={{
              color: "var(--foreground)",
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: FONT,
            }}
          >
            My Projects
          </SheetTitle>
          <SheetDescription
            style={{
              color: "var(--secondary)",
              fontSize: "var(--text-sm)",
              fontFamily: FONT,
            }}
          >
            {allProjects.length} projects
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div style={{ padding: "0 var(--spacing-4, 16px)" }}>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg border"
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
              placeholder="Search projects…"
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

        {/* Filter chips */}
        <div
          className="flex gap-2"
          style={{ padding: "0 var(--spacing-4, 16px)", WebkitOverflowScrolling: "touch" }}
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
                borderRadius: "var(--radius-tooltip)",
                border: `1px solid ${
                  activeFilter === f
                    ? "var(--chip-active-border)"
                    : "var(--border)"
                }`,
                textTransform: "capitalize",
                letterSpacing: "0.04em",
              }}
            >
              {f === "all" ? "All" : f === "track" ? "Song" : f}
            </button>
          ))}
        </div>

        {/* Project list */}
        <div
          className="flex-1 overflow-y-auto flex flex-col gap-1"
          style={{ padding: "0 var(--spacing-4, 16px)" }}
        >
          {filtered.map((project) => (
            <button
              key={project.id}
              type="button"
              className="tablet-touch-target tablet-pressable tablet-hover-soft flex w-full items-center gap-4 rounded-lg text-left"
              style={{
                padding: "10px 12px",
                fontFamily: FONT,
                background: "transparent",
              }}
            >
              {/* Thumbnail */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <ImageWithFallback
                  src={project.imageUrl}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.7)" }}
                />
                {/* Type dot */}
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

              {/* Info */}
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
                    {project.type === "track" ? "Song" : project.type}
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

              {/* Timestamp + more */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1" style={{ color: "var(--secondary)", opacity: 0.5 }}>
                  <Clock size={12} strokeWidth={1.5} />
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      fontFamily: FONT,
                    }}
                  >
                    {project.updatedAt}
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
                No projects found
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Export recent projects for use in MainContent chips
export const recentProjects = allProjects.slice(0, 5);
