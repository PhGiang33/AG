"use client";

// Component O nhap tin nhan (Chat Input)
// Chua textarea cho nguoi dung go cau hoi va nut Gui.


import { useChatStore } from "@/lib/store";
import { Mic, Paperclip, Send, X, Square, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const { isGenerating, stopGeneration, voiceRecordingState, setVoiceRecordingState } = useChatStore();
  const [text, setText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea heights
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (text.trim() === "" && attachedFiles.length === 0) return;
    
    let content = text;
    if (attachedFiles.length > 0) {
      const fileLabels = attachedFiles.map(f => `[Tệp đính kèm: ${f.name} (${f.size})]`).join("\n");
      content = `${fileLabels}\n\n${text}`;
    }

    onSend(content);
    setText("");
    setAttachedFiles([]);
    
    // reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.type
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Mock Voice Recording Flow
  const handleToggleVoice = () => {
    if (voiceRecordingState === "idle") {
      setVoiceRecordingState("recording");
      // Record for 3s, then transition to processing
      setTimeout(() => {
        setVoiceRecordingState("processing");
        // Process for 1.5s, then append mock text
        setTimeout(() => {
          setVoiceRecordingState("idle");
          const mockSpokenText = "Báo cáo doanh số Odoo Quý 1 năm 2026";
          setText((prev) => (prev ? `${prev} ${mockSpokenText}` : mockSpokenText));
        }, 1500);
      }, 3000);
    }
  };

  return (
    <div className="space-y-2 select-none">
      {/* Attached file previews */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs text-foreground font-semibold shadow-sm animate-in fade-in"
            >
              <Paperclip className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate max-w-[120px]">{file.name}</span>
              <span className="text-muted-foreground">({file.size})</span>
              <button
                onClick={() => removeFile(idx)}
                className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        onChange={handleFileChange}
        type="file"
        multiple
        className="hidden"
      />

      {/* Input panel layout */}
      <div className="bg-card border border-border rounded-xl p-2.5 shadow-premium-md relative">
        {voiceRecordingState === "recording" && (
          <div className="absolute inset-0 bg-card rounded-xl flex items-center justify-between px-6 z-10 select-none">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span className="text-sm text-foreground font-bold">
                Đang ghi âm thoại...
              </span>
            </div>
            {/* Visual soundwave simulations */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 h-5">
                {[0.4, 0.9, 0.3, 0.8, 0.5, 0.9, 0.4].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h * 100}%` }}
                    className="w-0.75 bg-primary/75 rounded-full"
                  />
                ))}
              </div>
              <button
                onClick={() => setVoiceRecordingState("idle")}
                className="px-2.5 py-1 bg-secondary hover:bg-secondary/80 text-xs font-bold text-rose-500 rounded border border-border/80 cursor-pointer transition-all"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )}

        {voiceRecordingState === "processing" && (
          <div className="absolute inset-0 bg-card rounded-xl flex items-center justify-center gap-3 z-10 select-none">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground font-semibold animate-pulse">
              Đang chuyển giọng nói thành văn bản tiếng Việt...
            </span>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Nhập câu hỏi tại đây... (Nhấn Enter để gửi, Shift+Enter xuống dòng)"
          className="w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder-muted-foreground resize-none py-1.5 px-2.5 max-h-[120px] scrollbar"
          disabled={isGenerating}
        />

        <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-1.5">
          <div className="flex gap-1.5">
            <button
              onClick={handleAttachClick}
              disabled={isGenerating}
              className="p-1.5 rounded-lg hover:bg-secondary border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-55"
              title="Đính kèm tài liệu"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleVoice}
              disabled={isGenerating}
              className={cn(
                "p-1.5 rounded-lg border border-transparent hover:border-border/60 transition-all cursor-pointer disabled:opacity-55",
                voiceRecordingState === "recording"
                  ? "bg-rose-50/15 text-rose-500 border-rose-500/20"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
              title="Ghi âm giọng nói"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 text-sm font-bold hover:bg-rose-500/25 transition-all cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-rose-500" />
                <span>Dừng thế hệ</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={text.trim() === "" && attachedFiles.length === 0}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 transition-all shadow-premium-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer select-none"
              >
                <span>Gửi đi</span>
                <Send className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
