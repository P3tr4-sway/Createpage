import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Moon,
  Repeat,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  type UIEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { AgenticProducingPage } from "../../app/components/AgenticProducingPage";
import { ImageWithFallback } from "../../app/components/figma/ImageWithFallback";
import { InstantBackingTrackPage } from "../../app/components/InstantBackingTrackPage";
import { JamWithAI } from "../../app/components/JamWithAI";
import { LooperPage } from "../../app/components/LooperPage";
import { ProjectsSheet } from "../../app/components/ProjectsSheet";
import { TemplateSheet } from "../../app/components/TemplateSheet";
import {
  TutorialDialog,
  tutorialCourses,
  type TutorialCourse,
} from "../../app/components/TutorialDialog";

type SectionId = "studio" | "launch" | "community";
type FullscreenView = "agentic-producing" | null;
type HomeSubView =
  | "home"
  | "looper"
  | "instant-backing-track"
  | "quick-actions"
  | "top-songs"
  | "top-templates"
  | "tutorials";

type ActionId = "looper";

type BrowseItem = {
  title: string;
  author: string;
  imageUrl: string;
  avatarInitial: string;
};

type ShowcaseComment = {
  id: number;
  user: string;
  text: string;
};

type GuitarClip = BrowseItem & {
  id: string;
  email: string;
  comments: ShowcaseComment[];
};

type QuickAction = {
  id: string;
  title: string;
  meta: string;
  tag: string;
  imageUrl: string;
  onClick: () => void;
};

type SidebarAction = {
  label: string;
  meta?: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
};

type SidebarProject = {
  id: string;
  title: string;
  meta: string;
  status: string;
  onClick: () => void;
};

type HeroPromptSuggestion = {
  tag: string;
  title: string;
  prompt: string;
};

const heroPromptSuggestions: HeroPromptSuggestion[] = [
  {
    tag: "Jazz Fusion",
    title: "Late-night jazz fusion",
    prompt: "Make a late-night jazz fusion groove.",
  },
  {
    tag: "Neo Soul",
    title: "Loose neo-soul pocket",
    prompt: "Start a loose neo-soul jam.",
  },
  {
    tag: "Indie Pop",
    title: "Hopeful indie pop chorus",
    prompt: "Write a bright indie pop hook.",
  },
  {
    tag: "Trap",
    title: "Dark minimal trap beat",
    prompt: "Create a dark minimal trap beat.",
  },
  {
    tag: "Ambient",
    title: "Weightless ambient scene",
    prompt: "Make a weightless ambient sketch.",
  },
];

const topSongs: BrowseItem[] = [
  {
    title: "Midnight Echoes",
    author: "Albert Flores",
    avatarInitial: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "City After Rain",
    author: "Guy Hawkins",
    avatarInitial: "G",
    imageUrl:
      "https://images.unsplash.com/photo-1518132977555-6bce51766237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Golden Hour Drive",
    author: "Floyd Miles",
    avatarInitial: "F",
    imageUrl:
      "https://images.unsplash.com/photo-1768943913492-bb89bf0672af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Broken Neon",
    author: "Jenny Wilson",
    avatarInitial: "J",
    imageUrl:
      "https://images.unsplash.com/photo-1761638174184-122e41283194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Slow Motion Heart",
    author: "Devon Lane",
    avatarInitial: "D",
    imageUrl:
      "https://images.unsplash.com/photo-1700224174799-1ac666263d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Static in My Head",
    author: "Cody Fisher",
    avatarInitial: "C",
    imageUrl:
      "https://images.unsplash.com/photo-1761503556208-d8d9efd02d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Velvet Sunrise",
    author: "Ava Brooks",
    avatarInitial: "A",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Glass Heart Motel",
    author: "Noah Bennett",
    avatarInitial: "N",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Slow Burn Arcade",
    author: "Maya Lewis",
    avatarInitial: "M",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Ocean Room Session",
    author: "Luca Martin",
    avatarInitial: "L",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Neon Weather",
    author: "Sofia Turner",
    avatarInitial: "S",
    imageUrl:
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Lunar Exit",
    author: "Ethan Ross",
    avatarInitial: "E",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Afterglow Signals",
    author: "Chloe Hayes",
    avatarInitial: "C",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Broken Halo Drive",
    author: "Kai Morgan",
    avatarInitial: "K",
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const topTemplates: BrowseItem[] = [
  {
    title: "Neo-Soul Starter",
    author: "Marcus Bell",
    avatarInitial: "M",
    imageUrl:
      "https://images.unsplash.com/photo-1760507388320-2500b019f3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Lo-Fi Piano Pack",
    author: "Nadia Osei",
    avatarInitial: "N",
    imageUrl:
      "https://images.unsplash.com/photo-1741190745018-50ed4935c493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Trap Bounce Kit",
    author: "Ray Santos",
    avatarInitial: "R",
    imageUrl:
      "https://images.unsplash.com/photo-1659117675918-69ec794c64f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Ambient Texture Bed",
    author: "Sam Ekow",
    avatarInitial: "S",
    imageUrl:
      "https://images.unsplash.com/photo-1696245843884-3fbc53aad9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "R&B Vocal Space",
    author: "Tara Kim",
    avatarInitial: "T",
    imageUrl:
      "https://images.unsplash.com/photo-1761596897055-5c2ae7f56290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Cinematic Rise",
    author: "Zara Mensah",
    avatarInitial: "Z",
    imageUrl:
      "https://images.unsplash.com/photo-1656231267321-282e40e05d24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Indie Pop Writer Room",
    author: "Harper Lane",
    avatarInitial: "H",
    imageUrl:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Dream Guitar Bed",
    author: "Owen Cruz",
    avatarInitial: "O",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "House Drum Starter",
    author: "Mila Stone",
    avatarInitial: "M",
    imageUrl:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Blues Club Backing Kit",
    author: "Theo Price",
    avatarInitial: "T",
    imageUrl:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Ambient Piano Sketchpad",
    author: "Ella Chen",
    avatarInitial: "E",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "R&B Pocket Builder",
    author: "Jaden Holt",
    avatarInitial: "J",
    imageUrl:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Latin Jam Starter",
    author: "Nina Flores",
    avatarInitial: "N",
    imageUrl:
      "https://images.unsplash.com/photo-1548420329-2f116f28d2e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Dark Trap Scene",
    author: "Zion Park",
    avatarInitial: "Z",
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-d220c9f16fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const hipHopStarterTemplate: BrowseItem = {
  title: "Hip-Hop Starter Session",
  author: "LavaDAW",
  avatarInitial: "L",
  imageUrl:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
};

const guitarClips: GuitarClip[] = [
  {
    id: "g1",
    title: "Percussive Fingerstyle in Drop D",
    author: "Mason Reed",
    avatarInitial: "M",
    email: "mason.reed@fretmail.com",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Nora", text: "Great palm muting. The groove feels tight." },
      { id: 2, user: "Jules", text: "The ending harmonic run is clean." },
    ],
  },
  {
    id: "g2",
    title: "Neo-Soul Chords with Slides",
    author: "Yuna Park",
    avatarInitial: "Y",
    email: "yuna.park@stringspace.io",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Lina", text: "Beautiful voicings." },
      { id: 2, user: "Marco", text: "Would sound great with less reverb." },
    ],
  },
  {
    id: "g3",
    title: "Ambient Swells + Volume Knob",
    author: "Leo Santos",
    avatarInitial: "L",
    email: "leo.santos@ambientlane.net",
    imageUrl:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Ivy", text: "Perfect intro texture." },
      { id: 2, user: "Kenji", text: "Try panning the doubles wider." },
    ],
  },
  {
    id: "g4",
    title: "Blues Licks in A Minor",
    author: "Tara Nguyen",
    avatarInitial: "T",
    email: "tara.nguyen@bluepick.com",
    imageUrl:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Rex", text: "Classic phrasing." },
      { id: 2, user: "Paul", text: "The call-and-response is strong." },
    ],
  },
  {
    id: "g5",
    title: "Hybrid Picking Groove Study",
    author: "Ethan Cole",
    avatarInitial: "E",
    email: "ethan.cole@groovecraft.co",
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    comments: [
      { id: 1, user: "Dana", text: "Right hand control is super clean." },
      { id: 2, user: "Bryce", text: "Pocket is solid." },
    ],
  },
];

