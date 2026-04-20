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
          className="relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-card/85 backdrop-blur-sm border-2 border-primary/30 shadow-lg flex items-center justify-center animate-fade-in"
          style={{ transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          aria-label="방위표"
        >
          {/* Cross / arms */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="absolute w-[2px] h-full bg-foreground/20" />
            <div className="absolute h-[2px] w-full bg-foreground/20" />
          </div>

          {/* North arrow (red) */}
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '8px solid hsl(var(--destructive))',
              }}
            />
          </div>

          {/* Direction labels */}
          <span className="absolute top-0.5 md:top-1 left-1/2 -translate-x-1/2 translate-y-3 md:translate-y-4 text-[9px] md:text-xs font-black text-destructive leading-none">
            N
          </span>
          <span className="absolute bottom-0.5 md:bottom-1 left-1/2 -translate-x-1/2 -translate-y-1 text-[9px] md:text-xs font-bold text-foreground leading-none">
            S
          </span>
          <span className="absolute left-1 md:left-1.5 top-1/2 -translate-y-1/2 text-[9px] md:text-xs font-bold text-foreground leading-none">
            W
          </span>
          <span className="absolute right-1 md:right-1.5 top-1/2 -translate-y-1/2 text-[9px] md:text-xs font-bold text-foreground leading-none">
            E
          </span>
        </div>
      )}
    </div>
  );
};

export default Compass;
