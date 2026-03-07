import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useEntranceLocale } from "../../modules/entrance/EntranceLocaleContext";

interface InstantBackingTrackPageProps {
  onBack: () => void;
  initialFilter?: string;
}

interface BackingTrackItem {
  id: string;
  keyLabel: string;
  title: string;
  meta: string;
  tags: string[];
  cardColor: string;
}

const filters = [
  "Saved",
  "Hot",
  "New",
  "Pop",
  "Blues",
  "Samurai Jam Tracks",
  "Funk",
  "Rock",
  "Country",
  "R&B",
  "Neo-Soul",
];

const tracks: BackingTrackItem[] = [
  {
    id: "t1",
    keyLabel: "Am",
    title: "Slow Rock",
    meta: "Rock, 4/4",
    tags: ["Rock", "Hot"],
    cardColor: "#A96072",
  },
  {
    id: "t2",
    keyLabel: "G",
    title: "Bluesy Ballad",
    meta: "Pop, 6/8",
    tags: ["Pop", "Hot"],
    cardColor: "#73B0CF",
  },
  {
    id: "t3",
    keyLabel: "A",
    title: "Slow Blues In A",
    meta: "Blues, 4/4",
    tags: ["Blues", "Hot"],
    cardColor: "#5C7AB8",
  },
  {
    id: "t4",
    keyLabel: "G",
    title: "Soul Rock",
    meta: "Rock, 4/4",
    tags: ["Rock", "Neo-Soul"],
    cardColor: "#79AEB2",
  },
  {
    id: "t5",
    keyLabel: "C",
    title: "Reggae Groove",
    meta: "Reggae, 4/4",
    tags: ["New", "Hot"],
    cardColor: "#A79886",
  },
  {
    id: "t6",
    keyLabel: "E",
    title: "E Blues",
    meta: "Blues, 4/4",
    tags: ["Blues", "New"],
    cardColor: "#5B7BB8",
  },
  {
    id: "t7",
    keyLabel: "Bm",
    title: "Minor Blues",
    meta: "Blues, 4/4",
    tags: ["Blues", "Hot"],
    cardColor: "#3079BF",
  },
  {
    id: "t8",
    keyLabel: "Bm",
    title: "Classic Rock",
    meta: "Rock, 4/4",
    tags: ["Rock", "Country"],
    cardColor: "#A96E72",
  },
  {
    id: "t9",
    keyLabel: "D",
    title: "Funk Pocket",
    meta: "Funk, 4/4",
    tags: ["Funk", "Hot"],
    cardColor: "#6C8A5A",
  },
  {
    id: "t10",
    keyLabel: "Em",
    title: "Midnight Neo-Soul",
    meta: "Neo-Soul, 4/4",
    tags: ["Neo-Soul", "Saved"],
    cardColor: "#5A6C86",
  },
  {
    id: "t11",
    keyLabel: "F",
    title: "Country Train",
    meta: "Country, 4/4",
    tags: ["Country", "New"],
    cardColor: "#8C7A62",
  },
  {
    id: "t12",
    keyLabel: "C#m",
    title: "R&B Night Drive",
    meta: "R&B, 6/8",
    tags: ["R&B", "Hot"],
    cardColor: "#6B6D92",
  },
  {
    id: "t13",
    keyLabel: "A",
    title: "Pop Lift",
    meta: "Pop, 4/4",
    tags: ["Pop", "New"],
    cardColor: "#6A90AA",
  },
  {
    id: "t14",
    keyLabel: "Gm",
    title: "Soul Pocket",
    meta: "Neo-Soul, 4/4",
    tags: ["Neo-Soul", "Samurai Jam Tracks"],
    cardColor: "#68868A",
  },
  {
    id: "t15",
    keyLabel: "E",
    title: "Electric Shuffle",
    meta: "Blues, 12/8",
    tags: ["Blues", "Saved"],
    cardColor: "#4F73A2",
  },
  {
    id: "t16",
    keyLabel: "B",
    title: "Arena Rock",
    meta: "Rock, 4/4",
    tags: ["Rock", "Hot"],
    cardColor: "#7C6669",
  },
  {
    id: "t17",
    keyLabel: "Dm",
    title: "Lo-Fi Funk Jam",
    meta: "Funk, 4/4",
    tags: ["Funk", "Samurai Jam Tracks"],
    cardColor: "#5F7D6E",
  },
  {
    id: "t18",
    keyLabel: "F#m",
    title: "Dream Pop",
    meta: "Pop, 4/4",
    tags: ["Pop", "Saved"],
    cardColor: "#6B86A8",
  },
  {
    id: "t19",
    keyLabel: "C",
    title: "Blue Highway",
    meta: "Country, 4/4",
    tags: ["Country", "Hot"],
    cardColor: "#8D7E68",
  },
  {
    id: "t20",
    keyLabel: "Am",
    title: "Silk R&B",
    meta: "R&B, 4/4",
    tags: ["R&B", "Saved"],
    cardColor: "#7A6D86",
  },
];

