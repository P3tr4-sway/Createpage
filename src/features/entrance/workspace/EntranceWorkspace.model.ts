import { Bot, Repeat, Sparkles } from "lucide-react";
import type { Locale } from "@/features/entrance/EntranceLocaleContext";
import { copyByLocale } from "@/features/entrance/i18n/entrance.copy";
import type {
  BrowseItem,
  GuitarClip,
  HeroPromptSuggestion,
} from "@/features/entrance/model/entrance.types";
import type { HomeSubView, SectionId } from "@/features/entrance/state/useEntranceViewState";
import type { TutorialCourse } from "@/features/entrance/components/TutorialDialog";
import type {
  QuickAction,
  SidebarAction,
  SidebarProject,
} from "@/features/entrance/workspace/EntranceWorkspace.types";

type EntranceWorkspaceCopy = (typeof copyByLocale)[Locale];

interface CreateActionsOptions {
  copy: EntranceWorkspaceCopy;
  guitarClips: GuitarClip[];
  onOpenWorkspace: () => void;
  onOpenLooper: (filter: string) => void;
  onOpenGuitar: (item: GuitarClip) => void;
  onScrollTo: (section: SectionId) => void;
}

interface SidebarProjectsOptions {
  copy: EntranceWorkspaceCopy;
  guitarClips: GuitarClip[];
  topJamTracks: BrowseItem[];
  onOpenWorkspace: () => void;
  onOpenLooper: (filter: string) => void;
  onOpenGuitar: (item: GuitarClip) => void;
  onOpenTemplate: (item: BrowseItem) => void;
  onOpenBackingTrack: (filter: string) => void;
}

interface QuickActionsOptions {
  copy: EntranceWorkspaceCopy;
  topSongs: BrowseItem[];
  guitarClips: GuitarClip[];
  hipHopStarterTemplate: BrowseItem;
  onOpenWorkspace: () => void;
  onScrollTo: (section: SectionId) => void;
  onOpenLooper: (filter: string) => void;
  onOpenBackingTrack: (filter: string) => void;
  onOpenTemplate: (item: BrowseItem) => void;
  onOpenGuitar: (item: GuitarClip) => void;
}

export function buildCreateActions({
  copy,
  guitarClips,
  onOpenWorkspace,
  onOpenLooper,
  onOpenGuitar,
  onScrollTo,
}: CreateActionsOptions): SidebarAction[] {
  return [
    {
      label: copy.createActions[0].label,
      meta: copy.createActions[0].meta,
      icon: Bot,
      accent: "rgba(99, 102, 241, 0.18)",
      onClick: onOpenWorkspace,
    },
    {
      label: copy.createActions[1].label,
      meta: copy.createActions[1].meta,
      icon: Repeat,
      accent: "rgba(20, 184, 166, 0.18)",
      onClick: () => onOpenLooper("Hot"),
    },
    {
      label: copy.createActions[2].label,
      meta: copy.createActions[2].meta,
      icon: Sparkles,
      accent: "rgba(244, 114, 182, 0.18)",
      onClick: () => onOpenGuitar(guitarClips[0]),
    },
    {
      label: copy.createActions[3].label,
      meta: copy.createActions[3].meta,
      icon: Sparkles,
      accent: "rgba(250, 204, 21, 0.2)",
      onClick: () => onScrollTo("launch"),
    },
  ];
}

export function buildSidebarProjects({
  copy,
  guitarClips,
  topJamTracks,
  onOpenWorkspace,
  onOpenLooper,
  onOpenGuitar,
  onOpenTemplate,
  onOpenBackingTrack,
}: SidebarProjectsOptions): SidebarProject[] {
  return [
    {
      id: "daw-1",
      title: copy.sidebarProjects[0].title,
      meta: copy.sidebarProjects[0].meta,
      status: copy.sidebarProjects[0].status,
      onClick: onOpenWorkspace,
    },
    {
      id: "loop-1",
      title: copy.sidebarProjects[1].title,
      meta: copy.sidebarProjects[1].meta,
      status: copy.sidebarProjects[1].status,
      onClick: () => onOpenLooper("Hot"),
    },
    {
      id: "guitar-1",
      title: copy.sidebarProjects[2].title,
      meta: copy.sidebarProjects[2].meta,
      status: copy.sidebarProjects[2].status,
      onClick: () => onOpenGuitar(guitarClips[0]),
    },
    {
      id: "template-1",
      title: copy.sidebarProjects[3].title,
      meta: copy.sidebarProjects[3].meta,
      status: copy.sidebarProjects[3].status,
      onClick: () => onOpenTemplate(topJamTracks[8]),
    },
    {
      id: "backing-1",
      title: copy.sidebarProjects[4].title,
      meta: copy.sidebarProjects[4].meta,
      status: copy.sidebarProjects[4].status,
      onClick: () => onOpenBackingTrack("Blues"),
    },
    {
      id: "template-2",
      title: copy.sidebarProjects[5].title,
      meta: copy.sidebarProjects[5].meta,
      status: copy.sidebarProjects[5].status,
      onClick: () => onOpenTemplate(topJamTracks[6]),
    },
    {
      id: "guitar-2",
      title: copy.sidebarProjects[6].title,
      meta: copy.sidebarProjects[6].meta,
      status: copy.sidebarProjects[6].status,
      onClick: () => onOpenGuitar(guitarClips[2]),
    },
  ];
}

