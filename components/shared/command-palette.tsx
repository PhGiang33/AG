"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Compass, MessageSquare, BookOpen, Settings, Shield, Moon, Sun, ArrowRight, X, Terminal, Cpu, Bot, Key } from "lucide-react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useCommandStore, useAppStore, useChatStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { mockKnowledgeDocs, mockPrompts } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useCommandStore();
  const { user } = useAppStore();
  const { conversations, addConversation } = useChatStore();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  // Listen to Cmd+K / Ctrl+K
  useKeyboardShortcut({ key: "k", ctrlKey: true }, () => setIsOpen(!isOpen));
  useKeyboardShortcut({ key: "k", metaKey: true }, () => setIsOpen(!isOpen));

  // Reset search when opening/closing
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleCreateChat = () => {
    const id = addConversation("Đoạn chat mới");
    router.push(`/chat/${id}`);
    setIsOpen(false);
  };

  const commandItems = [
    // Pages
    { category: "Trang liên kết", title: "Trang chủ Dashboard", icon: Compass, action: () => handleNavigate("/dashboard"), shortcut: "G D" },
    { category: "Trang liên kết", title: "Trung tâm Agent", icon: Bot, action: () => handleNavigate("/agents"), shortcut: "G G" },
    { category: "Trang liên kết", title: "Cơ sở tri thức (Knowledge)", icon: BookOpen, action: () => handleNavigate("/knowledge"), shortcut: "G K" },
    { category: "Trang liên kết", title: "Cài đặt hệ thống (Settings)", icon: Settings, action: () => handleNavigate("/settings"), shortcut: "G S" },
    ...(user.role === "Admin"
      ? [{ category: "Trang liên kết", title: "Bảng quản trị (Admin Panel)", icon: Shield, action: () => handleNavigate("/admin"), shortcut: "G M" }]
      : []),

    // Actions
    { category: "Thao tác nhanh", title: "Chuyển sang Dark Mode", icon: Moon, action: () => { setTheme("dark"); setIsOpen(false); } },
    { category: "Thao tác nhanh", title: "Chuyển sang Light Mode", icon: Sun, action: () => { setTheme("light"); setIsOpen(false); } },
  ];

  // Dynamic items based on mock data
  const dynamicItems = [
    ...conversations.map((c) => ({
      category: "Lịch sử Chat",
      title: c.title,
      icon: MessageSquare,
      action: () => handleNavigate(`/chat/${c.id}`),
    })),
    ...mockKnowledgeDocs.map((doc) => ({
      category: "Tài liệu Tri thức",
      title: doc.title,
      icon: BookOpen,
      action: () => handleNavigate(`/knowledge?preview=${doc.id}`),
    })),
    ...mockPrompts.map((p) => ({
      category: "Thư viện Prompts",
      title: p.title,
      icon: Terminal,
      action: () => handleNavigate(`/prompt-library?search=${encodeURIComponent(p.title)}`),
    }))
  ];

  const allItems = [...commandItems, ...dynamicItems];

  const filteredItems = search.trim() === ""
    ? commandItems
    : allItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 10);

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-card border border-border shadow-premium-lg rounded-xl overflow-hidden z-50 outline-none"
              >
                <div className="flex items-center border-b border-border/80 px-4 py-3">
                  <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Tìm kiếm chức năng, hội thoại, tài liệu..."
                    className="w-full bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground text-sm h-7"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto p-2 scrollbar">
                  {Object.keys(groupedItems).length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground flex flex-col items-center justify-center">
                      <Terminal className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      Không tìm thấy kết quả phù hợp cho &quot;{search}&quot;
                    </div>
                  ) : (
                    Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category} className="mb-2 last:mb-0">
                        <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                          {category}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          {items.map((item: any, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={idx}
                                onClick={item.action}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors group outline-none focus:bg-secondary"
                              >
                                <div className="flex items-center">
                                  <IconComponent className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                  <span className="truncate">{item.title}</span>
                                </div>
                                {item.shortcut ? (
                                  <span className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground shrink-0 shadow-sm">
                                    {item.shortcut}
                                  </span>
                                ) : (
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="bg-secondary/40 border-t border-border/80 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground font-medium select-none">
                  <div className="flex items-center gap-3">
                    <span>Di chuyển <span className="font-mono bg-muted border px-1 rounded shadow-sm">↑↓</span></span>
                    <span>Chọn <span className="font-mono bg-muted border px-1 rounded shadow-sm">Enter</span></span>
                  </div>
                  <span>Nhấn <span className="font-mono bg-muted border px-1 rounded shadow-sm">ESC</span> để đóng</span>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
