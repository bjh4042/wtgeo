// 챗봇 Q&A 데이터 — 별도 관리 파일. 이 파일을 편집해 챗봇 지식을 업데이트하세요.
export interface ChatbotQA { id: number; category: string; question: string; answer: string; }

export const chatbotQA: ChatbotQA[] = [
  // ==========================================
  // 1. 고현동 (1 ~ 30)
  // ==========================================
  { id: 500, category: "거제시", question: "챗봇아 고마워!", answer: "천만에! 우리 배준호 선생님과 함께 '거제 탐험대 웹앱'으로 우리 고장 거제를 더 멋지게 사랑하고 공부해 주렴! 또 궁금한 게 있으면 언제든 물어봐!" }
];