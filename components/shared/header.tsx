"use client";

import { useAppStore, useCommandStore } from "@/lib/store";
import { UserAvatar } from "./user-avatar";
import { ThemeToggle } from "./theme-toggle";
import { Search, Bell, Shield, User, LogOut, Check, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { user, setRole, notifications, markAllNotificationsRead } = useAppStore();
  const { setIsOpen: setCommandOpen } = useCommandStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border/60 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 w-full">
      {/* Search trigger button for Command Palette */}
      <button
        onClick={() => setCommandOpen(true)}
        className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/35 text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border transition-all text-xs text-left cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
      >
        <div className="flex items-center">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Tìm kiếm...</span>
        </div>
        <kbd className="hidden sm:inline-block pointer-events-none select-none rounded border border-border/80 bg-card px-1.5 font-mono text-[10px] font-bold text-muted-foreground shadow-sm">
          Ctrl K
        </kbd>
      </button>

      {/* Action group */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications Popover */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary/40">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="w-80 bg-card border border-border rounded-xl shadow-premium-lg p-1 z-30 outline-none animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
                <span className="text-xs font-bold text-foreground">Thông báo ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto py-1 scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">Không có thông báo mới</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors text-left flex items-start gap-2.5 mb-0.5 last:mb-0",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0 mt-1.5", !n.read ? "bg-primary" : "bg-transparent")} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{n.desc}</p>
                        <span className="text-[9px] text-muted-foreground/80 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* User profile with switches */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/60 cursor-pointer outline-none">
              <UserAvatar src={user.avatar} name={user.name} />
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="w-56 bg-card border border-border rounded-xl shadow-premium-lg p-1.5 z-30 outline-none animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <div className="px-2.5 py-2 border-b border-border/60 mb-1">
                <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>

              {/* Role switching section for DEMO */}
              <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Demo Role Switcher
              </div>
              <DropdownMenu.Item
                onClick={() => {
                  setRole("User");
                  router.refresh();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary outline-none cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Vai trò: User</span>
                </div>
                {user.role === "User" && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  setRole("Admin");
                  router.refresh();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary outline-none cursor-pointer border-b border-border/60 pb-2 mb-1"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Vai trò: Admin</span>
                </div>
                {user.role === "Admin" && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={handleLogout}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-500 hover:bg-rose-50/10 outline-none cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
