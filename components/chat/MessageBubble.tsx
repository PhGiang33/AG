"use client";

import { Message, KnowledgeDoc } from "@/lib/types";
import { UserAvatar } from "../shared/user-avatar";
import { useAppStore } from "@/lib/store";
import { mockKnowledgeDocs } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { Copy, Check, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { AgentResultCard } from "./AgentResultCard";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAppStore();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const isUser = message.role === "user";

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1500);
  };

  // Safe and clean custom Markdown renderer
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    // Temporary helper to flush active list
    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-xs">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    // Temporary helper to flush active table
    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const bodyRows = tableRows.slice(2); // Skip separator row
        elements.push(
          <div key={`table-wrapper-${key}`} className="my-3 overflow-x-auto rounded-lg border border-border shadow-sm">
            <table className="min-w-full divide-y divide-border text-left text-xs">
              <thead className="bg-secondary/40 font-bold text-foreground">
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-3 py-2 border-r last:border-r-0 border-border" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(h.trim()) }} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-secondary/20 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2 border-r last:border-r-0 border-border text-muted-foreground" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell.trim()) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    // Scan block-level elements
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Code block detection
      if (line.trim().startsWith("```")) {
        flushList(String(i));
        flushTable(String(i));
        
        const lang = line.trim().slice(3) || "code";
        let codeLines: string[] = [];
        i++; // Move to next line
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeString = codeLines.join("\n");
        const codeId = `code-${i}`;

        elements.push(
          <div key={codeId} className="my-3 border border-border rounded-lg overflow-hidden shadow-premium-sm text-xs font-mono">
            <div className="bg-secondary/50 px-4 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground border-b border-border font-sans select-none">
              <span className="uppercase font-bold">{lang}</span>
              <button
                onClick={() => handleCopyCode(codeString, codeId)}
                className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-muted/30 overflow-x-auto text-foreground">
              <code>{codeString}</code>
            </pre>
          </div>
        );
        continue;
      }

      // 2. Table detection
      if (line.trim().startsWith("|")) {
        flushList(String(i));
        inTable = true;
        const cells = line.split("|").slice(1, -1);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable(String(i));
      }

      // 3. Lists detection
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        flushTable(String(i));
        inList = true;
        listItems.push(line.trim().slice(2));
        continue;
      } else if (inList) {
        flushList(String(i));
      }

      // 4. Headings
      if (line.trim().startsWith("### ")) {
        elements.push(
          <h4 key={i} className="text-sm font-bold text-foreground mt-4 mb-2 first:mt-0" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.trim().slice(4)) }} />
        );
        continue;
      }

      if (line.trim().startsWith("## ")) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-foreground mt-5 mb-2.5 first:mt-0" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.trim().slice(3)) }} />
        );
        continue;
      }

      // 5. Paragraphs
      if (line.trim() !== "") {
        elements.push(
          <p
            key={i}
            className="my-1.5 leading-relaxed text-xs text-muted-foreground dark:text-foreground/90"
            dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }}
          />
        );
      }
    }

    // Post loops flushes
    flushList("end");
    flushTable("end");

    return elements;
  };

  // Parse inline elements (bold, links, etc.)
  const parseInlineMarkdown = (text: string) => {
    let parsed = text;

    // Bold text (**text**)
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>");

    // Clickable files (like [doc.docx](file:///path))
    parsed = parsed.replace(
      /\[(.*?)\]\((file:\/\/.*?)\)/g,
      `<a href="$2" class="text-primary font-bold hover:underline inline-flex items-center gap-0.5" target="_blank">$1</a>`
    );

    return parsed;
  };

  // Find linked documents to display at bubble footer
  const linkedDocs: KnowledgeDoc[] = [];
  if (message.sources) {
    message.sources.forEach((srcId) => {
      const doc = mockKnowledgeDocs.find((d) => d.id === srcId);
      if (doc) linkedDocs.push(doc);
    });
  }

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl mx-auto py-3 relative group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <UserAvatar src={user.avatar} name={user.name} status="online" className="h-8 w-8 shrink-0" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-md select-none">
          AI
        </div>
      )}

      {/* Bubble Panel */}
      <div className="flex-1 min-w-0 max-w-[80%] flex flex-col items-start gap-1">
        {/* Timestamp */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-[10px] font-bold text-muted-foreground/80">
            {isUser ? user.name : "AI Assistant"}
          </span>
          <span className="text-[9px] text-muted-foreground/60">
            {new Date(message.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Message body */}
        <div
          className={cn(
            "rounded-xl px-4 py-3 border shadow-premium-sm text-xs leading-relaxed relative",
            isUser
              ? "bg-primary text-primary-foreground border-primary rounded-tr-none ml-auto"
              : "bg-secondary/30 text-foreground border-border/80 border-l-[3px] border-l-primary/75 rounded-tl-none mr-auto"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-3.5">
              {message.agentData && (
                <div className="mb-3">
                  <AgentResultCard type={message.agentData.type} data={message.agentData.data} />
                </div>
              )}
              <div>{renderContent(message.content)}</div>
            </div>
          )}
        </div>

        {/* Dynamic citation cards for Assistant bubbles */}
        {!isUser && linkedDocs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 select-none">
            {linkedDocs.map((doc) => (
              <a
                key={doc.id}
                href={`/knowledge?preview=${doc.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-[10px] text-muted-foreground hover:text-foreground font-bold transition-all shadow-premium-sm cursor-pointer"
              >
                <FileText className="h-3 w-3 text-primary shrink-0" />
                <span>Citations: {doc.title.split(".")[0]}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Quick hover utilities (Copy Bubble text) */}
      <div
        className={cn(
          "absolute opacity-0 group-hover:opacity-100 transition-opacity top-1.5 select-none",
          isUser ? "left-2" : "right-2"
        )}
      >
        <button
          onClick={handleCopyText}
          className="p-1.5 rounded-md bg-secondary/80 border border-border text-muted-foreground hover:text-foreground shadow-premium-sm transition-colors cursor-pointer"
          title="Sao chép nội dung tin nhắn"
        >
          {copiedText ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
