import { User, Conversation, ConnectedAccount, KnowledgeDoc, Workflow, PromptTemplate, AuditLog, SystemStat, CalendarEvent, AgentDefinition, EmailItem, ERPStockItem, CRMOpportunity, ThinkingStep } from "../types";

export const mockUser: User = {
  id: "u1",
  name: "Nguyễn Minh Khang",
  email: "khang.nguyen@vinacorp.vn",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  role: "Admin",
  department: "Ban Công Nghệ Thông Tin"
};

export const mockAccounts: ConnectedAccount[] = [
  {
    id: "a1",
    provider: "google",
    name: "Google Workspace VinaCorp",
    email: "khang.nguyen@vinacorp.vn",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    permissions: ["Gmail", "Google Drive", "Calendar"]
  },
  {
    id: "a2",
    provider: "microsoft",
    name: "Microsoft 365 Enterprise",
    email: "khang.n@vinacorp.onmicrosoft.com",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    permissions: ["SharePoint", "OneDrive", "Outlook"]
  },
  {
    id: "a3",
    provider: "odoo",
    name: "Hệ thống ERP Odoo VinaCorp",
    email: "khang.nguyen@erp.vinacorp.vn",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    permissions: ["Sales", "Inventory", "HRMS"]
  },
  {
    id: "a4",
    provider: "salesforce",
    name: "Salesforce CRM",
    email: "khang.nguyen@salesforce.vinacorp.vn",
    status: "error",
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    permissions: ["Leads", "Accounts", "Opportunities"]
  },
  {
    id: "a5",
    provider: "hubspot",
    name: "HubSpot Marketing Suite",
    email: "mkt.khang@vinacorp.vn",
    status: "syncing",
    lastSync: new Date(Date.now() - 1000 * 60 * 2),
    permissions: ["Contacts", "Deals"]
  }
];

