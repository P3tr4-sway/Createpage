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

export function EntranceWorkspace() {
  const createRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const improvsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(true);

  const handleNavigate = useCallback((id: string) => {
    const refMap: Record<string, RefObject<HTMLDivElement | null>> = {
      create: createRef,
      loop: loopRef,
      improvs: improvsRef,
    };

    const ref = refMap[id];
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
  }, []);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-background"
      style={{ fontFamily: "'Lava', sans-serif" }}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection="create" onNavigate={handleNavigate} />
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
          />
        </div>
      </div>
      <BottomBar visible={barVisible} />
    </div>
  );
}
