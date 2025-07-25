"use server";
import { z } from "zod";
import { env } from "process";
import { generateObject, generateText } from "ai";
import { AzureOpenAI } from "@/lib/model";

const FreeWritingQuestionSchema = z.object({
  title: z.string(),
  description: z.string().describe("Markdown格式的描述"),
});

export const generateFreeWritingQuestion = async (
  answers: { question: string; answer: string }[]
) => {
  const prompt = `你是一个文学写作教练。你的任务是生成一个可以在5~10分钟内完成的写作练习。（这个练习包含：1、基于用户的个人经历、兴趣爱好等，以一个短语或一句话为中心的、富有文学张力的主题 2、字数、写作技术或（从什么人物、物品出发，宏观微观等）视角的要求 3、部分可能的写作方向 4、在用户不指定的情况下，体裁要求随机。）
  # 用户兴趣爱好
  ${answers
    .map((answer) => `- ${answer.question}: ${answer.answer}`)
    .join("\n")}
  `;
  console.log(prompt)

  const { object } = await generateObject({
    model: AzureOpenAI("gpt-4o"),
    prompt,
    schema: FreeWritingQuestionSchema,
  });

  console.log(JSON.stringify(object));

  return object;
};