export const mockKnowledgeDocs: KnowledgeDoc[] = [
  {
    id: "kd1",
    title: "Quyết định thành lập và sơ đồ tổ chức VinaCorp 2026.pdf",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: new Date("2026-01-15T08:30:00Z"),
    updatedBy: "Trần Thị Lan",
    category: "Pháp lý & Tổ chức",
    tags: ["Sơ đồ tổ chức", "Quy chế", "Quyết định"],
    folderPath: "Quy định & Chính sách",
    content: "TẬP ĐOÀN VINACORP\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nSố: 15/2026/QĐ-HDQT\n\nQUYẾT ĐỊNH\nVề việc Phê duyệt Sơ đồ Tổ chức và Định biên Nhân sự năm 2026...\nBan hành cơ cấu tổ chức gồm: Hội đồng Quản trị, Tổng Giám đốc, Ban Kiểm soát, Ban Công nghệ Thông tin, Ban Tài chính, Ban Nhân sự và 4 Khối kinh doanh..."
  },
  {
    id: "kd2",
    title: "Sổ tay nhân sự và Quy tắc ứng xử VinaCorp.docx",
    type: "docx",
    size: "1.8 MB",
    updatedAt: new Date("2026-02-10T10:15:00Z"),
    updatedBy: "Phạm Văn Minh",
    category: "Nhân sự (HR)",
    tags: ["Sổ tay nhân viên", "Nội quy", "Lương thưởng"],
    folderPath: "Quy định & Chính sách",
    content: "SỔ TAY NHÂN VIÊN VINACORP\n\nChào mừng bạn gia nhập VinaCorp! Sổ tay này nhằm cung cấp thông tin về quy trình làm việc, giờ giấc, chính sách phúc lợi và các quy tắc ứng xử chuẩn mực...\n- Giờ làm việc: 8:00 - 17:30 (nghỉ trưa từ 12:00 - 13:30), thứ Hai đến thứ Sáu.\n- Trang phục: Lịch sự, công sở chuyên nghiệp..."
  },
  {
    id: "kd3",
    title: "Báo cáo tài chính kiểm toán Quý 1-2026.xlsx",
    type: "xlsx",
    size: "4.2 MB",
    updatedAt: new Date("2026-04-20T16:45:00Z"),
    updatedBy: "Nguyễn Lê Hoàng",
    category: "Tài chính",
    tags: ["Báo cáo tài chính", "Quý 1", "Kiểm toán"],
    folderPath: "Báo cáo Tài chính",
    content: "BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH QUÝ 1 - 2026\n(Đơn vị tính: VNĐ)\n\n1. Doanh thu thuần: 120.450.000.000 VNĐ\n2. Giá vốn hàng bán: 75.320.000.000 VNĐ\n3. Lợi nhuận gộp: 45.130.000.000 VNĐ\n4. Chi phí bán hàng: 12.400.000.000 VNĐ\n5. Chi phí quản lý doanh nghiệp: 8.900.000.000 VNĐ\n6. Lợi nhuận thuần từ HĐKD: 23.830.000.000 VNĐ\nTăng trưởng 15.4% so với cùng kỳ năm 2025."
  },
  {
    id: "kd4",
    title: "Kế hoạch tiếp thị sản phẩm SmartAI Hub.pptx",
    type: "pptx",
    size: "8.7 MB",
    updatedAt: new Date("2026-05-05T14:20:00Z"),
    updatedBy: "Hoàng Mĩ Linh",
    category: "Marketing",
    tags: ["Sản phẩm mới", "Slide", "Marketing Plan"],
    folderPath: "Tài liệu Dự án",
    content: "KẾ HOẠCH TÙNG RA SẢN PHẨM SMARTAI HUB - Q3/2026\n\nSlide 1: Giới thiệu sản phẩm SmartAI Hub - Giải pháp quản trị tri thức doanh nghiệp bằng AI.\nSlide 2: Khách hàng mục tiêu: Các tập đoàn vừa và lớn tại Việt Nam có nhu cầu tự động hóa.\nSlide 3: Kênh truyền thông chủ lực: Tech Events, PR Báo chí lớn (VnExpress, Cafef), LinkedIn Ads..."
  },
  {
    id: "kd5",
    title: "Hợp đồng nguyên tắc đại lý phân phối 2026.docx",
    type: "docx",
    size: "1.1 MB",
    updatedAt: new Date("2026-03-01T09:00:00Z"),
    updatedBy: "Trần Thị Lan",
    category: "Pháp lý & Tổ chức",
    tags: ["Hợp đồng", "Đại lý", "Mẫu chuẩn"],
    folderPath: "Mẫu Hợp đồng",
    content: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG NGUYÊN TẮC PHÂN PHỐI SẢN PHẨM\n(Số: 88/2026/HĐNT-VNC)\n\nBÊN A: CÔNG TY CỔ PHẦN TẬP ĐOÀN VINACORP\nBÊN B: CÔNG TY TNHH PHÁT TRIỂN CÔNG NGHỆ THÀNH PHÁT\nĐiều 1: Phạm vi phân phối sản phẩm phần mềm SmartAI...\nĐiều 2: Chiết khấu đại lý dao động từ 25% đến 35% tùy thuộc vào doanh số quý..."
  },
  {
    id: "kd6",
    title: "Báo cáo phân tích đối thủ cạnh tranh thị trường AI Portal.pdf",
    type: "pdf",
    size: "5.1 MB",
    updatedAt: new Date("2026-06-15T11:30:00Z"),
    updatedBy: "Hoàng Mĩ Linh",
    category: "Marketing",
    tags: ["Nghiên cứu thị trường", "Đối thủ", "AI Portal"],
    folderPath: "Tài liệu Dự án",
    content: "BÁO CÁO PHÂN TÍCH THỊ TRƯỜNG ENTERPRISE AI PORTAL 2026\n\nTại Việt Nam, xu hướng ứng dụng AI tạo sinh (GenAI) trong doanh nghiệp đang tăng mạnh. Các đối thủ chính bao gồm:\n- Co-pilot của Microsoft (Ưu điểm: Tích hợp tốt Office, Nhược điểm: Giá cao, khó tùy biến sâu theo ERP Việt Nam).\n- OpenAI Enterprise (Ưu điểm: Mô hình mạnh nhất, Nhược điểm: Chưa tích hợp sẵn các hệ thống ERP nội địa like Odoo, MISA)...\nGiải pháp định vị của VinaCorp: Chuyên biệt hóa tích hợp dữ liệu nội địa Việt Nam."
  },
  {
    id: "kd7",
    title: "Chính sách bảo mật thông tin và An toàn dữ liệu.pdf",
    type: "pdf",
    size: "1.9 MB",
    updatedAt: new Date("2026-02-28T15:00:00Z"),
    updatedBy: "Nguyễn Minh Khang",
    category: "IT Security",
    tags: ["Bảo mật", "Chính sách", "ISO 27001"],
    folderPath: "Quy định & Chính sách",
    content: "CHÍNH SÁCH AN TOÀN THÔNG TIN VINACORP (ISO 27001)\n\n1. Quy định mật khẩu: Tối thiểu 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Đổi định kỳ 90 ngày.\n2. Phân quyền dữ liệu (Role-Based Access Control): Nhân viên chỉ có quyền truy cập dữ liệu thuộc bộ phận hoặc dự án được chỉ định.\n3. Cấm sao chép mã nguồn và dữ liệu khách hàng ra các thiết bị ngoại vi cá nhân."
  },
  {
    id: "kd8",
    title: "Danh sách khách hàng doanh nghiệp Key Accounts 2026.xlsx",
    type: "xlsx",
    size: "2.8 MB",
    updatedAt: new Date("2026-06-30T10:00:00Z"),
    updatedBy: "Phạm Văn Minh",
    category: "Kinh doanh (Sales)",
    tags: ["Khách hàng", "Key Accounts", "Doanh số"],
    folderPath: "Kế hoạch",
    content: "DANH SÁCH KHÁCH HÀNG TRỌNG ĐIỂM VINACORP - NĂM 2026\n\n1. Tập đoàn Xây dựng Hòa Bình - Doanh thu kỳ vọng: 15 tỷ VNĐ - Người phụ trách: Lê Văn Hải.\n2. Ngân hàng Vietcombank (Khối Bán lẻ) - Doanh thu kỳ vọng: 45 tỷ VNĐ - Người phụ trách: Nguyễn Minh Khang.\n3. Tổng công ty Hàng không Việt Nam (Vietnam Airlines) - Doanh thu kỳ vọng: 30 tỷ VNĐ - Người phụ trách: Phạm Văn Minh..."
  }
];

