import { useState, useEffect } from 'react';
import { Settings, X, Send, Trash2, Plus, Save, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

const ADMIN_PASSWORD = '4042';
const NOTICE_KEY = 'geoje-explorer-notice';
const VISITOR_KEY = 'geoje-explorer-visitors';
const CUSTOM_PLACES_KEY = 'geoje-custom-places';
const CUSTOM_CONTENT_KEY = 'geoje-custom-content';

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

interface EditableItem {
  id: string;
  name: string;
  description: string;
  address?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  category?: string;
  contentType?: string;
}

const AdminPanel = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [currentNotice, setCurrentNotice] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('notice');
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [customPlaces, setCustomPlaces] = useState<EditableItem[]>([]);
  const [customContent, setCustomContent] = useState<EditableItem[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const visitorCount = getVisitorCount();

  useEffect(() => {
    setCurrentNotice(getNotice());
    try {
      const cp = localStorage.getItem(CUSTOM_PLACES_KEY);
      if (cp) setCustomPlaces(JSON.parse(cp));
      const cc = localStorage.getItem(CUSTOM_CONTENT_KEY);
      if (cc) setCustomContent(JSON.parse(cc));
    } catch {}
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError(false);
    } else {
      setError(true);
    }
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

  const handleSaveItem = () => {
    if (!editingItem) return;
    if (editingItem.category) {
      // Place
      const updated = [...customPlaces];
      const idx = updated.findIndex(p => p.id === editingItem.id);
      if (idx >= 0) updated[idx] = editingItem;
      else updated.push(editingItem);
      setCustomPlaces(updated);
      localStorage.setItem(CUSTOM_PLACES_KEY, JSON.stringify(updated));
    } else {
      // Content
      const updated = [...customContent];
      const idx = updated.findIndex(c => c.id === editingItem.id);
      if (idx >= 0) updated[idx] = editingItem;
      else updated.push(editingItem);
      setCustomContent(updated);
      localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(updated));
    }
    setEditingItem(null);
    setShowEditor(false);
  };

  const handleDeleteItem = (id: string, type: 'place' | 'content') => {
    if (type === 'place') {
      const updated = customPlaces.filter(p => p.id !== id);
      setCustomPlaces(updated);
      localStorage.setItem(CUSTOM_PLACES_KEY, JSON.stringify(updated));
    } else {
      const updated = customContent.filter(c => c.id !== id);
      setCustomContent(updated);
      localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(updated));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditingItem({ ...editingItem, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!showLogin && !isAdmin) {
    return (
      <button
        onClick={() => setShowLogin(true)}
        className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
      >
        <Settings size={12} />
        관리자
      </button>
    );
  }

  if (showLogin && !isAdmin) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => { setShowLogin(false); setError(false); setPassword(''); }}>
        <div className="bg-card rounded-2xl p-6 max-w-sm mx-4 shadow-2xl w-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">🔐 관리자 로그인</h3>
            <button onClick={() => { setShowLogin(false); setError(false); setPassword(''); }} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-xs text-destructive">비밀번호가 올바르지 않습니다.</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setIsAdmin(false)}>
      <div className="bg-card rounded-2xl p-5 max-w-lg mx-4 shadow-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">⚙️ 관리자 패널</h3>
          <button onClick={() => setIsAdmin(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {(['notice', 'places', 'content', 'info'] as AdminTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
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
                  <button onClick={handleDeleteNotice} className="text-destructive hover:text-destructive/80 cursor-pointer flex-shrink-0 mt-0.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">📝 공지사항 작성</p>
              <textarea
                value={notice}
                onChange={e => setNotice(e.target.value)}
                placeholder="공지사항을 입력하세요..."
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <button
                onClick={handleSaveNotice}
                disabled={!notice.trim()}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                공지 등록
              </button>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              ※ 기본 장소 데이터는 코드에 포함되어 있으며, 여기서 추가한 장소는 브라우저(localStorage)에 저장됩니다.
            </p>
            <button
              onClick={() => {
                setEditingItem({ id: `custom-p-${Date.now()}`, name: '', description: '', address: '', lat: 34.88, lng: 128.62, category: 'tourism' });
                setShowEditor(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium cursor-pointer hover:bg-primary/5"
            >
              <Plus size={16} />
              새 장소 추가
            </button>

            {customPlaces.map(item => (
              <div key={item.id} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name || '(이름 없음)'}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingItem(item); setShowEditor(true); }} className="p-1.5 rounded bg-muted cursor-pointer"><Edit3 size={14} /></button>
                  <button onClick={() => handleDeleteItem(item.id, 'place')} className="p-1.5 rounded bg-destructive/10 text-destructive cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              ※ 옛이야기, 지명, 국가유산, 자연, 옛날과 오늘날 콘텐츠를 추가할 수 있습니다.
            </p>
            <button
              onClick={() => {
                setEditingItem({ id: `custom-c-${Date.now()}`, name: '', description: '', contentType: 'story' });
                setShowEditor(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-medium cursor-pointer hover:bg-primary/5"
            >
              <Plus size={16} />
              새 콘텐츠 추가
            </button>

            {customContent.map(item => (
              <div key={item.id} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name || '(이름 없음)'}</p>
                  <p className="text-xs text-muted-foreground">{item.contentType}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingItem(item); setShowEditor(true); }} className="p-1.5 rounded bg-muted cursor-pointer"><Edit3 size={14} /></button>
                  <button onClick={() => handleDeleteItem(item.id, 'content')} className="p-1.5 rounded bg-destructive/10 text-destructive cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between"><span className="font-semibold">서비스명:</span><span className="text-muted-foreground">거제탐험대</span></div>
              <div className="flex justify-between"><span className="font-semibold">버전:</span><span className="text-muted-foreground">1.0</span></div>
              <div className="flex justify-between"><span className="font-semibold">개발 도구:</span><span className="text-muted-foreground">Lovable</span></div>
              <div className="flex justify-between"><span className="font-semibold">지도 API:</span><span className="text-muted-foreground">Kakao MAP</span></div>
              <div className="flex justify-between"><span className="font-semibold">저작권:</span><span className="text-muted-foreground">© 수박쌤 (원작: 니카쌤)</span></div>
              <div className="flex justify-between"><span className="font-semibold">연락처:</span><span className="text-muted-foreground">bjh4042@naver.com</span></div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ※ 관리자 모드에서 장소, 콘텐츠, 공지사항을 편집할 수 있습니다. 변경사항은 현재 브라우저의 localStorage에 저장됩니다.
            </p>
          </div>
        )}

        {/* Item Editor Modal */}
        {showEditor && editingItem && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50" onClick={() => setShowEditor(false)}>
            <div className="bg-card rounded-2xl p-5 max-w-md mx-4 shadow-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-foreground">✏️ 항목 편집</h4>
                <button onClick={() => setShowEditor(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">이름</label>
                  <input
                    value={editingItem.name}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">설명</label>
                  <textarea
                    value={editingItem.description}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                {editingItem.category && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-foreground">카테고리</label>
                      <select
                        value={editingItem.category}
                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm"
                      >
                        <option value="tourism">관광 명소</option>
                        <option value="nature">자연/지리</option>
                        <option value="culture">문화/역사</option>
                        <option value="public">관공서</option>
                        <option value="experience">체험학습</option>
                        <option value="market">전통시장</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">주소</label>
                      <input
                        value={editingItem.address || ''}
                        onChange={e => setEditingItem({ ...editingItem, address: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground">위도</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={editingItem.lat || ''}
                          onChange={e => setEditingItem({ ...editingItem, lat: parseFloat(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground">경도</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={editingItem.lng || ''}
                          onChange={e => setEditingItem({ ...editingItem, lng: parseFloat(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </>
                )}
                {editingItem.contentType && (
                  <div>
                    <label className="text-xs font-semibold text-foreground">콘텐츠 유형</label>
                    <select
                      value={editingItem.contentType}
                      onChange={e => setEditingItem({ ...editingItem, contentType: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm"
                    >
                      <option value="story">옛이야기</option>
                      <option value="placename">지명</option>
                      <option value="heritage">국가유산</option>
                      <option value="pastpresent">옛날과 오늘날</option>
                      <option value="nature">자연</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-foreground">사진 업로드</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full mt-1 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
                  />
                  {editingItem.imageUrl && (
                    <img src={editingItem.imageUrl} alt="미리보기" className="w-full h-24 object-cover rounded-lg mt-2" />
                  )}
                </div>
                <button
                  onClick={handleSaveItem}
                  disabled={!editingItem.name.trim()}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
