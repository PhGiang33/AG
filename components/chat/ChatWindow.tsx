"use client";

import { useChatStore } from "@/lib/store";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ThinkingAnimation } from "./ThinkingAnimation";
import { EmptyChatState } from "../empty-states";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Pin, AlertCircle, FileText, LayoutGrid, PanelRightClose, PanelRightOpen } from "lucide-react";
import { mockKnowledgeDocs } from "@/lib/mock-data";
import { usePathname } from "next/navigation";

export function ChatWindow() {
  const pathname = usePathname();
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

  const [thinking, setThinking] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const threadEndRef = useRef<HTMLDivElement>(null);
  const [showDataSourcePanel, setShowDataSourcePanel] = useState(true);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, thinking, streamingText]);

  // Handle mock generation logic
  const triggerSimulation = (userMsgId: string) => {
    const userMsg = activeConv?.messages.find((m) => m.id === userMsgId);
    if (!userMsg) return;

    setThinking(true);
    setIsGenerating(true);

    const query = userMsg.content.toLowerCase();
    
    // Choose replies based on query
    let targetReply = "Chào bạn, tôi đã nhận được câu hỏi. Tôi có thể hỗ trợ tra cứu bất kỳ văn bản nào trong Thư mục dữ liệu bên trái. Hãy chọn các tài liệu phù hợp để tôi phân tích nhé.";
    let targetSources: string[] = [];

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

    // Delay thinking animations for 2.2s, then stream text
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
          addSystemMessage(activeConversationId!, targetReply, targetSources);
          setStreamingMessageId(null);
          setStreamingText("");
          setIsGenerating(false);
        } else {
          setStreamingText(targetReply.slice(0, index));
        }
      }, 30);
    }, 2200);
  };

  const handleSend = (text: string) => {
    sendMessage(text, triggerSimulation);
  };

  const handleCreateChat = () => {
    addConversation("Đoạn chat mới");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-card/10 rounded-2xl border border-border/80 shadow-premium-sm overflow-hidden relative">
      {/* Upper header details */}
      <div className="px-5 py-3 border-b border-border/80 bg-card flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-xs font-bold text-foreground truncate">
            {activeConv ? activeConv.title : "Tạo đoạn Chat mới"}
          </h2>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {activeConv && activeConv.messages.length > 0
              ? `${activeConv.messages.length} tin nhắn`
              : "Bắt đầu cuộc hội thoại học máy"}
          </p>
        </div>

        <div className="flex gap-2">
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
          <EmptyChatState onAction={handleSend} />
        ) : (
          <div className="space-y-4">
            {activeConv.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Simulated agent steps log */}
            {thinking && <ThinkingAnimation />}

            {/* Simulated live streaming bubble */}
            {streamingMessageId === "streaming" && (
              <div className="flex gap-3 max-w-3xl mx-auto py-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  AI
                </div>
                <div className="flex-1 min-w-0 max-w-[80%] flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground/80">AI Assistant</span>
                    <span className="text-[9px] text-muted-foreground/60">Gõ chữ...</span>
                  </div>
                  <div className="rounded-xl px-4 py-3 border border-border/80 bg-card shadow-premium-sm text-xs text-foreground leading-relaxed rounded-tl-none mr-auto typing-cursor">
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
