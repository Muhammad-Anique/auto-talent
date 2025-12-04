'use client';

import { Education } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileEducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function ProfileEducationForm({ education, onChange }: ProfileEducationFormProps) {
  const addEducation = () => {
    onChange([...education, {
      school: "",
      degree: "",
      field: "",
      location: "",
      date: "",
      gpa: undefined,
      achievements: []
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: Education[typeof field]) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={education.map((_, index) => `education-${index}`)}
      >
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`education-${index}`}
            className="bg-white/80 backdrop-blur-sm border border-zinc-200/60 hover:border-[#5b6949]/30 hover:shadow-md transition-all duration-200 shadow-sm rounded-md overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-900">
                  {edu.degree ? `${edu.degree} ` : ''}{edu.field ? `in ${edu.field} ` : ''}{edu.school ? `at ${edu.school}` : 'New Education'}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {edu.date && <span>{edu.date}</span>}
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {/* School Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      className="text-base bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400"
                      placeholder="Institution Name"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      INSTITUTION
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-zinc-400 hover:text-red-500 transition-colors duration-200 h-8 w-8"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Location */}
                <div className="relative group">
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    className="bg-white/50 border-zinc-200 rounded-md h-8
                      focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                      hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                      placeholder:text-zinc-400 text-sm"
                    placeholder="City, Country"
                  />
                  <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                    LOCATION
                  </div>
                </div>

                {/* Degree and Field Row */}
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400 text-sm"
                      placeholder="Bachelor's, Master's, etc."
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      DEGREE
                    </div>
                  </div>
                  <div className="relative group flex-1">
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      className="bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400 text-sm"
                      placeholder="Field of Study"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      FIELD OF STUDY
                    </div>
                  </div>
                </div>

                {/* Date and GPA Row */}
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="relative group flex-1">
                    <Input
                      type="text"
                      value={edu.date}
                      onChange={(e) => updateEducation(index, 'date', e.target.value)}
                      className="bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400 text-sm"
                      placeholder="e.g., '2019 - 2023' or '2020 - Present'"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      DATE
                    </div>
                  </div>
                  <div className="relative group md:w-1/3">
                    <Input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value || undefined)}
                      className="bg-white/50 border-zinc-200 rounded-md h-8
                        focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]/20
                        hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                        placeholder:text-zinc-400 text-sm"
                      placeholder="0.00"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[9px] font-medium text-[#5b6949]">
                      GPA (OPTIONAL)
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-[#5b6949]">Achievements & Activities</Label>
                    <span className="text-[9px] text-zinc-500">One achievement per line</span>
                  </div>
                  <Textarea
                    value={edu.achievements?.join('\n')}
                    onChange={(e) => updateEducation(index, 'achievements', 
                      e.target.value.split('\n').filter(Boolean)
                    )}
                    placeholder="• Dean's List 2020-2021&#10;• President of Computer Science Club&#10;• First Place in Hackathon 2022"
                    className="min-h-[100px] bg-white/50 border-zinc-200 rounded-md
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
        onClick={addEducation}
        className="w-full bg-zinc-50 hover:bg-zinc-100 border-dashed border-zinc-300 hover:border-[#5b6949]/40 text-zinc-700 hover:text-[#5b6949] transition-all duration-200 h-8 text-sm"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Education
      </Button>
    </div>
  );
} 