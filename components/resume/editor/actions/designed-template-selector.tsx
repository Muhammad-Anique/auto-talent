'use client';

import { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CV_TEMPLATES } from '@/lib/cv-templates/template-registry';
import Image from 'next/image';

interface DesignedTemplateSelectorProps {
  currentTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  disabled?: boolean;
}

export function DesignedTemplateSelector({
  currentTemplateId,
  onTemplateSelect,
  disabled = false
}: DesignedTemplateSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(currentTemplateId);

  const handleApplyTemplate = () => {
    onTemplateSelect(selectedTemplateId);
    setShowModal(false);
  };

  const selectedTemplate = CV_TEMPLATES.find(t => t.id === selectedTemplateId);

  return (
    <>
      <Button
        onClick={() => !disabled && setShowModal(true)}
        disabled={disabled}
        variant="outline"
        className={cn(
          "w-full flex items-center gap-2 h-10 px-4",
          "bg-white border-2 border-zinc-200 rounded-md",
          "text-xs font-medium text-zinc-700",
          "hover:border-[#5b6949] hover:bg-[#5b6949]/5 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Palette className="w-4 h-4" />
        <span>Choose Template</span>
      </Button>

      {/* Template Selection Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 bg-gradient-to-br from-zinc-50 to-zinc-100">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 bg-gradient-to-r from-[#5b6949] to-[#6d7d57]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Choose Your CV Template</h2>
                  <p className="text-sm text-white/80 mt-1">Select a professionally designed template</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Template Grid */}
            <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-3 gap-6">
                {CV_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={cn(
                      "relative group text-left rounded-xl border-2 transition-all overflow-hidden",
                      "hover:shadow-xl hover:scale-[1.02]",
                      selectedTemplateId === template.id
                        ? "border-[#5b6949] shadow-lg ring-2 ring-[#5b6949]/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[8.5/11] w-full bg-zinc-100 overflow-hidden">
                      <Image
                        src={template.thumbnail}
                        alt={template.name}
                        fill
                        className="object-cover object-top"
                      />
                      {selectedTemplateId === template.id && (
                        <div className="absolute inset-0 bg-[#5b6949]/20 flex items-center justify-center">
                          <div className="bg-[#5b6949] rounded-full p-3 shadow-lg">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-4 bg-white border-t-2 border-zinc-100">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: template.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-zinc-900 mb-1">
                            {template.name}
                          </h3>
                          <p className="text-xs text-zinc-600 line-clamp-2">{template.description}</p>
                          <div className="mt-2">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                              "bg-zinc-100 text-zinc-700"
                            )}>
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-600">
                  {selectedTemplate && (
                    <span>
                      Selected: <span className="font-medium text-zinc-900">{selectedTemplate.name}</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="border-zinc-300 hover:bg-zinc-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyTemplate}
                    className="bg-gradient-to-r from-[#5b6949] to-[#6d7d57] hover:from-[#4a5539] hover:to-[#5b6949] text-white font-medium"
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
