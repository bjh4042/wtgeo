import { useState, useCallback, useEffect } from 'react';
import { School } from '@/data/schools';
import { Place } from '@/data/places';
import { MapContent, ContentCategory } from '@/data/content';
import AppHeader from '@/components/AppHeader';
import ConsonantFilter from '@/components/ConsonantFilter';
import SchoolSelector from '@/components/SchoolSelector';
import GradeSelector from '@/components/GradeSelector';
import KakaoMap from '@/components/KakaoMap';
import PlaceFilter from '@/components/PlaceFilter';
import PlaceCard from '@/components/PlaceCard';
import ContentCard from '@/components/ContentCard';
import CategoryTabs from '@/components/CategoryTabs';
import AdminPanel from '@/components/AdminPanel';
import NoticePopup from '@/components/NoticePopup';
import QuizPopup from '@/components/QuizPopup';
import SourcesPopup from '@/components/SourcesPopup';
import GyeongnamExplorer from '@/components/GyeongnamExplorer';
import RouteExplorer from '@/components/RouteExplorer';
import { incrementVisitorCount } from '@/components/AdminPanel';
import { recordVisit } from '@/data/visitorStats';
import { Home, List, X, Users, Map, Route } from 'lucide-react';

type Step = 'consonant' | 'school' | 'grade' | 'explore';

