"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Home, FileText, Settings, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")

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
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* 顶部欢迎区域 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-lg mx-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欢迎回来，小明同学！</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>写作等级：三级</span>
              <span>积分：320</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-yellow-600">⭐</span>
            <span className="text-yellow-700 font-medium">连续学习5天</span>
          </div>
        </div>

        {/* 学习进度 */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">本周学习进度</span>
            <span className="text-sm text-gray-600">3/5 完成</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
      </div>

      <div className="flex">
        {/* 主要内容区域 */}
        <div className="flex-1 p-8">
          {/* 写作练习模块 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">写作练习</h2>
            <div className="grid grid-cols-3 gap-6">
              <Link href="/scene-practice">
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-0 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🏫</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">场景拆解练习</h3>
                    <p className="text-sm text-gray-600 mb-4">学习如何观察和描述场景细节，培养细致的观察能力</p>
                    <Button className="w-full bg-white text-gray-700 hover:bg-gray-50">
                      开始练习 <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/photo-practice">
                <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📷</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">照片描写练习</h3>
                    <p className="text-sm text-gray-600 mb-4">通过生动的照片，培养观察力和描述能力</p>
                    <Button className="w-full bg-white text-gray-700 hover:bg-gray-50">
                      开始练习 <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/free-writing">
                <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">✏️</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">自由写作练习</h3>
                    <p className="text-sm text-gray-600 mb-4">根据提示进行自由主题，进行创意写作，培养表达能力</p>
                    <Button className="w-full bg-white text-gray-700 hover:bg-gray-50">
                      开始练习 <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* 最近练习 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">最近练习</h2>
              <Button variant="ghost" className="text-[#FE5933] hover:text-[#E54A2B]">
                查看全部 <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentExercises.map((exercise, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{exercise.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{exercise.title}</h3>
                          <p className="text-sm text-gray-500">
                            {exercise.type} · {exercise.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-sm text-gray-500">得分：</span>
                          <span className="font-medium text-gray-800">{exercise.score}</span>
                        </div>
                        <Button size="sm" className="bg-[#FE5933] hover:bg-[#E54A2B]">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 写作素材库 */}
          <Card className="bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">写作素材库</h2>
                  <p className="text-gray-600 mb-4">
                    探索丰富的写作素材，包括优秀范文、经典段落和写作技巧，让你的文章更加生动有趣。
                  </p>
                </div>
                <div className="flex-shrink-0 ml-6">
                  <div className="w-24 h-24 bg-yellow-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/children-writing.jpg"
                      alt="Writing materials"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <Link href="/materials">
                <Button className="bg-[#FE5933] hover:bg-[#E54A2B] text-white">
                  进入素材库 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部导航 */}
      
    </div>
  )
}
