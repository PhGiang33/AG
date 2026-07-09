"use client";

import { CalendarEvent, EmailItem, ERPStockItem, CRMOpportunity } from "@/lib/types";
import { Calendar, Clock, MapPin, Mail, Server, Shield, FileText, CheckCircle2, AlertCircle, ArrowRight, ExternalLink, Inbox } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface AgentResultCardProps {
  type: "calendar" | "email" | "erp" | "crm";
  data: any;
}

export function AgentResultCard({ type, data }: AgentResultCardProps) {
  if (!data) return null;

  switch (type) {
    case "calendar":
      return <CalendarResultView events={data as CalendarEvent[]} />;
    case "email":
      return <EmailResultView emails={data as EmailItem[]} />;
    case "erp":
      return <ERPResultView items={data as ERPStockItem[]} />;
    case "crm":
      return <CRMResultView deals={data as CRMOpportunity[]} />;
    default:
      return null;
  }
}

// 1. Google Calendar Structured Result
function CalendarResultView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  // Create relative dates labels for the next few days in Vietnamese
  const getDayLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateObj = new Date(dateStr);
    dateObj.setHours(0,0,0,0);

    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayName = daysOfWeek[new Date(dateStr).getDay()];
    const formattedDate = new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (diffDays === 0) return `Hôm nay · ${dayName}, ${formattedDate}`;
    if (diffDays === 1) return `Ngày mai · ${dayName}, ${formattedDate}`;
    return `${dayName}, ${formattedDate}`;
  };

  // Ensure we group all events
  events.forEach((e) => {
    if (!groupedEvents[e.date]) {
      groupedEvents[e.date] = [];
    }
    groupedEvents[e.date].push(e);
  });

  // Keep a structured list of dates we want to show
  const dates = Object.keys(groupedEvents).sort();

  return (
    <div className="w-full bg-card border border-border/80 rounded-xl overflow-hidden shadow-premium-sm max-w-xl select-none">
      <div className="bg-secondary/40 px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Lịch biểu chi tiết tuần này</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">Google Calendar</span>
      </div>

      <div className="divide-y divide-border/50">
        {dates.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center">
            <Inbox className="h-6 w-6 text-muted-foreground/30 mb-1" />
            <span>Không có lịch hẹn nào sắp tới</span>
          </div>
        ) : (
          dates.map((date) => (
            <div key={date} className="p-4 space-y-2.5">
              <h5 className="text-[11px] font-bold text-primary/90 tracking-wide uppercase">
                {getDayLabel(date)}
              </h5>
              <div className="space-y-2">
                {groupedEvents[date].map((event) => {
                  const isInternal = event.type === "internal";
                  const isClient = event.type === "client";
                  return (
                    <div
                      key={event.id}
                      className="flex items-start justify-between gap-3 text-xs p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/40"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              isInternal ? "bg-emerald-500" : isClient ? "bg-indigo-500" : "bg-amber-500"
                            )}
                          />
                          <span className="font-bold text-foreground">{event.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground pl-4">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="font-mono">{event.startTime} - {event.endTime}</span>
                          <span className="text-border">|</span>
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                      </div>
                      
                      {event.location.includes("Meet") && (
                        <a
                          href="https://meet.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold rounded flex items-center gap-0.5 shrink-0 transition-colors"
                        >
                          <span>Meet</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-secondary/20 border-t border-border/60 px-4 py-3 flex gap-2 justify-end">
        <button className="px-2.5 py-1 bg-secondary text-[10px] font-bold text-muted-foreground hover:text-foreground border border-border/80 rounded transition-colors cursor-pointer">
          Xuất file .ics
        </button>
        <button className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded shadow-premium-sm hover:bg-primary/95 transition-all cursor-pointer">
          Đồng bộ vào lịch của tôi
        </button>
      </div>
    </div>
  );
}

// 2. Gmail Inbox Structured Result
function EmailResultView({ emails }: { emails: EmailItem[] }) {
  return (
    <div className="w-full bg-card border border-border/80 rounded-xl overflow-hidden shadow-premium-sm max-w-xl select-none">
      <div className="bg-secondary/40 px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-primary" />
          <span>Danh sách thư điện tử chưa đọc</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">Gmail</span>
      </div>

      <div className="divide-y divide-border/50">
        {emails.map((m) => (
          <div key={m.id} className="p-3.5 hover:bg-secondary/20 transition-all flex gap-3 items-start relative">
            {m.unread && (
              <span className="absolute left-2.5 top-5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
            <div className="flex-1 min-w-0 pl-1">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("text-xs font-semibold text-foreground truncate", m.unread && "font-extrabold")}>
                  {m.from}
                </span>
                <span className="text-[9px] text-muted-foreground shrink-0 font-mono">{m.date}</span>
              </div>
              <h6 className={cn("text-[11px] text-foreground/90 mt-0.5 truncate", m.unread && "font-semibold")}>
                {m.subject}
              </h6>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                {m.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Odoo ERP Structured Result
function ERPResultView({ items }: { items: ERPStockItem[] }) {
  return (
    <div className="w-full bg-card border border-border/80 rounded-xl overflow-hidden shadow-premium-sm max-w-2xl select-none">
      <div className="bg-secondary/40 px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Server className="h-4 w-4 text-primary" />
          <span>Danh mục tồn kho Odoo ERP</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">Odoo ERP</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/20 border-b border-border/50 text-muted-foreground font-bold">
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Mã SKU</th>
              <th className="p-3 text-right">Tồn kho</th>
              <th className="p-3">Vị trí</th>
              <th className="p-3 text-right">Đơn giá (VND)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {items.map((i) => (
              <tr key={i.id} className="hover:bg-secondary/15 transition-colors">
                <td className="p-3 font-semibold text-foreground">{i.name}</td>
                <td className="p-3 font-mono text-[10px] text-muted-foreground">{i.sku}</td>
                <td className="p-3 text-right font-bold text-foreground">{i.stock.toLocaleString()}</td>
                <td className="p-3 text-muted-foreground">{i.location}</td>
                <td className="p-3 text-right font-bold text-primary">{formatCurrency(i.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. Salesforce CRM Structured Result
function CRMResultView({ deals }: { deals: CRMOpportunity[] }) {
  return (
    <div className="w-full bg-card border border-border/80 rounded-xl overflow-hidden shadow-premium-sm max-w-xl select-none">
      <div className="bg-secondary/40 px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <span>Cơ hội kinh doanh tiềm năng</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">Salesforce CRM</span>
      </div>

      <div className="divide-y divide-border/50">
        {deals.map((d) => {
          const isNegotiation = d.stage === "Negotiation";
          const isWon = d.stage === "Closed Won";
          const isProposal = d.stage === "Proposal";

          return (
            <div key={d.id} className="p-4 hover:bg-secondary/10 transition-all flex justify-between items-center gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <h5 className="text-xs font-bold text-foreground truncate">{d.name}</h5>
                <p className="text-[10px] text-muted-foreground truncate">Khách hàng: {d.client}</p>
                <p className="text-[9px] text-muted-foreground">Dự kiến đóng: {d.closeDate}</p>
              </div>

              <div className="text-right space-y-1.5 shrink-0">
                <div className="text-xs font-bold text-foreground font-mono">
                  {formatCurrency(d.value)}
                </div>
                <div>
                  <span
                    className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full select-none",
                      isWon
                        ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
                        : isNegotiation
                        ? "text-indigo-500 bg-indigo-500/10 border border-indigo-500/20"
                        : isProposal
                        ? "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                        : "text-muted-foreground bg-secondary"
                    )}
                  >
                    {d.stage}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
