import { Place, PlaceCategory, categoryLabels, categoryColors } from '@/data/places';
import { getMergedPlacesByGrade } from '@/data/dataManager';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface PlaceFilterProps {
  grade: 3 | 4;
  onPlaceSelect: (place: Place) => void;
}

const PlaceFilter = ({ grade, onPlaceSelect }: PlaceFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const places = getMergedPlacesByGrade(grade);
  const categories = Object.keys(categoryLabels) as PlaceCategory[];

  let filteredPlaces = activeCategory
    ? places.filter(p => p.category === activeCategory)
    : places;

  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    filteredPlaces = filteredPlaces.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 검색창 */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="장소 검색..."
          className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

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
        {filteredPlaces.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">검색 결과가 없습니다.</p>
        )}
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
