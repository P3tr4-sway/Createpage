import { ArrowLeft, ChevronRight } from "lucide-react";
import type { BrowseItem } from "@/features/entrance/model/entrance.types";
import type { QuickAction } from "@/features/entrance/workspace/EntranceWorkspace.types";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import {
  imageCardMetaStyle,
  imageCardTitleStyle,
  inlineLinkButtonStyle,
  listMetaStyle,
  listTitleStyle,
  miniSectionTitleStyle,
  panelStyle,
  quickActionCardStyle,
  quickActionMetaStyle,
  quickActionTagStyle,
  secondaryButtonStyle,
  sectionDescriptionStyle,
  sectionTitleStyle,
  templateStripHintStyle,
  templateStripStyle,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse.styles";
export type { QuickAction } from "@/features/entrance/workspace/EntranceWorkspace.types";

interface QuickActionCardProps {
  action: QuickAction;
  onClick: () => void;
}

interface QuickAccessCarouselProps {
  actions: QuickAction[];
  onSeeAll: () => void;
  heading: string;
  hint: string;
  seeAllLabel: string;
}

interface QuickActionsPageProps {
  actions: QuickAction[];
  onBack: () => void;
  title: string;
  description: string;
  backLabel: string;
}

interface TopListColumnProps {
  title: string;
  items: BrowseItem[];
  onItemClick: (item: BrowseItem) => void;
  onOpenDetail: () => void;
  seeAllLabel: string;
}

interface TopBrowsePageProps {
  title: string;
  items: BrowseItem[];
  onBack: () => void;
  onItemClick: (item: BrowseItem) => void;
  backLabel: string;
}

function QuickActionCard({ action, onClick }: QuickActionCardProps) {
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
        <p style={quickActionMetaStyle}>{action.meta}</p>
      </div>
      <ChevronRight
        size={16}
        strokeWidth={1.8}
        style={{ color: "var(--secondary)", flexShrink: 0 }}
      />
    </button>
  );
}

export function QuickAccessCarousel({
  actions,
  onSeeAll,
  heading,
  hint,
  seeAllLabel,
}: QuickAccessCarouselProps) {
  const { containerRef, isDragging, dragBind } = useDragScroll("x");

  return (
    <div style={templateStripStyle}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p style={miniSectionTitleStyle}>{heading}</p>
          <p style={templateStripHintStyle}>{hint}</p>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="tablet-touch-target tablet-pressable"
          style={inlineLinkButtonStyle}
        >
          {seeAllLabel}
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

export function QuickActionsPage({
  actions,
  onBack,
  title,
  description,
  backLabel,
}: QuickActionsPageProps) {
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
          {backLabel}
        </button>
        <h3 style={sectionTitleStyle}>{title}</h3>
        <div style={{ width: 72 }} />
      </div>

      <div className="mb-6">
        <p style={sectionDescriptionStyle}>{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} onClick={action.onClick} />
        ))}
      </div>
    </section>
  );
}

export function TopListColumn({
  title,
  items,
  onItemClick,
  onOpenDetail,
  seeAllLabel,
}: TopListColumnProps) {
  const { containerRef, isDragging, dragBind } = useDragScroll("y");

  return (
    <div
      className="rounded-[30px]"
      style={{ ...panelStyle, display: "flex", flexDirection: "column" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p style={miniSectionTitleStyle}>{title}</p>
        <button
          type="button"
          onClick={onOpenDetail}
          className="tablet-touch-target tablet-pressable"
          style={inlineLinkButtonStyle}
        >
          {seeAllLabel}
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
            <ChevronRight
              size={16}
              strokeWidth={1.8}
              style={{ color: "var(--secondary)" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function TopBrowsePage({
  title,
  items,
  onBack,
  onItemClick,
  backLabel,
}: TopBrowsePageProps) {
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
          {backLabel}
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
