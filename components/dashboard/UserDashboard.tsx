"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useChatStore } from "@/lib/store";
import { mockFetch, mockUserDashboardStats, mockPersonalTasks, PersonalTask } from "@/lib/mock-data";
import { Sparkles, Calendar, BookOpen, Clock, Bot, CheckSquare, Square, ThumbsUp, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAppStore();
  const { addConversation } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Chào ngày mới");
  const [personalStats, setPersonalStats] = useState<typeof mockUserDashboardStats | null>(null);
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  // Dynamically map department based on role or mock it
  const userDept = user.role === "Admin" ? "Ban Công nghệ Thông tin (IT)" : "Ban Kinh doanh (Sales)";

  useEffect(() => {
    // 1. Greeting by time of day
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Chào buổi sáng");
    else if (hr < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    // 2. Fetch mock data
    const fetchData = async () => {
      setLoading(true);
      const statsData = await mockFetch(mockUserDashboardStats, 800);
      const tasksData = await mockFetch(mockPersonalTasks, 800);
      setPersonalStats(statsData);
      setTasks(tasksData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSuggestionClick = (prompt: string, title: string, agentId?: string) => {
    const id = addConversation(title, agentId);
    router.push(`/chat/${id}`);
    
    // prefill text input after route transition
    setTimeout(() => {
      const activeTextarea = document.querySelector("textarea");
      if (activeTextarea) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        nativeSetter?.call(activeTextarea, prompt);
        activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 400);
  };

  const toggleTaskComplete = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Filter tasks that are not checked off yet
  const activeTasks = tasks.filter((t) => !completedTaskIds.includes(t.id));

  // Suggestion list with locked Agent ID mappings
  const allSuggestions = [
    {
      title: "Phân tích doanh số Q1",
      desc: "Trích xuất & phân tích các chỉ số tăng trưởng doanh thu từ Odoo Quý 1.",
      prompt: "AI hãy phân tích dữ liệu tài chính Quý 1 từ file báo cáo xem tốc độ tăng trưởng thế nào.",
      tag: "Tài chính",
      dept: "Sales",
      agentId: "agent-erp"
    },
    {
      title: "Rủi ro hợp đồng đại lý",
      desc: "Quét file hợp đồng đại lý để tìm điều khoản phạt bất lợi.",
      prompt: "Tôi chuẩn bị ký hợp đồng với Đại lý Thành Phát. Hãy check file mẫu xem có điều khoản nào bất lợi hoặc rủi ro cho VinaCorp không.",
      tag: "Pháp lý",
      dept: "Sales",
      agentId: "agent-docs"
    },
    {
      title: "Quy định nghỉ phép năm",
      desc: "Tra cứu nhanh chính sách số ngày nghỉ và thâm niên nghỉ phép.",
      prompt: "Chào AI, công ty mình quy định nghỉ phép năm như thế nào? Nhân viên mới vào làm có được nghỉ phép không?",
      tag: "Nhân sự",
      dept: "HR",
      agentId: "agent-docs"
    },
    {
      title: "Viết bài PR công nghệ mới",
      desc: "Soạn thảo thông cáo báo chí SEO cho sản phẩm Enterprise AI Portal.",
      prompt: "Viết một bài thông cáo báo chí (PR) chuẩn SEO công bố việc VinaCorp ra mắt cổng thông tin doanh nghiệp 'Enterprise AI Portal'. Bài viết cần nêu bật tính năng tích hợp dữ liệu ERP (Odoo, Salesforce) và bảo mật chuẩn ISO 27001.",
      tag: "Marketing",
      dept: "Marketing",
      agentId: "agent-docs"
    },
    {
      title: "Kiểm tra mã nguồn & API",
      desc: "Phân tích mã nguồn node.js để tối ưu hóa truy vấn cơ sở dữ liệu.",
      prompt: "AI hãy hướng dẫn cách tối ưu truy vấn SQL kết hợp redis cache trong node.js để tăng tốc API portal.",
      tag: "Công nghệ",
      dept: "IT",
      agentId: "agent-docs"
    },
    {
      title: "Tạo tài liệu kỹ thuật ISO",
      desc: "Bản thảo quy định lưu trữ tệp tin theo chuẩn ISO 27001.",
      prompt: "Soạn thảo tài liệu hướng dẫn an toàn thông tin khi lưu trữ dữ liệu trên Drive công ty theo chuẩn ISO 27001.",
      tag: "Công nghệ",
      dept: "IT",
      agentId: "agent-docs"
    }
  ];

  // Filter suggestion list based on user department
  const filteredSuggestions = allSuggestions.filter((s) => {
    if (user.role === "Admin") {
      // Admin maps to IT department
      return s.dept === "IT" || s.dept === "Pháp lý";
    } else {
      // Normal user maps to Sales department
      return s.dept === "Sales" || s.dept === "Tài chính";
    }
  });

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div className="select-none">
          <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
            {greeting}, {user.name}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Bạn đang hoạt động tại phòng ban: <span className="font-semibold text-primary">{userDept}</span>. Hôm nay là {formatDate(new Date())}.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-44 bg-card border rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-card border rounded-xl animate-pulse" />
            <div className="h-72 bg-card border rounded-xl animate-pulse" />
          </div>
        </div>
      ) : (
        personalStats && (
          <>
            {/* Stats row with sparkline for primary indicator */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Primary Stat Card: AI Assistance Count */}
                <div className="md:col-span-2 bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm flex flex-col sm:flex-row justify-between items-center hover:border-primary/20 transition-all gap-4 overflow-hidden relative group">
                  <div className="space-y-2 flex-1 min-w-0">
                    <span className="text-xs font-semibold text-muted-foreground font-display uppercase tracking-wider">Tác vụ AI hỗ trợ tôi tuần này</span>
                    <div className="pt-1">
                      <h3 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
                        {personalStats.aiHelpedCount} lần
                      </h3>
                      <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                        <span>Đã tiết kiệm ~4.5 giờ làm việc</span>
                      </p>
                    </div>
                  </div>

                  {/* Sparkline chart */}
                  <div className="h-14 w-full sm:w-44 text-xs select-none shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={personalStats.aiHelpedByDay} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="userSparkline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="var(--color-primary)"
                          fillOpacity={1}
                          fill="url(#userSparkline)"
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sub Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Sub Stat 1: Documents */}
                  <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between select-none">
                      <span className="text-[11px] font-semibold text-muted-foreground font-display">Tài liệu đã đọc</span>
                      <BookOpen className="h-4 w-4 text-muted-foreground stroke-1" />
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-base font-bold tracking-tight font-display">{personalStats.recentDocsCount} files</h4>
                      <p className="text-[9px] text-muted-foreground mt-1">Truy cập tuần này</p>
                    </div>
                  </div>

                  {/* Sub Stat 2: Active Workflows */}
                  <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between select-none">
                      <span className="text-[11px] font-semibold text-muted-foreground font-display">Quy trình tự động</span>
                      <Bot className="h-4 w-4 text-muted-foreground stroke-1" />
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-base font-bold tracking-tight font-display">{personalStats.runningWorkflowsCount} hoạt động</h4>
                      <p className="text-[9px] text-emerald-500 font-bold mt-1">Đang đồng bộ ổn định</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split suggested tasks & Today's work */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Tasks list (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5 select-none font-display">
                  <CheckSquare className="h-4.5 w-4.5 text-primary" />
                  <span>VIỆC CỦA TÔI HÔM NAY (AI TRỢ GIÚP)</span>
                </h2>

                <div className="bg-card border border-border/85 rounded-xl p-4 shadow-premium-sm min-h-[220px] flex flex-col justify-center">
                  {activeTasks.length === 0 ? (
                    <div className="text-center py-6 space-y-3 animate-in fade-in select-none">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                        <ThumbsUp className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-foreground">Tuyệt vời! Bạn đã hoàn thành tất cả công việc!</h4>
                        <p className="text-[10px] text-muted-foreground">Không còn tác vụ AI nào đang chờ xử lý hôm nay. 🎉</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 w-full">
                      {activeTasks.map((t) => (
                        <div 
                          key={t.id} 
                          className="flex items-center justify-between gap-3 p-3 bg-secondary/20 hover:bg-secondary/35 border border-border/40 hover:border-border rounded-xl transition-all animate-in slide-in-from-bottom-2 duration-200"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={() => toggleTaskComplete(t.id)}
                              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                              title="Đánh dấu hoàn thành"
                            >
                              <Square className="h-4.5 w-4.5 stroke-1" />
                            </button>
                            <span className="text-xs font-medium text-foreground truncate max-w-sm select-text selection:bg-primary/20">
                              {t.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 select-none">
                            <span className="text-[9px] font-bold bg-secondary border px-1.5 py-0.5 rounded text-muted-foreground uppercase leading-none font-mono">
                              {t.dueTime}
                            </span>
                            <Link
                              href={t.linkTo}
                              className="p-1 rounded-md hover:bg-secondary text-primary hover:text-primary-foreground transition-all cursor-pointer"
                              title="Mở ứng dụng hỗ trợ"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Suggestions (1 col) */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5 select-none font-display">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  <span>GỢI Ý TÁC VỤ CHO PHÒNG BAN</span>
                </h2>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto scrollbar select-none">
                  {filteredSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s.prompt, s.title, s.agentId)}
                      className="w-full bg-card border border-border/80 hover:border-primary/45 p-3 rounded-xl text-left shadow-premium-sm hover:shadow-premium-md transition-all duration-250 flex flex-col justify-between cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          {s.tag}
                        </span>
                        <h4 className="text-xs font-bold text-foreground">{s.title}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                      <div className="text-[10px] text-primary font-bold inline-flex items-center gap-1 mt-2.5">
                        <span>Trò chuyện ngay</span>
                        <span>→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
