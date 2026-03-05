import { useEffect, useState, type ReactNode } from "react";

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
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
