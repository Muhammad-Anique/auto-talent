"use client";

import { Skill } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileSkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function ProfileSkillsForm({
  skills,
  onChange,
}: ProfileSkillsFormProps) {
  const addSkill = () => {
    onChange([
      ...skills,
      {
        category: "",
        items: [],
      },
    ]);
  };

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: Skill[typeof field],
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const [skillInputs, setSkillInputs] = React.useState<{
    [key: number]: string;
  }>(Object.fromEntries(skills.map((s, i) => [i, s.items?.join(", ") || ""])));

  React.useEffect(() => {
    setSkillInputs(
      Object.fromEntries(skills.map((s, i) => [i, s.items?.join(", ") || ""])),
    );
  }, [skills]);

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-3"
        defaultValue={skills.map((_, index) => `skill-${index}`)}
      >
        {skills.map((skill, index) => (
          <AccordionItem
            key={index}
            value={`skill-${index}`}
            className="bg-white/80 backdrop-blur-sm border border-zinc-200/60 hover:border-[#5b6949]/30 hover:shadow-md transition-all duration-200 shadow-sm rounded-md overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-900">
                  {skill.category || "New Skill Category"}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {skill.items && skill.items.length > 0 && (
                    <span className="max-w-[300px] truncate">
                      {skill.items.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {/* Category and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={skill.category}
                      onChange={(e) =>
                        updateSkill(index, "category", e.target.value)
                      }
                      className="text-gray-800 bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400"
                      placeholder="e.g., Programming Languages, Frameworks, Tools"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      CATEGORY
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="text-zinc-400 hover:text-red-500 transition-colors duration-200 h-8 w-8"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-[#5b6949]">
                      Skills
                    </Label>
                    <span className="text-[9px] text-zinc-500">
                      Separate with commas
                    </span>
                  </div>
                  <Input
                    value={skillInputs[index] || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSkillInputs((prev) => ({
                        ...prev,
                        [index]: newValue,
                      }));

                      if (newValue.endsWith(",")) {
                        const items = newValue
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateSkill(index, "items", items);
                      } else {
                        const items = newValue
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateSkill(index, "items", items);
                      }
                    }}
                    onBlur={(e) => {
                      const items = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      updateSkill(index, "items", items);
                      setSkillInputs((prev) => ({
                        ...prev,
                        [index]: items.join(", "),
                      }));
                    }}
                    placeholder="e.g., TypeScript, React, Node.js, AWS"
                    className="bg-white/50 border-zinc-200 rounded-md h-8
                      focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                      hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                      placeholder:text-zinc-400 text-sm"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant="outline"
        onClick={addSkill}
        className="w-full bg-zinc-50 hover:bg-zinc-100 border-dashed border-zinc-300 hover:border-[#5b6949]/40 text-zinc-700 hover:text-[#5b6949] transition-all duration-200 h-8 text-sm"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Skill Category
      </Button>
    </div>
  );
}
