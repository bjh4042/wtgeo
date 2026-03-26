import { Info, X } from 'lucide-react';
import { useState } from 'react';

const AppHeader = ({ schoolName }: { schoolName?: string }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="header-bar flex items-center justify-between px-4 py-3 shadow-md relative z-50">
        <h1 className="text-xl font-extrabold tracking-tight">거제 탐험대</h1>
        <div className="flex items-center gap-3">
          {schoolName && (
            <span className="text-sm font-medium opacity-90">
              📍 {schoolName}
            </span>
          )}
          <button
            onClick={() => setShowInfo(true)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowInfo(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">안내 사항</h2>
              <button onClick={() => setShowInfo(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={22} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">서비스 명:</span>
                <span>거제 탐험대</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">버전:</span>
                <span>1.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">사용 도구:</span>
                <span>Kakao Maps API</span>
              </div>
              <hr className="border-border" />
              <p className="leading-relaxed">
                본 웹서비스는 초등학생들이 우리 지역 거제를 쉽고 재미있게 탐험하기 위해 제작되었습니다.
                데이터 수집 시점에 따라 실제 장소의 내용이 다소 상이할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
