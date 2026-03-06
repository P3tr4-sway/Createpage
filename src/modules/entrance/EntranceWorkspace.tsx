import {
  ArrowLeft,
  Bookmark,
  Bot,
  ChevronRight,
  CirclePlay,
  Disc3,
  FolderKanban,
  FolderOpen,
  ListFilter,
  Moon,
  Music,
  Repeat,
  Sparkles,
  Sun,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  type UIEvent,
} from "react";
import { AgenticProducingPage } from "../../app/components/AgenticProducingPage";
import { ImageWithFallback } from "../../app/components/figma/ImageWithFallback";
import { InstantBackingTrackPage } from "../../app/components/InstantBackingTrackPage";
import { JamWithAI } from "../../app/components/JamWithAI";
import { LooperPage } from "../../app/components/LooperPage";
import { ProjectsSheet, recentProjects } from "../../app/components/ProjectsSheet";
import { TemplateSheet } from "../../app/components/TemplateSheet";

type SectionId = "studio" | "launch" | "community";
type FullscreenView = "agentic-producing" | null;
type HomeSubView =
  | "home"
  | "looper"
  | "instant-backing-track"
  | "top-songs"
  | "top-templates"
  | "guitar-showcase";

type ActionId =
  | "agentic"
  | "stems"
  | "remix"
  | "looper"
  | "backing"
  | "jam";

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

const railSections: Array<{ id: SectionId; label: string; icon: LucideIcon }> = [
  { id: "studio", label: "DAW", icon: Bot },
  { id: "launch", label: "Launch", icon: Sparkles },
  { id: "community", label: "Community", icon: Users },
];

