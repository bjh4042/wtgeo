import { useState, useEffect, useMemo } from 'react';
import { Settings, X, Send, Trash2, Plus, Save, Edit3, ChevronDown, ChevronUp, Youtube, BarChart3, Search, Filter } from 'lucide-react';
import { places as defaultPlaces, Place, PlaceCategory, categoryLabels } from '@/data/places';
import { stories, placenames, heritages, pastPresent, natureContent, MapContent, ContentCategory, contentCategoryLabels } from '@/data/content';
import { getHourlyStats, getDailyStats, getTodayVisitors, getTotalVisitors } from '@/data/visitorStats';
import { schools, School } from '@/data/schools';
import { getGyeongnamCities, saveGyeongnamEdit, GyeongnamCity } from '@/data/gyeongnam';
import { SCHOOLS_UPDATED_EVENT, getMergedSchools } from '@/data/dataManager';

const ADMIN_PASSWORD = '4042';
const NOTICE_KEY = 'geoje-explorer-notice';
const VISITOR_KEY = 'geoje-explorer-visitors';
const CUSTOM_PLACES_KEY = 'geoje-custom-places';
const CUSTOM_CONTENT_KEY = 'geoje-custom-content';
const PLACE_EDITS_KEY = 'geoje-place-edits';
const CONTENT_EDITS_KEY = 'geoje-content-edits';
const SITE_INFO_KEY = 'geoje-site-info';
const SCHOOL_EDITS_KEY = 'geoje-school-edits';

export interface SiteInfo {
  serviceName: string;
  version: string;
  devTool: string;
  mapApi: string;
  dataSource: string;
  siteNotice: string;
  devName: string;
  devTitle1: string;
  devTitle2: string;
  devTitle3: string;
  devEmail: string;
}

const DEFAULT_SITE_INFO: SiteInfo = {
  serviceName: '거제탐험대',
  version: '1.0',
  devTool: 'Lovable',
  mapApi: 'Kakao MAP',
  dataSource: '공식 웹페이지',
  siteNotice: '알림: 본 웹서비스는 타이핑 및 조사 학습이 제한적인 학생들을 위하여 학생들의 개인정보를 수집하지 않고, 성취기준과 별도로 우리 지역 거제를 쉽고 재미있게 탐험하기 위해 제작되었습니다. 데이터 수집 및 제작 시점에 따라 실제 장소의 내용이 다소 상이할 수 있으므로 사실 정보는 검색 엔진을 적극 활용하시길 바랍니다.',
  devName: '수박쌤',
  devTitle1: '경남 초등학교 교사',
  devTitle2: '참쌤스쿨 크루',
  devTitle3: '교사 크리에이터 협회 회원',
  devEmail: 'bjh4042@naver.com',
};

