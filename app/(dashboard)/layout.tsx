"use client";

// File nay la Layout chinh cho toan bo phan Dashboard (sau khi dang nhap)
// No chua Sidebar (thanh dieu huong ben trai) va Header (thanh cong cu phia tren).

import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { CommandPalette } from "@/components/shared/command-palette";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // State mounted de tranh loi Hydration mismatch giua Server va Client
  const [mounted, setMounted] = useState(false);
  const { sidebarCollapsed } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hien thi loading spinner truoc khi component render hoan toan tren client
  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Sidebar navigation (Thanh menu ben trai) */}
      <Sidebar />

      {/* Main workspace (Khung vung viec chinh) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Upper utilities (Thanh Header) */}
        <Header />

        {/* Dynamic page transition wrapper (Hieu ung chuyen trang dung framer-motion) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 select-text">
          {/* AnimatePresence giup the hien hieu ung fade in/out khi doi route (pathname) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {/* Day la noi noi dung cua tung Page hien thi */}
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global utilities (Hop thoai tim kiem nhanh, nhan Ctrl+K de mo) */}
      <CommandPalette />
    </div>
  );
}
