import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Place, PlaceCategory, categoryLabels, categoryColors, categoryIcons, publicSubCategoryLabels, PublicSubCategory } from '@/data/places';
import { getMergedPlaces, savePlaceEdit, saveCustomPlace, deletePlace, PLACES_UPDATED_EVENT } from '@/data/dataManager';
import { places as defaultPlaces } from '@/data/places';
import { X, Save, Trash2, Plus, MapPin, Youtube, Search, ChevronDown, ChevronUp } from 'lucide-react';

const KAKAO_API_KEY = 'e59d21f6d3e29ccff958317c0b44fcbb';

interface EditablePlace {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  subCategory?: PublicSubCategory;
  imageUrl?: string;
  origin?: string;
  referenceUrl?: string;
  youtubeUrl?: string;
  grade?: 3 | 4 | 'all';
}

interface AdminMapEditorProps {
  onClose: () => void;
}

const AdminMapEditor = ({ onClose }: AdminMapEditorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<EditablePlace | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const allPlaces = useMemo(() => getMergedPlaces(), [renderKey]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allPlaces.filter(p => p.name.includes(searchTerm) || p.address?.includes(searchTerm)).slice(0, 10);
  }, [allPlaces, searchTerm]);

  // Load Kakao Maps
  useEffect(() => {
    if (window.kakao?.maps) { setIsLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => { window.kakao.maps.load(() => setIsLoaded(true)); };
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const center = new window.kakao.maps.LatLng(34.88, 128.62);
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, { center, level: 5 });

    // Click on map to add place
    window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: any) => {
      if (!isAdding) return;
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      setSelectedPlace({
        id: `custom-p-${Date.now()}`,
        name: '',
        description: '',
        address: '',
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        category: 'tourism',
        grade: 'all',
      });
      setIsEditing(true);
      setIsAdding(false);
    });
  }, [isLoaded]);

  // Update isAdding ref for map click handler
  const isAddingRef = useRef(isAdding);
  useEffect(() => { isAddingRef.current = isAdding; }, [isAdding]);

  // Re-bind click listener when isAdding changes
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    const listener = window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: any) => {
      if (!isAddingRef.current) return;
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      setSelectedPlace({
        id: `custom-p-${Date.now()}`,
        name: '',
        description: '',
        address: '',
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        category: 'tourism',
        grade: 'all',
      });
      setIsEditing(true);
      setIsAdding(false);
    });
    return () => {
      window.kakao.maps.event.removeListener(listener);
    };
  }, [isLoaded]);

  // Render markers
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    allPlaces.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng);
      const color = categoryColors[place.category];
      const icon = categoryIcons[place.category];
      const isSelected = selectedPlace?.id === place.id && !isEditing;

      const el = document.createElement('div');
      el.innerHTML = `<div style="
        background:${color};color:white;
        padding:${isSelected ? '5px 12px' : '3px 8px'};
        border-radius:16px;font-size:${isSelected ? '12px' : '10px'};font-weight:600;
        white-space:nowrap;cursor:pointer;
        box-shadow:${isSelected ? `0 4px 16px ${color}80` : '0 1px 4px rgba(0,0,0,0.2)'};
        transform:translateX(-50%) ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        transition:all 0.2s ease;
        border:${isSelected ? '2px solid white' : 'none'};
        z-index:${isSelected ? '100' : '1'};
      ">${icon} ${place.name}</div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position, content: el, yAnchor: 1.3,
        zIndex: isSelected ? 100 : 1, map: mapInstance.current,
      });
      el.addEventListener('click', () => {
        setSelectedPlace({
          id: place.id,
          name: place.name,
          description: place.description,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          category: place.category,
          subCategory: (place as any).subCategory,
          imageUrl: place.imageUrl,
          origin: place.origin,
          referenceUrl: place.referenceUrl,
          youtubeUrl: place.youtubeUrl,
          grade: place.grade,
        });
        setIsEditing(false);
        setDetailsExpanded(false);
        const pos = new window.kakao.maps.LatLng(place.lat, place.lng);
        mapInstance.current.panTo(pos);
      });
      overlaysRef.current.push(overlay);
    });
  }, [isLoaded, allPlaces, selectedPlace, isEditing]);

  const handleSave = useCallback(() => {
    if (!selectedPlace || !selectedPlace.name.trim()) return;
    const parsed = {
      ...selectedPlace,
      lat: parseFloat(String(selectedPlace.lat)) || 0,
      lng: parseFloat(String(selectedPlace.lng)) || 0,
    };
    const isDefault = defaultPlaces.some(p => p.id === parsed.id);
    if (isDefault) {
      savePlaceEdit(parsed.id, parsed as any);
    } else {
      saveCustomPlace(parsed as any);
    }
    setIsEditing(false);
    setRenderKey(n => n + 1);
  }, [selectedPlace]);

  const handleDelete = useCallback(() => {
    if (!selectedPlace) return;
    if (!confirm(`"${selectedPlace.name}" 장소를 삭제하시겠습니까?`)) return;
    deletePlace(selectedPlace.id);
    setSelectedPlace(null);
    setIsEditing(false);
    setRenderKey(n => n + 1);
  }, [selectedPlace]);

  const handleSearchSelect = useCallback((place: Place) => {
    setSelectedPlace({
      id: place.id, name: place.name, description: place.description,
      address: place.address, lat: place.lat, lng: place.lng,
      category: place.category, subCategory: (place as any).subCategory,
      imageUrl: place.imageUrl, origin: place.origin,
      referenceUrl: place.referenceUrl, youtubeUrl: place.youtubeUrl,
      grade: place.grade,
    });
    setIsEditing(false);
    setShowSearch(false);
    setSearchTerm('');
    setDetailsExpanded(false);
    if (mapInstance.current) {
      const pos = new window.kakao.maps.LatLng(place.lat, place.lng);
      mapInstance.current.panTo(pos);
      if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
    }
  }, []);

  useEffect(() => {
    const handler = () => setRenderKey(n => n + 1);
    window.addEventListener(PLACES_UPDATED_EVENT, handler);
    return () => window.removeEventListener(PLACES_UPDATED_EVENT, handler);
  }, []);

  const inputClass = "w-full mt-1 px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">🗺️ 지도 편집기</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{allPlaces.length}개 장소</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${showSearch ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            <Search size={14} />
          </button>
          <button onClick={() => { setIsAdding(!isAdding); setSelectedPlace(null); setIsEditing(false); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${isAdding ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground hover:bg-accent/80'}`}>
            <Plus size={12} /> {isAdding ? '추가 취소' : '장소 추가'}
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-3 py-2 bg-card border-b z-10 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2 text-muted-foreground" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="장소명 또는 주소 검색..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1 max-h-40 overflow-auto rounded-lg border bg-card">
              {searchResults.map(p => (
                <button key={p.id} onClick={() => handleSearchSelect(p)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 cursor-pointer border-b last:border-b-0 flex items-center gap-2">
                  <span>{categoryIcons[p.category]}</span>
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-[40%]">{p.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adding hint */}
      {isAdding && (
        <div className="px-3 py-2 bg-primary/10 border-b z-10 flex-shrink-0">
          <p className="text-xs text-primary font-medium text-center">📍 지도를 클릭하여 새 장소를 추가하세요</p>
        </div>
      )}

      {/* Map + Side panel layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <div ref={mapRef} className="flex-1 h-full" />

        {/* Side panel - place details / editor */}
        {selectedPlace && (
          <div className="w-80 md:w-96 h-full bg-card border-l overflow-auto flex-shrink-0 flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30 flex-shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm">{categoryIcons[selectedPlace.category]}</span>
                <span className="text-xs font-bold text-foreground truncate">{selectedPlace.name || '새 장소'}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isEditing && (
                  <button onClick={() => { setIsEditing(true); setDetailsExpanded(true); }}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-primary text-primary-foreground cursor-pointer hover:opacity-90">수정</button>
                )}
                <button onClick={handleDelete}
                  className="p-1 rounded bg-destructive/10 text-destructive cursor-pointer hover:bg-destructive/20"><Trash2 size={12} /></button>
                <button onClick={() => { setSelectedPlace(null); setIsEditing(false); }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {!isEditing ? (
                // View mode
                <>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground">카테고리</p>
                    <p className="text-xs text-foreground">{categoryLabels[selectedPlace.category]}
                      {selectedPlace.subCategory && ` > ${publicSubCategoryLabels[selectedPlace.subCategory]}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground">설명</p>
                    <p className="text-xs text-foreground leading-relaxed">{selectedPlace.description || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground">주소</p>
                    <p className="text-xs text-foreground">{selectedPlace.address || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground">위도</p>
                      <p className="text-xs text-foreground font-mono">{selectedPlace.lat}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground">경도</p>
                      <p className="text-xs text-foreground font-mono">{selectedPlace.lng}</p>
                    </div>
                  </div>
                  <button onClick={() => setDetailsExpanded(!detailsExpanded)}
                    className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer py-1">
                    {detailsExpanded ? <><ChevronUp size={12} /> 접기</> : <><ChevronDown size={12} /> 더보기</>}
                  </button>
                  {detailsExpanded && (
                    <>
                      {selectedPlace.origin && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground">유래</p>
                          <p className="text-xs text-foreground leading-relaxed">{selectedPlace.origin}</p>
                        </div>
                      )}
                      {selectedPlace.referenceUrl && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground">참고 링크</p>
                          <a href={selectedPlace.referenceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{selectedPlace.referenceUrl}</a>
                        </div>
                      )}
                      {selectedPlace.youtubeUrl && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground">유튜브</p>
                          <a href={selectedPlace.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{selectedPlace.youtubeUrl}</a>
                        </div>
                      )}
                      {selectedPlace.imageUrl && (
                        <img src={selectedPlace.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg" />
                      )}
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground">학년</p>
                        <p className="text-xs text-foreground">{selectedPlace.grade === 'all' ? '전체' : `${selectedPlace.grade}학년`}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground">ID</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{selectedPlace.id}</p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Edit mode
                <>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">이름 *</label>
                    <input value={selectedPlace.name} onChange={e => setSelectedPlace({ ...selectedPlace, name: e.target.value })} className={inputClass} placeholder="장소명 입력" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">설명</label>
                    <textarea value={selectedPlace.description} onChange={e => setSelectedPlace({ ...selectedPlace, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">카테고리</label>
                    <select value={selectedPlace.category} onChange={e => setSelectedPlace({ ...selectedPlace, category: e.target.value as PlaceCategory })} className={inputClass}>
                      {(Object.entries(categoryLabels) as [PlaceCategory, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  {selectedPlace.category === 'public' && (
                    <div>
                      <label className="text-[10px] font-semibold text-foreground">세부 카테고리</label>
                      <select value={selectedPlace.subCategory || ''} onChange={e => setSelectedPlace({ ...selectedPlace, subCategory: (e.target.value || undefined) as PublicSubCategory | undefined })} className={inputClass}>
                        <option value="">선택안함</option>
                        {(Object.entries(publicSubCategoryLabels) as [PublicSubCategory, string][]).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">주소</label>
                    <input value={selectedPlace.address} onChange={e => setSelectedPlace({ ...selectedPlace, address: e.target.value })} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-foreground">위도</label>
                      <input type="text" inputMode="decimal" value={selectedPlace.lat} onChange={e => setSelectedPlace({ ...selectedPlace, lat: e.target.value as any })} className={inputClass} step="0.000001" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-foreground">경도</label>
                      <input type="text" inputMode="decimal" value={selectedPlace.lng} onChange={e => setSelectedPlace({ ...selectedPlace, lng: e.target.value as any })} className={inputClass} step="0.000001" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">학년</label>
                    <select value={String(selectedPlace.grade || 'all')} onChange={e => setSelectedPlace({ ...selectedPlace, grade: e.target.value === 'all' ? 'all' : Number(e.target.value) as 3 | 4 })} className={inputClass}>
                      <option value="all">전체</option>
                      <option value="3">3학년</option>
                      <option value="4">4학년</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">유래</label>
                    <textarea value={selectedPlace.origin || ''} onChange={e => setSelectedPlace({ ...selectedPlace, origin: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground">참고 링크</label>
                    <input value={selectedPlace.referenceUrl || ''} onChange={e => setSelectedPlace({ ...selectedPlace, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground flex items-center gap-1"><Youtube size={10} className="text-destructive" /> 유튜브</label>
                    <input value={selectedPlace.youtubeUrl || ''} onChange={e => setSelectedPlace({ ...selectedPlace, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSave} disabled={!selectedPlace.name.trim()}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90 disabled:opacity-50">
                      <Save size={12} /> 저장
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold cursor-pointer hover:bg-muted/80">
                      취소
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMapEditor;
