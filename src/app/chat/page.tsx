import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata = {
  title: "AI Assistant | Talal Portfolio",
  description: "Streaming LLM conversation interface with focus management and abort signal controls.",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">AI Qualification Stream</h1>
        <p className="text-[#475569] mt-1 text-sm">
          Real-time token streaming with server-side API credential isolation, mid-stream abort control, and scroll anchoring.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}
