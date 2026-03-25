// app/(autoTalent-app)/dashboard/coverletter/[id]/page.tsx
"use client"; // Explicitly mark as a Client Component

import { FC, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation"; // Correct way to get dynamic parameters
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Save, 
  Download, 
  ArrowLeft, 
  Eye, 
  Edit3, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { shouldWatermark } from "@/utils/actions/subscriptions/usage";

const EditCoverLetterPage: FC = () => {
  const { id } = useParams(); // Get the dynamic 'id' from params
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState({ title: "", context: "" });
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Only fetch the cover letter once `id` is available
  useEffect(() => {
    if (id) {
      fetchCoverLetter();
    }
  }, [id]); // Add id as dependency

  // Track changes
  useEffect(() => {
    setHasChanges(editedContent !== coverLetter.context);
  }, [editedContent, coverLetter.context]);

  const fetchCoverLetter = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setError(error.message); // Set error message
      console.error("Error fetching cover letter:", error.message);
    } else {
      setCoverLetter(data);
      setEditedContent(data.context);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("cover_letters")
      .update({ context: editedContent })
      .eq("id", id);

    if (error) {
      console.error("Error saving cover letter:", error.message);
      toast({
        title: "Error",
        description: "Failed to save cover letter. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Cover letter saved successfully!",
      });
      setHasChanges(false);
    }
    setSaving(false);
  };

  const handleDownloadPDF = async () => {
    // Check if user should get watermarked documents (free plan)
    const applyWatermark = await shouldWatermark();

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Draw a colored header background
    doc.setFillColor(91, 105, 73); // #5b6949
    doc.rect(0, 0, pageWidth, 30, 'F');

    // Title styling
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(coverLetter.title, margin, 20);

    // Reset for body text
    doc.setTextColor(33, 33, 33); // Almost black
    doc.setFontSize(12);
    doc.setFont('times', 'normal');

    // Add body text with better spacing
    doc.text(editedContent, margin, 50, {
      maxWidth: maxWidth,
      lineHeightFactor: 1.6,
    });

    // Optional: draw a footer line
    doc.setDrawColor(200);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    doc.setFontSize(10);
    doc.setTextColor(120);

    // Add watermark for free users
    if (applyWatermark) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      // Set transparency using setGState
      const gState = { opacity: 0.08, "stroke-opacity": 0.08 };
      (doc as any).setGState((doc as any).GState(gState));
      // Rotate and center the watermark
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      doc.text('AutoTalent', centerX, centerY, {
        angle: 45,
        align: 'center',
      });
    }

    // Save the PDF
    doc.save(`${coverLetter.title}.pdf`);

    toast({
      title: "Downloaded",
      description: applyWatermark
        ? "Cover letter downloaded with watermark. Upgrade to remove watermarks."
        : "Cover letter downloaded as PDF successfully!",
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-[#5b6949] animate-spin" />
            <span className="text-zinc-600">Loading cover letter...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl max-w-md">
          <div className="text-center space-y-4">
            <div className="p-3 rounded-full bg-red-100 mx-auto w-fit">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">Error Loading Cover Letter</h2>
              <p className="text-zinc-600 text-sm">{error}</p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-100/80"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                "bg-gradient-to-br from-zinc-100/80 to-gray-100/80",
                "border border-zinc-200/60"
              )}>
                <FileText className="w-5 h-5 text-[#5b6949]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900">Edit Cover Letter</h1>
                <p className="text-sm text-zinc-600">Make changes and preview in real-time</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                "group"
              )}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-280px)] min-h-[600px]">
          {/* Editor Panel */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/40 shadow-xl flex flex-col h-full">
            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Cover Letter Title
                </Label>
                <Input
                  type="text"
                  value={coverLetter.title}
                  readOnly
                  className="bg-zinc-50/50 border-zinc-200 text-zinc-600"
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-2 flex-1">
                <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content
                </Label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className={cn(
                    "min-h-[300px] resize-none transition-all duration-200",
                    "border-zinc-200 focus:border-[#5b6949]",
                    "focus:ring-2 focus:ring-[#5b6949]/20",
                    "bg-white/60 backdrop-blur-sm"
                  )}
                  placeholder="Edit your cover letter content here..."
                />
              </div>

              {/* Character Count */}
              <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                <span>{editedContent.length} characters</span>
                <span>{Math.ceil(editedContent.length / 5)} words</span>
              </div>
            </div>
          </Card>

          {/* Preview Panel */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/40 shadow-xl flex flex-col h-full max-h-[780px]">
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-[#5b6949]" />
                <h2 className="text-lg font-semibold text-zinc-900">Live Preview</h2>
                <div className="ml-auto">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Real-time</span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex-1 overflow-y-auto min-h-[300px]">
                <h3 className="text-xl font-semibold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">
                  {coverLetter.title}
                </h3>
                <div className="prose prose-sm max-w-none max-h-[500px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
                    {editedContent || (
                      <span className="text-zinc-400 italic">
                        Start typing to see your cover letter preview here...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Stats */}
              <div className="flex items-center justify-between text-xs text-zinc-500 bg-zinc-50 p-3 rounded-lg border-t border-zinc-100">
                <div className="flex items-center gap-4">
                  <span>📄 {Math.ceil(editedContent.length / 500)} pages</span>
                  <span>⏱️ {Math.ceil(editedContent.length / 200)} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Preview updated</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCoverLetterPage;
