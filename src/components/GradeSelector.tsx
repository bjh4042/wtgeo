import { School } from '@/data/schools';
import { ArrowLeft } from 'lucide-react';

interface GradeSelectorProps {
  school: School;
  onSelect: (grade: 3 | 4) => void;
  onBack: () => void;
}

const GradeSelector = ({ school, onSelect, onBack }: GradeSelectorProps) => {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <button className="back-btn self-start" onClick={onBack}>
        <ArrowLeft size={18} />
        돌아가기
      </button>
      <h2 className="text-2xl font-bold text-foreground">
        학년을 선택해주세요
      </h2>
      <p className="text-muted-foreground font-medium">
        {school.name}
      </p>
      <div className="flex gap-4">
        <button className="grade-btn grade-btn-3" onClick={() => onSelect(3)}>
          🐣 3학년
          <br />
          <span className="text-sm font-normal opacity-90">(우리 고장)</span>
        </button>
        <button className="grade-btn grade-btn-4" onClick={() => onSelect(4)}>
          🦅 4학년
          <br />
          <span className="text-sm font-normal opacity-90">(거제 전체)</span>
        </button>
      </div>
    </div>
  );
};

export default GradeSelector;
