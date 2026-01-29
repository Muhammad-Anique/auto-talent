"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Resume } from "@/lib/types";
import { deleteResume } from "@/utils/actions/resumes/actions";

interface ApplicationKitCardProps {
  resume: Resume;
}

export function ApplicationKitCard({ resume }: ApplicationKitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteResume(resume.id);
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-full group">
      <Link href={`/dashboard/resumes/${resume.id}`} className="block">
        <Card className="w-full p-6 bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-300 hover:shadow-md cursor-pointer">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {resume.name}
                </h3>
                {resume.target_role && (
                  <p className="text-sm text-zinc-600">{resume.target_role}</p>
                )}
                {resume.created_at && (
                  <p className="text-xs text-zinc-500">
                    Created {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "hover:bg-rose-50",
                      "text-zinc-400 hover:text-rose-600",
                      "transition-all duration-300",
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Application Kit</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{resume.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Three Section Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resume Section */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-zinc-600" />
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">Resume</h4>
                    <p className="text-xs text-zinc-500">Tailored resume</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter Section */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-600" />
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">Cover Letter</h4>
                    <p className="text-xs text-zinc-500">Personalized letter</p>
                  </div>
                </div>
              </div>

              {/* Follow-up Email Section */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-zinc-600" />
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">Follow-up Email</h4>
                    <p className="text-xs text-zinc-500">Professional follow-up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
