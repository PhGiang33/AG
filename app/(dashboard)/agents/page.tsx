"use client";

// Trang danh sach Agent (AI Assistant)
// Hien thi tat ca cac tro ly AI da duoc tich hop.


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useChatStore } from "@/lib/store";
import { mockAgents, mockFetch } from "@/lib/mock-data";
import { AgentDefinition } from "@/lib/types";
import { Search, Cpu, Key, AlertTriangle, CheckCircle2, RefreshCw, XCircle, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Inline skeleton for Agent cards to keep it tidy
function AgentCardSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="h-3.5 w-full bg-muted rounded" />
        <div className="h-3.5 w-[80%] bg-muted rounded" />
      </div>
      <div className="flex justify-end pt-3">
        <div className="h-8 w-32 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

export default function AgentCenterPage() {
  const router = useRouter();
  const { addConversation } = useChatStore();
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [agents, setAgents] = useState<AgentDefinition[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await mockFetch(mockAgents, 700);
      setAgents(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filterTabs = [
    { id: "All", name: "Tất cả" },
    { id: "google", name: "Google" },
    { id: "microsoft", name: "Microsoft" },
    { id: "odoo", name: "ERP Odoo" },
    { id: "salesforce", name: "Salesforce" }
  ];

  // Mapped agents allowed for each role
  const roleAllowedAgents: Record<string, string[]> = {
    Admin: ["agent-calendar", "agent-email", "agent-erp", "agent-crm", "agent-docs"],
    User: ["agent-calendar", "agent-email", "agent-erp", "agent-crm"]
  };

  const filteredAgents = agents.filter((agent) => {
    const allowedAgentIds = roleAllowedAgents[user.role] || ["agent-calendar", "agent-email", "agent-erp", "agent-crm"];
    if (!allowedAgentIds.includes(agent.id)) return false;

    const matchSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                        agent.tool.toLowerCase().includes(search.toLowerCase()) ||
                        agent.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = selectedFilter === "All" || agent.toolProvider === selectedFilter;
    return matchSearch && matchFilter;
  });

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case "google":
        return (
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        );
      case "microsoft":
        return (
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 23 23">
            <rect x="0" y="0" width="11" height="11" fill="#F25022" />
            <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
            <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
            <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
          </svg>
        );
      case "odoo":
        return (
          <div className="h-5 w-5 rounded bg-[#714B67] flex items-center justify-center text-white font-extrabold text-xs select-none shrink-0">
            odoo
          </div>
        );
      case "salesforce":
        return (
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#00A1E0">
            <path d="M18.1 9c.1-.3.1-.6.1-.9 0-2.4-2-4.4-4.4-4.4-1.7 0-3.2 1-3.9 2.4-.6-.5-1.4-.9-2.2-.9-1.9 0-3.5 1.5-3.5 3.5 0 .2 0 .5.1.7C1.8 10.3 0 12.4 0 14.8c0 3 2.5 5.5 5.5 5.5h12.7c3.2 0 5.8-2.6 5.8-5.8 0-2.7-1.8-5-4.4-5.5z" />
          </svg>
        );
      default:
        return <Cpu className="h-5 w-5 text-muted-foreground shrink-0" />;
    }
  };

  const handleAgentAction = (agent: AgentDefinition) => {
    if (agent.status === "connected") {
      // Create new chat room dedicated to agent
      const convId = addConversation(`Agent ${agent.name.split(" ")[1]} Workspace`, agent.id);
      router.push(`/chat/${convId}?agent=${agent.id}`);
    } else {
      router.push("/settings#accounts");
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 select-none">
            <Cpu className="h-6 w-6 text-primary" />
            <span>Trung tâm Agent (Agent Hub)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 select-none">
            Chọn một Agent chuyên biệt để thao tác trực tiếp với các nguồn dữ liệu công cụ doanh nghiệp của bạn.
          </p>
        </div>
      </div>

      {/* Searching + Filters tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border/40 pb-4 select-none">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedFilter(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                selectedFilter === t.id
                  ? "bg-primary text-primary-foreground border-primary shadow-premium-sm"
                  : "bg-card text-muted-foreground border-border/80 hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/80" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Tìm tên Agent, công cụ..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-card border border-border/80 rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Grid of Agents */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="py-16 text-center bg-card border border-dashed rounded-xl flex flex-col items-center select-none">
          <Cpu className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <h3 className="text-sm font-bold text-foreground">Không tìm thấy Agent</h3>
          <p className="text-sm text-muted-foreground mt-1">Vui lòng chọn bộ lọc khác hoặc nhập từ khóa tìm kiếm khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAgents.map((agent) => {
            const isDisconnected = agent.status === "disconnected";
            const isError = agent.status === "error";
            const isConnected = agent.status === "connected";

            return (
              <div
                key={agent.id}
                className={cn(
                  "bg-card border rounded-xl p-5 shadow-premium-sm flex flex-col justify-between hover:shadow-premium-md transition-all group border-border/80",
                  isDisconnected && "opacity-60 border-dashed hover:opacity-90",
                  isError && "border-rose-500/35 hover:border-rose-500/50"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 border border-border/40 select-none">
                        {getProviderLogo(agent.toolProvider)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleAgentAction(agent)}>
                          {agent.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate select-none">
                          Công cụ: <span className="font-semibold text-foreground/80">{agent.tool}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between select-none">
                  {/* Ledger Teal and Seal Red Badges */}
                  <div>
                    {isConnected && (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                        Connected
                      </span>
                    )}
                    {isDisconnected && (
                      <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                        Disconnected
                      </span>
                    )}
                    {isError && (
                      <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5" title="Mất cấu hình kết nối OAuth">
                        OAuth Error
                      </span>
                    )}
                  </div>

                  <div>
                    {isConnected ? (
                      <button
                        onClick={() => handleAgentAction(agent)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-premium-sm inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Trò chuyện</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAgentAction(agent)}
                        className={cn(
                          "px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all inline-flex items-center gap-1 cursor-pointer",
                          isError
                            ? "bg-rose-500/15 border-rose-500/35 text-rose-500 hover:bg-rose-500/25"
                            : "bg-secondary border-border hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>Cấu hình lại</span>
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
    </div>
  );
}
