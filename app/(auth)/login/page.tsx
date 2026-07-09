"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng điền địa chỉ email");
      return;
    }
    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Dynamic background accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-3xl" />
      
      {/* Top right Theme switch */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card border border-border shadow-premium-lg rounded-2xl p-8 relative z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-8 select-none">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-primary-foreground font-black text-xl shadow-md shadow-primary/20 mb-4 animate-pulse-glow">
            AI
          </div>
          <h1 className="text-xl font-bold text-foreground">Cổng Thông Tin Enterprise AI</h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Đăng nhập hệ thống quản lý tri thức nội bộ VinaCorp
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">
              Địa chỉ Email doanh nghiệp
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten.nhanvien@vinacorp.vn"
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary/35 border border-border/80 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="password">
                Mật khẩu đăng nhập
              </label>
              <a href="#" className="text-[10px] text-primary hover:underline font-bold">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/80" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary/35 border border-border/80 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/95 transition-all shadow-premium-sm disabled:opacity-80 disabled:cursor-not-allowed select-none cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground select-none">
          <Shield className="h-4 w-4 text-emerald-500" />
          <span>Bảo mật 2 lớp SSL & Mã hóa tài liệu ISO 27001</span>
        </div>
      </div>
    </main>
  );
}
