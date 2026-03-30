import { useState, useEffect, useRef } from 'react';
import { X, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion, getRandomQuestions } from '@/data/quiz';

interface QuizPopupProps {
  onClose: () => void;
}

type QuizState = 'intro' | 'playing' | 'result';

const QuizPopup = ({ onClose }: QuizPopupProps) => {
  const [state, setState] = useState<QuizState>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTime = 600; // 10분

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startQuiz = () => {
    const randomQs = getRandomQuestions(10);
    setQuestions(randomQs);
    setAnswers(Array(10).fill(null));
    setCurrentQ(0);
    setElapsed(0);
    setScore(0);
    setState('playing');
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev >= maxTime - 1) {
          finishQuizWithAnswers(randomQs);
          return maxTime;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const finishQuizWithAnswers = (qs?: QuizQuestion[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const qList = qs || questions;
    const s = answers.reduce((acc, a, i) => acc + (a === qList[i]?.answer ? 1 : 0), 0);
    setScore(s);
    setState('result');
  };

  const finishQuiz = () => {
    finishQuizWithAnswers();
  };

  const selectAnswer = (ansIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = ansIdx;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      }
    }, 300);
  };

  const getGrade = () => {
    // S: 9-10점 AND 1분 이내
    // A: 7-8점 AND 3분 이내 OR 9-10점 AND 3분 이내
    // B: 나머지
    if (score >= 9 && elapsed <= 60) return { grade: 'S', color: '#FFD700', emoji: '🏆', label: '최고예요! 거제 박사!' };
    if (score >= 7 && elapsed <= 180) return { grade: 'A', color: '#4CAF50', emoji: '🎖️', label: '잘했어요! 거제 전문가!' };
    return { grade: 'B', color: '#2196F3', emoji: '👍', label: '좋아요! 조금 더 공부해봐요!' };
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQ];
  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-2xl p-5 max-w-md mx-4 shadow-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        {state === 'intro' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">🎯 거제 탐험 퀴즈</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>거제시에 대해 얼마나 알고 있나요?</p>
              <p>📝 총 20문제 중 <strong className="text-foreground">랜덤 10문제</strong> 출제 (OX + 선다형)</p>
              <p>⏱️ 제한시간 <strong className="text-foreground">10분</strong></p>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <p className="font-semibold text-foreground">등급 기준 (점수 + 시간)</p>
                <p>🏆 <strong>S등급</strong>: 9문제 이상 정답 + 1분 이내</p>
                <p>🎖️ <strong>A등급</strong>: 7문제 이상 정답 + 3분 이내</p>
                <p>👍 <strong>B등급</strong>: 그 외</p>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              퀴즈 시작! 🚀
            </button>
          </>
        )}

        {state === 'playing' && q && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">{currentQ + 1}/{questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Clock size={14} />
                  {formatTime(elapsed)}
                </span>
                <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setState('intro'); }} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded bg-muted">종료</button>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-primary mb-4">
              <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>
            </div>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[currentQ] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className="w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer text-sm font-medium"
                    style={{
                      borderColor: selected ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      backgroundColor: selected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                      color: selected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    }}
                  >
                    {q.type === 'choice' ? `${i + 1}) ` : ''}{opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground cursor-pointer disabled:opacity-30"
              >
                ← 이전
              </button>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className="w-5 h-5 rounded-full text-[10px] font-bold cursor-pointer"
                    style={{
                      backgroundColor: answers[i] !== null ? 'hsl(var(--primary))' : i === currentQ ? 'hsl(var(--accent))' : 'hsl(var(--muted))',
                      color: answers[i] !== null ? 'white' : 'hsl(var(--foreground))',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground cursor-pointer"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={finishQuiz}
                  disabled={!allAnswered}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground cursor-pointer disabled:opacity-50"
                >
                  제출 ✓
                </button>
              )}
            </div>
          </>
        )}

        {state === 'result' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">📊 결과 리포트</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
            </div>

            <div className="text-center mb-4">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-black mb-2"
                style={{ backgroundColor: getGrade().color + '20', color: getGrade().color }}
              >
                {getGrade().grade}
              </div>
              <p className="text-sm text-muted-foreground">{getGrade().emoji} {getGrade().label}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{score}/{questions.length}</p>
                <p className="text-xs text-muted-foreground">정답</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{formatTime(elapsed)}</p>
                <p className="text-xs text-muted-foreground">소요시간</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold" style={{ color: getGrade().color }}>{getGrade().grade}</p>
                <p className="text-xs text-muted-foreground">등급</p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-auto">
              {questions.map((q, i) => {
                const correct = answers[i] === q.answer;
                return (
                  <div key={q.id} className={`p-2.5 rounded-lg border text-xs ${correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-1.5">
                      {correct ? <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium text-foreground">{q.question}</p>
                        {!correct && <p className="text-red-600 mt-0.5">정답: {q.options[q.answer]}</p>}
                        <p className="text-muted-foreground mt-0.5">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={startQuiz}
              className="mt-4 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              다시 도전! 🔄
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPopup;
