"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Menu, Clock, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

export default function WritingEditor() {
  const [wordCount, setWordCount] = useState(0);
  const [antiHumanMode, setAntiHumanMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // TipTap 编辑器配置
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "开始你的创作之旅...",
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

  // 保存作品
  const handleSave = () => {
    if (editor && editor.getText().trim()) {
      alert(
        `作品已保存！\n字数：${wordCount}\n用时：${formatTime(timeElapsed)}`
      );
    }
  };

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
        >
          <SaveIcon className="w-5 h-5" />
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

      {/* 右下角吉祥物 */}
      <div className="fixed bottom-6 right-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
          <img src="/images/ai-icon.png" />
        </div>
      </div>

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
