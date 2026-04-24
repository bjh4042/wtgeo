import { Place, categoryColors, categoryIcons, getRoadViewUrl, getDirectionUrl, getDistance, getEstimatedTime } from '@/data/places';
import { School } from '@/data/schools';
import { X, MapPin, Navigation, Eye, ExternalLink, Clock, Route, BookOpen, Youtube, Star, AlertTriangle, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RoadViewModal from './RoadViewModal';

interface PlaceCardProps {
  place: Place;
  school: School;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (place: Place) => void;
}

const PlaceCard = ({ place, school, onClose, isFavorite, onToggleFavorite }: PlaceCardProps) => {
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];
  const [imgError, setImgError] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportMsg, setReportMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleReport = async () => {
    if (!reportMsg.trim()) return;
    setSending(true);
    const { error } = await supabase.from('error_reports').insert({
      place_id: place.id,
      place_name: place.name,
      message: reportMsg.trim(),
      category: categoryLabel,
    });
    setSending(false);
    if (error) { toast.error('전송 실패'); return; }
    toast.success('오류가 제보되었습니다');
    setReportMsg('');
    setShowReport(false);
  };
  const roadViewUrl = getRoadViewUrl(place.lat, place.lng);
  const directionUrl = getDirectionUrl(place.lat, place.lng, place.name);

  const distanceKm = getDistance(school.lat, school.lng, place.lat, place.lng);
  const estimatedTime = getEstimatedTime(distanceKm);
  const distanceText = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`;

  const categoryLabel = place.category === 'tourism' ? '관광' : place.category === 'nature' ? '자연' : place.category === 'culture' ? '문화' : place.category === 'public' ? '공공기관' : place.category === 'experience' ? '체험' : '시장';

  return (
    <div className="place-card animate-slide-up max-w-sm">
      {place.imageUrl && !imgError ? (
        <div className="relative -mx-4 -mt-4 mb-3 rounded-t-xl overflow-hidden">
          <img src={place.imageUrl} alt={place.name} className="w-full h-36 object-cover" onError={() => setImgError(true)} />
          <div className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
            {icon} {categoryLabel}
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between mb-3">
          <span className="category-badge text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: color + '20', color }}>
            {icon} {categoryLabel}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base sm:text-lg font-bold text-foreground flex-1 min-w-0 truncate">{place.name}</h3>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {onToggleFavorite && (
            <button onClick={() => onToggleFavorite(place)} className="cursor-pointer transition-colors" title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}>
              <Star size={20} className={isFavorite ? 'text-accent fill-accent' : 'text-muted-foreground hover:text-accent'} />
            </button>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{place.description}</p>

      {place.origin && (
        <div className="mb-2">
          <button onClick={() => setShowOrigin(!showOrigin)} className="flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors" style={{ color }}>
            <BookOpen size={13} />
            {showOrigin ? '유래 접기' : '📖 유래 보기'}
          </button>
          {showOrigin && (
            <div className="mt-1.5 p-2.5 rounded-lg text-xs leading-relaxed text-foreground/80" style={{ backgroundColor: color + '10' }}>
              {place.origin}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <MapPin size={14} className="flex-shrink-0" />
        <span>{place.address}</span>
      </div>

      <div className="flex items-center gap-3 text-xs mb-3 px-2 py-1.5 rounded-lg bg-muted/50">
        <span className="flex items-center gap-1 text-primary font-medium">
          <Route size={13} />{distanceText}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock size={13} />🚗 {estimatedTime}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <a href={roadViewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <Eye size={14} />로드뷰
        </a>
        <a href={directionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
          <Navigation size={14} />길찾기
        </a>
        <a href={`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
          <ExternalLink size={14} />지도
        </a>
        {place.referenceUrl && (
          <a href={place.referenceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted/50 transition-colors" style={{ color }}>
            <ExternalLink size={14} />관련 사이트
          </a>
        )}
        {place.youtubeUrl && (
          <a href={place.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors">
            <Youtube size={14} />영상 보기
          </a>
        )}
      </div>

      {/* Error Report */}
      <div className="mt-2 border-t pt-2">
        {!showReport ? (
          <button onClick={() => setShowReport(true)} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
            <AlertTriangle size={12} /> 오류 제보
          </button>
        ) : (
          <div className="space-y-1.5">
            <textarea value={reportMsg} onChange={e => setReportMsg(e.target.value)} placeholder="어떤 오류가 있나요? (예: 주소가 잘못됨, 사진이 다름)" rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-foreground text-xs resize-none focus:outline-none focus:ring-1 focus:ring-destructive" />
            <div className="flex gap-1.5">
              <button onClick={handleReport} disabled={!reportMsg.trim() || sending}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-destructive text-destructive-foreground hover:opacity-90 cursor-pointer disabled:opacity-50">
                <Send size={11} />{sending ? '전송 중...' : '제보'}
              </button>
              <button onClick={() => { setShowReport(false); setReportMsg(''); }}
                className="px-2.5 py-1 rounded-lg text-[11px] text-muted-foreground bg-muted hover:bg-muted/80 cursor-pointer">취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
