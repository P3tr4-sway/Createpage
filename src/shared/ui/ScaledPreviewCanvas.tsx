import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScaledPreviewCanvasProps {
  children: ReactNode;
  designWidth: number;
  zoom?: number;
  focusX?: number;
}

export function ScaledPreviewCanvas({
  children,
  designWidth,
  zoom = 1,
  focusX = 0.5,
}: ScaledPreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateScale = () => {
      const { width } = element.getBoundingClientRect();
      if (!width) {
        return;
      }
      setScale((width / designWidth) * zoom);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => observer.disconnect();
  }, [designWidth, zoom]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${focusX * 100}%`,
          width: designWidth,
          height: "100%",
          transform: `translateX(-${focusX * 100}%) scale(${scale})`,
          transformOrigin: "top center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
