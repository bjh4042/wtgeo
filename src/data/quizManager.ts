import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from './quiz';

export interface QuizRow {
  id: string;
  grade: '3' | '4';
  question: string;
  type: 'ox' | 'choice';
  options: string[];
  answer: number;
  explanation: string;
  sort_order: number;
}

export const QUIZ_UPDATED_EVENT = 'quiz-updated';

let cache: QuizRow[] = [];
let loaded = false;

export async function loadQuizQuestions(force = false): Promise<QuizRow[]> {
  if (loaded && !force) return cache;
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .order('grade', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Failed to load quiz questions', error);
    return cache;
  }
  cache = (data || []).map(r => ({
    id: r.id,
    grade: r.grade as '3' | '4',
    question: r.question,
    type: r.type as 'ox' | 'choice',
    options: Array.isArray(r.options) ? r.options as string[] : [],
    answer: r.answer,
    explanation: r.explanation,
    sort_order: r.sort_order,
  }));
  loaded = true;
  return cache;
}

export function getCachedQuestions(): QuizRow[] {
  return cache;
}

export function getQuestionsByGrade(grade: '3' | '4'): QuizQuestion[] {
  return cache
    .filter(r => r.grade === grade)
    .map((r, i) => ({
      id: i + 1,
      question: r.question,
      type: r.type,
      options: r.options,
      answer: r.answer,
      explanation: r.explanation,
    }));
}

export async function fetchRandomQuestionsByGrade(grade: '3' | '4', count: number = 10): Promise<QuizQuestion[]> {
  await loadQuizQuestions();
  const all = getQuestionsByGrade(grade);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function createQuizQuestion(payload: Omit<QuizRow, 'id'>): Promise<QuizRow | null> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert({
      grade: payload.grade,
      question: payload.question,
      type: payload.type,
      options: payload.options,
      answer: payload.answer,
      explanation: payload.explanation,
      sort_order: payload.sort_order,
    })
    .select()
    .single();
  if (error || !data) {
    console.error('createQuizQuestion failed', error);
    return null;
  }
  await loadQuizQuestions(true);
  window.dispatchEvent(new Event(QUIZ_UPDATED_EVENT));
  return data as unknown as QuizRow;
}

export async function updateQuizQuestion(id: string, patch: Partial<Omit<QuizRow, 'id'>>): Promise<boolean> {
  const { error } = await supabase.from('quiz_questions').update(patch).eq('id', id);
  if (error) {
    console.error('updateQuizQuestion failed', error);
    return false;
  }
  await loadQuizQuestions(true);
  window.dispatchEvent(new Event(QUIZ_UPDATED_EVENT));
  return true;
}

export async function deleteQuizQuestion(id: string): Promise<boolean> {
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
  if (error) {
    console.error('deleteQuizQuestion failed', error);
    return false;
  }
  await loadQuizQuestions(true);
  window.dispatchEvent(new Event(QUIZ_UPDATED_EVENT));
  return true;
}

export async function bulkInsertQuizQuestions(rows: Omit<QuizRow, 'id'>[]): Promise<number> {
  if (rows.length === 0) return 0;
  const { data, error } = await supabase.from('quiz_questions').insert(rows).select();
  if (error) {
    console.error('bulkInsert failed', error);
    return 0;
  }
  await loadQuizQuestions(true);
  window.dispatchEvent(new Event(QUIZ_UPDATED_EVENT));
  return data?.length || 0;
}

export async function deleteAllByGrade(grade: '3' | '4'): Promise<boolean> {
  const { error } = await supabase.from('quiz_questions').delete().eq('grade', grade);
  if (error) return false;
  await loadQuizQuestions(true);
  window.dispatchEvent(new Event(QUIZ_UPDATED_EVENT));
  return true;
}
