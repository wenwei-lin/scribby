"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PhotoPractice() {
  const [selectedImage, setSelectedImage] = useState(
    "/images/mountain-lake.png"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
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

  // 计算提示气泡的位置（避免超出屏幕）
  const calculateTooltipPosition = (
    boundingBox: any,
    containerWidth: number
  ) => {
    const tooltipWidth = 300; // 估计的提示框宽度
    const rightSpace = containerWidth - (boundingBox.left + boundingBox.width);

    if (rightSpace >= tooltipWidth + 20) {
      // 右侧有足够空间，显示在右侧
      return {
        left: `${boundingBox.left + boundingBox.width + 10}px`,
        top: `${boundingBox.top}px`,
        arrowClass: "left-0 transform -translate-x-2",
        arrowDirection: "border-r-purple-100",
      };
    } else {
      // 右侧空间不足，显示在左侧
      return {
        left: `${boundingBox.left - tooltipWidth - 10}px`,
        top: `${boundingBox.top}px`,
        arrowClass: "right-0 transform translate-x-2",
        arrowDirection: "border-l-purple-100",
      };
    }
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

  const writingPrompts = [
    {
      type: "视觉感受",
      content: "描述画面中的色彩，光线和视觉元素，营造出生动的视觉体验。",
      position: "top-1/4 left-1/4",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      type: "情感联想",
      content: "这幅画面会给你什么样的感受？",
      position: "top-1/3 right-1/4",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      type: "故事想象",
      content: "这幅画面背后可能发生的故事，展开你的想象，创作出生动的情节。",
      position: "bottom-1/3 left-1/3",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-red-50 flex items-center justify-center relative overflow-hidden p-4">
      {/* 背景橙色圆点装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#E54A2B] rounded-full opacity-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '12s'}}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-[#E54A2B] rounded-full opacity-15 animate-bounce" style={{animationDelay: '4s', animationDuration: '15s'}}></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-[#E54A2B] rounded-full opacity-10 animate-bounce" style={{animationDelay: '8s', animationDuration: '14s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#E54A2B] rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* 主体内容卡片 */}
      <div className="relative z-10 w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl border-2 border-orange-100 p-8">
        {/* 顶部导航 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
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
        <div>
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

                  {/* AI识别的边界框和提示 */}
                  {analysisResult?.enhancedObjects &&
                    imageInfo &&
                    showBoundingBoxes &&
                    analysisResult.enhancedObjects.map(
                      (obj: any, index: number) => {
                        const boundingBox = calculateBoundingBox(
                          obj.boundingBox
                        );
                        if (!boundingBox) return null;

                        const containerWidth =
                          imageRef.current?.parentElement?.clientWidth || 0;
                        const tooltipPos = calculateTooltipPosition(
                          boundingBox,
                          containerWidth
                        );

                        return (
                          <div key={index}>
                            {/* 边界框 */}
                            <div
                              className="absolute border-2 border-red-500 bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-all duration-200"
                              style={{
                                left: `${boundingBox.left}px`,
                                top: `${boundingBox.top}px`,
                                width: `${boundingBox.width}px`,
                                height: `${boundingBox.height}px`,
                              }}
                            >
                              {/* 标签 */}
                              <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                                {obj.name} #{obj.id} (
                                {Math.round(obj.confidence * 100)}%)
                              </div>
                            </div>

                            {/* 描写提示气泡 */}
                            <div
                              className="absolute z-10"
                              style={{
                                left: tooltipPos.left,
                                top: tooltipPos.top,
                              }}
                            >
                              <div className="bg-purple-100 text-purple-800 p-3 rounded-lg shadow-lg w-72 relative border border-purple-200">
                                <div className="flex items-start space-x-2">
                                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                    <span className="text-xs">💡</span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">
                                      {obj.name} 描写提示
                                    </h4>
                                    <p className="text-xs leading-relaxed">
                                      {obj.tip}
                                    </p>
                                  </div>
                                </div>
                                {/* 指向箭头 */}
                                <div
                                  className={`absolute top-4 ${tooltipPos.arrowClass}`}
                                >
                                  <div
                                    className={`w-0 h-0 border-t-4 border-b-4 border-transparent ${
                                      tooltipPos.arrowDirection.includes(
                                        "border-r"
                                      )
                                        ? "border-r-8"
                                        : "border-l-8"
                                    } ${tooltipPos.arrowDirection}`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}

                  {/* 原有的写作提示气泡（只在没有AI结果时显示） */}
                  {!analysisResult?.enhancedObjects &&
                    writingPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className={`absolute ${prompt.position} transform -translate-x-1/2 -translate-y-1/2`}
                      >
                        <div
                          className={`${prompt.bgColor} ${prompt.textColor} p-3 rounded-lg shadow-md max-w-xs relative`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs">📍</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">
                                {prompt.type}
                              </h4>
                              <p className="text-xs leading-relaxed">
                                {prompt.content}
                              </p>
                            </div>
                          </div>
                          {/* 心形图标 */}
                          {index === 1 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-500 text-xs">❤️</span>
                            </div>
                          )}
                          {/* 位置图标 */}
                          {index === 2 && (
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-500 text-xs">
                                📍
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
              <Button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                variant="outline"
                className="px-6 py-3 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                {showBoundingBoxes ? "隐藏标记" : "显示标记"}
              </Button>
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
