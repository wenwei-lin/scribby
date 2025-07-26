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
  const [showInspirationCircles, setShowInspirationCircles] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);
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
      setHoveredRegion(null);
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

  // 计算提示气泡的位置（基于圆圈中心点）
  const calculateTooltipPosition = (
    centerPoint: any,
    containerWidth: number
  ) => {
    const tooltipWidth = 300; // 估计的提示框宽度
    const rightSpace = containerWidth - centerPoint.x;

    if (rightSpace >= tooltipWidth + 40) {
      // 右侧有足够空间，显示在右侧
      return {
        left: `${centerPoint.x + 30}px`,
        top: `${centerPoint.y - 60}px`,
        arrowClass: "left-0 top-1/2 transform -translate-x-2 -translate-y-1/2",
        arrowDirection: "border-r-purple-100",
      };
    } else {
      // 右侧空间不足，显示在左侧
      return {
        left: `${centerPoint.x - tooltipWidth - 30}px`,
        top: `${centerPoint.y - 60}px`,
        arrowClass: "right-0 top-1/2 transform translate-x-2 -translate-y-1/2",
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

                        const containerWidth =
                          imageRef.current?.parentElement?.clientWidth || 0;
                        const tooltipPos = calculateTooltipPosition(
                          centerPoint,
                          containerWidth
                        );

                        return (
                          <div key={index}>
                            {/* 圆圈标记 */}
                            <div
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                              style={{
                                left: `${centerPoint.x}px`,
                                top: `${centerPoint.y}px`,
                              }}
                              onMouseEnter={() => setHoveredRegion(index)}
                              onMouseLeave={() => setHoveredRegion(null)}
                            >
                              {/* 外圈：始终显示 */}
                              <div
                                className={`w-8 h-8 rounded-full border-2 bg-gray-100/70 backdrop-blur-sm transition-all duration-200 ${
                                  hoveredRegion === index
                                    ? "border-gray-400 shadow-lg scale-110 bg-gray-200/80"
                                    : "border-gray-300 shadow-sm"
                                }`}
                              />

                              {/* 内圈：始终显示 */}
                              <div
                                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                                  hoveredRegion === index
                                    ? "border-gray-500 shadow-md scale-110 bg-white/90"
                                    : "border-gray-400"
                                }`}
                              />

                              {/* 悬浮时的外扩光晕 */}
                              <div
                                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300/50 bg-gray-200/20 backdrop-blur-sm transition-all duration-300 ${
                                  hoveredRegion === index
                                    ? "w-12 h-12 opacity-100"
                                    : "w-8 h-8 opacity-0"
                                }`}
                              />
                            </div>

                            {/* 描写提示气泡 - 只在悬浮时显示 */}
                            {hoveredRegion === index && (
                              <div
                                className="absolute z-20 animate-in fade-in duration-200"
                                style={{
                                  left: tooltipPos.left,
                                  top: tooltipPos.top,
                                }}
                              >
                                <div className="bg-white text-gray-800 p-4 rounded-lg shadow-xl w-80 relative border border-purple-200">
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
                                      <p className="text-sm leading-relaxed text-gray-700">
                                        {obj.tip}
                                      </p>
                                      <div className="mt-2 text-xs text-gray-500">
                                        置信度:{" "}
                                        {Math.round(obj.confidence * 100)}%
                                      </div>
                                    </div>
                                  </div>
                                  {/* 指向箭头 */}
                                  <div
                                    className={`absolute ${tooltipPos.arrowClass}`}
                                  >
                                    <div
                                      className={`w-0 h-0 border-t-4 border-b-4 border-transparent ${
                                        tooltipPos.arrowDirection.includes(
                                          "border-r"
                                        )
                                          ? "border-r-8"
                                          : "border-l-8"
                                      } ${tooltipPos.arrowDirection.replace(
                                        "purple-100",
                                        "white"
                                      )}`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
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
              <Button
                onClick={() =>
                  setShowInspirationCircles(!showInspirationCircles)
                }
                variant="outline"
                className="px-6 py-3 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                {showInspirationCircles ? "隐藏圆圈" : "显示圆圈"}
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
