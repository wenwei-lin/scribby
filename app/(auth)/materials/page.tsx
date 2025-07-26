"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const materials = [
    {
      title: "《我与春天有个约会》",
      description:
        "这篇文章描述了我和春天的美丽邂逅，白雪皑皑，温暖如春的感受...",
      date: "2023年4月12日",
      category: "记叙文",
      level: "美文",

      type: "记叙文",
    },
    {
      title: "《好像，从来都是》",
      description:
        "文章描述了对现代社会中的种种现象的思考，对人生的感悟，社会三个问题提出了自己的看法...",
      date: "2023年5月20日",
      category: "议论文",
      level: "升华",

      type: "议论文",
    },
    {
      title: "《钢铁是怎样炼成的》",
      description:
        "保尔·柯察金的故事告诉我们坚强，坚持初心的重要性，让我们从中学习到坚韧不拔的精神...",
      date: "2023年3月8日",
      category: "读后感",
      level: "深度",

      type: "读后感",
    },
    {
      title: "《春天的四季》",
      description:
        "这篇文章生动描述了春天的美丽景色，春天的花朵，春天的温暖，春天的生机...",
      date: "2023年6月8日",
      category: "散文",
      level: "美文",

      type: "描写文",
    },
    {
      title: "《中国传统节日》",
      description:
        "文章详细介绍了中国几个主要传统节日的起源，习俗和文化内涵，包括春节，中秋节等...",
      date: "2023年2月10日",
      category: "说明文",
      level: "传统文化",

      type: "说明文",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      记叙文: "bg-blue-100 text-blue-700",
      议论文: "bg-purple-100 text-purple-700",
      读后感: "bg-green-100 text-green-700",
      描写文: "bg-yellow-100 text-yellow-700",
      说明文: "bg-red-100 text-red-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-red-50 flex items-center justify-center relative overflow-hidden p-4">
      {/* 背景橙色圆点装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-[#E54A2B] rounded-full opacity-10 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "12s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-[#E54A2B] rounded-full opacity-15 animate-bounce"
          style={{ animationDelay: "4s", animationDuration: "15s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-20 h-20 bg-[#E54A2B] rounded-full opacity-10 animate-bounce"
          style={{ animationDelay: "8s", animationDuration: "14s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* 主体内容卡片 */}
      <div className="relative z-10 w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl border-2 border-orange-100 p-8">
        {/* 顶部导航 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">✏️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">写作素材库</h1>
          </div>
          <Button
            variant="outline"
            className="h-10 px-4 rounded-lg bg-transparent"
          >
            日期 ▼
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 rounded-lg bg-transparent"
          >
            练习类型 ▼
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 rounded-lg bg-yellow-100 text-yellow-700 border-yellow-200"
          >
            标签 ▼
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索作品标题、综合类内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-0 rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-lg bg-transparent"
            >
              日期 ▼
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-lg bg-transparent"
            >
              练习类型 ▼
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-lg bg-yellow-100 text-yellow-700 border-yellow-200"
            >
              标签 ▼
            </Button>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {materials.map((material, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {material.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{material.date}</span>
                      <Badge
                        className={`${getCategoryColor(
                          material.category
                        )} border-0`}
                      >
                        {material.category}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200">
                        {material.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {material.score > 0 && (
                      <>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          AI评分: {material.score}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#FE5933] hover:bg-[#E54A2B] text-white"
                  >
                    查看 <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态提示 */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✏️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            你的素材库还是空的
          </h3>
          <p className="text-gray-600 mb-6">
            开始你的写作之旅，创作精彩文章，获得AI智能反馈，让你的作品越来越出色！
          </p>
          <Button className="bg-[#FE5933] hover:bg-[#E54A2B] text-white">
            <Plus className="w-4 h-4 mr-2" />
            立即开始写作
          </Button>
        </div>

        {/* 分页 */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button variant="ghost" size="sm" disabled>
            ‹
          </Button>
          <Button
            size="sm"
            className={`w-8 h-8 ${
              currentPage === 1
                ? "bg-[#FE5933] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            1
          </Button>
          <Button size="sm" className="w-8 h-8 bg-white text-gray-700">
            2
          </Button>
          <Button size="sm" className="w-8 h-8 bg-white text-gray-700">
            3
          </Button>
          <Button variant="ghost" size="sm">
            ›
          </Button>
        </div>

        {/* 底部新写作按钮 */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Button className="bg-[#FE5933] hover:bg-[#E54A2B] text-white px-6 py-3 rounded-full shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            开始新写作
          </Button>
        </div>
      </div>
    </div>
  );
}
