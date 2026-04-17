-- 퀴즈 문제 테이블
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grade TEXT NOT NULL CHECK (grade IN ('3', '4')),
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ox', 'choice')),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_questions_grade ON public.quiz_questions(grade, sort_order);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quiz_questions"
  ON public.quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Public insert quiz_questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update quiz_questions"
  ON public.quiz_questions FOR UPDATE
  USING (true);

CREATE POLICY "Public delete quiz_questions"
  ON public.quiz_questions FOR DELETE
  USING (true);

-- updated_at 자동 갱신 함수가 없으면 생성
CREATE OR REPLACE FUNCTION public.update_quiz_questions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quiz_questions_updated_at();