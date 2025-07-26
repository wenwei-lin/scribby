"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot } from "lucide-react";
import { useChat } from "ai/react";

interface AIMascotProps {
  getCurrentWriting: () => string;
}

export default function AIMascot({ getCurrentWriting }: AIMascotProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 只在打开时才初始化 useChat，避免多余请求
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/writing-chat",
    initialMessages: [
      {
        id: "system",
        role: "system",
        content: `你是一个专业的写作助手，专门帮助用户改进他们的写作。用户当前的写作内容是：\n\n${getCurrentWriting()}\n\n请基于用户的写作内容提供有针对性的建议和帮助。你可以：\n1. 分析写作结构和逻辑\n2. 提供改进建议\n3. 回答关于写作的问题\n4. 帮助扩展和深化内容\n5. 提供写作技巧和灵感\n\n请用友好、鼓励的语气回复，并确保建议具体且实用。`,
      },
    ],
    body: {
      currentWriting: getCurrentWriting(),
    },
    onFinish: () => {
      setHasUnreadMessages(true);
    },
  });

  // 自动滚动到底部
  useEffect(() => {
    if (isChatOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      setHasUnreadMessages(false);
    }
  }, [messages, isChatOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 未读消息提示 */}
      {hasUnreadMessages && !isChatOpen && (
        <div className="absolute -top-2 -right-2">
          <Badge
            variant="destructive"
            className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
          >
            !
          </Badge>
        </div>
      )}
      {/* 吉祥物按钮 */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
        onClick={() => setIsChatOpen(true)}
      >
        <img
          src="/images/ai-icon.png"
          alt="AI Assistant"
          className="w-16 h-16 object-contain"
        />
      </div>
      {/* 提示文字 */}
      {!isChatOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          点击与我对话
        </div>
      )}
      {/* 对话对话框 */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-end justify-end p-6">
          <Card className="w-96 h-[600px] flex flex-col bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">写作助手</h3>
                  <p className="text-xs text-gray-500">
                    基于你的写作内容提供建议
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {/* 消息区域 */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.slice(1).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === "assistant" && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            {/* 输入区域 */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={onSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="输入你的问题..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
