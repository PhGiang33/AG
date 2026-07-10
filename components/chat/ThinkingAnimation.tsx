"use client";

// Component Hieu ung AI dang suy nghi
// Hien thi cac buoc dang xu ly cua AI (VD: Ket noi CSDL, Phan tich...).


import { useEffect, useState } from "react";
import { Loader2, Database, Sparkles, FileText, CheckCircle2, Link2, Calendar, Search, Mail, Loader } from "lucide-react";
import { ThinkingStep } from "@/lib/types";

interface ThinkingAnimationProps {
  steps?: ThinkingStep[];
}

const iconMap: Record<string, any> = {
  database: Database,
  calendar: Calendar,
  search: Search,
  sparkles: Sparkles,
  mail: Mail,
  link: Link2,
  loader: Loader
};

export function ThinkingAnimation({ steps: propsSteps }: ThinkingAnimationProps) {
  const [step, setStep] = useState(0);

  const defaultSteps = [
    { label: "Đang phân tích ý định câu hỏi...", icon: "sparkles" },
    { label: "Đang truy xuất tri thức phù hợp từ Google Drive...", icon: "database" },
    { label: "Đang phân tích tài liệu chính sách...", icon: "filetext" },
    { label: "Đang tổng hợp và biên soạn câu trả lời...", icon: "loader" }
  ];

  const steps = propsSteps || defaultSteps;

  useEffect(() => {
    setStep(0);
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [steps]);

  const getIcon = (iconName: string) => {
    const LowerName = iconName.toLowerCase();
    if (iconMap[LowerName]) return iconMap[LowerName];
    if (LowerName === "filetext") return FileText;
    return Loader2;
  };

  return (
    <div className="flex gap-3 max-w-3xl mx-auto py-2">
      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground font-black text-sm flex items-center justify-center shrink-0 shadow-md">
        AI
      </div>

      {/* Steps logs container */}
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex-1 space-y-2.5 max-w-[80%] select-none">
        <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-1.5">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trình tự phân tích của Agent</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </div>
        
        <div className="space-y-2">
          {steps.map((s, idx) => {
            const IconComponent = getIcon(s.icon);
            const isCompleted = step > idx;
            const isCurrent = step === idx;
            const isPending = step < idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2 text-sm transition-opacity duration-200 ${
                  isPending ? "opacity-30" : "opacity-100"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                ) : (
                  <IconComponent className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={
                    isCompleted
                      ? "text-muted-foreground line-through decoration-muted-foreground/30"
                      : isCurrent
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
