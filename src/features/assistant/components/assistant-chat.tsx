"use client"

import { Bot, Loader2, RotateCcw, Send, Sparkles, User } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useRef, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { aiConfig } from "@/lib/ai"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "What can I make for dinner with eggs and rice?",
  "Plan a vegetarian pasta night for two",
  "I'm craving something spicy and quick",
  "Build a grocery list for banana pancakes",
]

function getTextContent(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
}

export function AssistantChat() {
  const { messages, sendMessage, status, error, clearError, stop, regenerate } =
    useChat({
      transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    })
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const busy = status === "submitted" || status === "streaming"

  const lastAssistantIndex = messages.reduce(
    (last, message, index) =>
      message.role === "assistant" ? index : last,
    -1,
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || busy) return

    setInput("")
    await sendMessage({ text: trimmed })
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-16rem)] max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Powered by GrocerAI
          </span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Describe your meal.{" "}
            <span className="text-gradient">We&apos;ll build your cart.</span>
          </h1>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tell GrocerAI what you&apos;re craving and get a recipe idea plus
            the groceries you&apos;ll need — with quantities and approximate
            prices.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-4">
          {messages.length === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage({ text: suggestion })}
                  disabled={busy}
                  className="group rounded-xl border border-border bg-card/60 p-4 text-left text-sm text-foreground/80 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
                >
                  <Sparkles
                    className="size-4 text-primary transition-transform duration-200 group-hover:scale-110"
                    aria-hidden
                  />
                  <span className="mt-2 block">{suggestion}</span>
                </button>
              ))}
            </div>
          ) : (
            <ul
              className="flex flex-col gap-4"
              aria-label="Chat messages"
              aria-live="polite"
            >
              {messages.map((message, index) => {
                const isUser = message.role === "user"
                const text = getTextContent(message.parts)
                return (
                  <li
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3",
                      isUser && "flex-row-reverse",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border",
                        isUser
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground",
                      )}
                      aria-hidden
                    >
                      {isUser ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </span>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "border-primary/20 bg-primary/10 text-foreground"
                          : "border-border bg-card/80 text-foreground",
                      )}
                    >
                      <p className="whitespace-pre-wrap text-pretty">{text}</p>
                      {message.role === "assistant" &&
                        status === "streaming" &&
                        index === lastAssistantIndex ? (
                        <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="size-3 animate-spin" aria-hidden />
                          Thinking…
                        </span>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {error ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    clearError()
                    void regenerate()
                  }}
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  Retry
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    clearError()
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-4 flex flex-col gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg shadow-black/5 backdrop-blur"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Describe what you're craving…"
            maxLength={aiConfig.maxMessageCharacters}
            rows={2}
            disabled={busy}
            className="min-h-12 resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0 focus-visible:border-transparent focus-visible:ring-transparent"
          />
          <div className="flex items-center justify-between gap-2 px-1 pb-1">
            <span className="text-xs text-muted-foreground">
              {busy
                ? "GrocerAI is thinking…"
                : "Enter to send, Shift+Enter for a new line"}
            </span>
            <div className="flex items-center gap-2">
              {busy ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void stop()}
                >
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Stop
                </Button>
              ) : null}
              <Button type="submit" size="sm" disabled={!input.trim() || busy}>
                <Send className="size-3.5" aria-hidden />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}