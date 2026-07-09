export type UserRole = "Admin" | "User";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  sources?: string[]; // IDs of referenced knowledge docs
  agentLogs?: string[]; // Steps showing thinking details
  agentData?: {
    type: "calendar" | "email" | "erp" | "crm";
    data: any;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  isPinned?: boolean;
  agentId?: string; // Optional locked agent id
}

export interface ConnectedAccount {
  id: string;
  provider: "google" | "microsoft" | "odoo" | "salesforce" | "hubspot";
  name: string;
  email: string;
  avatar?: string;
  status: "connected" | "syncing" | "error";
  lastSync: Date;
  permissions: string[];
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: "pdf" | "docx" | "xlsx" | "pptx" | "txt";
  size: string;
  updatedAt: Date;
  updatedBy: string;
  category: string;
  tags: string[];
  content: string; // Mock preview text
  folderPath?: string; // e.g. "Kế hoạch", "Báo cáo"
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "failed";
  duration?: string;
}

export interface WorkflowLog {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "success" | "failed";
  lastRun?: Date;
  steps: WorkflowStep[];
  logs: WorkflowLog[];
  category: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: "Marketing" | "Finance" | "HR" | "Productivity" | "Technical";
  description: string;
  usageCount: number;
  isFavorite?: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  status: "success" | "failed";
  ipAddress: string;
}

export interface SystemStat {
  activeUsers: number;
  totalCost: number; // in VND
  agentRequests: number;
  costByDay: { day: string; cost: number }[];
  agentUsage: { name: string; count: number }[];
  userActivity: { hour: string; count: number }[];
}

export interface ThinkingStep {
  label: string;
  icon: string; // "database" | "calendar" | "search" | "sparkles" | "mail" | "link" | "loader"
}

export interface AgentDefinition {
  id: string;
  name: string;
  tool: string;
  toolProvider: "google" | "microsoft" | "odoo" | "salesforce";
  description: string;
  status: "connected" | "disconnected" | "error";
  suggestedPrompts: string[];
  lockedDataSource: string; // Document ID or data source description
}

export interface CalendarEvent {
  id: string;
  date: string; // "2026-07-09"
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  type: "internal" | "client" | "personal";
}

export interface EmailItem {
  id: string;
  from: string;
  subject: string;
  summary: string;
  unread: boolean;
  date: string;
}

export interface ERPStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  location: string;
  price: number;
}

export interface CRMOpportunity {
  id: string;
  name: string;
  client: string;
  value: number;
  stage: "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  closeDate: string;
}

