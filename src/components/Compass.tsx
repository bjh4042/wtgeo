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
          aria-label="8방위 방위표"
        >
          {/* Compass rose: 8-point star (N/S/E/W primary, NE/SE/SW/NW secondary) */}
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

            {/* Secondary points (NE, SE, SW, NW) — diagonal diamonds, lighter */}
            <g>
              {/* NE */}
              <polygon points="50,50 62,38 76,24 54,46" fill="hsl(var(--muted-foreground) / 0.55)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              <polygon points="50,50 62,38 76,24 46,46" fill="hsl(var(--muted-foreground) / 0.35)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              {/* SE */}
              <polygon points="50,50 62,62 76,76 54,54" fill="hsl(var(--muted-foreground) / 0.55)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              <polygon points="50,50 62,62 76,76 46,54" fill="hsl(var(--muted-foreground) / 0.35)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              {/* SW */}
              <polygon points="50,50 38,62 24,76 46,54" fill="hsl(var(--muted-foreground) / 0.55)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              <polygon points="50,50 38,62 24,76 54,54" fill="hsl(var(--muted-foreground) / 0.35)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              {/* NW */}
              <polygon points="50,50 38,38 24,24 46,46" fill="hsl(var(--muted-foreground) / 0.55)" stroke="hsl(var(--border))" strokeWidth="0.5" />
              <polygon points="50,50 38,38 24,24 54,46" fill="hsl(var(--muted-foreground) / 0.35)" stroke="hsl(var(--border))" strokeWidth="0.5" />
            </g>

            {/* Primary points (N/E/S/W) — long arrows */}
            {/* North (red, highlighted) */}
            <polygon points="50,8 56,50 50,50 44,50" fill="hsl(var(--destructive))" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <polygon points="50,8 56,50 50,50" fill="hsl(var(--destructive))" opacity="0.85" />
            {/* South */}
            <polygon points="50,92 56,50 50,50 44,50" fill="hsl(var(--foreground) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <polygon points="50,92 44,50 50,50" fill="hsl(var(--foreground) / 0.6)" />
            {/* East */}
            <polygon points="92,50 50,56 50,50 50,44" fill="hsl(var(--foreground) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <polygon points="92,50 50,44 50,50" fill="hsl(var(--foreground) / 0.6)" />
            {/* West */}
            <polygon points="8,50 50,56 50,50 50,44" fill="hsl(var(--foreground) / 0.85)" stroke="hsl(var(--border))" strokeWidth="0.5" />
            <polygon points="8,50 50,56 50,50" fill="hsl(var(--foreground) / 0.6)" />

            {/* Center pin */}
            <circle cx="50" cy="50" r="3" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
          </svg>

          {/* 한글 방위 라벨 - 8방위 */}
          {/* 북 */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] md:text-sm font-black text-destructive leading-none drop-shadow">
            북
          </span>
          {/* 남 */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow">
            남
          </span>
          {/* 서 */}
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow">
            서
          </span>
          {/* 동 */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow">
            동
          </span>
          {/* 북서 */}
          <span className="absolute top-0 left-0 text-[7px] md:text-[10px] font-bold text-muted-foreground leading-none drop-shadow">
            북서
          </span>
          {/* 북동 */}
          <span className="absolute top-0 right-0 text-[7px] md:text-[10px] font-bold text-muted-foreground leading-none drop-shadow">
            북동
          </span>
          {/* 남서 */}
          <span className="absolute bottom-0 left-0 text-[7px] md:text-[10px] font-bold text-muted-foreground leading-none drop-shadow">
            남서
          </span>
          {/* 남동 */}
          <span className="absolute bottom-0 right-0 text-[7px] md:text-[10px] font-bold text-muted-foreground leading-none drop-shadow">
            남동
          </span>
        </div>
      )}
    </div>
  );
};

export default Compass;
