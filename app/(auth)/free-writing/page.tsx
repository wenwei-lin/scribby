"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getRandomQuestions } from "./util";
import { FreeWritingQuestion, generateFreeWritingQuestion } from "./action";
import FreeWritingQuestionForm from "./components/question-form";
import TopicCard from "./components/topic-card";
import WritingEditor from "../../../components/modules/writing/writing";

export default function FreeWriting() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingPrompt, setWritingPrompt] = useState<FreeWritingQuestion>();
  const [startWriting, setStartWriting] = useState(false);
  const [showCardContent, setShowCardContent] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleGenerate = async () => {
    // 构建问题+回答的JSON
    const result = questions.map((question, index) => ({
      question,
      answer: answers[`question_${index}`] || "",
    }));

    console.log("问题+回答JSON:", JSON.stringify(result, null, 2));
    // alert("生成写作主题，请查看控制台输出的JSON数据");

    const question = await generateFreeWritingQuestion(result);
    console.log(question);
    setWritingPrompt(question);
    setShowCardContent(true);
    setIsMinimized(false);
  };

  return !writingPrompt ? (
    <FreeWritingQuestionForm
      questions={questions}
      setQuestions={setQuestions}
      answers={answers}
      setAnswers={setAnswers}
      handleGenerate={handleGenerate}
    />
  ) : (
    <>
      {startWriting && (
        <WritingEditor
          defaultChatMessages={[
            {
              id: "1",
              role: "user",
              content: writingPrompt.topic,
            },
          ]}
          showAntiHumanMode
        />
      )}
      <TopicCard
        writingPrompt={writingPrompt}
        isMinimized={isMinimized}
        showContent={showCardContent}
        onStartWriting={() => {
          setStartWriting(true);
          setIsMinimized(true);
          setShowCardContent(false);
        }}
        onShowCard={() => {
          setIsMinimized(false);
          setShowCardContent(true);
        }}
        onHideCard={() => {
          setIsMinimized(true);
          setShowCardContent(false);
        }}
      />
    </>
  );
}
