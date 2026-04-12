import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ContentCategory, contentCategoryLabels, contentCategoryColors, contentCategoryIcons } from '@/data/content';
import { PlaceCategory, PublicSubCategory, categoryLabels, categoryColors, publicSubCategoryLabels, publicSubCategoryColors } from '@/data/places';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CategoryTabsProps {
  activeCategories: ContentCategory[];
  onCategoryToggle: (category: ContentCategory) => void;
  activePlaceCategories: PlaceCategory[];
  onPlaceCategoryToggle: (category: PlaceCategory) => void;
  activePublicSubCategories: PublicSubCategory[] | null;
  onPublicSubCategoryToggle: (sub: PublicSubCategory) => void;
}

const categories: ContentCategory[] = ['place', 'story', 'placename', 'heritage', 'pastpresent', 'nature'];
const placeCategories: PlaceCategory[] = ['tourism', 'nature', 'culture', 'public', 'experience', 'market'];
const publicSubCategories: PublicSubCategory[] = ['government', 'hospital', 'fire', 'police', 'post', 'health', 'education', 'district'];

const CategoryTabs = ({ activeCategories, onCategoryToggle, activePlaceCategories, onPlaceCategoryToggle, activePublicSubCategories, onPublicSubCategoryToggle }: CategoryTabsProps) => {
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [showPublicSub, setShowPublicSub] = useState(false);
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
        setShowPublicSub(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPlaceActive = activeCategories.includes('place');
  const allPlaceCatsActive = activePlaceCategories.length === placeCategories.length && activePublicSubCategories === null;

  const getActiveLabel = (): string | null => {
    if (!isPlaceActive) return null;
    // If filtering by public subcategory
    if (activePublicSubCategories && activePublicSubCategories.length > 0) {
      if (activePublicSubCategories.length === 1) {
        return publicSubCategoryLabels[activePublicSubCategories[0]];
      }
      return `공공기관 ${activePublicSubCategories.length}개`;
    }
    // If filtering by specific place categories
    if (activePlaceCategories.length < placeCategories.length) {
      if (activePlaceCategories.length === 1) {
        return categoryLabels[activePlaceCategories[0]];
      }
      return `${activePlaceCategories.length}개 선택`;
    }
    return null;
  };

  const activeLabel = getActiveLabel();

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
                  if (showPlaceDropdown) setShowPublicSub(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  backgroundColor: isPlaceActive ? color : color + '18',
                  color: isPlaceActive ? 'white' : color,
                  boxShadow: isPlaceActive ? `0 2px 8px ${color}40` : 'none',
                }}
              >
                {contentCategoryIcons[cat]} {activeLabel ? activeLabel : contentCategoryLabels[cat]}
                <ChevronDown size={12} className={`transition-transform ${showPlaceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showPlaceDropdown && createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed bg-popover border rounded-xl shadow-lg p-1.5 min-w-[175px] animate-in fade-in-0 zoom-in-95 duration-150"
                  style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                >
                  {/* 전체 */}
                  <button
                    onClick={() => {
                      // Reset to all categories, no subcategory filter
                      placeCategories.forEach(pc => {
                        if (!activePlaceCategories.includes(pc)) onPlaceCategoryToggle(pc);
                      });
                      // Clear subcategory filter by selecting all subs
                      if (activePublicSubCategories !== null) {
                        publicSubCategories.forEach(sub => {
                          if (activePublicSubCategories && !activePublicSubCategories.includes(sub)) {
                            onPublicSubCategoryToggle(sub);
                          }
                        });
                      }
                      setShowPlaceDropdown(false);
                      setShowPublicSub(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                    style={{
                      color: allPlaceCatsActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {allPlaceCatsActive ? '✓ ' : ''}전체 보기
                  </button>
                  <div className="h-px bg-border my-1" />

                  {placeCategories.map((pc) => {
                    const isActive = activePlaceCategories.includes(pc);
                    const pcColor = categoryColors[pc];

                    if (pc === 'public') {
                      return (
                        <div key={pc}>
                          <button
                            onClick={() => setShowPublicSub(prev => !prev)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: pcColor }}
                            />
                            <span className="flex-1 text-left" style={{ color: pcColor, fontWeight: 600 }}>
                              {categoryLabels[pc]}
                            </span>
                            <ChevronRight size={12} className={`text-muted-foreground transition-transform ${showPublicSub ? 'rotate-90' : ''}`} />
                          </button>

                          {showPublicSub && (
                            <div className="ml-3 pl-2 border-l-2 border-muted mb-1">
                              {/* 공공기관 전체 */}
                              <button
                                onClick={() => {
                                  // Show only public category, all subcategories
                                  placeCategories.forEach(p => {
                                    if (p === 'public' && !activePlaceCategories.includes(p)) onPlaceCategoryToggle(p);
                                    if (p !== 'public' && activePlaceCategories.includes(p)) onPlaceCategoryToggle(p);
                                  });
                                  // Reset subcategory filter
                                  if (activePublicSubCategories !== null) {
                                    publicSubCategories.forEach(sub => {
                                      if (!activePublicSubCategories.includes(sub)) onPublicSubCategoryToggle(sub);
                                    });
                                  }
                                  setShowPlaceDropdown(false);
                                  setShowPublicSub(false);
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium hover:bg-muted transition-colors"
                                style={{
                                  color: isSoloActive ? pcColor : 'hsl(var(--muted-foreground))',
                                }}
                              >
                                전체 공공기관
                              </button>
                              {publicSubCategories.map((sub) => {
                                const subColor = publicSubCategoryColors[sub];
                                const isSubActive = activePublicSubCategories?.includes(sub) && activePlaceCategories.length === 1 && activePlaceCategories.includes('public');
                                return (
                                  <button
                                    key={sub}
                                    onClick={() => {
                                      // Solo select this subcategory
                                      placeCategories.forEach(p => {
                                        if (p === 'public' && !activePlaceCategories.includes(p)) onPlaceCategoryToggle(p);
                                        if (p !== 'public' && activePlaceCategories.includes(p)) onPlaceCategoryToggle(p);
                                      });
                                      onPublicSubCategoryToggle(sub);
                                      setShowPlaceDropdown(false);
                                      setShowPublicSub(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium hover:bg-muted transition-colors"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: subColor }}
                                    />
                                    <span style={{ color: isSubActive ? subColor : 'hsl(var(--foreground))' }}>
                                      {publicSubCategoryLabels[sub]}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={pc}
                        onClick={() => {
                          // Toggle this category
                          onPlaceCategoryToggle(pc);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: pcColor }}
                        />
                        <span style={{ color: isActive ? pcColor : 'hsl(var(--muted-foreground))', fontWeight: isActive ? 700 : 500 }}>
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
