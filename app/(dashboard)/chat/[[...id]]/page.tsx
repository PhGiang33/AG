"use client";

// Day la Trang Chat Chinh cua he thong
// No ho tro routing dong kieu Catch-all (VD: /chat, /chat/123, /chat/abc)

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "@/lib/store";
import { DataSourceSelector } from "@/components/chat/DataSourceSelector";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const params = useParams(); // Lay tham so URL (id cua cuoc tro chuyen)
  const { setActiveConversationId, activeConversationId } = useChatStore();
  const [sourcesOpen, setSourcesOpen] = useState(true); // State an/hien cot chon Data Source

  // Hook useEffect: Dong bo ID tren URL voi Global State cua Zustand
  useEffect(() => {
    // Next.js Catch-all route tra ve array, ta lay phan tu dau tien lam ID
    const id = params?.id
      ? Array.isArray(params.id)
        ? params.id[0]
        : params.id
      : null;
    
    // Neu co ID thi cap nhat lai activeConversationId
    if (id) {
      setActiveConversationId(id);
    }
  }, [params, setActiveConversationId]);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex gap-5 overflow-hidden relative">
      {/* Collapsible Data Source Selector Panel */}
      <AnimatePresence initial={false}>
        {sourcesOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginRight: 0 }}
            animate={{ width: 260, opacity: 1, marginRight: 20 }}
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block shrink-0 h-full overflow-hidden"
          >
            <DataSourceSelector />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger floating toggle buttons */}
      <button
        onClick={() => setSourcesOpen(!sourcesOpen)}
        className="absolute bottom-20 left-4 z-10 p-2 rounded-full bg-card border border-border shadow-premium-md text-muted-foreground hover:text-foreground hidden md:flex items-center justify-center cursor-pointer transition-colors"
        title={sourcesOpen ? "Thu gọn nguồn dữ liệu" : "Mở rộng nguồn dữ liệu"}
      >
        {sourcesOpen ? (
          <PanelLeftClose className="h-4.5 w-4.5 text-primary" />
        ) : (
          <PanelLeftOpen className="h-4.5 w-4.5 text-primary" />
        )}
      </button>

      {/* Main Chat client area */}
      <div className="flex-1 h-full min-w-0">
        <ChatWindow />
      </div>
    </div>
  );
}