const ExplorerPage = () => {
  const [step, setStep] = useState<Step>('consonant');
  const [selectedConsonant, setSelectedConsonant] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<3 | 4 | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedContent, setSelectedContent] = useState<MapContent | null>(null);
  const [activeCategories, setActiveCategories] = useState<ContentCategory[]>(['place']);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showGyeongnam, setShowGyeongnam] = useState(false);
  const [showRouteExplorer, setShowRouteExplorer] = useState(false);

  useEffect(() => {
    const count = incrementVisitorCount();
    setVisitorCount(count);
    recordVisit();
  }, []);

  const handleConsonantSelect = (c: string) => { setSelectedConsonant(c); setStep('school'); };
  const handleSchoolSelect = (school: School) => { setSelectedSchool(school); setStep('grade'); };
  const handleGradeSelect = (grade: 3 | 4) => {
    setSelectedGrade(grade);
    setZoomIn(true);
    setIsZooming(true);
    setStep('explore');
  };

  const handleZoomComplete = useCallback(() => {
    setZoomIn(false);
    setIsZooming(false);
  }, []);

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place);
    setSelectedContent(null);
    setShowMobileSidebar(false);
  }, []);

  const handleContentSelect = useCallback((content: MapContent) => {
    setSelectedContent(content);
    setSelectedPlace(null);
    setShowMobileSidebar(false);
  }, []);

  const handleCategoryToggle = (cat: ContentCategory) => {
    setActiveCategories(prev => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const handleReset = () => {
    setStep('consonant');
    setSelectedConsonant('');
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedPlace(null);
    setSelectedContent(null);
    setActiveCategories(['place']);
    setShowMobileSidebar(false);
    setZoomIn(false);
    setIsZooming(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header: hidden during zoom */}
      {(!isZooming || step !== 'explore') && (
        <AppHeader
          schoolName={step === 'explore' ? selectedSchool?.name : undefined}
          onQuizOpen={step === 'explore' ? () => setShowQuiz(true) : undefined}
          onSourcesOpen={step === 'explore' ? () => setShowSources(true) : undefined}
        />
      )}

      <NoticePopup />
      {showQuiz && <QuizPopup onClose={() => setShowQuiz(false)} />}
      {showSources && <SourcesPopup onClose={() => setShowSources(false)} />}
      {showGyeongnam && <GyeongnamExplorer onClose={() => setShowGyeongnam(false)} />}
      {showRouteExplorer && selectedSchool && selectedGrade && (
        <RouteExplorer grade={selectedGrade} school={selectedSchool} onClose={() => setShowRouteExplorer(false)} onPlaceSelect={(p) => { handlePlaceSelect(p); setShowRouteExplorer(false); }} />
      )}

      {step !== 'explore' ? (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto">
          <div className="w-full max-w-2xl">
            {step === 'consonant' && <ConsonantFilter onSelect={handleConsonantSelect} />}
            {step === 'school' && (
              <SchoolSelector consonant={selectedConsonant} onSelect={handleSchoolSelect} onBack={() => setStep('consonant')} />
            )}
            {step === 'grade' && selectedSchool && (
              <GradeSelector school={selectedSchool} onSelect={handleGradeSelect} onBack={() => setStep('school')} />
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Category tabs: hidden during zoom */}
          {!isZooming && (
            <div className="bg-card border-b z-20 shadow-sm">
              <div className="flex items-center">
                <div className="flex-1 overflow-x-auto">
                  <CategoryTabs activeCategories={activeCategories} onCategoryToggle={handleCategoryToggle} />
                </div>
                {selectedGrade === 4 && (
                  <button
                    onClick={() => setShowGyeongnam(true)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 mr-2 rounded-full text-xs font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Map size={12} /> 경남 시·군
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden relative">
            {/* Desktop Sidebar: hidden during zoom */}
            {!isZooming && (
              <aside className="hidden md:flex w-72 border-r bg-card flex-col overflow-hidden z-10 shadow-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <button className="back-btn" onClick={handleReset}>
                    <Home size={16} /> 처음으로
                  </button>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))', color: 'white' }}
                  >
                    {selectedGrade}학년
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {selectedGrade && <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />}
                </div>
              </aside>
            )}

            {/* Mobile bottom bar: hidden during zoom */}
            {!isZooming && (
              <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 flex flex-col">
                {showMobileSidebar && (
                  <div className="bg-card border-t rounded-t-2xl shadow-2xl max-h-[60vh] overflow-auto p-4 animate-slide-up">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-foreground">장소 목록</span>
                      <button onClick={() => setShowMobileSidebar(false)} className="text-muted-foreground cursor-pointer"><X size={20} /></button>
                    </div>
                    {selectedGrade && <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />}
                  </div>
                )}
                <div className="bg-card border-t px-4 py-2 flex items-center justify-between gap-2 safe-bottom">
                  <button className="back-btn" onClick={handleReset}>
                    <Home size={16} /> 처음으로
                  </button>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))', color: 'white' }}
                  >
                    {selectedGrade}학년
                  </span>
                  <button className="flex items-center gap-1 text-sm font-medium cursor-pointer text-primary" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                    <List size={18} /> 장소
                  </button>
                </div>
              </div>
            )}

            {/* Map */}
            <div className="flex-1 relative">
              {selectedSchool && selectedGrade && (
                <KakaoMap
                  school={selectedSchool}
                  grade={selectedGrade}
                  selectedPlace={selectedPlace}
                  onPlaceSelect={handlePlaceSelect}
                  selectedContent={selectedContent}
                  onContentSelect={handleContentSelect}
                  activeCategories={activeCategories}
                  zoomIn={zoomIn}
                  onZoomComplete={handleZoomComplete}
                  isZooming={isZooming}
                />
              )}

              {!isZooming && selectedPlace && selectedSchool && (
                <div className="absolute bottom-16 md:bottom-4 left-2 right-2 md:left-4 md:right-auto z-20">
                  <PlaceCard place={selectedPlace} school={selectedSchool} onClose={() => setSelectedPlace(null)} />
                </div>
              )}

              {!isZooming && selectedContent && (
                <div className="absolute bottom-16 md:bottom-4 left-2 right-2 md:left-4 md:right-auto z-20">
                  <ContentCard content={selectedContent} onClose={() => setSelectedContent(null)} />
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      {step !== 'explore' && (
        <footer className="text-center py-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1"><Users size={12} /> 방문자 {visitorCount.toLocaleString()}명</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>© 2025 수박쌤. 원작: 인디스쿨 니카쌤. All rights reserved.</span>
            <span className="text-muted-foreground/30">|</span>
            <AdminPanel />
          </div>
        </footer>
      )}
    </div>
  );
};

export default ExplorerPage;
