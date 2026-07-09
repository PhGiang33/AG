"use client";

import { useEffect, useState } from "react";
import { useAccountStore } from "@/lib/store";
import { AccountCardSkeleton } from "@/components/skeletons";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Cpu, RefreshCw, AlertCircle, CheckCircle2, Trash2, ExternalLink, Loader2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function ConnectedAccountsPage() {
  const { accounts, isConnecting, connectingProvider, connectAccount, disconnectAccount } = useAccountStore();
  const [loading, setLoading] = useState(true);
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [oauthStep, setOauthStep] = useState(1);
  const [emailInput, setEmailInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStartConnect = (provider: string) => {
    setSelectedProvider(provider);
    setEmailInput(
      provider === "google"
        ? "khang.nguyen@vinacorp.vn"
        : provider === "microsoft"
        ? "khang.n@vinacorp.onmicrosoft.com"
        : `khang.nguyen@${provider}.vinacorp.vn`
    );
    setOauthStep(1);
    setOauthModalOpen(true);
  };

  const handleRunOauthFlow = async () => {
    setOauthStep(2); // Show "Connecting & Syncing data..." loading screen
    await connectAccount(
      selectedProvider!,
      emailInput,
      selectedProvider === "google" ? "Google Workspace VinaCorp" : `${selectedProvider?.toUpperCase()} Account`
    );
    setOauthStep(3); // Success state
    setTimeout(() => {
      setOauthModalOpen(false);
    }, 1500);
  };

  const handleDeleteConfirm = (id: string) => {
    disconnectAccount(id);
    setConfirmDeleteId(null);
  };

  const providerDetails = {
    google: {
      name: "Google Workspace",
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24">
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
        <svg className="h-6 w-6" viewBox="0 0 23 23">
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
        <div className="h-6 w-6 rounded-md bg-[#714B67] flex items-center justify-center text-white font-extrabold text-[10px] select-none">
          odoo
        </div>
      ),
      desc: "Truy xuất danh mục bán hàng, kho vận, hóa đơn tài chính và nhân sự."
    },
    salesforce: {
      name: "Salesforce CRM",
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#00A1E0">
          <path d="M18.1 9c.1-.3.1-.6.1-.9 0-2.4-2-4.4-4.4-4.4-1.7 0-3.2 1-3.9 2.4-.6-.5-1.4-.9-2.2-.9-1.9 0-3.5 1.5-3.5 3.5 0 .2 0 .5.1.7C1.8 10.3 0 12.4 0 14.8c0 3 2.5 5.5 5.5 5.5h12.7c3.2 0 5.8-2.6 5.8-5.8 0-2.7-1.8-5-4.4-5.5z" />
        </svg>
      ),
      desc: "So khớp cơ hội bán hàng, thông tin khách hàng tiềm năng B2B."
    },
    hubspot: {
      name: "HubSpot CRM",
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#FF7A59">
          <path d="M21.9 10c.1-.4.1-.8.1-1.2 0-3.3-2.7-6-6-6-2.5 0-4.6 1.5-5.5 3.7C9.7 6.1 8.9 5.8 8 5.8c-2.8 0-5 2.2-5 5 0 .3 0 .6.1.9C1.3 12.6 0 14.5 0 16.7c0 2.8 2.2 5 5 5h13.7c3.1 0 5.6-2.5 5.6-5.6 0-2.6-1.8-4.8-4.4-5.4l2-1.7zM8 19c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        </svg>
      ),
      desc: "Đồng bộ hóa dữ liệu khách hàng liên hệ và chiến dịch marketing."
    }
  };

  const allProviders = ["google", "microsoft", "odoo", "salesforce", "hubspot"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            <span>Kết nối Dịch vụ Doanh nghiệp (Integrations)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Liên kết các kho dữ liệu đám mây và hệ thống quản trị để Cổng thông tin AI có thể học hỏi và tra cứu thông tin chính xác.
          </p>
        </div>
      </div>

      {loading ? (
        <AccountCardSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allProviders.map((provKey) => {
            const detail = providerDetails[provKey as keyof typeof providerDetails];
            const connected = accounts.find((a) => a.provider === provKey);

            return (
              <div
                key={provKey}
                className={cn(
                  "bg-card border rounded-xl p-5 shadow-premium-sm flex flex-col justify-between transition-all relative overflow-hidden group",
                  connected
                    ? connected.status === "error"
                      ? "border-rose-500/30 hover:border-rose-500/50"
                      : "border-border/80 hover:border-primary/30"
                    : "border-border/60 border-dashed hover:border-border hover:bg-secondary/15"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 border border-border/40">
                        {detail.logo}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{detail.name}</h4>
                        {connected && (
                          <span className="text-[10px] text-muted-foreground truncate max-w-[120px] block">
                            {connected.email}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Status Badge */}
                    {connected ? (
                      connected.status === "connected" ? (
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 select-none">
                          <CheckCircle2 className="h-3 w-3" />
                          Connected
                        </span>
                      ) : connected.status === "syncing" ? (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 animate-pulse select-none">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Syncing
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 select-none">
                          <AlertCircle className="h-3 w-3" />
                          Lỗi sync
                        </span>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full select-none">
                        Chưa liên kết
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 line-clamp-3">
                    {detail.desc}
                  </p>
                </div>

                {/* Card Footer Details */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                  <div>
                    {connected && (
                      <p>Đồng bộ lần cuối: <span className="font-semibold">{formatRelativeTime(connected.lastSync)}</span></p>
                    )}
                  </div>
                  <div>
                    {connected ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmDeleteId(connected.id)}
                          className="p-1.5 rounded-md hover:bg-rose-50/15 border border-transparent hover:border-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {connected.status === "error" && (
                          <button
                            onClick={() => handleStartConnect(provKey)}
                            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-[10px] font-bold text-primary transition-colors cursor-pointer"
                          >
                            Xác thực lại
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartConnect(provKey)}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold transition-all shadow-premium-sm inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Liên kết</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OAuth Mock Dialog (Faux authentication interface) */}
      <Dialog.Root open={oauthModalOpen} onOpenChange={setOauthModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border shadow-premium-lg rounded-xl p-6 outline-none z-50">
            {selectedProvider && (
              <div className="space-y-5">
                <div className="flex items-center justify-center mb-2 select-none">
                  <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center border border-border/80 relative shadow-premium-md animate-pulse">
                    {providerDetails[selectedProvider as keyof typeof providerDetails]?.logo}
                  </div>
                </div>

                <Dialog.Title className="text-sm font-bold text-foreground text-center">
                  {oauthStep === 1
                    ? `Kết nối tới ${providerDetails[selectedProvider as keyof typeof providerDetails]?.name}`
                    : oauthStep === 2
                    ? `Đang xác thực bảo mật...`
                    : `Liên kết thành công!`}
                </Dialog.Title>

                {oauthStep === 1 && (
                  <>
                    <p className="text-xs text-muted-foreground text-center">
                      AI Portal cần cấp quyền truy cập các thư mục tài liệu để chỉ mục hóa. Điền email tài khoản doanh nghiệp của bạn:
                    </p>
                    <div className="space-y-1.5 mt-2">
                      <label className="text-[10px] font-bold text-muted-foreground">Email tài khoản</label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs outline-none focus:border-primary text-foreground"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-2">
                      <button
                        onClick={() => setOauthModalOpen(false)}
                        className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-semibold cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={handleRunOauthFlow}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shadow-premium-sm cursor-pointer"
                      >
                        Đồng ý kết nối
                      </button>
                    </div>
                  </>
                )}

                {oauthStep === 2 && (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-xs text-muted-foreground text-center animate-pulse">
                      Đang đồng bộ phân quyền & dữ liệu tài liệu...
                    </p>
                  </div>
                )}

                {oauthStep === 3 && (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-emerald-500 font-bold text-center">
                      Kết nối dịch vụ hoàn tất!
                    </p>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete confirmation dialog */}
      <Dialog.Root open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-card border border-border shadow-premium-lg rounded-xl p-5 outline-none z-50">
            <Dialog.Title className="text-xs font-bold text-foreground">Ngắt kết nối tài khoản?</Dialog.Title>
            <p className="text-[11px] text-muted-foreground mt-2">
              Bạn có chắc muốn gỡ bỏ liên kết dịch vụ này? AI sẽ không thể truy xuất và chỉ mục dữ liệu mới từ nguồn này nữa.
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteConfirm(confirmDeleteId!)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-premium-sm cursor-pointer"
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