const backingTrackCopyByLocale = {
  en: {
    back: "Back",
    title: "Instant Backing Track",
    filter: "Filter",
    showLess: "Show Less",
    showMore: (count: number) => `Show More (${count} more)`,
    filterLabels: {
      Saved: "Saved",
      Hot: "Hot",
      New: "New",
      Pop: "Pop",
      Blues: "Blues",
      "Samurai Jam Tracks": "Samurai Jam Tracks",
      Funk: "Funk",
      Rock: "Rock",
      Country: "Country",
      "R&B": "R&B",
      "Neo-Soul": "Neo-Soul",
    },
  },
  "zh-CN": {
    back: "返回",
    title: "即时伴奏",
    filter: "筛选",
    showLess: "收起",
    showMore: (count: number) => `显示更多（还有 ${count} 项）`,
    filterLabels: {
      Saved: "已收藏",
      Hot: "热门",
      New: "最新",
      Pop: "流行",
      Blues: "布鲁斯",
      "Samurai Jam Tracks": "武士 Jam 曲库",
      Funk: "放克",
      Rock: "摇滚",
      Country: "乡村",
      "R&B": "R&B",
      "Neo-Soul": "Neo-Soul",
    },
  },
} as const;

export function InstantBackingTrackPage({
  onBack,
  initialFilter = "Hot",
}: InstantBackingTrackPageProps) {
  const locale = useEntranceLocale();
  const copy = backingTrackCopyByLocale[locale];
  const [activeFilter, setActiveFilter] = useState("Hot");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_VISIBLE_COUNT = 12;

  useEffect(() => {
    setActiveFilter(filters.includes(initialFilter) ? initialFilter : "Hot");
    setShowAll(false);
  }, [initialFilter]);

  const filteredTracks = useMemo(() => {
    if (["Saved", "Hot", "New", "Samurai Jam Tracks"].includes(activeFilter)) {
      return tracks;
    }
    const filtered = tracks.filter((track) =>
      track.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase()),
    );
    return filtered.length > 0 ? filtered : tracks;
  }, [activeFilter]);

  const visibleTracks = showAll
    ? filteredTracks
    : filteredTracks.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = Math.max(filteredTracks.length - INITIAL_VISIBLE_COUNT, 0);

  return (
    <section className="w-full" style={{ fontFamily: "var(--app-font-family)" }}>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="tablet-touch-target tablet-pressable tablet-hover-fade inline-flex items-center gap-2"
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            backgroundColor: "var(--soft-surface)",
          }}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          {copy.back}
        </button>

        <h2
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          {copy.title}
        </h2>

        <div style={{ width: 60 }} />
      </div>

      <div className="mb-6 flex items-center gap-2.5 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              type="button"
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setShowAll(false);
              }}
              className="tablet-touch-target tablet-pressable whitespace-nowrap"
              style={{
                padding: "0 18px",
                borderRadius: 12,
                border: isActive ? "1px solid var(--chip-active-border)" : "1px solid var(--border)",
                backgroundColor: isActive ? "var(--chip-active-bg)" : "var(--chip-bg)",
                color: isActive ? "var(--chip-active-text)" : "var(--chip-text)",
                fontSize: "var(--text-sm)",
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.1,
              }}
            >
              {copy.filterLabels[filter as keyof typeof copy.filterLabels]}
            </button>
          );
        })}

        <button
          type="button"
          className="tablet-touch-target tablet-pressable ml-auto inline-flex items-center gap-2 whitespace-nowrap"
          style={{
            padding: "0 16px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            backgroundColor: "var(--chip-bg)",
            color: "var(--chip-text)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          <SlidersHorizontal size={16} strokeWidth={1.8} />
          {copy.filter}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {visibleTracks.map((track) => (
          <button
            type="button"
            key={track.id}
            className="tablet-pressable tablet-hover-fade relative overflow-hidden text-left"
            style={{
              borderRadius: "var(--radius-card)",
              minHeight: 250,
              border: "1px solid var(--border)",
              backgroundColor: track.cardColor,
              isolation: "isolate",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                color: "rgba(24,33,54,0.75)",
                fontSize: "clamp(68px, 6vw, 104px)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {track.keyLabel}
            </div>

            <div
              className="absolute inset-x-0 bottom-0 z-10"
              style={{
                padding: "18px 20px 18px",
              }}
            >
              <h3
                style={{
                  color: "var(--on-image-primary)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-weight-bold)",
                  lineHeight: 1.15,
                  marginBottom: 6,
                }}
              >
                {track.title}
              </h3>
              <p
                style={{
                  color: "var(--on-image-secondary)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {track.meta}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredTracks.length > INITIAL_VISIBLE_COUNT && (
        <div className="flex justify-center" style={{ marginTop: "var(--spacing-6, 24px)" }}>
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="tablet-touch-target tablet-pressable tablet-hover-fade"
            style={{
              backgroundColor: "transparent",
              color: "var(--foreground)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "var(--app-font-family)",
              padding: "0 24px",
              borderRadius: "var(--radius-full, 9999px)",
              border: "1px solid var(--border)",
              letterSpacing: "0.04em",
            }}
          >
            {showAll ? copy.showLess : copy.showMore(hiddenCount)}
          </button>
        </div>
      )}
    </section>
  );
}
