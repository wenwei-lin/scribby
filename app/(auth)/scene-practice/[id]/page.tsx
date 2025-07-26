"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { SCENES } from "../constant";
import WritingEditor from "@/components/modules/writing/writing";
import Image from "next/image";

interface ScenePracticePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ScenePracticePage({ params }: ScenePracticePageProps) {
  const { id } = use(params);
  const sceneId = parseInt(id);
  const scene = SCENES.find((s) => s.id === sceneId);

  if (!scene) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* 场景图片展示区域 - 使用absolute定位 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-fit z-20">
        <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          {scene.images.map((image, index) => (
            <div
              key={index}
              className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <Image
                src={image}
                alt={`${scene.description} 场景图片 ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-200"
                sizes="96px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 写作编辑器 */}
      <div className="relative z-10">
        <WritingEditor defaultChatMessages={[]} backPath={`/scene-practice`} />
      </div>
    </div>
  );
}
