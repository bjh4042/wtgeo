import { useEffect, useMemo, useState } from 'react';
import { School } from '@/data/schools';
import { filterMergedSchoolsByConsonant, SCHOOLS_UPDATED_EVENT } from '@/data/dataManager';
import { ArrowLeft } from 'lucide-react';

interface SchoolSelectorProps {
  consonant: string;
  onSelect: (school: School) => void;
  onBack: () => void;
}

const SchoolSelector = ({ consonant, onSelect, onBack }: SchoolSelectorProps) => {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleSchoolUpdate = () => setVersion((current) => current + 1);
    window.addEventListener(SCHOOLS_UPDATED_EVENT, handleSchoolUpdate);
    return () => window.removeEventListener(SCHOOLS_UPDATED_EVENT, handleSchoolUpdate);
  }, []);

  const schools = useMemo(() => filterMergedSchoolsByConsonant(consonant), [consonant, version]);

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
