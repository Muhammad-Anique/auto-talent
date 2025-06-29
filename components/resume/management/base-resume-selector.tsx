import { cn } from "@/lib/utils";
import { Resume } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BaseResumeSelectorProps {
  baseResumes: Resume[];
  selectedResumeId: string;
  onResumeSelect: (value: string) => void;
  isInvalid?: boolean;
}

export function BaseResumeSelector({ 
  baseResumes,
  selectedResumeId,
  onResumeSelect,
  isInvalid 
}: BaseResumeSelectorProps) {
  return (
    <Select value={selectedResumeId} onValueChange={onResumeSelect}>
      <SelectTrigger 
        id="base-resume" 
        className={cn(
          "bg-white/80 border-gray-200 h-10 text-sm focus:border-[#5b6949] focus:ring-[#5b6949]/20",
          isInvalid && "border-red-500 shake"
        )}
      >
        <SelectValue placeholder="Select a base resume" />
      </SelectTrigger>
      <SelectContent>
        {baseResumes?.map((resume) => (
          <SelectItem 
            key={resume.id} 
            value={resume.id}
            className="focus:bg-pink-50 text-sm"
          >
            {resume.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 