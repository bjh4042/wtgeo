import { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { getRoadViewUrl } from '@/data/places';

interface RoadViewModalProps {
  lat: number;
  lng: number;
  name: string;
  onClose: () => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const RoadViewModal = ({ lat, lng, name, onClose }: RoadViewModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryInit = (attempt = 0) => {
      const kakao = window.kakao;
      if (!kakao || !kakao.maps || !kakao.maps.RoadviewClient) {
        if (attempt < 20) {
          setTimeout(() => tryInit(attempt + 1), 200);
        } else {
          setError('지도 SDK를 불러오지 못했습니다.');
          setLoading(false);
        }
        return;
      }

      kakao.maps.load(() => {
        if (!containerRef.current) return;
        try {
          const roadview = new kakao.maps.Roadview(containerRef.current);
          const roadviewClient = new kakao.maps.RoadviewClient();
          const position = new kakao.maps.LatLng(lat, lng);

          // 반경 50m -> 100m -> 300m 순으로 가까운 파노라마 검색
          const radii = [50, 100, 300, 500];
          const search = (i: number) => {
            if (i >= radii.length) {
              setError('주변에 로드뷰 데이터가 없습니다.');
              setLoading(false);
              return;
            }
            roadviewClient.getNearestPanoId(position, radii[i], (panoId: number | null) => {
              if (panoId) {
                roadview.setPanoId(panoId, position);
                setLoading(false);
                // 로드뷰 초기화 후 사이즈 보정
                setTimeout(() => {
                  try { roadview.relayout && roadview.relayout(); } catch {}
                }, 200);
              } else {
                search(i + 1);
              }
            });
          };
          search(0);
        } catch (e) {
          console.error('[RoadView] init error', e);
          setError('로드뷰를 불러오지 못했습니다.');
          setLoading(false);
        }
      });
    };
    tryInit();
  }, [lat, lng]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">🛣️ {name} 로드뷰</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex-shrink-0 ml-2"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        <div className="relative flex-1 bg-muted">
          <div ref={containerRef} className="absolute inset-0 w-full h-full" />

          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs">로드뷰를 불러오는 중...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <AlertCircle className="text-muted-foreground" size={32} />
                <p className="text-sm text-foreground font-medium">{error}</p>
                <p className="text-xs text-muted-foreground">카카오맵에서 직접 열어볼 수 있어요.</p>
                <a
                  href={getRoadViewUrl(lat, lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <ExternalLink size={13} /> 카카오맵에서 열기
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadViewModal;
