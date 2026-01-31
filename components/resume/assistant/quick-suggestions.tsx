import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Star, Briefcase, FileSearch } from "lucide-react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    text: "Rate my Resume out of 10",
    icon: Star,
  },
  {
    text: "Improve the work experience section",
    icon: Briefcase,
  },
  {
    text: "Critique my resume",
    icon: FileSearch,
  },
];

export function QuickSuggestions({ onSuggestionClick }: QuickSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-3xl mx-auto">
      {suggestions.map((suggestion) => {
        const Icon = suggestion.icon;
        return (
          <Button
            key={suggestion.text}
            variant="ghost"
            onClick={() => onSuggestionClick(suggestion.text)}
            className={cn(
              "h-auto py-5 px-6",
              "bg-white rounded-2xl",
              "text-zinc-700 text-base font-normal",
              "border border-zinc-200",
              "hover:bg-zinc-50 hover:border-[#5b6949]",
              "transition-all duration-200",
              "justify-start text-left"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#5b6949]/10 text-[#5b6949] rounded-xl">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{suggestion.text}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
} 