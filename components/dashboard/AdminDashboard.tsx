"use client";

// Component Dashboard danh rieng cho Admin
// Chua cac bieu do va thong ke bao quat toan he thong.


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockFetch, mockSystemStats, mockAuditLogs, mockSystemAlerts, mockDepartmentUsage, SystemAlert } from "@/lib/mock-data";
import { StatCardSkeleton } from "@/components/skeletons";
import { Compass, Sparkles, FolderOpen, AlertCircle, FileText, TrendingUp, CheckCircle, Clock, Server, ArrowRight, ShieldAlert } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<typeof mockSystemStats | null>(null);
  const [activities, setActivities] = useState<typeof mockAuditLogs>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [deptFilter, setDeptFilter] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedStats = await mockFetch(mockSystemStats, 800);
      const fetchedLogs = await mockFetch(mockAuditLogs, 800);
      const fetchedAlerts = await mockFetch(mockSystemAlerts, 800);
      setStats(fetchedStats);
      setActivities(fetchedLogs);
      setAlerts(fetchedAlerts);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleResolveAlert = (hash: string) => {
    router.push(hash);
  };

  // Filter logs by department if requested
  const filteredActivities = deptFilter === "All" 
    ? activities 
    : activities.filter(a => {
        // Quick heuristics to map users to mock departments
        if (deptFilter === "IT") return ["Trần Thị Lan", "Nguyễn Minh Khang"].includes(a.user);
        if (deptFilter === "Sales") return ["Phạm Văn Minh"].includes(a.user);
        if (deptFilter === "Marketing") return ["Hoàng Mĩ Linh"].includes(a.user);
        if (deptFilter === "HR") return ["Lê Thị Thảo (HR)"].includes(a.user);
        return true;
      });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 select-none font-display">
            <Server className="h-5.5 w-5.5 text-primary" />
            <span>Bảng vận hành hệ thống (Admin Dashboard)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 select-none">
            Giám sát hiệu năng, quản lý chi phí tài nguyên LLM và quản trị bảo mật hệ thống.
          </p>
        </div>
      </div>

      {/* Alert Banner for System issues */}
      {!loading && alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm select-none">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>CẢNH BÁO HỆ THỐNG CẦN XỬ LÝ</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((al) => (
              <div 
                key={al.id} 
                className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex items-start justify-between gap-4 animate-in fade-in"
              >
                <div className="space-y-1 select-none">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-foreground">{al.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{al.desc}</p>
                </div>
                <button
                  onClick={() => handleResolveAlert(al.actionHash)}
                  className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded cursor-pointer transition-colors shrink-0"
                >
                  {al.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skeletons when fetching */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-card border rounded-xl animate-pulse" />
            <div className="h-72 bg-card border rounded-xl animate-pulse" />
          </div>
        </div>
      ) : (
        stats && (
          <>
            {/* Stats Cards Section */}
            <div className="space-y-4">
              {/* Row 1: Cost Highlighted */}
              <div className="bg-card border border-border/80 rounded-xl p-5.5 shadow-premium-md flex flex-col md:flex-row justify-between items-center hover:border-primary/30 transition-all gap-6 relative overflow-hidden group">
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between md:justify-start gap-3">
                    <span className="text-sm font-semibold text-muted-foreground font-display uppercase tracking-wider">Tổng chi phí LLM toàn công ty (Tháng)</span>
                    <TrendingUp className="h-5 w-5 text-muted-foreground stroke-1 shrink-0" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-foreground">
                      {formatCurrency(stats.totalCost)}
                    </h3>
                    <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                      <span>+12.4%</span>
                      <span className="text-muted-foreground font-normal">so với tháng trước</span>
                    </p>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="h-16 w-full md:w-56 text-sm select-none shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.costByDay} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorSparkline" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="var(--color-primary)"
                        fillOpacity={1}
                        fill="url(#colorSparkline)"
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 2: Secondary stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-sm font-semibold text-muted-foreground font-display">Tổng yêu cầu Agent</span>
                    <Sparkles className="h-4.5 w-4.5 text-muted-foreground stroke-1" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-base font-bold tracking-tight font-display">{stats.agentRequests.toLocaleString()} reqs</h4>
                    <p className="text-xs text-emerald-500 font-bold mt-1.5 flex items-center gap-1">
                      <span>+8.2%</span>
                      <span className="text-muted-foreground font-normal">hôm nay</span>
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-sm font-semibold text-muted-foreground font-display">Tài liệu đã chỉ mục</span>
                    <FolderOpen className="h-4.5 w-4.5 text-muted-foreground stroke-1" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-base font-bold tracking-tight font-display">10 tài liệu</h4>
                    <p className="text-xs text-muted-foreground font-normal mt-1.5">
                      Từ Google Drive, ERP, CRM
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-sm font-semibold text-muted-foreground font-display">Luồng tự động chạy</span>
                    <CheckCircle className="h-4.5 w-4.5 text-muted-foreground stroke-1" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-base font-bold tracking-tight font-display">2/3 hoạt động</h4>
                    <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                      <span>1 lỗi connector</span>
                      <span className="text-muted-foreground font-normal">cần kết nối lại</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Split charts & tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Department breakdown chart (2 cols) */}
              <div className="lg:col-span-2 bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground font-display uppercase tracking-wider">Chi phí & Lượt yêu cầu theo Phòng ban</h3>
                  <span className="text-xs text-muted-foreground">Odoo/Salesforce Sync</span>
                </div>
                <div className="h-56 text-sm select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDepartmentUsage} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} />
                      <YAxis yAxisId="left" orientation="left" stroke="var(--color-primary)" fontSize={10} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                      <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
                        labelClassName="font-bold text-foreground"
                      />
                      <Bar yAxisId="left" dataKey="cost" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Chi phí (VNĐ)" />
                      <Bar yAxisId="right" dataKey="requests" fill="var(--color-muted-foreground)" opacity={0.4} radius={[4, 4, 0, 0]} name="Số yêu cầu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Audit logs (1 col) */}
              <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground font-display uppercase tracking-wider">Audit Log hệ thống</h3>
                    
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="text-xs bg-secondary border border-border rounded px-1.5 py-0.5 outline-none font-bold text-foreground/80 cursor-pointer"
                    >
                      <option value="All">Tất cả ban</option>
                      <option value="IT">Ban CNTT</option>
                      <option value="Sales">Ban Sales</option>
                      <option value="Marketing">Ban Marketing</option>
                    </select>
                  </div>

                  <div className="space-y-4 max-h-[190px] overflow-y-auto scrollbar">
                    {filteredActivities.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">Không có bản ghi nào.</p>
                    ) : (
                      filteredActivities.map((log) => (
                        <div key={log.id} className="flex items-start gap-2.5 text-sm">
                          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                            <FileText className="h-3 w-3" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-foreground truncate">{log.user}</p>
                            <p className="text-xs text-muted-foreground truncate">{log.action}: {log.target}</p>
                            <span className="text-xs text-muted-foreground/60 block font-mono mt-0.5">
                              {new Date(log.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - IP: {log.ipAddress}
                            </span>
                          </div>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${log.status === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-border/50">
                  <Link 
                    href="/settings"
                    className="w-full py-1.5 bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground rounded border border-border/80 flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Xem cấu hình hệ thống</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