export function buildQuickActions({
  copy,
  topSongs,
  guitarClips,
  hipHopStarterTemplate,
  onOpenWorkspace,
  onScrollTo,
  onOpenLooper,
  onOpenBackingTrack,
  onOpenTemplate,
  onOpenGuitar,
}: QuickActionsOptions): QuickAction[] {
  return [
    {
      id: "make-song",
      title: copy.quickActions[0].title,
      meta: copy.quickActions[0].meta,
      tag: copy.quickActions[0].tag,
      imageUrl: topSongs[0].imageUrl,
      onClick: onOpenWorkspace,
    },
    {
      id: "jam-now",
      title: copy.quickActions[1].title,
      meta: copy.quickActions[1].meta,
      tag: copy.quickActions[1].tag,
      imageUrl: topSongs[1].imageUrl,
      onClick: () => onScrollTo("launch"),
    },
    {
      id: "rock-loop",
      title: copy.quickActions[2].title,
      meta: copy.quickActions[2].meta,
      tag: copy.quickActions[2].tag,
      imageUrl: guitarClips[3].imageUrl,
      onClick: () => onOpenLooper("Rock"),
    },
    {
      id: "blues-jam",
      title: copy.quickActions[3].title,
      meta: copy.quickActions[3].meta,
      tag: copy.quickActions[3].tag,
      imageUrl: guitarClips[4].imageUrl,
      onClick: () => onOpenBackingTrack("Blues"),
    },
    {
      id: "hiphop-song",
      title: copy.quickActions[4].title,
      meta: copy.quickActions[4].meta,
      tag: copy.quickActions[4].tag,
      imageUrl: hipHopStarterTemplate.imageUrl,
      onClick: () => onOpenTemplate(hipHopStarterTemplate),
    },
    {
      id: "guitar-solo",
      title: copy.quickActions[5].title,
      meta: copy.quickActions[5].meta,
      tag: copy.quickActions[5].tag,
      imageUrl: guitarClips[0].imageUrl,
      onClick: () => onOpenGuitar(guitarClips[0]),
    },
  ];
}

export function filterHeroPromptSuggestions(
  suggestions: HeroPromptSuggestion[],
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return suggestions;
  }

  return suggestions.filter((suggestion) =>
    [suggestion.tag, suggestion.title, suggestion.prompt].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
}

export function getVisibleHeroPromptSuggestions(
  suggestions: HeroPromptSuggestion[],
  limit = 3,
) {
  return suggestions.slice(0, limit);
}

export function buildTutorialBrowseItems(
  courses: TutorialCourse[],
  tutorialPartUnit: string,
): BrowseItem[] {
  return courses.map((course) => ({
    title: course.title,
    author: `${course.lessons.length} ${tutorialPartUnit} · ${course.duration}`,
    avatarInitial: course.mentor.slice(0, 1),
    imageUrl: course.imageUrl,
  }));
}

export function getContentTitle(
  activeSubView: HomeSubView,
  contentTitles: EntranceWorkspaceCopy["contentTitles"],
) {
  switch (activeSubView) {
    case "home":
      return contentTitles.home;
    case "looper":
      return contentTitles.looper;
    case "instant-backing-track":
      return contentTitles.backingTrack;
    case "quick-actions":
      return contentTitles.quickActions;
    case "top-songs":
      return contentTitles.topSongs;
    case "top-templates":
      return contentTitles.topTemplates;
    case "tutorials":
      return contentTitles.tutorials;
    default:
      return contentTitles.home;
  }
}
