"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CheckCircle2, Info, Linkedin, User, FileText, UploadCloud } from "lucide-react";

const stepLabels = [
  "Welcome",
  "Disclaimer",
  "Full Name",
  "LinkedIn",
  "Contact",
  "Date of Birth",
  "Demographics & Legal Info",
  "Race/Ethnicity",
  "Education",
  "Job Titles",
  "Preferences",
  "Upload Image",
  "Upload Resume",
  "Review & Submit"
];

const genderOptions = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
  "Self-describe"
];
const disabilityOptions = ["Yes", "No", "Prefer not to say"];
const veteranOptions = ["Yes", "No", "Prefer not to say"];
const workAuthOptions = [
  "US Citizen",
  "Permanent Resident",
  "Visa Holder",
  "Other"
];
const raceOptions = [
  "White",
  "Black/African American",
  "Asian",
  "Hispanic/Latino",
  "Native American",
  "Pacific Islander",
  "Two or more",
  "Prefer not to say"
];
const educationOptions = [
  "High School",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
  "Other"
];

export default function AutoApplyForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    linkedin: "",
    phone: "",
    address: "",
    dob: "",
    demographics: "",
    race: "",
    education: "",
    jobTitles: ["", "", ""],
    workArea: "",
    minSalary: "",
    targetLocation: "",
    image: null as File | null,
    resume: null as File | null,
  });
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobTitleChange = (idx: number, value: string) => {
    setForm((prev) => {
      const jobTitles = [...prev.jobTitles];
      jobTitles[idx] = value;
      return { ...prev, jobTitles };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNext = () => {
    setError("");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // Upload image and resume to Supabase Storage
      let imageUrl = "";
      let resumeUrl = "";
      if (form.image) {
        const { data, error: imgErr } = await supabase.storage.from("auto-apply").upload(`images/${Date.now()}_${form.image.name}`, form.image);
        if (imgErr) throw imgErr;
        imageUrl = data?.path || "";
      }
      if (form.resume) {
        const { data, error: resErr } = await supabase.storage.from("auto-apply").upload(`resumes/${Date.now()}_${form.resume.name}`, form.resume);
        if (resErr) throw resErr;
        resumeUrl = data?.path || "";
      }
      // Insert form data into Supabase
      const { error: dbErr } = await supabase.from("auto_apply_profiles").insert([
        {
          full_name: form.fullName,
          linkedin: form.linkedin,
          phone: form.phone,
          address: form.address,
          dob: form.dob,
          demographics: form.demographics,
          race: form.race,
          education: form.education,
          job_titles: form.jobTitles.filter(Boolean),
          work_area: form.workArea,
          min_salary: form.minSalary,
          target_location: form.targetLocation,
          image_url: imageUrl,
          resume_url: resumeUrl,
        },
      ]);
      if (dbErr) throw dbErr;
      setSuccess("Profile submitted successfully!");
      setTimeout(() => router.push("/dashboard/auto-apply"), 1500);
    } catch (err: any) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <Card className="w-full max-w-lg shadow-lg border-2 border-primary/10">
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardHeader>
            <CardTitle>Auto-Apply Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Welcome to Auto-Apply!</h2>
                <p>We'll guide you through a few steps to set up your profile for automated job applications.</p>
                <Button type="button" onClick={handleNext}>Next</Button>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Disclaimer</h2>
                <p>Please read and accept our terms and conditions before proceeding.</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="disclaimer" checked={disclaimerChecked} onChange={e => setDisclaimerChecked(e.target.checked)} />
                  <Label htmlFor="disclaimer">I have read and agree to the terms and conditions.</Label>
                </div>
                <Button type="button" onClick={handleNext} disabled={!disclaimerChecked}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.fullName.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input id="linkedin" name="linkedin" value={form.linkedin} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.linkedin.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={form.address} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.phone.trim() || !form.address.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" value={form.dob} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.dob}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 6 && (
              <div className="space-y-4">
                <Label htmlFor="demographics">Demographics & Legal Info</Label>
                <Textarea id="demographics" name="demographics" value={form.demographics} onChange={handleChange} placeholder="Enter any legal or diversity info relevant for eligibility..." required />
                <Button type="button" onClick={handleNext} disabled={!form.demographics.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 7 && (
              <div className="space-y-4">
                <Label htmlFor="race">Race/Ethnicity</Label>
                <Input id="race" name="race" value={form.race} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.race.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 8 && (
              <div className="space-y-4">
                <Label htmlFor="education">Highest Education Level</Label>
                <Input id="education" name="education" value={form.education} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.education.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 9 && (
              <div className="space-y-4">
                <Label>Desired Job Titles (2-3)</Label>
                {[0, 1, 2].map(idx => (
                  <Input key={idx} value={form.jobTitles[idx]} onChange={e => handleJobTitleChange(idx, e.target.value)} placeholder={`Job Title ${idx + 1}`} required={idx === 0} />
                ))}
                <Button type="button" onClick={handleNext} disabled={!form.jobTitles[0].trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 10 && (
              <div className="space-y-4">
                <Label htmlFor="workArea">Preferred Work Area</Label>
                <Input id="workArea" name="workArea" value={form.workArea} onChange={handleChange} required />
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <Input id="minSalary" name="minSalary" value={form.minSalary} onChange={handleChange} required />
                <Label htmlFor="targetLocation">Target Location</Label>
                <Input id="targetLocation" name="targetLocation" value={form.targetLocation} onChange={handleChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.workArea.trim() || !form.minSalary.trim() || !form.targetLocation.trim()}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 11 && (
              <div className="space-y-4">
                <Label htmlFor="image">Upload Your Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.image}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 12 && (
              <div className="space-y-4">
                <Label htmlFor="resume">Upload Your Resume</Label>
                <Input id="resume" name="resume" type="file" accept="application/pdf,.doc,.docx" onChange={handleFileChange} required />
                <Button type="button" onClick={handleNext} disabled={!form.resume}>Next</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 13 && (
              <div className="space-y-4 text-center">
                <h2 className="text-lg font-semibold">Review & Submit</h2>
                <p>Click submit to complete your profile and start auto-applying!</p>
                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                {success && <div className="text-emerald-600 text-sm font-medium">{success}</div>}
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
                <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              </div>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
} 