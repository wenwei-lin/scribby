"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ScenePractice() {
  const scenes = [
    {
      title: "妈妈洗碗",
      description: "观察妈妈：充满爱心，妈妈的动作，厨房的环境，阳光照射的感觉，餐具的摆放...",
      image: "/images/kitchen-scene.png",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
    },
    {
      title: "路边煎饼",
      description: "观察场景：煎饼的香气，摊主的手艺，路客的表情，街道的热闹，早晨的温度...",
      image: "/images/street-food.png",
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    },
    {
      title: "校园操场",
      description: "观察场景：欢声笑语，运动的学生，开放的操场，不同学生的活动，天空的颜色...",
      image: "/images/school-playground.png",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
    },
    {
      title: "南后花园",
      description: "观察场景：南后花园的生气勃勃，水滴的声音，植物的颜色变化，小动物的活动，光线的变化...",
      image: "/images/garden-scene.png",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-sm">🏫</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">场景拆解练习</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">选择一个场景开始</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {scenes.map((scene, index) => (
              <Card
                key={index}
                className={`${scene.bgColor} border-0 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-0">
                  <div className="relative h-64 rounded-t-lg overflow-hidden">
                    <Image src={scene.image || "/placeholder.svg"} alt={scene.title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{scene.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{scene.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
