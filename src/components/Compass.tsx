import { useState } from 'react';
import { Compass as CompassIcon, Eye, EyeOff } from 'lucide-react';

const Compass = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="absolute top-12 right-2 md:top-14 md:right-2 z-20 flex flex-col items-end gap-1">
      <button
        onClick={() => setVisible((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm border shadow-md text-[10px] md:text-xs font-bold text-foreground hover:bg-card transition-colors cursor-pointer"
        title={visible ? '방위표 숨기기' : '방위표 표시하기'}
        aria-label={visible ? '방위표 숨기기' : '방위표 표시하기'}
      >
        {visible ? <EyeOff size={12} /> : <Eye size={12} />}
        <span className="hidden sm:inline">{visible ? '방위 숨기기' : '방위 보기'}</span>
        <CompassIcon size={12} className="text-primary" />
      </button>

      {visible && (
        <div
          className="relative w-20 h-20 md:w-28 md:h-28 animate-fade-in"
          style={{ transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          aria-label="4방위 방위표"
        >
          {/* 4방위 십자(+) 모양 화살표 */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="hsl(var(--card) / 0.9)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />

            {/* North (red, highlighted) - 위쪽 큰 화살표 */}
            <polygon
              points="50,8 58,50 50,46 42,50"
              fill="hsl(var(--destructive))"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* South - 아래쪽 화살표 */}
            <polygon
              points="50,92 58,50 50,54 42,50"
              fill="hsl(var(--foreground) / 0.85)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* East - 오른쪽 화살표 */}
            <polygon
              points="92,50 50,42 54,50 50,58"
              fill="hsl(var(--foreground) / 0.85)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* West - 왼쪽 화살표 */}
            <polygon
              points="8,50 50,42 46,50 50,58"
              fill="hsl(var(--foreground) / 0.85)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />

            {/* Center pin */}
            <circle cx="50" cy="50" r="3.5" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
          </svg>

          {/* 한글 방위 라벨 - 4방위만 */}
          {/* 북 */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[11px] md:text-base font-black text-destructive leading-none drop-shadow">
            북
          </span>
          {/* 남 */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[11px] md:text-base font-black text-foreground leading-none drop-shadow">
            남
          </span>
          {/* 서 */}
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-[11px] md:text-base font-black text-foreground leading-none drop-shadow">
            서
          </span>
          {/* 동 */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-[11px] md:text-base font-black text-foreground leading-none drop-shadow">
            동
          </span>
        </div>
      )}
    </div>
  );
};

export default Compass;
