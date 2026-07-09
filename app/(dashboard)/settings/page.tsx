"use client";

import { useAppStore } from "@/lib/store";
import { Settings, User, Bell, Paintbrush, Cpu, Shield, Check, Info } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, setRole, addNotification } = useAppStore();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profile" | "theme" | "notification" | "ai" | "demo">("profile");
  
  const [nameInput, setNameInput] = useState(user.name);
  const [deptInput, setDeptInput] = useState(user.department || "Ban Công Nghệ Thông Tin");
  const [llmPref, setLlmPref] = useState("gpt-4o");
  const [notifSound, setNotifSound] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification("Cập nhật hồ sơ", "Hồ sơ cá nhân của bạn đã được lưu lại thành công.");
    alert("Đã lưu cài đặt hồ sơ cá nhân!");
  };

  const tabs = [
    { id: "profile", name: "Hồ sơ cá nhân", icon: User },
    { id: "theme", name: "Giao diện & Ngôn ngữ", icon: Paintbrush },
    { id: "notification", name: "Thông báo", icon: Bell },
    { id: "ai", name: "Cấu hình AI", icon: Cpu },
    { id: "demo", name: "Xác thực vai trò (Demo)", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <span>Cài đặt hệ thống (Settings)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Điều chỉnh ngôn ngữ, cấu hình tài khoản cá nhân, và thiết lập ưu tiên mô hình ngôn ngữ AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: Settings tabs list (1 col) */}
        <div className="md:col-span-1 space-y-1 select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold cursor-pointer transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Panel detail (3 cols) */}
        <div className="md:col-span-3 bg-card border border-border/80 rounded-xl p-5 shadow-premium-sm">
          {/* Tab 1: Profile */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-xs font-bold text-foreground select-none">Hồ sơ người dùng</h3>
              <p className="text-[11px] text-muted-foreground select-none">Cập nhật thông tin nhận diện nhân sự nội bộ.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground select-none">Họ và tên</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground select-none">Phòng ban</label>
                  <input
                    type="text"
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground select-none">Địa chỉ Email liên hệ</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs text-muted-foreground cursor-not-allowed select-all"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shadow-premium-sm cursor-pointer select-none"
              >
                Lưu hồ sơ
              </button>
            </form>
          )}

          {/* Tab 2: Theme */}
          {activeTab === "theme" && (
            <div className="space-y-4 select-none">
              <h3 className="text-xs font-bold text-foreground">Giao diện hiển thị</h3>
              <p className="text-[11px] text-muted-foreground">Tùy chỉnh tông màu và ngôn ngữ hiển thị trên cổng thông tin.</p>

              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-muted-foreground">Chế độ tối/sáng</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "p-3 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer",
                      theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <span>Chế độ Sáng</span>
                    {theme === "light" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "p-3 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer",
                      theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <span>Chế độ Tối</span>
                    {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-muted-foreground">Ngôn ngữ chính</span>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    Tiếng Việt (Việt Nam)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground opacity-50 cursor-not-allowed">
                    English (US)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Notification */}
          {activeTab === "notification" && (
            <div className="space-y-4 select-none">
              <h3 className="text-xs font-bold text-foreground">Thiết lập thông báo</h3>
              <p className="text-[11px] text-muted-foreground">Cấu hình cách thức nhận cảnh báo lỗi từ hệ thống tự động hóa.</p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-2 rounded hover:bg-secondary/35 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Âm thanh cảnh báo</p>
                    <p className="text-[10px] text-muted-foreground">Phát âm thanh nhỏ khi có lỗi workflow phát sinh.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSound}
                    onChange={(e) => setNotifSound(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </label>
                
                <label className="flex items-center justify-between p-2 rounded hover:bg-secondary/35 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Email báo cáo định kỳ</p>
                    <p className="text-[10px] text-muted-foreground">Gửi email tóm tắt chi phí tài chính LLM vào cuối tuần.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab 4: AI Preference */}
          {activeTab === "ai" && (
            <div className="space-y-4 select-none">
              <h3 className="text-xs font-bold text-foreground">Ưu tiên mô hình ngôn ngữ</h3>
              <p className="text-[11px] text-muted-foreground">Lựa chọn mô hình AI mặc định cho các câu hỏi tra cứu tri thức.</p>

              <div className="space-y-2">
                {[
                  { id: "gpt-4o", name: "GPT-4o Enterprise (OpenAI)", speed: "Nhanh & Tối ưu lập luận", cost: "$0.005 / 1K tokens" },
                  { id: "claude-3-5", name: "Claude 3.5 Sonnet (Anthropic)", speed: "Chuyên sâu viết code & phân tích", cost: "$0.003 / 1K tokens" },
                  { id: "gemini-pro", name: "Gemini 1.5 Pro (Google)", speed: "Hỗ trợ tệp đính kèm khổng lồ (1M token)", cost: "$0.002 / 1K tokens" }
                ].map((llm) => (
                  <button
                    key={llm.id}
                    onClick={() => setLlmPref(llm.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors",
                      llmPref === llm.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">{llm.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{llm.speed}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold bg-secondary px-2 py-0.5 rounded text-muted-foreground border">
                        {llm.cost}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Switch Role Demo */}
          {activeTab === "demo" && (
            <div className="space-y-4 select-none">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Thay đổi vai trò trải nghiệm</h3>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Để phục vụ việc kiểm thử, bạn có thể tự do chuyển đổi giữa tài khoản User thường và Admin. Khi đổi thành Admin, Menu Quản trị (Admin) sẽ lập tức xuất hiện ở Sidebar và Header.
              </p>

              <div className="p-3.5 bg-secondary/35 border border-border/80 rounded-xl flex items-start gap-2.5">
                <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-muted-foreground">
                  <p className="font-bold text-foreground">Trạng thái vai trò hiện tại: {user.role}</p>
                  <p className="mt-1">
                    Vai trò hiện tại là <span className="font-bold text-foreground">{user.role}</span>.
                    {user.role === "Admin"
                      ? " Bạn đang có toàn quyền truy cập bảng Cost, danh sách Users và Audit Log của tập đoàn."
                      : " Menu quản trị bị ẩn đi để bảo vệ dữ liệu."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setRole("User");
                    addNotification("Đổi vai trò", "Đã chuyển đổi quyền hạn sang nhân viên thường (User).");
                  }}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                    user.role === "User"
                      ? "bg-primary text-primary-foreground border-primary shadow-premium-sm"
                      : "bg-card border-border hover:bg-secondary"
                  )}
                >
                  <span>Chuyển thành USER</span>
                  {user.role === "User" && <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    setRole("Admin");
                    addNotification("Đổi vai trò", "Đã chuyển đổi quyền hạn sang Quản trị viên (Admin).");
                  }}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                    user.role === "Admin"
                      ? "bg-primary text-primary-foreground border-primary shadow-premium-sm"
                      : "bg-card border-border hover:bg-secondary"
                  )}
                >
                  <span>Chuyển thành ADMIN</span>
                  {user.role === "Admin" && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
