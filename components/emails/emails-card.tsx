// components/EmailCard.tsx
import { FC } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailCardProps {
  id: string;
  subject: string;
  body: string;
}

const EmailCard: FC<EmailCardProps> = ({ id, subject, body }) => {
  // Extract first few sentences for preview
  const preview = body.slice(0, 150) + (body.length > 150 ? "..." : "");
  
  // Get current date for demo purposes (you can replace with actual creation date)
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500",
      "bg-white/80 backdrop-blur-sm border-white/40",
      "hover:bg-white/90 hover:shadow-xl hover:-translate-y-1",
      "hover:border-zinc-200/60"
    )}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            "bg-gradient-to-br from-zinc-100/80 to-gray-100/80",
            "border border-zinc-200/60",
            "group-hover:scale-110 group-hover:shadow-md"
          )}>
            <Mail className="w-5 h-5 text-[#5b6949]" />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Subject */}
        <h3 className={cn(
          "text-lg font-semibold text-zinc-900 mb-3",
          "line-clamp-2 leading-tight",
          "group-hover:text-[#5b6949] transition-colors duration-200"
        )}>
          {subject}
        </h3>

        {/* Preview */}
        <p className={cn(
          "text-sm text-zinc-600 leading-relaxed",
          "line-clamp-3 mb-4"
        )}>
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className={cn(
        "px-6 py-4 border-t",
        "bg-gradient-to-r from-zinc-50/50 to-gray-50/50",
        "border-zinc-100/60"
      )}>
        <Link href={`/dashboard/follow-up-email/${id}`}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between group/btn",
              "text-zinc-600 hover:text-[#5b6949]",
              "hover:bg-zinc-100/80 transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">View Full Email</span>
            </div>
            <ArrowRight className={cn(
              "w-4 h-4 transition-transform duration-200",
              "group-hover/btn:translate-x-1"
            )} />
          </Button>
        </Link>
      </div>

      {/* Hover Effect Overlay */}
      <div className={cn(
        "absolute inset-0 rounded-lg",
        "bg-gradient-to-br from-[#5b6949]/5 to-transparent",
        "opacity-0 group-hover:opacity-100",
        "transition-opacity duration-300 pointer-events-none"
      )} />
    </Card>
  );
};

export default EmailCard;
