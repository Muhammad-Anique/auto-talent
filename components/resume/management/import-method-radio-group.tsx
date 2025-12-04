import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Brain } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface ImportMethodRadioItemProps extends ComponentPropsWithoutRef<'input'> {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked?: boolean;
  id: string;
}

function ImportMethodRadioItem({
  title,
  description,
  icon,
  id,
  ...props
}: ImportMethodRadioItemProps) {
  return (
    <label htmlFor={id} className="h-full cursor-pointer">
      <input
        type="radio"
        className="sr-only peer"
        id={id}
        {...props}
      />
      <div
        tabIndex={0}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl p-4",
          "bg-white/80 border-2 border-zinc-200 shadow-sm h-full",
          "hover:border-[#5b6949] hover:bg-[#5b6949]/5",
          "transition-all duration-300",
          "peer-checked:border-[#5b6949] peer-checked:bg-zinc-50",
          "peer-checked:shadow-md peer-checked:shadow-[#5b6949]/10",
          "focus:outline-none focus:ring-2 focus:ring-[#5b6949]/50"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-zinc-50 to-[#5b6949]/10 border border-zinc-200 flex items-center justify-center mb-3">
            {icon}
          </div>
          <div className="font-semibold text-sm text-[#5b6949] mb-1.5">{title}</div>
          <span className="text-xs leading-relaxed text-gray-600">{description}</span>
        </div>
      </div>
    </label>
  );
}

interface ImportMethodRadioGroupProps {
  value: 'import-profile' | 'ai';
  onChange: (value: 'import-profile' | 'ai') => void;
}

export function ImportMethodRadioGroup({ value, onChange }: ImportMethodRadioGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ImportMethodRadioItem
        name="tailorOption"
        value="ai"
        id="ai-tailor"
        checked={value === 'ai'}
        onChange={() => onChange('ai')}
        title="Tailor with AI"
        description="Let AI analyze the job description and optimize your resume for the best match"
        icon={<Brain className="h-6 w-6 text-[#5b6949]" />}
      />
      
      <ImportMethodRadioItem
        name="tailorOption"
        value="import-profile"
        id="manual-tailor"
        checked={value === 'import-profile'}
        onChange={() => onChange('import-profile')}
        title="Copy Base Resume"
        description="Create a copy of your base resume. Add a job description to link it to a specific position."
        icon={<Copy className="h-6 w-6 text-[#5b6949]" />}
      />
    </div>
  );
} 