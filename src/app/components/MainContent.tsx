import { useRef, useState } from "react";
import {
  ListFilter,
  Monitor,
  Bookmark,
  Music,
  Disc3,
  Piano,
  Repeat,
  FolderOpen,
  ChevronRight,
  Bot,
} from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { ModeSelector } from "./ModeSelector";
import { JamWithAI } from "./JamWithAI";
import { ProjectsSheet, recentProjects } from "./ProjectsSheet";
import { TemplateSheet } from "./TemplateSheet";

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
    title: "Instant Groove",
    description: "Pick a feel. Play along.",
    subDescription: "Choose from the library and drop in.",
    icon: Disc3,
  },
];

const modeOptions = [
  {
    id: "daw",
    label: "Produce a Song",
    tagline: "Build, remix, or start from a stem. Your session, your rules.",
    icon: Piano,
    cards: dawCards,
  },
  {
    id: "loop",
    label: "Loop & Jam",
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

interface MainContentProps {
  sectionRefs: {
    create: React.RefObject<HTMLDivElement | null>;
    loop: React.RefObject<HTMLDivElement | null>;
    improvs: React.RefObject<HTMLDivElement | null>;
  };
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function MainContent({ sectionRefs, onScroll, scrollContainerRef }: MainContentProps) {
  const [showAll, setShowAll] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    author: string;
    imageUrl: string;
    avatarInitial: string;
  } | null>(null);
  const visibleCards = showAll ? playerCards : playerCards.slice(0, 6);

  const handleCardClick = (card: typeof playerCards[number]) => {
    setSelectedTemplate(card);
    setTemplateOpen(true);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-8"
      style={{ fontFamily: "'Lava', sans-serif", paddingBottom: "120px" }}
    >
      {/* Quick actions */}
      <div className="flex gap-3 mb-8 items-center">
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
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "var(--foreground)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Lava', sans-serif",
              padding: "4px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              border: "1px solid rgba(255,255,255,0.18)",
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

      {/* Projects Sheet */}
      <ProjectsSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      {/* miniDAW & Loop -- Two-Step Progressive Disclosure */}
      <section ref={sectionRefs.create} className="mb-10">
        <div ref={sectionRefs.loop} />
        <ModeSelector modes={modeOptions} />
      </section>

      {/* Improv Section -- AI Chat */}
      <section ref={sectionRefs.improvs} className="mb-10">
        <JamWithAI />
      </section>

      {/* Create by Players */}
      <section>
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
        <div className="grid grid-cols-3 gap-4">
          {visibleCards.map((card) => (
            <PlayerCard
              key={card.title}
              title={card.title}
              author={card.author}
              imageUrl={card.imageUrl}
              avatarInitial={card.avatarInitial}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>

        {/* Show More / Show Less */}
        <div className="flex justify-center" style={{ marginTop: "var(--spacing-6, 24px)" }}>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="cursor-pointer transition-opacity hover:opacity-70"
            style={{
              backgroundColor: "transparent",
              color: "var(--foreground)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Lava', sans-serif",
              padding: "8px 24px",
              borderRadius: "var(--radius-full, 9999px)",
              border: "1px solid var(--border)",
              letterSpacing: "0.04em",
            }}
          >
            {showAll ? "Show Less" : `Show More (${playerCards.length - 6} more)`}
          </button>
        </div>
      </section>

      {/* Template Sheet */}
      <TemplateSheet
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}