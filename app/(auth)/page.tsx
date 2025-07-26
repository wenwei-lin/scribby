"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Home, FileText, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const recentExercises = [
    {
      title: "春天的公园",
      type: "照片描写练习",
      date: "2023年10月15日",
      score: 85,
      icon: "📷",
    },
    {
      title: "我的理想职业",
      type: "自由写作练习",
      date: "2023年10月12日",
      score: 90,
      icon: "✏️",
    },
    {
      title: "校园操场",
      type: "场景拆解练习",
      date: "2023年10月10日",
      score: 88,
      icon: "🏫",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-100 to-red-100 relative overflow-hidden">
      {/* 装饰性背景元素 - 延续登录页风格 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 浮动圆圈 */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-[#E54A2B] rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "12s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-[#E54A2B] rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "4s", animationDuration: "15s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-20 h-20 bg-[#E54A2B] rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "8s", animationDuration: "14s" }}
        ></div>

        {/* 装饰性线条 */}
        <div className="absolute top-1/4 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#E54A2B] to-transparent transform -rotate-45"></div>
        <div className="absolute bottom-1/4 right-0 w-40 h-0.5 bg-gradient-to-l from-transparent via-[#E54A2B] to-transparent transform rotate-45"></div>

        {/* 点状装饰 */}
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-8 px-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-screen relative border border-white/20">
          {/* 装饰性背景图案 */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-20 h-20 border-2 border-[#E54A2B] rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 border-2 border-[#E54A2B] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#E54A2B] rounded-full"></div>
          </div>

          {/* 标题区域 */}
          <div className="text-center mb-16">
            <div className="w-full flex justify-center mt-0 mb-4">
              <div className="relative">
                <span
                  className="text-8xl italic tracking-widest font-bold"
                  style={{
                    color: "#FE5933",
                    fontFamily:
                      "'Comic Sans MS', 'Comic Sans', cursive, 'Arial Rounded MT Bold', sans-serif",
                    textShadow: "0 4px 8px rgba(254, 89, 51, 0.3)",
                    filter: "drop-shadow(0 8px 16px rgba(254, 89, 51, 0.2))",
                  }}
                >
                  noodling
                </span>
                {/* 装饰性下划线 */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#E54A2B] to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 练习选项卡片 */}
          <div className="grid grid-cols-3 gap-12 mt-24 mb-20">
            {/* 场景拆解练习 */}
            <Link href="/scene-practice">
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 border border-gray-200/30 relative overflow-hidden">
                  {/* 微妙背景纹理 */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 50%, rgba(254, 89, 51, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(229, 74, 43, 0.1) 0%, transparent 50%)",
                    }}
                  ></div>

                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E54A2B] to-[#FE5933] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_25px_rgba(229,74,43,0.3)] group-hover:shadow-[0_12px_35px_rgba(229,74,43,0.4)] transition-shadow duration-500">
                      <span className="text-4xl">🏫</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                      场景拆解练习
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      观察细节，描绘世界
                    </p>
                  </div>

                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E54A2B]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            </Link>

            {/* 照片描写练习 */}
            <Link href="/photo-practice">
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 border border-gray-200/30 relative overflow-hidden">
                  {/* 微妙背景纹理 */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 50%, rgba(254, 89, 51, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(229, 74, 43, 0.1) 0%, transparent 50%)",
                    }}
                  ></div>

                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E54A2B] to-[#FE5933] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_25px_rgba(229,74,43,0.3)] group-hover:shadow-[0_12px_35px_rgba(229,74,43,0.4)] transition-shadow duration-500">
                      <span className="text-4xl">📷</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                      照片描写练习
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      捕捉瞬间，定格美好
                    </p>
                  </div>

                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E54A2B]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            </Link>

            {/* 自由写作练习 */}
            <Link href="/free-writing">
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 border border-gray-200/30 relative overflow-hidden">
                  {/* 微妙背景纹理 */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 50%, rgba(254, 89, 51, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(229, 74, 43, 0.1) 0%, transparent 50%)",
                    }}
                  ></div>

                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E54A2B] to-[#FE5933] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_25px_rgba(229,74,43,0.3)] group-hover:shadow-[0_12px_35px_rgba(229,74,43,0.4)] transition-shadow duration-500">
                      <span className="text-4xl">✏️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                      自由写作练习
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      释放灵感，创造奇迹
                    </p>
                  </div>

                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E54A2B]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* 动态装饰区域 */}
          <div className="mt-16 relative">
            {/* 装饰性文字 */}
            <div className="text-center mb-8"></div>

            {/* 动态铅笔图标装饰 */}
            <div className="flex justify-center items-center space-x-20">
              {/* 左侧吉祥物 */}
              <div className="relative">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "0.5s", animationDuration: "4s" }}
                >
                  <div className="relative">
                    <span className="text-3xl">🦉</span>
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      ✏️
                    </span>
                  </div>
                </div>
                <div
                  className="absolute -top-3 -right-3 w-5 h-5 bg-[#E54A2B] rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#FE5933] rounded-full animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>

              {/* 左侧铅笔图标 */}
              <div className="relative">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "3s" }}
                >
                  <span className="text-2xl">✏️</span>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#E54A2B] rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>

              {/* 中间装饰元素 */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="w-2 h-2 bg-[#E54A2B] rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-[#FE5933] rounded-full animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-[#E54A2B] rounded-full animate-ping"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>

              {/* 右侧铅笔图标 */}
              <div className="relative">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "1.5s", animationDuration: "3s" }}
                >
                  <span className="text-2xl">✏️</span>
                </div>
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-[#FE5933] rounded-full animate-ping"
                  style={{ animationDelay: "2.5s" }}
                ></div>
              </div>

              {/* 右侧吉祥物 */}
              <div className="relative">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "2s", animationDuration: "4s" }}
                >
                  <div className="relative">
                    <span className="text-3xl">🐱</span>
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      ✏️
                    </span>
                  </div>
                </div>
                <div
                  className="absolute -top-3 -left-3 w-5 h-5 bg-[#FE5933] rounded-full animate-ping"
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div
                  className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping"
                  style={{ animationDelay: "3s" }}
                ></div>
              </div>
            </div>

            {/* 底部装饰线条 */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#E54A2B] to-transparent rounded-full"></div>
            </div>

            {/* 浮动装饰元素 */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-4 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping opacity-60"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute top-8 right-1/4 w-2 h-2 bg-[#FE5933] rounded-full animate-ping opacity-60"
                style={{ animationDelay: "1.2s" }}
              ></div>
              <div
                className="absolute bottom-4 left-1/3 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping opacity-60"
                style={{ animationDelay: "1.8s" }}
              ></div>
              <div
                className="absolute bottom-8 right-1/3 w-3 h-3 bg-[#FE5933] rounded-full animate-ping opacity-60"
                style={{ animationDelay: "2.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
