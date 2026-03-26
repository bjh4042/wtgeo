import { Place, PlaceCategory, categoryLabels, categoryColors, getPlacesByGrade } from '@/data/places';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface PlaceFilterProps {
  grade: 3 | 4;
  onPlaceSelect: (place: Place) => void;
}

const PlaceFilter = ({ grade, onPlaceSelect }: PlaceFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(null);
  const places = getPlacesByGrade(grade);
  const categories = Object.keys(categoryLabels) as PlaceCategory[];

  const filteredPlaces = activeCategory
    ? places.filter(p => p.category === activeCategory)
    : places;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Filter size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">장소 필터</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`category-badge cursor-pointer transition-all ${!activeCategory ? 'ring-2 ring-primary' : ''}`}
          style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
          onClick={() => setActiveCategory(null)}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-badge cursor-pointer transition-all ${activeCategory === cat ? 'ring-2 ring-offset-1' : ''}`}
            style={{
              backgroundColor: categoryColors[cat] + '20',
              color: categoryColors[cat],
              ...(activeCategory === cat ? { ringColor: categoryColors[cat] } : {}),
            }}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>
      <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1 mt-1">
        {filteredPlaces.map((place) => (
          <button
            key={place.id}
            className="text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-sm flex items-center gap-2"
            onClick={() => onPlaceSelect(place)}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: categoryColors[place.category] }}
            />
            <span className="font-medium text-foreground">{place.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaceFilter;
