import type { TutorialCourse } from "@/features/entrance/components/TutorialDialog";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import {
  imageCardMetaStyle,
  imageCardTitleStyle,
  inlineLinkButtonStyle,
  miniSectionTitleStyle,
  panelStyle,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse.styles";

interface EntranceWorkspaceTutorialPanelProps {
  title: string;
  seeAllLabel: string;
  partUnit: string;
  railBorder: string;
  courses: TutorialCourse[];
  onSeeAll: () => void;
  onOpenTutorial: (course: TutorialCourse) => void;
}

export function EntranceWorkspaceTutorialPanel({
  title,
  seeAllLabel,
  partUnit,
  railBorder,
  courses,
  onSeeAll,
  onOpenTutorial,
}: EntranceWorkspaceTutorialPanelProps) {
  return (
    <div className="rounded-[var(--radius-container)]" style={panelStyle}>
      <div className="mb-3 flex items-center justify-between">
        <p style={miniSectionTitleStyle}>{title}</p>
        <button
          type="button"
          onClick={onSeeAll}
          className="tablet-touch-target tablet-pressable"
          style={inlineLinkButtonStyle}
        >
          {seeAllLabel}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {courses.slice(0, 4).map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => onOpenTutorial(course)}
            className="tablet-pressable relative overflow-hidden rounded-[var(--radius-container)] text-left"
            style={{
              minHeight: 168,
              border: `1px solid ${railBorder}`,
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
              <p style={imageCardMetaStyle}>
                {course.lessons.length} {partUnit} · {course.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