export const mockWorkflows: Workflow[] = [
  {
    id: "wf1",
    name: "Tự động hóa Đồng bộ và Kiểm tra Tài liệu Pháp lý mới",
    description: "Quét Google Drive/OneDrive, đồng bộ hợp đồng vào Knowledge Base, phân tích rủi ro pháp lý bằng AI và gửi cảnh báo về Teams/Slack.",
    status: "success",
    lastRun: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    category: "Pháp lý",
    steps: [
      { id: "s1_1", name: "Quét thư mục Google Drive", description: "Quét thư mục /Hợp đồng/2026 để tìm file mới", status: "success", duration: "1.2s" },
      { id: "s1_2", name: "Tải file và đồng bộ", description: "Đồng bộ file mới phát hiện vào hệ thống tri thức", status: "success", duration: "3.5s" },
      { id: "s1_3", name: "Phân tích nội dung AI", description: "Trích xuất điều khoản, kiểm tra rủi ro phạt hợp đồng", status: "success", duration: "8.2s" },
      { id: "s1_4", name: "Gửi báo cáo & Cảnh báo", description: "Gửi tóm tắt pháp lý đến ban điều hành qua Teams", status: "success", duration: "1.1s" }
    ],
    logs: [
      { timestamp: "08:45:00", level: "info", message: "Khởi tạo tiến trình quét thư mục hợp đồng trên Google Drive." },
      { timestamp: "08:45:01", level: "info", message: "Phát hiện 1 hợp đồng mới: 'Hop_Dong_Thue_Thiet_Bi_2026.docx'." },
      { timestamp: "08:45:05", level: "info", message: "Tải file hoàn tất. Bắt đầu phân tích văn bản pháp lý..." },
      { timestamp: "08:45:10", level: "info", message: "AI hoàn thành phân tích: Trích xuất thành công 5 điều khoản trọng yếu. Phát hiện cảnh báo rủi ro bồi thường ở Điều 8." },
      { timestamp: "08:45:13", level: "info", message: "Đã gửi thông tin tóm tắt và cảnh báo về kênh Microsoft Teams #PhapLy-BanGiamDoc." },
      { timestamp: "08:45:14", level: "info", message: "Tiến trình kết thúc thành công." }
    ]
  },
  {
    id: "wf2",
    name: "Đối chiếu Dữ liệu Bán hàng ERP Odoo và CRM Salesforce",
    description: "Lấy báo cáo doanh thu từ Odoo, đối chiếu với cơ hội bán hàng đã đóng trên Salesforce, tìm các sai lệch về chiết khấu và báo cáo cho kiểm toán.",
    status: "failed",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    category: "Tài chính",
    steps: [
      { id: "s2_1", name: "Lấy dữ liệu Odoo", description: "Truy xuất hóa đơn bán hàng trong tháng từ Odoo API", status: "success", duration: "2.4s" },
      { id: "s2_2", name: "Lấy dữ liệu Salesforce", description: "Truy xuất cơ hội Closed-Won trong tháng từ Salesforce API", status: "failed", duration: "5.1s" },
      { id: "s2_3", name: "Đối chiếu dữ liệu", description: "So khớp mã đơn hàng và kiểm tra chênh lệch doanh số", status: "pending" },
      { id: "s2_4", name: "Xuất báo cáo sai lệch", description: "Gửi báo cáo qua Email đến Giám đốc tài chính", status: "pending" }
    ],
    logs: [
      { timestamp: "06:12:00", level: "info", message: "Khởi tạo tiến trình đối chiếu dữ liệu doanh thu tháng." },
      { timestamp: "06:12:02", level: "info", message: "Lấy thành công 142 hóa đơn từ Odoo ERP." },
      { timestamp: "06:12:03", level: "info", message: "Kết nối đến Salesforce API tại salesforce.vinacorp.vn..." },
      { timestamp: "06:12:08", level: "error", message: "Kết nối Salesforce API thất bại: OAuth Token hết hạn hoặc không hợp lệ. Vui lòng kết nối lại tài khoản Salesforce trong trang Connected Accounts." },
      { timestamp: "06:12:08", level: "error", message: "Tiến trình dừng đột ngột tại Bước 2." }
    ]
  },
  {
    id: "wf3",
    name: "Tự động Lập Báo cáo Tổng kết Hoạt động Tuần ban Nhân sự",
    description: "Thu thập số liệu tuyển dụng từ HRMS, dữ liệu chấm công từ Odoo, tổng hợp thành báo cáo định dạng PDF và tự động gửi email cho Ban giám đốc sáng thứ Hai.",
    status: "idle",
    category: "Nhân sự",
    steps: [
      { id: "s3_1", name: "Thu thập dữ liệu tuyển dụng", description: "Trích xuất số lượng ứng viên, lượt phỏng vấn trong tuần", status: "pending" },
      { id: "s3_2", name: "Tổng hợp dữ liệu chấm công", description: "Lấy tỷ lệ đi muộn, nghỉ phép từ Odoo", status: "pending" },
      { id: "s3_3", name: "Soạn thảo văn bản báo cáo", description: "Dùng LLM viết nhận xét tổng quan và lập bảng biểu", status: "pending" },
      { id: "s3_4", name: "Gửi Email báo cáo", description: "Gửi PDF tự động tới board@vinacorp.vn", status: "pending" }
    ],
    logs: []
  }
];

