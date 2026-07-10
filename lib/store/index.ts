import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole, Conversation, Message, ConnectedAccount, Workflow, PromptTemplate, KnowledgeDoc } from "../types";
import { mockUser, mockConversations, mockAccounts, mockWorkflows, mockPrompts, mockKnowledgeDocs } from "../mock-data";

// ==========================================
// 1. App Store (Quan ly state chung cua toan app)
// Quan ly phan quyen (role), trang thai sidebar, va he thong thong bao.
// Su dung Zustand middleware 'persist' de luu state vao LocalStorage.
// ==========================================
interface AppState {
  user: User;
  setRole: (role: UserRole) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  notifications: { id: string; title: string; desc: string; time: string; read: boolean }[];
  markAllNotificationsRead: () => void;
  addNotification: (title: string, desc: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: mockUser,
      setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      notifications: [
        { id: "n1", title: "Workflow hoàn thành", desc: "Tự động hóa Đồng bộ và Kiểm tra Tài liệu Pháp lý mới đã chạy thành công.", time: "45 phút trước", read: false },
        { id: "n2", title: "Lỗi kết nối Salesforce CRM", desc: "OAuth token hết hạn. Cần xác thực lại tài khoản.", time: "3 giờ trước", read: false },
        { id: "n3", title: "Hợp đồng mới được tải lên", desc: "Trần Thị Lan đã cập nhật Hợp đồng nguyên tắc đại lý 2026.", time: "Hôm qua", read: true }
      ],
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
      addNotification: (title, desc) => set((state) => ({
        notifications: [
          { id: Math.random().toString(), title, desc, time: "Vừa xong", read: false },
          ...state.notifications
        ]
      }))
    }),
    {
      name: "app-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// ==========================================
// 2. Chat Store (Quan ly state cho chuc nang Chat voi AI)
// Quan ly danh sach hoi thoai, tin nhan, source data va trang thai dang generate cua AI.
// ==========================================
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedSources: string[]; // Folder paths or document IDs
  isGenerating: boolean;
  stopGenerationFlag: boolean;
  voiceRecordingState: "idle" | "recording" | "processing";
  setActiveConversationId: (id: string | null) => void;
  addConversation: (title: string, agentId?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  pinConversation: (id: string) => void;
  sendMessage: (content: string, simulateReply: (userMsgId: string) => void) => void;
  addSystemMessage: (convId: string, content: string, sources?: string[], agentData?: { type: "calendar" | "email" | "erp" | "crm"; data: any }) => void;
  toggleSource: (sourceId: string) => void;
  clearSources: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
  stopGeneration: () => void;
  setVoiceRecordingState: (state: "idle" | "recording" | "processing") => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeConversationId: mockConversations[0].id,
  selectedSources: ["kd1", "kd2", "kd3"], // Default selected sources
  isGenerating: false,
  stopGenerationFlag: false,
  voiceRecordingState: "idle",
  setActiveConversationId: (id) => set({ activeConversationId: id, stopGenerationFlag: false }),
  addConversation: (title, agentId) => {
    const id = "c_" + Date.now();
    const newConv: Conversation = {
      id,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      agentId
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: id
    }));
    return id;
  },
  deleteConversation: (id) => set((state) => {
    const filtered = state.conversations.filter((c) => c.id !== id);
    const nextActive = filtered.length > 0 ? filtered[0].id : null;
    return {
      conversations: filtered,
      activeConversationId: state.activeConversationId === id ? nextActive : state.activeConversationId
    };
  }),
  renameConversation: (id, newTitle) => set((state) => ({
    conversations: state.conversations.map((c) => c.id === id ? { ...c, title: newTitle, updatedAt: new Date() } : c)
  })),
  pinConversation: (id) => set((state) => ({
    conversations: state.conversations.map((c) => c.id === id ? { ...c, isPinned: !c.isPinned } : c)
  })),
  sendMessage: (content, simulateReply) => {
    const activeId = get().activeConversationId;
    let currentConvId = activeId;
    if (!currentConvId) {
      currentConvId = get().addConversation(content.slice(0, 30) + (content.length > 30 ? "..." : ""));
    }

    const userMsg: Message = {
      id: "m_" + Date.now(),
      role: "user",
      content,
      timestamp: new Date(),
      status: "sent"
    };

    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === currentConvId) {
          return {
            ...c,
            messages: [...c.messages, userMsg],
            updatedAt: new Date()
          };
        }
        return c;
      })
    }));

    simulateReply(userMsg.id);
  },
  addSystemMessage: (convId, content, sources, agentData) => set((state) => ({
    conversations: state.conversations.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: "m_sys_" + Date.now(),
              role: "assistant",
              content,
              timestamp: new Date(),
              sources,
              agentData
            }
          ],
          updatedAt: new Date()
        };
      }
      return c;
    })
  })),
  toggleSource: (sourceId) => set((state) => {
    const selected = state.selectedSources.includes(sourceId)
      ? state.selectedSources.filter((id) => id !== sourceId)
      : [...state.selectedSources, sourceId];
    return { selectedSources: selected };
  }),
  clearSources: () => set({ selectedSources: [] }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  stopGeneration: () => set({ stopGenerationFlag: true, isGenerating: false }),
  setVoiceRecordingState: (voiceRecordingState) => set({ voiceRecordingState })
}));

