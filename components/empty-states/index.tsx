import { MessageSquare, FolderOpen, History, Terminal, Plus, Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

// 1. Empty Chat State
export function EmptyChatState({ onAction }: { onAction: (prompt: string) => void }) {
  const suggestions = [
    "Tóm tắt quy định nghỉ phép năm của VinaCorp",
    "Phân tích dữ liệu doanh thu Quý 1 từ báo cáo kiểm toán",
    "Kiểm tra rủi ro hợp đồng đại lý phân phối 2026",
    "Soạn thảo email đề xuất hợp tác kinh doanh gửi Thành Phát"
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 px-4">
      {/* Premium custom SVG / Icon design */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
        <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
          <MessageSquare className="h-8 w-8" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-foreground">Trợ lý ảo AI Doanh nghiệp</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        Chào mừng anh Khang! Hãy đặt câu hỏi hoặc chọn một trong những chủ đề gợi ý dưới đây để phân tích dữ liệu, tóm tắt tài liệu pháp lý hoặc tự động hóa công việc.
      </p>

      {/* Suggested Prompts Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onAction(suggestion)}
            className="p-3.5 text-left text-xs text-muted-foreground hover:text-foreground bg-card hover:bg-secondary/40 border border-border/80 hover:border-primary/45 rounded-xl shadow-premium-sm transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 group cursor-pointer"
          >
            <p className="font-semibold line-clamp-2">{suggestion}</p>
            <span className="text-[10px] text-primary/80 group-hover:text-primary font-medium mt-1.5 inline-flex items-center gap-1">
              Sử dụng Prompt →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 2. Empty Knowledge Folder State
export function EmptyKnowledgeState({ onAction, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-dashed border-border rounded-xl">
      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground mb-4">
        <FolderOpen className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-foreground">Thư mục trống</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        Chưa có tài liệu tri thức nào được tải lên thư mục này. Hãy tải lên các tệp PDF, Excel, Word hoặc liên kết từ Drive.
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-premium-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

// 3. Empty Chat History State
export function EmptyHistoryState({ onAction }: { onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-3">
        <History className="h-5 w-5" />
      </div>
      <h4 className="text-xs font-bold text-foreground">Không tìm thấy hội thoại</h4>
      <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
        Bạn chưa tạo cuộc trò chuyện nào hoặc không tìm thấy hội thoại phù hợp.
      </p>
      <button
        onClick={onAction}
        className="mt-3.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Bắt đầu cuộc chat mới</span>
      </button>
    </div>
  );
}

// 4. Empty Workflows List State
export function EmptyWorkflowState({ onAction, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-dashed border-border rounded-xl">
      <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground mb-4">
        <Terminal className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-foreground">Chưa có luồng công việc</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        Bắt đầu xây dựng quy trình tự động hóa bằng cách tạo mới các bước kết nối giữa các nền tảng Odoo, Salesforce và Google Workspace.
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-premium-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
