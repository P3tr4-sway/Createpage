import { Sparkles } from "lucide-react";
import { TutorialNote } from "./TutorialNote";

const stats = {
  songs:   { value: 12,  total: 20,   color: "#ffffff",  label: "Songs Created",  unit: "tracks" },
  jammed:  { value: 8.5, total: 10,   color: "#4ECDC4",  label: "Hours Jammed",   unit: "hrs"    },
  remixes: { value: 3,   total: 5,    color: "#FF6B6B",  label: "Remixes",         unit: "mix"    },
  stems:   { value: 4,   total: null, color: "#A78BFA",  label: "Stem Splits",     unit: "files"  },
  credits: { used: 150,  total: 1000, color: "#4ECDC4" },
};

const rings = [
  { r: 50, progress: stats.songs.value   / stats.songs.total!,   color: stats.songs.color   },
  { r: 37, progress: stats.jammed.value  / stats.jammed.total!,  color: stats.jammed.color  },
  { r: 24, progress: stats.remixes.value / stats.remixes.total!, color: stats.remixes.color },
];

const statRows = [
  stats.songs,
  stats.jammed,
  stats.remixes,
  stats.stems,
] as typeof stats.songs[];

const FONT = "'Lava', sans-serif";

function ConcentriRings() {
  const W = 220, RING_CY = 110;
  const cx = W / 2;
  // Bottom of outer ring + text block — sized for larger type
  const textY = RING_CY + 100 + 28; // 238
  const H     = textY + 52;          // room for 3 text lines

  const scaledRings = [
    { r: 100, ...rings[0] },
    { r:  76, ...rings[1] },
    { r:  52, ...rings[2] },
  ];

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>
      </defs>

      {/* Background glow disc */}
      <circle cx={cx} cy={RING_CY} r={106} fill="url(#bg-grad)" />

      {scaledRings.map((ring, i) => {
        const circ = 2 * Math.PI * ring.r;
        const fill = circ * ring.progress;
        const gap  = circ * (1 - ring.progress);
        return (
          <g key={i}>
            <circle cx={cx} cy={RING_CY} r={ring.r} fill="none" stroke={ring.color} strokeWidth={11} opacity={0.1} />
            <circle
              cx={cx} cy={RING_CY} r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={11}
              strokeDasharray={`${fill} ${gap}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${RING_CY})`}
              filter="url(#ring-glow)"
            />
          </g>
        );
      })}

      {/* ── Text block below rings ── */}
      {/* Value */}
      <text
        x={cx} y={textY}
        textAnchor="middle"
        fill="var(--sidebar-foreground)"
        fontSize="36"
        fontWeight="700"
        fontFamily={FONT}
      >
        {stats.songs.value}
      </text>
      {/* Unit */}
      <text
        x={cx} y={textY + 22}
        textAnchor="middle"
        fill="var(--secondary)"
        fontSize="13"
        fontFamily={FONT}
        letterSpacing="0.1em"
      >
        TRACKS
      </text>
      {/* Sub-label */}
      <text
        x={cx} y={textY + 38}
        textAnchor="middle"
        fill="var(--secondary)"
        fontSize="11"
        fontFamily={FONT}
        letterSpacing="0.06em"
        opacity={0.45}
      >
        THIS MONTH
      </text>
    </svg>
  );
}

interface SidebarProps {
  activeSection: "create" | "loop" | "improvs";
  onNavigate: (id: "create" | "loop" | "improvs") => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const creditsRemaining = stats.credits.total - stats.credits.used;
  const creditsPercent   = creditsRemaining / stats.credits.total;

