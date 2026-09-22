import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Brain } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ChatMessage } from "@/types";

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA d'optimisation PC. Posez-moi une question sur les performances de votre ordinateur.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [provider, setProvider] = useState<"openai" | "claude">("openai");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Non connecté");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            provider,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errData.error || `Erreur ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream indisponible");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              if (provider === "claude") {
                if (json.type === "content_block_delta" && json.delta?.text) {
                  accumulated += json.delta.text;
                }
              } else {
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) accumulated += delta;
              }
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            } catch {
              // partial JSON, skip
            }
          }
        }
      }

      if (!accumulated) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Désolé, je n'ai pas pu générer de réponse. L'assistant IA n'est peut-être pas configuré.",
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Assistant IA</h3>
            <p className="text-xs text-slate-500">Conseils d'optimisation PC</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setProvider("openai")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              provider === "openai" ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            ChatGPT
          </button>
          <button
            onClick={() => setProvider("claude")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              provider === "claude" ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Brain className="w-3 h-3" />
            Claude
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-slate-700" : "bg-gradient-to-br from-cyan-500 to-blue-600"
            }`}>
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5 text-white" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-cyan-500/10 text-cyan-50"
                : "bg-slate-800 text-slate-200"
            }`}>
              {msg.content || (streaming && i === messages.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question..."
            disabled={streaming}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={streaming || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
