import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode, useRef, useState, useEffect } from "react";

interface ResizablePanelsProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function ResizablePanels({
  isBaseResume,
  editorPanel,
  previewPanel,
}: ResizablePanelsProps) {
  const [previewSize, setPreviewSize] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPercentageRef = useRef(60); // Store last percentage

  // Add function to calculate pixel width
  const updatePixelWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const pixelWidth = Math.floor(
      (containerWidth * lastPercentageRef.current) / 100,
    );
    setPreviewSize(pixelWidth);
  };

  useEffect(() => {
    // Handle window resize
    const handleResize = () => updatePixelWidth();
    window.addEventListener("resize", handleResize);

    // Initial calculation
    updatePixelWidth();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="h-full relative">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "relative h-full rounded-lg  ",
          isBaseResume ? "border-zinc-200/40" : "border-gray-300/50",
        )}
      >
        {/* Editor Panel */}
        <ResizablePanel defaultSize={40} minSize={30} maxSize={70}>
          {editorPanel}
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle
          withHandle
          className={cn(
            isBaseResume
              ? "bg-zinc-100/50 hover:bg-zinc-200/50"
              : "bg-gray-200/50 hover:bg-green-300/50 shadow-sm shadow-pink-200/20",
          )}
        />

        {/* Preview Panel */}
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          maxSize={70}
          onResize={(size) => {
            lastPercentageRef.current = size; // Store current percentage
            updatePixelWidth();
          }}
          className={cn(
            "shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] overflow-y-scroll",
            isBaseResume ? "shadow-zinc-200/50" : "shadow-zinc-200/50",
          )}
        >
          {previewPanel(previewSize)}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
