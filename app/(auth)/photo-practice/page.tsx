"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ArrowLeft, Camera, Upload, Loader2, PenTool } from "lucide-react";
import Link from "next/link";
import WritingEditor from "@/components/modules/writing/writing";

export default function PhotoPractice() {
  const [selectedImage, setSelectedImage] = useState(
    "/images/mountain-lake.png"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [showInspirationCircles, setShowInspirationCircles] = useState(true);
  const [isWritingMode, setIsWritingMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      // 清除之前的分析结果
      setAnalysisResult(null);
      setImageInfo(null);
    }
  };

  // 处理图片加载，获取图片真实尺寸
  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageInfo({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight,
      });
    }
  };

  // 计算边界框在显示图片中的位置
  const calculateBoundingBox = (bbox: any) => {
    if (!imageInfo) return null;

    const scaleX = imageInfo.displayWidth / imageInfo.naturalWidth;
    const scaleY = imageInfo.displayHeight / imageInfo.naturalHeight;

    // 计算图片在容器中的偏移（居中显示）
    const containerWidth = imageRef.current?.parentElement?.clientWidth || 0;
    const containerHeight = imageRef.current?.parentElement?.clientHeight || 0;
    const offsetX = (containerWidth - imageInfo.displayWidth) / 2;
    const offsetY = (containerHeight - imageInfo.displayHeight) / 2;

    return {
      left: bbox.x * scaleX + offsetX,
      top: bbox.y * scaleY + offsetY,
      width: bbox.w * scaleX,
      height: bbox.h * scaleY,
    };
  };

  // 计算区域中心点位置
  const calculateCenterPoint = (bbox: any) => {
    const boundingBox = calculateBoundingBox(bbox);
    if (!boundingBox) return null;

    return {
      x: boundingBox.left + boundingBox.width / 2,
      y: boundingBox.top + boundingBox.height / 2,
    };
  };

  // 处理图片上传和分析
  const handleUploadAndAnalyze = async () => {
    if (!uploadedFile) {
      console.log("请先选择一张图片");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      const response = await fetch("/api/describe-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.data);
        console.log("图片分析结果:", JSON.stringify(result.data, null, 2));

        // 更新显示的图片为上传后的URL
        setSelectedImage(result.data.imageUrl);

        // 确保显示圆圈标记
        setShowInspirationCircles(true);
      } else {
        console.error("上传失败:", result.error);
      }
    } catch (error) {
      console.error("上传错误:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 开始写作模式
  const startWriting = () => {
    setIsWritingMode(true);
  };

  // 退出写作模式
  const exitWriting = () => {
    setIsWritingMode(false);
  };

  // 监听窗口大小变化，重新计算图片信息
  useEffect(() => {
    const handleResize = () => {
      handleImageLoad();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 当分析结果变化时，重新计算图片信息
  useEffect(() => {
    if (analysisResult?.enhancedObjects) {
      setTimeout(handleImageLoad, 100); // 稍微延迟确保图片已渲染
    }
  }, [analysisResult]);

  // 如果是写作模式，显示写作界面
  if (isWritingMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative">
        {/* 顶部图片展示区 - 固定高度，正常占据空间 */}
        <div
          className="p-4 absolute top-0 left-1/2 -translate-x-1/2 w-fit z-40"
          style={{ height: "280px" }}
        >
          <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="relative inline-block">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Practice image"
                  className="max-w-sm max-h-48 object-contain rounded-lg shadow-md"
                />

                {/* 在小图上也显示圆圈标记（缩小版） */}
                {analysisResult?.enhancedObjects &&
                  showInspirationCircles &&
                  analysisResult.enhancedObjects.map(
                    (obj: any, index: number) => {
                      // 简化的圆圈标记，不需要精确计算位置
                      return (
                        <HoverCard key={index}>
                          <HoverCardTrigger asChild>
                            <div
                              className="absolute w-4 h-4 rounded-full border bg-white/80 backdrop-blur-sm border-gray-400 cursor-pointer hover:scale-110 transition-transform"
                              style={{
                                left: `${20 + index * 15}%`,
                                top: `${20 + (index % 3) * 20}%`,
                              }}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="w-80 p-3 bg-white text-gray-800 border border-purple-200 shadow-xl"
                            sideOffset={10}
                          >
                            <div className="flex items-start space-x-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">💡</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-purple-800 mb-1">
                                  {obj.name}
                                </h4>
                                <div className="space-y-1">
                                  {obj.tips && obj.tips.length > 0 ? (
                                    obj.tips
                                      .slice(0, 2)
                                      .map((tip: string, tipIndex: number) => (
                                        <div
                                          key={tipIndex}
                                          className="text-xs leading-relaxed text-gray-700 p-1 bg-gray-50 rounded"
                                        >
                                          {tip}
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">
                                      暂无描写提示
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    }
                  )}
              </div>
            </div>

            {/* <Button
              onClick={() => setShowInspirationCircles(!showInspirationCircles)}
              variant="outline"
              size="sm"
              className="text-blue-700 hover:bg-blue-50"
            >
              {showInspirationCircles ? "隐藏提示" : "显示提示"}
            </Button> */}
          </div>
        </div>

        {/* 写作编辑器 - 占据剩余空间 */}
        <div className="flex-1 relative">
          <WritingEditor defaultChatMessages={[]} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">📷</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">照片描写练习</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              选择或上传一张照片
            </h2>
            <p className="text-gray-600">上传一张照片，开始你的描写练习</p>
          </div>

          {/* 照片展示区域 */}
          <div className="relative mb-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="relative bg-gray-50 flex items-center justify-center"
                  style={{ minHeight: "500px" }}
                >
                  <img
                    ref={imageRef}
                    src={selectedImage || "/placeholder.svg"}
                    alt="Practice image"
                    className="max-w-full max-h-[500px] object-contain"
                    onLoad={handleImageLoad}
                  />

                  {/* AI识别的圆圈标记和悬浮提示 */}
                  {analysisResult?.enhancedObjects &&
                    imageInfo &&
                    showInspirationCircles &&
                    analysisResult.enhancedObjects.map(
                      (obj: any, index: number) => {
                        const centerPoint = calculateCenterPoint(
                          obj.boundingBox
                        );
                        if (!centerPoint) return null;

                        return (
                          <HoverCard key={index}>
                            <HoverCardTrigger asChild>
                              <div
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{
                                  left: `${centerPoint.x}px`,
                                  top: `${centerPoint.y}px`,
                                }}
                              >
                                {/* 外圈：始终显示 */}
                                <div className="w-8 h-8 rounded-full border-2 bg-gray-100/70 backdrop-blur-sm transition-all duration-200 border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-lg hover:scale-110 hover:bg-gray-200/80" />

                                {/* 内圈：始终显示 */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border bg-white/80 backdrop-blur-sm transition-all duration-200 border-gray-400 hover:border-gray-500 hover:shadow-md hover:scale-110 hover:bg-white/90" />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="w-96 p-4 bg-white text-gray-800 border border-purple-200 shadow-xl max-h-96 overflow-y-auto"
                              sideOffset={15}
                              align="start"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-sm">💡</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-base text-purple-800">
                                      {obj.name}
                                    </h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      #{obj.id}
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {obj.tips && obj.tips.length > 0 ? (
                                      obj.tips.map(
                                        (tip: string, tipIndex: number) => (
                                          <div
                                            key={tipIndex}
                                            className="text-sm leading-relaxed text-gray-700 p-2 bg-gray-50 rounded"
                                          >
                                            <span className="text-xs text-purple-600 font-medium">
                                              #{tipIndex + 1}
                                            </span>
                                            <p className="mt-1">{tip}</p>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">
                                        暂无描写提示
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        );
                      }
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 操作按钮 */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={triggerFileSelect}
              className="bg-[#FE5933] hover:bg-[#E54A2B] text-white px-6 py-3"
            >
              <Camera className="w-4 h-4 mr-2" />
              选择照片
            </Button>
            <Button
              onClick={handleUploadAndAnalyze}
              disabled={!uploadedFile || isUploading}
              variant="outline"
              className="px-6 py-3 border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "分析中..." : "上传并分析"}
            </Button>
            {analysisResult?.enhancedObjects && (
              <>
                <Button
                  onClick={() =>
                    setShowInspirationCircles(!showInspirationCircles)
                  }
                  variant="outline"
                  className="px-6 py-3 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                >
                  {showInspirationCircles ? "隐藏圆圈" : "显示圆圈"}
                </Button>
                <Button
                  onClick={startWriting}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  开始写作
                </Button>
              </>
            )}
          </div>

          {/* 显示上传状态和结果提示 */}
          {uploadedFile && !isUploading && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                已选择: {uploadedFile.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
