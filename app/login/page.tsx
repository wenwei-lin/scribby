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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* 左侧图片区域 */}
        <div className="flex-1 relative  flex items-center justify-center p-8">
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
        <div className="flex-1 p-12 py-48 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* 登录表单 */}
            <div className="space-y-4 mb-6">
              <Input
                type="text"
                placeholder="请输入邮箱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-gray-50 border-0 rounded-xl"
              />
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-gray-50 border-0 rounded-xl"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-[#FE5933] hover:bg-[#E54A2B] text-white rounded-xl font-medium text-base"
            >
              登录 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
