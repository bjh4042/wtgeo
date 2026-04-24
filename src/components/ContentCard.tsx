import { MapContent, contentCategoryColors, contentCategoryIcons, contentCategoryLabels } from '@/data/content';
import { getRoadViewUrl } from '@/data/places';
import { X, ExternalLink, Youtube, Eye, MapPin, Star, AlertTriangle, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RoadViewModal from './RoadViewModal';

interface ContentCardProps {
  content: MapContent;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (content: MapContent) => void;
}

const ContentCard = ({ content, onClose, isFavorite, onToggleFavorite }: ContentCardProps) => {
  const color = contentCategoryColors[content.contentType];
  const icon = contentCategoryIcons[content.contentType];
  const label = contentCategoryLabels[content.contentType];
  const [imgError, setImgError] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportMsg, setReportMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [showRoadView, setShowRoadView] = useState(false);

  const handleReport = async () => {
    if (!reportMsg.trim()) return;
    setSending(true);
    const { error } = await supabase.from('error_reports').insert({
      place_id: content.id,
      place_name: content.name,
      message: reportMsg.trim(),
      category: label,
    });
    setSending(false);
    if (error) { toast.error('전송 실패'); return; }
    toast.success('오류가 제보되었습니다');
    setReportMsg('');
    setShowReport(false);
  };

  return (
    <div className="place-card animate-scale-in max-w-sm">
      {content.imageUrl && !imgError && (
        <div className="relative -mx-5 -mt-5 mb-3 rounded-t-xl overflow-hidden">
          <img
            src={content.imageUrl}
            alt={content.name}
            className="w-full h-36 object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: color + '20', color }}
          >
            {icon} {label}
          </span>
          <h3 className="text-base font-bold text-foreground">{content.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-2 flex-shrink-0"
        >
          <X size={20} />
        </button>
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(content)} className="cursor-pointer transition-colors ml-1 flex-shrink-0" title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}>
            <Star size={18} className={isFavorite ? 'text-accent fill-accent' : 'text-muted-foreground hover:text-accent'} />
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {content.description}
      </p>

      {/* 옛날과 오늘날 - 옛사진 */}
      {content.contentType === 'pastpresent' && content.oldImageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden border">
          <img src={content.oldImageUrl} alt={content.oldImageCaption} className="w-full h-32 object-cover" />
          <p className="text-xs text-center py-1.5 text-muted-foreground bg-muted/50">{content.oldImageCaption}</p>
        </div>
      )}
      {content.contentType === 'pastpresent' && !content.oldImageUrl && content.oldImageCaption && (
        <div className="mb-3 p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30 text-center">
          <p className="text-xs text-muted-foreground">📷 {content.oldImageCaption}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">사진 준비 중</p>
        </div>
      )}

      {content.source && (
        <p className="text-xs text-muted-foreground/70 mt-2">
          📎 출처: {content.source}
        </p>
      )}

      {/* 관련 링크 */}
      <div className="flex flex-wrap gap-2 mt-2">
        <button onClick={() => setShowRoadView(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
          <Eye size={13} />로드뷰
        </button>
        <a href={`https://map.kakao.com/link/map/${encodeURIComponent(content.name)},${content.lat},${content.lng}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
          <MapPin size={13} />지도
        </a>
        {content.referenceUrl && (
          <a
            href={content.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
            style={{ color }}
          >
            <ExternalLink size={13} />
            관련 사이트
          </a>
        )}
        {content.youtubeUrl && (
          <a
            href={content.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
          >
            <Youtube size={13} />
            영상 보기
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
            <textarea value={reportMsg} onChange={e => setReportMsg(e.target.value)} placeholder="어떤 오류가 있나요? (예: 위치가 잘못됨, 설명이 다름)" rows={2}
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

      {showRoadView && (
        <RoadViewModal lat={content.lat} lng={content.lng} name={content.name} onClose={() => setShowRoadView(false)} />
      )}
    </div>
  );
};

export default ContentCard;
