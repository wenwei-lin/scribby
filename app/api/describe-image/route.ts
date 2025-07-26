import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ImageAnalysisClient } from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";

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

    console.log(JSON.stringify(analysisResult, null, 2));

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