  return (
    <aside
      className="flex flex-col border-r"
      style={{
        position: "relative",
        width: 240, minWidth: 240,
        height: "100%",
        fontFamily: FONT,
        backgroundColor: "var(--sidebar)",
        borderColor: "var(--sidebar-border, var(--border))",
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

      {/* ── Header ── */}
      <div style={{ padding: "14px 20px 6px" }}>
        <p style={{
          color: "var(--secondary)",
          fontSize: "11px",
          fontFamily: FONT,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 4,
          opacity: 0.6,
        }}>
          Wednesday, Mar 4
        </p>
        
      </div>

      {/* ── Rings (centred) ── */}
      <div className="flex justify-center" style={{ padding: "4px 0 0" }}>
        <ConcentriRings />
      </div>

      {/* ── Stat rows ── */}
      <div
        className="flex flex-col"
        style={{ padding: "2px 20px 10px" }}
      >
        {statRows.map((stat, i) => {
          const pct    = stat.total ? stat.value / stat.total : null;
          const size   = 36;
          const mc     = size / 2;
          const r      = 14;
          const circ   = 2 * Math.PI * r;
          const filled = pct !== null ? circ * pct : circ;
          const gap    = pct !== null ? circ * (1 - pct) : 0;

          return (
            <div
              key={i}
              className="flex items-center"
              style={{
                gap: 10,
                padding: "8px 0",
                borderBottom: i < statRows.length - 1
                  ? "1px solid var(--border)"
                  : "none",
              }}
            >
              {/* Mini ring — arc only */}
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
                <circle cx={mc} cy={mc} r={r} fill="none" stroke={stat.color} strokeWidth={3.5} opacity={0.12} />
                <circle
                  cx={mc} cy={mc} r={r}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth={3.5}
                  strokeDasharray={`${filled} ${gap}`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${mc} ${mc})`}
                  opacity={pct !== null ? 0.9 : 0.35}
                />
              </svg>

              {/* Label — secondary, left */}
              <span style={{
                flex: 1,
                color: "var(--secondary)",
                fontSize: "11px",
                fontFamily: FONT,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}>
                {stat.label}
              </span>

              {/* Value — accent colour, right */}
              <span style={{
                color: stat.color,
                fontSize: "var(--text-sm, 16px)",
                fontWeight: "var(--font-weight-bold)",
                fontFamily: FONT,
                lineHeight: 1,
                textAlign: "right",
              }}>
                {stat.value}
                {stat.total && (
                  <span style={{
                    color: "var(--secondary)",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: "12px",
                  }}>
                    /{stat.total}
                  </span>
                )}
                {" "}
                <span style={{
                  color: "var(--secondary)",
                  fontSize: "11px",
                  fontWeight: "var(--font-weight-normal)",
                  opacity: 0.7,
                }}>
                  {stat.unit}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div style={{
        height: 1,
        margin: "0 20px",
        backgroundColor: "var(--border)",
        opacity: 0.6,
      }} />

      {/* ── Lava AI Credits ── */}
      <div style={{ padding: "var(--spacing-4, 16px) var(--spacing-6, 24px)", marginTop: "auto" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <div className="flex items-center gap-2">
            <Sparkles size={14} strokeWidth={1.5} style={{ color: "#4ECDC4" }} />
            <span style={{
              color: "var(--sidebar-foreground)",
              fontSize: "12px",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: FONT,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              AI Credits
            </span>
          </div>
          <span style={{
            color: "#4ECDC4",
            fontSize: "var(--text-sm, 16px)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: FONT,
          }}>
            {creditsRemaining}
            <span style={{ color: "var(--secondary)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}>
              /{stats.credits.total}
            </span>
          </span>
        </div>

        <div style={{
          width: "100%", height: 4,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-full, 9999px)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${creditsPercent * 100}%`,
            height: "100%",
            background: "linear-gradient(to right, #4ECDC4, #81e6df)",
            borderRadius: "var(--radius-full, 9999px)",
          }} />
        </div>

        <p style={{
          marginTop: 6,
          color: "var(--secondary)",
          fontSize: "11px",
          fontFamily: FONT,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}>
          {stats.credits.used} used this month
        </p>
      </div>

      {/* ── Footer ── */}
      {/* My Project button removed — now accessible via MainContent "My Projects" sheet */}
    </aside>
  );
}
