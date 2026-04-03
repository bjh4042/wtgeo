import { MapContent, contentCategoryColors, contentCategoryIcons, contentCategoryLabels } from '@/data/content';
import { X, ExternalLink, Youtube } from 'lucide-react';
import { useState } from 'react';

interface ContentCardProps {
  content: MapContent;
  onClose: () => void;
}

const ContentCard = ({ content, onClose }: ContentCardProps) => {
  const color = contentCategoryColors[content.contentType];
  const icon = contentCategoryIcons[content.contentType];
  const label = contentCategoryLabels[content.contentType];
  const [imgError, setImgError] = useState(false);

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
        {content.referenceUrl && (
          <a
            href={content.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
            style={{ color }}
          >
            <ExternalLink size={13} />
            관련 사이트 바로가기
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
    </div>
  );
};

export default ContentCard;
