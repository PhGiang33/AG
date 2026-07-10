"use client";

// Trang Quan ly tri thuc (Knowledge Base)
// Noi nguoi dung co tich hop cac tai lieu de AI tham khao.


import { useEffect, useState, useTransition } from "react";
import { mockKnowledgeDocs, mockFetch } from "@/lib/mock-data";
import { KnowledgeDoc } from "@/lib/types";
import { KnowledgeSkeleton } from "@/components/skeletons";
import { EmptyKnowledgeState } from "@/components/empty-states";
import { Search, Folder, FileText, Filter, Calendar, User, Tag, ArrowRight, Eye, Download, X, ChevronDown } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/lib/store";
import { useSearchParams, useRouter } from "next/navigation";

export default function KnowledgePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts } = useAccountStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  
  // Selected account IDs filter
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  // Toggled/expanded providers list inside knowledge search filters
  const [expandedProviders, setExpandedProviders] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDoc | null>(null);

  const allProviders = ["google", "microsoft", "odoo", "salesforce", "hubspot"];
  const providerDetails = {
    google: {
      name: "Google Drive",
      logo: (
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    },
    microsoft: {
      name: "OneDrive",
      logo: (
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 23 23">
          <rect x="0" y="0" width="11" height="11" fill="#F25022" />
          <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
          <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
          <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
        </svg>
      )
    },
    odoo: {
      name: "ERP Odoo",
      logo: (
        <div className="h-3.5 w-3.5 rounded bg-[#714B67] flex items-center justify-center text-white font-extrabold text-[5px] select-none shrink-0">
          odoo
        </div>
      )
    },
    salesforce: {
      name: "Salesforce",
      logo: (
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#00A1E0">
          <path d="M18.1 9c.1-.3.1-.6.1-.9 0-2.4-2-4.4-4.4-4.4-1.7 0-3.2 1-3.9 2.4-.6-.5-1.4-.9-2.2-.9-1.9 0-3.5 1.5-3.5 3.5 0 .2 0 .5.1.7C1.8 10.3 0 12.4 0 14.8c0 3 2.5 5.5 5.5 5.5h12.7c3.2 0 5.8-2.6 5.8-5.8 0-2.7-1.8-5-4.4-5.5z" />
        </svg>
      )
    },
    hubspot: {
      name: "HubSpot",
      logo: (
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#FF7A59">
          <path d="M21.9 10c.1-.4.1-.8.1-1.2 0-3.3-2.7-6-6-6-2.5 0-4.6 1.5-5.5 3.7C9.7 6.1 8.9 5.8 8 5.8c-2.8 0-5 2.2-5 5 0 .3 0 .6.1.9C1.3 12.6 0 14.5 0 16.7c0 2.8 2.2 5 5 5h13.7c3.1 0 5.6-2.5 5.6-5.6 0-2.6-1.8-4.8-4.4-5.4l2-1.7zM8 19c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        </svg>
      )
    }
  };

  // Initialize selectedAccountIds with all connected account IDs when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && selectedAccountIds.length === 0) {
      setSelectedAccountIds(accounts.map(a => a.id));
    }
  }, [accounts, selectedAccountIds.length]);

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

  // Filter docs whose source accounts are connected and active in settings AND selected in filters
  const getActiveDocsList = () => {
    return mockKnowledgeDocs.filter((doc) => {
      const prov = doc.appSource ? doc.appSource.toLowerCase() : "";
      let providerKey = "";
      if (prov.includes("google") || prov.includes("drive")) providerKey = "google";
      else if (prov.includes("onedrive") || prov.includes("microsoft")) providerKey = "microsoft";
      else if (prov.includes("odoo") || prov.includes("erp")) providerKey = "odoo";
      else if (prov.includes("salesforce") || prov.includes("crm")) providerKey = "salesforce";

      if (providerKey) {
        const providerAccounts = accounts.filter(a => a.provider === providerKey);
        if (providerAccounts.length === 0) return false;
      }
      
      // Filter by selected accounts scope
      if (doc.accountId && !selectedAccountIds.includes(doc.accountId)) {
        return false;
      }
      
      return true;
    });
  };

  const activeDocs = getActiveDocsList();

  const apps = Array.from(new Set(activeDocs.map(d => d.appSource).filter(Boolean))) as string[];
  const folders = Array.from(new Set(
    activeDocs
      .filter(d => !activeApp || d.appSource === activeApp)
      .map(d => d.folderPath)
      .filter(Boolean)
  )) as string[];

  const getFilteredDocs = () => {
    return activeDocs.filter((doc) => {
      const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchApp = !activeApp || doc.appSource === activeApp;
      const matchFolder = !activeFolder || doc.folderPath === activeFolder;
      return matchSearch && matchApp && matchFolder;
    });
  };

  const filteredDocs = getFilteredDocs();

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <div className="h-9 w-9 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center font-bold text-sm select-none">PDF</div>;
      case "docx": return <div className="h-9 w-9 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center font-bold text-sm select-none">DOC</div>;
      case "xlsx": return <div className="h-9 w-9 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm select-none">XLS</div>;
      case "pptx": return <div className="h-9 w-9 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center font-bold text-sm select-none">PPT</div>;
      default: return <div className="h-9 w-9 bg-gray-500/10 text-gray-500 rounded-lg flex items-center justify-center font-bold text-sm select-none">TXT</div>;
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
          <p className="text-sm text-muted-foreground mt-1 select-none">
            Quản lý và lập mục lục tài liệu nội bộ để AI trích xuất thông tin hỗ trợ vận hành.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Folders tree and Categories (1 col) */}
        <div className="space-y-5 select-none">
          {/* Folders Tree card categorized by app */}
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-3.5">
            <h3 className="text-sm font-bold text-foreground font-display">Nguồn dữ liệu & Thư mục</h3>
            <div className="space-y-1.5 mt-2">
              <button
                onClick={() => { setActiveApp(null); setActiveFolder(null); }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-left text-sm font-semibold cursor-pointer transition-colors",
                  !activeApp
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <span>Tất cả nguồn</span>
                <span className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border">
                  {activeDocs.length}
                </span>
              </button>

              <div className="space-y-2 pt-1.5">
                {apps.map((app) => {
                  const appDocsCount = activeDocs.filter(d => d.appSource === app).length;
                  const isSelected = activeApp === app;
                  
                  return (
                    <div key={app} className="space-y-1.5">
                      <button
                        onClick={() => { setActiveApp(app); setActiveFolder(null); }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-sm font-semibold cursor-pointer transition-all",
                          isSelected
                            ? "bg-secondary text-primary border-l-2 border-primary pl-2"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Folder className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <span className="truncate">{app}</span>
                        </span>
                        <span className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border leading-none shrink-0 text-muted-foreground">
                          {appDocsCount}
                        </span>
                      </button>

                      {/* Folder list under selected app */}
                      {isSelected && (
                        <div className="pl-3.5 border-l border-border/60 ml-4.5 space-y-2 py-1 animate-fade-in">
                          {folders.map((folder) => {
                            const folderDocsCount = activeDocs.filter(d => d.appSource === app && d.folderPath === folder).length;
                            const isFolderSelected = activeFolder === folder;
                            return (
                              <button
                                key={folder}
                                onClick={() => setActiveFolder(folder)}
                                className={cn(
                                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-sm font-medium cursor-pointer transition-colors",
                                  isFolderSelected
                                    ? "text-primary font-bold bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                                )}
                              >
                                <span className="truncate">{folder}</span>
                                <span className="text-xs font-mono text-muted-foreground/80 leading-none shrink-0 pl-1">{folderDocsCount}</span>
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
          </div>

        </div>

        {/* Right column: Search & Documents Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative flex-1 select-none">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Tìm tên tài liệu hoặc thẻ tag gắn kèm..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-card border border-border/80 rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Account scope filters */}
            {accounts.length > 0 && (
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-3.5 select-none">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground font-display flex items-center gap-1.5 uppercase">
                    <Filter className="h-3.5 w-3.5 text-primary" />
                    Phạm vi tri thức kết nối
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAccountIds(accounts.map(a => a.id))}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-xs text-muted-foreground/50">|</span>
                    <button
                      onClick={() => setSelectedAccountIds([])}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Bỏ chọn hết
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {allProviders
                    .filter(provKey => accounts.some(a => a.provider === provKey))
                    .map((provKey) => {
                      const detail = providerDetails[provKey as keyof typeof providerDetails];
                      const providerConns = accounts.filter(a => a.provider === provKey);
                      const isExpanded = expandedProviders.includes(provKey);
                      const activeConnsCount = providerConns.filter(c => selectedAccountIds.includes(c.id)).length;
                      
                      return (
                        <div key={provKey} className="border border-border/55 rounded-lg overflow-hidden transition-all bg-card">
                          {/* Header toggle expand */}
                          <button
                            onClick={() => {
                              setExpandedProviders(prev => 
                                prev.includes(provKey) 
                                  ? prev.filter(p => p !== provKey) 
                                  : [...prev, provKey]
                              );
                            }}
                            className="w-full flex items-center justify-between p-2.5 bg-secondary/15 hover:bg-secondary/35 transition-colors text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded bg-secondary/60 flex items-center justify-center shrink-0 border border-border/60 scale-90">
                                {detail.logo}
                              </div>
                              <span className="text-sm font-bold text-foreground font-display">{detail.name}</span>
                              <span className="text-xs font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full select-none">
                                {activeConnsCount}/{providerConns.length}
                              </span>
                            </div>
                            
                            <ChevronDown 
                              className={cn(
                                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", 
                                isExpanded ? "transform rotate-180" : ""
                              )} 
                            />
                          </button>

                          {/* Expanded account list */}
                          {isExpanded && (
                            <div className="p-2.5 border-t border-border/50 bg-secondary/5 space-y-2 animate-fade-in">
                              <div className="flex flex-wrap gap-1.5">
                                {providerConns.map((acc) => {
                                  const isChecked = selectedAccountIds.includes(acc.id);
                                  return (
                                    <button
                                      key={acc.id}
                                      onClick={() => {
                                        setSelectedAccountIds(prev => 
                                          prev.includes(acc.id) 
                                            ? prev.filter(id => id !== acc.id) 
                                            : [...prev, acc.id]
                                        );
                                      }}
                                      className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-semibold transition-all cursor-pointer select-none",
                                        isChecked
                                          ? "bg-primary/10 text-primary border-primary"
                                          : "bg-secondary/40 text-muted-foreground border-border/60 hover:bg-secondary/80"
                                      )}
                                    >
                                      <div className={cn(
                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                        isChecked ? "bg-primary" : "bg-muted-foreground/45"
                                      )} />
                                      <span className="truncate max-w-[130px] font-mono leading-none">{acc.email}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
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
                  className="bg-card border border-border/85 rounded-xl p-4.5 shadow-premium-sm flex flex-col justify-between hover:border-primary/45 transition-colors group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 select-none">
                      {getFileIcon(doc.type)}
                      <span className="text-xs font-bold bg-secondary border px-2 py-0.5 rounded text-muted-foreground shrink-0 uppercase tracking-wider">
                        {doc.type}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                        {doc.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1.5 select-none flex items-center gap-1.5 flex-wrap">
                        {doc.appSource && (
                          <span className="font-semibold text-primary/90 bg-primary/5 border border-primary/15 px-1.5 py-0.5 rounded text-xs">{doc.appSource}</span>
                        )}
                        {doc.folderPath && (
                          <span className="text-muted-foreground font-mono text-xs">/ {doc.folderPath}</span>
                        )}
                      </p>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 select-none">
                      {doc.tags.map(t => (
                        <span key={t} className="text-xs font-bold bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div className="border-t border-border/60 pt-3 mt-4 flex items-center justify-between text-xs text-muted-foreground select-none">
                    <span className="font-semibold">{doc.size}</span>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-sm font-bold text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
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
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Tải lên bởi: <span className="font-bold text-foreground/80">{previewDoc.updatedBy}</span>
                          {previewDoc.appSource && (
                            <>
                              {" "}| Nguồn: <span className="font-bold text-primary">{previewDoc.appSource}</span>
                              {previewDoc.folderPath && ` / ${previewDoc.folderPath}`}
                            </>
                          )}
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
                  <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/35 border border-border/60 rounded-xl mb-5 text-xs text-muted-foreground select-none">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        Nguồn dữ liệu
                      </span>
                      <p className="font-bold text-foreground/80">{previewDoc.appSource || "Hệ thống"}</p>
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
                    <h4 className="text-sm font-bold text-foreground select-none">Nội dung văn bản chiết xuất:</h4>
                    <div className="p-4 bg-muted/30 border border-border rounded-xl text-sm leading-relaxed text-muted-foreground font-mono whitespace-pre-wrap select-text selection:bg-primary/20">
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
                    className="px-3.5 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Trò chuyện với file</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 transition-all shadow-premium-sm flex items-center gap-1 cursor-pointer"
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