export const mockPrompts: PromptTemplate[] = [
  {
    id: "pr1",
    title: "Phân tích Hợp đồng & Phát hiện Rủi ro Pháp lý",
    prompt: "Bạn là một Luật sư Doanh nghiệp cao cấp. Hãy phân tích hợp đồng đính kèm dưới đây. Xác định các nội dung sau:\n1. Các nghĩa vụ chính của hai bên.\n2. Các điều khoản phạt hợp đồng và bồi thường thiệt hại (Đặc biệt chú ý điều khoản bất lợi).\n3. Những điểm mập mờ cần đàm phán lại.\n4. Đề xuất phương án sửa đổi cụ thể cho từng điều khoản rủi ro.\n\nDưới đây là nội dung hợp đồng:\n[NỘI DUNG HỢP ĐỒNG]",
    category: "Technical",
    description: "Trích xuất nghĩa vụ, phân tích điều khoản rủi ro và kiến nghị sửa đổi hợp đồng kinh tế.",
    usageCount: 142,
    isFavorite: true
  },
  {
    id: "pr2",
    title: "Soạn thảo Email Đề xuất Hợp tác Kinh doanh",
    prompt: "Hãy viết một email đề xuất hợp tác gửi tới đối tác cấp cao đại diện công ty [Tên Đối Tác]. Chúng tôi là VinaCorp, muốn đề xuất cung cấp giải pháp AI cho họ. Email cần thể hiện sự chuyên nghiệp, tôn trọng, nêu bật giá trị cốt lõi (tiết kiệm 30% chi phí vận hành), và đề xuất một cuộc họp ngắn 15 phút qua Teams vào tuần tới.\n\nTông giọng: Chuyên nghiệp, tự tin nhưng khiêm tốn.",
    category: "Marketing",
    description: "Soạn email cold-outreach chất lượng cao gửi cho khách hàng B2B doanh nghiệp lớn.",
    usageCount: 98,
    isFavorite: false
  },
  {
    id: "pr3",
    title: "Lập Báo cáo Tóm tắt Doanh thu & Dự báo",
    prompt: "Dựa trên dữ liệu tài chính dạng bảng sau đây, hãy viết báo cáo tóm tắt tình hình kinh doanh:\n1. Nêu rõ các chỉ số tăng trưởng chính (Doanh số, Lợi nhuận gộp, Biên lợi nhuận).\n2. Điểm danh 3 sản phẩm/khu vực đóng góp doanh số cao nhất.\n3. Đưa ra 3 dự báo xu hướng doanh thu trong 3 tháng tới dựa trên tốc độ tăng trưởng hiện tại.\n4. Đề xuất 3 hành động khẩn cấp để cải thiện biên lợi nhuận.\n\nDữ liệu đầu vào:\n[DỮ LIỆU TÀI CHÍNH]",
    category: "Finance",
    description: "Tổng hợp dữ liệu doanh số thô thành báo cáo phân tích tài chính mạch lạc.",
    usageCount: 220,
    isFavorite: true
  },
  {
    id: "pr4",
    title: "Phỏng vấn Ứng viên Senior Frontend Developer",
    prompt: "Hãy đóng vai là Trưởng phòng Kỹ thuật của VinaCorp. Soạn bộ câu hỏi phỏng vấn gồm 5 câu chuyên sâu về React 19, Server Components, tối ưu hóa CSS Tailwind v4 và quản lý state với Zustand cho vị trí Senior Frontend Engineer. Đi kèm mỗi câu hỏi hãy giải thích câu trả lời mong đợi và các 'red flag' cần lưu ý khi ứng viên trả lời.",
    category: "HR",
    description: "Soạn câu hỏi phỏng vấn kỹ thuật chất lượng cao kèm tiêu chí đánh giá chi tiết.",
    usageCount: 56,
    isFavorite: false
  },
  {
    id: "pr5",
    title: "Viết bài PR công bố sản phẩm mới",
    prompt: "Viết một bài thông cáo báo chí (PR) chuẩn SEO công bố việc VinaCorp ra mắt cổng thông tin doanh nghiệp 'Enterprise AI Portal'. Bài viết cần nêu bật tính năng tích hợp dữ liệu ERP (Odoo, Salesforce) và bảo mật chuẩn ISO 27001. Định dạng bài viết gồm: Tiêu đề cuốn hút, Sapo ấn tượng, Thân bài có trích dẫn từ Tổng giám đốc Nguyễn Minh Khang, và phần Kết bài kêu gọi hành động dùng thử.",
    category: "Marketing",
    description: "Soạn thảo bài PR công nghệ đúng văn phong báo chí Việt Nam.",
    usageCount: 84,
    isFavorite: true
  }
];

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    title: "Tra cứu & Tóm tắt Quy định Nghỉ phép VinaCorp",
    createdAt: new Date("2026-07-09T01:30:00Z"),
    updatedAt: new Date("2026-07-09T01:45:00Z"),
    isPinned: true,
    messages: [
      {
        id: "m1_1",
        role: "user",
        content: "Chào AI, công ty mình quy định nghỉ phép năm như thế nào? Nhân viên mới vào làm có được nghỉ phép không?",
        timestamp: new Date("2026-07-09T01:30:00Z")
      },
      {
        id: "m1_2",
        role: "assistant",
        content: "Chào anh Khang! Dựa trên tài liệu **[Sổ tay nhân sự và Quy tắc ứng xử VinaCorp.docx](file:///D:/Project%20AI/lib/mock-data/index.ts)**, quy định về nghỉ phép của công ty chúng ta như sau:\n\n### 1. Số ngày nghỉ phép năm\n* **Nhân viên chính thức:** Được hưởng **12 ngày** nghỉ phép năm hưởng nguyên lương đối với 12 tháng làm việc.\n* **Chế độ thâm niên:** Cứ mỗi **05 năm** làm việc liên tục tại VinaCorp, nhân viên được cộng thêm **01 ngày** phép thâm niên.\n\n### 2. Quy định đối với nhân viên mới (chưa đủ 12 tháng)\n* Nhân viên đang trong thời gian thử việc hoặc làm việc dưới 12 tháng vẫn được nghỉ phép. Số ngày phép được tính tương ứng theo tỷ lệ số tháng làm việc thực tế.\n* *Ví dụ:* Nếu anh làm việc được 3 tháng, anh sẽ tích lũy được `(12 ngày / 12 tháng) * 3 tháng = 3 ngày` phép có thể sử dụng.\n\n### 3. Quy trình xin nghỉ phép\n1. Tạo đề xuất xin nghỉ trên hệ thống **ERP Odoo** trước ít nhất **03 ngày** làm việc (đối với phép nghỉ dưới 3 ngày) hoặc **07 ngày** làm việc (đối với phép nghỉ từ 3 ngày trở lên).\n2. Quản lý trực tiếp phê duyệt trực tuyến.\n\nAnh có muốn tôi hướng dẫn cách tạo yêu cầu nghỉ phép trên Odoo không ạ?",
        timestamp: new Date("2026-07-09T01:32:00Z"),
        sources: ["kd2"]
      }
    ]
  },
  {
    id: "c2",
    title: "Phân tích doanh số bán hàng Odoo Quý 1",
    createdAt: new Date("2026-07-08T09:15:00Z"),
    updatedAt: new Date("2026-07-08T09:30:00Z"),
    messages: [
      {
        id: "m2_1",
        role: "user",
        content: "AI hãy phân tích dữ liệu tài chính Quý 1 từ file báo cáo xem tốc độ tăng trưởng thế nào.",
        timestamp: new Date("2026-07-08T09:15:00Z")
      },
      {
        id: "m2_2",
        role: "assistant",
        content: "Chào anh Khang, tôi đã đọc tệp **[Báo cáo tài chính kiểm toán Quý 1-2026.xlsx](file:///D:/Project%20AI/lib/mock-data/index.ts)**. Dưới đây là phân tích chi tiết kết quả kinh doanh Quý 1/2026:\n\n### 1. Tổng quan các chỉ số tài chính\n\n| Chỉ số | Quý 1 - 2026 (VNĐ) | Tăng trưởng so với Q1/2025 | Đánh giá |\n| :--- | :--- | :--- | :--- |\n| **Doanh thu thuần** | 120.450.000.000 | +15.4% | Đạt kế hoạch đề ra |\n| **Giá vốn hàng bán** | 75.320.000.000 | +12.1% | Kiểm soát chi phí tốt |\n| **Lợi nhuận gộp** | 45.130.000.000 | +21.2% | Biên lợi nhuận gộp tăng lên 37.4% |\n| **Lợi nhuận thuần** | 23.830.000.000 | +18.9% | Tăng trưởng rất ấn tượng |\n\n### 2. Phân tích nguyên nhân tăng trưởng\n* **Tối ưu hóa giá vốn:** Giá vốn hàng bán chỉ tăng 12.1% so với mức tăng 15.4% của doanh thu, chứng tỏ hiệu quả của việc ký kết hợp đồng cung ứng dài hạn mới giúp ổn định đơn giá.\n* **Biên lợi nhuận gộp cải thiện:** Đạt **37.4%** (so với 35.6% cùng kỳ năm ngoái), phản ánh việc dịch chuyển cơ cấu sản phẩm sang các giải pháp phần mềm có biên lợi nhuận cao hơn.\n\n### 3. Khuyến nghị hành động tiếp theo\n1. **Kiểm soát chi phí bán hàng:** Chi phí bán hàng đang ở mức 12.4 tỷ VNĐ (tăng 18% so với cùng kỳ). Cần rà soát các chiến dịch marketing trả phí có hiệu quả thấp.\n2. **Tăng tốc thu hồi công nợ:** Theo báo cáo chi tiết, các khoản phải thu ngắn hạn tăng nhẹ 8%. Cần đôn đốc bộ phận Sales làm việc với các Key Accounts để hoàn tất thanh toán đúng kỳ hạn.\n\nAnh có cần tôi trích xuất biểu đồ so sánh chi tiết giữa các tháng trong Quý 1 không?",
        timestamp: new Date("2026-07-08T09:18:00Z"),
        sources: ["kd3"]
      }
    ]
  },
  {
    id: "c3",
    title: "Kiểm tra rủi ro hợp đồng đại lý Thành Phát",
    createdAt: new Date("2026-07-07T14:20:00Z"),
    updatedAt: new Date("2026-07-07T14:35:00Z"),
    messages: [
      {
        id: "m3_1",
        role: "user",
        content: "Tôi chuẩn bị ký hợp đồng với Đại lý Thành Phát. Hãy check file mẫu xem có điều khoản nào bất lợi hoặc rủi ro cho VinaCorp không.",
        timestamp: new Date("2026-07-07T14:20:00Z")
      },
      {
        id: "m3_2",
        role: "assistant",
        content: "Chào anh Khang! Tôi đã thực hiện phân tích tệp pháp lý **[Hợp đồng nguyên tắc đại lý phân phối 2026.docx](file:///D:/Project%20AI/lib/mock-data/index.ts)** giữa VinaCorp (Bên A) và Công ty TNHH Phát triển Công nghệ Thành Phát (Bên B). Dưới đây là 3 cảnh báo rủi ro quan trọng anh cần lưu ý trước khi đặt bút ký:\n\n### ⚠️ Các điểm rủi ro & Đề xuất điều chỉnh:\n\n1. **Rủi ro chiết khấu thương mại (Điều 2):**\n   * *Hiện tại:* Ghi nhận chiết khấu đại lý dao động từ 25% - 35% tùy thuộc vào doanh số quý nhưng chưa có bảng chỉ tiêu doanh số cụ thể đi kèm trực tiếp trong hợp đồng.\n   * *Rủi ro:* Bên B có thể đòi hỏi mức chiết khấu tối đa 35% ngay cả khi doanh số đạt mức tối thiểu.\n   * *Khắc phục:* Bổ sung phụ lục chỉ tiêu cam kết KPI doanh số cụ thể (Ví dụ: Doanh số trên 5 tỷ/quý được hưởng 35%, dưới 2 tỷ hưởng 25%).\n\n2. **Điều khoản bảo mật thông tin khách hàng (Điều 5):**\n   * *Hiện tại:* Điều khoản bảo mật ghi chung chung, chưa quy định chế tài phạt cụ thể nếu đại lý làm rò rỉ dữ liệu hoặc chào mời khách hàng của VinaCorp qua đơn vị khác.\n   * *Rủi ro:* Nguy cơ mất tệp khách hàng Key Accounts vào tay đối thủ cạnh tranh mà không có cơ sở pháp lý để khởi kiện phạt nặng.\n   * *Khắc phục:* Thêm quy định phạt vi phạm bảo mật cố định **200.000.000 VNĐ/lần vi phạm** và Bên B phải bồi thường toàn bộ thiệt hại thực tế phát sinh.\n\n3. **Thời hạn thanh toán & Lãi chậm trả (Điều 4):**\n   * *Hiện tại:* Cho phép công nợ gối đầu lên tới 45 ngày.\n   * *Rủi ro:* Đại lý Thành Phát có thể trì hoãn dòng tiền thanh toán gây ảnh hưởng tới nguồn vốn lưu động của VinaCorp.\n   * *Khắc phục:* Rút ngắn thời hạn thanh toán xuống **30 ngày**, quá hạn sẽ áp dụng lãi suất chậm trả bằng 150% lãi suất cơ bản của ngân hàng Vietcombank tại thời điểm thanh toán.\n\nAnh có muốn tôi soạn thảo lại các điều khoản sửa đổi này thành một văn bản phụ lục đính kèm không?",
        timestamp: new Date("2026-07-07T14:25:00Z"),
        sources: ["kd5"]
      }
    ]
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "al1",
    user: "Nguyễn Minh Khang",
    action: "Đăng nhập hệ thống",
    target: "Web Portal (Desktop)",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    status: "success",
    ipAddress: "14.226.45.102"
  },
  {
    id: "al2",
    user: "Nguyễn Minh Khang",
    action: "Chạy Workflow",
    target: "Tự động hóa Đồng bộ và Kiểm tra Tài liệu Pháp lý mới",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "success",
    ipAddress: "14.226.45.102"
  },
  {
    id: "al3",
    user: "Nguyễn Minh Khang",
    action: "Tạo cấu hình kết nối",
    target: "Salesforce CRM Connector",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "failed",
    ipAddress: "14.226.45.102"
  },
  {
    id: "al4",
    user: "Trần Thị Lan (HR)",
    action: "Tải lên tài liệu",
    target: "Sổ tay nhân sự và Quy tắc ứng xử VinaCorp.docx",
    timestamp: new Date("2026-07-08T10:15:00Z"),
    status: "success",
    ipAddress: "113.161.78.22"
  },
  {
    id: "al5",
    user: "Phạm Văn Minh (Sales)",
    action: "Truy cập dữ liệu",
    target: "Báo cáo tài chính kiểm toán Quý 1-2026.xlsx",
    timestamp: new Date("2026-07-08T11:02:00Z"),
    status: "success",
    ipAddress: "27.72.99.14"
  }
];

