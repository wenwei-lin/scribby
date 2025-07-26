"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Menu, Clock } from "lucide-react";
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
          <Menu className="w-5 h-5" />
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
      <div className="px-6 pb-6">
        <div className="relative">
          {/* 云朵形状的写作区域 */}
          <div className="relative bg-white rounded-[3rem] shadow-lg min-h-[500px] p-8">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="type here..."
              className="w-full h-full min-h-[450px] resize-none border-none outline-none text-lg leading-relaxed text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            />
          </div>

          {/* 底部状态栏 */}
          <div className="flex items-center justify-between mt-4 px-4">
            <div className="flex items-center space-x-6">
              <span className="text-gray-700 font-medium">{wordCount}个字</span>
              <span className="text-gray-600 text-sm">
                {antiHumanMode
                  ? "反人类模式已开启：无法使用删除键"
                  : "反人类模式已关闭：可以使用删除键"}
              </span>
            </div>

            {/* 保存按钮 */}
            {content.trim() && (
              <Button
                onClick={handleSave}
                className="bg-[#FE5933] hover:bg-[#E54A2B] text-white px-6 py-2 rounded-full"
              >
                保存作品
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 右下角吉祥物 */}
      <div className="fixed bottom-6 right-6">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl">👑</div>
        </div>
      </div>

      {/* 写作提示浮窗 */}
      {!content && !isWriting && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-md text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✏️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            开始你的创作之旅
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            点击写作区域开始创作。开启反人类模式可以帮助你专注写作，避免过度修改。
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>专注模式</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>自动保存</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>实时统计</span>
            </div>
          </div>
        </div>
      )}

      {/* 写作进度提示 */}
      {isWriting && wordCount > 0 && wordCount % 50 === 0 && (
        <div className="fixed top-20 right-6 bg-green-100 border border-green-200 rounded-lg p-3 shadow-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">🎉</span>
            <span className="text-green-700 font-medium text-sm">
              太棒了！已写{wordCount}字
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
