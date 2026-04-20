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
          className="relative w-16 h-16 md:w-24 md:h-24 bg-card/85 backdrop-blur-sm shadow-lg animate-fade-in"
          style={{ transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          aria-label="방위표"
        >
          {/* 4-point star (compass rose) using two rotated diamonds */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {/* Diagonal (NE/SE/SW/NW) - lighter */}
            <polygon
              points="50,15 58,50 50,85 42,50"
              transform="rotate(45 50 50)"
              fill="hsl(var(--muted-foreground) / 0.35)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* East/West axis */}
            <polygon
              points="50,42 90,50 50,58 10,50"
              fill="hsl(var(--foreground) / 0.7)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* North/South axis - North half red */}
            <polygon
              points="50,10 58,50 50,50 42,50"
              fill="hsl(var(--destructive))"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            <polygon
              points="50,50 58,50 50,90 42,50"
              fill="hsl(var(--foreground) / 0.7)"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="2.5" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
          </svg>

          {/* 한글 방위 라벨 */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] md:text-sm font-black text-destructive leading-none drop-shadow-sm">
            북
          </span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow-sm">
            남
          </span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow-sm">
            서
          </span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[10px] md:text-sm font-black text-foreground leading-none drop-shadow-sm">
            동
          </span>
        </div>
      )}
    </div>
  );
};

export default Compass;
