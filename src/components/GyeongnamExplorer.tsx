import { useState, useEffect, useRef } from 'react';
import { getGyeongnamCities, loadGyeongnamEditsFromCloud, isGyeongnamEditsLoaded, GyeongnamCity, GYEONGNAM_UPDATED_EVENT } from '@/data/gyeongnam';
import { X, MapPin, Users, Ruler, Star, ExternalLink, ArrowLeft } from 'lucide-react';

interface GyeongnamExplorerProps {
  onClose: () => void;
}

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

const GyeongnamExplorer = ({ onClose }: GyeongnamExplorerProps) => {
  const [selectedCity, setSelectedCity] = useState<GyeongnamCity | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [cities, setCities] = useState<GyeongnamCity[]>(getGyeongnamCities());
  const [loaded, setLoaded] = useState(isGyeongnamEditsLoaded());
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!loaded) {
      loadGyeongnamEditsFromCloud().then(() => {
        setCities(getGyeongnamCities());
        setLoaded(true);
      });
    }
    const handleUpdate = () => setCities(getGyeongnamCities());
    window.addEventListener(GYEONGNAM_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(GYEONGNAM_UPDATED_EVENT, handleUpdate);
  }, [loaded]);

  // Initialize map when showing a city
  useEffect(() => {
    if (!showMap || !selectedCity || !mapRef.current) return;
    if (!window.kakao?.maps) return;

    const center = new window.kakao.maps.LatLng(selectedCity.lat, selectedCity.lng);
    const map = new window.kakao.maps.Map(mapRef.current, { center, level: 9 });
    mapInstanceRef.current = map;

    // Draw boundary polygon
    if (selectedCity.boundary && selectedCity.boundary.length > 0) {
      const path = selectedCity.boundary.map(
        ([lat, lng]) => new window.kakao.maps.LatLng(lat, lng)
      );
      const polygon = new window.kakao.maps.Polygon({
        path,
        strokeWeight: 3,
        strokeColor: '#FF6B35',
        strokeOpacity: 0.8,
        fillColor: '#FF6B35',
        fillOpacity: 0.15,
      });
      polygon.setMap(map);
    }

    // City center marker
    const marker = new window.kakao.maps.Marker({ position: center, map });
    const info = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;font-weight:bold;white-space:nowrap;">${selectedCity.mascotEmoji} ${selectedCity.name}</div>`,
    });
    info.open(map, marker);

    return () => { mapInstanceRef.current = null; };
  }, [showMap, selectedCity]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-hidden animate-slide-up md:animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 md:p-4 border-b flex items-center justify-between bg-primary/10 sticky top-0 z-10">
          {selectedCity ? (
            <button onClick={() => { setSelectedCity(null); setShowMap(false); }} className="flex items-center gap-1 text-sm font-bold text-primary cursor-pointer">
              <ArrowLeft size={16} /> 시·군 목록
            </button>
          ) : (
            <h2 className="text-base md:text-lg font-bold text-foreground">🗺️ 경상남도 시·군 탐색</h2>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>

        {!selectedCity ? (
          /* City Grid */
          <div className="p-3 md:p-4 overflow-auto max-h-[75vh]">
            <p className="text-xs md:text-sm text-muted-foreground mb-3">경상남도의 18개 시·군을 선택하여 지명 유래, 마스코트, 인구 등을 알아보세요!</p>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className="flex flex-col items-center gap-0.5 md:gap-1 p-2 md:p-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  {city.logoUrl ? (
                    <img src={city.logoUrl} alt={`${city.name} 로고`} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  ) : (
                    <span className="text-xl md:text-2xl">{city.mascotEmoji}</span>
                  )}
                  <span className="text-xs md:text-sm font-bold text-foreground">{city.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* City Detail */
          <div className="overflow-auto max-h-[75vh]">
            <div className="p-3 md:p-4 space-y-3">
              {/* City Header */}
              <div className="flex items-center gap-3">
                {selectedCity.logoUrl ? (
                  <img src={selectedCity.logoUrl} alt={`${selectedCity.name} 로고`} className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg" />
                ) : null}
                {selectedCity.mascotImageUrl ? (
                  <img src={selectedCity.mascotImageUrl} alt={selectedCity.mascot} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                ) : (
                  <span className="text-3xl md:text-4xl">{selectedCity.mascotEmoji}</span>
                )}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">{selectedCity.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{selectedCity.nameHanja}</p>
                </div>
                <a href={selectedCity.officialSite} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <ExternalLink size={12} /> 공식 사이트
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                  <Users size={14} className="text-primary mx-auto mb-0.5" />
                  <p className="text-[10px] text-muted-foreground">인구</p>
                  <p className="text-xs font-bold text-foreground">{selectedCity.population.toLocaleString()}명</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                  <Ruler size={14} className="text-primary mx-auto mb-0.5" />
                  <p className="text-[10px] text-muted-foreground">면적</p>
                  <p className="text-xs font-bold text-foreground">{selectedCity.area} km²</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                  <span className="text-sm">{selectedCity.mascotEmoji}</span>
                  <p className="text-[10px] text-muted-foreground">마스코트</p>
                  <p className="text-xs font-bold text-foreground">{selectedCity.mascot}</p>
                </div>
              </div>

              {/* Name Origin */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin size={14} className="text-primary" />
                  <p className="text-xs md:text-sm font-bold text-foreground">지명 유래</p>
                </div>
                <p className="text-xs md:text-sm text-foreground leading-relaxed">{selectedCity.nameOrigin}</p>
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Star size={14} className="text-primary" />
                  <p className="text-xs md:text-sm font-bold text-foreground">대표 명소·특징</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCity.highlights.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-[11px] font-medium text-foreground">{h}</span>
                  ))}
                </div>
              </div>

              {/* Map toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {showMap ? '지도 닫기' : '📍 행정구역 지도 보기'}
              </button>

              {showMap && (
                <div ref={mapRef} className="w-full h-48 md:h-64 rounded-xl border overflow-hidden" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GyeongnamExplorer;
