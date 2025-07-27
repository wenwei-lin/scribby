"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getRandomQuestions } from "../util";
import { generateFreeWritingQuestion } from "../action";

export default function FreeWritingQuestionForm({
  questions,
  setQuestions,
  answers,
  setAnswers,
  handleGenerate,
}: {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  handleGenerate: () => void;
}) {
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-red-50 flex items-center justify-center relative overflow-hidden p-4 ">
      {/** 返回 */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeft />
        </Link>
      </div>

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
      <div className="relative z-10 w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-orange-100 p-12 flex flex-col items-center">
        {/* 标题 */}
        <div className="mb-10 text-center">
          <h1
            className="text-3xl font-bold text-black tracking-wider mb-6"
            style={{
              fontWeight: "bold",
              textShadow: "0 1px 0 #fff, 0 2px 4px #ffb19980",
            }}
          >
            自由写作练习
          </h1>
          <p className="text-gray-500 text-base">为你生成专属写作主题</p>
        </div>

        {/* 问题输入区 */}
        <div className="space-y-8 w-full">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 shadow-sm border border-orange-100"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🐾</span>
                <span className="text-lg font-semibold text-gray-800">
                  {question}
                </span>
              </div>

              <Input
                placeholder="请输入你的回答..."
                value={answers[`question_${index}`] || ""}
                onChange={(e) =>
                  handleInputChange(`question_${index}`, e.target.value)
                }
                className="h-14 bg-gray-50 border border-gray-200 !border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FE5933] focus:border-[#FE5933] focus-visible:border-[#FE5933] focus:bg-white transition-all duration-300 text-base px-6 placeholder:text-gray-400 placeholder:italic"
              />
            </div>
          ))}
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={async () => {
            setLoading(true);
            await handleGenerate();
            setLoading(false);
          }}
          disabled={questions.length === 0}
          className="w-full h-14 mt-12 bg-gradient-to-r from-[#FE5933] to-[#E54A2B] hover:from-[#E54A2B] hover:to-[#FE5933] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <span>生成写作主题</span>
          )}
        </Button>
      </div>
    </div>
  );
}
