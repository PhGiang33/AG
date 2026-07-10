"use client";

// Trang Lich su tro chuyen
// Hien thi danh sach cac cuoc hoi thoai cu de nguoi dung xem lai.


import { useChatStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";
import { Search, MessageSquare, Pin, Trash2, Edit2, Check, X, ArrowRight, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ChatHistoryPage() {
  const router = useRouter();
  const { conversations, deleteConversation, renameConversation, pinConversation } = useChatStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Group conversations by timeframe
  const getGroupedConversations = () => {
    const now = new Date();
    const today: typeof conversations = [];
    const week: typeof conversations = [];
    const older: typeof conversations = [];

    const filtered = conversations.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );

    filtered.forEach((c) => {
      const diffMs = now.getTime() - new Date(c.updatedAt).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < 1) today.push(c);
      else if (diffDays < 7) week.push(c);
      else older.push(c);
    });

    return { today, week, older };
  };

  const { today, week, older } = getGroupedConversations();

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      renameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleDeleteConfirm = (id: string) => {
    deleteConversation(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>Lịch sử hội thoại (Chat History)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các cuộc trò chuyện AI trước đây của bạn, đổi tên hoặc ghim các báo cáo quan trọng.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="relative max-w-sm select-none">
        <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Tìm kiếm tiêu đề hội thoại..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-card border border-border/80 rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground"
        />
      </div>

      {/* Render grouped lists */}
      <div className="space-y-6">
        {conversations.length === 0 ? (
          <div className="py-16 text-center bg-card border border-dashed rounded-xl flex flex-col items-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <h3 className="text-sm font-bold text-foreground">Chưa có lịch sử</h3>
            <p className="text-sm text-muted-foreground mt-1">Các cuộc trò chuyện mới của bạn sẽ được lưu giữ tại đây.</p>
          </div>
        ) : (
          <>
            {/* 1. Today group */}
            {today.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider select-none">Hôm nay</h3>
                <div className="bg-card border border-border/80 rounded-xl divide-y divide-border/60 overflow-hidden shadow-premium-sm">
                  {today.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <MessageSquare className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        {editingId === c.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="px-2 py-0.5 border border-primary rounded text-sm bg-background text-foreground outline-none w-full max-w-sm"
                              autoFocus
                            />
                            <button onClick={() => handleSaveRename(c.id)} className="p-1 text-emerald-500 hover:bg-secondary rounded cursor-pointer">
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-rose-500 hover:bg-secondary rounded cursor-pointer">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => router.push(`/chat/${c.id}`)}
                            className="text-sm font-semibold hover:text-primary transition-colors truncate text-left cursor-pointer"
                          >
                            {c.title}
                          </button>
                        )}
                        {c.isPinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                      </div>

                      <div className="flex items-center gap-3 select-none">
                        <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(c.updatedAt)}</span>
                        {editingId !== c.id && (
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer outline-none">
                                <MoreHorizontal className="h-4.5 w-4.5" />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content align="end" className="bg-card border border-border rounded-lg p-1 shadow-premium-md z-30 outline-none w-32">
                                <DropdownMenu.Item onClick={() => pinConversation(c.id)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm hover:bg-secondary outline-none cursor-pointer">
                                  <Pin className="h-3.5 w-3.5" />
                                  <span>{c.isPinned ? "Bỏ ghim" : "Ghim đầu"}</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => handleStartRename(c.id, c.title)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm hover:bg-secondary outline-none cursor-pointer">
                                  <Edit2 className="h-3.5 w-3.5" />
                                  <span>Đổi tên</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setDeleteConfirmId(c.id)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm text-rose-500 hover:bg-rose-50/10 outline-none cursor-pointer">
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Xóa bỏ</span>
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. 7 Days group */}
            {week.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">7 ngày trước</h3>
                <div className="bg-card border border-border/80 rounded-xl divide-y divide-border/60 overflow-hidden shadow-premium-sm">
                  {week.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <MessageSquare className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        {editingId === c.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="px-2 py-0.5 border border-primary rounded text-sm bg-background text-foreground outline-none w-full max-w-sm"
                              autoFocus
                            />
                            <button onClick={() => handleSaveRename(c.id)} className="p-1 text-emerald-500 hover:bg-secondary rounded cursor-pointer">
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-rose-500 hover:bg-secondary rounded cursor-pointer">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => router.push(`/chat/${c.id}`)}
                            className="text-sm font-semibold hover:text-primary transition-colors truncate text-left cursor-pointer"
                          >
                            {c.title}
                          </button>
                        )}
                        {c.isPinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                      </div>

                      <div className="flex items-center gap-3 select-none">
                        <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(c.updatedAt)}</span>
                        {editingId !== c.id && (
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer outline-none">
                                <MoreHorizontal className="h-4.5 w-4.5" />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content align="end" className="bg-card border border-border rounded-lg p-1 shadow-premium-md z-30 outline-none w-32">
                                <DropdownMenu.Item onClick={() => pinConversation(c.id)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm hover:bg-secondary outline-none cursor-pointer">
                                  <Pin className="h-3.5 w-3.5" />
                                  <span>{c.isPinned ? "Bỏ ghim" : "Ghim đầu"}</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => handleStartRename(c.id, c.title)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm hover:bg-secondary outline-none cursor-pointer">
                                  <Edit2 className="h-3.5 w-3.5" />
                                  <span>Đổi tên</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setDeleteConfirmId(c.id)} className="flex items-center gap-2 px-2.5 py-1.5 rounded text-sm text-rose-500 hover:bg-rose-50/10 outline-none cursor-pointer">
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Xóa bỏ</span>
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog.Root open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-card border border-border shadow-premium-lg rounded-xl p-5 outline-none z-50 animate-zoom-in">
            <Dialog.Title className="text-sm font-bold text-foreground">Xóa lịch sử trò chuyện này?</Dialog.Title>
            <p className="text-xs text-muted-foreground mt-2">
              Hành động này sẽ xóa vĩnh viễn nội dung cuộc đối thoại này khỏi lịch sử của bạn. Không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-bold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirmId!)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-premium-sm cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