const launchGroups: Array<{
  title: string;
  items: Array<{ id: ActionId; label: string; meta: string; icon: LucideIcon }>;
}> = [
  {
    title: "Studio",
    items: [
      { id: "agentic", label: "Agentic Producing", meta: "Full DAW", icon: Bot },
      { id: "stems", label: "Stems Separation", meta: "Open source track", icon: ListFilter },
      { id: "remix", label: "Remix a Song", meta: "Browse songs", icon: Bookmark },
    ],
  },
  {
    title: "Loop",
    items: [
      { id: "looper", label: "Looper", meta: "Record + layer", icon: Repeat },
      { id: "backing", label: "Instant Backing Track", meta: "Pick a style", icon: Disc3 },
      { id: "jam", label: "Jam with AI", meta: "Prompt first", icon: Sparkles },
    ],
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
];

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
  const [activeSection, setActiveSection] = useState<SectionId>("studio");
  const [pendingScrollTarget, setPendingScrollTarget] = useState<SectionId | null>(null);
  const [fullscreenView, setFullscreenView] = useState<FullscreenView>(null);
  const [activeSubView, setActiveSubView] = useState<HomeSubView>("home");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [songOpen, setSongOpen] = useState(false);
  const [guitarOpen, setGuitarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BrowseItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<BrowseItem | null>(null);
  const [selectedGuitarClip, setSelectedGuitarClip] = useState<GuitarClip | null>(null);
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

  const shellTone = useMemo(
    () => ({
      appBg: isDark
        ? "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 24%), radial-gradient(circle at bottom right, rgba(251,146,60,0.12), transparent 30%), linear-gradient(180deg, #07090c 0%, #0b0f14 100%)"
        : "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(251,146,60,0.1), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      railBg: isDark
        ? "linear-gradient(180deg, rgba(4,6,10,0.98) 0%, rgba(7,10,15,0.96) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(244,247,251,0.96) 100%)",
      railSurface: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.78)",
      railSurfaceStrong: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)",
      railBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
      mainHeaderBg: isDark ? "rgba(13,17,22,0.78)" : "rgba(248,250,252,0.76)",
      heroScrim: isDark
        ? "linear-gradient(180deg, rgba(5,7,10,0.04) 0%, rgba(5,7,10,0.58) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(248,250,252,0.5) 58%, rgba(248,250,252,0.92) 100%)",
      heroFrameBg: isDark ? "rgba(5,8,12,0.96)" : "rgba(255,255,255,0.92)",
      chipBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)",
      mutedText: isDark ? "rgba(255,255,255,0.58)" : "rgba(71,85,105,0.86)",
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

  const handleLaunch = useCallback((id: ActionId) => {
    switch (id) {
      case "agentic":
        setFullscreenView("agentic-producing");
        return;
      case "stems":
        openSong(topSongs[0]);
        return;
      case "remix":
        setActiveSubView("top-songs");
        return;
      case "looper":
        setActiveSubView("looper");
        return;
      case "backing":
        setActiveSubView("instant-backing-track");
        return;
      case "jam":
        handleScrollTo("launch");
        return;
      default:
        return;
    }
  }, [handleScrollTo, openSong]);

  const contentTitle =
    activeSubView === "home"
      ? "Create"
      : activeSubView === "looper"
        ? "Looper"
        : activeSubView === "instant-backing-track"
          ? "Backing Track"
          : activeSubView === "top-songs"
            ? "Top Songs"
            : activeSubView === "top-templates"
              ? "Top Templates"
              : "Guitar Showcase";

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
          width: 326,
          minWidth: 326,
          padding: "22px 18px 18px",
          background: shellTone.railBg,
          borderRight: `1px solid ${shellTone.railBorder}`,
          boxShadow: isDark ? "24px 0 80px rgba(0,0,0,0.28)" : "24px 0 64px rgba(15,23,42,0.08)",
          zIndex: 2,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={brandOrbStyle}>
              <Disc3 size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p style={eyebrowStyle}>Entrance</p>
              <h1 style={railHeadingStyle}>LavaDAW</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={iconButtonStyle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
          </button>
        </div>

        <div className="flex flex-col gap-2" style={{ marginBottom: 18 }}>
          {railSections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleScrollTo(section.id)}
              className="flex items-center justify-between text-left"
              style={{
                ...railNavButtonStyle,
                backgroundColor:
                  activeSection === section.id ? shellTone.railSurfaceStrong : "transparent",
                borderColor:
                  activeSection === section.id ? shellTone.railBorder : "transparent",
              }}
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: shellTone.railSurface,
                    color: "var(--foreground)",
                  }}
                >
                  <section.icon size={16} strokeWidth={1.8} />
                </span>
                <span style={railNavLabelStyle}>{section.label}</span>
              </span>
              <ChevronRight size={17} strokeWidth={1.8} style={{ color: shellTone.mutedText }} />
            </button>
          ))}
        </div>

        <RailCard title="项目管理" icon={FolderKanban} tone={shellTone}>
          <button
            type="button"
            onClick={() => setProjectsOpen(true)}
            className="flex items-center justify-between"
            style={railPrimaryButtonStyle}
          >
            <span className="inline-flex items-center gap-2">
              <FolderOpen size={15} strokeWidth={1.9} />
              My Projects
            </span>
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>

          <div className="flex flex-wrap gap-2" style={{ marginTop: 12 }}>
            {recentProjects.slice(0, 4).map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setProjectsOpen(true)}
                className="truncate"
                style={railChipStyle}
                title={project.title}
              >
                {project.title}
              </button>
            ))}
          </div>
        </RailCard>

        <RailCard title="Loop 资源" icon={Waves} tone={shellTone} style={{ marginTop: 14 }}>
          <div className="flex flex-col gap-2.5">
            <button type="button" onClick={() => setActiveSubView("looper")} style={miniActionButtonStyle}>
              <span className="inline-flex items-center gap-2">
                <Music size={15} strokeWidth={1.9} />
                Looper
              </span>
              <ChevronRight size={15} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("instant-backing-track")}
              style={miniActionButtonStyle}
            >
              <span className="inline-flex items-center gap-2">
                <Disc3 size={15} strokeWidth={1.9} />
                Instant Backing Track
              </span>
              <ChevronRight size={15} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => handleScrollTo("launch")} style={miniActionButtonStyle}>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={15} strokeWidth={1.9} />
                Jam with AI
              </span>
              <ChevronRight size={15} strokeWidth={1.8} />
            </button>
          </div>
        </RailCard>

        <div
          className="mt-auto rounded-[26px]"
          style={{
            padding: "16px 16px 15px",
            background: shellTone.railSurface,
            border: `1px solid ${shellTone.railBorder}`,
          }}
        >
          <p style={eyebrowStyle}>Flow</p>
          <p style={railFooterStyle}>Empty project, scroll for ideas, then enter fullscreen DAW.</p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex items-center justify-between"
          style={{
            height: 80,
            minHeight: 80,
            padding: "0 30px 0 32px",
            backgroundColor: shellTone.mainHeaderBg,
            borderBottom: `1px solid ${shellTone.railBorder}`,
            backdropFilter: "blur(22px)",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Agentic Producing Entrance</p>
            <h2 style={topTitleStyle}>{contentTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            {activeSubView !== "home" && (
              <button
                type="button"
                onClick={() => setActiveSubView("home")}
                className="inline-flex items-center gap-2 rounded-full"
                style={secondaryButtonStyle}
              >
                <ArrowLeft size={15} strokeWidth={1.9} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setFullscreenView("agentic-producing")}
              className="inline-flex items-center gap-2 rounded-full"
              style={primaryButtonStyle}
            >
              <CirclePlay size={17} strokeWidth={1.9} />
              Full DAW
            </button>
          </div>
        </div>

        {activeSubView === "home" ? (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            <div style={{ padding: "24px 30px 42px" }}>
              <section ref={studioRef} style={sectionStyle}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p style={eyebrowStyle}>Studio</p>
                    <h3 style={sectionTitleStyle}>Right side starts with the DAW.</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={shellTone}>Empty project</Pill>
                    <Pill tone={shellTone}>Scroll for templates</Pill>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFullscreenView("agentic-producing")}
                  className="relative block w-full overflow-hidden rounded-[34px] text-left"
                  style={{
                    height: 774,
                    border: `1px solid ${shellTone.railBorder}`,
                    backgroundColor: shellTone.heroFrameBg,
                    boxShadow: isDark ? "0 28px 96px rgba(0,0,0,0.34)" : "0 24px 80px rgba(15,23,42,0.12)",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <AgenticProducingPage onBack={() => setFullscreenView(null)} />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: shellTone.heroScrim }}
                  />
                  <div
                    className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full"
                    style={heroBadgeStyle}
                  >
                    <Sparkles size={14} strokeWidth={1.8} />
                    Empty project
                  </div>
                  <div
                    className="absolute left-7 right-7 bottom-7 flex items-end justify-between gap-6 rounded-[28px]"
                    style={heroPanelStyle}
                  >
                    <div>
                      <p style={eyebrowStyle}>Agentic Producing</p>
                      <h3 style={heroTitleStyle}>Click anywhere to go fullscreen.</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone={shellTone}>Timeline</Pill>
                      <Pill tone={shellTone}>Agent chat</Pill>
                      <span className="inline-flex items-center gap-2 rounded-full" style={primaryButtonStyle}>
                        <CirclePlay size={15} strokeWidth={1.9} />
                        Open
                      </span>
                    </div>
                  </div>
                </button>
              </section>

              <section ref={launchRef} style={sectionStyle}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p style={eyebrowStyle}>Launch</p>
                    <h3 style={sectionTitleStyle}>Keep old entry concepts, but make them lighter.</h3>
                  </div>
                </div>

                <div className="grid grid-cols-[1.4fr_0.9fr] gap-5">
                  <div className="rounded-[30px]" style={panelStyle}>
                    <div className="flex flex-col gap-5">
                      {launchGroups.map((group) => (
                        <div key={group.title}>
                          <div className="mb-3 flex items-center justify-between">
                            <p style={miniSectionTitleStyle}>{group.title}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {group.items.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleLaunch(item.id)}
                                className="rounded-[22px] text-left transition-transform hover:-translate-y-0.5"
                                style={launchCardStyle}
                              >
                                <span
                                  className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl"
                                  style={{
                                    backgroundColor: shellTone.chipBg,
                                    color: "var(--foreground)",
                                  }}
                                >
                                  <item.icon size={18} strokeWidth={1.8} />
                                </span>
                                <p style={launchLabelStyle}>{item.label}</p>
                                <p style={launchMetaStyle}>{item.meta}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-full flex-col gap-5">
                    <div className="rounded-[30px]" style={panelStyle}>
                      <div className="mb-3 flex items-center justify-between">
                        <p style={miniSectionTitleStyle}>Prompt start</p>
                        <button
                          type="button"
                          onClick={() => handleLaunch("jam")}
                          style={inlineLinkButtonStyle}
                        >
                          Focus
                        </button>
                      </div>
                      <JamWithAI />
                    </div>

                    <div className="rounded-[30px]" style={panelStyle}>
                      <div className="mb-3 flex items-center justify-between">
                        <p style={miniSectionTitleStyle}>Top templates</p>
                        <button
                          type="button"
                          onClick={() => setActiveSubView("top-templates")}
                          style={inlineLinkButtonStyle}
                        >
                          See all
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {topTemplates.slice(0, 4).map((item) => (
                          <CompactImageCard
                            key={item.title}
                            item={item}
                            onClick={() => openTemplate(item)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section ref={communityRef} style={{ ...sectionStyle, paddingBottom: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p style={eyebrowStyle}>Community</p>
                    <h3 style={sectionTitleStyle}>Templates, songs, and player work stay in the same scroll flow.</h3>
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
                      <p style={miniSectionTitleStyle}>Guitar Showcase</p>
                      <button
                        type="button"
                        onClick={() => setActiveSubView("guitar-showcase")}
                        style={inlineLinkButtonStyle}
                      >
                        See all
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {guitarClips.slice(0, 4).map((clip) => (
                        <button
                          key={clip.id}
                          type="button"
                          onClick={() => openGuitar(clip)}
                          className="relative overflow-hidden rounded-[22px] text-left"
                          style={{
                            minHeight: 168,
                            border: `1px solid ${shellTone.railBorder}`,
                            backgroundColor: "var(--card)",
                          }}
                        >
                          <ImageWithFallback
                            src={clip.imageUrl}
                            alt={clip.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.58) 100%)",
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0" style={{ padding: 14 }}>
                            <p style={imageCardTitleStyle}>{clip.title}</p>
                            <p style={imageCardMetaStyle}>{clip.author}</p>
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
              <LooperPage onBack={() => setActiveSubView("home")} />
            ) : activeSubView === "instant-backing-track" ? (
              <InstantBackingTrackPage onBack={() => setActiveSubView("home")} />
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
                title="Guitar Showcase"
                items={guitarClips}
                onBack={() => setActiveSubView("home")}
                onItemClick={(item) => {
                  const clip = guitarClips.find(
                    (source) => source.title === item.title && source.author === item.author,
                  );
                  if (clip) {
                    openGuitar(clip);
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
    </div>
  );
}

function RailCard({
  title,
  icon: Icon,
  tone,
  children,
  style,
}: {
  title: string;
  icon: LucideIcon;
  tone: { railSurface: string; railBorder: string };
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      className="rounded-[28px]"
      style={{
        padding: "16px 15px 15px",
        backgroundColor: tone.railSurface,
        border: `1px solid ${tone.railBorder}`,
        ...style,
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={brandOrbStyle}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
        <p style={railCardTitleStyle}>{title}</p>
      </div>
      {children}
    </section>
  );
}

function Pill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: { chipBg: string };
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full"
      style={{
        padding: "10px 14px",
        backgroundColor: tone.chipBg,
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
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
      className="relative overflow-hidden rounded-[22px] text-left"
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
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.54) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0" style={{ padding: 14 }}>
        <p style={imageCardTitleStyle}>{item.title}</p>
        <p style={imageCardMetaStyle}>{item.author}</p>
      </div>
    </button>
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
  return (
    <div className="rounded-[30px]" style={panelStyle}>
      <div className="mb-3 flex items-center justify-between">
        <p style={miniSectionTitleStyle}>{title}</p>
        <button type="button" onClick={onOpenDetail} style={inlineLinkButtonStyle}>
          See all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.slice(0, 5).map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onItemClick(item)}
            className="flex items-center gap-3 rounded-[20px] text-left"
            style={{
              padding: "10px 10px 10px 12px",
              border: "1px solid var(--border)",
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
          className="inline-flex items-center gap-2 rounded-full"
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
            className="relative overflow-hidden rounded-[28px] text-left"
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
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.68) 100%)",
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

const brandOrbStyle: CSSProperties = {
  background:
    "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.24), transparent 55%), var(--surface-glass)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const railHeadingStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--foreground)",
  fontSize: 23,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  fontWeight: 700,
};

const iconButtonStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 14,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  cursor: "pointer",
};

const railNavButtonStyle: CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 20,
  border: "1px solid transparent",
  cursor: "pointer",
};

const railNavLabelStyle: CSSProperties = {
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
};

const railCardTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
};

const railPrimaryButtonStyle: CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  borderRadius: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const railChipStyle: CSSProperties = {
  maxWidth: "100%",
  padding: "7px 11px",
  borderRadius: 999,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};

const miniActionButtonStyle: CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 12px",
  borderRadius: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 13,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
};

const railFooterStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "var(--foreground)",
  fontSize: 13,
  lineHeight: 1.55,
};

const topTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--foreground)",
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const primaryButtonStyle: CSSProperties = {
  height: 46,
  padding: "0 18px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  height: 42,
  padding: "0 16px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const sectionStyle: CSSProperties = {
  paddingBottom: 28,
};

const sectionTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--foreground)",
  fontSize: 34,
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const heroBadgeStyle: CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 700,
};

const heroPanelStyle: CSSProperties = {
  padding: "22px 24px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  backdropFilter: "blur(20px)",
};

const heroTitleStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "var(--foreground)",
  fontSize: 30,
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const panelStyle: CSSProperties = {
  padding: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  boxShadow: "var(--elevation-sm)",
};

const miniSectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 700,
};

const inlineLinkButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const launchCardStyle: CSSProperties = {
  minHeight: 152,
  padding: 16,
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow: "0 12px 26px rgba(15,23,42,0.06)",
  cursor: "pointer",
};

const launchLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 17,
  fontWeight: 700,
  lineHeight: 1.25,
};

const launchMetaStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

const listTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
};

const listMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 500,
};

const imageCardTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--on-image-primary)",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.3,
};

const imageCardMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--on-image-secondary)",
  fontSize: 12,
  fontWeight: 500,
};
