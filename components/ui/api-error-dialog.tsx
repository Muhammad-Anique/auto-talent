'use client';

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ApiErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: { title: string; description: string };
  onUpgrade: () => void;
  onSettings: () => void;
}

export function ApiErrorDialog({ 
  open, 
  onOpenChange,
  errorMessage,
  onUpgrade,
  onSettings
}: ApiErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "bg-white/95 backdrop-blur-xl",
        "border-2 border-red-200/40",
        "p-0 gap-0 pb-8"
      )}>
        <AlertDialogHeader>
          <div className={cn(
            "flex flex-col items-center gap-4 p-6",
            "text-red-500 text-center"
          )}>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <AlertDialogTitle className="text-red-600 text-lg">
                {errorMessage.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {errorMessage.description}
              </AlertDialogDescription>
            </div>

            <div className="w-full h-px bg-red-100" />

            <div className="flex flex-col gap-2 w-full mt-4">
              <Button
                variant="outline"
                onClick={onSettings}
                className={cn(
                  "w-full",
                  "text-sm text-gray-700 hover:text-gray-900",
                  "hover:bg-gray-50/50",
                  "border border-gray-300",
                  "h-10",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:shadow-sm"
                )}
              >
                Go to Settings
              </Button>
            </div>

            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className={cn(
                  " text-xs text-gray-700 hover:text-gray-900",
                  "h-7 px-2",
                  "hover:bg-gray-50/50",
                  "transition-colors duration-200 border border-gray-500 bg-gray-200" 
                )}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
} 