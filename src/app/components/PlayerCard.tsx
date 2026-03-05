import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PlayerCardProps {
  title: string;
  author: string;
  imageUrl: string;
  avatarInitial: string;
  onClick?: () => void;
}

export function PlayerCard({
  title,
  author,
  imageUrl,
  avatarInitial,
  onClick,
}: PlayerCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-card cursor-pointer group"
      style={{ minHeight: 180, fontFamily: "'Lava', sans-serif" }}
      onClick={onClick}
    >
      <ImageWithFallback
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
        style={{ filter: "brightness(0.6)" }}
      />
      <div className="relative flex flex-col justify-between h-full p-5" style={{ minHeight: 180 }}>
        <h4
          style={{
            color: "var(--on-image-primary)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "'Lava', sans-serif",
            lineHeight: 1.3,
            maxWidth: "80%",
          }}
        >
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-auto">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 28,
              height: 28,
              backgroundColor: "var(--secondary)",
              color: "var(--on-image-primary)",
              fontSize: 12,
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "'Lava', sans-serif",
            }}
          >
            {avatarInitial}
          </div>
          <span
            style={{
              color: "var(--on-image-primary)",
              fontSize: 13,
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "'Lava', sans-serif",
            }}
          >
            {author}
          </span>
        </div>
      </div>
    </div>
  );
}
