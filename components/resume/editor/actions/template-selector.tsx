'use client';

import { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TemplateLayout } from '@/lib/types';
import { TemplatePreview } from './template-preview';

const TEMPLATE_OPTIONS: {
  value: TemplateLayout;
  label: string;
  description: string;
  color: string;
  preview: string;
}[] = [
  {
    value: 'classic',
    label: 'Classic White',
    description: 'Clean traditional layout',
    color: '#ffffff',
    preview: 'Traditional center-aligned with no colors'
  },
  {
    value: 'modern',
    label: 'Orange Accent',
    description: 'Modern with orange highlights',
    color: '#FF6B35',
    preview: 'Orange sidebar with profile photo'
  },
  {
    value: 'professional',
    label: 'Blue Professional',
    description: 'Navy blue sidebar design',
    color: '#2C3E50',
    preview: 'Dark blue sidebar with white content'
  },
  {
    value: 'minimal',
    label: 'Burgundy Elite',
    description: 'Elegant burgundy theme',
    color: '#8B2635',
    preview: 'Maroon sidebar with sophisticated layout'
  },
  {
    value: 'left-aligned',
    label: 'Green Modern',
    description: 'Fresh green accent',
    color: '#27AE60',
    preview: 'Green highlights with left alignment'
  },
  {
    value: 'sidebar',
    label: 'Purple Creative',
    description: 'Creative purple sidebar',
    color: '#9B59B6',
    preview: 'Purple accent sidebar layout'
  },
  {
    value: 'compact',
    label: 'Teal Compact',
    description: 'Compact teal design',
    color: '#16A085',
    preview: 'Space-efficient teal theme'
  },
  {
    value: 'executive',
    label: 'Gold Executive',
    description: 'Premium gold accents',
    color: '#D4AF37',
    preview: 'Luxury gold-themed layout'
  },
  {
    value: 'corporate',
    label: 'Slate Corporate',
    description: 'Corporate slate gray',
    color: '#34495E',
    preview: 'Professional gray sidebar'
  }
];

interface TemplateSelectorProps {
  currentTemplate: TemplateLayout;
  onTemplateSelect: (template: TemplateLayout) => void;
  disabled?: boolean;
}

export function TemplateSelector({
  currentTemplate,
  onTemplateSelect,
  disabled = false
}: TemplateSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateLayout>(currentTemplate);

  const handleApplyTemplate = () => {
    onTemplateSelect(selectedTemplate);
    setShowModal(false);
  };

  return (
    <>
      <Button
        onClick={() => !disabled && setShowModal(true)}
        disabled={disabled}
        variant="outline"
        className={cn(
          "flex items-center gap-2 h-10 px-4",
          "bg-white border-2 border-zinc-200",
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
        <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0 bg-gradient-to-br from-zinc-50 to-zinc-100">
          <div className="flex h-full">
            {/* Left Side - Template Grid */}
            <div className="w-2/5 flex flex-col bg-white border-r border-zinc-200">
              <div className="px-6 py-5 border-b border-zinc-200 bg-gradient-to-r from-[#5b6949] to-[#6d7d57]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Choose Your Template</h2>
                    <p className="text-sm text-white/80 mt-1">Select a design that matches your style</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {TEMPLATE_OPTIONS.map((template) => (
                    <button
                      key={template.value}
                      onClick={() => setSelectedTemplate(template.value)}
                      className={cn(
                        "relative text-left p-4 rounded-xl border-2 transition-all group",
                        "hover:shadow-lg hover:scale-[1.02]",
                        selectedTemplate === template.value
                          ? "border-[#5b6949] bg-[#5b6949]/5 shadow-md"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: template.color }}
                        >
                          {selectedTemplate === template.value && (
                            <Check className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-zinc-900 mb-1">
                            {template.label}
                          </h3>
                          <p className="text-xs text-zinc-600 mb-1">{template.description}</p>
                          <p className="text-xs text-zinc-500 italic">{template.preview}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
                <Button
                  onClick={handleApplyTemplate}
                  className="w-full bg-gradient-to-r from-[#5b6949] to-[#6d7d57] hover:from-[#4a5539] hover:to-[#5b6949] text-white font-medium h-11"
                >
                  Apply Template
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="w-full border-zinc-300 hover:bg-zinc-100"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className="w-3/5 flex flex-col">
              <div className="px-6 py-5 border-b border-zinc-200 bg-white/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-zinc-900">Live Preview</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  {TEMPLATE_OPTIONS.find(t => t.value === selectedTemplate)?.label} - {TEMPLATE_OPTIONS.find(t => t.value === selectedTemplate)?.description}
                </p>
              </div>

              <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-zinc-50 to-zinc-100">
                <div className="bg-white shadow-2xl mx-auto rounded-lg overflow-hidden border border-zinc-200" style={{ width: '595px', minHeight: '842px' }}>
                  <TemplatePreview template={selectedTemplate} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
