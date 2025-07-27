"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, Info, Linkedin, User, FileText, UploadCloud, Settings, Search, Shield, Monitor } from "lucide-react";

const stepLabels = [
  "Welcome",
  "Personal Information",
  "Resume Selection",
  "Application Questions",
  "Search Preferences",
  "Review & Submit"
];

const operatingSystems = ["Windows", "Linux", "macOS"];
const workAuthOptions = ["US Citizen", "Permanent Resident", "Visa Holder", "Other"];
const educationLevels = ["High School", "Associate", "Bachelor", "Master", "Doctorate", "Other"];
const experienceLevels = ["Entry", "Mid", "Senior", "Executive"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const yesNoOptions = ["Yes", "No"];

export default function AutoApplyForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    currentJobTitle: "",
    currentCompany: "",
    currentSalary: "",
    desiredSalary: "",
    noticePeriod: "",
    workAuth: "",
    educationLevel: "",
    fieldOfStudy: "",
    graduationYear: "",
    linkedinUrl: "",
    website: "",
    githubUrl: "",
    skills: [] as Array<{
      items: string[];
      category: string;
    }>,
    workExperience: [] as Array<{
      date: string;
      company: string;
      location: string;
      position: string;
      description: string[];
      technologies: string[];
    }>,
    education: [] as Array<{
      gpa: number;
      date: string;
      field: string;
      degree: string;
      school: string;
      location: string;
      achievements: string[];
    }>,
    projects: "",
    certifications: "",
    
    // Resume Selection
    selectedResumeId: "",
    uploadedResume: null as File | null,
    
    // Application Questions
    resumePath: "",
    legallyAuthorized: "",
    requireSponsorship: "",
    currentLocation: "",
    yearsExperience: "",
    expectedSalary: "",
    startDate: "",
    interestReason: "",
    keySkills: "",
    disabilities: "",
    gender: "",
    race: "",
    veteran: "",
    useAI: false,
    
    // Search Preferences
    searchTerms: "",
    randomizeSearch: false,
    searchLocation: "",
    experienceLevel: "",

    salaryRange: "",
    targetExperience: "",
    preferredJobTypes: [] as string[],
    industries: "",
    blacklistedCompanies: "",
    whitelistedCompanies: "",
    skipKeywords: "",
    prioritizeKeywords: "",
    skipSecurityClearance: false,
    followCompanies: false,
    
    // Additional
    resumeReady: false,
    useWebUI: true,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const router = useRouter();
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initSupabase();
  }, []);

  // Auto-fill personal information from all tables
  const loadProfileData = async () => {
    if (!supabaseClient) {
      console.log('Supabase client not ready');
      return;
    }

    setLoadingProfile(true);
    try {
      // Get current user from Supabase auth
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (error) {
        console.error('Auth error:', error);
        return;
      }

      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      console.log('Current user ID:', user.id);
      console.log('Current user email:', user.email);

      // Fetch data from profiles table using user ID
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      } else {
        console.log('Profile data found:', profile);
      }

      // Fetch data from users table using user ID
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
      } else {
        console.log('User data found:', userData);
      }

      // Build form data starting with auth user email
      let formData: any = {
        email: user.email || "",
      };

      // Add profile data if available
      if (profile) {
        formData = {
          ...formData,
          fullName: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          phone: profile.phone_number || "",
          email: profile.email || formData.email,
          address: profile.location || "",
          city: profile.location || "",
          state: "",
          country: "",
          zipCode: "",
          currentJobTitle: "",
          currentCompany: "",
          currentSalary: "",
          desiredSalary: "",
          noticePeriod: "",
          workAuth: "",
          educationLevel: profile.education || "",
          fieldOfStudy: "",
          graduationYear: "",
          linkedinUrl: profile.linkedin_url || "",
          website: profile.website || "",
          githubUrl: profile.github_url || "",
          skills: Array.isArray(profile.skills) ? profile.skills : (profile.skills ? [profile.skills] : []),
          workExperience: Array.isArray(profile.work_experience) ? profile.work_experience : (profile.work_experience ? [profile.work_experience] : []),
          education: Array.isArray(profile.education) ? profile.education : (profile.education ? [profile.education] : []),
          projects: profile.projects || "",
          certifications: profile.certifications || "",
        };
      }

      // Override with user table data if available
      if (userData) {
        formData = {
          ...formData,
          email: userData.email || formData.email,
        };
      }

      console.log('Final form data to be set:', formData);

      // Update form state
      setForm(prev => {
        const newForm = { ...prev, ...formData };
        console.log('Updated form state:', newForm);
        return newForm;
      });
      
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Load user resumes with enhanced data from resumes table
  const loadUserResumes = async () => {
    if (!supabaseClient) {
      console.log('Supabase client not ready');
      return;
    }

    setLoadingResumes(true);
    try {
      // Get current user from Supabase auth
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (error) {
        console.error('Auth error in resume loading:', error);
        return;
      }

      if (!user) {
        console.log('No authenticated user found for resume loading');
        return;
      }

      console.log('Loading resumes for user ID:', user.id);

      // Fetch resumes using user ID
      const { data: resumes, error: resumeError } = await supabaseClient
        .from('resumes')
        .select('*')
        .eq('user_id', user.id);
      
      if (resumeError) {
        console.error('Resume fetch error:', resumeError);
        return;
      }

      console.log('Resumes found:', resumes);
      
      if (resumes && resumes.length > 0) {
        setUserResumes(resumes);
        
        // Auto-fill form with data from the most recent resume
        const latestResume = resumes.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        console.log('Latest resume:', latestResume);
        
        // Only fill fields that are empty
        setForm(prev => ({
          ...prev,
          firstName: prev.firstName|| "",
          lastName: prev.lastName || "",
          phone: prev.phone || latestResume.phone_number || "",
          email: prev.email || latestResume.email || "",
          address: prev.address || latestResume.location || "",
          city: prev.city || latestResume.location || "",
          linkedinUrl: prev.linkedinUrl || latestResume.linkedin_url || "",
          website: prev.website || latestResume.website || "",
          githubUrl: prev.githubUrl || latestResume.github_url || "",
          skills: prev.skills.length > 0 ? prev.skills : (Array.isArray(latestResume.skills) ? latestResume.skills : (latestResume.skills ? [latestResume.skills] : [])),
          workExperience: prev.workExperience.length > 0 ? prev.workExperience : (Array.isArray(latestResume.work_experience) ? latestResume.work_experience : (latestResume.work_experience ? [latestResume.work_experience] : [])),
          education: prev.education || latestResume.education || "",
          projects: prev.projects || latestResume.projects || "",
          certifications: prev.certifications || latestResume.certifications || "",
        }));
      } else {
        console.log('No resumes found for user');
        setUserResumes([]);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  // Load profile data and resumes when supabaseClient is ready
  useEffect(() => {
    if (supabaseClient) {
      loadProfileData();
      loadUserResumes();
    }
  }, [supabaseClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value === "Yes" }));
  };

  const handleMultiSelect = (name: keyof typeof form, value: string) => {
    setForm(prev => {
      const current = prev[name] as string[];
      if (Array.isArray(current)) {
        const updated = current.includes(value) 
          ? current.filter(item => item !== value)
          : [...current, value];
        return { ...prev, [name]: updated };
      }
      return prev;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNext = () => {
    setError("");
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) {
      setError("Supabase client not ready");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Prepare form data for database
      const formData = {
        user_id: user.id,
        form_id: crypto.randomUUID(), // Generate unique form ID
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        zip_code: form.zipCode,
        current_job_title: form.currentJobTitle,
        current_company: form.currentCompany,
        current_salary: form.currentSalary,
        desired_salary: form.desiredSalary,
        notice_period: form.noticePeriod,
        work_auth: form.workAuth,
        field_of_study: form.fieldOfStudy,
        graduation_year: form.graduationYear,
        linkedin_url: form.linkedinUrl,
        website: form.website,
        github_url: form.githubUrl,
        selected_resume_id: form.selectedResumeId || null,
        uploaded_resume_path: form.uploadedResume ? form.uploadedResume.name : null,
        legally_authorized: form.legallyAuthorized,
        require_sponsorship: form.requireSponsorship,
        current_location: form.currentLocation,
        years_experience: form.yearsExperience,
        expected_salary: form.expectedSalary,
        start_date: form.startDate,
        interest_reason: form.interestReason,
        key_skills: form.keySkills,
        disabilities: form.disabilities,
        gender: form.gender,
        race: form.race,
        veteran: form.veteran,
        search_terms: form.searchTerms,
        randomize_search: form.randomizeSearch,
        search_location: form.searchLocation,
        experience_level: form.experienceLevel,
        salary_range: form.salaryRange,
        target_experience: form.targetExperience,
        preferred_job_types: form.preferredJobTypes,
        industries: form.industries,
        blacklisted_companies: form.blacklistedCompanies,
        whitelisted_companies: form.whitelistedCompanies,
        skip_keywords: form.skipKeywords,
        prioritize_keywords: form.prioritizeKeywords,
        skip_security_clearance: form.skipSecurityClearance,
        follow_companies: form.followCompanies,
        resume_ready: form.resumeReady,
        use_web_ui: form.useWebUI,
        skills: form.skills,
        work_experience: form.workExperience,
        education: form.education,
        projects: form.projects,
        certifications: form.certifications
      };

      console.log('Submitting form data:', formData);

      // Insert into database
      const { error: dbErr } = await supabaseClient
        .from("auto_apply_configs")
        .insert([formData]);

      if (dbErr) {
        console.error('Database error:', dbErr);
        throw dbErr;
      }

      setSuccess("Configuration saved successfully!");
      setTimeout(() => router.push("/dashboard/auto-apply"), 1500);
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to Auto-Apply Setup</h2>
            <p className="text-muted-foreground">
              We'll guide you through configuring your automated job application system. 
              This will take about 10-15 minutes to complete all sections.
            </p>
            <Button onClick={handleNext} size="lg">Get Started</Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
              {loadingProfile && <span className="text-sm text-muted-foreground">Loading profile data...</span>}
              {!loadingProfile && (
                <span className="text-sm text-green-600">
                  ✓ Data loaded from Supabase tables
                </span>
              )}
            </div>
            

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile URL *</Label>
                <Input id="linkedinUrl" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={form.website} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" value={form.githubUrl} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input id="state" name="state" value={form.state} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={form.country} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="currentJobTitle">Current Job Title</Label>
                <Input id="currentJobTitle" name="currentJobTitle" value={form.currentJobTitle} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input id="currentCompany" name="currentCompany" value={form.currentCompany} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="currentSalary">Current Salary</Label>
                <Input id="currentSalary" name="currentSalary" value={form.currentSalary} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="desiredSalary">Desired Salary *</Label>
                <Input id="desiredSalary" name="desiredSalary" value={form.desiredSalary} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="noticePeriod">Notice Period (days)</Label>
                <Input id="noticePeriod" name="noticePeriod" value={form.noticePeriod} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="workAuth">Work Authorization *</Label>
                <select name="workAuth" value={form.workAuth} onChange={handleSelectChange} className="w-full p-2 border rounded" required>
                  <option value="">Select Status</option>
                  {workAuthOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="educationLevel">Highest Education Level *</Label>
                <select name="educationLevel" value={form.educationLevel} onChange={handleSelectChange} className="w-full p-2 border rounded" required>
                  <option value="">Select Level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input id="fieldOfStudy" name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input id="graduationYear" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label>Skills</Label>
                <div className="space-y-4">
                  {form.skills.map((skillGroup, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Skill Category {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSkills = form.skills.filter((_, i) => i !== index);
                            setForm(prev => ({ ...prev, skills: newSkills }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={skillGroup.category || ""}
                            onChange={(e) => {
                              const newSkills = [...form.skills];
                              newSkills[index] = { ...newSkills[index], category: e.target.value };
                              setForm(prev => ({ ...prev, skills: newSkills }));
                            }}
                            placeholder="Technical Skills"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Skills (comma separated)</Label>
                          <Textarea
                            value={skillGroup.items?.join(", ") || ""}
                            onChange={(e) => {
                              const newSkills = [...form.skills];
                              newSkills[index] = { 
                                ...newSkills[index], 
                                items: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                              };
                              setForm(prev => ({ ...prev, skills: newSkills }));
                            }}
                            placeholder="JavaScript, React, Node.js"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        skills: [...prev.skills, { items: [], category: "" }]
                      }));
                    }}
                  >
                    + Add Skill Category
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label>Work Experience</Label>
                <div className="space-y-4">
                  {form.workExperience.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newExp = form.workExperience.filter((_, i) => i !== index);
                            setForm(prev => ({ ...prev, workExperience: newExp }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={exp.position || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { ...newExp[index], position: e.target.value };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { ...newExp[index], company: e.target.value };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div>
                          <Label>Date Range</Label>
                          <Input
                            value={exp.date || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { ...newExp[index], date: e.target.value };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="May 2025 - Present"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={exp.location || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { ...newExp[index], location: e.target.value };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="Bangkok, Thailand"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description (one per line)</Label>
                          <Textarea
                            value={exp.description?.join("\n") || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { 
                                ...newExp[index], 
                                description: e.target.value.split("\n").filter(s => s.trim())
                              };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="Describe your role and achievements"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Technologies (comma separated)</Label>
                          <Input
                            value={exp.technologies?.join(", ") || ""}
                            onChange={(e) => {
                              const newExp = [...form.workExperience];
                              newExp[index] = { 
                                ...newExp[index], 
                                technologies: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                              };
                              setForm(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            placeholder="React, Node.js, TypeScript"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        workExperience: [
                          ...prev.workExperience,
                          { date: "", company: "", location: "", position: "", description: [], technologies: [] }
                        ]
                      }));
                    }}
                  >
                    + Add Work Experience
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label>Education</Label>
                <div className="space-y-4">
                  {form.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newEdu = form.education.filter((_, i) => i !== index);
                            setForm(prev => ({ ...prev, education: newEdu }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], degree: e.target.value };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Bachelor's degree"
                          />
                        </div>
                        <div>
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], field: e.target.value };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Computer Science"
                          />
                        </div>
                        <div>
                          <Label>School</Label>
                          <Input
                            value={edu.school || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], school: e.target.value };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <Label>Date Range</Label>
                          <Input
                            value={edu.date || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], date: e.target.value };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="2020 - 2024"
                          />
                        </div>
                        <div>
                          <Label>GPA</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={edu.gpa || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], gpa: parseFloat(e.target.value) || 0 };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="3.78"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={edu.location || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { ...newEdu[index], location: e.target.value };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Achievements (one per line)</Label>
                          <Textarea
                            value={edu.achievements?.join("\n") || ""}
                            onChange={(e) => {
                              const newEdu = [...form.education];
                              newEdu[index] = { 
                                ...newEdu[index], 
                                achievements: e.target.value.split("\n").filter(s => s.trim())
                              };
                              setForm(prev => ({ ...prev, education: newEdu }));
                            }}
                            placeholder="Dean's List, Honor Society, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        education: [
                          ...prev.education,
                          { gpa: 0, date: "", field: "", degree: "", school: "", location: "", achievements: [] }
                        ]
                      }));
                    }}
                  >
                    + Add Education
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea id="projects" name="projects" value={form.projects} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea id="certifications" name="certifications" value={form.certifications} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Resume Selection</h3>
              {loadingResumes && <span className="text-sm text-muted-foreground">Loading resumes...</span>}
            </div>
            
            <div className="space-y-6">
              {/* Existing Resumes */}
              <div>
                <Label className="text-base font-medium mb-3 block">Select from your existing resumes:</Label>
                {userResumes.length > 0 ? (
                  <div className="space-y-3">
                    {userResumes.map((resume) => (
                      <div key={resume.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="selectedResumeId"
                          value={resume.id}
                          checked={form.selectedResumeId === resume.id}
                          onChange={() => setForm(prev => ({ ...prev, selectedResumeId: resume.id }))}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{resume.resume_title || resume.name || `Resume ${resume.id}`}</div>
                          <div className="text-sm text-gray-500">
                            {resume.target_role && `Target: ${resume.target_role}`}
                            {resume.is_base_resume && " (Base Resume)"}
                          </div>
                          <div className="text-xs text-gray-400">
                            Created: {new Date(resume.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No resumes found. Please upload a resume below.</p>
                  </div>
                )}
              </div>

              {/* Upload New Resume */}
              <div className="border-t pt-6">
                <Label className="text-base font-medium mb-3 block">Or upload a new resume:</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    name="uploadedResume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-gray-400">
                      PDF, DOC, or DOCX (max 10MB)
                    </div>
                  </label>
                  {form.uploadedResume && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ {form.uploadedResume.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Application Questions</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="legallyAuthorized">Are you legally authorized to work?</Label>
                <div className="flex gap-4 mt-2">
                  {yesNoOptions.map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input type="radio" name="legallyAuthorized" value={option} onChange={() => setForm(prev => ({ ...prev, legallyAuthorized: option }))} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requireSponsorship">Do you require sponsorship?</Label>
                <div className="flex gap-4 mt-2">
                  {yesNoOptions.map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input type="radio" name="requireSponsorship" value={option} onChange={() => setForm(prev => ({ ...prev, requireSponsorship: option }))} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of experience</Label>
                <Input id="yearsExperience" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="expectedSalary">Expected salary</Label>
                <Input id="expectedSalary" name="expectedSalary" value={form.expectedSalary} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="startDate">When can you start?</Label>
                <Input id="startDate" name="startDate" value={form.startDate} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="interestReason">Why are you interested in this position?</Label>
                <Textarea id="interestReason" name="interestReason" value={form.interestReason} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="keySkills">Key skills</Label>
                <Textarea id="keySkills" name="keySkills" value={form.keySkills} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Search Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="searchTerms">Job search terms *</Label>
                <Input id="searchTerms" name="searchTerms" value={form.searchTerms} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="searchLocation">Preferred search location *</Label>
                <Input id="searchLocation" name="searchLocation" value={form.searchLocation} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="experienceLevel">Current experience level (years)</Label>
                <Input id="experienceLevel" name="experienceLevel" value={form.experienceLevel} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="salaryRange">Salary range</Label>
                <Input id="salaryRange" name="salaryRange" value={form.salaryRange} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="targetExperience">Target experience level</Label>
                <select name="targetExperience" value={form.targetExperience} onChange={handleSelectChange} className="w-full p-2 border rounded">
                  <option value="">Select Level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Preferred job types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={form.preferredJobTypes.includes(type)}
                        onChange={() => handleMultiSelect('preferredJobTypes', type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="industries">Industries of interest</Label>
                <Textarea id="industries" name="industries" value={form.industries} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="blacklistedCompanies">Companies to avoid</Label>
                <Textarea id="blacklistedCompanies" name="blacklistedCompanies" value={form.blacklistedCompanies} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="whitelistedCompanies">Companies to prioritize</Label>
                <Textarea id="whitelistedCompanies" name="whitelistedCompanies" value={form.whitelistedCompanies} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="skipKeywords">Keywords to skip jobs</Label>
                <Textarea id="skipKeywords" name="skipKeywords" value={form.skipKeywords} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="prioritizeKeywords">Keywords to prioritize jobs</Label>
                <Textarea id="prioritizeKeywords" name="prioritizeKeywords" value={form.prioritizeKeywords} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Review & Submit</h3>
              <p className="text-muted-foreground">Please review your configuration before submitting.</p>
            </div>
            
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            {success && <div className="text-emerald-600 text-sm font-medium">{success}</div>}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {form.firstName} {form.lastName}</div>
                <div><strong>Email:</strong> {form.email}</div>
                <div><strong>Location:</strong> {form.searchLocation}</div>
                <div><strong>Job Terms:</strong> {form.searchTerms}</div>
                <div><strong>Selected Resume:</strong> {form.selectedResumeId ? `Resume ${form.selectedResumeId}` : form.uploadedResume?.name || 'None'}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {step + 1} of {stepLabels.length}</span>
            <span className="text-sm text-muted-foreground">{stepLabels[step]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg border-2 border-primary/10">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
          
          <CardFooter className="flex justify-between p-6 pt-0">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step < stepLabels.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Configuration"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 