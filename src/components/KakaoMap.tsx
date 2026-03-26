import { useEffect, useRef, useState } from 'react';
import { Place, categoryColors, getPlacesByGrade } from '@/data/places';
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
}

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

const KakaoMap = ({ school, grade, selectedPlace, onPlaceSelect }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Kakao Maps SDK
  useEffect(() => {
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    if (!KAKAO_API_KEY) {
      setError('API_KEY_MISSING');
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };
    script.onerror = () => setError('Kakao Maps SDK 로딩 실패');
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = new window.kakao.maps.LatLng(school.lat, school.lng);
    const options = {
      center,
      level: grade === 4 ? 10 : 7,
    };

    mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

    // Add school marker
    const schoolMarker = new window.kakao.maps.Marker({
      position: center,
      map: mapInstance.current,
    });

    const schoolInfo = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;white-space:nowrap;">🏫 ${school.name}</div>`,
    });
    schoolInfo.open(mapInstance.current, schoolMarker);

    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [isLoaded, school, grade]);

  // Add place markers
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const places = getPlacesByGrade(grade);

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng);
      const color = categoryColors[place.category];

      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div style="
          background:${color};
          color:white;
          padding:4px 10px;
          border-radius:20px;
          font-size:11px;
          font-weight:600;
          white-space:nowrap;
          cursor:pointer;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
          transform:translateX(-50%);
        ">${place.name}</div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: markerContent,
        yAnchor: 1.3,
        map: mapInstance.current,
      });

      markerContent.addEventListener('click', () => onPlaceSelect(place));
      markersRef.current.push(overlay);
    });
  }, [isLoaded, grade, onPlaceSelect]);

  // Pan to selected place
  useEffect(() => {
    if (!isLoaded || !mapInstance.current || !selectedPlace) return;

    const position = new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
    mapInstance.current.panTo(position);
    mapInstance.current.setLevel(5);
  }, [isLoaded, selectedPlace]);

  if (error === 'API_KEY_MISSING') {
    return (
      <div className="map-container w-full h-full flex flex-col items-center justify-center gap-4 p-8">
        <MapPin size={48} className="text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Kakao Maps API 키가 필요합니다
          </h3>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            <code className="bg-muted px-2 py-0.5 rounded text-xs">src/components/KakaoMap.tsx</code> 파일의{' '}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">KAKAO_API_KEY</code> 변수에 
            Kakao JavaScript API 키를 입력해주세요.
          </p>
          <a
            href="https://developers.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
          >
            developers.kakao.com에서 발급받기 →
          </a>
        </div>
        {/* Show places list as fallback */}
        <div className="mt-4 w-full max-w-md">
          <PlaceListFallback grade={grade} onPlaceSelect={onPlaceSelect} />
        </div>
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

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
};

// Fallback when no API key
function PlaceListFallback({ grade, onPlaceSelect }: { grade: 3 | 4; onPlaceSelect: (p: Place) => void }) {
  const places = getPlacesByGrade(grade);
  return (
    <div className="bg-card rounded-xl border p-4 max-h-60 overflow-y-auto">
      <p className="text-xs text-muted-foreground mb-2 font-medium">📍 등록된 장소 목록:</p>
      <div className="flex flex-col gap-1">
        {places.map(p => (
          <button
            key={p.id}
            onClick={() => onPlaceSelect(p)}
            className="text-left text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[p.category] }} />
            <span className="font-medium">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default KakaoMap;
