import { useEffect, useRef, useState, useCallback } from 'react';
import { Place, categoryColors, categoryIcons, getPlacesByGrade } from '@/data/places';
import { MapContent, ContentCategory, contentCategoryColors, contentCategoryIcons, getContentByCategory } from '@/data/content';
import { School } from '@/data/schools';
import { MapPin } from 'lucide-react';

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
  activeContentCategory: ContentCategory;
  zoomIn?: boolean;
  onZoomComplete?: () => void;
}

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

const KakaoMap = ({ school, grade, selectedPlace, onPlaceSelect, selectedContent, onContentSelect, activeContentCategory, zoomIn, onZoomComplete }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const scaleRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Kakao Maps SDK
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

  // Update scale indicator
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

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const center = new window.kakao.maps.LatLng(school.lat, school.lng);
    const startLevel = zoomIn ? 13 : (grade === 4 ? 10 : 7);
    const targetLevel = grade === 4 ? 10 : 5;

    mapInstance.current = new window.kakao.maps.Map(mapRef.current, { center, level: startLevel });

    // School marker
    const schoolMarker = new window.kakao.maps.Marker({ position: center, map: mapInstance.current });
    const schoolInfo = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;white-space:nowrap;">🏫 ${school.name}</div>`,
    });
    schoolInfo.open(mapInstance.current, schoolMarker);

    // Scale update on zoom
    window.kakao.maps.event.addListener(mapInstance.current, 'zoom_changed', updateScale);
    updateScale();

    // Animated zoom-in
    if (zoomIn && startLevel > targetLevel) {
      let currentLevel = startLevel;
      const zoomStep = () => {
        if (currentLevel > targetLevel) {
          currentLevel--;
          mapInstance.current.setLevel(currentLevel, { animate: true });
          setTimeout(zoomStep, 250);
        } else {
          onZoomComplete?.();
        }
      };
      setTimeout(zoomStep, 400);
    }

    return () => {
      overlaysRef.current.forEach(o => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [isLoaded, school, grade]);

  // Add markers based on active category
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;

    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    if (activeContentCategory === 'place') {
      // Show place markers
      const places = getPlacesByGrade(grade);
      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng);
        const color = categoryColors[place.category];
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
    } else {
      // Show content markers
      const items = getContentByCategory(activeContentCategory, grade);
      const color = contentCategoryColors[activeContentCategory];
      const catIcon = contentCategoryIcons[activeContentCategory];

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
    }
  }, [isLoaded, grade, activeContentCategory, selectedPlace, selectedContent, onPlaceSelect, onContentSelect]);

  // Pan to selected place
  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !selectedPlace) return;
    const position = new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
    mapInstance.current.panTo(position);
    mapInstance.current.setLevel(5);
  }, [isLoaded, selectedPlace]);

  // Pan to selected content
  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !selectedContent) return;
    const position = new window.kakao.maps.LatLng(selectedContent.lat, selectedContent.lng);
    mapInstance.current.panTo(position);
    mapInstance.current.setLevel(5);
  }, [isLoaded, selectedContent]);

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
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      {/* Scale indicator */}
      <div
        ref={scaleRef}
        className="absolute bottom-20 md:bottom-4 right-2 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-lg border shadow-sm z-10"
      >
        축척: ...
      </div>
    </div>
  );
};

export default KakaoMap;
