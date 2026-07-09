"use client";

import { useWorkflowStore, useAppStore } from "@/lib/store";
import { WorkflowSkeleton } from "@/components/skeletons";
import { EmptyWorkflowState } from "@/components/empty-states";
import { Terminal, Play, CheckCircle2, XCircle, AlertCircle, Loader2, Clock, Calendar, ArrowRight, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn, formatDate } from "@/lib/utils";

export default function WorkflowPage() {
  const { workflows, activeWorkflowId, setActiveWorkflowId, runWorkflow } = useWorkflowStore();
  const [loading, setLoading] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeWf = workflows.find((w) => w.id === activeWorkflowId);

  // Auto-scroll logs panel
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeWf?.logs]);

  const handleStartRun = (id: string) => {
    setActiveWorkflowId(id);
    runWorkflow(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "failed": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "running": return "text-primary bg-primary/10 border-primary/20";
      default: return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />;
      case "failed": return <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />;
      case "running": return <Loader2 className="h-4.5 w-4.5 text-primary animate-spin shrink-0" />;
      default: return <div className="h-4.5 w-4.5 rounded-full border-2 border-border shrink-0 bg-card" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 select-none">
            <Terminal className="h-6 w-6 text-primary" />
            <span>Tự động hóa luồng việc (Agentic Workflows)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 select-none">
            Thiết lập các chuỗi xử lý tự động giữa hệ thống và AI, hỗ trợ quản lý định biên và cảnh báo lỗi.
          </p>
        </div>
      </div>

      {loading ? (
        <WorkflowSkeleton />
      ) : workflows.length === 0 ? (
        <EmptyWorkflowState title="Trống" description="Chưa có luồng quy trình nào được thiết lập." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List Grid (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-foreground select-none">Quy trình hiện có</h2>
            <div className="grid grid-cols-1 gap-4">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className={cn(
                    "bg-card border rounded-xl p-5 shadow-premium-sm flex flex-col justify-between hover:border-primary/45 transition-colors relative overflow-hidden group",
                    wf.status === "running" ? "border-primary/50" : "border-border/80"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 select-none">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {wf.category}
                      </span>
                      <span className={cn("text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase select-none", getStatusColor(wf.status))}>
                        {wf.status === "idle" ? "Sẵn sàng" : wf.status === "running" ? "Đang chạy..." : wf.status === "success" ? "Thành công" : "Lỗi"}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground mt-3 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveWorkflowId(wf.id)}>
                      {wf.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-border/60 pt-4 mt-6 flex items-center justify-between text-[10px] text-muted-foreground select-none">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Chạy gần nhất: <span className="font-semibold">{wf.lastRun ? formatDate(wf.lastRun) : "Chưa chạy"}</span>
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveWorkflowId(wf.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        Xem nhật ký
                      </button>
                      <button
                        disabled={wf.status === "running"}
                        onClick={() => handleStartRun(wf.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold transition-all shadow-premium-sm flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
                      >
                        {wf.status === "running" ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Đang chạy</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Khởi chạy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Execution steps timeline (1 col) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground select-none">Trình theo dõi các bước</h2>
            {activeWf ? (
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm space-y-6">
                <div className="border-b border-border/60 pb-3 flex items-center justify-between select-none">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[150px]">{activeWf.name}</h4>
                    <span className={cn("text-[9px] font-bold border px-1.5 py-0.5 rounded-full uppercase mt-1 inline-block", getStatusColor(activeWf.status))}>
                      {activeWf.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleStartRun(activeWf.id)}
                    disabled={activeWf.status === "running"}
                    className="p-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                    title="Chạy lại quy trình"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>

                {/* Timeline steps */}
                <div className="relative pl-6 space-y-5 border-l-2 border-border/80 ml-2">
                  {activeWf.steps.map((step, idx) => {
                    const activeStep = step.status === "running";
                    return (
                      <div key={step.id} className="relative">
                        {/* Step icon overlay */}
                        <div className="absolute left-[-24px] top-0.5 bg-card rounded-full p-0.5 z-10 select-none">
                          {getStepIcon(step.status)}
                        </div>
                        <div>
                          <h5 className={cn("text-xs font-bold transition-all", activeStep ? "text-primary scale-102" : "text-foreground")}>
                            {step.name}
                          </h5>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {step.description}
                          </p>
                          {step.duration && (
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.25 rounded-full mt-1.5 inline-block select-none">
                              Thời gian: {step.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live execution logs drawer inside layout */}
                {activeWf.logs.length > 0 && (
                  <div className="border-t border-border pt-4 mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">Nhật ký tiến trình:</span>
                    <div className="bg-secondary/45 border border-border/80 rounded-xl p-3.5 max-h-48 overflow-y-auto font-mono text-[9px] text-muted-foreground leading-normal space-y-1.5 scrollbar select-text">
                      {activeWf.logs.map((log, idx) => (
                        <div key={idx} className={cn(
                          "flex gap-1.5",
                          log.level === "error" ? "text-rose-500 font-bold" : log.level === "warning" ? "text-amber-500" : "text-muted-foreground"
                        )}>
                          <span className="text-muted-foreground/60 select-none">[{log.timestamp}]</span>
                          <span className="truncate">{log.message}</span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center bg-card border border-dashed rounded-xl flex flex-col items-center select-none">
                <Terminal className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">Chọn một quy trình bên trái để theo dõi các bước thực thi chi tiết.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
