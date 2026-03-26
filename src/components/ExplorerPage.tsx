import { useState, useCallback } from 'react';
import { School } from '@/data/schools';
import { Place } from '@/data/places';
import AppHeader from '@/components/AppHeader';
import ConsonantFilter from '@/components/ConsonantFilter';
import SchoolSelector from '@/components/SchoolSelector';
import GradeSelector from '@/components/GradeSelector';
import KakaoMap from '@/components/KakaoMap';
import PlaceFilter from '@/components/PlaceFilter';
import PlaceCard from '@/components/PlaceCard';
import { ArrowLeft, Home } from 'lucide-react';

type Step = 'consonant' | 'school' | 'grade' | 'explore';

const ExplorerPage = () => {
  const [step, setStep] = useState<Step>('consonant');
  const [selectedConsonant, setSelectedConsonant] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<3 | 4 | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleConsonantSelect = (c: string) => {
    setSelectedConsonant(c);
    setStep('school');
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setStep('grade');
  };

  const handleGradeSelect = (grade: 3 | 4) => {
    setSelectedGrade(grade);
    setStep('explore');
  };

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleReset = () => {
    setStep('consonant');
    setSelectedConsonant('');
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedPlace(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader schoolName={step === 'explore' ? selectedSchool?.name : undefined} />

      {step !== 'explore' ? (
        <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className="w-full max-w-2xl">
            {step === 'consonant' && (
              <ConsonantFilter onSelect={handleConsonantSelect} />
            )}
            {step === 'school' && (
              <SchoolSelector
                consonant={selectedConsonant}
                onSelect={handleSchoolSelect}
                onBack={() => setStep('consonant')}
              />
            )}
            {step === 'grade' && selectedSchool && (
              <GradeSelector
                school={selectedSchool}
                onSelect={handleGradeSelect}
                onBack={() => setStep('school')}
              />
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <aside className="w-72 border-r bg-card flex flex-col overflow-hidden z-10 shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <button className="back-btn" onClick={handleReset}>
                <Home size={16} />
                처음으로
              </button>
              <span className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))',
                  color: 'white',
                }}
              >
                {selectedGrade}학년
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selectedGrade && (
                <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />
              )}
            </div>
          </aside>

          {/* Map */}
          <div className="flex-1 relative">
            {selectedSchool && selectedGrade && (
              <KakaoMap
                school={selectedSchool}
                grade={selectedGrade}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelect}
              />
            )}

            {/* Place card overlay */}
            {selectedPlace && (
              <div className="absolute bottom-4 left-4 z-20">
                <PlaceCard place={selectedPlace} onClose={() => setSelectedPlace(null)} />
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      {step !== 'explore' && (
        <footer className="text-center py-3 text-xs text-muted-foreground">
          Developed with ❤️ for 거제 탐험대
        </footer>
      )}
    </div>
  );
};

export default ExplorerPage;
