import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  CirclePlus,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEntranceLocale } from "../../modules/entrance/EntranceLocaleContext";

interface LooperPageProps {
  onBack: () => void;
  initialFilter?: string;
}

interface LooperTrackItem {
  id: string;
  title: string;
  meta: string;
  tags: string[];
  imageUrl: string;
}

const filters = [
  "Saved",
  "Hot",
  "New",
  "Pop",
  "Rock",
  "R&B",
  "Metal",
  "Neo-Soul",
  "EDM",
  "Latin",
  "Drumless Loop",
];

const tracks: LooperTrackItem[] = [
  {
    id: "l1",
    title: "Get Lucky",
    meta: "POP, 116 BPM, 27036 played",
    tags: ["Pop", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l2",
    title: "Bossa Nova",
    meta: "Latin, 120 BPM, 14529 played",
    tags: ["Latin", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l3",
    title: "Perfect",
    meta: "POP, 60 BPM, 13854 played",
    tags: ["Pop", "Saved"],
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l4",
    title: "Everything I Do",
    meta: "POP, 65 BPM, 12510 played",
    tags: ["Pop", "New"],
    imageUrl:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l5",
    title: "Leave My Heart Open",
    meta: "Neo-Soul, 75 BPM, 11730 played",
    tags: ["Neo-Soul", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l6",
    title: "I Love U",
    meta: "POP, 115 BPM, 11233 played",
    tags: ["R&B", "Saved"],
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l7",
    title: "Sweet Girl O' Mine",
    meta: "Rock, 126 BPM, 9955 played",
    tags: ["Rock", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l8",
    title: "Classic Blues",
    meta: "Blues, 125 BPM, 9333 played",
    tags: ["New", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l9",
    title: "Lovin' You",
    meta: "R&B, 60 BPM, 8097 played",
    tags: ["R&B", "Hot"],
    imageUrl:
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l10",
    title: "Steel Pulse",
    meta: "Metal, 140 BPM, 7811 played",
    tags: ["Metal", "New"],
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l11",
    title: "Night Runner",
    meta: "EDM, 128 BPM, 7434 played",
    tags: ["EDM", "Hot", "Drumless Loop"],
    imageUrl:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l12",
    title: "Velvet Chords",
    meta: "Neo-Soul, 88 BPM, 7210 played",
    tags: ["Neo-Soul", "Saved"],
    imageUrl:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l13",
    title: "Pulse Delay",
    meta: "EDM, 124 BPM, 6943 played",
    tags: ["EDM", "Drumless Loop"],
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-d220c9f16fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l14",
    title: "Rust & Dust",
    meta: "Rock, 118 BPM, 6520 played",
    tags: ["Rock", "New", "Drumless Loop"],
    imageUrl:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    id: "l15",
    title: "Casa Rhythm",
    meta: "Latin, 122 BPM, 6115 played",
    tags: ["Latin", "Saved"],
    imageUrl:
      "https://images.unsplash.com/photo-1548420329-2f116f28d2e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
];

const looperCopyByLocale = {
  en: {
    back: "Back",
    title: "Looper",
    workspaceEyebrow: "Looper Surface",
    workspaceHint: "The looper stays centered. Switch sources from the library without leaving the performance page.",
    selectorEyebrow: "Loop Library",
    selectorTitle: "Choose a loop",
    selectorCount: (count: number) => `${count} loops`,
    selectedLoop: "Selected loop",
    collapseLibrary: "Collapse library",
    expandLibrary: "Expand library",
    emptyState: "No exact match for this filter. Showing the full library instead.",
    activeFilterLabel: "Filter",
    filterLabels: {
      Saved: "Saved",
      Hot: "Hot",
      New: "New",
      Pop: "Pop",
      Rock: "Rock",
      "R&B": "R&B",
      Metal: "Metal",
      "Neo-Soul": "Neo-Soul",
      EDM: "EDM",
      Latin: "Latin",
      "Drumless Loop": "Drumless Loop",
    },
  },
  "zh-CN": {
    back: "返回",
    title: "循环器",
    workspaceEyebrow: "Looper 本体",
    workspaceHint: "looper 固定在页面中央，右侧 Library 切换素材时不用离开当前操作页。",
    selectorEyebrow: "Loop 选择器",
    selectorTitle: "选择一个 loop",
    selectorCount: (count: number) => `${count} 个 loop`,
    selectedLoop: "当前 loop",
    collapseLibrary: "收起 Library",
    expandLibrary: "展开 Library",
    emptyState: "这个筛选下没有精确结果，已回退显示全部库。",
    activeFilterLabel: "筛选",
    filterLabels: {
      Saved: "已收藏",
      Hot: "热门",
      New: "最新",
      Pop: "流行",
      Rock: "摇滚",
      "R&B": "R&B",
      Metal: "金属",
      "Neo-Soul": "Neo-Soul",
      EDM: "EDM",
      Latin: "拉丁",
      "Drumless Loop": "无鼓 Loop",
    },
  },
} as const;

const libraryFilters = new Set(["Saved", "Hot", "New"]);

function LooperDialGraphic() {
  return (
    <div className="relative aspect-square w-full max-w-[760px]">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(206,206,206,0.26) 0%, rgba(206,206,206,0.18) 49.5%, rgba(255,255,255,0.72) 50.5%, rgba(216,216,216,0.18) 100%)",
          boxShadow:
            "0 42px 90px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.82)",
        }}
      />
      <div
        className="absolute inset-[17%] rounded-full"
        style={{
          border: "4px solid rgba(148, 148, 148, 0.16)",
        }}
      />
      <div
        className="absolute inset-[34%] rounded-full"
        style={{
          border: "4px solid rgba(148, 148, 148, 0.16)",
        }}
      />
      <div
        className="absolute inset-[51%] rounded-full"
        style={{
          border: "4px solid rgba(148, 148, 148, 0.16)",
        }}
      />
      <div
        className="absolute left-1/2 top-[13.5%] h-[36.5%] w-[0.9%] -translate-x-1/2 rounded-full"
        style={{
          backgroundColor: "rgba(128, 128, 128, 0.42)",
        }}
      />
      <div
        className="absolute left-1/2 top-[29%] h-[8.5%] w-[3.2%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(136,136,136,0.34) 0%, rgba(136,136,136,0.42) 44%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 56%, rgba(136,136,136,0.42) 56%, rgba(136,136,136,0.34) 100%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[12.5%] w-[12.5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 32%, rgba(214,214,214,0.88) 0%, rgba(182,182,182,0.82) 100%)",
          boxShadow:
            "0 0 0 10px rgba(170, 170, 170, 0.1), inset 0 0 0 2px rgba(128,128,128,0.2)",
        }}
      />
    </div>
  );
}

export function LooperPage({ onBack, initialFilter = "Hot" }: LooperPageProps) {
  const locale = useEntranceLocale();
  const copy = looperCopyByLocale[locale];
  const [activeFilter, setActiveFilter] = useState("Hot");
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id ?? "");
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);

  useEffect(() => {
    setActiveFilter(filters.includes(initialFilter) ? initialFilter : "Hot");
  }, [initialFilter]);

  const filteredTracks = useMemo(() => {
    if (libraryFilters.has(activeFilter)) {
      return tracks;
    }

    return tracks.filter((track) =>
      track.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase()),
    );
  }, [activeFilter]);

  const hasFilterFallback =
    !libraryFilters.has(activeFilter) && filteredTracks.length === 0;
  const resultTracks = hasFilterFallback ? tracks : filteredTracks;

  useEffect(() => {
    if (resultTracks.length === 0) {
      return;
    }

    if (!resultTracks.some((track) => track.id === selectedTrackId)) {
      setSelectedTrackId(resultTracks[0].id);
    }
  }, [resultTracks, selectedTrackId]);

  const selectedTrack =
    resultTracks.find((track) => track.id === selectedTrackId) ??
    resultTracks[0] ??
    tracks[0];
  const selectedFacts = useMemo(
    () => selectedTrack.meta.split(",").map((item) => item.trim()).filter(Boolean),
    [selectedTrack],
  );
  const activeFilterLabel =
    copy.filterLabels[activeFilter as keyof typeof copy.filterLabels];

  return (
    <section
      className="relative flex h-full min-h-[960px] w-full flex-col overflow-hidden"
      style={{
        fontFamily: "var(--app-font-family)",
        backgroundColor: "var(--card)",
      }}
    >
      <div
        className="relative z-20 flex items-start justify-between px-6 pb-0 pt-5 xl:px-8"
        style={{
          backgroundColor: "transparent",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="tablet-touch-target tablet-pressable tablet-hover-fade inline-flex items-center gap-2"
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            padding: 0,
            height: 32,
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          {copy.back}
        </button>

        <div className="text-center">
          <p
            style={{
              margin: 0,
              color: "var(--secondary)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {copy.workspaceEyebrow}
          </p>
          <h2
            style={{
              margin: "4px 0 0",
              color: "var(--foreground)",
              fontSize: "clamp(22px, 2vw, 28px)",
              fontWeight: "var(--font-weight-bold)",
            }}
          >
            {copy.title}
          </h2>
        </div>

        <div style={{ width: 52 }} />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 flex min-h-0 items-center justify-center overflow-hidden px-4 py-8 xl:px-8 xl:py-10">
          <div className="relative z-10 flex h-full w-full max-w-[1120px] flex-col items-center justify-center">
            <LooperDialGraphic />

            <div className="mt-8 flex max-w-[720px] flex-col items-center gap-3 text-center">
              <h3
                style={{
                  margin: 0,
                  color: "var(--foreground)",
                  fontSize: "clamp(32px, 3.4vw, 56px)",
                  fontWeight: "var(--font-weight-bold)",
                  lineHeight: 0.96,
                }}
              >
                {selectedTrack.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--secondary)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {copy.workspaceHint}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {selectedFacts.map((fact) => (
                  <span
                    key={fact}
                    className="rounded-full px-4 py-2"
                    style={{
                      border: "1px solid rgba(148, 163, 184, 0.16)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside
          className="absolute inset-y-0 right-0 z-20 flex min-h-[420px] flex-col border-l px-4 py-5 xl:min-h-0 xl:px-5 xl:py-6"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
            width: libraryCollapsed ? 104 : 399,
            transition: "width 220ms ease",
          }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            {libraryCollapsed ? (
              <div className="flex min-h-[48px] flex-1 items-center justify-center">
                <span
                  style={{
                    color: "var(--secondary)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  Loop
                </span>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--secondary)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {copy.selectorEyebrow}
                </p>
                <h3
                  style={{
                    margin: "8px 0 4px",
                    color: "var(--foreground)",
                    fontSize: 20,
                    fontWeight: "var(--font-weight-bold)",
                    lineHeight: 1.08,
                  }}
                >
                  {copy.selectorTitle}
                </h3>
              </div>
            )}

            <div className="flex items-center gap-2">
              {libraryCollapsed ? null : (
                <span
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    borderColor: "rgba(148, 163, 184, 0.12)",
                    color: "var(--secondary)",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {copy.selectorCount(resultTracks.length)}
                </span>
              )}

              <button
                type="button"
                onClick={() => setLibraryCollapsed((prev) => !prev)}
                className="tablet-touch-target tablet-pressable inline-flex items-center justify-center rounded-full"
                aria-label={libraryCollapsed ? copy.expandLibrary : copy.collapseLibrary}
                title={libraryCollapsed ? copy.expandLibrary : copy.collapseLibrary}
                style={{
                  width: 38,
                  height: 38,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--soft-surface)",
                  color: "var(--foreground)",
                }}
              >
                {libraryCollapsed ? (
                  <PanelRightOpen size={16} strokeWidth={1.8} />
                ) : (
                  <PanelRightClose size={16} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {libraryCollapsed ? null : (
            <>
              <p
                style={{
                  margin: 0,
                  color: "var(--secondary)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {copy.activeFilterLabel}: {activeFilterLabel}
              </p>
              <div
                className="mt-4 flex gap-3 overflow-x-auto pb-2"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {filters.map((filter) => {
                  const isActive = activeFilter === filter;
                  const isDrumless = filter === "Drumless Loop";
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className="tablet-touch-target tablet-pressable inline-flex h-[56px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-7"
                      style={{
                        borderColor: isActive
                          ? "var(--chip-active-border)"
                          : "rgba(148, 163, 184, 0.18)",
                        backgroundColor: isActive ? "var(--chip-active-bg)" : "var(--chip-bg)",
                        color: isActive ? "var(--chip-active-text)" : "var(--chip-text)",
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 600,
                        minWidth: 88,
                      }}
                    >
                      {isDrumless ? <CirclePlus size={14} strokeWidth={1.8} /> : null}
                      {copy.filterLabels[filter as keyof typeof copy.filterLabels]}
                    </button>
                  );
                })}
              </div>

              {hasFilterFallback ? (
                <div
                  className="mt-4 rounded-[20px] border px-4 py-3"
                  style={{
                    borderColor: "rgba(245, 158, 11, 0.24)",
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    color: "var(--foreground)",
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}
                >
                  {copy.emptyState}
                </div>
              ) : null}
            </>
          )}

          <div
            className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1"
            style={{
              maxHeight: "100%",
              marginTop: libraryCollapsed ? 8 : 16,
              gap: libraryCollapsed ? 10 : 8,
            }}
          >
            {resultTracks.map((track) => {
              const isSelected = track.id === selectedTrack.id;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrackId(track.id)}
                  className="tablet-pressable text-left"
                  style={{
                    borderRadius: libraryCollapsed ? 16 : 20,
                    border: "none",
                    backgroundColor: isSelected
                      ? "var(--soft-surface-strong)"
                      : "transparent",
                    boxShadow: isSelected
                      ? "inset 0 0 0 1px color-mix(in srgb, var(--foreground) 12%, transparent)"
                      : "none",
                    padding: libraryCollapsed ? 6 : "10px 10px 10px 12px",
                  }}
                >
                  <div
                    className={
                      libraryCollapsed
                        ? "flex items-center justify-center"
                        : "flex items-center gap-3"
                    }
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        borderRadius: libraryCollapsed ? 14 : 16,
                        minHeight: libraryCollapsed ? 68 : 52,
                        width: libraryCollapsed ? "100%" : 52,
                        flexShrink: 0,
                        backgroundColor: "var(--soft-surface)",
                      }}
                    >
                      <ImageWithFallback
                        src={track.imageUrl}
                        alt={track.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(15,23,42,0) 30%, rgba(15,23,42,0.54) 100%)",
                        }}
                      />
                    </div>

                    {libraryCollapsed ? null : (
                      <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <h4
                            className="truncate"
                            style={{
                              margin: 0,
                              color: "var(--foreground)",
                              fontSize: 15,
                              fontWeight: "var(--font-weight-bold)",
                              lineHeight: 1.1,
                            }}
                          >
                            {track.title}
                          </h4>
                          <p
                            className="truncate"
                            style={{
                              margin: "4px 0 0",
                              color: "var(--secondary)",
                              fontSize: 12,
                              fontWeight: 600,
                              lineHeight: 1.35,
                            }}
                          >
                            {track.meta}
                          </p>
                        </div>

                        <div className="ml-auto flex items-center justify-end">
                          <ChevronRight
                            size={16}
                            strokeWidth={1.8}
                            style={{ color: "var(--secondary)", flexShrink: 0 }}
                          />
                        </div>
                      </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
