import { useEffect, useRef, useState } from 'react';
import { X, MapPinPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { categoryLabels, PlaceCategory } from '@/data/places';
import { validateStudentText } from '@/lib/contentFilter';

interface PlaceRequestModalProps {
  onClose: () => void;
}

const RECENT_KEY = 'geoje-place-request-recent';
const DUP_WINDOW_MS = 1000 * 60 * 10; // 10분

function recentHash(name: string, address: string) {
  return `${name.replace(/\s+/g, '')}|${address.replace(/\s+/g, '')}`.toLowerCase();
}

function isRecentDuplicate(hash: string): boolean {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, number>;
    const ts = map[hash];
    return typeof ts === 'number' && Date.now() - ts < DUP_WINDOW_MS;
  } catch { return false; }
}

function rememberSubmission(hash: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const now = Date.now();
    for (const [k, v] of Object.entries(map)) if (now - v > DUP_WINDOW_MS) delete map[k];
    map[hash] = now;
    localStorage.setItem(RECENT_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

const PlaceRequestModal = ({ onClose }: PlaceRequestModalProps) => {
  useModalBehavior(onClose);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<PlaceCategory | ''>('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const inputClass = 'w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus-visible:ring-2 focus:ring-2 focus:ring-primary';

  const handleSubmit = async () => {
    if (busy) return;
    const next: Record<string, string> = {};

    const nameCheck = validateStudentText(name, { label: '장소 이름', min: 2, max: 60, required: true });
    if (!nameCheck.ok) next.name = nameCheck.message!;
    const addrCheck = validateStudentText(address, { label: '주소', min: 5, max: 150, required: true });
    if (!addrCheck.ok) next.address = addrCheck.message!;
    if (!category) next.category = '장소 종류를 선택해 주세요.';
    const phoneValue = phone.trim();
    if (phoneValue && !/^[0-9+\-()\s.]{1,30}$/.test(phoneValue)) {
      next.phone = '숫자와 - + ( ) 만 사용해 30자 이하로 입력해 주세요.';
    }
    const descCheck = validateStudentText(description, { label: '추가 설명', max: 300 });
    if (!descCheck.ok) next.description = descCheck.message!;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const hash = recentHash(nameCheck.value, addrCheck.value);
    if (isRecentDuplicate(hash)) {
      toast.info('방금 같은 장소를 신청했어요. 확인 후 반영할게요!');
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-place-request', {
        body: {
          name: nameCheck.value,
          address: addrCheck.value,
          category,
          phone: phoneValue,
          description: descCheck.value,
        },
      });
      const errMsg = (error as any)?.message || (data as any)?.error;
      if (errMsg) throw new Error(String(errMsg));
      rememberSubmission(hash);
      setDone(true);
      toast.success('신청했어요! 확인 후 지도에 추가할게요. 😊');
    } catch (e) {
      toast.error('신청하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-3">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-request-title"
        className="bg-card rounded-2xl p-4 sm:p-5 w-full max-w-md shadow-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 id="place-request-title" className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5">
            <MapPinPlus size={18} className="text-primary" /> 장소 추가 신청
          </h3>
          <button ref={closeRef} onClick={onClose} aria-label="장소 추가 신청 창 닫기"
            className="text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm font-bold text-foreground">신청했어요! 😊</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              선생님이 확인한 뒤 지도에 추가할게요.<br />바로 지도에 나타나지는 않아요.
            </p>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold cursor-pointer">닫기</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              지도에 없는 장소를 알려주세요. 확인 후 지도에 추가할 수 있어요.
              <br />신청한다고 바로 지도에 올라가지는 않아요.
            </p>

            <div className="space-y-2.5">
              <div>
                <label htmlFor="pr-name" className="text-xs font-bold text-foreground">장소 이름 <span className="text-destructive">*</span></label>
                <input id="pr-name" value={name} onChange={e => setName(e.target.value)} maxLength={60}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'pr-name-err' : undefined}
                  placeholder="예) 거제식물원" className={inputClass} />
                {errors.name && <p id="pr-name-err" className="text-[11px] text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="pr-address" className="text-xs font-bold text-foreground">주소 <span className="text-destructive">*</span></label>
                <input id="pr-address" value={address} onChange={e => setAddress(e.target.value)} maxLength={150}
                  aria-invalid={!!errors.address} aria-describedby={errors.address ? 'pr-address-err' : undefined}
                  placeholder="예) 경상남도 거제시 ..." className={inputClass} />
                {errors.address && <p id="pr-address-err" className="text-[11px] text-destructive mt-1">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="pr-category" className="text-xs font-bold text-foreground">장소 종류 <span className="text-destructive">*</span></label>
                <select id="pr-category" value={category} onChange={e => setCategory(e.target.value as PlaceCategory)}
                  aria-invalid={!!errors.category} aria-describedby={errors.category ? 'pr-category-err' : undefined}
                  className={inputClass}>
                  <option value="">선택</option>
                  {(Object.keys(categoryLabels) as PlaceCategory[]).map(c => (
                    <option key={c} value={c}>{categoryLabels[c]}</option>
                  ))}
                </select>
                {errors.category && <p id="pr-category-err" className="text-[11px] text-destructive mt-1">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="pr-phone" className="text-xs font-bold text-foreground">장소 전화번호 <span className="font-normal text-muted-foreground">(선택)</span></label>
                <input id="pr-phone" value={phone} onChange={e => setPhone(e.target.value)} maxLength={30} inputMode="tel"
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'pr-phone-err' : undefined}
                  placeholder="예) 055-000-0000" className={inputClass} />
                {errors.phone && <p id="pr-phone-err" className="text-[11px] text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="pr-desc" className="text-xs font-bold text-foreground">추가 설명 <span className="font-normal text-muted-foreground">(선택)</span></label>
                <textarea id="pr-desc" value={description} onChange={e => setDescription(e.target.value)} maxLength={300} rows={3}
                  aria-invalid={!!errors.description} aria-describedby={errors.description ? 'pr-desc-err' : undefined}
                  placeholder="예) 아이들이 체험하기 좋은 장소예요." className={`${inputClass} resize-none`} />
                {errors.description && <p id="pr-desc-err" className="text-[11px] text-destructive mt-1">{errors.description}</p>}
              </div>

              <p className="text-[11px] text-muted-foreground">※ 신청하는 사람의 이름이나 연락처는 받지 않아요.</p>

              <div className="flex gap-2 pt-1 pb-1">
                <button onClick={onClose} className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-foreground text-sm font-bold cursor-pointer">취소</button>
                <button onClick={handleSubmit} disabled={busy}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {busy && <Loader2 size={14} className="animate-spin" />}신청하기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceRequestModal;
