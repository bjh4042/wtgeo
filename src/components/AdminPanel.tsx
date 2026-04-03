import { useState, useEffect } from 'react';
import { Settings, X, Send, Trash2, Plus, Save, Edit3, ChevronDown, ChevronUp, Youtube } from 'lucide-react';
import { places as defaultPlaces, Place, PlaceCategory } from '@/data/places';
import { stories, placenames, heritages, pastPresent, natureContent, MapContent, ContentCategory } from '@/data/content';

const ADMIN_PASSWORD = '4042';
const NOTICE_KEY = 'geoje-explorer-notice';
const VISITOR_KEY = 'geoje-explorer-visitors';
const CUSTOM_PLACES_KEY = 'geoje-custom-places';
const CUSTOM_CONTENT_KEY = 'geoje-custom-content';
const PLACE_EDITS_KEY = 'geoje-place-edits';
const CONTENT_EDITS_KEY = 'geoje-content-edits';
const SITE_INFO_KEY = 'geoje-site-info';

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

type AdminTab = 'notice' | 'places' | 'content' | 'info';

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
  const [placeEdits, setPlaceEdits] = useState<Record<string, Partial<EditablePlace>>>({});
  const [contentEdits, setContentEdits] = useState<Record<string, Partial<EditableContent>>>({});
  const [customPlaces, setCustomPlaces] = useState<EditablePlace[]>([]);
  const [customContent, setCustomContent] = useState<EditableContent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [editingSiteInfo, setEditingSiteInfo] = useState(false);
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

  const allPlaces = [...defaultPlaces, ...customPlaces];
  const filteredPlaces = searchTerm
    ? allPlaces.filter(p => p.name.includes(searchTerm) || p.address?.includes(searchTerm))
    : allPlaces;

  const allContentItems = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent, ...customContent];
  const filteredContent = searchTerm
    ? allContentItems.filter(c => c.name.includes(searchTerm) || c.description.includes(searchTerm))
    : allContentItems;

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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setIsAdmin(false)}>
      <div className="bg-card rounded-2xl p-5 max-w-lg mx-4 shadow-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">⚙️ 관리자 패널</h3>
          <button onClick={() => setIsAdmin(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar">
          {(['notice', 'places', 'content', 'info'] as AdminTab[]).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSearchTerm(''); setEditingSiteInfo(false); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {tab === 'notice' ? '📢 공지/방문자' : tab === 'places' ? '📍 장소 관리' : tab === 'content' ? '📖 콘텐츠 관리' : 'ℹ️ 서비스 정보'}
            </button>
          ))}
        </div>

        {/* Notice Tab */}
        {activeTab === 'notice' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-semibold text-foreground mb-1">👥 방문자 수</p>
              <p className="text-2xl font-bold text-primary">{visitorCount.toLocaleString()}명</p>
            </div>
            {currentNotice && (
              <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">📢 현재 공지사항</p>
                    <p className="text-sm text-muted-foreground">{currentNotice}</p>
                  </div>
                  <button onClick={handleDeleteNotice} className="text-destructive hover:text-destructive/80 cursor-pointer flex-shrink-0 mt-0.5"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">📝 공지사항 작성</p>
              <textarea value={notice} onChange={e => setNotice(e.target.value)} placeholder="공지사항을 입력하세요..."
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
              <button onClick={handleSaveNotice} disabled={!notice.trim()}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={14} /> 공지 등록
              </button>
            </div>
          </div>
        )}

        {/* Places Tab - List */}
        {activeTab === 'places' && !editingPlace && (
          <div className="space-y-3">
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="장소 검색..."
              className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => setEditingPlace({ id: `custom-p-${Date.now()}`, name: '', description: '', address: '', lat: 34.88, lng: 128.62, category: 'tourism' })}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium cursor-pointer hover:bg-primary/5">
              <Plus size={16} /> 새 장소 추가
            </button>
            <div className="max-h-[40vh] overflow-auto space-y-1">
              {filteredPlaces.slice(0, 50).map(p => (
                <div key={p.id} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.address}</p>
                  </div>
                  <button onClick={() => setEditingPlace({ id: p.id, name: p.name, description: p.description, address: p.address, lat: p.lat, lng: p.lng, category: p.category, imageUrl: p.imageUrl, origin: p.origin, referenceUrl: p.referenceUrl, youtubeUrl: p.youtubeUrl })}
                    className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Place Editor */}
        {activeTab === 'places' && editingPlace && (
          <div className="space-y-3">
            <button onClick={() => setEditingPlace(null)} className="text-sm text-primary cursor-pointer">← 목록으로</button>
            <div>
              <label className="text-xs font-semibold text-foreground">이름</label>
              <input value={editingPlace.name} onChange={e => setEditingPlace({ ...editingPlace, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">설명</label>
              <textarea value={editingPlace.description} onChange={e => setEditingPlace({ ...editingPlace, description: e.target.value })}
                className={`${inputClass} resize-none`} rows={3} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">카테고리</label>
              <select value={editingPlace.category} onChange={e => setEditingPlace({ ...editingPlace, category: e.target.value as PlaceCategory })} className={inputClass}>
                <option value="tourism">관광 명소</option><option value="nature">자연/지리</option><option value="culture">문화/역사</option>
                <option value="public">관공서</option><option value="experience">체험학습</option><option value="market">전통시장</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">주소</label>
              <input value={editingPlace.address} onChange={e => setEditingPlace({ ...editingPlace, address: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-foreground">위도</label>
                <input type="number" step="0.0001" value={editingPlace.lat} onChange={e => setEditingPlace({ ...editingPlace, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">경도</label>
                <input type="number" step="0.0001" value={editingPlace.lng} onChange={e => setEditingPlace({ ...editingPlace, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">유래</label>
              <textarea value={editingPlace.origin || ''} onChange={e => setEditingPlace({ ...editingPlace, origin: e.target.value })}
                className={`${inputClass} resize-none`} rows={2} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">참고 링크</label>
              <input value={editingPlace.referenceUrl || ''} onChange={e => setEditingPlace({ ...editingPlace, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1"><Youtube size={14} className="text-red-500" /> 유튜브 영상 링크</label>
              <input value={editingPlace.youtubeUrl || ''} onChange={e => setEditingPlace({ ...editingPlace, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">사진 업로드</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'place')}
                className="w-full mt-1 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer" />
              {editingPlace.imageUrl && <img src={editingPlace.imageUrl} alt="미리보기" className="w-full h-24 object-cover rounded-lg mt-2" />}
            </div>
            <button onClick={handleSavePlace} disabled={!editingPlace.name.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Content Tab - List */}
        {activeTab === 'content' && !editingContent && (
          <div className="space-y-3">
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="콘텐츠 검색..."
              className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => setEditingContent({ id: `custom-c-${Date.now()}`, name: '', description: '', lat: 34.88, lng: 128.62, contentType: 'story', icon: '📖' })}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium cursor-pointer hover:bg-primary/5">
              <Plus size={16} /> 새 콘텐츠 추가
            </button>
            <div className="max-h-[40vh] overflow-auto space-y-1">
              {filteredContent.slice(0, 50).map(c => (
                <div key={c.id} className="p-2 rounded-lg border bg-muted/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.icon} {c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.contentType}</p>
                  </div>
                  <button onClick={() => setEditingContent({ id: c.id, name: c.name, description: c.description, lat: c.lat, lng: c.lng, contentType: c.contentType, icon: c.icon, imageUrl: c.imageUrl, source: c.source, referenceUrl: c.referenceUrl, youtubeUrl: c.youtubeUrl })}
                    className="p-1.5 rounded bg-muted cursor-pointer flex-shrink-0"><Edit3 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Editor */}
        {activeTab === 'content' && editingContent && (
          <div className="space-y-3">
            <button onClick={() => setEditingContent(null)} className="text-sm text-primary cursor-pointer">← 목록으로</button>
            <div>
              <label className="text-xs font-semibold text-foreground">이름</label>
              <input value={editingContent.name} onChange={e => setEditingContent({ ...editingContent, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">설명</label>
              <textarea value={editingContent.description} onChange={e => setEditingContent({ ...editingContent, description: e.target.value })}
                className={`${inputClass} resize-none`} rows={3} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">콘텐츠 유형</label>
              <select value={editingContent.contentType} onChange={e => setEditingContent({ ...editingContent, contentType: e.target.value as ContentCategory })} className={inputClass}>
                <option value="story">옛이야기</option><option value="placename">지명</option><option value="heritage">국가유산</option>
                <option value="pastpresent">옛날과 오늘날</option><option value="nature">자연</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-foreground">위도</label>
                <input type="number" step="0.0001" value={editingContent.lat} onChange={e => setEditingContent({ ...editingContent, lat: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">경도</label>
                <input type="number" step="0.0001" value={editingContent.lng} onChange={e => setEditingContent({ ...editingContent, lng: parseFloat(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">아이콘 (이모지)</label>
              <input value={editingContent.icon} onChange={e => setEditingContent({ ...editingContent, icon: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">출처</label>
              <input value={editingContent.source || ''} onChange={e => setEditingContent({ ...editingContent, source: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">참고 링크</label>
              <input value={editingContent.referenceUrl || ''} onChange={e => setEditingContent({ ...editingContent, referenceUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1"><Youtube size={14} className="text-red-500" /> 유튜브 영상 링크</label>
              <input value={editingContent.youtubeUrl || ''} onChange={e => setEditingContent({ ...editingContent, youtubeUrl: e.target.value })} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">사진 업로드</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'content')}
                className="w-full mt-1 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer" />
              {editingContent.imageUrl && <img src={editingContent.imageUrl} alt="미리보기" className="w-full h-24 object-cover rounded-lg mt-2" />}
            </div>
            <button onClick={handleSaveContent} disabled={!editingContent.name.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
              <Save size={14} /> 저장
            </button>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && !editingSiteInfo && (
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between"><span className="font-semibold">서비스명:</span><span className="text-muted-foreground">{siteInfo.serviceName}</span></div>
              <div className="flex justify-between"><span className="font-semibold">버전:</span><span className="text-muted-foreground">{siteInfo.version}</span></div>
              <div className="flex justify-between"><span className="font-semibold">개발 도구:</span><span className="text-muted-foreground">{siteInfo.devTool}</span></div>
              <div className="flex justify-between"><span className="font-semibold">지도 API:</span><span className="text-muted-foreground">{siteInfo.mapApi}</span></div>
              <div className="flex justify-between"><span className="font-semibold">개발자:</span><span className="text-muted-foreground">{siteInfo.devName}</span></div>
              <div className="flex justify-between"><span className="font-semibold">연락처:</span><span className="text-muted-foreground">{siteInfo.devEmail}</span></div>
            </div>
            <button onClick={() => setEditingSiteInfo(true)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Edit3 size={14} /> 서비스 정보 수정
            </button>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ※ 관리자 모드에서 장소, 콘텐츠, 공지사항, 서비스 정보를 편집할 수 있습니다. 변경사항은 현재 브라우저의 localStorage에 저장됩니다.
            </p>
          </div>
        )}

        {/* Info Editor */}
        {activeTab === 'info' && editingSiteInfo && (
          <div className="space-y-3">
            <button onClick={() => setEditingSiteInfo(false)} className="text-sm text-primary cursor-pointer">← 돌아가기</button>
            <p className="text-xs font-bold text-foreground bg-muted/50 px-3 py-2 rounded-lg">🌐 웹사이트 정보</p>
            <div>
              <label className="text-xs font-semibold text-foreground">서비스명</label>
              <input value={siteInfo.serviceName} onChange={e => setSiteInfo({ ...siteInfo, serviceName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">버전</label>
              <input value={siteInfo.version} onChange={e => setSiteInfo({ ...siteInfo, version: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">개발 도구</label>
              <input value={siteInfo.devTool} onChange={e => setSiteInfo({ ...siteInfo, devTool: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">지도 API</label>
              <input value={siteInfo.mapApi} onChange={e => setSiteInfo({ ...siteInfo, mapApi: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">자료 출처</label>
              <input value={siteInfo.dataSource} onChange={e => setSiteInfo({ ...siteInfo, dataSource: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">웹사이트 안내문</label>
              <textarea value={siteInfo.siteNotice} onChange={e => setSiteInfo({ ...siteInfo, siteNotice: e.target.value })}
                className={`${inputClass} resize-none`} rows={4} />
            </div>

            <p className="text-xs font-bold text-foreground bg-muted/50 px-3 py-2 rounded-lg mt-2">👤 개발자 정보</p>
            <div>
              <label className="text-xs font-semibold text-foreground">이름</label>
              <input value={siteInfo.devName} onChange={e => setSiteInfo({ ...siteInfo, devName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">소속/직함 1</label>
              <input value={siteInfo.devTitle1} onChange={e => setSiteInfo({ ...siteInfo, devTitle1: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">소속/직함 2</label>
              <input value={siteInfo.devTitle2} onChange={e => setSiteInfo({ ...siteInfo, devTitle2: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">소속/직함 3</label>
              <input value={siteInfo.devTitle3} onChange={e => setSiteInfo({ ...siteInfo, devTitle3: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">이메일</label>
              <input value={siteInfo.devEmail} onChange={e => setSiteInfo({ ...siteInfo, devEmail: e.target.value })} className={inputClass} />
            </div>
            <button onClick={handleSaveSiteInfo}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">
              <Save size={14} /> 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
