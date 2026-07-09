"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useChatStore } from "@/lib/store";
import { mockFetch, mockSystemStats, mockAuditLogs } from "@/lib/mock-data";
import { StatCardSkeleton } from "@/components/skeletons";
import { Compass, Sparkles, FolderOpen, AlertCircle, FileText, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const { addConversation, sendMessage } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Chào ngày mới");
  const [stats, setStats] = useState<typeof mockSystemStats | null>(null);
  const [activities, setActivities] = useState<typeof mockAuditLogs>([]);

  useEffect(() => {
    // 1. Establish time of day greeting
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Chào buổi sáng");
    else if (hr < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    // 2. Fetch mock data with loading delay
    const fetchData = async () => {
      setLoading(true);
      const fetchedStats = await mockFetch(mockSystemStats, 1000);
      const fetchedLogs = await mockFetch(mockAuditLogs, 1000);
      setStats(fetchedStats);
      setActivities(fetchedLogs);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSuggestionClick = (prompt: string, title: string) => {
    const id = addConversation(title);
    router.push(`/chat/${id}`);
    
    // prefills the input and triggers response after transition
    setTimeout(() => {
      const activeTextarea = document.querySelector("textarea");
      if (activeTextarea) {
        // Set value and trigger native events
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        nativeTextareaValueSetter?.call(activeTextarea, prompt);
        activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 400);
  };

  const suggestions = [
    {
      title: "Phân tích doanh số Q1",
      desc: "Trích xuất & phân tích các chỉ số tăng trưởng doanh thu từ Odoo Quý 1.",
      prompt: "AI hãy phân tích dữ liệu tài chính Quý 1 từ file báo cáo xem tốc độ tăng trưởng thế nào.",
      tag: "Tài chính"
    },
    {
      title: "Rủi ro hợp đồng đại lý",
      desc: "Quét file hợp đồng đại lý để tìm điều khoản phạt bất lợi.",
      prompt: "Tôi chuẩn bị ký hợp đồng với Đại lý Thành Phát. Hãy check file mẫu xem có điều khoản nào bất lợi hoặc rủi ro cho VinaCorp không.",
      tag: "Pháp lý"
    },
    {
      title: "Quy định nghỉ phép năm",
      desc: "Tra cứu nhanh chính sách số ngày nghỉ và thâm niên nghỉ phép.",
      prompt: "Chào AI, công ty mình quy định nghỉ phép năm như thế nào? Nhân viên mới vào làm có được nghỉ phép không?",
      tag: "Nhân sự"
    },
    {
      title: "Viết bài PR công nghệ mới",
      desc: "Soạn thảo thông cáo báo chí SEO cho sản phẩm Enterprise AI Portal.",
      prompt: "Viết một bài thông cáo báo chí (PR) chuẩn SEO công bố việc VinaCorp ra mắt cổng thông tin doanh nghiệp 'Enterprise AI Portal'. Bài viết cần nêu bật tính năng tích hợp dữ liệu ERP (Odoo, Salesforce) và bảo mật chuẩn ISO 27001.",
      tag: "Marketing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting}, {user.name}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Hôm nay là {formatDate(new Date())}. Đây là những hoạt động nổi bật trong ngày hôm nay.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats && (
            <>
              {/* Stat 1 */}
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Tổng chi phí LLM (tháng)</span>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold tracking-tight">{formatCurrency(stats.totalCost)}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1.5 flex items-center gap-1">
                    <span>+12.4%</span>
                    <span className="text-muted-foreground font-normal">so với tháng trước</span>
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Yêu cầu Agent xử lý</span>
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold tracking-tight">{stats.agentRequests.toLocaleString()}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1.5 flex items-center gap-1">
                    <span>+8.2%</span>
                    <span className="text-muted-foreground font-normal">hôm nay</span>
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Tài liệu đã lập chỉ mục</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold tracking-tight">8 tài liệu</h3>
                  <p className="text-[10px] text-muted-foreground font-normal mt-1.5">
                    Quét tự động 2 giờ trước
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Quy trình tự động hóa</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold tracking-tight">2/3 hoạt động</h3>
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                    <span>1 lỗi</span>
                    <span className="text-muted-foreground font-normal">cần khắc phục</span>
                  </p>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Main body split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggested actions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <span>Gợi ý tác vụ AI từ Dữ liệu doanh nghiệp</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s.prompt, s.title)}
                className="bg-card border border-border/80 hover:border-primary/40 p-4 rounded-xl text-left shadow-premium-sm group hover:shadow-premium-md transition-all duration-200 flex flex-col justify-between cursor-pointer outline-none focus:ring-1 focus:ring-primary"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {s.desc}
                  </p>
                </div>
                <div className="text-xs text-primary font-bold group-hover:underline mt-4 inline-flex items-center gap-1">
                  <span>Trò chuyện ngay</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity feed (1 col) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            <span>Hoạt động truy cập gần đây</span>
          </h2>
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-4.5 max-h-[350px] overflow-y-auto scrollbar">
            {loading ? (
              <div className="space-y-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-8 w-8 bg-muted rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-28 bg-muted rounded" />
                      <div className="h-3 w-40 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              activities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">
                      {log.user}
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      {log.action}: <span className="font-medium text-foreground">{log.target}</span>
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 block mt-1">
                      {new Date(log.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - IP: {log.ipAddress}
                    </span>
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${log.status === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
