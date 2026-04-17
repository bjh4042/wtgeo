import { useEffect, useRef, useState, useCallback } from 'react';
import { Place, PlaceCategory, PublicSubCategory, categoryColors, categoryIcons, publicSubCategoryColors } from '@/data/places';
import { MapContent, ContentCategory, contentCategoryColors, contentCategoryIcons } from '@/data/content';
import { getMergedPlacesByGrade, getMergedContentByCategory, getMergedSchools } from '@/data/dataManager';
import { School } from '@/data/schools';
import { MapPin, Plus, Minus, School as SchoolIcon } from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  school: School;
  grade: 3 | 4;
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  selectedContent: MapContent | null;
  onContentSelect: (content: MapContent) => void;
  activeCategories: ContentCategory[];
  activePlaceCategories?: PlaceCategory[];
  activePublicSubCategories?: PublicSubCategory[] | null;
  zoomIn?: boolean;
  onZoomComplete?: () => void;
  isZooming?: boolean;
  visiblePlaceIds?: Set<string> | null;
  focusLocation?: { lat: number; lng: number; key: string } | null;
}

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

const ZOOM_STAGES = [
  { level: 12, delay: 1800 },
  { level: 8, delay: 1800 },
  { level: 4, delay: 1800 },
  { level: 2, delay: 800 },
];

function getZoomMessage(stageIndex: number, district: string): string {
  switch (stageIndex) {
    case 0: return '대한민국';
    case 1: return '📍 경상남도 거제시';
    case 2: return `🏫 우리 학교는 ${district}에 있어요!`;
    default: return '';
  }
}

