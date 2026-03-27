import { useState, useEffect } from 'react';
import { Settings, X, Send, Trash2 } from 'lucide-react';

const ADMIN_PASSWORD = '4042';
const NOTICE_KEY = 'geoje-explorer-notice';
const VISITOR_KEY = 'geoje-explorer-visitors';

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

const AdminPanel = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [currentNotice, setCurrentNotice] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const visitorCount = getVisitorCount();

  useEffect(() => {
    setCurrentNotice(getNotice());
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
      <div className="bg-card rounded-2xl p-6 max-w-md mx-4 shadow-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">⚙️ 관리자 패널</h3>
          <button onClick={() => setIsAdmin(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* 방문자 수 */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-semibold text-foreground mb-1">👥 방문자 수</p>
            <p className="text-2xl font-bold text-primary">{visitorCount.toLocaleString()}명</p>
          </div>

          {/* 현재 공지 */}
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

          {/* 공지 입력 */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">📝 공지사항 작성</p>
            <div className="flex gap-2">
              <textarea
                value={notice}
                onChange={e => setNotice(e.target.value)}
                placeholder="공지사항을 입력하세요..."
                className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
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
      </div>
    </div>
  );
};

export default AdminPanel;
