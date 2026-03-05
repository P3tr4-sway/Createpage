import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  subDescription?: string;
  icon?: LucideIcon;
}

export function FeatureCard({
  title,
  description,
  subDescription,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <div
      className="relative flex flex-col justify-end p-6 rounded-card border border-border cursor-pointer transition-all hover:border-secondary/30"
      style={{
        backgroundColor: "var(--card)",
        minHeight: 180,
        fontFamily: "'Lava', sans-serif",
      }}
    >
      {/* Icon removed */}
      <div className="flex flex-col gap-2">
        <h3
          style={{
            color: "var(--foreground)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "'Lava', sans-serif",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--secondary)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            fontFamily: "'Lava', sans-serif",
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