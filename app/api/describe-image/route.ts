import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ImageAnalysisClient } from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";
import { AzureOpenAI } from "@/lib/model";

export const AIRecognizeSchema = z.object({
  regions: z.array(
    z.object({
      id: z.number(),
      tip: z
        .string()
        .describe(
          "描写提示，包含：1）适宜的描写提示 2）其他感官联想 3）可能性联想"
        ),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const endpoint = process.env.VISION_ENDPOINT;
    const key = process.env.VISION_KEY;

    if (!endpoint || !key) {
      return NextResponse.json(
        { error: "Azure Vision credentials not configured" },
        { status: 500 }
      );
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // 创建 Supabase 客户端
    const supabase = await createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 生成唯一文件名
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `describe-image/${fileName}`;

    // 上传文件到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("describe-image") // 确保你在 Supabase 中创建了名为 'images' 的 bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // 获取公共 URL
    const { data: publicUrlData } = supabase.storage
      .from("describe-image")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // 创建 Azure Vision 客户端
    const credential = new AzureKeyCredential(key);
    const client = createClient(endpoint, credential);

    // 设置分析特性 - 包含物体检测和区域识别
    const features = [
      "Caption", // 图片描述
      "Objects", // 物体检测
      "Tags", // 标签
      "Read", // 文字识别
    ];

    // 调用 Azure Vision API
    const result = await client.path("/imageanalysis:analyze").post({
      body: {
        url: imageUrl,
      },
      queryParameters: {
        features: features,
        "model-version": "latest",
        // 移除语言参数，使用默认英文（避免语言不支持的错误）
      },
      contentType: "application/json",
    });

    // 检查 API 调用是否成功
    if (result.status !== "200") {
      console.error("Azure Vision API error:", result.body);
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    const iaResult = result.body as any; // 类型断言以避免 TypeScript 错误

    // 处理结果
    const analysisResult: any = {
      imageUrl: imageUrl,
      filePath: filePath,
    };

    // 图片整体描述
    if (iaResult.captionResult) {
      analysisResult.caption = {
        text: iaResult.captionResult.text,
        confidence: iaResult.captionResult.confidence,
      };
    }

    // 物体检测结果
    if (iaResult.objectsResult) {
      analysisResult.objects = iaResult.objectsResult.values.map(
        (obj: any) => ({
          name: obj.tags[0]?.name || "unknown",
          confidence: obj.tags[0]?.confidence || 0,
          boundingBox: obj.boundingBox, // 包含物体的区域坐标
        })
      );
    }

    // 标签
    if (iaResult.tagsResult) {
      analysisResult.tags = iaResult.tagsResult.values.map((tag: any) => ({
        name: tag.name,
        confidence: tag.confidence,
      }));
    }

    // 文字识别
    if (iaResult.readResult) {
      analysisResult.text = iaResult.readResult.blocks.map((block: any) => ({
        text: block.lines.map((line: any) => line.text).join(" "),
        boundingBox: block.boundingBox,
      }));
    }

    // 密集描述（区域描述）
    if (iaResult.denseCaptionsResult) {
      analysisResult.denseCaptions = iaResult.denseCaptionsResult.values.map(
        (caption: any) => ({
          text: caption.text,
          confidence: caption.confidence,
          boundingBox: caption.boundingBox, // 该描述对应的区域
        })
      );
    }

    // 构建区域信息字符串
    let regionsInfo = "";
    if (analysisResult.objects && analysisResult.objects.length > 0) {
      regionsInfo = analysisResult.objects
        .map((obj: any, index: number) => {
          const bbox = obj.boundingBox;
          return `- id=${index}, label=${obj.name}, bbox=(x:${bbox.x}, y:${bbox.y}, w:${bbox.w}, h:${bbox.h})`;
        })
        .join("\n");
    }

    const prompt = `你是一个物品识别器。以下是图片中识别出的物体和区域信息：

图片描述：${analysisResult.caption?.text || "无描述"}

图片中的物体及区域：
${regionsInfo}

请为每个识别出的物体生成描写提示。每个物体的描写提示应该包括：
1、适宜的描写提示（根据物体和图片结合，指导如何描写这个物体）
2、其他感官联想（照片中看不到但可以想象的感官体验）
3、可能性联想（基于物体和场景的合理想象）

示例格式：
适宜的描写提示：描述人物的姿态和表情
其他感官联想：或许能听到轻快的脚步声
可能性联想：这可能是在公园里晨练的人

请为每个区域（按id顺序）生成结构化的描写提示。`;

    // 调用AI生成描写提示
    try {
      const aiResponse = await generateObject({
        model: AzureOpenAI("gpt-4o"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                image: imageUrl, // 直接传递图片URL
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        schema: AIRecognizeSchema,
      });

      // 合并AI结果和原始分析结果
      const enhancedObjects =
        analysisResult.objects?.map((obj: any, index: number) => ({
          ...obj,
          id: index,
          tip:
            aiResponse.object.regions.find((region: any) => region.id === index)
              ?.tip || "暂无描写提示",
        })) || [];

      analysisResult.enhancedObjects = enhancedObjects;

      console.log(
        "AI生成的描写提示:",
        JSON.stringify(aiResponse.object, null, 2)
      );
    } catch (aiError) {
      console.error("AI生成描写提示失败:", aiError);
      // 如果AI调用失败，使用默认的描写提示
      analysisResult.enhancedObjects =
        analysisResult.objects?.map((obj: any, index: number) => ({
          ...obj,
          id: index,
          tip: `请描写这个${obj.name}的外观特征和在画面中的位置`,
        })) || [];
    }

    console.log("完整分析结果:", JSON.stringify(analysisResult, null, 2));

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
