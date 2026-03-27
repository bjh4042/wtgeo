import { Place, categoryColors, categoryIcons, getRoadViewUrl, getDirectionUrl, getDistance, getEstimatedTime } from '@/data/places';
import { School } from '@/data/schools';
import { X, MapPin, Navigation, Eye, ExternalLink, Clock, Route, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface PlaceCardProps {
  place: Place;
  school: School;
  onClose: () => void;
}

const PlaceCard = ({ place, school, onClose }: PlaceCardProps) => {
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];
  const [imgError, setImgError] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);
  const roadViewUrl = getRoadViewUrl(place.lat, place.lng);
  const directionUrl = getDirectionUrl(place.lat, place.lng, place.name);

  const distanceKm = getDistance(school.lat, school.lng, place.lat, place.lng);
  const estimatedTime = getEstimatedTime(distanceKm);
  const distanceText = distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`;

  const categoryLabel = place.category === 'tourism' ? '관광' : place.category === 'nature' ? '자연' : place.category === 'culture' ? '문화' : place.category === 'public' ? '관공서' : place.category === 'experience' ? '체험' : '시장';

  return (
    <div className="place-card animate-slide-up max-w-sm">
      {/* 장소 사진 */}
      {place.imageUrl && !imgError ? (
        <div className="relative -mx-4 -mt-4 mb-3 rounded-t-xl overflow-hidden">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-36 object-cover"
            onError={() => setImgError(true)}
          />
          <div
            className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {icon} {categoryLabel}
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between mb-3">
          <span
            className="category-badge text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: color + '20', color }}
          >
            {icon} {categoryLabel}
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

      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
        {place.description}
      </p>

      {/* 유래 정보 */}
      {place.origin && (
        <div className="mb-2">
          <button
            onClick={() => setShowOrigin(!showOrigin)}
            className="flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
            style={{ color }}
          >
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

      {/* 거리 및 이동시간 */}
      <div className="flex items-center gap-3 text-xs mb-3 px-2 py-1.5 rounded-lg bg-muted/50">
        <span className="flex items-center gap-1 text-primary font-medium">
          <Route size={13} />
          {distanceText}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock size={13} />
          🚗 {estimatedTime}
        </span>
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
