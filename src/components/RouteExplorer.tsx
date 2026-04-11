import { useState, useMemo } from 'react';
import { Place, PlaceCategory, categoryIcons, categoryColors, categoryLabels, getDistance, getEstimatedTime } from '@/data/places';
import { School } from '@/data/schools';
import { getMergedPlacesByGrade } from '@/data/dataManager';
import { X, Plus, Trash2, Navigation, Route, ChevronUp, ChevronDown } from 'lucide-react';

interface RouteExplorerProps {
  grade: 3 | 4;
  school: School;
  onClose: () => void;
  onPlaceSelect: (place: Place) => void;
}

const allCategories: PlaceCategory[] = ['tourism', 'nature', 'culture', 'public', 'experience', 'market'];

const RouteExplorer = ({ grade, school, onClose, onPlaceSelect }: RouteExplorerProps) => {
  const [routePlaces, setRoutePlaces] = useState<Place[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');

  const allPlaces = useMemo(() => getMergedPlacesByGrade(grade), [grade]);

  const filteredPlaces = useMemo(() => {
    const ids = new Set(routePlaces.map(p => p.id));
    return allPlaces.filter(p => {
      if (ids.has(p.id)) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchTerm && !p.name.includes(searchTerm) && !p.address.includes(searchTerm)) return false;
      return true;
    });
  }, [allPlaces, routePlaces, searchTerm, selectedCategory]);

  const addPlace = (place: Place) => {
    setRoutePlaces(prev => [...prev, place]);
    setShowPicker(false);
    setSearchTerm('');
  };

  const removePlace = (index: number) => {
    setRoutePlaces(prev => prev.filter((_, i) => i !== index));
  };

  const movePlace = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= routePlaces.length) return;
    const updated = [...routePlaces];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setRoutePlaces(updated);
  };

  const totalDistance = useMemo(() => {
    if (routePlaces.length < 2) return 0;
    let total = getDistance(school.lat, school.lng, routePlaces[0].lat, routePlaces[0].lng);
    for (let i = 1; i < routePlaces.length; i++) {
      total += getDistance(routePlaces[i - 1].lat, routePlaces[i - 1].lng, routePlaces[i].lat, routePlaces[i].lng);
    }
    return total;
  }, [routePlaces, school]);

  // Kakao Maps URL: use multi-marker map view + direction to final destination
  const kakaoMapUrl = useMemo(() => {
    if (routePlaces.length === 0) return '';
    // Multi-marker view: school + all route places
    const markers = [
      `${encodeURIComponent(school.name)},${school.lat},${school.lng}`,
      ...routePlaces.map(p => `${encodeURIComponent(p.name)},${p.lat},${p.lng}`)
    ];
    return `https://map.kakao.com/link/map/${markers.join('/')}`;
  }, [routePlaces, school]);

  const kakaoDirectionUrl = useMemo(() => {
    if (routePlaces.length === 0) return '';
    const dest = routePlaces[routePlaces.length - 1];
    return `https://map.kakao.com/link/to/${encodeURIComponent(dest.name)},${dest.lat},${dest.lng}`;
  }, [routePlaces]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between bg-primary/10">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Route size={18} className="text-primary" /> 경로 탐험 모드
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh]">
          {/* Route summary */}
          {routePlaces.length >= 2 && (
            <div className="mb-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">총 {routePlaces.length}개 장소</span>
                <span className="text-primary font-bold">
                  {totalDistance < 1 ? `${Math.round(totalDistance * 1000)}m` : `${totalDistance.toFixed(1)}km`} · 🚗 {getEstimatedTime(totalDistance)}
                </span>
              </div>
            </div>
          )}

          {/* Start: School */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">🏫</div>
            <span className="text-sm font-bold text-foreground">{school.name} (출발)</span>
          </div>

          {/* Route places */}
          {routePlaces.map((place, index) => {
            const prevLat = index === 0 ? school.lat : routePlaces[index - 1].lat;
            const prevLng = index === 0 ? school.lng : routePlaces[index - 1].lng;
            const dist = getDistance(prevLat, prevLng, place.lat, place.lng);
            const color = categoryColors[place.category];

            return (
              <div key={place.id}>
                <div className="ml-3.5 border-l-2 border-dashed border-muted-foreground/30 h-4 flex items-center pl-4">
                  <span className="text-xs text-muted-foreground">{dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ backgroundColor: color }}>
                    {index + 1}
                  </div>
                  <button onClick={() => onPlaceSelect(place)} className="flex-1 text-left min-w-0 cursor-pointer hover:underline">
                    <span className="text-sm font-bold text-foreground truncate block">{categoryIcons[place.category]} {place.name}</span>
                  </button>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => movePlace(index, -1)} disabled={index === 0} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ChevronUp size={14} /></button>
                    <button onClick={() => movePlace(index, 1)} disabled={index === routePlaces.length - 1} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ChevronDown size={14} /></button>
                    <button onClick={() => removePlace(index)} className="p-1 rounded text-destructive/70 hover:text-destructive cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add button / Picker */}
          {!showPicker ? (
            <button onClick={() => setShowPicker(true)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-medium cursor-pointer hover:bg-primary/5 transition-colors">
              <Plus size={16} /> 장소 추가
            </button>
          ) : (
            <div className="mt-3 border rounded-xl p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">장소 선택</span>
                <button onClick={() => { setShowPicker(false); setSearchTerm(''); }} className="text-muted-foreground cursor-pointer"><X size={16} /></button>
              </div>

              {/* Category filter chips */}
              <div className="flex gap-1 flex-wrap mb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedCategory === 'all' ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    color: selectedCategory === 'all' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  전체
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selectedCategory === cat ? categoryColors[cat] : categoryColors[cat] + '20',
                      color: selectedCategory === cat ? 'white' : categoryColors[cat],
                    }}
                  >
                    {categoryIcons[cat]} {categoryLabels[cat].split(' ').pop()}
                  </button>
                ))}
              </div>

              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="장소 검색..."
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary" />

              <div className="text-[10px] text-muted-foreground mb-1">총 {filteredPlaces.length}개 장소</div>

              <div className="max-h-40 overflow-auto space-y-1">
                {filteredPlaces.slice(0, 30).map(p => (
                  <button key={p.id} onClick={() => addPlace(p)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-left">
                    <span className="text-base">{categoryIcons[p.category]}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {routePlaces.length >= 1 && (
            <div className="mt-4 flex gap-2">
              <a href={kakaoDirectionUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                <Navigation size={14} /> 길찾기
              </a>
              {routePlaces.length >= 2 && (
                <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                  📍 전체보기
                </a>
              )}
              <button onClick={() => setRoutePlaces([])}
                className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors">
                초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteExplorer;
