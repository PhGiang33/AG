"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { mockSystemStats, mockAuditLogs, mockFetch } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Shield, LayoutGrid, Users, DollarSign, TrendingUp, Cpu, Calendar, Search, RefreshCw, Lock, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic Recharts import to avoid SSR errors
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function AdminPage() {
  const { user, setRole } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "audit">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const [stats, setStats] = useState<typeof mockSystemStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<typeof mockAuditLogs>([]);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      setLoading(true);
      const fetchedStats = await mockFetch(mockSystemStats, 800);
      const fetchedLogs = await mockFetch(mockAuditLogs, 800);
      setStats(fetchedStats);
      setAuditLogs(fetchedLogs);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Safeguard role access control
  if (user.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 px-4 select-none">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 border border-rose-500/20 shadow-premium-sm">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-base font-bold text-foreground">Từ chối truy cập (Access Denied)</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Tài khoản hiện tại của bạn không có vai trò **Quản trị viên (Admin)**. Menu này chỉ dành riêng cho Ban điều hành và IT Ban công nghệ thông tin.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 w-full">
          <button
            onClick={() => setRole("Admin")}
            className="w-full py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:bg-primary/95 transition-all shadow-premium-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Kích hoạt vai trò Admin (Demo)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Mock corporate users listing
  const mockUsersList = [
    { id: "u1", name: "Nguyễn Minh Khang", email: "khang.nguyen@vinacorp.vn", role: "Admin", dept: "Ban Công Nghệ Thông Tin", status: "Active" },
    { id: "u2", name: "Trần Thị Lan", email: "lan.tran@vinacorp.vn", role: "User", dept: "Ban Pháp Chế", status: "Active" },
    { id: "u3", name: "Phạm Văn Minh", email: "minh.pham@vinacorp.vn", role: "User", dept: "Khối Kinh Doanh B2B", status: "Active" },
    { id: "u4", name: "Hoàng Mĩ Linh", email: "linh.hoang@vinacorp.vn", role: "User", dept: "Ban Truyền Thông & Marketing", status: "Active" },
    { id: "u5", name: "Nguyễn Lê Hoàng", email: "hoang.nguyen@vinacorp.vn", role: "User", dept: "Ban Tài Chính Kế Toán", status: "Inactive" }
  ];

  const filteredUsers = mockUsersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ["#4f46e5", "#6366f1", "#f59e0b", "#10b981", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span>Bảng quản trị hệ thống (Admin Control Center)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Theo dõi chi phí điện toán đám mây LLM, phân quyền người dùng và tra cứu biên biên hoạt động audit log.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-border/60 pb-3 gap-2 select-none">
        {[
          { id: "overview", name: "Tổng quan & Chi phí", icon: LayoutGrid },
          { id: "users", name: "Người dùng & Phân quyền", icon: Users },
          { id: "audit", name: "Nhật ký hoạt động (Audit)", icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-premium-sm"
                  : "bg-card text-muted-foreground border-border/80 hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Tab 1: Overview Panel */}
          {activeTab === "overview" && stats && mounted && (
            <div className="space-y-6">
              {/* Header metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 select-none">
                <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Users Hoạt động</span>
                    <Users className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mt-3">{stats.activeUsers} nhân viên</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Hoạt động trong 15 phút qua</p>
                </div>
                <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Chi phí Compute (VND)</span>
                    <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mt-3">{formatCurrency(stats.totalCost)}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1 inline-flex items-center gap-0.5">
                    <span>+12.4%</span>
                    <span className="text-muted-foreground font-normal">so với tháng trước</span>
                  </p>
                </div>
                <div className="bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Số yêu cầu API</span>
                    <Cpu className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mt-3">{stats.agentRequests.toLocaleString()} reqs</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Độ chính xác mô hình: 99.4%</p>
                </div>
              </div>

              {/* Graphics charts body */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Cost history (AreaChart) */}
                <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-4">
                  <h3 className="text-xs font-bold text-foreground flex items-center justify-between select-none">
                    <span>Lịch sử Chi phí API theo ngày</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Đơn vị: VNĐ</span>
                  </h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.costByDay} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground/60" />
                        <YAxis stroke="currentColor" className="text-muted-foreground/60" width={60} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }} />
                        <Area type="monotone" dataKey="cost" stroke="#6366f1" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} name="Chi phí" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Agent usage distribution (PieChart) */}
                <div className="bg-card border border-border/80 rounded-xl p-4 shadow-premium-sm space-y-4">
                  <h3 className="text-xs font-bold text-foreground flex items-center justify-between select-none">
                    <span>Phân bổ số lượng xử lý theo Agent</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Đơn vị: Lượt gọi</span>
                  </h3>
                  <div className="h-64 w-full flex items-center justify-center text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.agentUsage}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="name"
                        >
                          {stats.agentUsage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users Data Table */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
                <h3 className="text-xs font-bold text-foreground">Quản lý định biên & Tài khoản</h3>
                {/* Search */}
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/80" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Tìm tên, phòng ban..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-premium-sm">
                <table className="min-w-full divide-y divide-border text-xs text-left">
                  <thead className="bg-secondary/40 font-bold text-foreground select-none">
                    <tr>
                      <th className="px-4 py-3">Nhân viên</th>
                      <th className="px-4 py-3">Phòng ban</th>
                      <th className="px-4 py-3">Quyền hạn (Role)</th>
                      <th className="px-4 py-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-foreground">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.dept}</td>
                        <td className="px-4 py-3 select-none">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                            u.role === "Admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 select-none">
                          <span className={cn(
                            "h-2 w-2 rounded-full inline-block mr-1.5",
                            u.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
                          )} />
                          <span className="font-medium text-muted-foreground">{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Audit Logs Timeline */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground select-none">Nhật ký truy cập bảo mật</h3>
              
              <div className="bg-card border border-border rounded-xl divide-y divide-border/60 overflow-hidden shadow-premium-sm">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-secondary/25 transition-colors text-xs">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-1.5 bg-secondary rounded-lg text-muted-foreground shrink-0 mt-0.5">
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {log.user}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          Hành động: <span className="font-bold text-foreground/80">{log.action}</span> - đối tượng: <span className="italic">{log.target}</span>
                        </p>
                        <span className="text-[9px] text-muted-foreground/80 block mt-1">
                          Thời gian: {new Date(log.timestamp).toLocaleString("vi-VN")} - IP: {log.ipAddress}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 select-none">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                        log.status === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {log.status === "success" ? "Hoàn tất" : "Lỗi"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
