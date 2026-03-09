import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
  type UIEvent,
} from "react";
import {
  clampBeat,
  formatTransportPosition,
  getAgenticTimelineMetrics,
} from "@/features/entrance/pages/agentic/AgenticProducingPage.model";

interface UseAgenticTimelineControllerParams {
  currentBeat: number;
  isDraggingPlayhead: boolean;
  isPlaying: boolean;
  loopEnabled: boolean;
  previewMode: boolean;
  scrollLeft: number;
  setCurrentBeat: Dispatch<SetStateAction<number>>;
  setIsDraggingPlayhead: Dispatch<SetStateAction<boolean>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setScrollLeft: Dispatch<SetStateAction<number>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
}

export function useAgenticTimelineController({
  currentBeat,
  isDraggingPlayhead,
  isPlaying,
  loopEnabled,
  previewMode,
  scrollLeft,
  setCurrentBeat,
  setIsDraggingPlayhead,
  setIsPlaying,
  setScrollLeft,
  setScrollTop,
}: UseAgenticTimelineControllerParams) {
  const [previewViewportWidth, setPreviewViewportWidth] = useState(() =>
    previewMode ? 1280 : 0,
  );
  const previewRootRef = useRef<HTMLElement | null>(null);
  const timelinePaneRef = useRef<HTMLDivElement | null>(null);
  const timelineBodyRef = useRef<HTMLDivElement | null>(null);

  const metrics = useMemo(
    () =>
      getAgenticTimelineMetrics({
        currentBeat,
        previewMode,
        previewViewportWidth,
        scrollLeft,
      }),
    [currentBeat, previewMode, previewViewportWidth, scrollLeft],
  );

  useEffect(() => {
    if (!previewMode) {
      return;
    }

    const previewRoot = previewRootRef.current;
    if (!previewRoot) {
      return;
    }

    const updatePreviewViewportWidth = () => {
      const { width } = previewRoot.getBoundingClientRect();
      if (width > 0) {
        setPreviewViewportWidth(width);
      }
    };

    updatePreviewViewportWidth();

    const observer = new ResizeObserver(updatePreviewViewportWidth);
    observer.observe(previewRoot);

    return () => observer.disconnect();
  }, [previewMode]);

  const seekToBeat = useCallback(
    (nextBeat: number) => {
      setCurrentBeat(clampBeat(nextBeat, metrics.totalBeats));
    },
    [metrics.totalBeats, setCurrentBeat],
  );

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const pane = timelinePaneRef.current;
      if (!pane) {
        return;
      }

      const bounds = pane.getBoundingClientRect();
      const localX = clientX - bounds.left + scrollLeft - metrics.timelineLeadingInset;
      seekToBeat(localX / metrics.pixelsPerBeat);
    },
    [metrics.pixelsPerBeat, metrics.timelineLeadingInset, scrollLeft, seekToBeat],
  );

  const handleSeekPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      seekFromClientX(event.clientX);
    },
    [seekFromClientX],
  );

  const handlePlayheadPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      seekFromClientX(event.clientX);
      setIsDraggingPlayhead(true);
    },
    [seekFromClientX, setIsDraggingPlayhead],
  );

  useEffect(() => {
    if (!isDraggingPlayhead) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      seekFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDraggingPlayhead(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingPlayhead, seekFromClientX, setIsDraggingPlayhead]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = (now - previousTime) / 1000;
      previousTime = now;

      setCurrentBeat((prev) => {
        const nextBeat = prev + deltaSeconds * (metrics.tempo / 60);
        if (nextBeat >= metrics.totalBeats) {
          return loopEnabled ? nextBeat % metrics.totalBeats : metrics.maxTimelineBeat;
        }
        return nextBeat;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [
    isPlaying,
    loopEnabled,
    metrics.maxTimelineBeat,
    metrics.tempo,
    metrics.totalBeats,
    setCurrentBeat,
  ]);

  useEffect(() => {
    if (isPlaying && !loopEnabled && currentBeat >= metrics.maxTimelineBeat) {
      setIsPlaying(false);
    }
  }, [currentBeat, isPlaying, loopEnabled, metrics.maxTimelineBeat, setIsPlaying]);

  useEffect(() => {
    const timelineBody = timelineBodyRef.current;
    if (!timelineBody) {
      return;
    }

    const markerX = metrics.timelineLeadingInset + currentBeat * metrics.pixelsPerBeat;
    const maxScrollLeft = Math.max(
      timelineBody.scrollWidth - timelineBody.clientWidth,
      0,
    );

    if (previewMode) {
      const nextScrollLeft = Math.min(
        Math.max(markerX - metrics.previewPlayheadViewportX, 0),
        maxScrollLeft,
      );

      if (Math.abs(timelineBody.scrollLeft - nextScrollLeft) > 1) {
        scrollTimelineBody(timelineBody, nextScrollLeft);
      }
      return;
    }

    const viewportStart = timelineBody.scrollLeft;
    const viewportEnd = viewportStart + timelineBody.clientWidth;
    const leftPadding = 48;
    const rightPadding = 92;

    if (markerX < viewportStart + leftPadding) {
      scrollTimelineBody(timelineBody, Math.max(markerX - leftPadding, 0));
      return;
    }

    if (markerX > viewportEnd - rightPadding) {
      scrollTimelineBody(
        timelineBody,
        Math.min(markerX - timelineBody.clientWidth + rightPadding, maxScrollLeft),
      );
    }
  }, [
    currentBeat,
    metrics.pixelsPerBeat,
    metrics.previewPlayheadViewportX,
    metrics.timelineLeadingInset,
    previewMode,
  ]);

  const handleTimelineScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      setScrollLeft(event.currentTarget.scrollLeft);
      setScrollTop(event.currentTarget.scrollTop);
    },
    [setScrollLeft, setScrollTop],
  );

  const transportPosition = useMemo(
    () => formatTransportPosition(currentBeat, metrics.beatsPerBar, metrics.totalBeats),
    [currentBeat, metrics.beatsPerBar, metrics.totalBeats],
  );

  return {
    handlePlayheadPointerDown,
    handleSeekPointerDown,
    handleTimelineScroll,
    metrics,
    previewRootRef,
    seekToBeat,
    timelineBodyRef,
    timelinePaneRef,
    transportPosition,
  };
}

function scrollTimelineBody(element: HTMLDivElement, left: number) {
  if (typeof element.scrollTo === "function") {
    element.scrollTo({ left });
    return;
  }

  element.scrollLeft = left;
}
