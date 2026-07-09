"use client";

import { useChatStore } from "@/lib/store";
import { mockKnowledgeDocs } from "@/lib/mock-data";
import { Folder, FileText, Check, ChevronDown, ChevronRight, CheckSquare, Square, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DataSourceSelector() {
  const { selectedSources, toggleSource, clearSources } = useChatStore();
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["Quy định & Chính sách", "Báo cáo Tài chính"]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderName)
        ? prev.filter(name => name !== folderName)
        : [...prev, folderName]
    );
  };

  // Group docs by folderPath
  const folders = mockKnowledgeDocs.reduce((acc, doc) => {
    const folder = doc.folderPath || "Tài liệu khác";
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(doc);
    return acc;
  }, {} as Record<string, typeof mockKnowledgeDocs>);

  const handleSelectAll = () => {
    mockKnowledgeDocs.forEach(doc => {
      if (!selectedSources.includes(doc.id)) {
        toggleSource(doc.id);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-card/45 border border-border/80 rounded-xl overflow-hidden shadow-premium-sm select-none">
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <Folder className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Nguồn dữ liệu AI</span>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {selectedSources.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-[10px] text-muted-foreground hover:text-primary font-bold hover:underline cursor-pointer"
          >
            Tất cả
          </button>
          <span className="text-muted-foreground/30 text-xs">|</span>
          <button
            onClick={clearSources}
            className="text-[10px] text-muted-foreground hover:text-rose-500 font-bold hover:underline cursor-pointer"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3.5 scrollbar text-xs">
        {Object.entries(folders).map(([folderName, docs]) => {
          const isExpanded = expandedFolders.includes(folderName);
          const allDocsInFolderSelected = docs.every(d => selectedSources.includes(d.id));
          const someDocsSelected = docs.some(d => selectedSources.includes(d.id));

          return (
            <div key={folderName} className="space-y-1">
              {/* Folder Row */}
              <div className="flex items-center justify-between p-1 hover:bg-secondary/40 rounded transition-colors group">
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="flex items-center gap-1 flex-1 text-left font-semibold text-foreground cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <Folder className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
                  <span className="truncate">{folderName}</span>
                </button>
              </div>

              {/* Children Documents */}
              {isExpanded && (
                <div className="pl-4 space-y-0.5 border-l border-border/80 ml-2.5 mt-0.5">
                  {docs.map((doc) => {
                    const isSelected = selectedSources.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleSource(doc.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-1.5 rounded text-left transition-colors cursor-pointer group",
                          isSelected
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {isSelected ? (
                            <div className="h-3.5 w-3.5 rounded border border-primary bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-3.5 w-3.5 rounded border border-border bg-card group-hover:border-primary/50 transition-colors shrink-0" />
                          )}
                          <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                          <span className="truncate text-[11px]">{doc.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