export const mockSystemStats: SystemStat = {
  activeUsers: 84,
  totalCost: 12450000, // in VND
  agentRequests: 14205,
  costByDay: [
    { day: "03/07", cost: 350000 },
    { day: "04/07", cost: 420000 },
    { day: "05/07", cost: 280000 },
    { day: "06/07", cost: 680000 },
    { day: "07/07", cost: 890000 },
    { day: "08/07", cost: 1200000 },
    { day: "09/07", cost: 950000 }
  ],
  agentUsage: [
    { name: "Agent Tóm tắt Pháp lý", count: 4250 },
    { name: "Agent Phân tích Tài chính", count: 3820 },
    { name: "Agent Hỗ trợ Nhân sự", count: 2950 },
    { name: "Agent Trợ lý Email Sales", count: 1850 },
    { name: "Khác", count: 1335 }
  ],
  userActivity: [
    { hour: "08:00", count: 12 },
    { hour: "10:00", count: 45 },
    { hour: "12:00", count: 18 },
    { hour: "14:00", count: 52 },
    { hour: "16:00", count: 48 },
    { hour: "18:00", count: 15 }
  ]
};

export const mockFetch = async <T>(data: T, delayMs: number = 600): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "e1", date: "2026-07-09", startTime: "09:00", endTime: "10:00", title: "Họp giao ban Ban CNTT VinaCorp", location: "Phòng họp A, Tầng 5", type: "internal" },
  { id: "e2", date: "2026-07-09", startTime: "14:00", endTime: "15:30", title: "Review kiến trúc AI Agent Enterprise", location: "Google Meet", type: "internal" },
  { id: "e3", date: "2026-07-10", startTime: "10:00", endTime: "11:00", title: "Họp đàm phán ngân sách với Ban Tài chính", location: "Phòng họp B, Tầng 4", type: "internal" },
  { id: "e4", date: "2026-07-12", startTime: "09:00", endTime: "11:00", title: "Thảo luận Hợp đồng phân phối đại lý Thành Phát", location: "Google Meet", type: "client" },
  { id: "e5", date: "2026-07-13", startTime: "15:00", endTime: "16:00", title: "Lịch cá nhân - Kiểm tra sức khỏe định kỳ", location: "Bệnh viện Đa khoa VinaMec", type: "personal" },
  { id: "e6", date: "2026-07-14", startTime: "14:00", endTime: "15:00", title: "Lập Demo cho Ban điều hành", location: "Phòng họp lớn", type: "internal" },
  { id: "e7", date: "2026-07-15", startTime: "10:30", endTime: "12:00", title: "Kick-off dự án SmartAI Hub Giai đoạn 2", location: "Google Meet", type: "client" }
];