// ==========================================
// 3. Workflow Store (Quan ly cac quy trinh tu dong hoa)
// Giup theo doi tien trinh chay cac workflow, handle viec update tung step.
// ==========================================
interface WorkflowState {
  workflows: Workflow[];
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  runWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: mockWorkflows,
  activeWorkflowId: null,
  setActiveWorkflowId: (id) => set({ activeWorkflowId: id }),
  runWorkflow: async (id) => {
    const workflow = get().workflows.find((w) => w.id === id);
    if (!workflow || workflow.status === "running") return;

    // Reset steps to pending and status to running
    set((state) => ({
      workflows: state.workflows.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status: "running",
            lastRun: new Date(),
            steps: w.steps.map((s) => ({ ...s, status: "pending", duration: undefined })),
            logs: [{ timestamp: new Date().toLocaleTimeString(), level: "info" as const, message: "Bắt đầu khởi tạo quy trình..." }]
          };
        }
        return w;
      })
    }));

    const stepDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const steps = workflow.steps;
    for (let i = 0; i < steps.length; i++) {
      // Set current step to running
      set((state) => ({
        workflows: state.workflows.map((w) => {
          if (w.id === id) {
            const updatedSteps = [...w.steps];
            updatedSteps[i] = { ...updatedSteps[i], status: "running" };
            return {
              ...w,
              steps: updatedSteps,
              logs: [
                ...w.logs,
                { timestamp: new Date().toLocaleTimeString(), level: "info" as const, message: `Bắt đầu thực hiện: ${steps[i].name}` }
              ]
            };
          }
          return w;
        })
      }));

      // Simulate execution time
      const executionTime = 1500 + Math.random() * 2000;
      await stepDelay(executionTime);

      const isFailed = id === "wf2" && i === 1; // Simulate error for wf2 step 2

      set((state) => ({
        workflows: state.workflows.map((w) => {
          if (w.id === id) {
            const updatedSteps = [...w.steps];
            updatedSteps[i] = {
              ...updatedSteps[i],
              status: isFailed ? "failed" : "success",
              duration: `${(executionTime / 1000).toFixed(1)}s`
            };
            
            const stepLogs = isFailed
              ? [
                  { timestamp: new Date().toLocaleTimeString(), level: "error" as const, message: `Lỗi kết nối Salesforce API: Cần cấu hình lại xác thực OAuth.` },
                  { timestamp: new Date().toLocaleTimeString(), level: "error" as const, message: `Tiến trình kết thúc với mã lỗi.` }
                ]
              : [
                  { timestamp: new Date().toLocaleTimeString(), level: "info" as const, message: `Hoàn tất thành công: ${steps[i].name}` }
                ];

            return {
              ...w,
              status: isFailed ? "failed" : i === steps.length - 1 ? "success" : "running",
              steps: updatedSteps,
              logs: [...w.logs, ...stepLogs]
            };
          }
          return w;
        })
      }));

      if (isFailed) {
        useAppStore.getState().addNotification(
          "Lỗi thực thi Workflow",
          `Workflow '${workflow.name}' đã thất bại ở bước '${steps[i].name}'.`
        );
        break;
      }
    }

    // Success notification
    const finalWf = get().workflows.find((w) => w.id === id);
    if (finalWf && finalWf.status === "success") {
      useAppStore.getState().addNotification(
        "Workflow hoàn thành",
        `Quy trình '${workflow.name}' đã hoàn tất thành công tất cả các bước.`
      );
    }
  }
}));

// ==========================================
// 4. Accounts Store (Quan ly ket noi tai khoan OAuth cua User)
// Vi du: Ket noi Google, Microsoft, Salesforce.
// ==========================================
interface AccountState {
  accounts: ConnectedAccount[];
  isConnecting: boolean;
  connectingProvider: string | null;
  connectAccount: (provider: string, email: string, name: string) => Promise<void>;
  disconnectAccount: (id: string) => void;
  toggleAccountActive: (id: string) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: mockAccounts.map(a => ({ ...a, isActive: true })),
  isConnecting: false,
  connectingProvider: null,
  connectAccount: async (provider, email, name) => {
    set({ isConnecting: true, connectingProvider: provider });
    // Simulate OAuth loading screen steps
    await new Promise((r) => setTimeout(r, 2500));
    
    const newAcc: ConnectedAccount = {
      id: "a_" + Date.now(),
      provider: provider as any,
      name,
      email,
      status: "connected",
      lastSync: new Date(),
      permissions: ["Đọc dữ liệu", "Quản lý tệp", "Đồng bộ hóa tự động"],
      isActive: true
    };

    set((state) => {
      const existing = state.accounts.find((a) => a.provider === provider && a.email === email);
      const nextAccounts = existing
        ? state.accounts.map((a) => a.id === existing.id ? { ...a, status: "connected" as const, name, lastSync: new Date() } : a)
        : [...state.accounts, newAcc];
      
      return {
        accounts: nextAccounts,
        isConnecting: false,
        connectingProvider: null
      };
    });

    useAppStore.getState().addNotification(
      "Kết nối tài khoản thành công",
      `Đã liên kết thành công tài khoản ${provider.toUpperCase()}: ${email}.`
    );
  },
  disconnectAccount: (id) => set((state) => {
    const acc = state.accounts.find((a) => a.id === id);
    if (acc) {
      useAppStore.getState().addNotification(
        "Đã ngắt kết nối tài khoản",
        `Đã gỡ bỏ liên kết dịch vụ ${acc.provider.toUpperCase()} (${acc.email}).`
      );
    }
    return {
      accounts: state.accounts.filter((a) => a.id !== id)
    };
  }),
  toggleAccountActive: (id) => set((state) => ({
    accounts: state.accounts.map((a) => a.id === id ? { ...a, isActive: a.isActive === false ? true : false } : a)
  }))
}));

// ==========================================
// 5. Command Palette Store (Quan ly thanh tim kiem nhanh)
// Bam Ctrl+K de hien thi hoac bam nut Search tren Header.
// ==========================================
interface CommandState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCommandStore = create<CommandState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen })
}));
