import { Info, X, Link2, Target } from 'lucide-react';
import { useState } from 'react';

interface AppHeaderProps {
  schoolName?: string;
  onQuizOpen?: () => void;
  onSourcesOpen?: () => void;
  onInfoOpen?: () => void;
}

const AppHeader = ({ schoolName, onQuizOpen, onSourcesOpen, onInfoOpen }: AppHeaderProps) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutTab, setAboutTab] = useState<'site' | 'dev'>('site');

  return (
    <>
      <header className="header-bar flex items-center justify-between px-4 py-3 shadow-md relative z-50">
        <h1 className="text-xl font-extrabold tracking-tight">거제 탐험대</h1>
        <div className="flex items-center gap-2">
          {schoolName && (
            <span className="text-sm font-medium opacity-90 hidden sm:inline">
              📍 {schoolName}
            </span>
          )}
          {schoolName && onSourcesOpen && (
            <button onClick={onSourcesOpen} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer" title="관련 누리집">
              <Link2 size={15} />
            </button>
          )}
          {schoolName && onQuizOpen && (
            <button onClick={onQuizOpen} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer" title="퀴즈">
              <Target size={15} />
            </button>
          )}
          <button
            onClick={() => schoolName ? setShowAbout(true) : setShowGuide(true)}
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            title="안내"
          >
            <Info size={15} />
          </button>
        </div>
      </header>

      {/* 사용 방법 안내 */}
      {showGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setShowGuide(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md mx-4 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">🧭 거제 탐험대 사용 방법</h2>
              <button onClick={() => setShowGuide(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={22} /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">지도에서 거제시의 다양한 장소를 탐험해 보세요!</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">🏫</span>
                <p className="text-muted-foreground"><strong className="text-foreground">학교 아이콘</strong> - 학교 아이콘을 누르면 언제든 학교 위치로 돌아올 수 있어요.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <p className="text-muted-foreground"><strong className="text-foreground">주요 메뉴(탭)</strong> - 장소, 옛이야기, 지명, 국가유산 등 다양한 카테고리의 정보를 확인할 수 있어요.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔗</span>
                <p className="text-muted-foreground"><strong className="text-foreground">링크 아이콘</strong> - 장소를 눌렀을 때 나오는 링크로 관련 웹사이트에 바로 접속할 수 있어요.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <p className="text-muted-foreground"><strong className="text-foreground">퀴즈 아이콘</strong> - 우측 상단의 퀴즈 버튼으로 거제 탐험 퀴즈에 도전해 보세요!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">ℹ️</span>
                <p className="text-muted-foreground"><strong className="text-foreground">정보 아이콘</strong> - 잘못된 내용을 발견하면 안내 버튼을 눌러 제보해 주세요.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowGuide(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 cursor-pointer">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 웹사이트/개발자 정보 */}
      {showAbout && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setShowAbout(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md mx-4 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">안내 사항</h2>
              <button onClick={() => setShowAbout(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={22} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setAboutTab('site')}
                className={`flex-1 py-2 text-sm font-semibold cursor-pointer transition-colors ${aboutTab === 'site' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                웹사이트 정보
              </button>
              <button
                onClick={() => setAboutTab('dev')}
                className={`flex-1 py-2 text-sm font-semibold cursor-pointer transition-colors ${aboutTab === 'dev' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                개발자 정보
              </button>
            </div>

            {aboutTab === 'site' ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="font-semibold text-foreground">서비스 명:</span><span className="text-muted-foreground">거제탐험대</span></div>
                <div className="flex justify-between"><span className="font-semibold text-foreground">버전:</span><span className="text-muted-foreground">1.0</span></div>
                <div className="flex justify-between"><span className="font-semibold text-foreground">개발 도구:</span><span className="text-muted-foreground">Lovable</span></div>
                <div className="flex justify-between"><span className="font-semibold text-foreground">사용 도구:</span><span className="text-muted-foreground">Kakao MAP</span></div>
                <div className="flex justify-between"><span className="font-semibold text-foreground">자료 출처:</span><span className="text-muted-foreground">공식 웹페이지</span></div>
                <hr className="border-border" />
                <p className="leading-relaxed text-muted-foreground">
                  알림: 본 웹서비스는 타이핑 및 조사 학습이 제한적인 학생들을 위하여 <strong className="text-destructive">학생들의 개인정보를 수집하지 않고, 성취기준과 별도</strong>로 우리 지역 거제를 쉽고 재미있게 탐험하기 위해 제작되었습니다. 데이터 수집 및 제작 시점에 따라 실제 장소의 내용이 다소 상이할 수 있으므로 <strong className="text-destructive">사실 정보는 검색 엔진을 적극 활용</strong>하시길 바랍니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p className="text-lg font-bold text-foreground">수박쌤</p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-muted/50 text-muted-foreground">경남 초등학교 교사</div>
                  <div className="p-2.5 rounded-lg bg-muted/50 text-muted-foreground">참쌤스쿨 크루</div>
                  <div className="p-2.5 rounded-lg bg-muted/50 text-muted-foreground">교사 크리에이터 협회 회원</div>
                </div>
                <hr className="border-border" />
                <p className="text-muted-foreground">
                  contact: <a href="mailto:bjh4042@naver.com" className="text-primary font-medium underline">bjh4042@naver.com</a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
