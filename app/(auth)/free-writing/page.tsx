"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FreeWritingQuestion() {
  const [answers, setAnswers] = useState({
    motivation: "",
    method: "",
    emotion: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerate = () => {
    alert("正在生成写作主题...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">F060</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">自由写作练习</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <Card className="w-full max-w-2xl border-0 shadow-lg">
          <CardHeader className="text-center pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">个性化写作主题生成</h2>
            <p className="text-gray-600">告诉我们你的兴趣，生成专属你的主题</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-3">你最喜欢的动物是？</label>
              <Input
                placeholder="例如：猫、狗、熊猫..."
                value={answers.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                className="h-12 bg-gray-100 border-0 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-3">你想学会的地方是？</label>
              <Input
                placeholder="例如：巴黎、海边、游乐园等..."
                value={answers.method}
                onChange={(e) => handleInputChange("method", e.target.value)}
                className="h-12 bg-gray-100 border-0 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-3">一件让你开心的事情是？</label>
              <Input
                placeholder="例如：过年、看书、踢球、玩游戏..."
                value={answers.emotion}
                onChange={(e) => handleInputChange("emotion", e.target.value)}
                className="h-12 bg-gray-100 border-0 rounded-xl"
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full h-12 bg-[#FE5933] hover:bg-[#E54A2B] text-white rounded-xl font-medium text-base mt-8"
            >
              生成写作主题
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
