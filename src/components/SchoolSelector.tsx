import { filterSchoolsByConsonant, School } from '@/data/schools';
import { ArrowLeft } from 'lucide-react';

interface SchoolSelectorProps {
  consonant: string;
  onSelect: (school: School) => void;
  onBack: () => void;
}

const SchoolSelector = ({ consonant, onSelect, onBack }: SchoolSelectorProps) => {
  const schools = filterSchoolsByConsonant(consonant);

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <button className="back-btn self-start" onClick={onBack}>
        <ArrowLeft size={18} />
        돌아가기
      </button>
      <h2 className="text-2xl font-bold text-foreground">
        학교를 선택해주세요
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg">
        {schools.map((school) => (
          <button
            key={school.name}
            className="school-btn text-sm md:text-base"
            onClick={() => onSelect(school)}
          >
            {school.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchoolSelector;
