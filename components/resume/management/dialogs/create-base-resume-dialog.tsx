'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, WorkExperience, Education, Skill, Project, Resume } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Loader2, FileText, Copy, Wand2, Plus, Upload, Users, Target, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBaseResume } from "@/utils/actions/resumes/actions";
import pdfToText from "react-pdftotext";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { convertTextToResume } from "@/utils/actions/resumes/ai";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CreateBaseResumeDialogProps {
  children: React.ReactNode;
  profile: Profile;
}

export function CreateBaseResumeDialog({ children, profile }: CreateBaseResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [importOption, setImportOption] = useState<'import-profile' | 'scratch' | 'import-resume'>('import-profile');
  const [isTargetRoleInvalid, setIsTargetRoleInvalid] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    work_experience: string[];
    education: string[];
    skills: string[];
    projects: string[];
  }>({
    work_experience: [],
    education: [],
    skills: [],
    projects: []
  });
  const [resumeText, setResumeText] = useState('');
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>({
    title: "",
    description: ""
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof selectedItems>('work_experience');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const getItemId = (type: keyof typeof selectedItems, item: WorkExperience | Education | Skill | Project): string => {
    switch (type) {
      case 'work_experience':
        return `${(item as WorkExperience).company}-${(item as WorkExperience).position}-${(item as WorkExperience).date}`;
      case 'projects':
        return (item as Project).name;
      case 'education':
        return `${(item as Education).school}-${(item as Education).degree}-${(item as Education).field}`;
      case 'skills':
        return (item as Skill).category;
      default:
        return '';
    }
  };

  const handleItemSelection = (section: keyof typeof selectedItems, id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: prev[section].includes(id)
        ? prev[section].filter(x => x !== id)
        : [...prev[section], id]
    }));
  };

  const handleSectionSelection = (section: keyof typeof selectedItems, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: checked 
        ? profile[section].map(item => getItemId(section, item))
        : []
    }));
  };

  const isSectionSelected = (section: keyof typeof selectedItems): boolean => {
    const sectionItems = profile[section].map(item => getItemId(section, item));
    return sectionItems.length > 0 && sectionItems.every(id => selectedItems[section].includes(id));
  };

  const isSectionPartiallySelected = (section: keyof typeof selectedItems): boolean => {
    const sectionItems = profile[section].map(item => getItemId(section, item));
    const selectedCount = sectionItems.filter(id => selectedItems[section].includes(id)).length;
    return selectedCount > 0 && selectedCount < sectionItems.length;
  };

  // Pagination functions
  const getCurrentItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: keyof typeof selectedItems) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Pagination Component
  const Pagination = ({ totalPages, currentPage, onPageChange }: { totalPages: number; currentPage: number; onPageChange: (page: number) => void }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 border-zinc-200 hover:border-[#5b6949] hover:bg-zinc-50 text-xs"
        >
          <ChevronLeft className="w-3 h-3" />
          Prev
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="border-zinc-200 hover:border-[#5b6949] hover:bg-zinc-50 text-xs"
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="text-zinc-400 text-xs">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn(
              currentPage === page
                ? "bg-[#5b6949] text-white border-[#5b6949] text-xs"
                : "border-zinc-200 hover:border-[#5b6949] hover:bg-zinc-50 text-xs"
            )}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-zinc-400 text-xs">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="border-zinc-200 hover:border-[#5b6949] hover:bg-zinc-50 text-xs"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 border-zinc-200 hover:border-[#5b6949] hover:bg-zinc-50 text-xs"
        >
          Next
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  const handleCreate = async () => {
    if (!targetRole.trim()) {
      setIsTargetRoleInvalid(true);
      setTimeout(() => setIsTargetRoleInvalid(false), 820);
      toast({
        title: "Required Field Missing",
        description: "Target role is a required field. Please enter your target role.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);

      if (importOption === 'import-resume') {
        if (!resumeText.trim()) {
          return;
        }

        // Create an empty resume to pass to convertTextToResume
        const emptyResume: Resume = {
          id: '',
          user_id: '',
          name: targetRole,
          target_role: targetRole,
          is_base_resume: true,
          first_name: '',
          last_name: '',
          email: '',
          work_experience: [],
          education: [],
          skills: [],
          projects: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_cover_letter: false,
          has_follow_up_email: false
        };

        // Get model and API key from local storage
        const MODEL_STORAGE_KEY = 'resumelm-default-model';
        const LOCAL_STORAGE_KEY = 'resumelm-api-keys';
        const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
        const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
        let apiKeys = [];
        try {
          apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
        } catch (error) {
          console.error('Error parsing API keys:', error);
        }


        try {
          const convertedResume = await convertTextToResume(resumeText, emptyResume, targetRole, {
            model: selectedModel || '',
            apiKeys
          });
          
          // Extract content sections and basic info for createBaseResume
          const selectedContent = {
            // Basic Info
            first_name: convertedResume.first_name || '',
            last_name: convertedResume.last_name || '',
            email: convertedResume.email || '',
            phone_number: convertedResume.phone_number,
            location: convertedResume.location,
            website: convertedResume.website,
            linkedin_url: convertedResume.linkedin_url,
            github_url: convertedResume.github_url,
            
            // Content Sections
            work_experience: convertedResume.work_experience || [],
            education: convertedResume.education || [],
            skills: convertedResume.skills || [],
            projects: convertedResume.projects || [],
          };
          
          const resume = await createBaseResume(
            targetRole,
            'import-resume',
            selectedContent as Resume
          );
          
          toast({
            title: "Success",
            description: "Resume created successfully",
          });

          router.push(`/dashboard/resumes/${resume.id}`);
          setOpen(false);
          return;
        } catch (error: Error | unknown) {
          if (error instanceof Error && (
            error.message.toLowerCase().includes('api key') || 
            error.message.toLowerCase().includes('unauthorized') ||
            error.message.toLowerCase().includes('invalid key') ||
            error.message.toLowerCase().includes('invalid x-api-key')
          )) {
            setErrorMessage({
              title: "API Key Error",
              description: "There was an issue with your API key. Please check your settings and try again."
            });
          } else {
            setErrorMessage({
              title: "Error",
              description: "Failed to convert resume text. Please try again."
            });
          }
          setShowErrorDialog(true);
          setIsCreating(false);
          return;
        }
      }

      const selectedContent = {
        work_experience: profile.work_experience.filter(exp => 
          selectedItems.work_experience.includes(getItemId('work_experience', exp))
        ),
        education: profile.education.filter(edu => 
          selectedItems.education.includes(getItemId('education', edu))
        ),
        skills: profile.skills.filter(skill => 
          selectedItems.skills.includes(getItemId('skills', skill))
        ),
        projects: profile.projects.filter(project => 
          selectedItems.projects.includes(getItemId('projects', project))
        ),
      };


      const resume = await createBaseResume(
        targetRole, 
        importOption === 'scratch' ? 'fresh' : importOption,
        selectedContent
      );



      toast({
        title: "Success",
        description: "Resume created successfully",
      });

      router.push(`/dashboard/resumes/${resume.id}`);
      setOpen(false);
    } catch (error) {
      console.error('Create resume error:', error);
      setErrorMessage({
        title: "Error",
        description: "Failed to create resume. Please try again."
      });
      setShowErrorDialog(true);
    } finally {
      setIsCreating(false);
    }
  };

  // Initialize all items as selected when dialog opens
  const initializeSelectedItems = () => {
    setSelectedItems({
      work_experience: profile.work_experience.map(exp => getItemId('work_experience', exp)),
      education: profile.education.map(edu => getItemId('education', edu)),
      skills: profile.skills.map(skill => getItemId('skills', skill)),
      projects: profile.projects.map(project => getItemId('projects', project))
    });
  };

  // Reset form and initialize selected items when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Move focus back to the trigger when closing
      const trigger = document.querySelector('[data-state="open"]');
      if (trigger) {
        (trigger as HTMLElement).focus();
      }
    }
    setOpen(newOpen);
    if (newOpen) {
      setTargetRole('');
      setImportOption('import-profile');
      initializeSelectedItems();
    }
  };

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
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setResumeText(prev => prev + (prev ? "\n\n" : "") + text);
      } catch {
        toast({
          title: "PDF Processing Error",
          description: "Failed to extract text from the PDF. Please try again or paste the content manually.",
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
        setResumeText(prev => prev + (prev ? "\n\n" : "") + text);
      } catch {
        toast({
          title: "PDF Processing Error",
          description: "Failed to extract text from the PDF. Please try again or paste the content manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto",
        "bg-gradient-to-b backdrop-blur-2xl border-white/40 shadow-2xl",
        "from-zinc-50/95 to-gray-50/90 border-zinc-200/40",
        "rounded-xl"
      )}>
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .shake {
            animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}</style>
        {/* Header Section with Icon */}
        <div className={cn(
          "relative px-8 pt-6 pb-4 border-b top-0 z-10 bg-white/50 backdrop-blur-xl",
          "border-zinc-200/20"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60"
            )}>
              <FileText className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-zinc-950">
                Create Base Resume
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Create a new base resume template that you can use for multiple job applications
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6 space-y-6 bg-gradient-to-b from-zinc-50/30 to-gray-50/30">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label 
                htmlFor="target-role"
                className="text-lg font-medium text-zinc-950"
              >
                Target Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="target-role"
                placeholder="e.g., Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className={cn(
                  "bg-white/80 border-gray-200 h-12 text-base focus:border-[#5b6949] focus:ring-[#5b6949]/20 placeholder:text-gray-400",
                  isTargetRoleInvalid && "border-red-500 shake"
                )}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-zinc-950">
                Resume Content
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="radio"
                    id="import-profile"
                    name="importOption"
                    value="import-profile"
                    checked={importOption === 'import-profile'}
                    onChange={(e) => setImportOption(e.target.value as 'import-profile' | 'scratch' | 'import-resume')}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor="import-profile"
                    className={cn(
                      "flex items-center h-[88px] rounded-lg p-3",
                      "bg-white border shadow-sm",
                      "hover:border-zinc-200 hover:bg-zinc-50/50",
                      "transition-all duration-300 cursor-pointer",
                      "peer-checked:border-[#5b6949] peer-checked:bg-zinc-50",
                      "peer-checked:shadow-md peer-checked:shadow-zinc-100"
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-zinc-50 to-gray-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <Copy className="h-5 w-5 text-[#5b6949]" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-sm text-zinc-950">Import from Profile</div>
                      <span className="text-xs text-gray-600 line-clamp-2">
                        Import your experience and skills
                      </span>
                    </div>
                  </Label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="import-resume"
                    name="importOption"
                    value="import-resume"
                    checked={importOption === 'import-resume'}
                    onChange={(e) => setImportOption(e.target.value as 'import-profile' | 'scratch' | 'import-resume')}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor="import-resume"
                    className={cn(
                      "flex items-center h-[88px] rounded-lg p-3",
                      "bg-white border shadow-sm",
                      "hover:border-zinc-200 hover:bg-zinc-50/50",
                      "transition-all duration-300 cursor-pointer",
                      "peer-checked:border-[#5b6949] peer-checked:bg-zinc-50",
                      "peer-checked:shadow-md peer-checked:shadow-zinc-100"
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-zinc-50 to-gray-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <Plus className="h-5 w-5 text-[#5b6949]" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-sm text-zinc-950">Import from Resume</div>
                      <span className="text-xs text-gray-600 line-clamp-2">
                        Paste your existing resume
                      </span>
                    </div>
                  </Label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="scratch"
                    name="importOption"
                    value="scratch"
                    checked={importOption === 'scratch'}
                    onChange={(e) => setImportOption(e.target.value as 'import-profile' | 'scratch' | 'import-resume')}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor="scratch"
                    className={cn(
                      "flex items-center h-[88px] rounded-lg p-3",
                      "bg-white border shadow-sm",
                      "hover:border-zinc-200 hover:bg-zinc-50/50",
                      "transition-all duration-300 cursor-pointer",
                      "peer-checked:border-[#5b6949] peer-checked:bg-zinc-50",
                      "peer-checked:shadow-md peer-checked:shadow-zinc-100"
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-zinc-50 to-gray-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <Wand2 className="h-5 w-5 text-[#5b6949]" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-sm text-zinc-950">Start Fresh</div>
                      <span className="text-xs text-gray-600 line-clamp-2">
                        Create a blank resume
                      </span>
                    </div>
                  </Label>
                </div>
              </div>

              {importOption === 'import-profile' && (
                <div className="space-y-6">
                  {/* Section Overview Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-white/80 border-zinc-200 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => setActiveTab('work_experience')}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#5b6949]/10 group-hover:bg-[#5b6949]/20 transition-colors">
                          <Users className="w-5 h-5 text-[#5b6949]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-zinc-900">{profile.work_experience.length}</p>
                          <p className="text-sm text-zinc-600">Work Experience</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white/80 border-zinc-200 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => setActiveTab('education')}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#5b6949]/10 group-hover:bg-[#5b6949]/20 transition-colors">
                          <FileText className="w-5 h-5 text-[#5b6949]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-zinc-900">{profile.education.length}</p>
                          <p className="text-sm text-zinc-600">Education</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white/80 border-zinc-200 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => setActiveTab('skills')}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#5b6949]/10 group-hover:bg-[#5b6949]/20 transition-colors">
                          <Target className="w-5 h-5 text-[#5b6949]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-zinc-900">{profile.skills.length}</p>
                          <p className="text-sm text-zinc-600">Skills</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white/80 border-zinc-200 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => setActiveTab('projects')}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#5b6949]/10 group-hover:bg-[#5b6949]/20 transition-colors">
                          <Brain className="w-5 h-5 text-[#5b6949]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-zinc-900">{profile.projects.length}</p>
                          <p className="text-sm text-zinc-600">Projects</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Tabbed Interface */}
                  <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as keyof typeof selectedItems)}>
                    <TabsList className="grid w-full grid-cols-4 bg-white/80 border border-zinc-200 p-1 rounded-xl">
                      <TabsTrigger 
                        value="work_experience" 
                        className="data-[state=active]:bg-[#5b6949] data-[state=active]:text-white rounded-lg transition-all duration-300"
                      >
                        Work Experience
                      </TabsTrigger>
                      <TabsTrigger 
                        value="education" 
                        className="data-[state=active]:bg-[#5b6949] data-[state=active]:text-white rounded-lg transition-all duration-300"
                      >
                        Education
                      </TabsTrigger>
                      <TabsTrigger 
                        value="skills" 
                        className="data-[state=active]:bg-[#5b6949] data-[state=active]:text-white rounded-lg transition-all duration-300"
                      >
                        Skills
                      </TabsTrigger>
                      <TabsTrigger 
                        value="projects" 
                        className="data-[state=active]:bg-[#5b6949] data-[state=active]:text-white rounded-lg transition-all duration-300"
                      >
                        Projects
                      </TabsTrigger>
                    </TabsList>

                    {/* Work Experience Tab */}
                    <TabsContent value="work_experience" className="mt-6">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#5b6949]/10">
                              <Users className="w-5 h-5 text-[#5b6949]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-900">Work Experience</h3>
                              <p className="text-sm text-zinc-600">Select positions to include in your resume</p>
                            </div>
                          </div>
                          <Checkbox
                            id="work-experience-section"
                            checked={isSectionSelected('work_experience')}
                            onCheckedChange={(checked) => handleSectionSelection('work_experience', checked as boolean)}
                            className={cn(
                              "mt-0.5",
                              isSectionPartiallySelected('work_experience') && "data-[state=checked]:bg-[#5b6949]/50"
                            )}
                          />
                            </div>
                        
                        <div className="space-y-3">
                          {getCurrentItems(profile.work_experience).map((exp: WorkExperience, index: number) => {
                              const id = getItemId('work_experience', exp);
                              return (
                              <Card key={id} className="p-4 bg-white/80 border-zinc-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={id}
                                    checked={selectedItems.work_experience.includes(id)}
                                    onCheckedChange={() => handleItemSelection('work_experience', id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 cursor-pointer" onClick={() => handleItemSelection('work_experience', id)}>
                                    <div className="flex items-baseline justify-between mb-2">
                                      <h4 className="font-semibold text-zinc-900">{exp.position}</h4>
                                      <span className="text-sm text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{exp.date}</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 mb-2">{exp.company}</p>
                                    {exp.description && (
                                      <p className="text-xs text-zinc-500 line-clamp-2">{exp.description}</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                              );
                            })}
                          </div>
                        <Pagination 
                          totalPages={getTotalPages(profile.work_experience)}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#5b6949]/10">
                              <FileText className="w-5 h-5 text-[#5b6949]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-900">Education</h3>
                              <p className="text-sm text-zinc-600">Select educational background to include</p>
                            </div>
                          </div>
                          <Checkbox
                            id="education-section"
                            checked={isSectionSelected('education')}
                            onCheckedChange={(checked) => handleSectionSelection('education', checked as boolean)}
                            className={cn(
                              "mt-0.5",
                              isSectionPartiallySelected('education') && "data-[state=checked]:bg-[#5b6949]/50"
                            )}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          {getCurrentItems(profile.education).map((edu: Education, index: number) => {
                            const id = getItemId('education', edu);
                            return (
                              <Card key={id} className="p-4 bg-white/80 border-zinc-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={id}
                                    checked={selectedItems.education.includes(id)}
                                    onCheckedChange={() => handleItemSelection('education', id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 cursor-pointer" onClick={() => handleItemSelection('education', id)}>
                                    <div className="flex items-baseline justify-between mb-2">
                                      <h4 className="font-semibold text-zinc-900">{`${edu.degree} in ${edu.field}`}</h4>
                                      <span className="text-sm text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{edu.date}</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 mb-2">{edu.school}</p>
                                    {edu.gpa && (
                                      <p className="text-xs text-zinc-500">GPA: {edu.gpa}</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                        <Pagination 
                          totalPages={getTotalPages(profile.education)}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#5b6949]/10">
                              <Target className="w-5 h-5 text-[#5b6949]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-900">Skills</h3>
                              <p className="text-sm text-zinc-600">Select skill categories to include</p>
                            </div>
                          </div>
                          <Checkbox
                            id="skills-section"
                            checked={isSectionSelected('skills')}
                            onCheckedChange={(checked) => handleSectionSelection('skills', checked as boolean)}
                            className={cn(
                              "mt-0.5",
                              isSectionPartiallySelected('skills') && "data-[state=checked]:bg-[#5b6949]/50"
                            )}
                          />
                            </div>
                        
                        <div className="space-y-3">
                          {getCurrentItems(profile.skills).map((skill: Skill, index: number) => {
                              const id = getItemId('skills', skill);
                              return (
                              <Card key={id} className="p-4 bg-white/80 border-zinc-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={id}
                                    checked={selectedItems.skills.includes(id)}
                                    onCheckedChange={() => handleItemSelection('skills', id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 cursor-pointer" onClick={() => handleItemSelection('skills', id)}>
                                    <h4 className="font-semibold text-zinc-900 mb-3">{skill.category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {skill.items.map((item: string, skillIndex: number) => (
                                        <Badge
                                          key={skillIndex}
                                          variant="secondary"
                                          className="bg-[#5b6949]/10 text-[#5b6949] border border-[#5b6949]/20 text-xs px-1.5 py-0"
                                        >
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                              );
                            })}
                          </div>
                        <Pagination 
                          totalPages={getTotalPages(profile.skills)}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                  </div>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="mt-6">
                  <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#5b6949]/10">
                              <Brain className="w-5 h-5 text-[#5b6949]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-900">Projects</h3>
                              <p className="text-sm text-zinc-600">Select projects to showcase</p>
                            </div>
                          </div>
                          <Checkbox
                            id="projects-section"
                            checked={isSectionSelected('projects')}
                            onCheckedChange={(checked) => handleSectionSelection('projects', checked as boolean)}
                            className={cn(
                              "mt-0.5",
                              isSectionPartiallySelected('projects') && "data-[state=checked]:bg-[#5b6949]/50"
                            )}
                          />
                            </div>
                        
                        <div className="space-y-3">
                          {getCurrentItems(profile.projects).map((project: Project, index: number) => {
                              const id = getItemId('projects', project);
                              return (
                              <Card key={id} className="p-4 bg-white/80 border-zinc-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={id}
                                    checked={selectedItems.projects.includes(id)}
                                    onCheckedChange={() => handleItemSelection('projects', id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 cursor-pointer" onClick={() => handleItemSelection('projects', id)}>
                                    <div className="flex items-baseline justify-between mb-2">
                                      <h4 className="font-semibold text-zinc-900">{project.name}</h4>
                                      {project.date && (
                                        <span className="text-sm text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{project.date}</span>
                                      )}
                                    </div>
                                    {project.description && (
                                      <p className="text-sm text-zinc-600 mb-2 line-clamp-2">{project.description}</p>
                                    )}
                                    {project.technologies && (
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech: string, techIndex: number) => (
                                          <Badge
                                            key={techIndex}
                                            variant="secondary"
                                            className="bg-[#5b6949]/10 text-[#5b6949] border border-[#5b6949]/20 text-xs px-1.5 py-0"
                                          >
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                              );
                            })}
                          </div>
                        <Pagination 
                          totalPages={getTotalPages(profile.projects)}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                            </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {importOption === 'import-resume' && (
                <div className="space-y-4">
                  <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer group",
                      isDragging
                        ? "border-[#5b6949] bg-zinc-50/50"
                        : "border-gray-200 hover:border-[#5b6949]/50 hover:bg-zinc-50/10"
                    )}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileInput}
                    />
                    <Upload className="w-10 h-10 text-[#5b6949] group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Drop your PDF resume here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute -top-3 left-3 bg-white px-2 text-sm text-muted-foreground">
                      Or paste your resume text here
                    </div>
                    <Textarea
                      id="resume-text"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Start pasting your resume content here..."
                      className="min-h-[200px] bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20 pt-4"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Dialog */}
        <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorMessage={errorMessage}
        onUpgrade={() => {
          setShowErrorDialog(false);
          window.location.href = '/subscription';
        }}
        onSettings={() => {
          setShowErrorDialog(false);
          window.location.href = '/settings';
        }}
      />

        {/* Footer Section */}
        <div className={cn(
          "px-8 py-4 border-t sticky bottom-0 z-10 bg-white/50 backdrop-blur-xl",
          "border-zinc-200/20 bg-white/40"
        )}>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className={cn(
                "border-gray-200 text-gray-600",
                "hover:bg-white/60",
                "hover:border-zinc-200"
              )}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80 hover:from-[#5b6949]/90 hover:to-[#5b6949]/70"
              )}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Resume'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 