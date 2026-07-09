"use client";

import { useEffect, useState, useTransition } from "react";
import { mockKnowledgeDocs, mockFetch } from "@/lib/mock-data";
import { KnowledgeDoc } from "@/lib/types";
import { KnowledgeSkeleton } from "@/components/skeletons";
import { EmptyKnowledgeState } from "@/components/empty-states";
import { Search, Folder, FileText, Filter, Calendar, User, Tag, ArrowRight, Eye, Download, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

export default function KnowledgePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDoc | null>(null);

  // Read URL query parameter for command palette preview redirection
  useEffect(() => {
    const previewId = searchParams.get("preview");
    if (previewId) {
      const doc = mockKnowledgeDocs.find(d => d.id === previewId);
      if (doc) setPreviewDoc(doc);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const folders = Array.from(new Set(mockKnowledgeDocs.map(d => d.folderPath).filter(Boolean))) as string[];
  const categories = ["All", ...Array.from(new Set(mockKnowledgeDocs.map(d => d.category)))];

  const getFilteredDocs = () => {
    return mockKnowledgeDocs.filter((doc) => {
      const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === "All" || doc.category === selectedCategory;
      const matchFolder = !activeFolder || doc.folderPath === activeFolder;
      return matchSearch && matchCategory && matchFolder;
    });
  };

  const filteredDocs = getFilteredDocs();

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <div className="h-9 w-9 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center font-bold text-xs select-none">PDF</div>;
      case "docx": return <div className="h-9 w-9 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center font-bold text-xs select-none">DOC</div>;
      case "xlsx": return <div className="h-9 w-9 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center font-bold text-xs select-none">XLS</div>;
      case "pptx": return <div className="h-9 w-9 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center font-bold text-xs select-none">PPT</div>;
      default: return <div className="h-9 w-9 bg-gray-500/10 text-gray-500 rounded-lg flex items-center justify-center font-bold text-xs select-none">TXT</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 select-none">
            <Folder className="h-6 w-6 text-primary" />
            <span>Cơ sở Tri thức Doanh nghiệp (Knowledge Base)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 select-none">
            Quản lý và lập mục lục tài liệu nội bộ để AI trích xuất thông tin hỗ trợ vận hành.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Folders tree and Categories (1 col) */}
        <div className="space-y-5 select-none">
          {/* Folders Tree card */}
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-3">
            <h3 className="text-xs font-bold text-foreground">Thư mục Tài liệu</h3>
            <div className="space-y-1 mt-2">
              <button
                onClick={() => setActiveFolder(null)}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors",
                  !activeFolder
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <Folder className="h-4 w-4 shrink-0" />
                <span>Tất cả thư mục</span>
              </button>
              
              <div className="pl-2 border-l border-border/60 ml-4 space-y-1 mt-1">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setActiveFolder(folder)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium cursor-pointer transition-colors",
                      activeFolder === folder
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    )}
                  >
                    <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="truncate">{folder}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categories card */}
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-3">
            <h3 className="text-xs font-bold text-foreground">Chủ đề phân loại</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Search & Documents Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 select-none">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Tìm tên tài liệu hoặc thẻ tag gắn kèm..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-card border border-border/80 rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {loading ? (
            <KnowledgeSkeleton />
          ) : filteredDocs.length === 0 ? (
            <EmptyKnowledgeState title="Thư mục trống" description="Không tìm thấy tài liệu phù hợp với điều kiện lọc." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-card border border-border/85 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/45 transition-colors group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 select-none">
                      {getFileIcon(doc.type)}
                      <span className="text-[9px] font-bold bg-secondary border px-2 py-0.5 rounded text-muted-foreground shrink-0 uppercase tracking-wider">
                        {doc.type}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1 select-none">
                        Chủ đề: <span className="font-semibold text-foreground/80">{doc.category}</span>
                      </p>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 select-none">
                      {doc.tags.map(t => (
                        <span key={t} className="text-[8px] font-bold bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div className="border-t border-border/60 pt-3 mt-4 flex items-center justify-between text-[9px] text-muted-foreground select-none">
                    <span className="font-semibold">{doc.size}</span>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-[10px] font-bold text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Xem nội dung</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Content Drawer Preview */}
      <Dialog.Root open={previewDoc !== null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-0 bottom-0 right-0 w-full max-w-2xl bg-card border-l border-border shadow-premium-lg p-6 overflow-y-auto z-50 outline-none flex flex-col justify-between scrollbar animate-in slide-in-from-right duration-250">
            {previewDoc && (
              <>
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4 select-none">
                    <div className="flex items-center gap-2">
                      {getFileIcon(previewDoc.type)}
                      <div>
                        <Dialog.Title className="text-sm font-bold text-foreground truncate max-w-md">
                          {previewDoc.title}
                        </Dialog.Title>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Tải lên bởi: <span className="font-bold text-foreground/80">{previewDoc.updatedBy}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewDoc(null)}
                      className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Metadata labels */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/35 border border-border/60 rounded-xl mb-5 text-[10px] text-muted-foreground select-none">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        Chủ đề
                      </span>
                      <p className="font-bold text-foreground/80">{previewDoc.category}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Cập nhật
                      </span>
                      <p className="font-bold text-foreground/80">{new Date(previewDoc.updatedAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="h-3.5 w-3.5 text-primary" />
                        Dung lượng
                      </span>
                      <p className="font-bold text-foreground/80">{previewDoc.size}</p>
                    </div>
                  </div>

                  {/* Mock content display */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground select-none">Nội dung văn bản chiết xuất:</h4>
                    <div className="p-4 bg-muted/30 border border-border rounded-xl text-xs leading-relaxed text-muted-foreground font-mono whitespace-pre-wrap select-text selection:bg-primary/20">
                      {previewDoc.content}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-8 flex justify-end gap-3 select-none">
                  <button
                    onClick={() => {
                      setPreviewDoc(null);
                      // Redirect to chat with prefilled citation context
                      router.push(`/chat?prompt=Phân tích tệp ${previewDoc.title}`);
                    }}
                    className="px-3.5 py-2 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary/5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Trò chuyện với file</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-premium-sm flex items-center gap-1 cursor-pointer"
                    onClick={() => alert("Tải tệp tin mô phỏng về máy...")}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải về file gốc</span>
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
