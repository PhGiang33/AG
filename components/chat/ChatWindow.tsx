"use client";

// Day la component Hien thi cua so Chat (ChatWindow)
// Day la noi dien ra toan bo tuong tac giua Nguoi dung va AI (Hien thi tin nhan, typing hieu ung, xu ly logic tra loi).

import { useChatStore } from "@/lib/store";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ThinkingAnimation } from "./ThinkingAnimation";
import { EmptyChatState } from "../empty-states";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Pin, AlertCircle, FileText, LayoutGrid, PanelRightClose, PanelRightOpen, ArrowLeft, Cpu, Calendar, Mail, Server, Shield } from "lucide-react";
import { mockKnowledgeDocs, mockAgents, agentThinkingSteps, mockCalendarEvents, mockEmails, mockERPStock, mockCRMOpportunities } from "@/lib/mock-data";
import { usePathname, useRouter } from "next/navigation";

export function ChatWindow() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    conversations,
    activeConversationId,
    sendMessage,
    addSystemMessage,
    isGenerating,
    setIsGenerating,
    stopGenerationFlag,
    addConversation
  } = useChatStore();

  const [thinking, setThinking] = useState(false); // State hien thi hieu ung AI dang suy nghi
  const [streamingText, setStreamingText] = useState(""); // State luu chuoi text dang duoc stream ra tu tu
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const threadEndRef = useRef<HTMLDivElement>(null); // Ref dung de cuon trang xuong duoi cung
  const [showDataSourcePanel, setShowDataSourcePanel] = useState(true);

  // Lay thong tin doan chat hien tai va Agent dang duoc chon
  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeAgent = activeConv?.agentId ? mockAgents.find((a) => a.id === activeConv.agentId) : null;
  const thinkingSteps = activeConv?.agentId ? agentThinkingSteps[activeConv.agentId] : undefined;

  // Ham tu dong cuon man hinh xuong tin nhan moi nhat
  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, thinking, streamingText]);

  // Ham mo phong (Simulate) logic sinh cau tra loi cua AI dua vao tin nhan cua nguoi dung
  const triggerSimulation = (userMsgId: string) => {
    const userMsg = activeConv?.messages.find((m) => m.id === userMsgId);
    if (!userMsg) return;

    setThinking(true);
    setIsGenerating(true);

    const query = userMsg.content.toLowerCase();
    
    // Choose replies based on query and active agent ID
    let targetReply = "Chào bạn, tôi đã nhận được câu hỏi. Tôi có thể hỗ trợ tra cứu bất kỳ văn bản nào trong Thư mục dữ liệu bên trái. Hãy chọn các tài liệu phù hợp để tôi phân tích nhé.";
    let targetSources: string[] = [];
    let targetAgentData: any = undefined;

    if (activeConv?.agentId) {
      const agentId = activeConv.agentId;
      if (agentId === "agent-calendar") {
        if (query.includes("trùng") || query.includes("xung đột") || query.includes("ngày mai")) {
          targetReply = "Tôi đã kiểm tra và đối chiếu các khung giờ họp ngày mai (10/07/2026). Bạn có 1 lịch họp duy nhất từ 10:00 - 11:00 và **không bị trùng lịch** với sự kiện nào khác. Dưới đây là chi tiết:";
          targetAgentData = { type: "calendar", data: [mockCalendarEvents[2]] };
        } else if (query.includes("đặt lịch") || query.includes("nhắc họp")) {
          targetReply = "Tôi đã lên lịch nhắc họp thành công với Ban Tài chính vào thứ Sáu (10/07/2026) từ 10:00 - 11:00 tại Phòng họp B, Tầng 4. Dưới đây là chi tiết lịch trình của bạn:";
          targetAgentData = { type: "calendar", data: [mockCalendarEvents[2]] };
        } else {
          targetReply = "Tôi đã truy xuất toàn bộ lịch trình tuần này của bạn từ Google Calendar. Bạn có tổng cộng 7 sự kiện, không phát hiện trùng lịch:";
          targetAgentData = { type: "calendar", data: mockCalendarEvents };
        }
      } else if (agentId === "agent-email") {
        if (query.includes("đối tác") || query.includes("thành phát")) {
          targetReply = "Tìm thấy 1 email mới nhất từ Trần Thị Lan (Pháp chế) liên quan đến đối tác Thành Phát gửi lúc 09:15 sáng nay. Chi tiết nội dung tóm tắt:";
          targetAgentData = { type: "email", data: [mockEmails[0]] };
        } else {
          targetReply = "Tôi đã tóm tắt các thư điện tử chưa đọc mới nhất trong Hộp thư đến Gmail của bạn hôm nay:";
          targetAgentData = { type: "email", data: mockEmails };
        }
      } else if (agentId === "agent-erp") {
        if (query.includes("báo giá") || query.includes("abc")) {
          targetReply = "Đã soạn sẵn dự thảo báo giá nháp cho khách hàng ABC Corp trên hệ thống Odoo ERP với đơn giá chiết khấu đại lý. Chi tiết sản phẩm bán hàng:";
          targetAgentData = { type: "erp", data: [mockERPStock[0]] };
        } else {
          targetReply = "Dưới đây là chi tiết tồn kho hiện tại của hệ thống SmartAI Hub và các thiết bị Gateway AI liên quan được trích xuất từ Odoo ERP:";
          targetAgentData = { type: "erp", data: mockERPStock };
        }
      } else if (agentId === "agent-crm") {
        targetReply = "Dưới đây là các cơ hội bán hàng tiềm năng lớn sắp đóng (Close-Date trong tháng 7 và tháng 8) được trích xuất trực tiếp từ Salesforce CRM:";
        targetAgentData = { type: "crm", data: mockCRMOpportunities };
      } else if (agentId === "agent-docs") {
        targetReply = "Tôi đã quét thư mục lưu trữ dữ liệu của bạn trên Google Drive. Dưới đây là các tài liệu liên quan đến hợp đồng đại lý và báo cáo tài chính mới nhất của doanh nghiệp:";
      }
    } else {
      if (query.includes("nghỉ phép") || query.includes("nhân sự")) {
        targetReply = "Chào anh Khang! Dựa trên tài liệu **[Sổ tay nhân sự và Quy tắc ứng xử VinaCorp.docx](file:///D:/Project%20AI/lib/mock-data/index.ts)**, quy định về nghỉ phép của công ty chúng ta như sau:\n\n### 1. Số ngày nghỉ phép năm\n* **Nhân viên chính thức:** Được hưởng **12 ngày** nghỉ phép năm hưởng nguyên lương đối với 12 tháng làm việc.\n* **Chế độ thâm niên:** Cứ mỗi **05 năm** làm việc liên tục tại VinaCorp, nhân viên được cộng thêm **01 ngày** phép thâm niên.\n\n### 2. Quy trình xin nghỉ phép\n1. Tạo đề xuất xin nghỉ trên hệ thống **ERP Odoo** trước ít nhất **03 ngày** làm việc.\n2. Chờ Quản lý trực tiếp phê duyệt trực tuyến.";
        targetSources = ["kd2"];
      } else if (query.includes("doanh số") || query.includes("quý 1") || query.includes("tài chính")) {
        targetReply = "Tôi đã phân tích bảng số liệu **[Báo cáo tài chính kiểm toán Quý 1-2026.xlsx](file:///D:/Project%20AI/lib/mock-data/index.ts)**. Tóm tắt nhanh:\n\n* **Doanh thu thuần:** 120.450.000.000 VNĐ, tăng **15.4%** so với Quý 1/2025.\n* **Biên lợi nhuận gộp:** Tăng lên **37.4%** nhờ tối ưu tốt đơn giá nguyên vật liệu đầu vào.\n* **Lợi nhuận ròng:** Đạt 23.830.000.000 VNĐ.\n\nAnh cần chiết xuất thông tin về khoản mục chi phí nào cụ thể hơn không?";
        targetSources = ["kd3"];
      } else if (query.includes("hợp đồng") || query.includes("thành phát") || query.includes("rủi ro")) {
        targetReply = "Tôi đã phân tích bản thảo **[Hợp đồng nguyên tắc đại lý phân phối 2026.docx](file:///D:/Project%20AI/lib/mock-data/index.ts)** và phát hiện 3 điểm rủi ro lớn:\n\n1. **Điều 2 (Chiết khấu):** Ghi nhận chiết khấu đại lý từ 25-35% nhưng chưa gắn kèm điều kiện doanh số chỉ tiêu KPI chi tiết.\n2. **Điều 5 (Bảo mật):** Thiếu điều khoản phạt tài chính cụ thể nếu bên B làm rò rỉ dữ liệu hoặc kéo khách hàng của VinaCorp đi nơi khác.\n3. **Điều 4 (Thanh toán):** Cho hạn nợ lên tới 45 ngày gối đầu, dễ gây đọng vốn lưu động.";
        targetSources = ["kd5"];
      } else if (query.includes("bài pr") || query.includes("SEO") || query.includes("marketing")) {
        targetReply = "Dưới đây là phác thảo bài PR SEO công bố sản phẩm mới **Enterprise AI Portal**:\n\n### Tiêu đề: VinaCorp chính thức ra mắt giải pháp tối ưu quản trị doanh nghiệp Enterprise AI Portal\n\n### Nội dung chính:\n* Giới thiệu cổng thông tin AI kết nối trực tiếp Odoo ERP, Salesforce CRM.\n* Trích dẫn từ Giám đốc công nghệ: 'Sản phẩm giúp rút ngắn 40% thời gian tra cứu báo cáo nội bộ'.\n* Đáp ứng tiêu chuẩn bảo mật dữ liệu ISO 27001.\n\nTôi có thể lưu bản nháp này dưới dạng tệp Word vào thư mục Tri thức của bạn.";
        targetSources = ["kd4", "kd6"];
      }
    }

    // Delay 2.2 giay de chay hieu ung 'AI dang suy nghi', sau do bat dau stream chu ra
    setTimeout(() => {
      setThinking(false);
      setStreamingMessageId("streaming");
      
      let index = 0;
      const interval = setInterval(() => {
        // Check if user clicked STOP
        if (useChatStore.getState().stopGenerationFlag) {
          clearInterval(interval);
          setStreamingMessageId(null);
          setStreamingText("");
          setIsGenerating(false);
          return;
        }

        const chunkSize = Math.floor(Math.random() * 3) + 1;
        index += chunkSize;
        
        if (index >= targetReply.length) {
          clearInterval(interval);
          addSystemMessage(activeConversationId!, targetReply, targetSources, targetAgentData);
          setStreamingMessageId(null);
          setStreamingText("");
          setIsGenerating(false);
        } else {
          setStreamingText(targetReply.slice(0, index));
        }
      }, 30);
    }, 2200);
  };

  // Xu ly su kien khi bam Enter de gui tin nhan
  const handleSend = (text: string) => {
    sendMessage(text, triggerSimulation);
  };

  // Ham tao doan chat moi
  const handleCreateChat = () => {
    addConversation("Đoạn chat mới");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-card/10 rounded-2xl border border-border/80 shadow-premium-sm overflow-hidden relative">
      {/* Upper header details */}
      <div className="px-5 py-3 border-b border-border/80 bg-card flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 truncate select-none font-display">
            {activeAgent && (
              <Cpu className="h-4 w-4 text-primary shrink-0" />
            )}
            <span>{activeAgent ? activeAgent.name : (activeConv ? activeConv.title : "Tạo đoạn Chat mới")}</span>
            {activeAgent && (
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none border border-emerald-500/20 shrink-0">
                {activeAgent.tool}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground truncate mt-0.5 select-none">
            {activeConv && activeConv.messages.length > 0
              ? `${activeConv.messages.length} tin nhắn`
              : activeAgent
              ? `Không gian làm việc riêng cho ${activeAgent.name}`
              : "Bắt đầu cuộc hội thoại học máy"}
          </p>
        </div>

        <div className="flex items-center gap-2 select-none">
          {activeConv?.agentId && (
            <button
              onClick={() => router.push("/agents")}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary hover:bg-secondary/80 text-xs font-bold text-rose-500 rounded border border-border/80 cursor-pointer transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Thoát Agent</span>
            </button>
          )}
          <button
            onClick={handleCreateChat}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Đoạn chat mới"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main chat thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar">
        {!activeConv || activeConv.messages.length === 0 ? (
          <EmptyChatState onAction={handleSend} agentId={activeConv?.agentId} />
        ) : (
          <div className="space-y-4">
            {activeConv.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Simulated agent steps log */}
            {thinking && <ThinkingAnimation steps={thinkingSteps} />}

            {/* Simulated live streaming bubble */}
            {streamingMessageId === "streaming" && (
              <div className="flex gap-3 max-w-3xl mx-auto py-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                  AI
                </div>
                <div className="flex-1 min-w-0 max-w-[80%] flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground/80">AI Assistant</span>
                    <span className="text-xs text-muted-foreground/60">Gõ chữ...</span>
                  </div>
                  <div className="rounded-xl px-4 py-3 border border-border/80 bg-card shadow-premium-sm text-sm text-foreground leading-relaxed rounded-tl-none mr-auto typing-cursor">
                    {/* Render live text with helper formatting replacement */}
                    <div dangerouslySetInnerHTML={{
                      __html: streamingText
                        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
                        .replace(/\n/g, "<br/>")
                    }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>
        )}
      </div>

      {/* Input section */}
      <div className="p-4 border-t border-border/80 bg-card/60 backdrop-blur-sm">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
