import { AudioLines, Wifi, Settings } from "lucide-react";

export function TopBar() {
  return (
    <div
      className="flex items-center justify-end gap-4 px-8"
      style={{
        height: 56,
        minHeight: 56,
        fontFamily: "'Lava', sans-serif",
      }}
    >
      
      <Wifi
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--secondary)" }}
      />
      <button
        className="px-4 py-1.5 rounded-lg border border-border cursor-pointer transition-colors hover:bg-muted"
        style={{
          color: "var(--foreground)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)",
          fontFamily: "'Lava', sans-serif",
        }}
      >
        Settings
      </button>
    </div>
  );
}
