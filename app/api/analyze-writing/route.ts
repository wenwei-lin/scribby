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
  verbReplacements: z.array(
    z.object({
      text: z.string(),
      type: z.literal("verb"),
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
      prompt: `你是一个写作教练。用户会发给你ta的作品。请注意，你输出的内容要和原文中完全一样，不能更改。你需要用json宿主的格式输出：
1、>=3, <=6个“亮点句子”，即你认为当中优美、富有文学性、思想性的句子
2、>=3, <=5个“可改进动词”，即你认为可以改进得更精准、富有文学价值的动词。（要包含文章中的原始句子。格式为 动词：走出 原句：我走出学校大门）。标准示例：我“排出”九文大钱 比 我“拿出”九文大钱要精准，因此“拿出”可考虑输出
3、>=2, <=4个“描写聚焦”，即可以进一步聚焦描写的人物、物品等（要包含原始句子。格式为 名词：大门 原句：我走出学校大门）

分析内容：
${content}

要求：
- 精选最有代表性的内容，highlights、improvements、verbReplacements各选择2-4个
- 评价要具体和有建设性
- text字段要与原文完全一致
- start和end是在原文中的字符位置索引
- comment要简洁明了，提供具体的分析
- suggestion要给出具体的改进建议

重要：
- highlights数组中每个对象的type字段必须是"excellent"
- improvements数组中每个对象的type字段必须是"improvement"
- verbReplacements数组中每个对象的type字段必须是"verb"
- 动词替换要重点关注提升表达力度和准确性
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
