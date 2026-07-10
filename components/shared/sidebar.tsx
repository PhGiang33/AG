"use client";

// Day la component Sidebar (Thanh dieu huong ben trai)
// No hien thi menu dieu huong chinh cua he thong va co the thu gon/mo rong.

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Compass, MessageSquare, BookOpen, Bot, Key, Settings, Shield, ChevronLeft, ChevronRight, Menu, LogOut, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname(); // Hook de lay URL hien tai
  const router = useRouter(); // Hook de dieu huong trang
  
  // Lay cac state/ham dieu khien sidebar tu global store
  const { user, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false); // State quan ly sidebar tren mobile

  // Tat sidebar tren mobile moi khi chuyen trang
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Khai bao danh sach cac trang co ban
  const navItems = [
    { name: "Tổng quan (Dashboard)", href: "/dashboard", icon: Compass },
    { name: "Trung tâm Agent", href: "/agents", icon: Bot },
    { name: "Cơ sở tri thức (Knowledge)", href: "/knowledge", icon: BookOpen },
    { name: "Cấu hình (Settings)", href: "/settings", icon: Settings },
  ];

  // Khai bao danh sach menu rieng cho Admin
  const adminItems = [
    { name: "Quản trị hệ thống", href: "/admin", icon: Shield },
  ];

  // Neu user la Admin thi hien thi them menu Admin, neu khong thi chi hien thi menu co ban
  const allItems = user.role === "Admin" ? [...navItems, ...adminItems] : navItems;

  // Ham dang xuat (logout)
  const handleLogout = () => {
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/chat") {
      return pathname.startsWith("/chat");
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden fixed top-3 left-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-card border border-border shadow-premium-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Content */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-card border-r border-border p-4 flex flex-col z-40 shadow-premium-lg"
          >
            <div className="flex items-center gap-2 px-2 py-4 mb-4 border-b border-border/60">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/20">
                AI
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Enterprise Portal
              </span>
            </div>
            <nav className="flex-1 space-y-1">
              {allItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border/80 h-screen sticky top-0 left-0 overflow-x-hidden z-20 shrink-0",
          sidebarCollapsed ? "p-3" : "p-4"
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center mb-6 py-2 border-b border-border/40 select-none",
            sidebarCollapsed ? "justify-center px-0" : "px-2"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/20 shrink-0">
              AI
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Enterprise Portal
              </span>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {allItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                {/* Active Indicator Slide (Framer Motion) */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-primary/8 dark:bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {active && (
                  <motion.div
                    layoutId="sidebar-active-border"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", active ? "text-primary" : "text-muted-foreground")} />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground border border-border px-2 py-1 rounded shadow-premium-md text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/60 pt-4 mt-auto select-none">
          <div className={cn("flex", sidebarCollapsed ? "justify-center" : "justify-end px-2")}>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-secondary border border-border/40 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title={sidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
