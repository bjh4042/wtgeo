import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Place, categoryLabels, categoryColors } from '@/data/places';
import { MapContent, contentCategoryLabels, contentCategoryIcons, contentCategoryColors } from '@/data/content';
import { School } from '@/data/schools';
import { getMergedPlacesByGrade, getMergedContent, getMergedSchools, PLACES_UPDATED_EVENT, CONTENT_UPDATED_EVENT, SCHOOLS_UPDATED_EVENT } from '@/data/dataManager';

interface PlaceSearchBarProps {
  grade: 3 | 4;
  onPlaceSelect: (place: Place) => void;
  onContentSelect: (content: MapContent) => void;
  onSchoolSelect?: (school: School) => void;
}

type SearchResult =
  | { kind: 'place'; item: Place }
  | { kind: 'content'; item: MapContent }
  | { kind: 'school'; item: School };

const MAX_RESULTS = 10;

const PlaceSearchBar = ({ grade, onPlaceSelect, onContentSelect }: PlaceSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [version, setVersion] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refresh when data updates
  useEffect(() => {
    const bump = () => setVersion(v => v + 1);
    window.addEventListener(PLACES_UPDATED_EVENT, bump);
    window.addEventListener(CONTENT_UPDATED_EVENT, bump);
    return () => {
      window.removeEventListener(PLACES_UPDATED_EVENT, bump);
      window.removeEventListener(CONTENT_UPDATED_EVENT, bump);
    };
  }, []);

  const dataset = useMemo<SearchResult[]>(() => {
    const places = getMergedPlacesByGrade(grade).map(item => ({ kind: 'place' as const, item }));
    const contents = getMergedContent()
      .filter(c => c.grade === grade || c.grade === 'all')
      .map(item => ({ kind: 'content' as const, item }));
    return [...places, ...contents];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, version]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored: { r: SearchResult; score: number }[] = [];
    for (const r of dataset) {
      const name = r.item.name.toLowerCase();
      const desc = r.kind === 'school' ? '' : ((r.item as Place | MapContent).description || '').toLowerCase();
      const addr = (r.kind === 'place' || r.kind === 'school') ? (r.item.address || '').toLowerCase() : '';
      let score = 0;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 80;
      else if (addr.includes(q)) score = 50;
      else if (desc.includes(q)) score = 20;
      if (score > 0) scored.push({ r, score });
    }
    scored.sort((a, b) => b.score - a.score || a.r.item.name.localeCompare(b.r.item.name));
    return scored.slice(0, MAX_RESULTS).map(s => s.r);
  }, [query, dataset]);

  // Click outside to close
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => { setHighlight(0); }, [query]);

  const pick = (r: SearchResult) => {
    if (r.kind === 'place') onPlaceSelect(r.item);
    else if (r.kind === 'content') onContentSelect(r.item);
    else if (r.kind === 'school') onSchoolSelect?.(r.item);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(results[highlight]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={containerRef} className="relative w-40 sm:w-56 md:w-64">
      <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none md:w-3.5 md:h-3.5" />
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="장소 검색..."
        className="w-full pl-7 pr-7 py-1.5 rounded-full border bg-background text-foreground text-[11px] md:text-xs focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); setOpen(false); }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="검색어 지우기"
        >
          <X size={12} />
        </button>
      )}

      {open && query.trim() && (
        <div className="absolute right-0 mt-1 w-72 sm:w-80 max-h-80 overflow-auto rounded-lg border bg-popover text-popover-foreground shadow-xl z-50">
          {results.length === 0 ? (
            <div className="px-3 py-4 text-xs text-muted-foreground text-center">검색 결과가 없습니다.</div>
          ) : (
            <ul className="py-1">
              {results.map((r, idx) => {
                let color: string;
                let label: string;
                let sub: string;
                let key: string;
                if (r.kind === 'place') {
                  color = categoryColors[r.item.category];
                  label = categoryLabels[r.item.category];
                  sub = r.item.address || '';
                  key = `place-${r.item.id}`;
                } else if (r.kind === 'content') {
                  color = contentCategoryColors[r.item.contentType];
                  label = `${contentCategoryIcons[r.item.contentType]} ${contentCategoryLabels[r.item.contentType]}`;
                  sub = r.item.description?.slice(0, 40) || '';
                  key = `content-${r.item.id}`;
                } else {
                  color = '#6A1B9A';
                  label = '🏫 초등학교';
                  sub = r.item.address || '';
                  key = `school-${r.item.name}`;
                }
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => pick(r)}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2 transition-colors ${idx === highlight ? 'bg-accent/30' : 'hover:bg-accent/20'}`}
                    >
                      <span className="mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-foreground truncate">{r.item.name}</span>
                        <span className="block text-[10px] text-muted-foreground truncate">{label}{sub ? ` · ${sub}` : ''}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceSearchBar;
