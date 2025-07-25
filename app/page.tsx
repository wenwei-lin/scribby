"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    // 模拟登录，直接跳转到主页
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* 左侧图片区域 */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-80 h-80 bg-black rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/children-writing.jpg"
                alt="Children writing together"
                width={320}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 右侧登录区域 */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo和标题 */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">写作小能手</h1>
              <p className="text-gray-600">笔尖生花，等你开启！</p>
            </div>

            {/* 登录表单 */}
            <div className="space-y-4 mb-6">
              <Input
                type="text"
                placeholder="用户名/手机号/邮箱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-gray-50 border-0 rounded-xl"
              />
              <Input
                type="password"
                placeholder="密码"
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

            {/* 其他登录方式 */}
            <div className="mt-8">
              <p className="text-center text-gray-500 mb-4">其他登录方式</p>
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-colors">
                  <span className="text-xl">🌟</span>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                  <span className="text-xl">🔔</span>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                  <span className="text-xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
