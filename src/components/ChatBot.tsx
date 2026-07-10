import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askChatbot, SUGGESTED_QUESTIONS, type ChatTurn } from "@/lib/chatbotService";

interface ChatBotProps {
  grade: 3 | 4;
}

type UITurn = ChatTurn & { followups?: string[] };

const ChatBot = ({ grade }: ChatBotProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UITurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scope = grade === 3 ? "거제시" : "경상남도";

  useEffect(() => {
    // Reset when grade changes
    setMessages([]);
    setError(null);
  }, [grade]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, loading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setError(null);
    const next: UITurn[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { text: answer, followups } = await askChatbot(grade, next);
      setMessages([...next, { role: "assistant", content: answer || "답변을 생성하지 못했어요.", followups }]);
    } catch (e) {
      setError((e as Error).message || "챗봇 오류");
      setMessages(next); // keep user message
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-16 md:bottom-6 left-3 md:left-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition"
          title="탐험대 챗봇"
          aria-label="챗봇 열기"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed inset-0 md:inset-auto md:bottom-6 md:left-6 z-[60] md:w-[380px] md:h-[560px] bg-card md:rounded-2xl shadow-2xl border flex flex-col animate-scale-in"
          role="dialog"
          aria-label="탐험대 챗봇"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground md:rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <div>
                <div className="text-sm font-bold">탐험대 챗봇</div>
                <div className="text-[11px] opacity-80">{scope} 정보만 답해요 · {grade}학년</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center cursor-pointer"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  안녕! 나는 <b>{scope}</b>에 대해 알려주는 챗봇이야. 궁금한 걸 물어봐! 🧭
                </p>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground">💡 이런 걸 물어볼 수 있어요</p>
                  {SUGGESTED_QUESTIONS[grade].map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 text-xs cursor-pointer transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-sm bg-primary text-primary-foreground whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] px-3 py-2 rounded-2xl rounded-bl-sm bg-muted text-foreground break-words prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-muted text-muted-foreground flex items-center gap-2 text-xs">
                  <Loader2 size={14} className="animate-spin" /> 생각 중...
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-destructive px-2">⚠️ {error}</div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="border-t p-2 flex items-end gap-2 md:rounded-b-2xl">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={`${scope}에 대해 물어보세요...`}
              className="flex-1 resize-none px-3 py-2 rounded-xl border bg-background text-sm max-h-28 focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 cursor-pointer"
              aria-label="보내기"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
