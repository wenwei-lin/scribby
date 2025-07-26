"use server";
import { z } from "zod";
import { env } from "process";
import { generateObject, generateText } from "ai";
import { AzureOpenAI } from "@/lib/model";

const FreeWritingQuestionSchema = z.object({
  topic: z.string(),
  genre: z.string(),
  points: z.array(z.string()),
});

export type FreeWritingQuestion = z.infer<typeof FreeWritingQuestionSchema>;

export const generateFreeWritingQuestion = async (
  answers: { question: string; answer: string }[]
) => {
  const prompt = `你是一个文学写作教练。你的任务是生成一个可以在5~10分钟内完成的写作练习。这个练习包含：
1、基于用户的个人经历、兴趣爱好等（每一条要求都必须涉及到输入的所有用户爱好），以一个短语或一句话为中心的、富有文学张力的主题 
2、体裁要求（诗歌、散文、小说等文学体裁）
3、写作技术和（从什么人物、物品出发，宏观微观等）视角的要求 （至多三条）
  # 用户兴趣爱好
  ${answers
    .map((answer) => `- ${answer.question}: ${answer.answer}`)
    .join("\n")}
  `;
  console.log(prompt);

  const { object } = await generateObject({
    model: AzureOpenAI("gpt-4o"),
    prompt,
    schema: FreeWritingQuestionSchema,
  });

  console.log(JSON.stringify(object));

  return object;
};
