"use client";

// Component Hien thi anh dai dien cua nguoi dung (Avatar)
// Neu khong co anh se hien thi chu cai dau cua ten.


import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name: string;
  className?: string;
  status?: "online" | "offline" | "away" | "busy";
}

export function UserAvatar({ src, name, className, status = "online" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const statusColors = {
    online: "bg-emerald-500 ring-background",
    offline: "bg-gray-400 ring-background",
    away: "bg-amber-500 ring-background",
    busy: "bg-rose-500 ring-background"
  };

  return (
    <div className="relative inline-block">
      <Avatar.Root
        className={cn(
          "inline-flex items-center justify-center align-middle overflow-hidden select-none w-9 h-9 rounded-full bg-secondary border border-border/80 shadow-premium-sm",
          className
        )}
      >
        <Avatar.Image
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
        <Avatar.Fallback
          className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-sm font-semibold rounded-full"
          delayMs={600}
        >
          {initials}
        </Avatar.Fallback>
      </Avatar.Root>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
