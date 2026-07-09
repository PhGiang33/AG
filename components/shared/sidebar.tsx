"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Compass, MessageSquare, BookOpen, Terminal, Cpu, Settings, Shield, ChevronLeft, ChevronRight, Menu, LogOut, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Tổng quan (Dashboard)", href: "/dashboard", icon: Compass },
    { name: "Trung tâm AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Cơ sở tri thức (Knowledge)", href: "/knowledge", icon: BookOpen },
    { name: "Luồng công việc (Workflow)", href: "/workflow", icon: Terminal },
    { name: "Thư viện Prompts", href: "/prompt-library", icon: TerminalSquare },
    { name: "Dịch vụ liên kết (Accounts)", href: "/connected-accounts", icon: Cpu },
    { name: "Cấu hình (Settings)", href: "/settings", icon: Settings },
  ];

  const adminItems = [
    { name: "Quản trị hệ thống", href: "/admin", icon: Shield },
  ];

  const allItems = user.role === "Admin" ? [...navItems, ...adminItems] : navItems;

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
            <div className="border-t border-border/80 pt-4 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50/10 transition-colors"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
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
            sidebarCollapsed ? "justify-center px-0" : "justify-between px-2"
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
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-secondary border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
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
                  <div className="absolute left-16 bg-popover text-popover-foreground border border-border px-2 py-1 rounded shadow-premium-md text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/60 pt-4 mt-auto">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-secondary border border-border/40 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-rose-500 hover:bg-rose-50/10 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-1 bg-secondary/30 border border-border/40 rounded-lg">
                <div className="h-6 w-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center uppercase shrink-0">
                  {user.role.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
