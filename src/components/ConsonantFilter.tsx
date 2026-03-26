import { getAvailableConsonants } from '@/data/schools';

interface ConsonantFilterProps {
  onSelect: (consonant: string) => void;
}

const ConsonantFilter = ({ onSelect }: ConsonantFilterProps) => {
  const consonants = getAvailableConsonants();

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
        우리 고장에 대해 알아보아요
      </h1>
      <p className="text-lg text-muted-foreground font-medium">
        우리 학교 이름의 첫 글자는?
      </p>
      <div className="flex flex-wrap justify-center gap-4 max-w-lg">
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
    </div>
  );
};

export default ConsonantFilter;