export function EntranceWorkspace() {
  const studioRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroPromptFieldRef = useRef<HTMLDivElement>(null);
  const heroPromptInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("studio");
  const [pendingScrollTarget, setPendingScrollTarget] = useState<SectionId | null>(null);
  const [fullscreenView, setFullscreenView] = useState<FullscreenView>(null);
  const [activeSubView, setActiveSubView] = useState<HomeSubView>("home");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [songOpen, setSongOpen] = useState(false);
  const [guitarOpen, setGuitarOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [looperInitialFilter, setLooperInitialFilter] = useState("Hot");
  const [backingTrackInitialFilter, setBackingTrackInitialFilter] = useState("Hot");
  const [selectedTemplate, setSelectedTemplate] = useState<BrowseItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<BrowseItem | null>(null);
  const [selectedGuitarClip, setSelectedGuitarClip] = useState<GuitarClip | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialCourse | null>(null);
  const [heroPromptValue, setHeroPromptValue] = useState("");
  const [heroPromptOpen, setHeroPromptOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeSubView !== "home" || !pendingScrollTarget) {
      return;
    }

    const refMap: Record<SectionId, RefObject<HTMLDivElement | null>> = {
      studio: studioRef,
      launch: launchRef,
      community: communityRef,
    };

    const timer = window.setTimeout(() => {
      refMap[pendingScrollTarget].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setPendingScrollTarget(null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeSubView, pendingScrollTarget]);

  useEffect(() => {
    if (!heroPromptOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && heroPromptFieldRef.current?.contains(target)) {
        return;
      }

      setHeroPromptOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setHeroPromptOpen(false);
      heroPromptInputRef.current?.blur();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [heroPromptOpen]);

  useEffect(() => {
    if (!heroPromptOpen) {
      return;
    }

    heroPromptInputRef.current?.focus();
  }, [heroPromptOpen]);

  const shellTone = useMemo(
    () => ({
      appBg: isDark ? "#171717" : "#f7f7f5",
      homeBg: isDark
        ? "radial-gradient(circle at 22% 0%, rgba(255,255,255,0.04), transparent 24%), linear-gradient(180deg, #171717 0%, #121212 34%, #171717 100%)"
        : "radial-gradient(circle at 18% 0%, rgba(255,255,255,0.62), transparent 24%), linear-gradient(180deg, #fbfbfa 0%, #f2f2ef 34%, #f7f7f5 100%)",
      railBg: isDark ? "#1b1b1b" : "#f8f8f6",
      railSurface: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
      railSurfaceStrong: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
      railBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(23,23,23,0.08)",
      mainHeaderBg: isDark ? "#1c1c1c" : "#fafaf8",
      heroScrim: isDark
        ? "linear-gradient(180deg, rgba(6,8,12,0.18) 0%, rgba(6,8,12,0.36) 48%, rgba(6,8,12,0.6) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.28) 48%, rgba(248,250,252,0.68) 100%)",
      heroBridge: isDark
        ? "linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.18) 36%, rgba(23,23,23,0.82) 100%)"
        : "linear-gradient(180deg, rgba(247,247,245,0) 0%, rgba(247,247,245,0.42) 36%, rgba(247,247,245,0.95) 100%)",
      heroFrameBg: isDark ? "rgba(12,12,12,0.96)" : "rgba(255,255,255,0.92)",
      heroHintBg: isDark ? "rgba(17,17,17,0.76)" : "rgba(255,255,255,0.8)",
      heroHintBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(23,23,23,0.08)",
      chipBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(23,23,23,0.04)",
      mutedText: isDark ? "rgba(255,255,255,0.58)" : "rgba(82,82,82,0.86)",
    }),
    [isDark],
  );

  const handleScrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);

    if (activeSubView !== "home") {
      setPendingScrollTarget(id);
      setActiveSubView("home");
      return;
    }

    const refMap: Record<SectionId, RefObject<HTMLDivElement | null>> = {
      studio: studioRef,
      launch: launchRef,
      community: communityRef,
    };

    refMap[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSubView]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
      const sections: Array<{ id: SectionId; ref: RefObject<HTMLDivElement | null> }> = [
        { id: "studio", ref: studioRef },
        { id: "launch", ref: launchRef },
        { id: "community", ref: communityRef },
      ];

      const activationLine = container.scrollTop + container.clientHeight * 0.32;
      let nextActive: SectionId = "studio";

      for (const section of sections) {
        if (section.ref.current && activationLine >= section.ref.current.offsetTop) {
          nextActive = section.id;
        }
      }

      if (nextActive !== activeSection) {
        setActiveSection(nextActive);
      }
    },
    [activeSection],
  );

  const openTemplate = useCallback((item: BrowseItem) => {
    setSelectedTemplate(item);
    setTemplateOpen(true);
  }, []);

  const openSong = useCallback((item: BrowseItem) => {
    setSelectedSong(item);
    setSongOpen(true);
  }, []);

  const openGuitar = useCallback((item: GuitarClip) => {
    setSelectedGuitarClip(item);
    setGuitarOpen(true);
  }, []);

  const openTutorial = useCallback((item: TutorialCourse) => {
    setSelectedTutorial(item);
    setTutorialOpen(true);
  }, []);

  const handleLaunch = useCallback((id: ActionId) => {
    switch (id) {
      case "looper":
        setActiveSubView("looper");
        return;
      default:
        return;
    }
  }, []);

  const createActions = useMemo<SidebarAction[]>(
    () => [
      {
        label: "Start a song",
        meta: "Build a full idea fast.",
        icon: Bot,
        accent: "rgba(99, 102, 241, 0.18)",
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        label: "Open Looper",
        meta: "Build a loop and lock the groove fast.",
        icon: Repeat,
        accent: "rgba(20, 184, 166, 0.18)",
        onClick: () => {
          setLooperInitialFilter("Hot");
          setActiveSubView("looper");
        },
      },
      {
        label: "Try a guitar riff",
        meta: "Open a playable guitar idea and start from it.",
        icon: Sparkles,
        accent: "rgba(244, 114, 182, 0.18)",
        onClick: () => openGuitar(guitarClips[0]),
      },
      {
        label: "Jam a vibe",
        meta: "Start loose and explore a feeling.",
        icon: Sparkles,
        accent: "rgba(250, 204, 21, 0.2)",
        onClick: () => handleScrollTo("launch"),
      },
    ],
    [handleScrollTo, openGuitar],
  );

  const sidebarProjects = useMemo<SidebarProject[]>(
    () => [
      {
        id: "daw-1",
        title: "Late Night Arrangement",
        meta: "Edited 2h ago",
        status: "Song draft",
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        id: "loop-1",
        title: "Neo Soul Pocket Loop",
        meta: "Edited yesterday",
        status: "Looper",
        onClick: () => {
          setLooperInitialFilter("Hot");
          setActiveSubView("looper");
        },
      },
      {
        id: "guitar-1",
        title: "Dream Guitar Bed",
        meta: "Edited yesterday",
        status: "Guitar idea",
        onClick: () => openGuitar(guitarClips[0]),
      },
      {
        id: "template-1",
        title: "House Drum Starter",
        meta: "Edited 3d ago",
        status: "Template",
        onClick: () => openTemplate(topTemplates[8]),
      },
      {
        id: "backing-1",
        title: "Blues Club Backing Kit",
        meta: "Edited 4d ago",
        status: "Backing track",
        onClick: () => {
          setBackingTrackInitialFilter("Blues");
          setActiveSubView("instant-backing-track");
        },
      },
      {
        id: "template-2",
        title: "Indie Pop Writer Room",
        meta: "Edited 5d ago",
        status: "Template",
        onClick: () => openTemplate(topTemplates[6]),
      },
      {
        id: "guitar-2",
        title: "Ambient Swells Notes",
        meta: "Edited last week",
        status: "Guitar idea",
        onClick: () => openGuitar(guitarClips[2]),
      },
    ],
    [openGuitar, openTemplate],
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: "make-song",
        title: "Make a Song",
        meta: "Open the full workspace and start arranging immediately.",
        tag: "Song",
        imageUrl: topSongs[0].imageUrl,
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        id: "jam-now",
        title: "Jam Right Now",
        meta: "Jump to the AI jam prompt and start with a vibe.",
        tag: "Jam",
        imageUrl: topSongs[1].imageUrl,
        onClick: () => handleScrollTo("launch"),
      },
      {
        id: "rock-loop",
        title: "Start a Rock Loop",
        meta: "Open Looper with a rock-ready filter and browse fast riffs.",
        tag: "Rock",
        imageUrl: guitarClips[3].imageUrl,
        onClick: () => {
          setLooperInitialFilter("Rock");
          setActiveSubView("looper");
        },
      },
      {
        id: "blues-jam",
        title: "Start a Blues Jam",
        meta: "Open backing tracks already pointed at blues-friendly grooves.",
        tag: "Blues",
        imageUrl: guitarClips[4].imageUrl,
        onClick: () => {
          setBackingTrackInitialFilter("Blues");
          setActiveSubView("instant-backing-track");
        },
      },
      {
        id: "hiphop-song",
        title: "Make a Hip-Hop Idea",
        meta: "Launch a trap and hip-hop leaning starter session.",
        tag: "Hip-Hop",
        imageUrl: hipHopStarterTemplate.imageUrl,
        onClick: () => openTemplate(hipHopStarterTemplate),
      },
      {
        id: "guitar-solo",
        title: "Solo a Guitar Take",
        meta: "Open a featured guitar clip and jump into a lead-focused flow.",
        tag: "Guitar",
        imageUrl: guitarClips[0].imageUrl,
        onClick: () => openGuitar(guitarClips[0]),
      },
    ],
    [handleScrollTo, openGuitar, openTemplate],
  );

  const filteredHeroPromptSuggestions = useMemo(() => {
    const query = heroPromptValue.trim().toLowerCase();

    if (!query) {
      return heroPromptSuggestions;
    }

    return heroPromptSuggestions.filter((suggestion) =>
      [suggestion.tag, suggestion.title, suggestion.prompt].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [heroPromptValue]);

  const visibleHeroPromptSuggestions = useMemo(
    () => filteredHeroPromptSuggestions.slice(0, 3),
    [filteredHeroPromptSuggestions],
  );

  const handleHeroPromptSuggestionSelect = useCallback((prompt: string) => {
    setHeroPromptValue(prompt);
    setHeroPromptOpen(false);

    window.requestAnimationFrame(() => {
      heroPromptInputRef.current?.focus();
    });
  }, []);

  const tutorialBrowseItems = useMemo<BrowseItem[]>(
    () =>
      tutorialCourses.map((course) => ({
        title: course.title,
        author: `${course.lessons.length} parts · ${course.duration}`,
        avatarInitial: course.mentor.slice(0, 1),
        imageUrl: course.imageUrl,
      })),
    [],
  );

  const contentTitle =
    activeSubView === "home"
      ? "Create"
      : activeSubView === "looper"
        ? "Looper"
        : activeSubView === "instant-backing-track"
          ? "Backing Track"
          : activeSubView === "quick-actions"
            ? "Quick Actions"
          : activeSubView === "top-songs"
            ? "Top Songs"
            : activeSubView === "top-templates"
            ? "Top Templates"
              : "Tutorials";
  const homePreviewCanvasWidth = 1280;
  const homePreviewZoom = 1.14;
  const homePreviewFocusX = 0.42;
  const sidebarWidth = 399;
  const sidebarInlinePadding = 24;
  const mainContentInlinePadding = 32;

  if (fullscreenView === "agentic-producing") {
    return <AgenticProducingPage onBack={() => setFullscreenView(null)} />;
  }

  return (
    <div
      className="relative flex h-full w-full overflow-hidden"
      style={{
        fontFamily: "var(--app-font-family)",
        background: shellTone.appBg,
      }}
    >
        <aside
          className="relative flex h-full shrink-0 flex-col"
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            flexBasis: sidebarWidth,
            padding: `22px ${sidebarInlinePadding}px 14px`,
            background: isDark
              ? "radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 28%), linear-gradient(180deg, #1a1a1a 0%, #131313 100%)"
              : "radial-gradient(circle at top left, rgba(255,255,255,0.7), transparent 30%), linear-gradient(180deg, #fbfbfa 0%, #f1f1ee 100%)",
            borderRight: `1px solid ${shellTone.railBorder}`,
            boxShadow: isDark ? "24px 0 80px rgba(0,0,0,0.24)" : "24px 0 64px rgba(0,0,0,0.05)",
            zIndex: 2,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <div>
            <h1 style={railHeadingStyle}>LavaDAW</h1>
          </div>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="tablet-icon-target tablet-pressable"
            style={iconButtonStyle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ paddingRight: 2, paddingBottom: 8 }}
        >
          <div className="flex flex-col" style={{ minHeight: "100%" }}>
            <section style={sidebarHeroSectionStyle}>
              <h2 style={sidebarHeroTitleStyle}>Start from what you want to make.</h2>
              <p style={sidebarHeroCopyStyle}>
                No DAW thinking first. Pick the idea in your head and jump straight into that flow.
              </p>
            </section>

            <section style={sidebarSectionStyle}>
              <div className="mb-3">
                <p style={sidebarSectionLabelStyle}>Start</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {createActions.map((action) => (
                  <SidebarStartAction
                    key={action.label}
                    label={action.label}
                    meta={action.meta}
                    icon={action.icon}
                    accent={action.accent}
                    onClick={action.onClick}
                  />
                ))}
              </div>
            </section>

            <section style={{ ...sidebarSectionStyle, display: "flex", minHeight: 0, flex: 1, flexDirection: "column" }}>
              <div className="mb-3 flex items-center justify-between">
                <p style={sidebarSectionLabelStyle}>My Projects</p>
                <button
                  type="button"
                  onClick={() => setProjectsOpen(true)}
                  className="tablet-touch-target tablet-pressable"
                  style={inlineLinkButtonStyle}
                >
                  View all
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto" style={sidebarProjectListStyle}>
                {sidebarProjects.map((project) => (
                  <SidebarProjectListItem key={project.id} project={project} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex items-center justify-between"
            style={{
              height: 72,
              minHeight: 72,
              padding: `0 ${mainContentInlinePadding}px`,
              backgroundColor: shellTone.mainHeaderBg,
              borderBottom: `1px solid ${shellTone.railBorder}`,
              backdropFilter: "blur(22px)",
            }}
        >
          <div>
            <h2 style={topTitleStyle}>{contentTitle}</h2>
          </div>

          {activeSubView !== "home" ? (
            <button
              type="button"
              onClick={() => setActiveSubView("home")}
              className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
              style={secondaryButtonStyle}
            >
              <ArrowLeft size={15} strokeWidth={1.9} />
              Back
            </button>
          ) : (
            <div />
          )}
        </div>

        {activeSubView === "home" ? (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: "smooth", background: shellTone.homeBg }}
          >
            <section
              ref={studioRef}
                style={{
                  ...sectionStyle,
                  position: "relative",
                  zIndex: 3,
                  minHeight: "clamp(520px, calc(100vh - 248px), 620px)",
                  marginLeft: -mainContentInlinePadding,
                  marginRight: -mainContentInlinePadding,
                }}
              >
              <div
                role="button"
                tabIndex={0}
                data-touch-target="true"
                onClick={() => setFullscreenView("agentic-producing")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setFullscreenView("agentic-producing");
                  }
                }}
                aria-label="Open full workspace"
                className="tablet-pressable relative block w-full overflow-visible text-left"
                style={{
                  height: "clamp(520px, calc(100vh - 248px), 620px)",
                  backgroundColor: shellTone.heroFrameBg,
                  borderTop: `1px solid ${shellTone.railBorder}`,
                  borderBottom: `1px solid ${shellTone.railBorder}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <ScaledPreviewCanvas
                    designWidth={homePreviewCanvasWidth}
                    zoom={homePreviewZoom}
                    focusX={homePreviewFocusX}
                  >
                    <AgenticProducingPage previewMode />
                  </ScaledPreviewCanvas>
                </div>
                <div
                  className="absolute inset-0"
                  style={{ background: shellTone.heroScrim }}
                />
                <div
                  aria-hidden="true"
                  className="absolute rounded-[22px]"
                  style={{
                    top: 28,
                    right: 28,
                    padding: "10px 14px 11px",
                    background: shellTone.heroHintBg,
                    border: `1px solid ${shellTone.heroHintBorder}`,
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 18px 38px rgba(15,23,42,0.14)",
                  }}
                >
                  <span style={heroPreviewHintEyebrowStyle}>Full DAW</span>
                  <span style={heroPreviewHintLabelStyle}>Tap anywhere to start.</span>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: 180,
                    background: shellTone.heroBridge,
                    pointerEvents: "none",
                  }}
                />
                <div
                  className="absolute flex items-center gap-5"
                  style={{
                    ...heroBottomDockStyle,
                    left: "50%",
                    bottom: 0,
                    width: "62%",
                    maxWidth: 860,
                    transform: "translate(-50%, 50%)",
                    zIndex: 4,
                  }}
                >
                  <div
                    ref={heroPromptFieldRef}
                    className="relative flex w-full"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex w-full items-center rounded-full" style={heroChatFieldStyle}>
                      <input
                        ref={heroPromptInputRef}
                        type="text"
                        value={heroPromptValue}
                        onClick={(event) => {
                          event.stopPropagation();
                          setHeroPromptOpen(true);
                        }}
                        onFocus={() => setHeroPromptOpen(true)}
                        onChange={(event) => {
                          setHeroPromptValue(event.target.value);
                          if (!heroPromptOpen) {
                            setHeroPromptOpen(true);
                          }
                        }}
                        placeholder="Start with your AI Music Producer."
                        className="tablet-touch-target min-w-0 flex-1 bg-transparent text-left outline-none placeholder:text-[var(--secondary)]"
                        style={heroChatInputStyle}
                      />
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
                        style={heroChatSendStyle}
                      >
                        Start
                      </button>
                    </div>
                    <AnimatePresence>
                      {heroPromptOpen ? (
                        <motion.div
                          className="absolute"
                          style={heroPromptPanelStyle}
                          onClick={(event) => event.stopPropagation()}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                          <div style={heroPromptListStyle}>
                            <div
                              className="relative flex max-h-[320px] flex-col overflow-y-auto"
                              style={heroPromptListContentStyle}
                            >
                              {visibleHeroPromptSuggestions.length ? (
                                <>
                                  {filteredHeroPromptSuggestions.length > 3 ? (
                                    <div aria-hidden="true" style={heroPromptOverflowHintStyle}>
                                      Show more
                                    </div>
                                  ) : null}
                                  {visibleHeroPromptSuggestions.map((suggestion, index) => (
                                  <motion.button
                                    key={suggestion.prompt}
                                    type="button"
                                    className="w-full text-left"
                                    style={heroPromptSuggestionStyle}
                                    onClick={() => handleHeroPromptSuggestionSelect(suggestion.prompt)}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{
                                      duration: 0.18,
                                      delay: index * 0.025,
                                      ease: "easeOut",
                                    }}
                                  >
                                    <div style={heroPromptSuggestionContentStyle}>
                                      <span aria-hidden="true" style={heroPromptSuggestionBulletStyle}>
                                        •
                                      </span>
                                      <p style={heroPromptSuggestionPromptStyle}>{suggestion.prompt}</p>
                                    </div>
                                  </motion.button>
                                  ))}
                                </>
                              ) : (
                                <div style={heroPromptEmptyStyle}>
                                  <p style={heroPromptEmptyTextStyle}>
                                    No matching starter prompt yet. Try words like jazz, trap, ambient,
                                    or neo-soul.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: -24,
                  padding: `92px ${mainContentInlinePadding}px 42px`,
                  background: isDark
                    ? "linear-gradient(180deg, rgba(17,19,21,0) 0%, rgba(17,19,21,0.82) 64px, rgba(17,19,21,0.96) 100%)"
                    : "linear-gradient(180deg, rgba(243,244,246,0) 0%, rgba(243,244,246,0.92) 64px, rgba(243,244,246,0.96) 100%)",
                }}
              >
              <section ref={launchRef} style={sectionStyle}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 style={sectionTitleStyle}>Choose how to start.</h3>
                    <p style={sectionDescriptionStyle}>Pick one path. You can switch later.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid items-stretch gap-5 lg:grid-cols-2">
                    <div className="flex min-h-full flex-col">
                      <LoopLaunchPanel onLaunch={handleLaunch} />
                    </div>

                    <div className="flex min-h-full flex-col">
                      <JamWithAI />
                    </div>
                  </div>

                  <div style={templateStripStyle}>
                    <QuickAccessCarousel
                      actions={quickActions}
                      onSeeAll={() => setActiveSubView("quick-actions")}
                    />
                  </div>
                </div>
              </section>

              <section ref={communityRef} style={{ ...sectionStyle, paddingBottom: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p style={eyebrowStyle}>Browse</p>
                    <h3 style={sectionTitleStyle}>Songs, templates, and tutorials in one scroll.</h3>
                  </div>
                </div>

                <div className="grid grid-cols-[0.92fr_0.92fr_1.16fr] gap-5">
                  <TopListColumn
                    title="Top Songs"
                    items={topSongs}
                    onItemClick={openSong}
                    onOpenDetail={() => setActiveSubView("top-songs")}
                  />
                  <TopListColumn
                    title="Top Templates"
                    items={topTemplates}
                    onItemClick={openTemplate}
                    onOpenDetail={() => setActiveSubView("top-templates")}
                  />
                  <div className="rounded-[30px]" style={panelStyle}>
                    <div className="mb-3 flex items-center justify-between">
                      <p style={miniSectionTitleStyle}>Tutorial</p>
                      <button
                        type="button"
                        onClick={() => setActiveSubView("tutorials")}
                        className="tablet-touch-target tablet-pressable"
                        style={inlineLinkButtonStyle}
                      >
                        See all
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {tutorialCourses.slice(0, 4).map((course) => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => openTutorial(course)}
                          className="tablet-pressable relative overflow-hidden rounded-[22px] text-left"
                          style={{
                            minHeight: 168,
                            border: `1px solid ${shellTone.railBorder}`,
                            backgroundColor: "var(--card)",
                          }}
                        >
                          <ImageWithFallback
                            src={course.imageUrl}
                            alt={course.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.36)",
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0" style={{ padding: 14 }}>
                            <p style={imageCardTitleStyle}>{course.title}</p>
                            <p style={imageCardMetaStyle}>{course.lessons.length} parts · {course.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto" style={{ padding: "24px 30px 40px" }}>
            {activeSubView === "looper" ? (
              <LooperPage
                onBack={() => setActiveSubView("home")}
                initialFilter={looperInitialFilter}
              />
            ) : activeSubView === "instant-backing-track" ? (
              <InstantBackingTrackPage
                onBack={() => setActiveSubView("home")}
                initialFilter={backingTrackInitialFilter}
              />
            ) : activeSubView === "quick-actions" ? (
              <QuickActionsPage
                actions={quickActions}
                onBack={() => setActiveSubView("home")}
              />
            ) : activeSubView === "top-songs" ? (
              <TopBrowsePage
                title="Top Songs"
                items={topSongs}
                onBack={() => setActiveSubView("home")}
                onItemClick={openSong}
              />
            ) : activeSubView === "top-templates" ? (
              <TopBrowsePage
                title="Top Templates"
                items={topTemplates}
                onBack={() => setActiveSubView("home")}
                onItemClick={openTemplate}
              />
            ) : (
              <TopBrowsePage
                title="Tutorials"
                items={tutorialBrowseItems}
                onBack={() => setActiveSubView("home")}
                onItemClick={(item) => {
                  const tutorial = tutorialCourses.find(
                    (source) => source.title === item.title,
                  );
                  if (tutorial) {
                    openTutorial(tutorial);
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      <ProjectsSheet open={projectsOpen} onOpenChange={setProjectsOpen} />
      <TemplateSheet
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        template={selectedTemplate}
        mode="template"
      />
      <TemplateSheet
        open={songOpen}
        onClose={() => setSongOpen(false)}
        template={selectedSong}
        mode="song"
      />
      <TemplateSheet
        open={guitarOpen}
        onClose={() => setGuitarOpen(false)}
        template={selectedGuitarClip}
        mode="guitar"
      />
      <TutorialDialog
        open={tutorialOpen}
        onOpenChange={setTutorialOpen}
        tutorial={selectedTutorial}
      />
    </div>
  );
}

function useDragScroll(axis: "x" | "y") {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
    moved: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: container.scrollLeft,
      startScrollTop: container.scrollTop,
      moved: false,
    };
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const movedEnough = Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;

    if (movedEnough && !dragState.moved) {
      dragState.moved = true;
      setIsDragging(true);
    }

    if (!dragState.moved) {
      return;
    }

    if (axis === "x") {
      container.scrollLeft = dragState.startScrollLeft - deltaX;
    } else {
      container.scrollTop = dragState.startScrollTop - deltaY;
    }
  }, [axis]);

  const endDrag = useCallback((pointerId: number) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== pointerId) {
      return;
    }

    dragStateRef.current = null;
    window.setTimeout(() => setIsDragging(false), 0);
  }, []);

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  }, [endDrag]);

  const handlePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  }, [endDrag]);

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.moved || isDragging) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [isDragging]);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (axis !== "x") {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      container.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }, [axis]);

  return {
    containerRef,
    isDragging,
    dragBind: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onClickCapture: handleClickCapture,
      onWheel: handleWheel,
    },
  };
}

function ScaledPreviewCanvas({
  children,
  designWidth,
  zoom = 1,
  focusX = 0.5,
}: {
  children: ReactNode;
  designWidth: number;
  zoom?: number;
  focusX?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateScale = () => {
      const { width } = element.getBoundingClientRect();
      if (!width) {
        return;
      }
      setScale((width / designWidth) * zoom);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => observer.disconnect();
  }, [designWidth, zoom]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${focusX * 100}%`,
          width: designWidth,
          height: "100%",
          transform: `translateX(-${focusX * 100}%) scale(${scale})`,
          transformOrigin: "top center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LoopLaunchPanel({
  onLaunch,
}: {
  onLaunch: (id: ActionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onLaunch("looper")}
      className="tablet-touch-target tablet-pressable tablet-hover-soft relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border p-6 text-left"
      style={loopLaunchPanelStyle}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 style={loopLaunchTitleStyle}>Looper</h3>
        </div>
      </div>

      <p style={loopLaunchDescriptionStyle}>Play fast.</p>

      <div className="flex flex-1 items-center justify-center py-6">
        <div style={loopGraphicWrapStyle}>
            <div style={loopOuterDiscStyle} />
            <div style={loopOuterGuideStyle} />
            <div style={loopMidDiscStyle} />
            <div style={loopInnerRingStyle} />
            <div style={loopStemStyle} />
            <div style={loopMarkerStyle} />
            <div style={loopHubStyle} />
        </div>
      </div>

    </button>
  );
}

function SidebarStartAction({
  label,
  meta,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string;
  meta?: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tablet-touch-target tablet-pressable flex items-center justify-between text-left"
      style={sidebarStartActionStyle}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center"
          style={{ ...sidebarActionIconStyle, backgroundColor: accent }}
        >
          <Icon size={15} strokeWidth={1.9} />
        </span>
        <span className="min-w-0">
          <span style={sidebarStartLabelStyle}>{label}</span>
          {meta ? <span style={sidebarStartMetaStyle}>{meta}</span> : null}
        </span>
      </span>
    </button>
  );
}

function SidebarProjectListItem({ project }: { project: SidebarProject }) {
  return (
    <button
      type="button"
      onClick={project.onClick}
      className="tablet-touch-target tablet-pressable flex w-full items-start text-left"
      style={sidebarProjectItemStyle}
    >
      <span className="min-w-0">
        <span style={sidebarProjectTitleStyle}>{project.title}</span>
        <span style={sidebarProjectMetaStyle}>
          {project.status} · {project.meta}
        </span>
      </span>
    </button>
  );
}

function CompactImageCard({
  item,
  onClick,
}: {
  item: BrowseItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tablet-pressable relative overflow-hidden rounded-[22px] text-left"
      style={{
        minHeight: 150,
        border: "1px solid var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      <ImageWithFallback
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.32)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0" style={{ padding: 14 }}>
        <p style={imageCardTitleStyle}>{item.title}</p>
        <p style={imageCardMetaStyle}>{item.author}</p>
      </div>
    </button>
  );
}

function QuickActionCard({
  action,
  onClick,
}: {
  action: QuickAction;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tablet-touch-target tablet-pressable tablet-hover-lift flex h-full items-center gap-3 rounded-[22px] text-left"
      style={quickActionCardStyle}
    >
      <div
        className="relative overflow-hidden rounded-[14px]"
        style={{ width: 68, height: 68, flexShrink: 0 }}
      >
        <ImageWithFallback
          src={action.imageUrl}
          alt={action.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p style={quickActionTagStyle}>{action.tag}</p>
        <p className="truncate" style={listTitleStyle}>
          {action.title}
        </p>
        <p style={quickActionMetaStyle}>
          {action.meta}
        </p>
      </div>
      <ChevronRight size={16} strokeWidth={1.8} style={{ color: "var(--secondary)", flexShrink: 0 }} />
    </button>
  );
}

function QuickAccessCarousel({
  actions,
  onSeeAll,
}: {
  actions: QuickAction[];
  onSeeAll: () => void;
}) {
  const { containerRef, isDragging, dragBind } = useDragScroll("x");

  return (
    <div style={templateStripStyle}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p style={miniSectionTitleStyle}>Quick Actions</p>
          <p style={templateStripHintStyle}>
            Swipe horizontally to jump into a concrete session, loop, jam, or guitar flow.
          </p>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="tablet-touch-target tablet-pressable"
          style={inlineLinkButtonStyle}
        >
          See all
        </button>
      </div>

      <div
        ref={containerRef}
        {...dragBind}
        className="overflow-x-auto pb-2"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          scrollbarWidth: "none",
          touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div className="flex gap-3 pr-6" style={{ width: "max-content" }}>
          {actions.map((action) => (
            <div
              key={action.id}
              style={{
                width: 372,
                minWidth: 372,
                maxWidth: 372,
              }}
            >
              <QuickActionCard action={action} onClick={action.onClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickActionsPage({
  actions,
  onBack,
}: {
  actions: QuickAction[];
  onBack: () => void;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
          style={secondaryButtonStyle}
        >
          <ArrowLeft size={15} strokeWidth={1.9} />
          Back
        </button>
        <h3 style={sectionTitleStyle}>Quick Actions</h3>
        <div style={{ width: 72 }} />
      </div>

      <div className="mb-6">
        <p style={sectionDescriptionStyle}>
          Pick a concrete starting point and jump directly into the right flow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} onClick={action.onClick} />
        ))}
      </div>
    </section>
  );
}

function TopListColumn({
  title,
  items,
  onItemClick,
  onOpenDetail,
}: {
  title: string;
  items: BrowseItem[];
  onItemClick: (item: BrowseItem) => void;
  onOpenDetail: () => void;
}) {
  const { containerRef, isDragging, dragBind } = useDragScroll("y");

  return (
    <div className="rounded-[30px]" style={{ ...panelStyle, display: "flex", flexDirection: "column" }}>
      <div className="mb-3 flex items-center justify-between">
        <p style={miniSectionTitleStyle}>{title}</p>
        <button type="button" onClick={onOpenDetail} className="tablet-touch-target tablet-pressable" style={inlineLinkButtonStyle}>
          See all
        </button>
      </div>

      <div
        ref={containerRef}
        {...dragBind}
        className="flex flex-col gap-2 overflow-y-auto pr-1"
        style={{
          maxHeight: 432,
          minHeight: 432,
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onItemClick(item)}
            className="tablet-touch-target tablet-pressable flex items-center gap-3 rounded-[20px] text-left"
            style={{
              padding: "10px 10px 10px 12px",
              border: "none",
              backgroundColor: "var(--card)",
            }}
          >
            <div
              className="relative overflow-hidden rounded-[14px]"
              style={{ width: 52, height: 52, flexShrink: 0 }}
            >
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate" style={listTitleStyle}>
                {item.title}
              </p>
              <p className="truncate" style={listMetaStyle}>
                {item.author}
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={1.8} style={{ color: "var(--secondary)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function TopBrowsePage({
  title,
  items,
  onBack,
  onItemClick,
}: {
  title: string;
  items: BrowseItem[];
  onBack: () => void;
  onItemClick: (item: BrowseItem) => void;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
          style={secondaryButtonStyle}
        >
          <ArrowLeft size={15} strokeWidth={1.9} />
          Back
        </button>
        <h3 style={sectionTitleStyle}>{title}</h3>
        <div style={{ width: 72 }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={`${item.title}-${item.author}`}
            type="button"
            onClick={() => onItemClick(item)}
            className="tablet-pressable relative overflow-hidden rounded-[28px] text-left"
            style={{
              minHeight: 220,
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(0,0,0,0.38)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0" style={{ padding: 18 }}>
              <p style={imageCardTitleStyle}>{item.title}</p>
              <p style={imageCardMetaStyle}>{item.author}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const railHeadingStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  fontWeight: 700,
};

const iconButtonStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "none",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const sidebarHeroSectionStyle: CSSProperties = {
  padding: "8px 0 34px",
};

const sidebarHeroTitleStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "var(--foreground)",
  fontSize: 34,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.05em",
  maxWidth: 280,
};

const sidebarHeroCopyStyle: CSSProperties = {
  margin: "14px 0 0",
  maxWidth: 300,
  color: "var(--secondary)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.5,
};

const sidebarSectionStyle: CSSProperties = {
  paddingTop: 22,
  borderTop: "1px solid color-mix(in srgb, var(--border) 76%, transparent)",
};

const sidebarSectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const sidebarStartActionStyle: CSSProperties = {
  width: "100%",
  minHeight: 64,
  padding: "0 14px",
  borderRadius: 20,
  border: "1px solid color-mix(in srgb, var(--border) 74%, transparent)",
  backgroundColor: "color-mix(in srgb, var(--card) 58%, transparent)",
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "none",
};

const sidebarStartLabelStyle: CSSProperties = {
  display: "block",
  color: "inherit",
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.2,
};

const sidebarStartMetaStyle: CSSProperties = {
  display: "block",
  marginTop: 3,
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.35,
};

const sidebarActionIconStyle: CSSProperties = {
  color: "var(--foreground)",
  borderRadius: 14,
  border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
  boxShadow: "none",
};

const sidebarProjectListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  paddingRight: 2,
};

const sidebarProjectItemStyle: CSSProperties = {
  width: "100%",
  minHeight: 58,
  padding: "10px 12px",
  borderRadius: 16,
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const sidebarProjectTitleStyle: CSSProperties = {
  display: "block",
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 650,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sidebarProjectMetaStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.35,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const topTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const primaryButtonStyle: CSSProperties = {
  height: 46,
  padding: "0 18px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  height: 46,
  padding: "0 18px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const sectionStyle: CSSProperties = {
  paddingBottom: 28,
};

const sectionTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--foreground)",
  fontSize: 38,
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const sectionDescriptionStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "var(--secondary)",
  fontSize: 15,
  fontWeight: 500,
};

const heroBottomDockStyle: CSSProperties = {
  padding: "0 0 0 0",
  minHeight: 88,
};

const heroPreviewHintEyebrowStyle: CSSProperties = {
  display: "block",
  color: "var(--secondary)",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  lineHeight: 1.2,
};

const heroPreviewHintLabelStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.2,
};

const heroChatFieldStyle: CSSProperties = {
  minHeight: 80,
  padding: "0 12px 0 20px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
};

const heroChatInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: "none",
  padding: 0,
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 18,
  fontWeight: 500,
};

const heroChatSendStyle: CSSProperties = {
  height: 56,
  padding: "0 24px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const heroPromptPanelStyle: CSSProperties = {
  left: 0,
  right: 0,
  bottom: "calc(100% + 14px)",
  zIndex: 8,
  padding: "0 2px 12px",
};

const heroPromptListStyle: CSSProperties = {
  position: "relative",
};

const heroPromptListContentStyle: CSSProperties = {
  gap: 6,
};

const heroPromptOverflowHintStyle: CSSProperties = {
  padding: "0 0 4px 17px",
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  lineHeight: 1.2,
  textTransform: "uppercase",
  opacity: 0.74,
};

const heroPromptSuggestionStyle: CSSProperties = {
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const heroPromptSuggestionContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "6px 0",
};

const heroPromptSuggestionBulletStyle: CSSProperties = {
  display: "inline-flex",
  minWidth: 10,
  color: "var(--secondary)",
  fontSize: 17,
  fontWeight: 600,
  lineHeight: 1.2,
  transform: "translateY(1px)",
};

const heroPromptSuggestionPromptStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.45,
  textShadow: "0 1px 10px rgba(15,23,42,0.12)",
};

const heroPromptEmptyStyle: CSSProperties = {
  padding: "6px 0",
};

const heroPromptEmptyTextStyle: CSSProperties = {
  margin: 0,
  padding: "6px 0",
  color: "var(--secondary)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.5,
};

const panelStyle: CSSProperties = {
  padding: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  boxShadow: "var(--elevation-sm)",
};

const templateStripStyle: CSSProperties = {
  padding: "2px 0 0",
};

const templateStripHintStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

const miniSectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 17,
  fontWeight: 700,
};

const inlineLinkButtonStyle: CSSProperties = {
  border: "none",
  minHeight: 44,
  padding: "0 6px",
  background: "transparent",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const launchCardFeaturedStyle: CSSProperties = {
  minHeight: 94,
  padding: 16,
  border: "1px solid var(--border)",
  background: "linear-gradient(180deg, var(--card) 0%, var(--soft-surface) 100%)",
  boxShadow: "0 12px 26px rgba(15,23,42,0.06)",
  cursor: "pointer",
  borderRadius: 20,
};

const launchCardCompactStyle: CSSProperties = {
  minHeight: 78,
  padding: 12,
  border: "1px solid var(--border)",
  backgroundColor: "transparent",
  boxShadow: "none",
  cursor: "pointer",
  borderRadius: 18,
};

const launchFeaturedLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.2,
};

const launchFeaturedMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--secondary)",
  fontSize: 14,
  fontWeight: 500,
};

const launchCompactLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.2,
};

const launchCompactMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

const loopLaunchPanelStyle: CSSProperties = {
  backgroundColor: "var(--card)",
};

const loopLaunchTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: "var(--text-xl)",
  fontWeight: 700,
  fontFamily: "var(--app-font-family)",
};

const loopLaunchDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-normal)",
  fontFamily: "var(--app-font-family)",
};

const loopGraphicWrapStyle: CSSProperties = {
  position: "relative",
  width: "min(100%, 260px)",
  aspectRatio: "1 / 1",
};

const loopOuterDiscStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--foreground) 12%, var(--card) 88%) 0%, color-mix(in srgb, var(--foreground) 8%, var(--card) 92%) 49.5%, color-mix(in srgb, var(--foreground) 3%, var(--card) 97%) 50.5%, color-mix(in srgb, var(--foreground) 5%, var(--card) 95%) 100%)",
};

