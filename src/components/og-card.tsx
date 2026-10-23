import { site } from "@/lib/site";

// Social preview images can't use Tailwind or CSS variables, so these are the
// dark theme colors written out as hex
const colors = {
  bg: "#0b0d12",
  fg: "#edeef2",
  muted: "#9b9ea5",
  border: "#2b2e33",
  accent: "#809eff",
};

export const ogSize = { width: 1200, height: 630 };

export function OgCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: colors.bg,
        color: colors.fg,
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: colors.accent }}>
        {site.url.replace("https://", "")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: colors.muted }}>{subtitle}</div>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: `2px solid ${colors.border}`,
          paddingTop: 32,
          fontSize: 28,
          color: colors.muted,
        }}
      >
        {site.name} · {site.jobTitle}
      </div>
    </div>
  );
}
