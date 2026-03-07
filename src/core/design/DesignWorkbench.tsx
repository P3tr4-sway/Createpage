import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type DesignWorkbenchProps = {
  children: ReactNode;
  width?: number;
  height?: number;
};

export function DesignWorkbench({
  children,
  width = 1920,
  height = 1080,
}: DesignWorkbenchProps) {
  const [scale, setScale] = useState(1);
  const inverseScale = scale === 0 ? 1 : 1 / scale;

  useEffect(() => {
    const updateScale = () => {
      const widthRatio = window.innerWidth / width;
      const heightRatio = window.innerHeight / height;
      setScale(Math.min(widthRatio, heightRatio, 1));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [width, height]);

  const frameStyle: CSSProperties &
    Record<"--workbench-scale" | "--workbench-inverse-scale", number> = {
    width,
    height,
    position: "relative",
    isolation: "isolate",
    transform: `scale(${scale})`,
    "--workbench-scale": scale,
    "--workbench-inverse-scale": inverseScale,
  };

  return (
    <div className="design-workbench">
      <div
        className="design-frame-shell"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <div
          className="design-frame"
          style={frameStyle}
        >
          {children}
          <div
            id="design-workbench-portal-root"
            className="absolute inset-0"
            style={{ pointerEvents: "none", zIndex: 300 }}
          />
        </div>
      </div>
    </div>
  );
}
