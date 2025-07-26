"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { hashPassword } from "@/utils/string";
import { loginOrRegister } from "./action";
import { Toast } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const hashedPassword = hashPassword(password);
    const { success, message } = await loginOrRegister({
      email: username,
      password: hashedPassword,
    });
    console.log(message, success);

    if (success) {
      Toast.success(message);
      router.push("/dashboard");
    } else {
      Toast.error(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-100 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
              {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 浮动圆圈 */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#E54A2B] rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '12s'}}></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-[#E54A2B] rounded-full opacity-30 animate-bounce" style={{animationDelay: '4s', animationDuration: '15s'}}></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-[#E54A2B] rounded-full opacity-25 animate-bounce" style={{animationDelay: '8s', animationDuration: '14s'}}></div>
        
        {/* 装饰性线条 */}
        <div className="absolute top-1/4 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#E54A2B] to-transparent transform -rotate-45"></div>
        <div className="absolute bottom-1/4 right-0 w-40 h-0.5 bg-gradient-to-l from-transparent via-[#E54A2B] to-transparent transform rotate-45"></div>
        
        {/* 点状装饰 */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="flex max-w-8xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex-col relative z-10 border border-white/20">
        {/* 顶部 scribby */}
        <div className="w-full flex justify-center mt-8 mb-2">
          <div className="relative">
            <span
              className="text-9xl italic tracking-widest font-bold"
              style={{
                color: "#FE5933",
                fontFamily: "'Comic Sans MS', 'Comic Sans', cursive, 'Arial Rounded MT Bold', sans-serif",
                textShadow: "0 4px 8px rgba(254, 89, 51, 0.3)",
                filter: "drop-shadow(0 8px 16px rgba(254, 89, 51, 0.2))"
              }}
            >
              scribby
            </span>
            {/* 装饰性下划线 */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#E54A2B] to-transparent rounded-full"></div>
          </div>
        </div>
        {/* 主体内容左右分布 */}
        <div className="flex w-full">
          {/* 左侧图片区域 */}
          <div className="flex-1 relative flex items-center justify-center p-6">
            <div className="relative">
              <div className="w-80 h-80 bg-black rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/logo.png"
                  alt="Children writing together"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 右侧登录区域 */}
          <div className="flex-1 p-8 py-32 flex flex-col justify-center relative">
            {/* 装饰性背景图案 */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-20 h-20 border-2 border-[#E54A2B] rounded-full"></div>
              <div className="absolute bottom-20 left-10 w-16 h-16 border-2 border-[#E54A2B] rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#E54A2B] rounded-full"></div>
            </div>
            
            <div className="max-w-md mx-auto w-full relative z-10">
              {/* 欢迎文字 */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎回来！</h2>
                <p className="text-gray-600">开始你的创意写作之旅</p>
              </div>
              
              {/* 登录表单 */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="请输入邮箱"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 bg-gray-50/80 backdrop-blur-sm border-0 rounded-xl pl-12 focus:ring-2 focus:ring-[#E54A2B] focus:bg-white transition-all duration-300"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 bg-gray-50/80 backdrop-blur-sm border-0 rounded-xl pl-12 focus:ring-2 focus:ring-[#E54A2B] focus:bg-white transition-all duration-300"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full h-12 bg-[#E54A2B] hover:bg-[#D84315] text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                登录 <ArrowRight className="ml-2 w-4 h-4 animate-pulse" />
              </Button>
              
              {/* 装饰性底部文字 */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">让创意在笔尖流淌 ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
