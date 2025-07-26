"use client";

import { notFound } from "next/navigation";
import { SCENES } from "../constant";
import WritingEditor from "@/components/modules/writing/writing";
import Image from "next/image";

interface ScenePracticePageProps {
  params: {
    id: string;
  };
}

export default function ScenePracticePage({ params }: ScenePracticePageProps) {
  const sceneId = parseInt(params.id);
  const scene = SCENES.find((s) => s.id === sceneId);

  if (!scene) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* 场景图片展示区域 - 使用absolute定位 */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-center">
        <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          {scene.images.map((image, index) => (
            <div
              key={index}
              className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <Image
                src={image}
                alt={`${scene.description} 场景图片 ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-200"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 场景标题 */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
          <h1 className="text-lg font-bold text-gray-800">
            {scene.description}场景练习
          </h1>
        </div>
      </div>

      {/* 写作编辑器 */}
      <div className="relative z-10">
        <WritingEditor defaultChatMessages={[]} />
      </div>
    </div>
  );
}
