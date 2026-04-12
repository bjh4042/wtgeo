import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ContentCategory, contentCategoryLabels, contentCategoryColors, contentCategoryIcons } from '@/data/content';
import { PlaceCategory, categoryLabels, categoryColors } from '@/data/places';
import { ChevronDown } from 'lucide-react';

interface CategoryTabsProps {
  activeCategories: ContentCategory[];
  onCategoryToggle: (category: ContentCategory) => void;
  activePlaceCategories: PlaceCategory[];
  onPlaceCategoryToggle: (category: PlaceCategory) => void;
}

const categories: ContentCategory[] = ['place', 'story', 'placename', 'heritage', 'pastpresent', 'nature'];
const placeCategories: PlaceCategory[] = ['tourism', 'nature', 'culture', 'public', 'experience', 'market'];

const CategoryTabs = ({ activeCategories, onCategoryToggle, activePlaceCategories, onPlaceCategoryToggle }: CategoryTabsProps) => {
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showPlaceDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [showPlaceDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPlaceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPlaceActive = activeCategories.includes('place');
  const allPlaceCatsActive = activePlaceCategories.length === placeCategories.length;

  return (
    <div className="flex gap-1.5 overflow-x-auto px-2 py-1.5 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategories.includes(cat);
        const color = contentCategoryColors[cat];

        if (cat === 'place') {
          return (
            <div key={cat} className="relative flex-shrink-0">
              <button
                ref={buttonRef}
                onClick={() => {
                  if (!isPlaceActive) {
                    onCategoryToggle('place');
                  }
                  setShowPlaceDropdown(prev => !prev);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  backgroundColor: isPlaceActive ? color : color + '18',
                  color: isPlaceActive ? 'white' : color,
                  boxShadow: isPlaceActive ? `0 2px 8px ${color}40` : 'none',
                }}
              >
                {contentCategoryIcons[cat]} {contentCategoryLabels[cat]}
                <ChevronDown size={12} className={`transition-transform ${showPlaceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showPlaceDropdown && createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed bg-popover border rounded-xl shadow-lg p-2 min-w-[170px] animate-in fade-in-0 zoom-in-95 duration-150"
                  style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                >
                  {/* 전체 선택/해제 */}
                  <button
                    onClick={() => {
                      if (!allPlaceCatsActive) {
                        placeCategories.forEach(pc => {
                          if (!activePlaceCategories.includes(pc)) onPlaceCategoryToggle(pc);
                        });
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted transition-colors mb-1"
                    style={{
                      color: allPlaceCatsActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {allPlaceCatsActive ? '✓ 전체' : '○ 전체'}
                  </button>
                  <div className="h-px bg-border mb-1" />
                  {placeCategories.map((pc) => {
                    const pcActive = activePlaceCategories.includes(pc);
                    const pcColor = categoryColors[pc];
                    return (
                      <button
                        key={pc}
                        onClick={() => onPlaceCategoryToggle(pc)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 flex items-center justify-center"
                          style={{
                            borderColor: pcColor,
                            backgroundColor: pcActive ? pcColor : 'transparent',
                          }}
                        >
                          {pcActive && (
                            <span className="text-[8px] text-white font-bold">✓</span>
                          )}
                        </span>
                        <span style={{ color: pcActive ? pcColor : 'hsl(var(--foreground))' }}>
                          {categoryLabels[pc]}
                        </span>
                      </button>
                    );
                  })}
                </div>,
                document.body
              )}
            </div>
          );
        }

        return (
          <button
            key={cat}
            onClick={() => onCategoryToggle(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              backgroundColor: isActive ? color : color + '18',
              color: isActive ? 'white' : color,
              boxShadow: isActive ? `0 2px 8px ${color}40` : 'none',
            }}
          >
            {contentCategoryIcons[cat]} {contentCategoryLabels[cat]}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
