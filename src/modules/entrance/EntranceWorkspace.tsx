import {
  ArrowLeft,
  Bookmark,
  Bot,
  ChevronRight,
  CirclePlay,
  Disc3,
  FolderKanban,
  FolderOpen,
  LibraryBig,
  ListFilter,
  MessageSquareQuote,
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
      appBg: isDark ? "#111315" : "#f3f4f6",
      railBg: isDark ? "#16181c" : "#f7f7f8",
      railSurface: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.78)",
      railSurfaceStrong: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)",
      railBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
      mainHeaderBg: isDark ? "#171a1f" : "#f8f8f9",
      heroScrim: isDark ? "rgba(10,12,16,0.32)" : "rgba(255,255,255,0.48)",
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

  const startActions = [
    {
      label: "Open DAW",
      meta: "Go fullscreen",
      icon: Bot,
      onClick: () => setFullscreenView("agentic-producing"),
    },
    {
      label: "Use Template",
      meta: "Browse starters",
      icon: LibraryBig,
      onClick: () => setActiveSubView("top-templates"),
    },
    {
      label: "Jam with AI",
      meta: "Prompt first",
      icon: Sparkles,
      onClick: () => handleScrollTo("launch"),
    },
  ];

  const toolActions = [
    {
      label: "Looper",
      meta: "Record + layer",
      icon: Repeat,
      onClick: () => setActiveSubView("looper"),
    },
    {
      label: "Backing Track",
      meta: "Pick a style",
      icon: Disc3,
      onClick: () => setActiveSubView("instant-backing-track"),
    },
    {
      label: "Stem Split",
      meta: "Open source track",
      icon: ListFilter,
      onClick: () => openSong(topSongs[0]),
    },
  ];

  const exploreActions = [
    {
      label: "Top Songs",
      meta: "Community picks",
      icon: Music,
      onClick: () => setActiveSubView("top-songs"),
    },
    {
      label: "Top Templates",
      meta: "Reusable starts",
      icon: Bookmark,
      onClick: () => setActiveSubView("top-templates"),
    },
    {
      label: "Backing Track",
      meta: "Style library",
      icon: Disc3,
      onClick: () => setActiveSubView("instant-backing-track"),
    },
  ];

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
  const workspaceEyebrow = activeSubView === "home" ? "Agentic Producing" : "Main Workspace";
  const homePreviewScale = 0.8;

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
          padding: "22px 18px 14px",
          background: shellTone.railBg,
          borderRight: `1px solid ${shellTone.railBorder}`,
          boxShadow: isDark ? "24px 0 80px rgba(0,0,0,0.28)" : "24px 0 64px rgba(15,23,42,0.08)",
          zIndex: 2,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center" style={plainSidebarIconWrapStyle}>
              <Disc3 size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p style={eyebrowStyle}>Start or continue</p>
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

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ paddingRight: 2, paddingBottom: 8 }}
        >
          <div className="flex flex-col gap-14">
            <RailCard title="Continue" icon={FolderKanban} tone={shellTone}>
              <div className="flex flex-col gap-3">
                <TouchActionRow
                  label="My Projects"
                  meta="Open recent work"
                  icon={FolderOpen}
                  onClick={() => setProjectsOpen(true)}
                />

                <div className="flex flex-col gap-2">
                  {recentProjects.slice(0, 2).map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setProjectsOpen(true)}
                      className="truncate text-left"
                      style={recentProjectRowStyle}
                      title={project.title}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
            </RailCard>

            <RailCard title="Start" icon={Sparkles} tone={shellTone}>
              <div className="flex flex-col gap-2.5">
                {startActions.map((action) => (
                  <TouchActionRow
                    key={action.label}
                    label={action.label}
                    meta={action.meta}
                    icon={action.icon}
                    onClick={action.onClick}
                  />
                ))}
              </div>
            </RailCard>

            <RailCard title="Explore" icon={Users} tone={shellTone}>
              <div className="flex flex-col gap-2.5">
                {toolActions.slice(0, 2).map((action) => (
                  <TouchActionRow
                    key={action.label}
                    label={action.label}
                    meta={action.meta}
                    icon={action.icon}
                    onClick={action.onClick}
                  />
                ))}
                {exploreActions.map((action) => (
                  <TouchActionRow
                    key={action.label}
                    label={action.label}
                    meta={action.meta}
                    icon={action.icon}
                    onClick={action.onClick}
                  />
                ))}
              </div>
            </RailCard>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex items-center justify-between"
          style={{
            height: 72,
            minHeight: 72,
            padding: "0 30px 0 32px",
            backgroundColor: shellTone.mainHeaderBg,
            borderBottom: `1px solid ${shellTone.railBorder}`,
            backdropFilter: "blur(22px)",
          }}
        >
          <div>
            <p style={eyebrowStyle}>{workspaceEyebrow}</p>
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
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: "smooth" }}
          >
            <section
              ref={studioRef}
              style={{
                ...sectionStyle,
                minHeight: "clamp(640px, calc(100vh - 148px), 780px)",
                marginLeft: -30,
                marginRight: -30,
              }}
            >
              <button
                type="button"
                onClick={() => setFullscreenView("agentic-producing")}
                className="relative block w-full overflow-hidden text-left"
                style={{
                  height: "clamp(640px, calc(100vh - 148px), 780px)",
                  backgroundColor: shellTone.heroFrameBg,
                  borderTop: `1px solid ${shellTone.railBorder}`,
                  borderBottom: `1px solid ${shellTone.railBorder}`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      width: `${100 / homePreviewScale}%`,
                      height: `${100 / homePreviewScale}%`,
                      transform: `translateX(-50%) scale(${homePreviewScale})`,
                      transformOrigin: "top center",
                    }}
                  >
                    <AgenticProducingPage previewMode />
                  </div>
                </div>
                <div
                  className="absolute inset-0"
                  style={{ background: shellTone.heroScrim }}
                />
                <div
                  className="absolute inline-flex items-center gap-2 rounded-full"
                  style={{ ...heroBadgeStyle, left: 30, top: 22 }}
                >
                  <Sparkles size={14} strokeWidth={1.8} />
                  Empty project
                </div>
                <div
                  className="absolute flex items-center gap-5"
                  style={{ ...heroBottomDockStyle, left: 30, right: 30, bottom: 22 }}
                >
                  <div className="flex w-full max-w-[820px] flex-1">
                    <div className="flex w-full items-center gap-3 rounded-full" style={heroChatFieldStyle}>
                      <MessageSquareQuote size={18} strokeWidth={1.8} style={{ color: "var(--secondary)" }} />
                      <span style={heroChatPlaceholderStyle}>
                        Ask AI agent to arrange, mix, or automate...
                      </span>
                      <span
                        className="inline-flex items-center gap-2 rounded-full"
                        style={heroChatSendStyle}
                      >
                        <CirclePlay size={14} strokeWidth={1.9} />
                        Send
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </section>

            <div style={{ padding: "22px 30px 42px" }}>
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
                              backgroundColor: "rgba(0,0,0,0.36)",
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
        <div className="flex h-10 w-10 items-center justify-center" style={plainSidebarIconWrapStyle}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
        <p style={railCardTitleStyle}>{title}</p>
      </div>
      {children}
    </section>
  );
}

