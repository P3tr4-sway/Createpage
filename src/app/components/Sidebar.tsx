import { useEffect, useMemo, useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { TutorialNote } from "./TutorialNote";

const FONT = "var(--app-font-family)";

const stats = {
  songs: { value: 12, total: 20, label: "Songs Created", unit: "tracks" },
  jammed: { value: 8.5, total: 10, label: "Hours Jammed", unit: "hrs" },
  remixes: { value: 3, total: 5, label: "Remixes", unit: "mix" },
  stems: { value: 4, total: null, label: "Stem Splits", unit: "files" },
  credits: { used: 150, total: 1000 },
};

const statRows = [
  { id: "songs", ...stats.songs, color: "var(--sidebar-foreground)" },
  { id: "jammed", ...stats.jammed, color: "var(--sidebar-accent-teal)" },
  { id: "remixes", ...stats.remixes, color: "var(--sidebar-accent-coral)" },
  { id: "stems", ...stats.stems, color: "var(--sidebar-accent-lilac)" },
] as const;

function ConcentricRings() {
  const size = 182;
  const center = size / 2;
  const stroke = 11;
  const rings = [
    { radius: 64, progress: stats.songs.value / stats.songs.total, color: "var(--sidebar-foreground)" },
    { radius: 48, progress: stats.jammed.value / stats.jammed.total, color: "var(--sidebar-accent-teal)" },
    { radius: 32, progress: stats.remixes.value / stats.remixes.total, color: "var(--sidebar-accent-coral)" },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <radialGradient id="sidebar-ring-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--sidebar-ring-halo)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx={center} cy={center} r={72} fill="url(#sidebar-ring-halo)" />

      {rings.map((ring, index) => {
        const circumference = 2 * Math.PI * ring.radius;
        const progressLength = circumference * ring.progress;
        const remainingLength = circumference - progressLength;

        return (
          <g key={index}>
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke="var(--sidebar-ring-track)"
              strokeWidth={stroke}
            />
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={stroke}
              strokeDasharray={`${progressLength} ${remainingLength}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

interface SidebarProps {
  activeSection: "create" | "loop" | "improvs";
  onNavigate: (id: "create" | "loop" | "improvs") => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  void activeSection;
  void onNavigate;

  const creditsRemaining = stats.credits.total - stats.credits.used;
  const creditsPercent = creditsRemaining / stats.credits.total;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  const cardStyle = {
    border: "1px solid var(--sidebar-soft-border)",
    backgroundColor: "var(--sidebar-surface-card)",
    borderRadius: 20,
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  } as const;

  return (
    <aside
      className="flex flex-col border-r"
      style={{
        position: "relative",
        width: 248,
        minWidth: 248,
        height: "100%",
        fontFamily: FONT,
        borderColor: "var(--sidebar-border, var(--border))",
        background:
          "linear-gradient(180deg, var(--sidebar-surface-top) 0%, var(--sidebar) 58%, var(--sidebar) 100%)",
        overflow: "visible",
      }}
    >
      <TutorialNote
        title="左侧状态区的设计逻辑"
        points={[
          "这里先展示你的产出和进度，让用户一进来就知道当前状态，不会空白焦虑。",
          "AI Credits 常驻是为了提醒资源边界，帮助用户更有计划地使用 AI 功能。",
        ]}
        style={{ top: 14, right: -14 }}
        panelWidth={300}
        panelSide="right"
      />

      <div
        style={{
          padding: "16px 16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
          minHeight: 0,
        }}
      >
        <div style={{ padding: "0 2px" }}>
          <p
            style={{
              margin: 0,
              color: "var(--secondary)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.76,
            }}
          >
            {dateLabel}
          </p>
        </div>

        <section style={{ ...cardStyle, padding: "14px 12px 12px" }}>
          <div className="flex flex-col items-center">
            <ConcentricRings />
            <p
              style={{
                margin: 0,
                marginTop: 4,
                color: "var(--sidebar-foreground)",
                fontSize: 58,
                fontWeight: "var(--font-weight-bold)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              {stats.songs.value}
            </p>
            <p
              style={{
                margin: 0,
                marginTop: 4,
                color: "var(--sidebar-foreground)",
                fontSize: 14,
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Tracks
            </p>
            <p
              style={{
                margin: 0,
                marginTop: 2,
                color: "var(--secondary)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              This Month
            </p>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: "2px 12px" }}>
          {statRows.map((stat, index) => {
            const progress = stat.total ? stat.value / stat.total : 1;
            const size = 32;
            const radius = 13;
            const center = size / 2;
            const circumference = 2 * Math.PI * radius;
            const progressLength = circumference * progress;
            const remainingLength = circumference - progressLength;

            return (
              <div
                key={stat.id}
                className="flex items-center"
                style={{
                  gap: 10,
                  padding: "10px 2px",
                  borderBottom:
                    index < statRows.length - 1
                      ? "1px solid var(--sidebar-soft-border)"
                      : "none",
                }}
              >
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="var(--sidebar-ring-track)"
                    strokeWidth={3.5}
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={stat.color}
                    strokeWidth={3.5}
                    strokeDasharray={`${progressLength} ${remainingLength}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                  />
                </svg>

                <span
                  style={{
                    flex: 1,
                    color: "var(--secondary)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.25,
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {stat.label}
                </span>

                <span
                  style={{
                    color: stat.color,
                    fontSize: 17,
                    fontWeight: "var(--font-weight-bold)",
                    lineHeight: 1,
                    fontFamily: FONT,
                    textAlign: "right",
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 2,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {stat.value}
                  {stat.total !== null ? (
                    <span
                      style={{
                        color: "var(--secondary)",
                        fontSize: 11,
                        fontWeight: "var(--font-weight-medium)",
                        opacity: 0.8,
                        letterSpacing: "0.02em",
                      }}
                    >
                      /{stat.total}
                    </span>
                  ) : null}
                  <span
                    style={{
                      color: "var(--secondary)",
                      fontSize: 11,
                      fontWeight: "var(--font-weight-medium)",
                      opacity: 0.78,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {stat.unit}
                  </span>
                </span>
              </div>
            );
          })}
        </section>

        <section style={{ ...cardStyle, padding: "10px 12px" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon size={14} strokeWidth={1.8} style={{ color: "var(--sidebar-foreground)" }} />
              ) : (
                <Sun size={14} strokeWidth={1.8} style={{ color: "var(--sidebar-foreground)" }} />
              )}
              <span
                style={{
                  color: "var(--sidebar-foreground)",
                  fontSize: 12,
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <button
              type="button"
              aria-label="Toggle color theme"
              role="switch"
              aria-checked={isDark}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="cursor-pointer"
              style={{
                width: 46,
                height: 26,
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--sidebar-soft-border)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(17,24,39,0.16)",
                position: "relative",
                transition: "all 200ms ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 1,
                  left: isDark ? 21 : 1,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: "var(--sidebar-surface-card-strong)",
                  border: "1px solid var(--sidebar-soft-border)",
                  transition: "all 200ms ease",
                }}
              />
            </button>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: "auto",
            marginBottom: 2,
            padding: "12px",
            backgroundColor: "var(--sidebar-surface-card-strong)",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} strokeWidth={1.5} style={{ color: "var(--sidebar-foreground)" }} />
              <span
                style={{
                  color: "var(--sidebar-foreground)",
                  fontSize: 12,
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                AI Credits
              </span>
            </div>
            <span
              style={{
                color: "var(--sidebar-foreground)",
                fontSize: 16,
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              {creditsRemaining}
              <span
                style={{
                  color: "var(--secondary)",
                  fontSize: 12,
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                /{stats.credits.total}
              </span>
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 4,
              backgroundColor: "var(--sidebar-ring-track)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${creditsPercent * 100}%`,
                height: "100%",
                backgroundColor: "var(--sidebar-foreground)",
                borderRadius: "var(--radius-full)",
              }}
            />
          </div>

          <p
            style={{
              margin: 0,
              marginTop: 7,
              color: "var(--secondary)",
              fontSize: 11,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {stats.credits.used} used this month
          </p>
        </section>
      </div>

    </aside>
  );
}
