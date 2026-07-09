"use client";

import { useEffect, useState } from "react";
import { Loader2, Database, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThinkingAnimation() {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Đang phân tích ý định câu hỏi...", icon: Sparkles },
    { label: "Đang truy xuất tri thức phù hợp từ Google Drive...", icon: Database },
    { label: "Đang phân tích tài liệu chính sách...", icon: FileText },
    { label: "Đang tổng hợp và biên soạn câu trả lời...", icon: Loader2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 max-w-3xl mx-auto py-2">
      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-md">
        AI
      </div>

      {/* Steps logs container */}
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex-1 space-y-2.5 max-w-[80%] select-none">
        <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trình tự phân tích của Agent</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </div>
        
        <div className="space-y-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > idx;
            const isCurrent = step === idx;
            const isPending = step < idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs transition-opacity duration-200 ${
                  isPending ? "opacity-30" : "opacity-100"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                ) : (
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
