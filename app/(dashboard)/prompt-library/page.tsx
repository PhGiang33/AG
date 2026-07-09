"use client";

import { useEffect, useState } from "react";
import { mockPrompts, mockFetch } from "@/lib/mock-data";
import { PromptTemplate } from "@/lib/types";
import { PromptCardSkeleton } from "@/components/skeletons";
import { Search, Terminal, Copy, Check, Star, Plus, Share2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export default function PromptLibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Read URL query parameter for command palette search redirection
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) setSearch(urlQuery);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await mockFetch(mockPrompts, 700);
      setPrompts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = ["All", "Marketing", "Finance", "HR", "Technical", "Productivity"];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    );
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Marketing": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "Finance": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "HR": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "Technical": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 select-none">
            <Terminal className="h-6 w-6 text-primary" />
            <span>Thư viện câu lệnh mẫu (Prompt Library)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 select-none">
            Khám phá các mẫu câu lệnh tối ưu hóa cho công việc doanh nghiệp, tăng năng suất hoạt động của Agent.
          </p>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/60 pb-3 select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-premium-sm"
                : "bg-card text-muted-foreground border-border/80 hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            {cat === "All" ? "Tất cả" : cat}
          </button>
        ))}
      </div>

      {/* Search and create bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 select-none">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Tìm kiếm mẫu câu lệnh, mô tả..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-card border border-border/80 rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Grid displays */}
      {loading ? (
        <PromptCardSkeleton />
      ) : filteredPrompts.length === 0 ? (
        <div className="py-16 text-center bg-card border border-dashed rounded-xl flex flex-col items-center select-none">
          <Terminal className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <h3 className="text-sm font-bold text-foreground">Không tìm thấy Prompt</h3>
          <p className="text-xs text-muted-foreground mt-1">Hãy thử tìm kiếm với các từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredPrompts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border/85 rounded-xl p-5 shadow-premium-sm flex flex-col justify-between hover:border-primary/45 hover:shadow-premium-md transition-all group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 select-none">
                    <span className={cn("text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider", getCategoryColor(p.category))}>
                      {p.category}
                    </span>
                    
                    {/* Star Favorite icon toggle */}
                    <button
                      onClick={() => handleToggleFavorite(p.id)}
                      className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer outline-none"
                    >
                      <Star className={cn("h-4.5 w-4.5 transition-transform active:scale-90", p.isFavorite ? "fill-amber-500 text-amber-500" : "text-muted-foreground/75")} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-1">{p.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Prompt Text block */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border/40 select-text max-h-24 overflow-y-auto font-mono text-[10px] text-muted-foreground leading-normal scrollbar">
                    {p.prompt}
                  </div>
                </div>

                {/* Footer details */}
                <div className="border-t border-border/60 pt-4 mt-5 flex items-center justify-between text-[10px] text-muted-foreground select-none">
                  <span>Sử dụng: <span className="font-semibold">{p.usageCount} lần</span></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(p.id, p.prompt)}
                      className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary hover:text-foreground text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Đã copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        // Prefill prompt in new conversation
                        router.push(`/chat?prompt=${encodeURIComponent(p.prompt)}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold shadow-premium-sm cursor-pointer select-none"
                    >
                      Sử dụng
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
