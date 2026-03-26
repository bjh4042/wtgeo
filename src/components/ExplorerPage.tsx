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
import { Home, List, X } from 'lucide-react';

type Step = 'consonant' | 'school' | 'grade' | 'explore';

const ExplorerPage = () => {
  const [step, setStep] = useState<Step>('consonant');
  const [selectedConsonant, setSelectedConsonant] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<3 | 4 | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
    setShowMobileSidebar(false);
  }, []);

  const handleReset = () => {
    setStep('consonant');
    setSelectedConsonant('');
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedPlace(null);
    setShowMobileSidebar(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader schoolName={step === 'explore' ? selectedSchool?.name : undefined} />

      {step !== 'explore' ? (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto">
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
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-72 border-r bg-card flex-col overflow-hidden z-10 shadow-lg">
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

          {/* Mobile bottom bar */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 flex flex-col">
            {/* Mobile sidebar panel */}
            {showMobileSidebar && (
              <div className="bg-card border-t rounded-t-2xl shadow-2xl max-h-[60vh] overflow-auto p-4 animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">장소 목록</span>
                  <button onClick={() => setShowMobileSidebar(false)} className="text-muted-foreground cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
                {selectedGrade && (
                  <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />
                )}
              </div>
            )}

            {/* Mobile toolbar */}
            <div className="bg-card border-t px-4 py-2 flex items-center justify-between gap-2 safe-bottom">
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
              <button
                className="flex items-center gap-1 text-sm font-medium cursor-pointer text-primary"
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              >
                <List size={18} />
                장소
              </button>
            </div>
          </div>

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
              <div className="absolute bottom-16 md:bottom-4 left-2 right-2 md:left-4 md:right-auto z-20">
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
