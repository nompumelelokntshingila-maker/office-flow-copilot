import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { mockChatReply } from "@/lib/mock-ai";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Ask work questions in a simple chat interface and get quick guidance on emails, meetings and priorities.",
      },
      { property: "og:title", content: "AI Chatbot | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "A workplace chat assistant for emails, meetings and task priorities.",
      },
    ],
  }),
  component: ChatbotPage,
});

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "submitted">("ready");

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status === "submitted") return;
    const id = `${Date.now()}`;
    setMessages((prev) => [...prev, { id: `u-${id}`, role: "user", text: trimmed }]);
    setStatus("submitted");
    try {
      const reply = await mockChatReply(trimmed);
      setMessages((prev) => [...prev, { id: `a-${id}`, role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${id}`,
          role: "assistant",
          text: "Sorry — I couldn't respond just now. Please try again.",
        },
      ]);
    } finally {
      setStatus("ready");
    }
  };

  return (
    <AppShell
      title="AI Chatbot"
      description="Ask a quick work question — drafting help, meeting follow-ups or how to prioritise your day."
    >
      <div className="card-surface flex h-[clamp(28rem,70vh,44rem)] flex-col overflow-hidden">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-5" aria-hidden="true" />}
                title="Start a conversation"
                description="Try “Help me follow up on an unanswered email” or “How should I plan my week?”"
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
            {status === "submitted" ? (
              <Message from="assistant">
                <MessageContent>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </MessageContent>
              </Message>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-3 sm:p-4">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              void send(message.text ?? "");
              event.currentTarget.reset();
            }}
          >
            <PromptInputTextarea placeholder="Ask about emails, meetings or priorities..." />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-xs text-muted-foreground">
            Responses are placeholder examples for UI review — not real AI output.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
