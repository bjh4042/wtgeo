import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Edit3, Trash2, Save, Download, Upload, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  QuizRow,
  loadQuizQuestions,
  getCachedQuestions,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  bulkInsertQuizQuestions,
  QUIZ_UPDATED_EVENT,
} from '@/data/quizManager';

interface EditDraft {
  id?: string;
  grade: '3' | '4';
  question: string;
  type: 'ox' | 'choice';
  options: string[];
  answer: number;
  explanation: string;
  sort_order: number;
}

const newDraft = (grade: '3' | '4', sortOrder: number): EditDraft => ({
  grade,
  question: '',
  type: 'ox',
  options: ['O', 'X'],
  answer: 0,
  explanation: '',
  sort_order: sortOrder,
});

const QuizAdminTab = () => {
  const [gradeTab, setGradeTab] = useState<'3' | '4'>('3');
  const [rows, setRows] = useState<QuizRow[]>(getCachedQuestions());
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadQuizQuestions(true).then(r => setRows(r));
    const onUpdate = () => setRows([...getCachedQuestions()]);
    window.addEventListener(QUIZ_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(QUIZ_UPDATED_EVENT, onUpdate);
  }, []);

  const filtered = useMemo(() => rows.filter(r => r.grade === gradeTab), [rows, gradeTab]);
  const nextSort = useMemo(() => (filtered.length === 0 ? 1 : Math.max(...filtered.map(r => r.sort_order)) + 1), [filtered]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.question.trim()) { alert('문제를 입력하세요'); return; }
    if (editing.options.some(o => !o.trim())) { alert('보기를 모두 채워주세요'); return; }
    if (editing.answer < 0 || editing.answer >= editing.options.length) { alert('정답 번호가 보기 범위를 벗어났어요'); return; }

    const ok = editing.id
      ? await updateQuizQuestion(editing.id, {
          grade: editing.grade, question: editing.question, type: editing.type,
          options: editing.options, answer: editing.answer, explanation: editing.explanation, sort_order: editing.sort_order,
        })
      : !!(await createQuizQuestion({
          grade: editing.grade, question: editing.question, type: editing.type,
          options: editing.options, answer: editing.answer, explanation: editing.explanation, sort_order: editing.sort_order,
        }));
    if (ok) setEditing(null);
    else alert('저장에 실패했습니다.');
  };

  const handleDelete = async (row: QuizRow) => {
    if (!confirm(`"${row.question.slice(0, 30)}..." 문제를 삭제하시겠습니까?`)) return;
    const ok = await deleteQuizQuestion(row.id);
    if (!ok) alert('삭제에 실패했습니다.');
  };

  const startEdit = (row: QuizRow) => {
    setEditing({
      id: row.id, grade: row.grade, question: row.question, type: row.type,
      options: [...row.options], answer: row.answer, explanation: row.explanation, sort_order: row.sort_order,
    });
  };

  const handleTypeChange = (type: 'ox' | 'choice') => {
    if (!editing) return;
    if (type === 'ox') {
      setEditing({ ...editing, type, options: ['O', 'X'], answer: Math.min(editing.answer, 1) });
    } else {
      const opts = editing.options.length >= 4 ? editing.options.slice(0, 4) : [...editing.options, ...Array(4 - editing.options.length).fill('')];
      setEditing({ ...editing, type, options: opts });
    }
  };

  const exportExcel = () => {
    const data = rows.map(r => ({
      학년: r.grade,
      유형: r.type,
      문제: r.question,
      보기1: r.options[0] || '',
      보기2: r.options[1] || '',
      보기3: r.options[2] || '',
      보기4: r.options[3] || '',
      정답번호: r.answer + 1,
      해설: r.explanation,
      순서: r.sort_order,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '퀴즈');
    XLSX.writeFile(wb, `퀴즈_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadResult(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
      const toInsert: Omit<QuizRow, 'id'>[] = [];
      for (const row of json) {
        const grade = String(row['학년'] ?? '').trim() as '3' | '4';
        const type = String(row['유형'] ?? 'ox').trim() as 'ox' | 'choice';
        const question = String(row['문제'] ?? '').trim();
        if (!grade || !question || (grade !== '3' && grade !== '4')) continue;
        const options = type === 'ox'
          ? ['O', 'X']
          : [row['보기1'], row['보기2'], row['보기3'], row['보기4']].map(v => String(v ?? '').trim()).filter(Boolean);
        if (options.length < 2) continue;
        const answerNum = Number(row['정답번호'] ?? 1);
        const answer = Math.max(0, Math.min(options.length - 1, answerNum - 1));
        toInsert.push({
          grade, question, type, options, answer,
          explanation: String(row['해설'] ?? '').trim(),
          sort_order: Number(row['순서'] ?? toInsert.length + 1),
        });
      }
      const inserted = await bulkInsertQuizQuestions(toInsert);
      setUploadResult(`✅ ${inserted}개 문제가 추가되었습니다.`);
    } catch (err) {
      console.error(err);
      setUploadResult('❌ 파일 처리 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const inputClass = 'w-full px-2.5 py-1.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  if (editing) {
    return (
      <div className="space-y-2.5">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-xs text-primary cursor-pointer">
          <ArrowLeft size={12} /> 목록으로
        </button>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold text-foreground">학년</label>
            <select value={editing.grade} onChange={e => setEditing({ ...editing, grade: e.target.value as '3' | '4' })} className={inputClass}>
              <option value="3">3학년 (거제)</option>
              <option value="4">4학년 (경남)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-foreground">유형</label>
            <select value={editing.type} onChange={e => handleTypeChange(e.target.value as 'ox' | 'choice')} className={inputClass}>
              <option value="ox">OX</option>
              <option value="choice">4지선다</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-foreground">문제</label>
          <textarea value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-foreground">보기 (정답을 선택하세요)</label>
          {editing.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="answer"
                checked={editing.answer === i}
                onChange={() => setEditing({ ...editing, answer: i })}
                className="cursor-pointer"
              />
              <input
                value={opt}
                onChange={e => {
                  const next = [...editing.options];
                  next[i] = e.target.value;
                  setEditing({ ...editing, options: next });
                }}
                className={inputClass}
                placeholder={`보기 ${i + 1}`}
                disabled={editing.type === 'ox'}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-[10px] font-semibold text-foreground">해설</label>
          <textarea value={editing.explanation} onChange={e => setEditing({ ...editing, explanation: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-foreground">출제 순서</label>
          <input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })} className={inputClass} />
        </div>

        <button onClick={handleSave} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
          <Save size={14} /> 저장
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Grade tabs */}
      <div className="flex gap-1.5">
        {(['3', '4'] as const).map(g => {
          const cnt = rows.filter(r => r.grade === g).length;
          return (
            <button
              key={g}
              onClick={() => setGradeTab(g)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${gradeTab === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {g === '3' ? '🐣 3학년 (거제)' : '🦅 4학년 (경남)'} ({cnt})
            </button>
          );
        })}
      </div>

      {/* Excel actions */}
      <div className="flex gap-1.5">
        <button onClick={exportExcel} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-muted text-foreground text-[11px] font-medium cursor-pointer hover:bg-muted/80">
          <Download size={12} /> 엑셀 내보내기
        </button>
        <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-accent text-accent-foreground text-[11px] font-medium cursor-pointer hover:bg-accent/80">
          <Upload size={12} /> 엑셀 일괄 등록
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={importExcel} />
        </label>
      </div>
      {uploading && <p className="text-[10px] text-muted-foreground">⏳ 업로드 중...</p>}
      {uploadResult && <p className="text-[10px] font-medium">{uploadResult}</p>}

      <details className="text-[10px]">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">📋 엑셀 열 형식 안내</summary>
        <div className="mt-1 p-2 rounded bg-muted/50 space-y-0.5 text-muted-foreground">
          <p className="font-semibold text-foreground">필수: 학년(3 또는 4), 유형(ox 또는 choice), 문제, 정답번호</p>
          <p>OX 유형: 보기1=O, 보기2=X (자동), 정답번호 1(O) 또는 2(X)</p>
          <p>4지선다: 보기1~보기4 입력, 정답번호 1~4</p>
          <p>선택: 해설, 순서</p>
          <p className="text-foreground mt-1">💡 먼저 내보내기로 형식을 확인하세요.</p>
        </div>
      </details>

      {/* Add new */}
      <button
        onClick={() => setEditing(newDraft(gradeTab, nextSort))}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5"
      >
        <Plus size={14} /> 새 문제 추가
      </button>

      {/* List */}
      <div className="max-h-[45vh] overflow-auto space-y-1">
        <p className="text-[10px] text-muted-foreground px-1">{filtered.length}개 문제</p>
        {filtered.map(r => (
          <div key={r.id} className="p-2 rounded-lg border bg-muted/10 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{r.sort_order}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{r.type}</span>
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{r.question}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">정답: {r.options[r.answer]}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => startEdit(r)} className="p-1.5 rounded bg-muted cursor-pointer"><Edit3 size={12} /></button>
              <button onClick={() => handleDelete(r)} className="p-1.5 rounded bg-destructive/10 text-destructive cursor-pointer hover:bg-destructive/20"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">문제가 없습니다. 추가해주세요.</p>}
      </div>
    </div>
  );
};

export default QuizAdminTab;
