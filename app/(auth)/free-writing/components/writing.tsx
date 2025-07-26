"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Menu, Clock, SaveIcon } from "lucide-react";
import Link from "next/link";

export default function WritingEditor() {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [antiHumanMode, setAntiHumanMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 计算字数
  useEffect(() => {
    const count = content.replace(/\s/g, "").length;
    setWordCount(count);
  }, [content]);

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

  // 处理文本变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // 反人类模式下不允许删除内容
    if (antiHumanMode && newContent.length < content.length) {
      return;
    }

    setContent(newContent);

    // 开始写作时启动计时器
    if (!isWriting && newContent.length > 0) {
      setIsWriting(true);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 反人类模式下禁用删除键
    if (antiHumanMode && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      return;
    }
  };

  // 切换反人类模式
  const toggleAntiHumanMode = () => {
    setAntiHumanMode(!antiHumanMode);
  };

  // 保存作品
  const handleSave = () => {
    if (content.trim()) {
      alert(
        `作品已保存！\n字数：${wordCount}\n用时：${formatTime(timeElapsed)}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-300 relative overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-6">
        <Link href="/dashboard">
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
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="type here..."
              className="absolute top-0 w-full h-full min-h-[450px] resize-none border-none outline-none text-lg leading-relaxed text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            />
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
    </div>
  );
}
