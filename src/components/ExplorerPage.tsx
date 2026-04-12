import { useState, useCallback, useEffect } from 'react';
import { School } from '@/data/schools';
import { Place, PlaceCategory } from '@/data/places';
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
import PlaceNameOrigins from '@/components/PlaceNameOrigins';
import FavoriteCourse from '@/components/FavoriteCourse';
import { useFavorites } from '@/hooks/useFavorites';
import { incrementVisitorCount, getMergedSchoolByName, SCHOOLS_UPDATED_EVENT, loadAllDataFromCloud } from '@/data/dataManager';
import { recordVisit } from '@/data/visitorStats';
import { Home, List, X, Users, Map, Route, MapPin, Star } from 'lucide-react';

type Step = 'consonant' | 'school' | 'grade' | 'explore';

const ExplorerPage = () => {
  const [step, setStep] = useState<Step>('consonant');
  const [selectedConsonant, setSelectedConsonant] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<3 | 4 | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedContent, setSelectedContent] = useState<MapContent | null>(null);
  const [activeCategories, setActiveCategories] = useState<ContentCategory[]>(['place']);
  const [activePlaceCategories, setActivePlaceCategories] = useState<PlaceCategory[]>(['tourism', 'nature', 'culture', 'public', 'experience', 'market']);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showGyeongnam, setShowGyeongnam] = useState(false);
  const [showRouteExplorer, setShowRouteExplorer] = useState(false);
  const [showPlaceNameOrigins, setShowPlaceNameOrigins] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, isFavorite, toggleFavorite, removeFavorite, clearAll, reorder, courseName, setCourseName } = useFavorites();

  useEffect(() => {
    loadAllDataFromCloud().then(() => {
      incrementVisitorCount().then(count => setVisitorCount(count));
    });
    recordVisit();
  }, []);

  useEffect(() => {
    if (!selectedSchool) return;
    const syncSelectedSchool = () => {
      const updatedSchool = getMergedSchoolByName(selectedSchool.name);
      if (updatedSchool) setSelectedSchool(updatedSchool);
    };
    window.addEventListener(SCHOOLS_UPDATED_EVENT, syncSelectedSchool);
    return () => window.removeEventListener(SCHOOLS_UPDATED_EVENT, syncSelectedSchool);
  }, [selectedSchool]);

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
    <div className="flex flex-col h-[100dvh] overflow-hidden">
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
      {showPlaceNameOrigins && <PlaceNameOrigins onClose={() => setShowPlaceNameOrigins(false)} />}
      {showFavorites && (
        <FavoriteCourse
          onClose={() => setShowFavorites(false)}
          onPlaceSelect={(p) => { handlePlaceSelect(p); setShowFavorites(false); }}
          onContentSelect={(c) => { handleContentSelect(c); setShowFavorites(false); }}
          favorites={favorites}
          removeFavorite={removeFavorite}
          clearAll={clearAll}
          reorder={reorder}
          courseName={courseName}
          setCourseName={setCourseName}
        />
      )}

      {step !== 'explore' ? (
        <main className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-auto">
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
          {/* Category tabs + action buttons: hidden during zoom */}
          {!isZooming && (
            <div className="bg-card border-b z-20 shadow-sm">
              <div className="flex items-center">
                <div className="flex-1 overflow-x-auto">
                  <CategoryTabs activeCategories={activeCategories} onCategoryToggle={handleCategoryToggle} />
                </div>
                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1 pr-1 md:pr-2">
                  {/* Favorites button */}
                  <button
                    onClick={() => setShowFavorites(true)}
                    className="relative flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold cursor-pointer bg-accent/20 text-accent-foreground hover:bg-accent/40 transition-colors"
                  >
                    <Star size={10} className="md:w-3 md:h-3 fill-accent text-accent" />
                    <span className="hidden sm:inline">코스</span>
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[8px] flex items-center justify-center font-bold">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRouteExplorer(true)}
                    className="flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    <Route size={10} className="md:w-3 md:h-3" />
                    <span className="hidden sm:inline">경로탐험</span>
                    <span className="sm:hidden">경로</span>
                  </button>
                  {selectedGrade === 3 && (
                    <button
                      onClick={() => setShowPlaceNameOrigins(true)}
                      className="flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold cursor-pointer bg-[hsl(142,50%,42%)] text-[hsl(0,0%,100%)] hover:opacity-90 transition-colors"
                    >
                      <MapPin size={10} className="md:w-3 md:h-3" />
                      <span className="hidden sm:inline">지명유래</span>
                      <span className="sm:hidden">지명</span>
                    </button>
                  )}
                  {selectedGrade === 4 && (
                    <button
                      onClick={() => setShowGyeongnam(true)}
                      className="flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Map size={10} className="md:w-3 md:h-3" />
                      <span className="hidden sm:inline">경남 시·군</span>
                      <span className="sm:hidden">경남</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden relative">
            {/* Desktop Sidebar: hidden during zoom */}
            {!isZooming && (
              <aside className="hidden md:flex w-72 lg:w-80 border-r bg-card flex-col overflow-hidden z-10 shadow-lg">
                <div className="p-3 lg:p-4 border-b flex items-center justify-between">
                  <button className="back-btn" onClick={handleReset}>
                    <Home size={16} /> 처음으로
                  </button>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))', color: 'white' }}
                  >
                    {selectedGrade}학년
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-3 lg:p-4">
                  {selectedGrade && <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />}
                </div>
              </aside>
            )}

            {/* Mobile bottom bar: hidden during zoom */}
            {!isZooming && (
              <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 flex flex-col">
                {showMobileSidebar && (
                  <div className="bg-card border-t rounded-t-2xl shadow-2xl max-h-[50vh] overflow-auto p-3 animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">장소 목록</span>
                      <button onClick={() => setShowMobileSidebar(false)} className="text-muted-foreground cursor-pointer"><X size={18} /></button>
                    </div>
                    {selectedGrade && <PlaceFilter grade={selectedGrade} onPlaceSelect={handlePlaceSelect} />}
                  </div>
                )}
                <div className="bg-card border-t px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1 sm:gap-2 safe-bottom">
                  <button className="back-btn text-xs" onClick={handleReset}>
                    <Home size={14} /> <span className="hidden xs:inline">처음으로</span><span className="xs:hidden">홈</span>
                  </button>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))', color: 'white' }}
                  >
                    {selectedGrade}학년
                  </span>
                  <button className="flex items-center gap-1 text-xs font-medium cursor-pointer text-primary" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                    <List size={16} /> 장소
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
                <div className="absolute bottom-14 md:bottom-4 left-1 right-1 sm:left-2 sm:right-2 md:left-4 md:right-auto md:max-w-sm z-20">
                  <PlaceCard
                    place={selectedPlace}
                    school={selectedSchool}
                    onClose={() => setSelectedPlace(null)}
                    isFavorite={isFavorite(selectedPlace.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              )}

              {!isZooming && selectedContent && (
                <div className="absolute bottom-14 md:bottom-4 left-1 right-1 sm:left-2 sm:right-2 md:left-4 md:right-auto md:max-w-sm z-20">
                  <ContentCard
                    content={selectedContent}
                    onClose={() => setSelectedContent(null)}
                    isFavorite={isFavorite(selectedContent.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      {step !== 'explore' && (
        <footer className="text-center py-2 md:py-3 text-[10px] md:text-xs text-muted-foreground space-y-0.5">
          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1"><Users size={11} /> 방문자 {visitorCount.toLocaleString()}명</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>© 2025 수박쌤. 원작: 인디스쿨 니카쌤.</span>
            <span className="text-muted-foreground/30">|</span>
            <AdminPanel />
          </div>
        </footer>
      )}
    </div>
  );
};

export default ExplorerPage;
