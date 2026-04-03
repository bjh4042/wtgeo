import { getAvailableConsonants } from '@/data/schools';
import { Monitor } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface ConsonantFilterProps {
  onSelect: (consonant: string) => void;
}

const ConsonantFilter = ({ onSelect }: ConsonantFilterProps) => {
  const consonants = getAvailableConsonants();

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 animate-fade-in px-2">
      <img src={logoImg} alt="거제 탐험대 로고" className="w-64 h-64 md:w-80 md:h-80 object-contain" />
      <h1 className="text-2xl md:text-4xl font-extrabold text-foreground text-center">
        우리 고장에 대해 알아보아요
      </h1>
      <p className="text-base md:text-lg text-muted-foreground font-medium text-center">
        우리 학교 이름의 첫 글자는?
      </p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-lg">
        {consonants.map((c) => (
          <button
            key={c}
            className="consonant-btn"
            onClick={() => onSelect(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-2">
        <Monitor size={14} />
        <span>가로모드(PC/태블릿)에서 최적화된 화면을 볼 수 있어요</span>
      </div>
    </div>
  );
};

export default ConsonantFilter;
