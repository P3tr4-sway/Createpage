import { useRef, useState } from "react";
import {
  ListFilter,
  Bookmark,
  Music,
  Disc3,
  Piano,
  Repeat,
  FolderOpen,
  ChevronRight,
  Bot,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { ModeSelector } from "./ModeSelector";
import { JamWithAI } from "./JamWithAI";
import { ProjectsSheet, recentProjects } from "./ProjectsSheet";
import { TemplateSheet } from "./TemplateSheet";
import { TutorialNote } from "./TutorialNote";
import { InstantBackingTrackPage } from "./InstantBackingTrackPage";
import { LooperPage } from "./LooperPage";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const dawCards = [
  {
    title: "Agentic Producing",
    description: "AI helps you produce, step by step.",
    subDescription: "Next generation music production.",
    icon: Bot,
  },
  {
    title: "Stems Separation",
    description: "Isolate vocals, instruments, and more.",
    subDescription: "Ready to flip, layer, or remix.",
    icon: ListFilter,
  },
  {
    title: "Remix a Song",
    description: "Import any track. Shift its genre, tempo, or vibe.",
    subDescription: "Output a full remix — your sound, your rules.",
    icon: Bookmark,
  },
];

const loopCards = [
  {
    title: "Looper",
    description: "Record. Layer. Loop.",
    subDescription: "Your loop pedal — but smarter.",
    icon: Music,
  },
  {
    title: "Instant Backing Track",
    description: "Pick a style. Get a backing track instantly.",
    subDescription: "Choose from the library and start jamming.",
    icon: Disc3,
  },
];

const modeOptions = [
  {
    id: "daw",
    label: "Studio Mode",
    tagline: "Build, remix, or start from a stem. Your session, your rules.",
    icon: Piano,
    cards: dawCards,
  },
  {
    id: "loop",
    label: "Live Mode",
    tagline: "A groove, ready when you are. Record and layer as you go.",
    icon: Repeat,
    cards: loopCards,
  },
];

const playerCards = [
  {
    title: "Late-Night Neo-Soul Improv in D Minor",
    author: "Albert Flores",
    imageUrl:
      "https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwY29uY2VydCUyMGNyb3dkJTIwbXVzaWN8ZW58MXx8fHwxNzcyNDg4MDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "A",
  },
  {
    title: "Broken-Beat Groove with Swing Feel",
    author: "Guy Hawkins",
    imageUrl:
      "https://images.unsplash.com/photo-1518132977555-6bce51766237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2F0aGVkcmFsJTIwYXJjaGl0ZWN0dXJlJTIwYW1iaWVudHxlbnwxfHx8fDE3NzI2MTA5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "G",
  },
  {
    title: "Slow Ocean-Like Ambience with Movement",
    author: "Floyd Miles",
    imageUrl:
      "https://images.unsplash.com/photo-1768943913492-bb89bf0672af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZSUyMG1peGluZyUyMG11c2ljfGVufDF8fHx8MTc3MjYxMDk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "F",
  },
  {
    title: "Vocal-Only Groove from a Classic Pop Song",
    author: "Jenny Wilson",
    imageUrl:
      "https://images.unsplash.com/photo-1761638174184-122e41283194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjB2b2NhbGlzdCUyMG1pY3JvcGhvbmUlMjBzdHVkaW98ZW58MXx8fHwxNzcyNjEwOTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "J",
  },
  {
    title: "80s Ballad Turned into Ambient Scene",
    author: "Devon Lane",
    imageUrl:
      "https://images.unsplash.com/photo-1700224174799-1ac666263d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNhc3NldHRlJTIwdGFwZSUyMHZpbnRhZ2V8ZW58MXx8fHwxNzcyNTc1MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "D",
  },
  {
    title: "Short Loop Turned into a Full Song Structure",
    author: "Cody Fisher",
    imageUrl:
      "https://images.unsplash.com/photo-1761503556208-d8d9efd02d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBzdHJpbmdzJTIwY2xvc2UlMjB1cCUyMG11c2ljaWFufGVufDF8fHx8MTc3MjYxMDk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "C",
  },
  {
    title: "Midnight Drift — Ambient Synth Layers",
    author: "Marcus Bell",
    imageUrl:
      "https://images.unsplash.com/photo-1760507388320-2500b019f3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aGVzaXplciUyMGtleWJvYXJkJTIwYW1iaWVudCUyMGRhcmslMjBuZW9ufGVufDF8fHx8MTc3MjYxNzM0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "M",
  },
  {
    title: "Broken Chord Improvisation in E♭",
    author: "Nadia Osei",
    imageUrl:
      "https://images.unsplash.com/photo-1741190745018-50ed4935c493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwcGlhbmlzdCUyMGhhbmRzJTIwa2V5cyUyMGRhcmt8ZW58MXx8fHwxNzcyNjE3MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "N",
  },
  {
    title: "Crate Digger Sessions Vol. 3",
    author: "Ray Santos",
    imageUrl:
      "https://images.unsplash.com/photo-1659117675918-69ec794c64f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMHBsYXllciUyMHR1cm50YWJsZSUyMGRhcmt8ZW58MXx8fHwxNzcyNjE3MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "R",
  },
  {
    title: "Raw Trap Drum Take, One Shot",
    author: "Sam Ekow",
    imageUrl:
      "https://images.unsplash.com/photo-1696245843884-3fbc53aad9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnVtJTIwa2l0JTIwcGVyY3Vzc2lvbiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzI2MTczMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "S",
  },
  {
    title: "Slap Bass Groove in G",
    author: "Tara Kim",
    imageUrl:
      "https://images.unsplash.com/photo-1761596897055-5c2ae7f56290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNzJTIwZ3VpdGFyJTIwc3RyaW5ncyUyMGNsb3NlJTIwdXAlMjBkYXJrfGVufDF8fHx8MTc3MjYxNzMzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "T",
  },
  {
    title: "Lo-Fi Study Beat, No Breaks",
    author: "Zara Mensah",
    imageUrl:
      "https://images.unsplash.com/photo-1656231267321-282e40e05d24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwaGVhZHBob25lcyUyMHN0dWRpbyUyMGRhcmt8ZW58MXx8fHwxNzcyNjE3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "Z",
  },
  {
    title: "Free Jazz, Late in the City",
    author: "Owen Dale",
    imageUrl:
      "https://images.unsplash.com/photo-1768935434604-2301398d92d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXhvcGhvbmUlMjBqYXp6JTIwbXVzaWNpYW4lMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzI2MTczMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "O",
  },
  {
    title: "Mix Tape — Final Stereo Master",
    author: "Priya Rajan",
    imageUrl:
      "https://images.unsplash.com/photo-1700166269606-b5ea327d0540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhpbmclMjBjb25zb2xlJTIwYXVkaW8lMjBmYWRlcnMlMjBzdHVkaW98ZW58MXx8fHwxNzcyNjE3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "P",
  },
  {
    title: "Live Set Closing, Crowd Goes Silent",
    author: "Leo Marsh",
    imageUrl:
      "https://images.unsplash.com/photo-1765278797923-10a027f5c69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBkYXJrJTIwY3Jvd2R8ZW58MXx8fHwxNzcyNjE3MzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    avatarInitial: "L",
  },
];

const topSongNames = [
  "Midnight Echoes",
  "City After Rain",
  "Golden Hour Drive",
  "Broken Neon",
  "Slow Motion Heart",
  "Static in My Head",
  "Parallel Love",
  "Paper Moon",
];

const topTemplateNames = [
  "Neo-Soul Starter (92 BPM, Am)",
  "Lo-Fi Piano Pack (78 BPM, C)",
  "Trap Bounce Kit (140 BPM, F#)",
  "Ambient Texture Bed (70 BPM, Dm)",
  "Pop Hook Builder (122 BPM, G)",
  "R&B Vocal Space (88 BPM, Bb)",
  "Cinematic Rise Template (100 BPM, Em)",
];

interface ShowcaseComment {
  id: number;
  user: string;
  text: string;
}

interface GuitarShowcaseClip {
  id: string;
  title: string;
  guitarist: string;
  email: string;
  avatarInitial: string;
  duration: string;
  imageUrl: string;
  comments: ShowcaseComment[];
}

const guitarShowcaseClips: GuitarShowcaseClip[] = [
  {
    id: "g1",
    title: "Percussive Fingerstyle in Drop D",
    guitarist: "Mason Reed",
    email: "mason.reed@fretmail.com",
    avatarInitial: "M",
    duration: "00:42",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Nora", text: "Great palm muting. The groove feels super tight." },
      { id: 2, user: "Jules", text: "Can you share the tab for the ending harmonic run?" },
      { id: 3, user: "Theo", text: "Clean tone and very controlled dynamics." },
    ],
  },
  {
    id: "g2",
    title: "Neo-Soul Chords with Slides",
    guitarist: "Yuna Park",
    email: "yuna.park@stringspace.io",
    avatarInitial: "Y",
    duration: "01:08",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Lina", text: "Those chord extensions are beautiful. Love the voicings." },
      { id: 2, user: "Marco", text: "Maybe add a little less reverb in the first half." },
      { id: 3, user: "Abe", text: "Slide timing is perfect, very expressive take." },
    ],
  },
  {
    id: "g3",
    title: "Ambient Swells + Volume Knob",
    guitarist: "Leo Santos",
    email: "leo.santos@ambientlane.net",
    avatarInitial: "L",
    duration: "00:55",
    imageUrl:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Ivy", text: "Perfect texture for an intro. Really cinematic." },
      { id: 2, user: "Kenji", text: "Try panning the swell doubles for more width." },
      { id: 3, user: "Mia", text: "This would sit great under vocal ad-libs." },
    ],
  },
  {
    id: "g4",
    title: "Blues Licks in A Minor",
    guitarist: "Tara Nguyen",
    email: "tara.nguyen@bluepick.com",
    avatarInitial: "T",
    duration: "01:21",
    imageUrl:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Rex", text: "Classic phrasing. Bend intonation is spot on." },
      { id: 2, user: "Paul", text: "The call-and-response around 0:36 is fire." },
      { id: 3, user: "Sumi", text: "Could you upload a slower practice version?" },
    ],
  },
  {
    id: "g5",
    title: "Hybrid Picking Groove Study",
    guitarist: "Ethan Cole",
    email: "ethan.cole@groovecraft.co",
    avatarInitial: "E",
    duration: "00:49",
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Dana", text: "Right-hand control is crazy. Super clean articulation." },
      { id: 2, user: "Bryce", text: "Nice pocket. Bass and kick would lock in easily." },
      { id: 3, user: "Noel", text: "Please post the exact picking pattern in comments." },
    ],
  },
];