const loopOuterGuideStyle: CSSProperties = {
  position: "absolute",
  inset: 28,
  borderRadius: "50%",
  border: "3px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
};

const loopMidDiscStyle: CSSProperties = {
  position: "absolute",
  inset: 72,
  borderRadius: "50%",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--foreground) 26%, var(--card) 74%) 0%, color-mix(in srgb, var(--foreground) 20%, var(--card) 80%) 49.6%, color-mix(in srgb, var(--foreground) 6%, var(--card) 94%) 50.4%, color-mix(in srgb, var(--foreground) 10%, var(--card) 90%) 100%)",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--foreground) 10%, transparent)",
};

const loopInnerRingStyle: CSSProperties = {
  position: "absolute",
  inset: 110,
  borderRadius: "50%",
  border: "3px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
};

const loopStemStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: 42,
  width: 3,
  height: 100,
  marginLeft: -1.5,
  borderRadius: 999,
  backgroundColor: "color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
};

const loopMarkerStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: 80,
  width: 10,
  height: 36,
  marginLeft: -5,
  borderRadius: 999,
  borderTop: "5px solid color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
  borderBottom: "5px solid color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
  backgroundColor: "transparent",
};

const loopHubStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 34,
  height: 34,
  marginLeft: -17,
  marginTop: -17,
  borderRadius: "50%",
  backgroundColor: "color-mix(in srgb, var(--foreground) 18%, var(--card) 82%)",
  boxShadow: "0 0 0 6px color-mix(in srgb, var(--foreground) 3%, transparent)",
};


const quickActionCardStyle: CSSProperties = {
  minHeight: 104,
  padding: 14,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
};

const quickActionTagStyle: CSSProperties = {
  margin: "0 0 6px",
  color: "var(--secondary)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const listTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
};

const listMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

const quickActionMetaStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const imageCardTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--on-image-primary)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.3,
};

const imageCardMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--on-image-secondary)",
  fontSize: 13,
  fontWeight: 500,
};
