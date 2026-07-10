import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askChatbot, SUGGESTED_QUESTIONS, type ChatTurn } from "@/lib/chatbotService";
import { checkForbiddenWords, FORBIDDEN_WORD_MESSAGE } from "@/data/forbiddenWords";
import { findSchoolInfo } from "@/data/schoolQA";
import {
  findGeojePopulation,
  findGyeongnamPopulation,
  hasPopulationIntent,
  getGeojeRegionNames,
  getGyeongnamRegionNames,
} from "@/data/populationQA";

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
    if (checkForbiddenWords(q)) {
      setMessages([
        ...messages,
        { role: "user", content: q },
        { role: "assistant", content: FORBIDDEN_WORD_MESSAGE },
      ]);
      setInput("");
      return;
    }
    const next: UITurn[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");

    // 학교 정보 직답: 학교명 또는 '<동/면> + 초등학교' 매칭 시 AI 호출 없이 즉시 응답
    const hit = findSchoolInfo(q);
    if (hit) {
      const answer =
        `**${hit.school_name}** (${hit.category})\n\n` +
        `${hit.answer}\n\n` +
        `- 개교: ${hit.established_year}\n` +
        `- 규모: ${hit.num_classes} · ${hit.num_students}\n` +
        `- 주소: ${hit.address}\n` +
        `- 전화: ${hit.phone}\n` +
        `- 홈페이지: ${hit.website}`;
      setMessages([
        ...next,
        {
          role: "assistant",
          content: answer,
          followups: [
            `${hit.school_name}은 언제 개교했어?`,
            `${hit.category}에 있는 다른 초등학교 알려줘`,
            `${hit.school_name} 근처 가볼만한 곳 있어?`,
          ],
        },
      ]);
      return;
    }

    // 인구 직답: "인구/몇 명/사람" + 지역명 매칭 시 즉시 응답
    const gnPop = grade === 4 ? findGyeongnamPopulation(q) : null;
    if (gnPop) {
      const answer =
        `📊 **${gnPop.region}**(${gnPop.type})의 인구는 **${gnPop.population}**이야!\n\n` +
        `- 기준일: ${gnPop.base_date}\n- 시·군청 주소: ${gnPop.office_address}\n\n${gnPop.description}`;
      setMessages([
        ...next,
        {
          role: "assistant",
          content: answer,
          followups: [
            `${gnPop.region}의 대표 관광지는 뭐야?`,
            `${gnPop.region}의 특산물이 뭐야?`,
            `경상남도에서 인구가 가장 많은 도시는 어디야?`,
          ],
        },
      ]);
      return;
    }
    const geojePop = findGeojePopulation(q);
    if (geojePop) {
      const answer =
        `📊 **${geojePop.region}**의 인구는 **${geojePop.population}**이야!\n\n${geojePop.description}`;
      setMessages([
        ...next,
        {
          role: "assistant",
          content: answer,
          followups: [
            `${geojePop.region}에는 어떤 곳들이 있어?`,
            `${geojePop.region} 근처 가볼만한 곳 알려줘`,
            `거제시에서 인구가 가장 많은 동네는 어디야?`,
          ],
        },
      ]);
      return;
    }

    // 인구 의도는 있는데 지역이 특정되지 않았을 때 → 되묻기(fallback)
    if (hasPopulationIntent(q)) {
      if (grade === 4) {
        const names = getGyeongnamRegionNames();
        const sample = names.slice(0, 6).join(", ");
        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              `어느 지역의 인구가 궁금해? 🙂\n경상남도 **18개 시·군** 중 하나를 알려줘.\n예) ${sample} 등\n\n예시로 이렇게 물어봐 줘: "창원시 인구", "통영 몇 명 살아?"`,
            followups: [
              "창원시 인구 알려줘",
              "김해시 인구 몇 명이야?",
              "경상남도에서 인구가 가장 많은 도시는?",
            ],
          },
        ]);
        return;
      } else {
        const names = getGeojeRegionNames();
        const sample = names.slice(0, 6).join(", ");
        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              `거제시 어느 **동/면**의 인구가 궁금해? 🙂\n예) ${sample} 등\n\n예시: "고현동 인구", "일운면 몇 명 살아?"`,
            followups: [
              "고현동 인구 알려줘",
              "장승포동 인구는?",
              "거제시에서 인구가 가장 많은 동네는?",
            ],
          },
        ]);
        return;
      }
    }


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

          {/* 질문 가이드 (항상 노출) — 최근 질문과 관련된 예시 3개 */}
          {(() => {
            const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant") as UITurn | undefined;
            const guides =
              lastAssistant?.followups && lastAssistant.followups.length > 0
                ? lastAssistant.followups.slice(0, 3)
                : SUGGESTED_QUESTIONS[grade].slice(0, 3);
            return (
              <div className="border-t bg-muted/30 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                  💡 질문 가이드 {lastAssistant ? "· 방금 대화와 관련된 추천" : ""}
                </p>
                <div className="space-y-1">
                  {guides.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={loading}
                      className="w-full text-left px-2.5 py-1.5 rounded-md bg-background hover:bg-accent text-xs cursor-pointer transition-colors disabled:opacity-50 border"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

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