interface MainContentProps {
  sectionRefs: {
    create: React.RefObject<HTMLDivElement | null>;
    loop: React.RefObject<HTMLDivElement | null>;
    improvs: React.RefObject<HTMLDivElement | null>;
  };
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onOpenAgenticProducing?: () => void;
}

type PlayerItem = (typeof playerCards)[number];

interface TopListColumnProps {
  title: string;
  items: PlayerItem[];
  onItemClick?: (item: PlayerItem) => void;
  onOpenDetail?: () => void;
}

function TopListColumn({ title, items, onItemClick, onOpenDetail }: TopListColumnProps) {
  return (
    <div
      className="rounded-card border overflow-hidden"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      <button
        type="button"
        onClick={onOpenDetail}
        className="w-full flex items-center justify-between text-left cursor-pointer"
        style={{
          padding: "14px 16px",
          border: "none",
          borderBottom: "1px solid var(--border)",
          background: "transparent",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "var(--foreground)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "'Lava', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h3>
        <ChevronRight size={18} strokeWidth={2} style={{ color: "var(--secondary)" }} />
      </button>

      <div className="flex flex-col">
        {items.map((item, index) => {
          const interactive = typeof onItemClick === "function";
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onItemClick?.(item)}
              className="flex items-center justify-between text-left transition-colors"
              style={{
                padding: "10px 12px",
                border: "none",
                borderBottom:
                  index < items.length - 1 ? "1px solid var(--border)" : "none",
                background: "transparent",
                cursor: interactive ? "pointer" : "default",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="relative overflow-hidden flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                  }}
                >
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="truncate"
                    style={{
                      margin: 0,
                      color: "var(--foreground)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      fontFamily: "'Lava', sans-serif",
                      lineHeight: 1.25,
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="truncate"
                    style={{
                      margin: 0,
                      marginTop: 2,
                      color: "var(--secondary)",
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-normal)",
                      fontFamily: "'Lava', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end" style={{ width: 62 }}>
                <MoreHorizontal size={16} strokeWidth={1.8} style={{ color: "var(--secondary)" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TopBrowsePageProps {
  title: string;
  subtitle: string;
  items: PlayerItem[];
  onBack: () => void;
  onItemClick: (item: PlayerItem) => void;
}

function TopBrowsePage({
  title,
  subtitle,
  items,
  onBack,
  onItemClick,
}: TopBrowsePageProps) {
  return (
    <section style={{ fontFamily: "'Lava', sans-serif" }}>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            padding: "6px 10px",
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
            margin: 0,
          }}
        >
          {title}
        </h2>

        <div style={{ width: 60 }} />
      </div>

      <p
        style={{
          color: "var(--secondary)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          margin: 0,
          marginBottom: 16,
        }}
      >
        {subtitle}
      </p>

      <div
        className="rounded-card border overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        {items.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onItemClick(item)}
            className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-muted"
            style={{
              padding: "12px 14px",
              border: "none",
              borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none",
              background: "transparent",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid var(--border)" }}
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="truncate"
                  style={{
                    margin: 0,
                    color: "var(--foreground)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    lineHeight: 1.25,
                  }}
                >
                  {item.title}
                </p>
                <p
                  className="truncate"
                  style={{
                    margin: 0,
                    marginTop: 2,
                    color: "var(--secondary)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-normal)",
                    lineHeight: 1.2,
                  }}
                >
                  {item.author}
                </p>
              </div>
            </div>
            <MoreHorizontal size={16} strokeWidth={1.8} style={{ color: "var(--secondary)" }} />
          </button>
        ))}
      </div>
    </section>
  );
}

export function MainContent({
  sectionRefs,
  onScroll,
  scrollContainerRef,
  onOpenAgenticProducing,
}: MainContentProps) {
  const [activeSubView, setActiveSubView] = useState<
    | "home"
    | "instant-backing-track"
    | "looper"
    | "top-songs"
    | "top-template"
    | "guitar-showcase"
  >("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [songOpen, setSongOpen] = useState(false);
  const [guitarOpen, setGuitarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    author: string;
    imageUrl: string;
    avatarInitial: string;
  } | null>(null);
  const [selectedSong, setSelectedSong] = useState<{
    title: string;
    author: string;
    imageUrl: string;
    avatarInitial: string;
  } | null>(null);
  const [selectedGuitarClip, setSelectedGuitarClip] = useState<{
    title: string;
    author: string;
    imageUrl: string;
    avatarInitial: string;
    email: string;
    comments: ShowcaseComment[];
  } | null>(null);
  const half = Math.ceil(playerCards.length / 2);
  const topSongCatalog = playerCards.slice(0, half).map((item, index) => ({
    ...item,
    title: topSongNames[index] ?? item.title,
  }));
  const topTemplateCatalog = playerCards.slice(half).map((item, index) => ({
    ...item,
    title: topTemplateNames[index] ?? item.title,
  }));
  const topSongs = topSongCatalog.slice(0, 6);
  const topTemplates = topTemplateCatalog.slice(0, 6);
  const guitarShowcaseCatalog = guitarShowcaseClips.map((clip) => ({
    id: clip.id,
    title: clip.title,
    author: clip.guitarist,
    imageUrl: clip.imageUrl,
    avatarInitial: clip.avatarInitial,
  }));

  const handleTemplateClick = (card: typeof playerCards[number]) => {
    setSelectedTemplate(card);
    setTemplateOpen(true);
  };

  const handleSongClick = (card: typeof playerCards[number]) => {
    setSelectedSong(card);
    setSongOpen(true);
  };

  const handleGuitarClick = (clip: GuitarShowcaseClip) => {
    setSelectedGuitarClip({
      title: clip.title,
      author: clip.guitarist,
      imageUrl: clip.imageUrl,
      avatarInitial: clip.avatarInitial,
      email: clip.email,
      comments: clip.comments,
    });
    setGuitarOpen(true);
  };

  const handleModeCardClick = (modeId: string, card: { title: string }) => {
    if (modeId === "daw" && card.title === "Agentic Producing") {
      onOpenAgenticProducing?.();
      return;
    }
    if (modeId === "loop" && card.title === "Looper") {
      setActiveSubView("looper");
    }
    if (modeId === "loop" && card.title === "Instant Backing Track") {
      setActiveSubView("instant-backing-track");
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="relative flex-1 overflow-y-auto px-8"
      style={{ fontFamily: "'Lava', sans-serif", paddingBottom: "120px" }}
    >
      {activeSubView === "looper" ? (
        <LooperPage onBack={() => setActiveSubView("home")} />
      ) : activeSubView === "instant-backing-track" ? (
        <InstantBackingTrackPage onBack={() => setActiveSubView("home")} />
      ) : activeSubView === "top-songs" ? (
        <TopBrowsePage
          title="Top Songs"
          subtitle="Browse all player-uploaded songs with richer context."
          items={topSongCatalog}
          onBack={() => setActiveSubView("home")}
          onItemClick={handleSongClick}
        />
      ) : activeSubView === "top-template" ? (
        <TopBrowsePage
          title="Top Template"
          subtitle="Browse all reusable templates from the player community."
          items={topTemplateCatalog}
          onBack={() => setActiveSubView("home")}
          onItemClick={handleTemplateClick}
        />
      ) : activeSubView === "guitar-showcase" ? (
        <TopBrowsePage
          title="Guitar Showcase"
          subtitle="Browse all community guitar clips and open full performance details."
          items={guitarShowcaseCatalog}
          onBack={() => setActiveSubView("home")}
          onItemClick={(item) => {
            const clip = guitarShowcaseClips.find(
              (source) =>
                source.title === item.title && source.guitarist === item.author,
            );
            if (clip) handleGuitarClick(clip);
          }}
        />
      ) : (
        <>
      {/* Quick actions */}
      <div className="relative mb-8">
        <TutorialNote
        title="这块为什么放在最上面"
        points={[
          "这块优先服务“继续上次工作”，老用户进入后可以最快回到项目。",
          "Recent chips 把历史内容直接露出，减少搜索和记忆成本。",
        ]}
          style={{ top: -8, right: 0 }}
          panelWidth={320}
          panelSide="left"
        />
        <div className="flex gap-3 items-center">
          {/* My Projects sheet opener */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 cursor-pointer transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "'Lava', sans-serif",
              padding: "6px 16px",
              borderRadius: "var(--radius-tooltip)",
              border: "none",
              whiteSpace: "nowrap",
              letterSpacing: "0.04em",
            }}
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            My Projects
          </button>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: "var(--border)",
              flexShrink: 0,
            }}
          />

          {/* Recent project chips */}
          {recentProjects.map((project) => (
            <button
              key={project.id}
              className="cursor-pointer transition-colors hover:opacity-80"
              style={{
                backgroundColor: "var(--chip-bg)",
                color: "var(--chip-text)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Lava', sans-serif",
                padding: "4px 12px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid var(--chip-border)",
                backdropFilter: "blur(6px)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {project.title}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Sheet */}
      <ProjectsSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      {/* miniDAW & Loop -- Two-Step Progressive Disclosure */}
      <section ref={sectionRefs.create} className="relative mb-10">
        <TutorialNote
        title="模式卡片为什么是第一屏核心"
        points={[
          "先让用户选“做歌”还是“即兴”，先定方向再给功能，选择更轻松。",
          "展开后再看细项，属于渐进披露，能明显降低第一屏的信息压力。",
        ]}
          style={{ top: 10, right: 0 }}
          panelWidth={340}
          panelSide="left"
        />
        <ModeSelector modes={modeOptions} onCardClick={handleModeCardClick} />
      </section>

      {/* Improv Section -- AI Chat */}
      <section ref={sectionRefs.loop} className="relative mb-10">
        <TutorialNote
        title="Jam with AI 的定位"
        points={[
          "这是“没灵感也能开工”的入口，用户一句话就能启动创作。",
          "建议词把空白输入变成可点选动作，主要目标是提升激活率。",
        ]}
          style={{ top: 8, right: 0 }}
          panelWidth={320}
          panelSide="left"
        />
        <JamWithAI />
      </section>

      {/* Create by Players */}
      <section ref={sectionRefs.improvs} className="relative">
        <TutorialNote
        title="Made by Players 的作用"
        points={[
          "这里用真实作品做示例，让用户快速理解这个产品能做出什么结果。",
          "点卡片就能进入详情并尝试，形成“看灵感-立刻动手”的闭环。",
        ]}
          style={{ top: 0, right: 0 }}
          panelWidth={320}
          panelSide="left"
        />
        <h2
          className="mb-5"
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "'Lava', sans-serif",
          }}
        >
          Made by Players
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <TopListColumn
            title="Top Songs"
            items={topSongs}
            onItemClick={handleSongClick}
            onOpenDetail={() => setActiveSubView("top-songs")}
          />
          <TopListColumn
            title="Top Template"
            items={topTemplates}
            onItemClick={handleTemplateClick}
            onOpenDetail={() => setActiveSubView("top-template")}
          />
        </div>

        <div
          className="rounded-card border mt-4 overflow-hidden"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSubView("guitar-showcase")}
            className="w-full flex items-center justify-between text-left cursor-pointer"
            style={{
              padding: "14px 16px",
              border: "none",
              background: "transparent",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "var(--foreground)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-bold)",
                  fontFamily: "'Lava', sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                Guitar Showcase
              </h3>
              <p
                style={{
                  margin: 0,
                  marginTop: 2,
                  color: "var(--secondary)",
                  fontSize: "var(--text-xs)",
                  fontFamily: "'Lava', sans-serif",
                }}
              >
                Community guitar clips from players
              </p>
            </div>
            <ChevronRight size={18} strokeWidth={2} style={{ color: "var(--secondary)" }} />
          </button>

          <div
            className="grid grid-cols-5"
            style={{ gap: 10, padding: "12px 12px 14px" }}
          >
            {guitarShowcaseClips.map((clip) => (
              <button
                key={clip.id}
                type="button"
                onClick={() => handleGuitarClick(clip)}
                className="relative overflow-hidden text-left cursor-pointer group transition-opacity hover:opacity-90"
                style={{
                  minHeight: 148,
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                <ImageWithFallback
                  src={clip.imageUrl}
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ padding: "10px 10px 9px" }}
                >
                  <p
                    className="truncate"
                    style={{
                      margin: 0,
                      color: "var(--on-image-primary)",
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-bold)",
                      lineHeight: 1.3,
                      fontFamily: "'Lava', sans-serif",
                    }}
                  >
                    {clip.title}
                  </p>
                  <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                    <span
                      className="truncate"
                      style={{
                        color: "var(--on-image-secondary)",
                        fontSize: "12px",
                        fontWeight: "var(--font-weight-medium)",
                        maxWidth: "72%",
                        fontFamily: "'Lava', sans-serif",
                      }}
                    >
                      {clip.guitarist}
                    </span>
                    <span
                      style={{
                        color: "var(--on-image-secondary)",
                        fontSize: "11px",
                        fontWeight: "var(--font-weight-bold)",
                        letterSpacing: "0.03em",
                        fontFamily: "'Lava', sans-serif",
                      }}
                    >
                      {clip.duration}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template Sheet */}
      <TemplateSheet
        mode="song"
        open={songOpen}
        onClose={() => setSongOpen(false)}
        template={selectedSong}
      />

      <TemplateSheet
        mode="template"
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        template={selectedTemplate}
      />

      <TemplateSheet
        mode="guitar"
        open={guitarOpen}
        onClose={() => setGuitarOpen(false)}
        template={selectedGuitarClip}
      />
        </>
      )}
    </div>
  );
}
