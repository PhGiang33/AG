// Cac component Hieu ung cho (Skeleton Loading)
// Hien thi khung mau xam trong luc dang tai du lieu tu server.

import { cn } from "@/lib/utils";

// 1. Stat Card Loading Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded-lg" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-8 w-36 bg-muted rounded" />
        <div className="h-3.5 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}

// 2. Chat Bubble Loading Skeleton
export function ChatMessageSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      {/* User message skeleton */}
      <div className="flex justify-end gap-3 animate-pulse">
        <div className="space-y-2 max-w-[70%]">
          <div className="h-4.5 w-48 bg-muted rounded-lg rounded-tr-none ml-auto" />
          <div className="h-4 w-32 bg-muted rounded-lg ml-auto" />
        </div>
        <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
      </div>
      
      {/* Assistant message skeleton */}
      <div className="flex gap-3 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
        <div className="space-y-2.5 max-w-[70%] flex-1">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4.5 w-full bg-muted rounded-lg rounded-tl-none" />
          <div className="h-4.5 w-[90%] bg-muted rounded-lg" />
          <div className="h-4.5 w-[65%] bg-muted rounded-lg" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-24 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Knowledge Document List/Folder Skeleton
export function KnowledgeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-40 bg-muted rounded-lg" />
        <div className="h-9 w-28 bg-muted rounded-lg ml-auto" />
        <div className="h-9 w-28 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 bg-muted rounded-lg" />
              <div className="h-4 w-12 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4.5 w-full bg-muted rounded" />
              <div className="h-3.5 w-[60%] bg-muted rounded" />
            </div>
            <div className="border-t border-border/60 pt-3 flex items-center justify-between">
              <div className="h-3.5 w-16 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Connected Account Skeleton
export function AccountCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border/80 rounded-xl p-5 space-y-4 shadow-premium-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-3 w-36 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
          <div className="flex justify-end pt-2">
            <div className="h-8 w-24 bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Workflow Step Loading Skeleton
export function WorkflowSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-6 shadow-premium-sm space-y-6 animate-pulse">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-3.5 w-72 bg-muted rounded" />
        </div>
        <div className="h-8 w-24 bg-muted rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg border border-border/40">
            <div className="h-6 w-6 bg-muted rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3.5 w-56 bg-muted rounded" />
            </div>
            <div className="h-4 w-12 bg-muted rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Prompt Card Skeleton
export function PromptCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card border border-border/80 rounded-xl p-5 space-y-3.5 shadow-premium-sm">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded-full" />
          </div>
          <div className="h-3.5 w-full bg-muted rounded" />
          <div className="h-3.5 w-[85%] bg-muted rounded" />
          <div className="h-20 bg-muted/40 rounded-lg" />
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-7 w-20 bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
