'use client';

import { Resume } from "@/lib/types";
import { Logo } from "@/components/ui/logo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ResumeEditorHeaderProps {
  resume: Resume;
  hasUnsavedChanges: boolean;
}

export function ResumeEditorHeader({
  resume,
  hasUnsavedChanges,
}: ResumeEditorHeaderProps) {
  const router = useRouter();
  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleBackClick = () => {
    if (!hasUnsavedChanges) {
      router.push('/');
    }
  };

  // Dynamic color classes based on resume type
  const colors = resume.is_base_resume ? {
    gradient: "from-purple-600 via-purple-500 to-indigo-600",
    border: "border-purple-200/50",
    background: "from-purple-50/95 via-white/95 to-purple-50/95",
    shadow: "shadow-purple-500/10",
    text: "text-purple-600",
    hover: "hover:text-purple-600",
    textOpacity: "text-purple-600/60",
    gradientOverlay: "#f3e8ff30",
  } : {
    gradient: "from-[#5b6949] via-[#6b7a56] to-[#5b6949]",
    border: "border-zinc-200/50",
    background: "from-zinc-50/95 via-white/95 to-zinc-50/95",
    shadow: "shadow-zinc-500/10",
    text: "text-[#5b6949]",
    hover: "hover:text-[#5b6949]",
    textOpacity: "text-zinc-600/60",
    gradientOverlay: "#e5e7eb30",
  };

  return (
    <div className={cn(
      "h-20 border-b backdrop-blur-xl fixed left-0 right-0 z-40 shadow-lg",
      colors.border,
      `bg-gradient-to-r ${colors.background}`,
      colors.shadow
    )}>
      {/* Gradient Overlays */}
      <div className={cn(
        "absolute inset-0",
        `bg-[linear-gradient(to_right,${colors.gradientOverlay}_0%,#ffffff40_50%,${colors.gradientOverlay}_100%)]`,
        "pointer-events-none"
      )} />
      <div className={cn(
        "absolute inset-0",
        `bg-[radial-gradient(circle_800px_at_50%_-40%,${colors.gradientOverlay}_0%,transparent_100%)]`,
        "pointer-events-none"
      )} />
      <div className={cn(
        "absolute inset-0",
        `bg-[radial-gradient(circle_600px_at_100%_100%,${colors.gradientOverlay}_0%,transparent_100%)]`,
        "pointer-events-none"
      )} />
      
      {/* Content Container */}
      <div className="max-w-[2000px] mx-auto h-full px-6 flex items-center justify-between relative">
        {/* Left Section - Logo, Title  */}
        <div className="flex items-center gap-6">
          {hasUnsavedChanges ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <Logo className="text-xl cursor-pointer" asLink={false} />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push('/')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div onClick={handleBackClick}>
              <Logo className="text-xl cursor-pointer" asLink={false} />
            </div>
          )}
          <div className="h-8 w-px bg-purple-200/50 hidden sm:block" />
          <div className="flex flex-col justify-center gap-1">
            {/* Resume Title Section */}
            <div className="flex flex-col ">
              <h1 className="text-xl font-semibold">
                <span className={cn(
                  "bg-gradient-to-r bg-clip-text text-transparent",
                  colors.gradient
                )}>
                  {resume.is_base_resume ? capitalizeWords(resume.target_role) : resume.name}
                </span>
              </h1>
              <div className={cn("flex text-sm", colors.textOpacity)}>
                {resume.is_base_resume ? (
                  <div className="flex items-center">
                    <span className="text-xs font-medium">Base Resume</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Tailored Resume</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 