export const mockEmails: EmailItem[] = [
  { id: "em1", from: "Trần Thị Lan (Pháp chế)", subject: "Phản hồi về phụ lục Hợp đồng đại lý Thành Phát", summary: "Đã rà soát xong Điều khoản bảo mật và lãi chậm thanh toán của đại lý...", unread: true, date: "09:15" },
  { id: "em2", from: "Google Workspace Security", subject: "Cảnh báo bảo mật: Thiết bị mới đăng nhập", summary: "Phát hiện đăng nhập mới từ địa chỉ IP 14.226.45.102 tại Hà Nội...", unread: true, date: "08:30" },
  { id: "em3", from: "Nguyễn Lê Hoàng (Tài chính)", subject: "Báo cáo chi phí vận hành API LLM Quý 1-2026", summary: "Gửi anh Khang file chi tiết chi phí OpenAI và Anthropic tháng 3...", unread: false, date: "Hôm qua" },
  { id: "em4", from: "Phạm Văn Minh (Sales)", subject: "Yêu cầu duyệt báo giá đại lý Thành Phát", summary: "Gửi anh Khang báo giá phần mềm SmartAI Hub áp dụng chiết khấu 30%...", unread: false, date: "Hôm qua" }
];


export const mockERPStock: ERPStockItem[] = [
  { id: "st1", name: "Phần mềm SmartAI Hub Enterprise License", sku: "SAI-ENT-01", stock: 999, location: "Cloud Storage", price: 150000000 },
  { id: "st2", name: "Thiết bị Gateway AI Gateway-V1", sku: "GW-V1-HW", stock: 45, location: "Kho chính tầng 2", price: 25000000 },
  { id: "st3", name: "Gói bảo trì hệ thống 12 tháng (Maintenance)", sku: "SAI-MNT-12", stock: 120, location: "Service Portal", price: 15000000 }
];


