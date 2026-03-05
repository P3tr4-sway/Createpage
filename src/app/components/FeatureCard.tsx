import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  subDescription?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  subDescription,
  icon: Icon,
  onClick,
}: FeatureCardProps) {
  const isInteractive = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className="relative flex flex-col justify-end p-6 rounded-card border border-border cursor-pointer transition-all hover:border-secondary/30"
      style={{
        backgroundColor: "var(--card)",
        minHeight: 180,
        fontFamily: "var(--app-font-family)",
      }}
    >
      {/* Icon removed */}
      <div className="flex flex-col gap-2">
        <h3
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "var(--app-font-family)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--secondary)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            fontFamily: "var(--app-font-family)",
            lineHeight: 1.5,
          }}
        >
          {description}
          {subDescription && (
            <>
              <br />
              {subDescription}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
