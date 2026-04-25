import { useState, useEffect, useRef } from 'react';
import { getGyeongnamCities, loadGyeongnamEditsFromCloud, loadDetailedBoundaries, isGyeongnamEditsLoaded, GyeongnamCity, GYEONGNAM_UPDATED_EVENT } from '@/data/gyeongnam';
import { X, MapPin, Users, Ruler, Star, ExternalLink, ArrowLeft, ZoomIn } from 'lucide-react';

interface GyeongnamExplorerProps {
  onClose: () => void;
}

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

const GyeongnamExplorer = ({ onClose }: GyeongnamExplorerProps) => {
  const [selectedCity, setSelectedCity] = useState<GyeongnamCity | null>(null);
  const [cities, setCities] = useState<GyeongnamCity[]>(getGyeongnamCities());
  const [loaded, setLoaded] = useState(isGyeongnamEditsLoaded());
  const [zoomImage, setZoomImage] = useState<{ url: string; alt: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load boundaries lazily + cloud edits
    Promise.all([
      loadDetailedBoundaries(),
      loaded ? Promise.resolve() : loadGyeongnamEditsFromCloud(),
    ]).then(() => {
      setCities(getGyeongnamCities());
      setLoaded(true);
    });
    const handleUpdate = () => setCities(getGyeongnamCities());
    window.addEventListener(GYEONGNAM_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(GYEONGNAM_UPDATED_EVENT, handleUpdate);
  }, [loaded]);

  // Initialize map when selecting a city
  useEffect(() => {
    if (!selectedCity || !mapRef.current) return;
    if (!window.kakao?.maps) return;

    const currentCity = cities.find(city => city.id === selectedCity.id) ?? selectedCity;
    const center = new window.kakao.maps.LatLng(currentCity.lat, currentCity.lng);
    const isMobileMap = window.innerWidth < 768;
    // 경남 전체는 도 단위 줌, 개별 시·군은 축척 8km(레벨 8) 기본
    const zoomLevel = currentCity.id === 'gyeongnam'
      ? (isMobileMap ? 12 : 11)
      : 8;
    const map = new window.kakao.maps.Map(mapRef.current, { center, level: zoomLevel });
    mapInstanceRef.current = map;

    // Draw boundary polygons
    // For 경상남도 (province), draw all city boundaries
    const isProvince = currentCity.id === 'gyeongnam';
    const citiesToDraw = isProvince
      ? cities.filter(c => c.id !== 'gyeongnam' && c.boundary && c.boundary.length > 0)
      : (currentCity.boundary && currentCity.boundary.length > 0 ? [currentCity] : []);

    const colors = ['#FF6B35', '#4A90D9', '#50C878', '#E74C3C', '#9B59B6', '#F39C12', '#1ABC9C', '#E91E63',
      '#00BCD4', '#FF5722', '#795548', '#607D8B', '#8BC34A', '#FF9800', '#3F51B5', '#009688', '#CDDC39', '#673AB7'];

    citiesToDraw.forEach((city, cityIdx) => {
      const isMulti = Array.isArray(city.boundary![0]?.[0]);
      const rings: [number, number][][] = isMulti
        ? (city.boundary as [number, number][][])
        : [city.boundary as [number, number][]];

      const color = isProvince ? colors[cityIdx % colors.length] : '#FF6B35';

      rings.forEach(ring => {
        if (ring.length < 3) return;
        const path = ring.map(
          ([lat, lng]) => new window.kakao.maps.LatLng(lat, lng)
        );
        const polygon = new window.kakao.maps.Polygon({
          path,
          strokeWeight: isProvince ? 2 : 3,
          strokeColor: color,
          strokeOpacity: 0.8,
          fillColor: color,
          fillOpacity: isProvince ? 0.2 : 0.15,
        });
        polygon.setMap(map);
      });

      // Add city name label for province view
      if (isProvince) {
        const labelContent = document.createElement('div');
        labelContent.innerHTML = `<div style="background:${color};color:white;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:bold;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.3);">${city.mascotEmoji} ${city.name}</div>`;
        const labelOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(city.lat, city.lng),
          content: labelContent,
          yAnchor: 0.5,
          map,
        });
      }
    });

    // City center marker
    const marker = new window.kakao.maps.Marker({ position: center, map });
    const info = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;font-weight:bold;white-space:nowrap;">${currentCity.mascotEmoji} ${currentCity.name}</div>`,
    });
    info.open(map, marker);

    return () => { mapInstanceRef.current = null; };
  }, [selectedCity, cities]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-hidden animate-slide-up md:animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 md:p-4 border-b flex items-center justify-between bg-primary/10 sticky top-0 z-10">
          {selectedCity ? (
            <button onClick={() => setSelectedCity(null)} className="flex items-center gap-1 text-sm font-bold text-primary cursor-pointer">
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
            <p className="text-xs md:text-sm text-muted-foreground mb-3">경상남도와 18개 시·군을 선택하여 지명 유래, 마스코트, 인구 등을 알아보세요!</p>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className="flex flex-col items-center gap-1 md:gap-1.5 p-2 md:p-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  {city.logoUrl ? (
                    <div className="relative group">
                      <img src={city.logoUrl} alt={`${city.name} 로고`} className="w-14 h-14 md:w-16 md:h-16 object-contain" />
                    </div>
                  ) : (
                    <span className="text-3xl md:text-4xl">{city.mascotEmoji}</span>
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
                  {selectedCity.mascotImageUrl ? (
                    <img src={selectedCity.mascotImageUrl} alt={selectedCity.mascot} className="w-6 h-6 mx-auto mb-0.5 object-contain" />
                  ) : (
                    <span className="text-sm">{selectedCity.mascotEmoji}</span>
                  )}
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

              <div ref={mapRef} className="w-full h-64 md:h-80 lg:h-96 rounded-xl border overflow-hidden" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GyeongnamExplorer;
