import type { Metadata } from "next"

import { AssistantChat } from "@/features/assistant/components/assistant-chat"

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Describe a meal or craving and GrocerAI will suggest recipes and build your grocery list.",
}

export default function AssistantPage() {
  return <AssistantChat />
}