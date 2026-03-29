"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, AlertTriangle } from "lucide-react";
import { Resume } from "@/lib/types";

import { toast } from "@/hooks/use-toast";
// import { addTextToResume } from "@/utils/actions/resumes/ai";
import pdfToText from "react-pdftotext";
import { cn } from "@/lib/utils";
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";

interface TextImportDialogProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  trigger: React.ReactNode;
}

export function TextImportDialog({
  resume,
  onResumeChange,
  trigger,
}: TextImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");

  useEffect(() => {
    if (!open) {
      setApiKeyError("");
    }
  }, [open]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setContent((prev) => prev + (prev ? "\n\n" : "") + text);
      } catch (err) {
        console.error("PDF processing error:", err);
        toast({
          title: "PDF Processing Error",
          description:
            "Failed to extract text from the PDF. Please try again or paste the content manually.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await pdfToText(file);
        setContent((prev) => prev + (prev ? "\n\n" : "") + text);
      } catch (err) {
        console.error("PDF processing error:", err);
        toast({
          title: "PDF Processing Error",
          description:
            "Failed to extract text from the PDF. Please try again or paste the content manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async () => {
    setApiKeyError("");
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please enter some text to import.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/import-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, resume }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to import text");
      }

      const updatedResume = result.resume;
      (Object.keys(updatedResume) as Array<keyof Resume>).forEach((key) => {
        onResumeChange(key, updatedResume[key] as Resume[keyof Resume]);
      });

      toast({
        title: "Import successful",
        description: "Your resume has been updated with the imported content.",
      });
      setOpen(false);
      setContent("");
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl bg-gradient-to-r from-[#5b6949] to-[#4a5438] bg-clip-text text-transparent">
            Import Resume Content
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-1.5 text-sm text-gray-700">
              <p className="font-medium text-foreground">
                Choose one of these options:
              </p>
              <ol className="list-decimal list-inside space-y-0.5 ml-1 text-xs">
                <li>Upload your PDF resume by dropping it below or clicking to browse</li>
                <li>Paste your resume text directly into the text area</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-200 cursor-pointer group",
              isDragging
                ? "border-[#5b6949] bg-[#5b6949]/10"
                : "border-[#5b6949]/60 hover:border-[#5b6949] hover:bg-[#5b6949]/5",
            )}
          >
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileInput}
            />
            <Upload className="w-8 h-8 text-[#5b6949] group-hover:scale-110 transition-transform duration-200" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop your PDF resume here
              </p>
              <p className="text-xs text-gray-700">or click to browse files</p>
            </div>
          </label>
          <div className="relative">
            <div className="absolute -top-2.5 left-3 bg-white px-2 text-xs text-gray-700">
              Or paste your resume text here
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start pasting your resume content here..."
              className="min-h-[80px] bg-white/50 border-black/40 focus:border-[#5b6949]/40 focus:ring-[#5b6949]/20 transition-all duration-300 pt-3"
            />
          </div>
        </div>
        {apiKeyError && (
          <div className="px-3 py-2 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-2 text-red-600 text-sm">
            <div className="p-1 rounded-full bg-red-100">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs">API Key Required</p>
              <p className="text-red-500/90 text-xs">{apiKeyError}</p>
              <div className="mt-1.5 flex flex-col gap-1.5 justify-start">
                <div className="w-auto mx-auto">
                  <ProUpgradeButton />
                </div>
                <div className="text-center text-xs text-red-400">or</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50/50 w-auto mx-auto text-xs h-7"
                  onClick={() => (window.location.href = "/dashboard/settings")}
                >
                  Set API Keys in Settings
                </Button>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isProcessing || !content.trim()}
            className="bg-gradient-to-r from-[#5b6949] to-[#4a5438] text-white hover:from-[#4a5438] hover:to-[#3d462f]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