export function getSiteInfo(): SiteInfo {
  try {
    const saved = localStorage.getItem(SITE_INFO_KEY);
    if (saved) return { ...DEFAULT_SITE_INFO, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_SITE_INFO;
}

export function getNotice(): string | null {
  return localStorage.getItem(NOTICE_KEY);
}

export function getVisitorCount(): number {
  return parseInt(localStorage.getItem(VISITOR_KEY) || '0', 10);
}

export function incrementVisitorCount(): number {
  const sessionKey = 'geoje-explorer-visited';
  if (sessionStorage.getItem(sessionKey)) return getVisitorCount();
  sessionStorage.setItem(sessionKey, 'true');
  const count = getVisitorCount() + 1;
  localStorage.setItem(VISITOR_KEY, String(count));
  return count;
}

type AdminTab = 'notice' | 'places' | 'content' | 'schools' | 'gyeongnam' | 'info';

interface EditablePlace {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  imageUrl?: string;
  origin?: string;
  referenceUrl?: string;
  youtubeUrl?: string;
}

interface EditableContent {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  contentType: ContentCategory;
  icon: string;
  imageUrl?: string;
  source?: string;
  referenceUrl?: string;
  youtubeUrl?: string;
}

interface EditableSchool {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  district: string;
  website?: string;
}

const AdminPanel = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [currentNotice, setCurrentNotice] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('notice');
  const [editingPlace, setEditingPlace] = useState<EditablePlace | null>(null);
  const [editingContent, setEditingContent] = useState<EditableContent | null>(null);
  const [editingSchool, setEditingSchool] = useState<EditableSchool | null>(null);
  const [editingSchoolIdx, setEditingSchoolIdx] = useState<number | null>(null);
  const [editingCity, setEditingCity] = useState<GyeongnamCity | null>(null);
  const [placeEdits, setPlaceEdits] = useState<Record<string, Partial<EditablePlace>>>({});
  const [contentEdits, setContentEdits] = useState<Record<string, Partial<EditableContent>>>({});
  const [customPlaces, setCustomPlaces] = useState<EditablePlace[]>([]);
  const [customContent, setCustomContent] = useState<EditableContent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<PlaceCategory | 'all'>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentCategory | 'all'>('all');
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [editingSiteInfo, setEditingSiteInfo] = useState(false);
  const [schoolEdits, setSchoolEdits] = useState<Record<number, Partial<EditableSchool>>>({});
  const visitorCount = getVisitorCount();

  useEffect(() => {
    setCurrentNotice(getNotice());
    setSiteInfo(getSiteInfo());
    try {
      const cp = localStorage.getItem(CUSTOM_PLACES_KEY);
      if (cp) setCustomPlaces(JSON.parse(cp));
      const cc = localStorage.getItem(CUSTOM_CONTENT_KEY);
      if (cc) setCustomContent(JSON.parse(cc));
      const pe = localStorage.getItem(PLACE_EDITS_KEY);
      if (pe) setPlaceEdits(JSON.parse(pe));
      const ce = localStorage.getItem(CONTENT_EDITS_KEY);
      if (ce) setContentEdits(JSON.parse(ce));
      const se = localStorage.getItem(SCHOOL_EDITS_KEY);
      if (se) setSchoolEdits(JSON.parse(se));
    } catch {}
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setIsAdmin(true); setError(false); }
    else { setError(true); }
  };

  const handleSaveNotice = () => {
    if (!notice.trim()) return;
    localStorage.setItem(NOTICE_KEY, notice.trim());
    setCurrentNotice(notice.trim());
    setNotice('');
  };

  const handleDeleteNotice = () => {
    localStorage.removeItem(NOTICE_KEY);
    setCurrentNotice(null);
  };

  const handleSavePlace = () => {
    if (!editingPlace) return;
    const isDefault = defaultPlaces.some(p => p.id === editingPlace.id);
    if (isDefault) {
      const updated = { ...placeEdits, [editingPlace.id]: editingPlace };
      setPlaceEdits(updated);
      localStorage.setItem(PLACE_EDITS_KEY, JSON.stringify(updated));
    } else {
      const updated = [...customPlaces];
      const idx = updated.findIndex(p => p.id === editingPlace.id);
      if (idx >= 0) updated[idx] = editingPlace;
      else updated.push(editingPlace);
      setCustomPlaces(updated);
      localStorage.setItem(CUSTOM_PLACES_KEY, JSON.stringify(updated));
    }
    setEditingPlace(null);
  };

  const handleSaveContent = () => {
    if (!editingContent) return;
    const allDefault = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent];
    const isDefault = allDefault.some(c => c.id === editingContent.id);
    if (isDefault) {
      const updated = { ...contentEdits, [editingContent.id]: editingContent };
      setContentEdits(updated);
      localStorage.setItem(CONTENT_EDITS_KEY, JSON.stringify(updated));
    } else {
      const updated = [...customContent];
      const idx = updated.findIndex(c => c.id === editingContent.id);
      if (idx >= 0) updated[idx] = editingContent;
      else updated.push(editingContent);
      setCustomContent(updated);
      localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(updated));
    }
    setEditingContent(null);
  };

  const handleSaveSchool = () => {
    if (!editingSchool || editingSchoolIdx === null) return;
    const updated = { ...schoolEdits, [editingSchoolIdx]: editingSchool };
    setSchoolEdits(updated);
    localStorage.setItem(SCHOOL_EDITS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(SCHOOLS_UPDATED_EVENT));
    setEditingSchool(null);
    setEditingSchoolIdx(null);
  };

  const handleSaveCity = () => {
    if (!editingCity) return;
    saveGyeongnamEdit(editingCity.id, editingCity);
    setEditingCity(null);
  };

  const handleDeleteCustomPlace = (id: string) => {
    const updated = customPlaces.filter(p => p.id !== id);
    setCustomPlaces(updated);
    localStorage.setItem(CUSTOM_PLACES_KEY, JSON.stringify(updated));
  };

  const handleDeleteCustomContent = (id: string) => {
    const updated = customContent.filter(c => c.id !== id);
    setCustomContent(updated);
    localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'place' | 'content') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'place' && editingPlace) {
        setEditingPlace({ ...editingPlace, imageUrl: reader.result as string });
      } else if (type === 'content' && editingContent) {
        setEditingContent({ ...editingContent, imageUrl: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSiteInfo = () => {
    localStorage.setItem(SITE_INFO_KEY, JSON.stringify(siteInfo));
    setEditingSiteInfo(false);
  };

  // Filtered places
  const allPlaces = [...defaultPlaces, ...customPlaces];
  const filteredPlaces = useMemo(() => {
    let result = allPlaces;
    if (placeCategoryFilter !== 'all') {
      result = result.filter(p => p.category === placeCategoryFilter);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.includes(searchTerm) || p.address?.includes(searchTerm));
    }
    return result;
  }, [allPlaces, placeCategoryFilter, searchTerm]);

  // Filtered content
  const allContentItems = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent, ...customContent];
  const filteredContent = useMemo(() => {
    let result = allContentItems;
    if (contentTypeFilter !== 'all') {
      result = result.filter(c => c.contentType === contentTypeFilter);
    }
    if (searchTerm) {
      result = result.filter(c => c.name.includes(searchTerm) || c.description.includes(searchTerm));
    }
    return result;
  }, [allContentItems, contentTypeFilter, searchTerm]);

  // Filtered schools
  const mergedSchools = useMemo(() => getMergedSchools(), [schoolEdits]);
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return mergedSchools;
    return mergedSchools.filter(s => s.name.includes(searchTerm) || s.district.includes(searchTerm) || s.address.includes(searchTerm));
  }, [mergedSchools, searchTerm]);

  // Filtered cities
  const gyeongnamCitiesList = getGyeongnamCities();
  const filteredCities = useMemo(() => {
    if (!searchTerm) return gyeongnamCitiesList;
    return gyeongnamCitiesList.filter(c => c.name.includes(searchTerm) || c.mascot.includes(searchTerm));
  }, [gyeongnamCitiesList, searchTerm]);

  if (!showLogin && !isAdmin) {
    return (
      <button onClick={() => setShowLogin(true)}
        className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer">
        <Settings size={12} /> 관리자
      </button>
    );
  }

  if (showLogin && !isAdmin) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => { setShowLogin(false); setError(false); setPassword(''); }}>
        <div className="bg-card rounded-2xl p-6 max-w-sm mx-4 shadow-2xl w-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">🔐 관리자 로그인</h3>
            <button onClick={() => { setShowLogin(false); setError(false); setPassword(''); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
          </div>
          <div className="space-y-3">
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="비밀번호 입력"
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            {error && <p className="text-xs text-destructive">비밀번호가 올바르지 않습니다.</p>}
            <button onClick={handleLogin} className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">로그인</button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  const tabConfig: { key: AdminTab; label: string }[] = [
    { key: 'notice', label: '📢 공지' },
    { key: 'places', label: '📍 장소' },
    { key: 'content', label: '📖 콘텐츠' },
    { key: 'schools', label: '🏫 학교' },
    { key: 'gyeongnam', label: '🗺️ 경남' },
    { key: 'info', label: 'ℹ️ 정보' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setIsAdmin(false)}>
      <div className="bg-card rounded-2xl p-4 md:p-5 max-w-lg mx-2 md:mx-4 shadow-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-bold text-foreground">⚙️ 관리자 패널</h3>
          <button onClick={() => setIsAdmin(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto no-scrollbar">
          {tabConfig.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearchTerm(''); setEditingSiteInfo(false); setPlaceCategoryFilter('all'); setContentTypeFilter('all'); }}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notice Tab */}
        {activeTab === 'notice' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground">총 방문자</p>
                <p className="text-base font-bold text-primary">{visitorCount.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground">오늘</p>
                <p className="text-base font-bold text-foreground">{getTodayVisitors()}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-[10px] text-muted-foreground">통계 합산</p>
                <p className="text-base font-bold text-foreground">{getTotalVisitors()}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1"><BarChart3 size={13} /> 오늘 시간대별</p>
              <div className="flex items-end gap-px h-16">
                {getHourlyStats().map((s, i) => {
                  const maxCount = Math.max(...getHourlyStats().map(h => h.count), 1);
                  const height = s.count > 0 ? Math.max((s.count / maxCount) * 100, 8) : 2;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`${s.hour}: ${s.count}명`}>
                      <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: s.count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }} />
                      {i % 6 === 0 && <span className="text-[7px] text-muted-foreground">{i}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            {currentNotice && (
              <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">📢 현재 공지</p>
                    <p className="text-xs text-muted-foreground">{currentNotice}</p>
                  </div>
                  <button onClick={handleDeleteNotice} className="text-destructive hover:text-destructive/80 cursor-pointer flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
            <div>
              <textarea value={notice} onChange={e => setNotice(e.target.value)} placeholder="공지사항을 입력하세요..."
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
              <button onClick={handleSaveNotice} disabled={!notice.trim()}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={14} /> 공지 등록
              </button>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && !editingPlace && (
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="장소 검색..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            {/* Category filter chips */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => setPlaceCategoryFilter('all')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer ${placeCategoryFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                전체 ({allPlaces.length})
              </button>
              {(Object.keys(categoryLabels) as PlaceCategory[]).map(cat => {
                const count = allPlaces.filter(p => p.category === cat).length;
                return (
                  <button key={cat} onClick={() => setPlaceCategoryFilter(cat)}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer ${placeCategoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {categoryLabels[cat].split(' ')[0]} {count}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setEditingPlace({ id: `custom-p-${Date.now()}`, name: '', description: '', address: '', lat: 34.88, lng: 128.62, category: 'tourism' })}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5">
              <Plus size={14} /> 새 장소 추가
            </button>
            <div className="max-h-[45vh] overflow-auto space-y-1">
              <p className="text-[10px] text-muted-foreground px-1">{filteredPlaces.length}개 항목</p>
              {filteredPlaces.map(p => (
                <div key={p.id} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{categoryLabels[p.category]?.split(' ')[0]} · {p.address}</p>
                  </div>
                  <button onClick={() => setEditingPlace({ id: p.id, name: p.name, description: p.description, address: p.address, lat: p.lat, lng: p.lng, category: p.category, imageUrl: p.imageUrl, origin: p.origin, referenceUrl: p.referenceUrl, youtubeUrl: p.youtubeUrl })}
                    className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Place Editor */}
        {activeTab === 'places' && editingPlace && (
          <div className="space-y-2.5">
            <button onClick={() => setEditingPlace(null)} className="text-xs text-primary cursor-pointer">← 목록으로</button>
            <div>
              <label className="text-[10px] font-semibold text-foreground">이름</label>
              <input value={editingPlace.name} onChange={e => setEditingPlace({ ...editingPlace, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">설명</label>
              <textarea value={editingPlace.description} onChange={e => setEditingPlace({ ...editingPlace, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">카테고리</label>
              <select value={editingPlace.category} onChange={e => setEditingPlace({ ...editingPlace, category: e.target.value as PlaceCategory })} className={inputClass}>
                {(Object.entries(categoryLabels) as [PlaceCategory, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">주소</label>
              <input value={editingPlace.address} onChange={e => setEditingPlace({ ...editingPlace, address: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground">위도</label>
                <input type="number" step="0.000001" value={editingPlace.lat} onChange={e => setEditingPlace({ ...editingPlace, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground">경도</label>
                <input type="number" step="0.000001" value={editingPlace.lng} onChange={e => setEditingPlace({ ...editingPlace, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">유래</label>
              <textarea value={editingPlace.origin || ''} onChange={e => setEditingPlace({ ...editingPlace, origin: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">참고 링크</label>
              <input value={editingPlace.referenceUrl || ''} onChange={e => setEditingPlace({ ...editingPlace, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground flex items-center gap-1"><Youtube size={12} className="text-red-500" /> 유튜브</label>
              <input value={editingPlace.youtubeUrl || ''} onChange={e => setEditingPlace({ ...editingPlace, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">사진</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'place')}
                className="w-full mt-1 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer" />
              {editingPlace.imageUrl && <img src={editingPlace.imageUrl} alt="" className="w-full h-20 object-cover rounded-lg mt-1" />}
            </div>
            <button onClick={handleSavePlace} disabled={!editingPlace.name.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && !editingContent && (
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="콘텐츠 검색..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => setContentTypeFilter('all')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer ${contentTypeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                전체 ({allContentItems.length})
              </button>
              {(['story', 'placename', 'heritage', 'pastpresent', 'nature'] as ContentCategory[]).map(cat => {
                const count = allContentItems.filter(c => c.contentType === cat).length;
                const label = contentCategoryLabels[cat] || cat;
                return (
                  <button key={cat} onClick={() => setContentTypeFilter(cat)}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer ${contentTypeFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {label} {count}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setEditingContent({ id: `custom-c-${Date.now()}`, name: '', description: '', lat: 34.88, lng: 128.62, contentType: 'story', icon: '📖' })}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5">
              <Plus size={14} /> 새 콘텐츠 추가
            </button>
            <div className="max-h-[45vh] overflow-auto space-y-1">
              <p className="text-[10px] text-muted-foreground px-1">{filteredContent.length}개 항목</p>
              {filteredContent.map(c => (
                <div key={c.id} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{c.icon} {c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{contentCategoryLabels[c.contentType] || c.contentType}</p>
                  </div>
                  <button onClick={() => setEditingContent({ id: c.id, name: c.name, description: c.description, lat: c.lat, lng: c.lng, contentType: c.contentType, icon: c.icon, imageUrl: c.imageUrl, source: c.source, referenceUrl: c.referenceUrl, youtubeUrl: c.youtubeUrl })}
                    className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Editor */}
        {activeTab === 'content' && editingContent && (
          <div className="space-y-2.5">
            <button onClick={() => setEditingContent(null)} className="text-xs text-primary cursor-pointer">← 목록으로</button>
            <div>
              <label className="text-[10px] font-semibold text-foreground">이름</label>
              <input value={editingContent.name} onChange={e => setEditingContent({ ...editingContent, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">설명</label>
              <textarea value={editingContent.description} onChange={e => setEditingContent({ ...editingContent, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">콘텐츠 유형</label>
              <select value={editingContent.contentType} onChange={e => setEditingContent({ ...editingContent, contentType: e.target.value as ContentCategory })} className={inputClass}>
                <option value="story">옛이야기</option><option value="placename">지명</option><option value="heritage">국가유산</option>
                <option value="pastpresent">옛날과 오늘날</option><option value="nature">자연</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground">위도</label>
                <input type="number" step="0.000001" value={editingContent.lat} onChange={e => setEditingContent({ ...editingContent, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground">경도</label>
                <input type="number" step="0.000001" value={editingContent.lng} onChange={e => setEditingContent({ ...editingContent, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">아이콘</label>
              <input value={editingContent.icon} onChange={e => setEditingContent({ ...editingContent, icon: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">출처</label>
              <input value={editingContent.source || ''} onChange={e => setEditingContent({ ...editingContent, source: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">참고 링크</label>
              <input value={editingContent.referenceUrl || ''} onChange={e => setEditingContent({ ...editingContent, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground flex items-center gap-1"><Youtube size={12} className="text-red-500" /> 유튜브</label>
              <input value={editingContent.youtubeUrl || ''} onChange={e => setEditingContent({ ...editingContent, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">사진</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'content')}
                className="w-full mt-1 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer" />
              {editingContent.imageUrl && <img src={editingContent.imageUrl} alt="" className="w-full h-20 object-cover rounded-lg mt-1" />}
            </div>
            <button onClick={handleSaveContent} disabled={!editingContent.name.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && !editingSchool && (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="학교 검색 (이름, 지역)..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="max-h-[50vh] overflow-auto space-y-1">
              <p className="text-[10px] text-muted-foreground px-1">{filteredSchools.length}개 학교</p>
              {filteredSchools.map((s, idx) => {
                const origIdx = schools.findIndex((school) => school.name === s.name);
                const edited = origIdx >= 0 ? schoolEdits[origIdx] : undefined;
                const display = edited ? { ...s, ...edited } : s;
                return (
                  <div key={origIdx} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        🏫 {display.name}
                        {edited && <span className="text-[9px] text-primary ml-1">(수정됨)</span>}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{display.district} · {display.lat.toFixed(4)}, {display.lng.toFixed(4)}</p>
                    </div>
                    <button onClick={() => { setEditingSchool({ ...display }); setEditingSchoolIdx(origIdx); }}
                      className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={12} /></button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* School Editor */}
        {activeTab === 'schools' && editingSchool && (
          <div className="space-y-2.5">
            <button onClick={() => { setEditingSchool(null); setEditingSchoolIdx(null); }} className="text-xs text-primary cursor-pointer">← 목록으로</button>
            <div>
              <label className="text-[10px] font-semibold text-foreground">학교명</label>
              <input value={editingSchool.name} onChange={e => setEditingSchool({ ...editingSchool, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">주소</label>
              <input value={editingSchool.address} onChange={e => setEditingSchool({ ...editingSchool, address: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">행정구역 (동/면)</label>
              <input value={editingSchool.district} onChange={e => setEditingSchool({ ...editingSchool, district: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground">위도</label>
                <input type="number" step="0.000001" value={editingSchool.lat} onChange={e => setEditingSchool({ ...editingSchool, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground">경도</label>
                <input type="number" step="0.000001" value={editingSchool.lng} onChange={e => setEditingSchool({ ...editingSchool, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">전화번호</label>
              <input value={editingSchool.phone || ''} onChange={e => setEditingSchool({ ...editingSchool, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">웹사이트</label>
              <input value={editingSchool.website || ''} onChange={e => setEditingSchool({ ...editingSchool, website: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <button onClick={handleSaveSchool}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Gyeongnam Tab */}
        {activeTab === 'gyeongnam' && !editingCity && (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="시·군 검색..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="max-h-[50vh] overflow-auto space-y-1">
              <p className="text-[10px] text-muted-foreground px-1">{filteredCities.length}개 시·군</p>
              {filteredCities.map(c => (
                <div key={c.id} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex items-center gap-2">
                    {c.mascotImageUrl ? (
                      <img src={c.mascotImageUrl} alt={c.mascot} className="w-8 h-8 object-contain flex-shrink-0" />
                    ) : (
                      <span className="text-lg flex-shrink-0">{c.mascotEmoji}</span>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{c.mascot} · 인구 {c.population.toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingCity({ ...c })}
                    className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gyeongnam City Editor */}
        {activeTab === 'gyeongnam' && editingCity && (
          <div className="space-y-2.5">
            <button onClick={() => setEditingCity(null)} className="text-xs text-primary cursor-pointer">← 목록으로</button>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <span className="text-2xl">{editingCity.mascotEmoji}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{editingCity.name} ({editingCity.nameHanja})</p>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">마스코트 이름</label>
              <input value={editingCity.mascot} onChange={e => setEditingCity({ ...editingCity, mascot: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">마스코트 이모지</label>
              <input value={editingCity.mascotEmoji} onChange={e => setEditingCity({ ...editingCity, mascotEmoji: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">마스코트 이미지 URL</label>
              <input value={editingCity.mascotImageUrl || ''} onChange={e => setEditingCity({ ...editingCity, mascotImageUrl: e.target.value })} className={inputClass} placeholder="https://..." />
              {editingCity.mascotImageUrl && <img src={editingCity.mascotImageUrl} alt="" className="w-16 h-16 object-contain mt-1" />}
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">로고 URL</label>
              <input value={editingCity.logoUrl || ''} onChange={e => setEditingCity({ ...editingCity, logoUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground">인구</label>
                <input type="number" value={editingCity.population} onChange={e => setEditingCity({ ...editingCity, population: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground">면적 (km²)</label>
                <input type="number" step="0.1" value={editingCity.area} onChange={e => setEditingCity({ ...editingCity, area: parseFloat(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-foreground">위도</label>
                <input type="number" step="0.000001" value={editingCity.lat} onChange={e => setEditingCity({ ...editingCity, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground">경도</label>
                <input type="number" step="0.000001" value={editingCity.lng} onChange={e => setEditingCity({ ...editingCity, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">지명 유래</label>
              <textarea value={editingCity.nameOrigin} onChange={e => setEditingCity({ ...editingCity, nameOrigin: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">공식 사이트</label>
              <input value={editingCity.officialSite} onChange={e => setEditingCity({ ...editingCity, officialSite: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-foreground">대표 명소 (쉼표로 구분)</label>
              <input value={editingCity.highlights.join(', ')} onChange={e => setEditingCity({ ...editingCity, highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={inputClass} />
            </div>
            <button onClick={handleSaveCity}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && !editingSiteInfo && (
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
              {[
                ['서비스명', siteInfo.serviceName], ['버전', siteInfo.version],
                ['개발 도구', siteInfo.devTool], ['지도 API', siteInfo.mapApi],
                ['개발자', siteInfo.devName], ['연락처', siteInfo.devEmail],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="font-semibold">{k}:</span><span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setEditingSiteInfo(true)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Edit3 size={14} /> 수정
            </button>
          </div>
        )}

        {/* Info Editor */}
        {activeTab === 'info' && editingSiteInfo && (
          <div className="space-y-2.5">
            <button onClick={() => setEditingSiteInfo(false)} className="text-xs text-primary cursor-pointer">← 돌아가기</button>
            {[
              { label: '서비스명', key: 'serviceName' as keyof SiteInfo },
              { label: '버전', key: 'version' as keyof SiteInfo },
              { label: '개발 도구', key: 'devTool' as keyof SiteInfo },
              { label: '지도 API', key: 'mapApi' as keyof SiteInfo },
              { label: '자료 출처', key: 'dataSource' as keyof SiteInfo },
              { label: '개발자', key: 'devName' as keyof SiteInfo },
              { label: '소속 1', key: 'devTitle1' as keyof SiteInfo },
              { label: '소속 2', key: 'devTitle2' as keyof SiteInfo },
              { label: '소속 3', key: 'devTitle3' as keyof SiteInfo },
              { label: '이메일', key: 'devEmail' as keyof SiteInfo },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-[10px] font-semibold text-foreground">{label}</label>
                <input value={siteInfo[key]} onChange={e => setSiteInfo({ ...siteInfo, [key]: e.target.value })} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-semibold text-foreground">안내문</label>
              <textarea value={siteInfo.siteNotice} onChange={e => setSiteInfo({ ...siteInfo, siteNotice: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
            </div>
            <button onClick={handleSaveSiteInfo}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Save size={14} /> 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
