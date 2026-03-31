import { ContentCategory, contentCategoryLabels, contentCategoryColors, contentCategoryIcons } from '@/data/content';

interface CategoryTabsProps {
  activeCategories: ContentCategory[];
  onCategoryToggle: (category: ContentCategory) => void;
}

const categories: ContentCategory[] = ['place', 'story', 'placename', 'heritage', 'pastpresent', 'nature'];

const CategoryTabs = ({ activeCategories, onCategoryToggle }: CategoryTabsProps) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto px-2 py-1.5 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategories.includes(cat);
        const color = contentCategoryColors[cat];
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
