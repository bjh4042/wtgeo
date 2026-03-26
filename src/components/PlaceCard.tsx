import { Place, categoryColors } from '@/data/places';
import { X, MapPin } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

const PlaceCard = ({ place, onClose }: PlaceCardProps) => {
  const color = categoryColors[place.category];

  return (
    <div className="place-card animate-slide-up max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="category-badge"
            style={{ backgroundColor: color + '20', color }}
          >
            {place.category === 'tourism' && '🏖️ 관광'}
            {place.category === 'nature' && '🌿 자연'}
            {place.category === 'culture' && '🏛️ 문화'}
            {place.category === 'public' && '🏢 관공서'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{place.name}</h3>
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {place.description}
      </p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin size={14} />
        <span>{place.address}</span>
      </div>
    </div>
  );
};

export default PlaceCard;
