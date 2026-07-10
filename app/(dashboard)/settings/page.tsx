"use client";

// File nay la Trang Cai Dat (Settings Page)
// Cho phep nguoi dung thay doi thong tin ho so, mat khau, tai khoan lien ket...

import { useAppStore, useAccountStore } from "@/lib/store";
import { Settings, User, Bell, Paintbrush, Cpu, Shield, Check, Info, Key, RefreshCw, AlertCircle, CheckCircle2, Trash2, ExternalLink, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn, formatRelativeTime } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

export default function SettingsPage() {
  // Lay cac ham/state global tu Zustand Store
  const { user, setRole, addNotification } = useAppStore();
  const { theme, setTheme } = useTheme(); // Hook de doi che do Dark/Light mode
  
  const { accounts, isConnecting, connectingProvider, connectAccount, disconnectAccount, toggleAccountActive } = useAccountStore();
  
  // State quan ly tab dang mo
  const [activeTab, setActiveTab] = useState<"profile" | "theme" | "notification" | "ai" | "accounts" | "security">("profile");
  
  const [llmPref, setLlmPref] = useState("gpt-4o");
  const [notifSound, setNotifSound] = useState(true);

  // State luu tru tam thoi form thay doi mat khau
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State quan ly ket noi tai khoan OAuth
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [oauthStep, setOauthStep] = useState(1);
  const [emailInput, setEmailInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // State quan ly popup (Modal) yeu cau tai khoan moi
  const [requestAccountModalOpen, setRequestAccountModalOpen] = useState(false);
  const [requestFormProvider, setRequestFormProvider] = useState<string | null>(null);
  const [requestFormEmail, setRequestFormEmail] = useState(user.email); // Mac dinh lay email cua user
  const [requestFormReason, setRequestFormReason] = useState("");

  // Hook useEffect: Lang nghe su thay doi cua URL hash de chuyen tab tuong ung
  // Vi du: URL la /settings#accounts thi tu dong mo tab Accounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#accounts") {
        setActiveTab("accounts");
      }
      if (hash === "#security") {
        setActiveTab("security");
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "accounts") {
      setAccountsLoading(true);
      const timer = setTimeout(() => setAccountsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleStartConnect = (provider: string) => {
    setSelectedProvider(provider);
    // Enforce connecting only the logged-in user's account email
    setEmailInput(user.email);
    setOauthStep(1);
    setOauthModalOpen(true);
  };

  const handleRunOauthFlow = async () => {
    // SECURITY CHECK: Double-check that the email matches the logged-in user's email.
    // This prevents a user from connecting another person's account (e.g., their manager's).
    if (emailInput !== user.email) {
      addNotification("Lỗi bảo mật", "Bạn chỉ có thể kết nối tài khoản có cùng địa chỉ email với tài khoản đăng nhập của bạn.");
      setOauthModalOpen(false);
      return;
    }
    setOauthStep(2); // Show connecting status
    await connectAccount(
      selectedProvider!,
      emailInput,
      selectedProvider === "google" ? "Google Workspace VinaCorp" : `${selectedProvider?.toUpperCase()} Account`
    );
    setOauthStep(3); // Success status
    addNotification("Kết nối tài khoản", `Đã liên kết dịch vụ ${selectedProvider?.toUpperCase()} thành công.`);
    setTimeout(() => {
      setOauthModalOpen(false);
    }, 1500);
  };

  const handleDeleteConfirm = (id: string) => {
    disconnectAccount(id);
    setConfirmDeleteId(null);
    addNotification("Hủy kết nối", "Đã xóa liên kết tài khoản thành công.");
  };

  const handleSendAccountRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestFormProvider || !requestFormEmail || !requestFormReason.trim()) {
      addNotification("Lỗi", "Vui lòng điền đầy đủ thông tin yêu cầu.");
      return;
    }
    // Simulate sending request to admin
    addNotification("Yêu cầu đã gửi", `Yêu cầu thêm tài khoản ${requestFormEmail} (${requestFormProvider}) đã được gửi đến Admin để phê duyệt.`);
    setRequestAccountModalOpen(false);
    setRequestFormProvider(null);
    setRequestFormEmail(user.email);
    setRequestFormReason("");
    // In a real app, you would send this data to your backend
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addNotification("Lỗi", "Mật khẩu mới không khớp. Vui lòng kiểm tra lại.");
      return;
    }
    if (newPassword.length < 8) {
      addNotification("Lỗi", "Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    addNotification("Thành công", "Mật khẩu của bạn đã được thay đổi thành công.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const providerDetails = {
    google: {
      name: "Google Workspace",
      logo: (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      desc: "Đồng bộ hóa email Gmail, tệp tin Drive và lịch biểu sự kiện."
    },
    microsoft: {
      name: "Microsoft 365",
      logo: (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 23 23">
          <rect x="0" y="0" width="11" height="11" fill="#F25022" />
          <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
          <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
          <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
        </svg>
      ),
      desc: "Kết nối kho SharePoint, dữ liệu đám mây OneDrive và Outlook Mail."
    },
    odoo: {
      name: "ERP Odoo VinaCorp",
      logo: (
        <div className="h-6 w-6 rounded-md bg-[#714B67] flex items-center justify-center text-white font-extrabold text-xs select-none shrink-0">
          odoo
        </div>
      ),
      desc: "Truy xuất danh mục bán hàng, kho vận, hóa đơn tài chính và nhân sự."
    },
    salesforce: {
      name: "Salesforce CRM",
      logo: (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#00A1E0">
          <path d="M18.1 9c.1-.3.1-.6.1-.9 0-2.4-2-4.4-4.4-4.4-1.7 0-3.2 1-3.9 2.4-.6-.5-1.4-.9-2.2-.9-1.9 0-3.5 1.5-3.5 3.5 0 .2 0 .5.1.7C1.8 10.3 0 12.4 0 14.8c0 3 2.5 5.5 5.5 5.5h12.7c3.2 0 5.8-2.6 5.8-5.8 0-2.7-1.8-5-4.4-5.5z" />
        </svg>
      ),
      desc: "So khớp cơ hội bán hàng, thông tin khách hàng tiềm năng B2B."
    },
    hubspot: {
      name: "HubSpot CRM",
      logo: (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#FF7A59">
          <path d="M21.9 10c.1-.4.1-.8.1-1.2 0-3.3-2.7-6-6-6-2.5 0-4.6 1.5-5.5 3.7C9.7 6.1 8.9 5.8 8 5.8c-2.8 0-5 2.2-5 5 0 .3 0 .6.1.9C1.3 12.6 0 14.5 0 16.7c0 2.8 2.2 5 5 5h13.7c3.1 0 5.6-2.5 5.6-5.6 0-2.6-1.8-4.8-4.4-5.4l2-1.7zM8 19c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        </svg>
      ),
      desc: "Đồng bộ hóa dữ liệu khách hàng liên hệ và chiến dịch marketing."
    }
  };

  const allProviders = ["google", "microsoft", "odoo", "salesforce", "hubspot"];

  const tabs = [
    { id: "profile", name: "Hồ sơ cá nhân", icon: User },
    { id: "theme", name: "Giao diện & Ngôn ngữ", icon: Paintbrush },
    { id: "notification", name: "Thông báo", icon: Bell },
    { id: "ai", name: "Cấu hình AI", icon: Cpu },
    { id: "accounts", name: "Dịch vụ liên kết", icon: Key },
    { id: "security", name: "Bảo mật & Mật khẩu", icon: Shield },
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
          <p className="text-sm text-muted-foreground mt-1">
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
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm font-semibold cursor-pointer transition-colors",
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
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground select-none">Hồ sơ người dùng</h3>
              <p className="text-xs text-muted-foreground select-none">Thông tin định danh của bạn được đồng bộ từ hệ thống Nhân sự và không thể thay đổi tại đây.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground select-none">Họ và tên</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-sm text-muted-foreground cursor-not-allowed select-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground select-none">Phòng ban</label>
                  <input
                    type="text"
                    value={user.department || "Chưa phân ban"}
                    disabled
                    className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-sm text-muted-foreground cursor-not-allowed select-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground select-none">Địa chỉ Email liên hệ</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-sm text-muted-foreground cursor-not-allowed select-all"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Theme */}
          {activeTab === "theme" && (
            <div className="space-y-4 select-none">
              <h3 className="text-sm font-bold text-foreground">Giao diện hiển thị</h3>
              <p className="text-xs text-muted-foreground">Tùy chỉnh tông màu và ngôn ngữ hiển thị trên cổng thông tin.</p>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-muted-foreground">Chế độ tối/sáng</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "p-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between cursor-pointer",
                      theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <span>Chế độ Sáng</span>
                    {theme === "light" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "p-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between cursor-pointer",
                      theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <span>Chế độ Tối</span>
                    {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-muted-foreground">Ngôn ngữ chính</span>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-bold text-primary">
                    Tiếng Việt (Việt Nam)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                    English (US)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Notification */}
          {activeTab === "notification" && (
            <div className="space-y-4 select-none">
              <h3 className="text-sm font-bold text-foreground">Thiết lập thông báo</h3>
              <p className="text-xs text-muted-foreground">Cấu hình cách thức nhận cảnh báo lỗi từ hệ thống tự động hóa.</p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-2 rounded hover:bg-secondary/35 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Âm thanh cảnh báo</p>
                    <p className="text-xs text-muted-foreground">Phát âm thanh nhỏ khi có lỗi workflow phát sinh.</p>
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
                    <p className="text-sm font-semibold text-foreground">Email báo cáo định kỳ</p>
                    <p className="text-xs text-muted-foreground">Gửi email tóm tắt chi phí tài chính LLM vào cuối tuần.</p>
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
              <h3 className="text-sm font-bold text-foreground">Ưu tiên mô hình ngôn ngữ</h3>
              <p className="text-xs text-muted-foreground">Lựa chọn mô hình AI mặc định cho các câu hỏi tra cứu tri thức.</p>

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
                      <p className="text-sm font-bold text-foreground">{llm.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{llm.speed}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded text-muted-foreground border">
                        {llm.cost}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Security */}
          {activeTab === "security" && (
            <form onSubmit={handleSavePassword} className="space-y-4 select-none">
              <h3 className="text-sm font-bold text-foreground">Thay đổi mật khẩu</h3>
              <p className="text-xs text-muted-foreground">
                Để đảm bảo an toàn, hãy sử dụng mật khẩu mạnh (tối thiểu 8 ký tự) và thay đổi định kỳ.
              </p>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-muted-foreground">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold shadow-premium-sm cursor-pointer select-none"
              >
                Lưu mật khẩu
              </button>
            </form>
          )}


          {/* Tab 5: Connected Accounts */}
          {activeTab === "accounts" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground font-display">Kết nối Dịch vụ Doanh nghiệp</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Liên kết các tài khoản đám mây và công cụ doanh nghiệp để các Agent chuyên biệt có thể hoạt động và tra cứu dữ liệu.
                </p>
              </div>

              {accountsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border border-border/80 rounded-xl p-4 space-y-3.5 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-muted rounded-lg" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 w-24 bg-muted rounded" />
                          <div className="h-2.5 w-16 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-full bg-muted rounded pt-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                  {allProviders.map((provKey) => {
                    const detail = providerDetails[provKey as keyof typeof providerDetails];
                    const providerConns = accounts.filter((a) => a.provider === provKey);

                    return (
                      <div
                        key={provKey}
                        className={cn(
                          "bg-card border rounded-xl p-4 shadow-premium-sm flex flex-col justify-between transition-all relative overflow-hidden group",
                          providerConns.length > 0
                            ? providerConns.some(c => c.status === "error")
                              ? "border-rose-500/30 hover:border-rose-500/50"
                              : "border-border/80 hover:border-primary/30"
                            : "border-border/60 border-dashed hover:border-border hover:bg-secondary/15"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 border border-border/40">
                              {detail.logo}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-foreground truncate">{detail.name}</h4>
                              <p className="text-xs text-muted-foreground truncate leading-none mt-1">
                                {providerConns.length > 0
                                  ? `Đã kết nối ${providerConns.length} tài khoản`
                                  : "Chưa liên kết"}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                            {detail.desc}
                          </p>

                          {/* Accounts List for this provider */}
                          {providerConns.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                              {providerConns.map((acc) => (
                                <div key={acc.id} className="flex items-center justify-between gap-3 p-2 bg-secondary/25 border border-border/40 rounded-lg text-sm">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-foreground truncate">{acc.name}</p>
                                    <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">{acc.email}</p>
                                    
                                    <div className="flex items-center gap-1.5 mt-1.5 select-none">
                                      {acc.status === "connected" ? (
                                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded leading-none">
                                          Đã đồng bộ
                                        </span>
                                      ) : acc.status === "syncing" ? (
                                        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded leading-none animate-pulse">
                                          Đồng bộ...
                                        </span>
                                      ) : (
                                        <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-1 py-0.5 rounded leading-none flex items-center gap-0.5">
                                          <AlertCircle className="h-2 w-2" />
                                          Lỗi
                                        </span>
                                      )}
                                      <span className="text-xs text-muted-foreground font-mono leading-none">
                                        {formatRelativeTime(acc.lastSync)}
                                      </span>
                                    </div>

                                    {/* Permissions tags */}
                                    <div className="flex flex-wrap gap-1 mt-2.5">
                                      {acc.permissions?.map((perm) => (
                                        <span key={perm} className="text-xs font-bold bg-primary/5 text-primary/80 border border-primary/10 px-1.5 py-0.5 rounded">
                                          {perm}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center shrink-0">
                                    {/* Delete Button */}
                                    <button
                                      onClick={() => setConfirmDeleteId(acc.id)}
                                      className="p-1.5 rounded-lg hover:bg-rose-50/15 border border-transparent hover:border-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                                      title="Ngắt kết nối tài khoản"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card bottom actions */}
                        <div className="mt-4 pt-3 border-t border-border/60 flex justify-end">
                          {providerConns.length > 0 ? (
                            null // Removed the "Liên kết tài khoản khác" button
                          ) : (
                            <button
                              onClick={() => handleStartConnect(provKey)}
                              className="px-2.5 py-1 bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground rounded border border-border/80 cursor-pointer transition-colors"
                            >
                              Liên kết
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-border/60 flex justify-end">
                        <button
                          onClick={() => setRequestAccountModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold shadow-premium-sm cursor-pointer select-none"
                        >
                          Yêu cầu thêm tài khoản mới
                        </button>
              </div> {/* This closes the div wrapping the button */}

            </div>
          )}
        </div>
      </div>

      {/* OAuth Integration Dialog Modal */}
      <Dialog.Root open={oauthModalOpen} onOpenChange={setOauthModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border shadow-premium-lg rounded-xl p-5 outline-none z-50">
            {selectedProvider && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 border border-border/40">
                    {providerDetails[selectedProvider as keyof typeof providerDetails].logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {oauthStep === 1
                        ? `Liên kết ${providerDetails[selectedProvider as keyof typeof providerDetails].name}`
                        : oauthStep === 2
                        ? `Đang ủy quyền...`
                        : `Liên kết thành công!`}
                    </h3>
                  </div>
                </div>

                {oauthStep === 1 && (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Bạn sẽ được chuyển hướng đến trang đăng nhập của nhà cung cấp để xác thực. <strong className="text-foreground">Chỉ tài khoản có email trùng với email đăng nhập của bạn mới được chấp nhận.</strong>
                    </p>
                    <div className="space-y-1.5 mt-2">
                      <label className="text-xs font-bold text-muted-foreground">Email tài khoản</label>
                      <input
                        type="email"
                        value={emailInput}
                        disabled
                        className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-sm text-muted-foreground cursor-not-allowed select-all"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-2">
                      <button
                        onClick={() => setOauthModalOpen(false)}
                        className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-semibold cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={handleRunOauthFlow}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold shadow-premium-sm cursor-pointer"
                      >
                        Đồng ý kết nối
                      </button>
                    </div>
                  </>
                )}

                {oauthStep === 2 && (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground text-center animate-pulse">
                      Đang đồng bộ phân quyền & dữ liệu tài liệu...
                    </p>
                  </div>
                )}

                {oauthStep === 3 && (
                  <div className="py-6 flex flex-col items-center justify-center gap-3 animate-scale-in">
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-emerald-500 font-bold text-center">
                      Kết nối dịch vụ hoàn tất!
                    </p>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Request New Account Modal Dialog */}
      <Dialog.Root open={requestAccountModalOpen} onOpenChange={setRequestAccountModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-premium-lg rounded-xl p-6 outline-none z-50">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-sm font-bold text-foreground">Yêu cầu thêm tài khoản mới</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            
            <form onSubmit={handleSendAccountRequest} className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vui lòng điền thông tin tài khoản bạn muốn liên kết và lý do nghiệp vụ. Yêu cầu sẽ được gửi đến Admin để phê duyệt.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Nhà cung cấp dịch vụ</label>
                <select
                  value={requestFormProvider || ""}
                  onChange={(e) => setRequestFormProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="" disabled>Chọn nhà cung cấp</option>
                  {allProviders.map(provKey => {
                    const detail = providerDetails[provKey as keyof typeof providerDetails];
                    return (
                      <option key={provKey} value={provKey}>{detail.name}</option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Địa chỉ Email tài khoản</label>
                <input
                  type="email"
                  value={requestFormEmail}
                  onChange={(e) => setRequestFormEmail(e.target.value)}
                  placeholder="Ví dụ: ten.email@congty.vn"
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Lý do yêu cầu (nghiệp vụ)</label>
                <textarea
                  value={requestFormReason}
                  onChange={(e) => setRequestFormReason(e.target.value)}
                  placeholder="Ví dụ: Cần truy cập dữ liệu từ tài khoản này để phân tích báo cáo dự án X."
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-sm outline-none focus:border-primary text-foreground resize-y"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border/60">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold shadow-premium-sm cursor-pointer"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete confirmation dialog */}
      <Dialog.Root open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-card border border-border shadow-premium-lg rounded-xl p-5 outline-none z-50">
            <Dialog.Title className="text-sm font-bold text-foreground">Ngắt kết nối tài khoản?</Dialog.Title>
            <p className="text-xs text-muted-foreground mt-2">
              Bạn có chắc muốn gỡ bỏ liên kết dịch vụ này? AI sẽ không thể truy xuất và chỉ mục dữ liệu mới từ nguồn này nữa.
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteConfirm(confirmDeleteId!)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-premium-sm cursor-pointer"
              >
                Xác nhận gỡ
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
