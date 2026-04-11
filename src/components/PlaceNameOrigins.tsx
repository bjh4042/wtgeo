import { useState } from 'react';
import { X, ExternalLink, MapPin, ChevronDown, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OriginEntry {
  name: string;
  menuCd: string;
}

interface District {
  name: string;
  entries: OriginEntry[];
}

const districts: District[] = [
  { name: '일운면', entries: [
    { name: '구조라리', menuCd: 'DOM_000008905007004003' },
    { name: '망치리', menuCd: 'DOM_000008905007004004' },
    { name: '소동리', menuCd: 'DOM_000008905007004005' },
    { name: '옥림리', menuCd: 'DOM_000008905007004006' },
    { name: '와현리', menuCd: 'DOM_000008905007004092' },
    { name: '지세포리', menuCd: 'DOM_000008905007004007' },
  ]},
  { name: '동부면', entries: [
    { name: '가배리', menuCd: 'DOM_000008905007004008' },
    { name: '구천리', menuCd: 'DOM_000008905007004009' },
    { name: '부춘리', menuCd: 'DOM_000008905007004010' },
    { name: '산촌리', menuCd: 'DOM_000008905007004011' },
    { name: '오송리', menuCd: 'DOM_000008905007004012' },
    { name: '율포리', menuCd: 'DOM_000008905007004013' },
    { name: '학동리', menuCd: 'DOM_000008905007004014' },
    { name: '산양리', menuCd: 'DOM_000008905007004015' },
  ]},
  { name: '남부면', entries: [
    { name: '갈곶리', menuCd: 'DOM_000008905007004016' },
    { name: '다대리', menuCd: 'DOM_000008905007004017' },
    { name: '저구리', menuCd: 'DOM_000008905007004018' },
    { name: '다포리', menuCd: 'DOM_000008905007004019' },
    { name: '탑포리', menuCd: 'DOM_000008905007004020' },
  ]},
  { name: '거제면', entries: [
    { name: '남동리', menuCd: 'DOM_000008905007004021' },
    { name: '내간리', menuCd: 'DOM_000008905007004022' },
    { name: '동상리', menuCd: 'DOM_000008905007004023' },
    { name: '명진리', menuCd: 'DOM_000008905007004024' },
    { name: '법동리', menuCd: 'DOM_000008905007004025' },
    { name: '서상리', menuCd: 'DOM_000008905007004026' },
    { name: '소랑리', menuCd: 'DOM_000008905007004027' },
    { name: '옥산리', menuCd: 'DOM_000008905007004028' },
    { name: '오수리', menuCd: 'DOM_000008905007004029' },
    { name: '외간리', menuCd: 'DOM_000008905007004030' },
  ]},
  { name: '둔덕면', entries: [
    { name: '거림리', menuCd: 'DOM_000008905007004031' },
    { name: '방하리', menuCd: 'DOM_000008905007004032' },
    { name: '산방리', menuCd: 'DOM_000008905007004033' },
    { name: '상둔리', menuCd: 'DOM_000008905007004034' },
    { name: '술역리', menuCd: 'DOM_000008905007004035' },
    { name: '시목리', menuCd: 'DOM_000008905007004036' },
    { name: '어구리', menuCd: 'DOM_000008905007004037' },
    { name: '하둔리', menuCd: 'DOM_000008905007004038' },
    { name: '학산리', menuCd: 'DOM_000008905007004039' },
  ]},
  { name: '사등면', entries: [
    { name: '덕호리', menuCd: 'DOM_000008905007004040' },
    { name: '사곡리', menuCd: 'DOM_000008905007004041' },
    { name: '사등리', menuCd: 'DOM_000008905007004042' },
    { name: '성포리', menuCd: 'DOM_000008905007004043' },
    { name: '오량리', menuCd: 'DOM_000008905007004044' },
    { name: '지석리', menuCd: 'DOM_000008905007004045' },
    { name: '창호리', menuCd: 'DOM_000008905007004046' },
    { name: '청곡리', menuCd: 'DOM_000008905007004047' },
  ]},
  { name: '연초면', entries: [
    { name: '다공리', menuCd: 'DOM_000008905007004048' },
    { name: '덕치리', menuCd: 'DOM_000008905007004049' },
    { name: '명동리', menuCd: 'DOM_000008905007004050' },
    { name: '송정리', menuCd: 'DOM_000008905007004051' },
    { name: '연사리', menuCd: 'DOM_000008905007004052' },
    { name: '오비리', menuCd: 'DOM_000008905007004053' },
    { name: '이목리', menuCd: 'DOM_000008905007004054' },
    { name: '죽토리', menuCd: 'DOM_000008905007004055' },
    { name: '천곡리', menuCd: 'DOM_000008905007004056' },
    { name: '한내리', menuCd: 'DOM_000008905007004057' },
  ]},
  { name: '하청면', entries: [
    { name: '대곡리', menuCd: 'DOM_000008905007004059' },
    { name: '덕곡리', menuCd: 'DOM_000008905007004060' },
    { name: '석포리', menuCd: 'DOM_000008905007004061' },
    { name: '실전리', menuCd: 'DOM_000008905007004062' },
    { name: '어온리', menuCd: 'DOM_000008905007004063' },
    { name: '연구리', menuCd: 'DOM_000008905007004064' },
    { name: '유계리', menuCd: 'DOM_000008905007004065' },
    { name: '하청리', menuCd: 'DOM_000008905007004066' },
  ]},
  { name: '장목면', entries: [
    { name: '관포리', menuCd: 'DOM_000008905007004067' },
    { name: '구영리', menuCd: 'DOM_000008905007004068' },
    { name: '농소리', menuCd: 'DOM_000008905007004069' },
    { name: '대금리', menuCd: 'DOM_000008905007004070' },
    { name: '송진포리', menuCd: 'DOM_000008905007004071' },
    { name: '시방리', menuCd: 'DOM_000008905007004072' },
    { name: '외포리', menuCd: 'DOM_000008905007004073' },
    { name: '유호리', menuCd: 'DOM_000008905007004074' },
    { name: '율천리', menuCd: 'DOM_000008905007004075' },
    { name: '장목리', menuCd: 'DOM_000008905007004076' },
  ]},
  { name: '장승포', entries: [
    { name: '장승포동', menuCd: 'DOM_000008905007004077' },
    { name: '능포동', menuCd: 'DOM_000008905007004078' },
    { name: '덕포동', menuCd: 'DOM_000008905007004079' },
    { name: '두모동', menuCd: 'DOM_000008905007004080' },
    { name: '마전동', menuCd: 'DOM_000008905007004081' },
    { name: '아양동', menuCd: 'DOM_000008905007004082' },
    { name: '아주동', menuCd: 'DOM_000008905007004083' },
    { name: '옥포동', menuCd: 'DOM_000008905007004084' },
  ]},
  { name: '구신현', entries: [
    { name: '고현동', menuCd: 'DOM_000008905007004085' },
    { name: '문동동', menuCd: 'DOM_000008905007004086' },
    { name: '삼거리', menuCd: 'DOM_000008905007004087' },
    { name: '상동동', menuCd: 'DOM_000008905007004088' },
    { name: '수월동', menuCd: 'DOM_000008905007004089' },
    { name: '양정동', menuCd: 'DOM_000008905007004090' },
    { name: '장평동', menuCd: 'DOM_000008905007004091' },
  ]},
];

interface PlaceNameOriginsProps {
  onClose: () => void;
}

const PlaceNameOrigins = ({ onClose }: PlaceNameOriginsProps) => {
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<{ name: string; menuCd: string } | null>(null);
  const [detailContent, setDetailContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [contentCache, setContentCache] = useState<Record<string, string>>({});

  const handleEntryClick = async (entry: OriginEntry) => {
    setDetailView(entry);

    if (contentCache[entry.menuCd]) {
      setDetailContent(contentCache[entry.menuCd]);
      return;
    }

    setLoading(true);
    setDetailContent('');
    try {
      const { data, error } = await supabase.functions.invoke('fetch-place-origin', {
        body: { menuCd: entry.menuCd },
      });
      if (error) throw error;
      const text = data?.content || '내용을 불러올 수 없습니다.';
      setDetailContent(text);
      setContentCache(prev => ({ ...prev, [entry.menuCd]: text }));
    } catch (e) {
      console.error('Failed to fetch place origin:', e);
      setDetailContent('내용을 불러오는 데 실패했습니다. 아래 링크에서 직접 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-primary/10 flex-shrink-0">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            {detailView ? (
              <>
                <button onClick={() => setDetailView(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <ArrowLeft size={18} />
                </button>
                <MapPin size={18} className="text-primary" /> {detailView.name}
              </>
            ) : (
              <>
                <MapPin size={18} className="text-primary" /> 거제시 지명유래
              </>
            )}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {detailView ? (
          /* Detail view */
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">유래 정보를 불러오는 중...</span>
              </div>
            ) : (
              <div className="p-4">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line leading-relaxed text-sm">
                  {detailContent}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <a
                    href={`https://www.geoje.go.kr/index.geoje?menuCd=${detailView.menuCd}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    거제시청 원문 보기 <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List view */
          <>
            <div className="px-4 py-3 bg-muted/30 border-b text-xs text-muted-foreground flex-shrink-0">
              거제시 공식 홈페이지에서 제공하는 지명유래 정보입니다. 각 지명을 클릭하면 상세 유래를 확인할 수 있습니다.
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-1.5">
              {districts.map((district) => {
                const isExpanded = expandedDistrict === district.name;
                return (
                  <div key={district.name} className="rounded-xl border overflow-hidden">
                    <button
                      onClick={() => setExpandedDistrict(isExpanded ? null : district.name)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-sm text-foreground">{district.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{district.entries.length}개 지명</span>
                        {isExpanded ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {district.entries.map((entry) => (
                          <button
                            key={entry.menuCd}
                            onClick={() => handleEntryClick(entry)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 hover:bg-primary/10 text-sm text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                          >
                            <span>{entry.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t bg-muted/20 flex-shrink-0">
              <a
                href="https://www.geoje.go.kr/index.geoje?menuCd=DOM_000008905007004000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                출처: 거제시청 영상기록관 - 지명유래 <ExternalLink size={10} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceNameOrigins;