const KakaoMap = ({ school, grade, selectedPlace, onPlaceSelect, selectedContent, onContentSelect, activeCategories, activePlaceCategories, activePublicSubCategories, zoomIn, onZoomComplete, isZooming, visiblePlaceIds, focusLocation }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const scaleRef = useRef<HTMLDivElement>(null);
  const zoomTimeoutsRef = useRef<number[]>([]);
  const zoomRunIdRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomMessage, setZoomMessage] = useState<string | null>(null);

  const clearZoomTimeouts = useCallback(() => {
    zoomTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    zoomTimeoutsRef.current = [];
  }, []);

  const scheduleZoomTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      zoomTimeoutsRef.current = zoomTimeoutsRef.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);

    zoomTimeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => {
    if (window.kakao?.maps) { setIsLoaded(true); return; }
    if (!KAKAO_API_KEY) { setError('API_KEY_MISSING'); return; }
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => { window.kakao.maps.load(() => setIsLoaded(true)); };
    script.onerror = () => setError('Kakao Maps SDK 로딩 실패');
    document.head.appendChild(script);
  }, []);

  const updateScale = useCallback(() => {
    if (!mapInstance.current || !scaleRef.current) return;
    const level = mapInstance.current.getLevel();
    const scaleMap: Record<number, string> = {
      1: '20m', 2: '30m', 3: '50m', 4: '100m', 5: '250m',
      6: '500m', 7: '1km', 8: '2km', 9: '4km', 10: '8km',
      11: '16km', 12: '32km', 13: '64km', 14: '128km',
    };
    scaleRef.current.textContent = `축척: ${scaleMap[level] || `레벨 ${level}`}`;
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!mapInstance.current) return;
    const level = mapInstance.current.getLevel();
    if (level > 1) mapInstance.current.setLevel(level - 1, { animate: true });
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mapInstance.current) return;
    const level = mapInstance.current.getLevel();
    if (level < 14) mapInstance.current.setLevel(level + 1, { animate: true });
  }, []);

  const handleGoToSchool = useCallback(() => {
    if (!mapInstance.current) return;
    const center = new window.kakao.maps.LatLng(school.lat, school.lng);
    mapInstance.current.panTo(center);
  }, [school]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    clearZoomTimeouts();
    const runId = zoomRunIdRef.current + 1;
    zoomRunIdRef.current = runId;

    const center = new window.kakao.maps.LatLng(school.lat, school.lng);
    const startLevel = zoomIn ? ZOOM_STAGES[0].level : 3;

    mapInstance.current = new window.kakao.maps.Map(mapRef.current, { center, level: startLevel });
    const currentMap = mapInstance.current;

    const schoolMarker = new window.kakao.maps.Marker({ position: center, map: currentMap });
    const schoolInfo = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;white-space:nowrap;">🏫 ${school.name}</div>`,
    });
    schoolInfo.open(currentMap, schoolMarker);

    const isStaleRun = () => zoomRunIdRef.current !== runId || mapInstance.current !== currentMap;

    const finishZoomSequence = () => {
      if (isStaleRun()) return;
      setZoomMessage(null);
      const pos = new window.kakao.maps.LatLng(school.lat, school.lng);
      currentMap.setCenter(pos);
      onZoomComplete?.();
    };

    const waitForMapIdle = (callback: () => void) => {
      if (isStaleRun()) return;

      let settled = false;
      let fallbackId: number | null = null;

      const handleIdle = () => finalize();

      const finalize = () => {
        if (settled) return;
        settled = true;

        window.kakao.maps.event.removeListener(currentMap, 'idle', handleIdle);

        if (fallbackId !== null) {
          window.clearTimeout(fallbackId);
          zoomTimeoutsRef.current = zoomTimeoutsRef.current.filter((id) => id !== fallbackId);
        }

        if (isStaleRun()) return;
        callback();
      };

      fallbackId = scheduleZoomTimeout(finalize, 1500);
      window.kakao.maps.event.addListener(currentMap, 'idle', handleIdle);
    };

    const smoothZoom = (targetLevel: number, onDone: () => void) => {
      if (isStaleRun()) return;

      const currentLevel = currentMap.getLevel();
      if (currentLevel === targetLevel) {
        onDone();
        return;
      }

      const delta = currentLevel > targetLevel ? -1 : 1;
      currentMap.setLevel(currentLevel + delta, { animate: true });
      waitForMapIdle(() => smoothZoom(targetLevel, onDone));
    };

    window.kakao.maps.event.addListener(currentMap, 'zoom_changed', updateScale);
    updateScale();

    if (zoomIn) {
      let stageIdx = 0;

      const runStage = () => {
        if (isStaleRun()) return;

        if (stageIdx >= ZOOM_STAGES.length) {
          finishZoomSequence();
          return;
        }

        const stage = ZOOM_STAGES[stageIdx];
        const pos = new window.kakao.maps.LatLng(school.lat, school.lng);
        const msg = getZoomMessage(stageIdx, school.district);

        setZoomMessage(msg || null);
        currentMap.setCenter(pos);

        smoothZoom(stage.level, () => {
          if (isStaleRun()) return;
          stageIdx += 1;
          scheduleZoomTimeout(runStage, stage.delay);
        });
      };

      scheduleZoomTimeout(runStage, 800);
    } else {
      setZoomMessage(null);
      scheduleZoomTimeout(() => {
        if (isStaleRun()) return;
        const pos = new window.kakao.maps.LatLng(school.lat, school.lng);
        currentMap.setCenter(pos);
      }, 100);
    }

    return () => {
      zoomRunIdRef.current += 1;
      clearZoomTimeouts();
      window.kakao.maps.event.removeListener(currentMap, 'zoom_changed', updateScale);
      overlaysRef.current.forEach(o => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [isLoaded, school, grade]);

  // Add markers for active categories - using merged data
  // Skip rendering markers while zoom animation is in progress
  useEffect(() => {
    if (!isLoaded || !mapInstance.current || isZooming) return;

    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    if (activeCategories.includes('place')) {
      const allPlaces = getMergedPlacesByGrade(grade);
      let places = activePlaceCategories
        ? allPlaces.filter(p => activePlaceCategories.includes(p.category))
        : allPlaces;
      // Filter public places by subcategory: null = show all public, [] = show none, otherwise = show only selected subs
      if (activePublicSubCategories !== undefined && activePublicSubCategories !== null) {
        const subs = activePublicSubCategories;
        places = places.filter(p => {
          if (p.category === 'public') {
            return p.subCategory ? subs.includes(p.subCategory) : false;
          }
          return true;
        });
      }
      // For grade 4, only show places that are in the visible set
      if (visiblePlaceIds) {
        places = places.filter(p => visiblePlaceIds.has(p.id));
      }
      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng);
        const color = (place.category === 'public' && place.subCategory) ? publicSubCategoryColors[place.subCategory] : categoryColors[place.category];
        const icon = categoryIcons[place.category];
        const isSelected = selectedPlace?.id === place.id;

        const el = document.createElement('div');
        el.innerHTML = `<div style="
          background:${color};color:white;
          padding:${isSelected ? '6px 14px' : '4px 10px'};
          border-radius:20px;font-size:${isSelected ? '13px' : '11px'};font-weight:600;
          white-space:nowrap;cursor:pointer;
          box-shadow:${isSelected ? `0 4px 16px ${color}80` : '0 2px 8px rgba(0,0,0,0.2)'};
          transform:translateX(-50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          border:${isSelected ? '2px solid white' : 'none'};
          z-index:${isSelected ? '100' : '1'};
        ">${icon} ${place.name}</div>`;

        const overlay = new window.kakao.maps.CustomOverlay({
          position, content: el, yAnchor: 1.3,
          zIndex: isSelected ? 100 : 1, map: mapInstance.current,
        });
        el.addEventListener('click', () => onPlaceSelect(place));
        overlaysRef.current.push(overlay);
      });

      // When education subcategory is active (or all subs), also render elementary schools as markers (grade 3 only)
      const showSchools =
        grade === 3 &&
        activePlaceCategories?.includes('public') &&
        (!activePublicSubCategories || activePublicSubCategories.includes('education'));
      if (showSchools) {
        const eduColor = publicSubCategoryColors.education;
        const allSchools = getMergedSchools();
        allSchools.forEach((s) => {
          if (s.lat == null || s.lng == null) return;
          if (s.name === school.name) return; // skip currently-selected school (already marked)
          const position = new window.kakao.maps.LatLng(s.lat, s.lng);
          const el = document.createElement('div');
          el.innerHTML = `<div style="
            background:${eduColor};color:white;
            padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
            white-space:nowrap;cursor:pointer;
            box-shadow:0 2px 8px rgba(0,0,0,0.2);
            transform:translateX(-50%);
            transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          ">🏫 ${s.name}</div>`;
          const overlay = new window.kakao.maps.CustomOverlay({
            position, content: el, yAnchor: 1.3, zIndex: 1, map: mapInstance.current,
          });
          el.addEventListener('click', () => {
            mapInstance.current.panTo(position);
          });
          overlaysRef.current.push(overlay);
        });
      }
    }

    const contentCategories = activeCategories.filter(c => c !== 'place');
    contentCategories.forEach((cat) => {
      const items = getMergedContentByCategory(cat, grade);
      const color = contentCategoryColors[cat];
      const catIcon = contentCategoryIcons[cat];

      items.forEach((item) => {
        const position = new window.kakao.maps.LatLng(item.lat, item.lng);
        const isSelected = selectedContent?.id === item.id;

        const el = document.createElement('div');
        el.innerHTML = `<div style="
          background:${color};color:white;
          padding:${isSelected ? '6px 14px' : '4px 10px'};
          border-radius:20px;font-size:${isSelected ? '13px' : '11px'};font-weight:600;
          white-space:nowrap;cursor:pointer;
          box-shadow:${isSelected ? `0 4px 16px ${color}80` : '0 2px 8px rgba(0,0,0,0.2)'};
          transform:translateX(-50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          border:${isSelected ? '2px solid white' : 'none'};
          z-index:${isSelected ? '100' : '1'};
        ">${item.icon || catIcon} ${item.name}</div>`;

        const overlay = new window.kakao.maps.CustomOverlay({
          position, content: el, yAnchor: 1.3,
          zIndex: isSelected ? 100 : 1, map: mapInstance.current,
        });
        el.addEventListener('click', () => onContentSelect(item));
        overlaysRef.current.push(overlay);
      });
    });
  }, [isLoaded, grade, activeCategories, activePlaceCategories, activePublicSubCategories, selectedPlace, selectedContent, onPlaceSelect, onContentSelect, visiblePlaceIds, isZooming]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !selectedPlace) return;
    const position = new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
    mapInstance.current.setCenter(position);
    if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
  }, [isLoaded, selectedPlace]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !selectedContent) return;
    const position = new window.kakao.maps.LatLng(selectedContent.lat, selectedContent.lng);
    mapInstance.current.setCenter(position);
    if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
  }, [isLoaded, selectedContent]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !focusLocation) return;
    const position = new window.kakao.maps.LatLng(focusLocation.lat, focusLocation.lng);
    mapInstance.current.panTo(position);
    if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
  }, [isLoaded, focusLocation]);

  if (error === 'API_KEY_MISSING') {
    return (
      <div className="map-container w-full h-full flex flex-col items-center justify-center gap-4 p-8">
        <MapPin size={48} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Kakao Maps API 키가 필요합니다</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container w-full h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {zoomMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-md text-foreground text-lg md:text-2xl font-black px-6 md:px-8 py-4 md:py-5 rounded-2xl shadow-2xl animate-scale-in border-2 border-primary/20">
            {zoomMessage}
          </div>
        </div>
      )}

      {/* Go to school button - hidden during zoom */}
      {!isZooming && (
        <button
          onClick={handleGoToSchool}
          className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-card/90 backdrop-blur-sm border shadow-md text-[10px] md:text-xs font-bold text-foreground hover:bg-card transition-colors cursor-pointer"
          title="학교로 이동"
        >
          <SchoolIcon size={12} className="text-primary" />
          <span className="hidden sm:inline">학교로 이동</span>
          <span className="sm:hidden">학교</span>
        </button>
      )}

      {/* Zoom controls - hidden during zoom */}
      {!isZooming && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-card/90 backdrop-blur-sm border shadow-md flex items-center justify-center hover:bg-card transition-colors cursor-pointer"
            title="확대"
          >
            <Plus size={16} className="text-foreground" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-card/90 backdrop-blur-sm border shadow-md flex items-center justify-center hover:bg-card transition-colors cursor-pointer"
            title="축소"
          >
            <Minus size={16} className="text-foreground" />
          </button>
        </div>
      )}

      {/* Scale indicator - left bottom, above mobile bottom bar */}
      {!isZooming && (
        <div
          ref={scaleRef}
          className="absolute bottom-16 md:bottom-4 left-2 bg-card/90 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-lg border shadow-sm z-10"
        >
          축척: ...
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
