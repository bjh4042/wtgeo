import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Place, PlaceCategory, categoryLabels, categoryColors, categoryIcons, publicSubCategoryLabels, PublicSubCategory } from '@/data/places';
import { MapContent, ContentCategory, contentCategoryLabels, contentCategoryColors, contentCategoryIcons } from '@/data/content';
import { School } from '@/data/schools';
import { getMergedPlaces, getMergedSchools, getMergedContent, savePlaceEdit, saveCustomPlace, deletePlace, saveSchoolEdit, saveContentEdit, saveCustomContent, deleteContent, PLACES_UPDATED_EVENT, SCHOOLS_UPDATED_EVENT, CONTENT_UPDATED_EVENT } from '@/data/dataManager';
import { stories, placenames, heritages, pastPresent, natureContent } from '@/data/content';
import { places as defaultPlaces } from '@/data/places';
import { X, Save, Trash2, Plus, MapPin, Youtube, Search, ChevronDown, ChevronUp, Filter, GraduationCap, BookOpen } from 'lucide-react';

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

interface EditableSchool {
  index: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  district: string;
  website?: string;
}

type EditorMode = 'place' | 'school';

interface AdminMapEditorProps {
  onClose: () => void;
}

const AdminMapEditor = ({ onClose }: AdminMapEditorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<EditablePlace | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<EditableSchool | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PlaceCategory[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('place');
  const [showSchools, setShowSchools] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [activeContentFilters, setActiveContentFilters] = useState<ContentCategory[]>([]);

  const allPlaces = useMemo(() => getMergedPlaces(), [renderKey]);
  const allSchools = useMemo(() => getMergedSchools().map((s, i) => ({ ...s, index: i })), [renderKey]);
  const allContent = useMemo(() => getMergedContent(), [renderKey]);

  const filteredContent = useMemo(() => {
    if (activeContentFilters.length === 0) return allContent;
    return allContent.filter(c => activeContentFilters.includes(c.contentType));
  }, [allContent, activeContentFilters]);

  const filteredPlaces = useMemo(() => {
    if (activeFilters.length === 0) return allPlaces;
    return allPlaces.filter(p => activeFilters.includes(p.category));
  }, [allPlaces, activeFilters]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { places: [] as Place[], schools: [] as (School & { index: number })[] };
    const places = filteredPlaces.filter(p => p.name.includes(searchTerm) || p.address?.includes(searchTerm)).slice(0, 8);
    const schools = allSchools.filter(s => s.name.includes(searchTerm) || s.address?.includes(searchTerm) || s.district?.includes(searchTerm)).slice(0, 8);
    return { places, schools };
  }, [filteredPlaces, allSchools, searchTerm]);

  const toggleFilter = (cat: PlaceCategory) => {
    setActiveFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleContentFilter = (cat: ContentCategory) => {
    setActiveContentFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

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
  }, [isLoaded]);

  // isAdding click handler
  const isAddingRef = useRef(isAdding);
  useEffect(() => { isAddingRef.current = isAdding; }, [isAdding]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    const listener = window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: any) => {
      if (!isAddingRef.current) return;
      const lat = mouseEvent.latLng.getLat();
      const lng = mouseEvent.latLng.getLng();
      setSelectedPlace({
        id: `custom-p-${Date.now()}`,
        name: '', description: '', address: '',
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        category: 'tourism', grade: 'all',
      });
      setSelectedSchool(null);
      setEditorMode('place');
      setIsEditing(true);
      setIsAdding(false);
    });
    return () => { window.kakao.maps.event.removeListener(listener); };
  }, [isLoaded]);

  // Render markers
  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    // Place markers
    filteredPlaces.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng);
      const color = categoryColors[place.category];
      const icon = categoryIcons[place.category];
      const isSelected = selectedPlace?.id === place.id && editorMode === 'place' && !isEditing;

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
        setSelectedSchool(null);
        setEditorMode('place');
        setSelectedPlace({
          id: place.id, name: place.name, description: place.description,
          address: place.address, lat: place.lat, lng: place.lng,
          category: place.category, subCategory: (place as any).subCategory,
          imageUrl: place.imageUrl, origin: place.origin,
          referenceUrl: place.referenceUrl, youtubeUrl: place.youtubeUrl, grade: place.grade,
        });
        setIsEditing(false);
        setDetailsExpanded(false);
        const pos = new window.kakao.maps.LatLng(place.lat, place.lng);
        mapInstance.current.panTo(pos);
      });
      overlaysRef.current.push(overlay);
    });

    // School markers
    if (showSchools) {
      allSchools.forEach((school) => {
        const position = new window.kakao.maps.LatLng(school.lat, school.lng);
        const isSelected = selectedSchool?.index === school.index && editorMode === 'school' && !isEditing;

        const el = document.createElement('div');
        el.innerHTML = `<div style="
          background:#6366f1;color:white;
          padding:${isSelected ? '5px 12px' : '3px 8px'};
          border-radius:16px;font-size:${isSelected ? '12px' : '10px'};font-weight:600;
          white-space:nowrap;cursor:pointer;
          box-shadow:${isSelected ? '0 4px 16px rgba(99,102,241,0.5)' : '0 1px 4px rgba(0,0,0,0.2)'};
          transform:translateX(-50%) ${isSelected ? 'scale(1.1)' : 'scale(1)'};
          transition:all 0.2s ease;
          border:${isSelected ? '2px solid white' : 'none'};
          z-index:${isSelected ? '100' : '1'};
        ">🏫 ${school.name}</div>`;

        const overlay = new window.kakao.maps.CustomOverlay({
          position, content: el, yAnchor: 1.3,
          zIndex: isSelected ? 100 : 1, map: mapInstance.current,
        });
        el.addEventListener('click', () => {
          setSelectedPlace(null);
          setEditorMode('school');
          setSelectedSchool({
            index: school.index, name: school.name, address: school.address,
            lat: school.lat, lng: school.lng, phone: school.phone,
            district: school.district, website: school.website,
          });
          setIsEditing(false);
          setDetailsExpanded(false);
          const pos = new window.kakao.maps.LatLng(school.lat, school.lng);
          mapInstance.current.panTo(pos);
        });
        overlaysRef.current.push(overlay);
      });
    }

    // Content markers
    if (showContent) {
      filteredContent.forEach((item) => {
        const position = new window.kakao.maps.LatLng(item.lat, item.lng);
        const color = contentCategoryColors[item.contentType];
        const catIcon = contentCategoryIcons[item.contentType];

        const el = document.createElement('div');
        el.innerHTML = `<div style="
          background:${color};color:white;
          padding:3px 8px;
          border-radius:16px;font-size:10px;font-weight:600;
          white-space:nowrap;cursor:pointer;
          box-shadow:0 1px 4px rgba(0,0,0,0.2);
          transform:translateX(-50%);
          transition:all 0.2s ease;
          opacity:0.85;
        ">${item.icon || catIcon} ${item.name}</div>`;

        const overlay = new window.kakao.maps.CustomOverlay({
          position, content: el, yAnchor: 1.3,
          zIndex: 1, map: mapInstance.current,
        });
        el.addEventListener('click', () => {
          const pos = new window.kakao.maps.LatLng(item.lat, item.lng);
          mapInstance.current.panTo(pos);
        });
        overlaysRef.current.push(overlay);
      });
    }
  }, [isLoaded, filteredPlaces, filteredContent, allSchools, selectedPlace, selectedSchool, isEditing, editorMode, showSchools, showContent]);

  const handleSavePlace = useCallback(() => {
    if (!selectedPlace || !selectedPlace.name.trim()) return;
    const parsed = { ...selectedPlace, lat: parseFloat(String(selectedPlace.lat)) || 0, lng: parseFloat(String(selectedPlace.lng)) || 0 };
    const isDefault = defaultPlaces.some(p => p.id === parsed.id);
    if (isDefault) { savePlaceEdit(parsed.id, parsed as any); } else { saveCustomPlace(parsed as any); }
    setIsEditing(false);
    setRenderKey(n => n + 1);
  }, [selectedPlace]);

  const handleDeletePlace = useCallback(() => {
    if (!selectedPlace) return;
    if (!confirm(`"${selectedPlace.name}" 장소를 삭제하시겠습니까?`)) return;
    deletePlace(selectedPlace.id);
    setSelectedPlace(null);
    setIsEditing(false);
    setRenderKey(n => n + 1);
  }, [selectedPlace]);

  const handleSaveSchool = useCallback(() => {
    if (!selectedSchool || !selectedSchool.name.trim()) return;
    const parsed = { ...selectedSchool, lat: parseFloat(String(selectedSchool.lat)) || 0, lng: parseFloat(String(selectedSchool.lng)) || 0 };
    const { index, ...schoolData } = parsed;
    saveSchoolEdit(index, schoolData);
    setIsEditing(false);
    setRenderKey(n => n + 1);
  }, [selectedSchool]);

  const handleSearchSelectPlace = useCallback((place: Place) => {
    setSelectedSchool(null);
    setEditorMode('place');
    setSelectedPlace({
      id: place.id, name: place.name, description: place.description,
      address: place.address, lat: place.lat, lng: place.lng,
      category: place.category, subCategory: (place as any).subCategory,
      imageUrl: place.imageUrl, origin: place.origin,
      referenceUrl: place.referenceUrl, youtubeUrl: place.youtubeUrl, grade: place.grade,
    });
    setIsEditing(false); setShowSearch(false); setSearchTerm(''); setDetailsExpanded(false);
    if (mapInstance.current) {
      mapInstance.current.panTo(new window.kakao.maps.LatLng(place.lat, place.lng));
      if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
    }
  }, []);

  const handleSearchSelectSchool = useCallback((school: School & { index: number }) => {
    setSelectedPlace(null);
    setEditorMode('school');
    setSelectedSchool({
      index: school.index, name: school.name, address: school.address,
      lat: school.lat, lng: school.lng, phone: school.phone,
      district: school.district, website: school.website,
    });
    setIsEditing(false); setShowSearch(false); setSearchTerm(''); setDetailsExpanded(false);
    if (mapInstance.current) {
      mapInstance.current.panTo(new window.kakao.maps.LatLng(school.lat, school.lng));
      if (mapInstance.current.getLevel() > 4) mapInstance.current.setLevel(4, { animate: true });
    }
  }, []);

  useEffect(() => {
    const handler = () => setRenderKey(n => n + 1);
    window.addEventListener(PLACES_UPDATED_EVENT, handler);
    window.addEventListener(SCHOOLS_UPDATED_EVENT, handler);
    window.addEventListener(CONTENT_UPDATED_EVENT, handler);
    return () => { window.removeEventListener(PLACES_UPDATED_EVENT, handler); window.removeEventListener(SCHOOLS_UPDATED_EVENT, handler); window.removeEventListener(CONTENT_UPDATED_EVENT, handler); };
  }, []);

  const inputClass = "w-full mt-1 px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary";

  const currentItem = editorMode === 'place' ? selectedPlace : selectedSchool;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">🗺️ 지도 편집기</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{filteredPlaces.length}개 장소</span>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{allSchools.length}개 학교</span>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{allContent.length}개 콘텐츠</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowContent(!showContent)}
            className={`flex items-center gap-1 p-1.5 rounded-lg cursor-pointer transition-colors ${showContent ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            title="콘텐츠 표시/숨기기">
            <BookOpen size={14} />
          </button>
          <button onClick={() => setShowSchools(!showSchools)}
            className={`flex items-center gap-1 p-1.5 rounded-lg cursor-pointer transition-colors ${showSchools ? 'bg-[#6366f1] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            title="학교 표시/숨기기">
            <GraduationCap size={14} />
          </button>
          <button onClick={() => { setShowFilter(!showFilter); setShowSearch(false); }}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${showFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            <Filter size={14} />
          </button>
          <button onClick={() => { setShowSearch(!showSearch); setShowFilter(false); }}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${showSearch ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            <Search size={14} />
          </button>
          <button onClick={() => { setIsAdding(!isAdding); setSelectedPlace(null); setSelectedSchool(null); setIsEditing(false); }}
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
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="장소명, 학교명 또는 주소 검색..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </div>
          {(searchResults.places.length > 0 || searchResults.schools.length > 0) && (
            <div className="mt-1 max-h-48 overflow-auto rounded-lg border bg-card">
              {searchResults.places.map(p => (
                <button key={p.id} onClick={() => handleSearchSelectPlace(p)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 cursor-pointer border-b last:border-b-0 flex items-center gap-2">
                  <span>{categoryIcons[p.category]}</span>
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-[40%]">{p.address}</span>
                </button>
              ))}
              {searchResults.schools.length > 0 && searchResults.places.length > 0 && (
                <div className="px-3 py-1 text-[9px] text-muted-foreground font-bold bg-muted/30">🏫 학교</div>
              )}
              {searchResults.schools.map(s => (
                <button key={s.index} onClick={() => handleSearchSelectSchool(s)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 cursor-pointer border-b last:border-b-0 flex items-center gap-2">
                  <span>🏫</span>
                  <span className="font-medium truncate">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-[40%]">{s.district}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category filter */}
      {showFilter && (
        <div className="px-3 py-2 bg-card border-b z-10 flex-shrink-0">
          <p className="text-[9px] text-muted-foreground font-bold mb-1">📍 장소 카테고리</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveFilters([])}
              className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${activeFilters.length === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              전체 ({allPlaces.length})
            </button>
            {(Object.entries(categoryLabels) as [PlaceCategory, string][]).map(([key, label]) => {
              const count = allPlaces.filter(p => p.category === key).length;
              const active = activeFilters.includes(key);
              return (
                <button key={key} onClick={() => toggleFilter(key)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${active ? 'text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  style={active ? { backgroundColor: categoryColors[key] } : {}}>
                  {categoryIcons[key]} {label} ({count})
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-muted-foreground font-bold mt-2 mb-1">📚 콘텐츠 카테고리</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setActiveContentFilters([])}
              className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${activeContentFilters.length === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              전체 ({allContent.length})
            </button>
            {(Object.entries(contentCategoryLabels) as [ContentCategory, string][]).filter(([key]) => key !== 'place').map(([key, label]) => {
              const count = allContent.filter(c => c.contentType === key).length;
              const active = activeContentFilters.includes(key);
              return (
                <button key={key} onClick={() => toggleContentFilter(key)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${active ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  style={active ? { backgroundColor: contentCategoryColors[key] } : {}}>
                  {contentCategoryIcons[key]} {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="px-3 py-2 bg-primary/10 border-b z-10 flex-shrink-0">
          <p className="text-xs text-primary font-medium text-center">📍 지도를 클릭하여 새 장소를 추가하세요</p>
        </div>
      )}

      {/* Map + Side panel layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <div ref={mapRef} className="flex-1 h-full" />

        {/* Side panel - place or school details / editor */}
        {currentItem && (
          <div className="w-80 md:w-96 h-full bg-card border-l overflow-auto flex-shrink-0 flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30 flex-shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm">{editorMode === 'place' && selectedPlace ? categoryIcons[selectedPlace.category] : '🏫'}</span>
                <span className="text-xs font-bold text-foreground truncate">
                  {editorMode === 'place' ? (selectedPlace?.name || '새 장소') : (selectedSchool?.name || '')}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isEditing && (
                  <button onClick={() => { setIsEditing(true); setDetailsExpanded(true); }}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-primary text-primary-foreground cursor-pointer hover:opacity-90">수정</button>
                )}
                {editorMode === 'place' && (
                  <button onClick={handleDeletePlace}
                    className="p-1 rounded bg-destructive/10 text-destructive cursor-pointer hover:bg-destructive/20"><Trash2 size={12} /></button>
                )}
                <button onClick={() => { setSelectedPlace(null); setSelectedSchool(null); setIsEditing(false); }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"><X size={14} /></button>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {editorMode === 'place' && selectedPlace && (
                !isEditing ? (
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
                      <div><p className="text-[10px] font-semibold text-muted-foreground">위도</p><p className="text-xs text-foreground font-mono">{selectedPlace.lat}</p></div>
                      <div><p className="text-[10px] font-semibold text-muted-foreground">경도</p><p className="text-xs text-foreground font-mono">{selectedPlace.lng}</p></div>
                    </div>
                    <button onClick={() => setDetailsExpanded(!detailsExpanded)}
                      className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer py-1">
                      {detailsExpanded ? <><ChevronUp size={12} /> 접기</> : <><ChevronDown size={12} /> 더보기</>}
                    </button>
                    {detailsExpanded && (
                      <>
                        {selectedPlace.origin && <div><p className="text-[10px] font-semibold text-muted-foreground">유래</p><p className="text-xs text-foreground leading-relaxed">{selectedPlace.origin}</p></div>}
                        {selectedPlace.referenceUrl && <div><p className="text-[10px] font-semibold text-muted-foreground">참고 링크</p><a href={selectedPlace.referenceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{selectedPlace.referenceUrl}</a></div>}
                        {selectedPlace.youtubeUrl && <div><p className="text-[10px] font-semibold text-muted-foreground">유튜브</p><a href={selectedPlace.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{selectedPlace.youtubeUrl}</a></div>}
                        {selectedPlace.imageUrl && <img src={selectedPlace.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg" />}
                        <div><p className="text-[10px] font-semibold text-muted-foreground">학년</p><p className="text-xs text-foreground">{selectedPlace.grade === 'all' ? '전체' : `${selectedPlace.grade}학년`}</p></div>
                        <div><p className="text-[10px] font-semibold text-muted-foreground">ID</p><p className="text-[10px] text-muted-foreground font-mono">{selectedPlace.id}</p></div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div><label className="text-[10px] font-semibold text-foreground">이름 *</label><input value={selectedPlace.name} onChange={e => setSelectedPlace({ ...selectedPlace, name: e.target.value })} className={inputClass} placeholder="장소명 입력" /></div>
                    <div><label className="text-[10px] font-semibold text-foreground">설명</label><textarea value={selectedPlace.description} onChange={e => setSelectedPlace({ ...selectedPlace, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} /></div>
                    <div>
                      <label className="text-[10px] font-semibold text-foreground">카테고리</label>
                      <select value={selectedPlace.category} onChange={e => setSelectedPlace({ ...selectedPlace, category: e.target.value as PlaceCategory })} className={inputClass}>
                        {(Object.entries(categoryLabels) as [PlaceCategory, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                      </select>
                    </div>
                    {selectedPlace.category === 'public' && (
                      <div>
                        <label className="text-[10px] font-semibold text-foreground">세부 카테고리</label>
                        <select value={selectedPlace.subCategory || ''} onChange={e => setSelectedPlace({ ...selectedPlace, subCategory: (e.target.value || undefined) as PublicSubCategory | undefined })} className={inputClass}>
                          <option value="">선택안함</option>
                          {(Object.entries(publicSubCategoryLabels) as [PublicSubCategory, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                        </select>
                      </div>
                    )}
                    <div><label className="text-[10px] font-semibold text-foreground">주소</label><input value={selectedPlace.address} onChange={e => setSelectedPlace({ ...selectedPlace, address: e.target.value })} className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-[10px] font-semibold text-foreground">위도</label><input type="text" inputMode="decimal" value={selectedPlace.lat} onChange={e => setSelectedPlace({ ...selectedPlace, lat: e.target.value as any })} className={inputClass} /></div>
                      <div><label className="text-[10px] font-semibold text-foreground">경도</label><input type="text" inputMode="decimal" value={selectedPlace.lng} onChange={e => setSelectedPlace({ ...selectedPlace, lng: e.target.value as any })} className={inputClass} /></div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-foreground">학년</label>
                      <select value={String(selectedPlace.grade || 'all')} onChange={e => setSelectedPlace({ ...selectedPlace, grade: e.target.value === 'all' ? 'all' : Number(e.target.value) as 3 | 4 })} className={inputClass}>
                        <option value="all">전체</option><option value="3">3학년</option><option value="4">4학년</option>
                      </select>
                    </div>
                    <div><label className="text-[10px] font-semibold text-foreground">유래</label><textarea value={selectedPlace.origin || ''} onChange={e => setSelectedPlace({ ...selectedPlace, origin: e.target.value })} className={`${inputClass} resize-none`} rows={2} /></div>
                    <div><label className="text-[10px] font-semibold text-foreground">참고 링크</label><input value={selectedPlace.referenceUrl || ''} onChange={e => setSelectedPlace({ ...selectedPlace, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." /></div>
                    <div><label className="text-[10px] font-semibold text-foreground flex items-center gap-1"><Youtube size={10} className="text-destructive" /> 유튜브</label><input value={selectedPlace.youtubeUrl || ''} onChange={e => setSelectedPlace({ ...selectedPlace, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://..." /></div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSavePlace} disabled={!selectedPlace.name.trim()}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90 disabled:opacity-50">
                        <Save size={12} /> 저장
                      </button>
                      <button onClick={() => setIsEditing(false)}
                        className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold cursor-pointer hover:bg-muted/80">취소</button>
                    </div>
                  </>
                )
              )}

              {editorMode === 'school' && selectedSchool && (
                !isEditing ? (
                  <>
                    <div><p className="text-[10px] font-semibold text-muted-foreground">학교명</p><p className="text-xs text-foreground font-medium">{selectedSchool.name}</p></div>
                    <div><p className="text-[10px] font-semibold text-muted-foreground">주소</p><p className="text-xs text-foreground">{selectedSchool.address || '-'}</p></div>
                    <div><p className="text-[10px] font-semibold text-muted-foreground">학군</p><p className="text-xs text-foreground">{selectedSchool.district || '-'}</p></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-[10px] font-semibold text-muted-foreground">위도</p><p className="text-xs text-foreground font-mono">{selectedSchool.lat}</p></div>
                      <div><p className="text-[10px] font-semibold text-muted-foreground">경도</p><p className="text-xs text-foreground font-mono">{selectedSchool.lng}</p></div>
                    </div>
                    {selectedSchool.phone && <div><p className="text-[10px] font-semibold text-muted-foreground">전화</p><p className="text-xs text-foreground">{selectedSchool.phone}</p></div>}
                    {selectedSchool.website && <div><p className="text-[10px] font-semibold text-muted-foreground">웹사이트</p><a href={selectedSchool.website} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{selectedSchool.website}</a></div>}
                  </>
                ) : (
                  <>
                    <div><label className="text-[10px] font-semibold text-foreground">학교명 *</label><input value={selectedSchool.name} onChange={e => setSelectedSchool({ ...selectedSchool, name: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold text-foreground">주소</label><input value={selectedSchool.address} onChange={e => setSelectedSchool({ ...selectedSchool, address: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold text-foreground">학군</label><input value={selectedSchool.district} onChange={e => setSelectedSchool({ ...selectedSchool, district: e.target.value })} className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-[10px] font-semibold text-foreground">위도</label><input type="text" inputMode="decimal" value={selectedSchool.lat} onChange={e => setSelectedSchool({ ...selectedSchool, lat: e.target.value as any })} className={inputClass} /></div>
                      <div><label className="text-[10px] font-semibold text-foreground">경도</label><input type="text" inputMode="decimal" value={selectedSchool.lng} onChange={e => setSelectedSchool({ ...selectedSchool, lng: e.target.value as any })} className={inputClass} /></div>
                    </div>
                    <div><label className="text-[10px] font-semibold text-foreground">전화</label><input value={selectedSchool.phone || ''} onChange={e => setSelectedSchool({ ...selectedSchool, phone: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-[10px] font-semibold text-foreground">웹사이트</label><input value={selectedSchool.website || ''} onChange={e => setSelectedSchool({ ...selectedSchool, website: e.target.value })} className={inputClass} placeholder="https://..." /></div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveSchool} disabled={!selectedSchool.name.trim()}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90 disabled:opacity-50">
                        <Save size={12} /> 저장
                      </button>
                      <button onClick={() => setIsEditing(false)}
                        className="px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold cursor-pointer hover:bg-muted/80">취소</button>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMapEditor;
