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
  onClick,
}: FeatureCardProps) {
  const isInteractive = typeof onClick === "function";
  const Comp = isInteractive ? "button" : "div";

  return (
    <Comp
      {...(isInteractive ? { type: "button" as const, onClick } : {})}
      className={`relative flex flex-col justify-end rounded-card border border-border p-6 text-left ${
        isInteractive
          ? "tablet-touch-target tablet-pressable cursor-pointer"
          : ""
      }`}
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
    </Comp>
  );
}
