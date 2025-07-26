import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { AzureOpenAI } from "@/lib/model";

// 定义分析结果的schema
const analysisSchema = z.object({
  highlights: z.array(
    z.object({
      text: z.string(),
      type: z.literal("excellent"),
      comment: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
  improvements: z.array(
    z.object({
      text: z.string(),
      type: z.literal("improvement"),
      comment: z.string(),
      suggestion: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: AzureOpenAI("gpt-4o"),
      schema: analysisSchema,
      prompt: `你是一个专业的写作分析师。请分析以下写作内容，识别出：

1. 精彩的句子或短语（语言优美、表达生动、有深度的部分）
2. 需要改进的句子或短语（语法问题、表达不清、可以优化的部分）

分析内容：
${content}

要求：
- 精选最有代表性的句子，highlights和improvements各选择2-4个
- 评价要具体和有建设性
- text字段要与原文完全一致
- start和end是在原文中的字符位置索引
- comment要简洁明了，提供具体的分析
- suggestion要给出具体的改进建议

重要：
- highlights数组中每个对象的type字段必须是"excellent"
- improvements数组中每个对象的type字段必须是"improvement"
- 不要使用其他type值，严格按照要求`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("Error analyzing writing:", error);
    return NextResponse.json(
      { error: "Failed to analyze writing" },
      { status: 500 }
    );
  }
}
