"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { FreeWritingQuestion } from "../action";

interface TopicCardProps {
  writingPrompt: FreeWritingQuestion;
  isMinimized: boolean;
  showContent: boolean;
  onStartWriting: () => void;
  onShowCard: () => void;
  onHideCard: () => void; // 新增：隐藏卡片的回调
}

export default function TopicCard({
  isMinimized,
  writingPrompt,
  showContent,
  onStartWriting,
  onShowCard,
  onHideCard,
}: TopicCardProps) {
  return (
    <>
      {/* 主卡片 */}
      <div
        className={`fixed transition-all duration-700 ease-in-out z-40 ${
          isMinimized
            ? "bottom-6 right-16 scale-[0.3] origin-bottom-right cursor-pointer hover:scale-[0.35]"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100"
        }`}
        onClick={isMinimized ? onShowCard : onHideCard}
      >
        <Card
          className={`bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300 border-0 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 relative ${
            isMinimized ? "w-96 hover:shadow-3xl" : "w-96"
          }`}
        >
          {/* 关闭按钮 - 只在最小化状态显示 */}
          {isMinimized && (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                onHideCard();
              }}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full z-10 opacity-0 hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </Button>
          )}

          <CardContent className="p-8 space-y-6">
            {/* Topic 标题 */}
            <div
              className={`transition-opacity duration-300 ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2
                className="text-2xl font-bold text-[#FE5933] mb-3"
                style={{ fontFamily: "serif" }}
              >
                Topic
              </h2>
              <p className="text-xl font-bold text-gray-800 leading-relaxed">
                {writingPrompt.topic}
              </p>
            </div>

            {/* Genre 体裁 */}
            <div
              className={`transition-opacity duration-300 ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              <h3
                className="text-2xl font-bold text-[#FE5933] mb-3"
                style={{ fontFamily: "serif" }}
              >
                Genre
              </h3>
              <p className="text-xl font-bold text-gray-800">
                {writingPrompt.genre}
              </p>
            </div>

            {/* Points 要点 */}
            <div
              className={`transition-opacity duration-300 ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              <h3
                className="text-2xl font-bold text-[#FE5933] mb-4"
                style={{ fontFamily: "serif" }}
              >
                Points
              </h3>
              <div className="space-y-4 text-gray-800">
                {writingPrompt.points.map((point, index) => (
                  <p className="text-base leading-relaxed" key={index}>
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 装饰元素 */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 -left-6 w-4 h-4 bg-yellow-300 rounded-full opacity-50"></div>
      </div>

      {/* 底部操作按钮 - 只在非最小化状态显示 */}
      {!isMinimized && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-48 flex items-center justify-between w-96 transition-opacity duration-500 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link href="/free-writing">
            <Button
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-300 text-gray-700 px-6 py-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              重新生成
            </Button>
          </Link>

          <Button
            onClick={onStartWriting}
            className="bg-[#FE5933] hover:bg-[#E54A2B] text-white px-8 py-3 rounded-full font-medium"
          >
            开始写作
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* 最小化状���的提示 */}
      {isMinimized && (
        <div className="fixed bottom-20 right-16 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-30 animate-bounce">
          <p className="text-xs text-gray-600">点击查看主题</p>
        </div>
      )}
    </>
  );
}