function TouchActionRow({
  label,
  meta,
  icon: Icon,
  onClick,
}: {
  label: string;
  meta: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between text-left"
      style={touchRowStyle}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center" style={plainSidebarIconWrapStyle}>
          <Icon size={16} strokeWidth={1.9} />
        </span>
        <span className="min-w-0">
          <span style={touchLabelStyle}>{label}</span>
          <span style={touchMetaStyle}>{meta}</span>
        </span>
      </span>
      <ChevronRight
        size={16}
        strokeWidth={1.9}
        style={{ color: "var(--secondary)" }}
      />
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

const plainSidebarIconWrapStyle: CSSProperties = {
  color: "var(--foreground)",
};

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
  width: 38,
  height: 38,
  borderRadius: 999,
  border: "none",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const railCardTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 700,
};

const touchRowStyle: CSSProperties = {
  width: "100%",
  minHeight: 64,
  padding: "0 14px",
  borderRadius: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
};

const touchLabelStyle: CSSProperties = {
  display: "block",
  color: "inherit",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.2,
};

const touchMetaStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.2,
};

const recentProjectRowStyle: CSSProperties = {
  width: "100%",
  minHeight: 56,
  padding: "0 16px",
  borderRadius: 18,
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
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
  height: 42,
  padding: "0 16px",
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

const heroBadgeStyle: CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 700,
};

const heroBottomDockStyle: CSSProperties = {
  padding: "0 0 0 0",
  minHeight: 74,
};

const heroChatFieldStyle: CSSProperties = {
  minHeight: 62,
  padding: "0 10px 0 18px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
};

const heroChatPlaceholderStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  color: "var(--secondary)",
  fontSize: 15,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const heroChatSendStyle: CSSProperties = {
  height: 46,
  padding: "0 18px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 14,
  fontWeight: 700,
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
  fontSize: 17,
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
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.25,
};

const launchMetaStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 14,
  fontWeight: 500,
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
