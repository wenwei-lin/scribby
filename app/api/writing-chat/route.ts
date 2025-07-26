import { AzureOpenAI } from "@/lib/model";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { messages, currentWriting } = await req.json();

    // 构建系统提示词，包含当前写作内容
    const systemPrompt = `你是一个专业的写作助手，专门帮助用户改进他们的写作。用户当前的写作内容是：

${currentWriting || "用户还没有开始写作"}

请基于用户的写作内容提供有针对性的建议和帮助。你可以：
1. 分析写作结构和逻辑
2. 提供改进建议
3. 回答关于写作的问题
4. 帮助扩展和深化内容
5. 提供写作技巧和灵感

请用友好、鼓励的语气回复，并确保建议具体且实用。如果用户还没有开始写作，请鼓励他们开始创作。`;

    // 过滤掉系统消息，只保留用户和助手的对话
    const conversationMessages = messages.filter(
      (msg: any) => msg.role !== "system"
    );

    // 使用Azure OpenAI进行对话
    const result = await streamText({
      model: AzureOpenAI("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Writing chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
