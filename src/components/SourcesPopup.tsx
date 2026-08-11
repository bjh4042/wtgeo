import { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { sources } from '@/data/content';
import { useModalBehavior } from '@/hooks/useModalBehavior';

interface SourcesPopupProps {
  onClose: () => void;
}

const SourcesPopup = ({ onClose }: SourcesPopupProps) => {
  useModalBehavior(onClose);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="sources-title" className="bg-card rounded-2xl p-6 max-w-md mx-4 shadow-2xl w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 id="sources-title" className="text-lg font-bold text-foreground">🔗 관련 누리집</h3>
          <button ref={closeRef} onClick={onClose} aria-label="관련 누리집 창 닫기" className="text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              {s.name}
              <ExternalLink size={12} className="text-muted-foreground" />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          ※ 공공데이터포털 및 공식 웹페이지를 활용하여 수집한 자료입니다.
          데이터 수집 시점에 따라 실제 상황과 상이할 수 있으므로 사실 정보는 검색 엔진을 적극 활용하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

export default SourcesPopup;
