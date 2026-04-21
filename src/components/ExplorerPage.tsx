import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { School } from '@/data/schools';
import { Place, PlaceCategory, PublicSubCategory } from '@/data/places';
import { MapContent, ContentCategory } from '@/data/content';
import AppHeader from '@/components/AppHeader';
import ConsonantFilter from '@/components/ConsonantFilter';
import SchoolSelector from '@/components/SchoolSelector';
import GradeSelector from '@/components/GradeSelector';
import KakaoMap from '@/components/KakaoMap';

import PlaceCard from '@/components/PlaceCard';
import ContentCard from '@/components/ContentCard';
import CategoryTabs from '@/components/CategoryTabs';
import AdminPanel from '@/components/AdminPanel';
import NoticePopup from '@/components/NoticePopup';
import QuizPopup from '@/components/QuizPopup';
import SourcesPopup from '@/components/SourcesPopup';
const GyeongnamExplorer = lazy(() => import('@/components/GyeongnamExplorer'));
import RouteExplorer from '@/components/RouteExplorer';
import PlaceNameOrigins from '@/components/PlaceNameOrigins';
import FavoriteCourse from '@/components/FavoriteCourse';
import PlaceSearchBar from '@/components/PlaceSearchBar';
import { useFavorites } from '@/hooks/useFavorites';
import { incrementVisitorCount, getMergedSchoolByName, SCHOOLS_UPDATED_EVENT, loadAllDataFromCloud } from '@/data/dataManager';
import { recordVisit } from '@/data/visitorStats';
import { Home, Users, Map, Route, MapPin, Star } from 'lucide-react';

type Step = 'consonant' | 'school' | 'grade' | 'explore';

const ExplorerPage = () => {
  const [step, setStep] = useState<Step>('consonant');
  const [selectedConsonant, setSelectedConsonant] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<3 | 4 | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedContent, setSelectedContent] = useState<MapContent | null>(null);
  const [activeCategories, setActiveCategories] = useState<ContentCategory[]>([]);
  const [activePlaceCategories, setActivePlaceCategories] = useState<PlaceCategory[]>([]);
  const [activePublicSubCategories, setActivePublicSubCategories] = useState<PublicSubCategory[] | null>([]);
  
  const [zoomIn, setZoomIn] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showGyeongnam, setShowGyeongnam] = useState(false);
  const [showRouteExplorer, setShowRouteExplorer] = useState(false);
  const [showPlaceNameOrigins, setShowPlaceNameOrigins] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [grade4VisibleIds, setGrade4VisibleIds] = useState<Set<string> | null>(null);
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number; key: string } | null>(null);

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
    // For grade 4, reveal the place on map when selected from filter
    setGrade4VisibleIds(prev => {
      if (prev === null || prev.has(place.id)) return prev;
      const next = new Set(prev ?? []);
      next.add(place.id);
      return next;
    });
  }, []);

  const handleContentSelect = useCallback((content: MapContent) => {
    setSelectedContent(content);
    setSelectedPlace(null);
  }, []);

  const handleCategoryToggle = (cat: ContentCategory) => {
    setActiveCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const handlePlaceCategoryToggle = (cat: PlaceCategory) => {
    setActivePlaceCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const handlePublicSubCategoryToggle = (sub: PublicSubCategory) => {
    setActivePublicSubCategories(prev => {
      const current = prev ?? [];
      if (current.includes(sub)) {
        return current.filter(s => s !== sub);
      }
      return [...current, sub];
    });
  };

  const handleReset = () => {
    setStep('consonant');
    setSelectedConsonant('');
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedPlace(null);
    setSelectedContent(null);
    setActiveCategories([]);
    setActivePlaceCategories([]);
    setActivePublicSubCategories([]);
    setZoomIn(false);
    setIsZooming(false);
    setGrade4VisibleIds(null);
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
      {showQuiz && <QuizPopup onClose={() => setShowQuiz(false)} grade={selectedGrade} />}
      {showSources && <SourcesPopup onClose={() => setShowSources(false)} />}
      {showGyeongnam && <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="text-white">로딩 중...</div></div>}><GyeongnamExplorer onClose={() => setShowGyeongnam(false)} /></Suspense>}
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
                  <CategoryTabs activeCategories={activeCategories} onCategoryToggle={handleCategoryToggle} activePlaceCategories={activePlaceCategories} onPlaceCategoryToggle={handlePlaceCategoryToggle} activePublicSubCategories={activePublicSubCategories} onPublicSubCategoryToggle={handlePublicSubCategoryToggle} />
                </div>
                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1 pr-1 md:pr-2">
                  {/* Search bar */}
                  {selectedGrade && (
                    <PlaceSearchBar
                      grade={selectedGrade}
                      onPlaceSelect={handlePlaceSelect}
                      onContentSelect={handleContentSelect}
                      onSchoolSelect={(s) => setFocusLocation({ lat: s.lat, lng: s.lng, key: `${s.name}-${Date.now()}` })}
                    />
                  )}
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
            {/* Desktop Sidebar: minimal — only home + grade badge */}
            {!isZooming && (
              <aside className="hidden md:flex w-44 lg:w-52 border-r bg-card flex-col overflow-hidden z-10 shadow-lg">
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
                <div className="flex-1 overflow-auto p-3 lg:p-4 text-xs text-muted-foreground leading-relaxed">
                  상단 검색창에서 장소나 콘텐츠를 빠르게 찾아보세요.
                </div>
              </aside>
            )}

            {/* Mobile bottom bar: home + grade badge only */}
            {!isZooming && (
              <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 flex flex-col">
                <div className="bg-card border-t px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1 sm:gap-2 safe-bottom">
                  <button className="back-btn text-xs" onClick={handleReset}>
                    <Home size={14} /> <span className="hidden xs:inline">처음으로</span><span className="xs:hidden">홈</span>
                  </button>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: selectedGrade === 3 ? 'hsl(var(--grade-3))' : 'hsl(var(--grade-4))', color: 'white' }}
                  >
                    {selectedGrade}학년
                  </span>
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
                  activePlaceCategories={activePlaceCategories}
                  activePublicSubCategories={activePublicSubCategories}
                  zoomIn={zoomIn}
                  onZoomComplete={handleZoomComplete}
                  isZooming={isZooming}
                  visiblePlaceIds={selectedGrade === 4 ? grade4VisibleIds : null}
                  focusLocation={focusLocation}
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
