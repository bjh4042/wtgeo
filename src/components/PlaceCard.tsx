import { Place, categoryColors, getStaticMapUrl, getRoadViewUrl, getDirectionUrl } from '@/data/places';
import { X, MapPin, Navigation, Eye, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

const PlaceCard = ({ place, onClose }: PlaceCardProps) => {
  const color = categoryColors[place.category];
  const [imgError, setImgError] = useState(false);
  const staticMapUrl = getStaticMapUrl(place.lat, place.lng);
  const roadViewUrl = getRoadViewUrl(place.lat, place.lng);
  const directionUrl = getDirectionUrl(place.lat, place.lng, place.name);

  return (
    <div className="place-card animate-slide-up max-w-sm">
      {/* 장소 사진 (정적 지도) */}
      {!imgError && (
        <div className="relative -mx-4 -mt-4 mb-3 rounded-t-xl overflow-hidden">
          <img
            src={staticMapUrl}
            alt={`${place.name} 위치`}
            className="w-full h-32 object-cover"
            onError={() => setImgError(true)}
          />
          <div
            className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {place.category === 'tourism' && '🏖️ 관광'}
            {place.category === 'nature' && '🌿 자연'}
            {place.category === 'culture' && '🏛️ 문화'}
            {place.category === 'public' && '🏢 관공서'}
            {place.category === 'experience' && '🎒 체험'}
            {place.category === 'market' && '🛒 시장'}
          </div>
        </div>
      )}

      {imgError && (
        <div className="flex items-start justify-between mb-3">
          <span
            className="category-badge"
            style={{ backgroundColor: color + '20', color }}
          >
            {place.category === 'tourism' && '🏖️ 관광'}
            {place.category === 'nature' && '🌿 자연'}
            {place.category === 'culture' && '🏛️ 문화'}
            {place.category === 'public' && '🏢 관공서'}
            {place.category === 'experience' && '🎒 체험'}
            {place.category === 'market' && '🛒 시장'}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-foreground">{place.name}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-2 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {place.description}
      </p>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <MapPin size={14} className="flex-shrink-0" />
        <span>{place.address}</span>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <a
          href={roadViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Eye size={14} />
          로드뷰
        </a>
        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <Navigation size={14} />
          길찾기
        </a>
        <a
          href={`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <ExternalLink size={14} />
          지도
        </a>
      </div>
    </div>
  );
};

export default PlaceCard;