import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useCallback, useRef, useEffect } from "react";

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

export default function ChatInput({
  isLoading,
  onSubmit,
  onStop,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height (capped at 6 lines ~ 144px)
    const newHeight = Math.min(textarea.scrollHeight, 144);
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Adjust height whenever input value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        const cleanedMessage = inputValue.replace(/\n+$/, "").trim();
        onSubmit(cleanedMessage);
        setInputValue("");
      }
    },
    [inputValue, onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex gap-3 items-end"
    >
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            } else {
              // Ensure height is adjusted after Shift+Enter
              requestAnimationFrame(adjustTextareaHeight);
            }
          }
        }}
        placeholder="Type your message..."
        rows={1}
        className={cn(
          "flex-1",
          "text-zinc-900",
          "bg-white",
          "border border-zinc-200",
          "focus:border-[#5b6949]",
          "focus:ring-2 focus:ring-[#5b6949]/20",
          "placeholder:text-zinc-400",
          "text-base",
          "min-h-[52px]",
          "max-h-[144px]",
          "resize-none",
          "overflow-y-auto",
          "px-5 py-3.5",
          "transition-colors duration-200",
          "rounded-2xl"
        )}
      />
      <Button
        type={isLoading ? "button" : "submit"}
        onClick={isLoading ? onStop : undefined}
        size="sm"
        className={cn(
          isLoading
            ? "bg-red-500 hover:bg-red-600"
            : "bg-[#5b6949] hover:bg-[#5b6949]/90",
          "text-white",
          "border-none",
          "transition-colors duration-200",
          "h-[52px] px-6",
          "font-medium",
          "rounded-2xl"
        )}
      >
        {isLoading ? (
          <>
            <X className="h-4 w-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send
          </>
        )}
      </Button>
    </form>
  );
}
