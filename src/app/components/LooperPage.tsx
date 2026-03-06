import { useMemo, useState } from "react";
import { ArrowLeft, CirclePlus, SlidersHorizontal } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LooperPageProps {
  onBack: () => void;
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

export function LooperPage({ onBack }: LooperPageProps) {
  const [activeFilter, setActiveFilter] = useState("Hot");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_VISIBLE_COUNT = 9;

  const filteredTracks = useMemo(() => {
    if (["Saved", "Hot", "New"].includes(activeFilter)) {
      return tracks;
    }
    return tracks.filter((track) =>
      track.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase()),
    );
  }, [activeFilter]);

  const resultTracks = filteredTracks.length > 0 ? filteredTracks : tracks;
  const visibleTracks = showAll
    ? resultTracks
    : resultTracks.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = Math.max(resultTracks.length - INITIAL_VISIBLE_COUNT, 0);

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
          Back
        </button>

        <h2
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          Looper
        </h2>

        <div style={{ width: 60 }} />
      </div>

      <div className="mb-6 flex items-center gap-2.5 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const isDrumless = filter === "Drumless Loop";
          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActiveFilter(filter);
                setShowAll(false);
              }}
              className="tablet-touch-target tablet-pressable inline-flex items-center gap-1.5 whitespace-nowrap"
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
              {isDrumless && <CirclePlus size={15} strokeWidth={1.8} />}
              {filter}
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
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {visibleTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className="tablet-pressable tablet-hover-fade relative overflow-hidden text-left"
            style={{
              borderRadius: "var(--radius-card)",
              minHeight: 250,
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              isolation: "isolate",
            }}
          >
            <ImageWithFallback
              src={track.imageUrl}
              alt={track.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div
              className="absolute inset-x-0 bottom-0 z-10"
              style={{
                padding: "16px 20px",
                backgroundColor: "var(--image-overlay-footer)",
                backdropFilter: "blur(2px)",
              }}
            >
              <h3
                style={{
                  color: "var(--on-image-primary)",
                  fontSize: "clamp(30px, 1.8vw, 40px)",
                  fontWeight: "var(--font-weight-bold)",
                  lineHeight: 1.08,
                  marginBottom: 4,
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

      {resultTracks.length > INITIAL_VISIBLE_COUNT && (
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
            {showAll ? "Show Less" : `Show More (${hiddenCount} more)`}
          </button>
        </div>
      )}
    </section>
  );
}