export const mockCRMOpportunities: CRMOpportunity[] = [
  { id: "op1", name: "Cung cấp SmartAI Hub - Vietcombank", client: "Ngân hàng Vietcombank", value: 45000000000, stage: "Negotiation", closeDate: "30/07/2026" },
  { id: "op2", name: "Tích hợp Odoo ERP - Vietnam Airlines", client: "Vietnam Airlines", value: 30000000000, stage: "Proposal", closeDate: "15/08/2026" },
  { id: "op3", name: "Triển khai Copilot - Hòa Bình Group", client: "Tập đoàn Hòa Bình", value: 15000000000, stage: "Closed Won", closeDate: "05/07/2026" }
];

export const mockAgents: AgentDefinition[] = [
  {
    id: "agent-calendar",
    name: "Agent Calendar",
    tool: "Google Calendar",
    toolProvider: "google",
    description: "Tra cứu, sắp xếp và nhắc lịch họp từ tài khoản Google Calendar của bạn.",
    status: "connected",
    suggestedPrompts: [
      "Tuần này tôi có những lịch gì?",
      "Ngày mai tôi có bị trùng lịch không?",
      "Đặt lịch nhắc họp với Ban Tài chính vào thứ Sáu"
    ],
    lockedDataSource: "Google Calendar"
  },
  {
    id: "agent-email",
    name: "Agent Email",
    tool: "Gmail Suite",
    toolProvider: "google",
    description: "Tóm tắt thư chưa đọc, tìm kiếm email của đối tác và tự động soạn thảo thư trả lời.",
    status: "connected",
    suggestedPrompts: [
      "Tóm tắt email chưa đọc hôm nay",
      "Có email nào từ đối tác Thành Phát không?"
    ],
    lockedDataSource: "Gmail Suite"
  },
  {
    id: "agent-erp",
    name: "Agent ERP",
    tool: "ERP Odoo",
    toolProvider: "odoo",
    description: "Tra cứu chi tiết tồn kho phần cứng, danh mục sản phẩm và lập báo giá bán hàng nhanh.",
    status: "connected",
    suggestedPrompts: [
      "Kiểm tra tồn kho sản phẩm SmartAI Hub",
      "Lập báo giá cho khách hàng ABC Corp"
    ],
    lockedDataSource: "ERP Odoo VinaCorp"
  },
  {
    id: "agent-crm",
    name: "Agent CRM",
    tool: "Salesforce CRM",
    toolProvider: "salesforce",
    description: "Kiểm tra tình hình các cơ hội bán hàng sắp đóng và tóm tắt lịch sử tương tác khách hàng.",
    status: "error",
    suggestedPrompts: [
      "Cơ hội bán hàng nào sắp đóng trong tháng này?",
      "Tóm tắt lịch sử tương tác với khách hàng XYZ"
    ],
    lockedDataSource: "Salesforce CRM"
  },
  {
    id: "agent-docs",
    name: "Agent Tài liệu",
    tool: "Google Drive / Knowledge Base",
    toolProvider: "google",
    description: "Tìm kiếm thông tin chính sách, quét rủi ro hợp đồng và tóm tắt tệp tin pdf/docx.",
    status: "disconnected",
    suggestedPrompts: [
      "Tìm hợp đồng đại lý mới nhất",
      "Tóm tắt báo cáo tài chính Q1"
    ],
    lockedDataSource: "Quy định & Chính sách"
  }
];

