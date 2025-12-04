"use client";

import { Profile, WorkExperience, Education, Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  Linkedin,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Upload,
  Save,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ProfileBasicInfoForm } from "@/components/profile/profile-basic-info-form";
import { ProfileWorkExperienceForm } from "@/components/profile/profile-work-experience-form";
import { ProfileProjectsForm } from "@/components/profile/profile-projects-form";
import { ProfileEducationForm } from "@/components/profile/profile-education-form";
import { ProfileSkillsForm } from "@/components/profile/profile-skills-form";
// import { ProfileEditorHeader } from "./profile-editor-header";
import { formatProfileWithAI } from "../../utils/actions/profiles/ai";
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

import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";
import { AlertTriangle } from "lucide-react";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";
import { cn } from "@/lib/utils";

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({
  profile: initialProfile,
}: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTextImportDialogOpen, setIsTextImportDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [textImportContent, setTextImportContent] = useState("");
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [isLinkedInImporting, setIsLinkedInImporting] = useState(false);
  const router = useRouter();

  // Hold the fetched resume content
  const [isFetching, setIsFetching] = useState(false);

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Add useEffect to clear error when dialogs close
  useEffect(() => {
    if (!isResumeDialogOpen && !isTextImportDialogOpen) {
      setApiKeyError("");
    }
  }, [isResumeDialogOpen, isTextImportDialogOpen]);

  const updateField = (field: keyof Profile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile(profile);
      toast.success("Changes saved successfully", {
        position: "bottom-right",
        className:
          "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
      });
      // Force a server revalidation
      router.refresh();
    } catch (error) {
      void error;
      toast.error("Unable to save your changes. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      // Reset to empty profile locally
      const resetProfile = {
        id: profile.id,
        user_id: profile.user_id,
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        location: "",
        website: "",
        linkedin_url: "",
        github_url: "",
        work_experience: [],
        education: [],
        skills: [],
        projects: [],
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };

      // Update local state
      setProfile(resetProfile);

      // Save to database
      await updateProfile(resetProfile);

      toast.success("Profile reset successfully", {
        position: "bottom-right",
        className:
          "bg-gradient-to-r from-[#5b6949]/90 to-indigo-500 text-white border-none",
      });

      // Force a server revalidation
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to reset profile. Please try again.", {
        position: "bottom-right",
      });
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLinkedInImport = () => {
    setIsLinkedInImporting(true);
  };

  const handleFetchLinkedIn = async () => {
    const url = profile.linkedin_url;

    if (!url) {
      return;
    }
    try {
      setIsFetching(true);

      const response = await fetch(
        `/api/linkedin/profile?profileUrl=${url.trim()}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching LinkedIn data: ${response.status}`);
      }
      const fullJson = await response.json();

      const linkedInProfileData = fullJson.data;

      // If you want to show it as formatted JSON in the textarea:
      setResumeContent(JSON.stringify(linkedInProfileData, null, 2));
    } catch (err) {
      console.error(err);
      // Optionally show a toast/snackbar here
    } finally {
      setIsFetching(false);
    }
  };

  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);

      // Get model and API key from local storage
      const MODEL_STORAGE_KEY = "resumelm-default-model";
      const LOCAL_STORAGE_KEY = "resumelm-api-keys";

      const selectedModel =
        localStorage.getItem(MODEL_STORAGE_KEY) || "gpt-4o";
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];

      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error("Error parsing API keys:", error);
      }

      const result = await formatProfileWithAI(content, {
        model: selectedModel,
        apiKeys,
      });

      if (result) {
        // Clean and transform the data to match our database schema
        const cleanedProfile: Partial<Profile> = {
          first_name: result.first_name || null,
          last_name: result.last_name || null,
          email: result.email || null,
          phone_number: result.phone_number || null,
          location: result.location || null,
          website: result.website || null,
          linkedin_url: result.linkedin_url || null,
          github_url: result.github_url || null,
          work_experience: Array.isArray(result.work_experience)
            ? result.work_experience.map((exp: Partial<WorkExperience>) => ({
                company: exp.company || "",
                position: exp.position || "",
                location: exp.location || "",
                date: exp.date || "",
                description: Array.isArray(exp.description)
                  ? exp.description
                  : [exp.description || ""],
                technologies: Array.isArray(exp.technologies)
                  ? exp.technologies
                  : [],
              }))
            : [],
          education: Array.isArray(result.education)
            ? result.education.map((edu: Partial<Education>) => ({
                school: edu.school || "",
                degree: edu.degree || "",
                field: edu.field || "",
                location: edu.location || "",
                date: edu.date || "",
                gpa: edu.gpa ? parseFloat(edu.gpa.toString()) : undefined,
                achievements: Array.isArray(edu.achievements)
                  ? edu.achievements
                  : [],
              }))
            : [],
          skills: Array.isArray(result.skills)
            ? result.skills.map(
                (skill: {
                  category: string;
                  skills?: string[];
                  items?: string[];
                }) => ({
                  category: skill.category || "",
                  items: Array.isArray(skill.skills)
                    ? skill.skills
                    : Array.isArray(skill.items)
                    ? skill.items
                    : [],
                })
              )
            : [],
          projects: Array.isArray(result.projects)
            ? result.projects.map((proj: Partial<Project>) => ({
                name: proj.name || "",
                description: Array.isArray(proj.description)
                  ? proj.description
                  : [proj.description || ""],
                technologies: Array.isArray(proj.technologies)
                  ? proj.technologies
                  : [],
                url: proj.url || undefined,
                github_url: proj.github_url || undefined,
                date: proj.date || "",
              }))
            : [],
        };

        await importResume(cleanedProfile);

        setProfile((prev) => ({
          ...prev,
          ...cleanedProfile,
        }));
        toast.success(
          "Content imported successfully - Don't forget to save your changes",
          {
            position: "bottom-right",
            className:
              "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
          }
        );
        setResumeContent("");
        setTextImportContent("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Resume upload error:", error);
        if (error.message.toLowerCase().includes("api key")) {
          setApiKeyError(
            "API key required. Please add your OpenAI API key in settings or upgrade to our Pro Plan."
          );
        } else {
          toast.error("Failed to process content: " + error.message, {
            position: "bottom-right",
          });
        }
      }
    } finally {
      setIsProcessingResume(false);
      // Close all modals and clear content
      setIsResumeDialogOpen(false);
      setIsTextImportDialogOpen(false);
      setIsLinkedInImporting(false);
      setResumeContent("");
      setTextImportContent("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60"
            )}>
              <User className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                Profile Editor
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                Build and manage your professional profile
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Reset Profile Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                    disabled={isResetting}
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset Profile
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset your profile? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isResetting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      disabled={isResetting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isResetting ? "Resetting..." : "Reset Profile"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Import Actions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5b6949]" />
              <span className="text-sm font-medium text-zinc-700">Import Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LinkedIn Import Button */}
              <Dialog
                open={isLinkedInImporting}
                onOpenChange={setIsLinkedInImporting}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsLinkedInImporting(true)}
                    className="group relative bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-[#5b6949]/30 text-zinc-700 transition-all duration-200 hover:scale-[1.02] h-auto py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5b6949]/10 group-hover:scale-110 transition-transform duration-200">
                        <Linkedin className="h-6 w-6 text-[#5b6949]" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-zinc-900">
                          LinkedIn Import
                        </div>
                        <div className="text-sm text-zinc-600">
                          Sync with your LinkedIn profile
                        </div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-zinc-900">
                      Import From LinkedIn
                    </DialogTitle>
                    <DialogDescription className="text-zinc-600">
                      Enter your LinkedIn profile URL below. Our AI will extract your public profile data and help you populate your resume.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      value={profile.linkedin_url ?? ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          linkedin_url: e.target.value,
                        }))
                      }
                      placeholder="Paste your LinkedIn profile URL here"
                      className="flex-1 bg-white/50 border-zinc-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20 transition-all duration-200"
                    />
                    <Button
                      onClick={handleFetchLinkedIn}
                      disabled={isFetching || !profile.linkedin_url?.trim()}
                      className="whitespace-nowrap bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-all duration-200 disabled:opacity-50"
                    >
                      {isFetching ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Fetching...</span>
                        </div>
                      ) : (
                        <span>Fetch from LinkedIn</span>
                      )}
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Textarea
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                      placeholder="Paste your resume content here..."
                      className="w-full min-h-[120px] bg-white/50 border-zinc-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20 transition-all duration-200"
                    />
                  </div>

                  <DialogFooter className="gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsLinkedInImporting(false)}
                      className="bg-white/50 hover:bg-white/60 border-zinc-200 text-zinc-600 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleResumeUpload(resumeContent)}
                      disabled={isProcessingResume || !resumeContent.trim()}
                      className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-all duration-200"
                    >
                      {isProcessingResume ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Process with AI</span>
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Resume Upload Button */}
              <Dialog
                open={isResumeDialogOpen}
                onOpenChange={setIsResumeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group relative bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-[#5b6949]/30 text-zinc-700 transition-all duration-200 hover:scale-[1.02] h-auto py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5b6949]/10 group-hover:scale-110 transition-transform duration-200">
                        <Upload className="h-6 w-6 text-[#5b6949]" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-zinc-900">
                          Resume Upload
                        </div>
                        <div className="text-sm text-zinc-600">
                          Import from existing resume
                        </div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-zinc-900">
                      Upload Resume Content
                    </DialogTitle>
                    <DialogDescription className="text-zinc-600">
                      Let our AI analyze your resume and enhance your profile by adding new information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                      placeholder="Paste your resume content here..."
                      className="min-h-[100px] bg-white/50 border-zinc-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20 transition-all duration-200"
                    />
                  </div>
                  {apiKeyError && (
                    <div className="px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                      <div className="p-1.5 rounded-full bg-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">API Key Required</p>
                        <p className="text-red-500/90">{apiKeyError}</p>
                        <div className="mt-2 flex flex-col gap-2 justify-start">
                          <div className="w-auto mx-auto">
                            <ProUpgradeButton />
                          </div>
                          <div className="text-center text-xs text-red-400">
                            or
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50/50 w-auto mx-auto"
                            onClick={() =>
                              (window.location.href = "/settings")
                            }
                          >
                            Set API Keys in Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsResumeDialogOpen(false)}
                      className="bg-white/50 hover:bg-white/60 border-zinc-200 text-zinc-600 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleResumeUpload(resumeContent)}
                      disabled={isProcessingResume || !resumeContent.trim()}
                      className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-all duration-200"
                    >
                      {isProcessingResume ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Process with AI</span>
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Import From Text Button */}
              <Dialog
                open={isTextImportDialogOpen}
                onOpenChange={setIsTextImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group relative bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-[#5b6949]/30 text-zinc-700 transition-all duration-200 hover:scale-[1.02] h-auto py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5b6949]/10 group-hover:scale-110 transition-transform duration-200">
                        <Upload className="h-6 w-6 text-[#5b6949]" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-zinc-900">
                          Import From Text
                        </div>
                        <div className="text-sm text-zinc-600">
                          Import from any text content
                        </div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-zinc-900">
                      Import From Text
                    </DialogTitle>
                    <DialogDescription className="text-zinc-600">
                      Paste any text content below (resume, job description, achievements, etc.). Our AI will analyze it and enhance your profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      value={textImportContent}
                      onChange={(e) => setTextImportContent(e.target.value)}
                      placeholder="Paste your text content here..."
                      className="min-h-[100px] bg-white/50 border-zinc-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20 transition-all duration-200"
                    />
                  </div>
                  {apiKeyError && (
                    <div className="px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                      <div className="p-1.5 rounded-full bg-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">API Key Required</p>
                        <p className="text-red-500/90">{apiKeyError}</p>
                        <div className="mt-2 flex flex-col gap-2 justify-start">
                          <div className="w-auto mx-auto">
                            <ProUpgradeButton />
                          </div>
                          <div className="text-center text-xs text-red-400">
                            or
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50/50 w-auto mx-auto"
                            onClick={() =>
                              (window.location.href = "/settings")
                            }
                          >
                            Set API Keys in Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsTextImportDialogOpen(false)}
                      className="bg-white/50 hover:bg-white/60 border-zinc-200 text-zinc-600 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleResumeUpload(textImportContent)}
                      disabled={
                        isProcessingResume || !textImportContent.trim()
                      }
                      className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-all duration-200"
                    >
                      {isProcessingResume ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Process with AI</span>
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-zinc-200/60 rounded-xl shadow-sm">
              <TabsTrigger
                value="basic"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5b6949] data-[state=active]:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-zinc-900"
              >
                <User className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5b6949] data-[state=active]:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-zinc-900"
              >
                <Briefcase className="h-4 w-4" />
                Work Experience
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5b6949] data-[state=active]:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-zinc-900"
              >
                <FolderGit2 className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5b6949] data-[state=active]:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-zinc-900"
              >
                <GraduationCap className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5b6949] data-[state=active]:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-zinc-900"
              >
                <Wrench className="h-4 w-4" />
                Skills
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="basic" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
                  <div className="p-6">
                    <ProfileBasicInfoForm
                      profile={profile}
                      onChange={(field, value) => {
                        if (field in profile) {
                          updateField(field as keyof Profile, value);
                        }
                      }}
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
                  <div className="p-6">
                    <ProfileWorkExperienceForm
                      experiences={profile.work_experience}
                      onChange={(experiences) =>
                        updateField("work_experience", experiences)
                      }
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
                  <div className="p-6">
                    <ProfileProjectsForm
                      projects={profile.projects}
                      onChange={(projects) =>
                        updateField("projects", projects)
                      }
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
                  <div className="p-6">
                    <ProfileEducationForm
                      education={profile.education}
                      onChange={(education) =>
                        updateField("education", education)
                      }
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
                  <div className="p-6">
                    <ProfileSkillsForm
                      skills={profile.skills}
                      onChange={(skills) => updateField("skills", skills)}
                    />
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
