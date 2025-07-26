"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PhotoPractice() {
  const [selectedImage, setSelectedImage] = useState("/images/mountain-lake.png")

  const writingPrompts = [
    {
      type: "视觉感受",
      content: "描述画面中的色彩，光线和视觉元素，营造出生动的视觉体验。",
      position: "top-1/4 left-1/4",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      type: "情感联想",
      content: "这幅画面会给你什么样的感受？",
      position: "top-1/3 right-1/4",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      type: "故事想象",
      content: "这幅画面背后可能发生的故事，展开你的想象，创作出生动的情节。",
      position: "bottom-1/3 left-1/3",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-red-50 flex items-center justify-center relative overflow-hidden p-4">
      {/* 背景橙色圆点装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#E54A2B] rounded-full opacity-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '12s'}}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-[#E54A2B] rounded-full opacity-15 animate-bounce" style={{animationDelay: '4s', animationDuration: '15s'}}></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-[#E54A2B] rounded-full opacity-10 animate-bounce" style={{animationDelay: '8s', animationDuration: '14s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* 主体内容卡片 */}
      <div className="relative z-10 w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl border-2 border-orange-100 p-8">
        {/* 顶部导航 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">📷</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">照片描写练习</h1>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">选择或上传一张照片</h2>
            <p className="text-gray-600">上传一张照片，开始你的描写练习</p>
          </div>

          {/* 照片展示区域 */}
          <div className="relative mb-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200">
                  <Image src={selectedImage || "/placeholder.svg"} alt="Practice image" fill className="object-cover" />

                  {/* 写作提示气泡 */}
                  {writingPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className={`absolute ${prompt.position} transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <div
                        className={`${prompt.bgColor} ${prompt.textColor} p-3 rounded-lg shadow-md max-w-xs relative`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs">📍</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">{prompt.type}</h4>
                            <p className="text-xs leading-relaxed">{prompt.content}</p>
                          </div>
                        </div>
                        {/* 心形图标 */}
                        {index === 1 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-xs">❤️</span>
                          </div>
                        )}
                        {/* 位置图标 */}
                        {index === 2 && (
                          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-500 text-xs">📍</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center space-x-4">
            <Button className="bg-[#FE5933] hover:bg-[#E54A2B] text-white px-6 py-3">
              <Camera className="w-4 h-4 mr-2" />
              选择照片
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
            >
              <Upload className="w-4 h-4 mr-2" />
              上传照片
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
