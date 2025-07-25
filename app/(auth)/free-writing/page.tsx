"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getRandomQuestions } from "./util";

export default function FreeWritingQuestion() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // 获取随机的三个问题
    const randomQuestions = getRandomQuestions(3);
    setQuestions(randomQuestions);
    // 初始化答案对象
    const initialAnswers: Record<string, string> = {};
    randomQuestions.forEach((_, index) => {
      initialAnswers[`question_${index}`] = "";
    });
    setAnswers(initialAnswers);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = () => {
    // 构建问题+回答的JSON
    const result = questions.map((question, index) => ({
      question,
      answer: answers[`question_${index}`] || "",
    }));

    console.log("问题+回答JSON:", JSON.stringify(result, null, 2));
    alert("生成写作主题，请查看控制台输出的JSON数据");
  };

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              个性化写作主题生成
            </h2>
            <p className="text-gray-600">告诉我们你的兴趣，生成专属你的主题</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-3">
                  {question}
                </label>
                <Input
                  placeholder="请输入你的回答..."
                  value={answers[`question_${index}`] || ""}
                  onChange={(e) =>
                    handleInputChange(`question_${index}`, e.target.value)
                  }
                  className="h-12 bg-gray-100 border-0 rounded-xl"
                />
              </div>
            ))}

            <Button
              onClick={handleGenerate}
              className="w-full h-12 bg-[#FE5933] hover:bg-[#E54A2B] text-white rounded-xl font-medium text-base mt-8"
              disabled={questions.length === 0}
            >
              生成写作主题
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
