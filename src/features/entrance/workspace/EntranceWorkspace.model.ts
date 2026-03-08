import { Bot, Repeat, Sparkles } from "lucide-react";
import type { EntranceWorkspaceCopy } from "@/features/entrance/i18n/entrance.copy";
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

const FEATURED_GUITAR_CLIP_ID = "g1";
const AMBIENT_GUITAR_CLIP_ID = "g3";
const ROCK_LOOP_GUITAR_CLIP_ID = "g4";
const BLUES_JAM_GUITAR_CLIP_ID = "g5";
const MAKE_SONG_TOP_SONG_ID = "midnight-echoes";
const JAM_NOW_TOP_SONG_ID = "city-after-rain";
const HOUSE_DRUM_TEMPLATE_ID = "basement-funk-run";
const INDIE_POP_TEMPLATE_ID = "indie-night-drive";

function getRequiredById<T extends { id: string }>(
  items: readonly T[],
  id: T["id"],
  collectionName: string,
): T {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`${collectionName} is missing required item "${id}".`);
  }

  return item;
}

export function buildCreateActions({
  copy,
  guitarClips,
  onOpenWorkspace,
  onOpenLooper,
  onOpenGuitar,
  onScrollTo,
}: CreateActionsOptions): SidebarAction[] {
  const startSongCopy = getRequiredById(copy.createActions, "start-song", "copy.createActions");
  const openLooperCopy = getRequiredById(copy.createActions, "open-looper", "copy.createActions");
  const tryGuitarRiffCopy = getRequiredById(copy.createActions, "try-guitar-riff", "copy.createActions");
  const jamVibeCopy = getRequiredById(copy.createActions, "jam-vibe", "copy.createActions");
  const featuredGuitarClip = getRequiredById(guitarClips, FEATURED_GUITAR_CLIP_ID, "guitarClips");

  return [
    {
      id: startSongCopy.id,
      label: startSongCopy.label,
      meta: startSongCopy.meta,
      icon: Bot,
      accent: "rgba(99, 102, 241, 0.18)",
      onClick: onOpenWorkspace,
    },
    {
      id: openLooperCopy.id,
      label: openLooperCopy.label,
      meta: openLooperCopy.meta,
      icon: Repeat,
      accent: "rgba(20, 184, 166, 0.18)",
      onClick: () => onOpenLooper("Hot"),
    },
    {
      id: tryGuitarRiffCopy.id,
      label: tryGuitarRiffCopy.label,
      meta: tryGuitarRiffCopy.meta,
      icon: Sparkles,
      accent: "rgba(244, 114, 182, 0.18)",
      onClick: () => onOpenGuitar(featuredGuitarClip),
    },
    {
      id: jamVibeCopy.id,
      label: jamVibeCopy.label,
      meta: jamVibeCopy.meta,
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
  const lateNightArrangementCopy = getRequiredById(
    copy.sidebarProjects,
    "late-night-arrangement",
    "copy.sidebarProjects",
  );
  const neoSoulPocketLoopCopy = getRequiredById(
    copy.sidebarProjects,
    "neo-soul-pocket-loop",
    "copy.sidebarProjects",
  );
  const dreamGuitarBedCopy = getRequiredById(
    copy.sidebarProjects,
    "dream-guitar-bed",
    "copy.sidebarProjects",
  );
  const houseDrumStarterCopy = getRequiredById(
    copy.sidebarProjects,
    "house-drum-starter",
    "copy.sidebarProjects",
  );
  const bluesClubBackingKitCopy = getRequiredById(
    copy.sidebarProjects,
    "blues-club-backing-kit",
    "copy.sidebarProjects",
  );
  const indiePopWriterRoomCopy = getRequiredById(
    copy.sidebarProjects,
    "indie-pop-writer-room",
    "copy.sidebarProjects",
  );
  const ambientSwellsNotesCopy = getRequiredById(
    copy.sidebarProjects,
    "ambient-swells-notes",
    "copy.sidebarProjects",
  );
  const featuredGuitarClip = getRequiredById(guitarClips, FEATURED_GUITAR_CLIP_ID, "guitarClips");
  const ambientGuitarClip = getRequiredById(guitarClips, AMBIENT_GUITAR_CLIP_ID, "guitarClips");
  const houseDrumTemplate = getRequiredById(topJamTracks, HOUSE_DRUM_TEMPLATE_ID, "topJamTracks");
  const indiePopTemplate = getRequiredById(topJamTracks, INDIE_POP_TEMPLATE_ID, "topJamTracks");

  return [
    {
      id: lateNightArrangementCopy.id,
      title: lateNightArrangementCopy.title,
      meta: lateNightArrangementCopy.meta,
      status: lateNightArrangementCopy.status,
      typeLabel: lateNightArrangementCopy.typeLabel,
      onClick: onOpenWorkspace,
    },
    {
      id: neoSoulPocketLoopCopy.id,
      title: neoSoulPocketLoopCopy.title,
      meta: neoSoulPocketLoopCopy.meta,
      status: neoSoulPocketLoopCopy.status,
      typeLabel: neoSoulPocketLoopCopy.typeLabel,
      onClick: () => onOpenLooper("Hot"),
    },
    {
      id: dreamGuitarBedCopy.id,
      title: dreamGuitarBedCopy.title,
      meta: dreamGuitarBedCopy.meta,
      status: dreamGuitarBedCopy.status,
      typeLabel: dreamGuitarBedCopy.typeLabel,
      onClick: () => onOpenGuitar(featuredGuitarClip),
    },
    {
      id: houseDrumStarterCopy.id,
      title: houseDrumStarterCopy.title,
      meta: houseDrumStarterCopy.meta,
      status: houseDrumStarterCopy.status,
      typeLabel: houseDrumStarterCopy.typeLabel,
      onClick: () => onOpenTemplate(houseDrumTemplate),
    },
    {
      id: bluesClubBackingKitCopy.id,
      title: bluesClubBackingKitCopy.title,
      meta: bluesClubBackingKitCopy.meta,
      status: bluesClubBackingKitCopy.status,
      typeLabel: bluesClubBackingKitCopy.typeLabel,
      onClick: () => onOpenBackingTrack("Blues"),
    },
    {
      id: indiePopWriterRoomCopy.id,
      title: indiePopWriterRoomCopy.title,
      meta: indiePopWriterRoomCopy.meta,
      status: indiePopWriterRoomCopy.status,
      typeLabel: indiePopWriterRoomCopy.typeLabel,
      onClick: () => onOpenTemplate(indiePopTemplate),
    },
    {
      id: ambientSwellsNotesCopy.id,
      title: ambientSwellsNotesCopy.title,
      meta: ambientSwellsNotesCopy.meta,
      status: ambientSwellsNotesCopy.status,
      typeLabel: ambientSwellsNotesCopy.typeLabel,
      onClick: () => onOpenGuitar(ambientGuitarClip),
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
  const makeSongCopy = getRequiredById(copy.quickActions, "make-song", "copy.quickActions");
  const jamRightNowCopy = getRequiredById(copy.quickActions, "jam-right-now", "copy.quickActions");
  const startRockLoopCopy = getRequiredById(copy.quickActions, "start-rock-loop", "copy.quickActions");
  const startBluesJamCopy = getRequiredById(copy.quickActions, "start-blues-jam", "copy.quickActions");
  const makeHipHopIdeaCopy = getRequiredById(copy.quickActions, "make-hip-hop-idea", "copy.quickActions");
  const soloGuitarTakeCopy = getRequiredById(copy.quickActions, "solo-guitar-take", "copy.quickActions");
  const makeSongPreview = getRequiredById(topSongs, MAKE_SONG_TOP_SONG_ID, "topSongs");
  const jamRightNowPreview = getRequiredById(topSongs, JAM_NOW_TOP_SONG_ID, "topSongs");
  const rockLoopPreview = getRequiredById(guitarClips, ROCK_LOOP_GUITAR_CLIP_ID, "guitarClips");
  const bluesJamPreview = getRequiredById(guitarClips, BLUES_JAM_GUITAR_CLIP_ID, "guitarClips");
  const featuredGuitarClip = getRequiredById(guitarClips, FEATURED_GUITAR_CLIP_ID, "guitarClips");

  return [
    {
      id: makeSongCopy.id,
      title: makeSongCopy.title,
      meta: makeSongCopy.meta,
      tag: makeSongCopy.tag,
      imageUrl: makeSongPreview.imageUrl,
      onClick: onOpenWorkspace,
    },
    {
      id: jamRightNowCopy.id,
      title: jamRightNowCopy.title,
      meta: jamRightNowCopy.meta,
      tag: jamRightNowCopy.tag,
      imageUrl: jamRightNowPreview.imageUrl,
      onClick: () => onScrollTo("launch"),
    },
    {
      id: startRockLoopCopy.id,
      title: startRockLoopCopy.title,
      meta: startRockLoopCopy.meta,
      tag: startRockLoopCopy.tag,
      imageUrl: rockLoopPreview.imageUrl,
      onClick: () => onOpenLooper("Rock"),
    },
    {
      id: startBluesJamCopy.id,
      title: startBluesJamCopy.title,
      meta: startBluesJamCopy.meta,
      tag: startBluesJamCopy.tag,
      imageUrl: bluesJamPreview.imageUrl,
      onClick: () => onOpenBackingTrack("Blues"),
    },
    {
      id: makeHipHopIdeaCopy.id,
      title: makeHipHopIdeaCopy.title,
      meta: makeHipHopIdeaCopy.meta,
      tag: makeHipHopIdeaCopy.tag,
      imageUrl: hipHopStarterTemplate.imageUrl,
      onClick: () => onOpenTemplate(hipHopStarterTemplate),
    },
    {
      id: soloGuitarTakeCopy.id,
      title: soloGuitarTakeCopy.title,
      meta: soloGuitarTakeCopy.meta,
      tag: soloGuitarTakeCopy.tag,
      imageUrl: featuredGuitarClip.imageUrl,
      onClick: () => onOpenGuitar(featuredGuitarClip),
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
    id: course.id,
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