export const agentThinkingSteps: Record<string, ThinkingStep[]> = {
  "agent-calendar": [
    { label: "Đang kết nối tới Google Calendar...", icon: "link" },
    { label: "Đang đọc danh sách lịch từ 09/07/2026...", icon: "calendar" },
    { label: "Đang phát hiện 7 sự kiện, kiểm tra trùng lịch...", icon: "search" },
    { label: "Đang tổng hợp lịch theo từng ngày...", icon: "sparkles" }
  ],
  "agent-email": [
    { label: "Đang kết nối an toàn tới máy chủ Gmail...", icon: "link" },
    { label: "Đang quét danh sách thư chưa đọc hôm nay...", icon: "mail" },
    { label: "Đang trích xuất nội dung thư và lập tóm tắt...", icon: "search" },
    { label: "Đang phân loại email rủi ro...", icon: "sparkles" }
  ],
  "agent-erp": [
    { label: "Kết nối hệ thống Odoo ERP thông qua API...", icon: "link" },
    { label: "Quét cơ sở dữ liệu tồn kho sản phẩm...", icon: "database" },
    { label: "Đọc cấu hình đơn giá và định vị...", icon: "search" },
    { label: "Trình diễn dữ liệu tồn kho dưới dạng bảng...", icon: "sparkles" }
  ],
  "agent-crm": [
    { label: "Kết nối cổng thông tin Salesforce CRM...", icon: "link" },
    { label: "Đọc danh sách Opportunities Close-Date...", icon: "database" },
    { label: "Phát hiện lỗi Token hết hạn, đang kiểm tra cấu hình...", icon: "loader" }
  ],
  "agent-docs": [
    { label: "Đang truy vấn Google Drive doanh nghiệp...", icon: "link" },
    { label: "Đang tải xuống tệp văn bản mẫu mới nhất...", icon: "database" },
    { label: "Đang quét rủi ro pháp lý bằng mô hình học máy...", icon: "search" },
    { label: "Tổng hợp điều khoản phạt đền...", icon: "sparkles" }
  ]
};

