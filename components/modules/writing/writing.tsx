"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clock, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Highlight from "@tiptap/extension-highlight";
import { Message } from "ai";
import AIMascot from "./ai-mascot";

interface AnalysisResult {
  highlights: Array<{
    text: string;
    type: "excellent";
    comment: string;
    start: number;
    end: number;
  }>;
  improvements: Array<{
    text: string;
    type: "improvement";
    comment: string;
    suggestion: string;
    start: number;
    end: number;
  }>;
}

interface TooltipData {
  show: boolean;
  x: number;
  y: number;
  comment: string;
  suggestion?: string;
  type: "excellent" | "improvement";
}

export interface WritingEditorProps {
  defaultChatMessages: Message[];
}

export default function WritingEditor({
  defaultChatMessages,
}: WritingEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [antiHumanMode, setAntiHumanMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [tooltip, setTooltip] = useState<TooltipData>({
    show: false,
    x: 0,
    y: 0,
    comment: "",
    type: "excellent",
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // TipTap 编辑器配置
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "开始你的创作之旅...",
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "w-full h-full min-h-[450px] resize-none border-none outline-none text-lg leading-relaxed text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none",
        style: "font-family: system-ui, -apple-system, sans-serif;",
      },
      handleClick: (view, pos, event) => {
        // 检查点击的位置是否有高亮
        const { from, to } = view.state.selection;
        const { doc } = view.state;

        // 查找点击位置的marks
        const marks = doc.resolve(pos).marks();
        const highlightMark = marks.find(
          (mark) => mark.type.name === "highlight"
        );

        if (highlightMark && analysisResult) {
          const clickedElement = event.target as HTMLElement;
          const rect = clickedElement.getBoundingClientRect();

          // 根据高亮颜色判断类型
          const isExcellent = highlightMark.attrs.color === "#fb923c";
          const dataList = isExcellent
            ? analysisResult.highlights
            : analysisResult.improvements;

          // 查找对应的分析数据
          const data = dataList.find((item) => {
            const text = clickedElement.textContent || "";
            return item.text.includes(text) || text.includes(item.text);
          });

          if (data) {
            setTooltip({
              show: true,
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
              comment: data.comment,
              suggestion: "suggestion" in data ? data.suggestion : undefined,
              type: data.type as "excellent" | "improvement",
            });
          }
        } else {
          setTooltip((prev) => ({ ...prev, show: false }));
        }

        return false; // 让编辑器继续处理事件
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      const count = content.replace(/\s/g, "").length;
      setWordCount(count);

      // 开始写作时启动计时器
      if (!isWriting && content.length > 0) {
        setIsWriting(true);
      }
    },
  });

  // 计时器
  useEffect(() => {
    if (isWriting) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isWriting]);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 切换反人类模式
  const toggleAntiHumanMode = () => {
    setAntiHumanMode(!antiHumanMode);
  };

  // 分析文本并应用高亮
  const analyzeText = async () => {
    if (!editor || !editor.getText().trim()) {
      alert("请先输入一些内容再进行分析");
      return;
    }

    setIsAnalyzing(true);
    try {
      const content = editor.getText();
      const response = await fetch("/api/analyze-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("分析失败");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);

      // 应用高亮
      applyHighlights(result);
    } catch (error) {
      console.error("Error analyzing text:", error);
      alert("分析失败，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 应用高亮到编辑器
  const applyHighlights = (result: AnalysisResult) => {
    if (!editor) return;

    const { state, dispatch } = editor.view;
    const { doc } = state;

    let tr = state.tr;

    // 清除现有高亮
    doc.descendants((node, pos) => {
      if (node.isText) {
        const marks = node.marks.filter(
          (mark) => mark.type.name !== "highlight"
        );
        if (marks.length !== node.marks.length) {
          tr = tr.removeMark(
            pos,
            pos + node.nodeSize,
            state.schema.marks.highlight
          );
        }
      }
    });

    // 查找文本位置的辅助函数
    const findTextPosition = (searchText: string) => {
      let positions: Array<{ start: number; end: number }> = [];

      doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          let searchIndex = 0;
          while (
            (searchIndex = node.text.indexOf(searchText, searchIndex)) !== -1
          ) {
            positions.push({
              start: pos + searchIndex,
              end: pos + searchIndex + searchText.length,
            });
            searchIndex += searchText.length;
          }
        }
      });

      return positions;
    };

    // 应用精彩句子的高亮（橙色）
    result.highlights.forEach((highlight) => {
      const positions = findTextPosition(highlight.text);
      positions.forEach(({ start, end }) => {
        tr = tr.addMark(
          start,
          end,
          state.schema.marks.highlight.create({ color: "#fb923c" })
        );
      });
    });

    // 应用需要改进句子的下划线样式
    result.improvements.forEach((improvement) => {
      const positions = findTextPosition(improvement.text);
      positions.forEach(({ start, end }) => {
        tr = tr.addMark(
          start,
          end,
          state.schema.marks.highlight.create({ color: "transparent" })
        );
      });
    });

    dispatch(tr);
  };

  // 保存作品
  const handleSave = async () => {
    if (editor && editor.getText().trim()) {
      await analyzeText();
      alert(
        `作品已保存并分析完成！\n字数：${wordCount}\n用时：${formatTime(
          timeElapsed
        )}\n\n橙色高亮：精彩句子\n下划线：可改进句子\n点击高亮文本查看AI评价`
      );
    }
  };

  // 切换对话状态
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 获取当前写作内容
  const getCurrentWriting = () => {
    return editor ? editor.getText() : "";
  };

  // 点击外部隐藏悬浮提示
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 如果点击的不是高亮文本，隐藏提示
      if (!target.closest("mark") && !target.closest("[data-tooltip]")) {
        setTooltip((prev) => ({ ...prev, show: false }));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-300 relative overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-white/20 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 hover:bg-white/20 rounded-xl"
          onClick={handleSave}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">分析中...</span>
            </div>
          ) : (
            <SaveIcon className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between px-6 mb-8">
        <div className="flex items-center space-x-4">
          <h1
            className="text-4xl font-bold text-gray-800"
            style={{ fontFamily: "serif" }}
          >
            任书
          </h1>
          <span className="text-xl text-gray-600 font-light">Free Writing</span>
        </div>

        <div className="flex items-center space-x-6">
          {/* 反人类模式开关 */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">反人类模式</span>
            <Switch
              checked={antiHumanMode}
              onCheckedChange={toggleAntiHumanMode}
              className="data-[state=checked]:bg-[#FE5933]"
            />
          </div>

          {/* 计时器 */}
          <div className="flex items-center space-x-2 bg-white/30 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-mono font-medium">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      </div>

      {/* 主要写作区域 */}
      <div className="px-6 pb-10">
        <div className="relative">
          {/* 云朵形状的写作区域 */}
          <div className="relative">
            <img
              src="/images/writing-bg.png"
              alt="writing-bg"
              className="w-full h-full"
            />
            <div className="absolute top-0 left-0 w-full h-full p-24">
              <EditorContent
                editor={editor}
                className="w-full h-full min-h-[450px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="absolute right-32 bottom-8 flex flex-col items-end space-y-2 z-10">
        <span className="text-gray-700 font-medium">{wordCount}个字</span>
        <span className="text-gray-600 text-sm">
          {antiHumanMode
            ? "反人类模式已开启：无法使用删除键"
            : "反人类模式已关闭：可以使用删除键"}
        </span>
      </div>

      {/* 悬浮提示 */}
      {tooltip.show && (
        <div
          className="fixed z-50 bg-black/90 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left: tooltip.x - 150, // 居中显示
            top: tooltip.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  tooltip.type === "excellent" ? "bg-orange-400" : "bg-blue-400"
                }`}
              />
              <span className="font-medium">
                {tooltip.type === "excellent" ? "精彩句子" : "可改进"}
              </span>
            </div>
            <p className="text-white/90">{tooltip.comment}</p>
            {tooltip.suggestion && (
              <div className="pt-1 border-t border-white/20">
                <p className="text-blue-200 text-xs">
                  建议：{tooltip.suggestion}
                </p>
              </div>
            )}
          </div>
          {/* 箭头 */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(0, 0, 0, 0.9)",
            }}
          />
        </div>
      )}

      {/* AI吉祥物 */}
      <AIMascot getCurrentWriting={getCurrentWriting} />

      {/* TipTap 编辑器自定义样式 */}
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          background: transparent !important;
          min-height: 450px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 1.25rem;
          line-height: 1.75;
          color: #374151;
        }

        /* 高亮样式 */
        .ProseMirror mark.highlight {
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .ProseMirror mark.highlight[data-color="#fb923c"] {
          background-color: #fb923c !important;
          color: white !important;
        }

        .ProseMirror mark.highlight[data-color="#fb923c"]:hover {
          background-color: #ea580c !important;
          transform: scale(1.02);
        }

        /* 下划线样式（用于需要改进的句子） */
        .ProseMirror mark.highlight[data-color="transparent"] {
          background-color: transparent !important;
          border-bottom: 2px dashed #ef4444 !important;
          padding: 0 !important;
        }

        .ProseMirror mark.highlight[data-color="transparent"]:hover {
          border-bottom-color: #dc2626 !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
        }

        .ProseMirror p {
          margin: 0.5rem 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: "开始你的创作之旅...";
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.2;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.3;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .ProseMirror code {
          background-color: rgba(243, 244, 246, 0.5);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875em;
        }

        .ProseMirror pre {
          background-color: rgba(31, 41, 55, 0.8);
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
