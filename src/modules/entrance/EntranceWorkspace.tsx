import {
  useCallback,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";
import { Sidebar } from "../../app/components/Sidebar";
import { BottomBar } from "../../app/components/BottomBar";
import { TopBar } from "../../app/components/TopBar";
import { MainContent } from "../../app/components/MainContent";
import { AgenticProducingPage } from "../../app/components/AgenticProducingPage";

type SectionId = "create" | "loop" | "improvs";
type FullscreenView = "agentic-producing" | null;

export function EntranceWorkspace() {
  const createRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const improvsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("create");
  const [fullscreenView, setFullscreenView] = useState<FullscreenView>(null);

  const handleNavigate = useCallback((id: SectionId) => {
    const refMap: Record<SectionId, RefObject<HTMLDivElement | null>> = {
      create: createRef,
      loop: loopRef,
      improvs: improvsRef,
    };

    const ref = refMap[id];
    setActiveSection(id);
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const currentScrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const atBottom = scrollHeight - currentScrollTop - clientHeight < 2;

    setBarVisible(!atBottom);

    const sections: Array<{ id: SectionId; ref: RefObject<HTMLDivElement | null> }> = [
      { id: "create", ref: createRef },
      { id: "loop", ref: loopRef },
      { id: "improvs", ref: improvsRef },
    ];

    // Use a viewport anchor line instead of a fixed pixel threshold to avoid
    // early tab switching when cards/sections change height.
    const activationLine = currentScrollTop + clientHeight * 0.35;
    let nextActiveSection: SectionId = "create";
    for (const section of sections) {
      if (section.ref.current && activationLine >= section.ref.current.offsetTop) {
        nextActiveSection = section.id;
      }
    }

    if (nextActiveSection !== activeSection) {
      setActiveSection(nextActiveSection);
    }
  }, [activeSection]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-background"
      style={{ fontFamily: "'Lava', sans-serif" }}
    >
      {fullscreenView === "agentic-producing" ? (
        <AgenticProducingPage onBack={() => setFullscreenView(null)} />
      ) : (
        <>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBar />
              <MainContent
                sectionRefs={{
                  create: createRef,
                  loop: loopRef,
                  improvs: improvsRef,
                }}
                onScroll={handleScroll}
                scrollContainerRef={scrollContainerRef}
                onOpenAgenticProducing={() => setFullscreenView("agentic-producing")}
              />
            </div>
          </div>
          <BottomBar
            visible={barVisible}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
        </>
      )}
    </div>
  );
}
