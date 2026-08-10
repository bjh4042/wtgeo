import { X, Star, Trash2, ChevronUp, ChevronDown, MapPin, Navigation } from 'lucide-react';
import { FavoriteItem } from '@/hooks/useFavorites';
import { getMergedPlaces, getMergedContent } from '@/data/dataManager';
import { Place } from '@/data/places';
import { MapContent } from '@/data/content';
import { useState, useMemo } from 'react';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import EmptyState from '@/components/EmptyState';

interface FavoriteCourseProps {
  onClose: () => void;
  onPlaceSelect?: (place: Place) => void;
  onContentSelect?: (content: MapContent) => void;
  favorites: FavoriteItem[];
  removeFavorite: (id: string) => void;
  clearAll: () => void;
  reorder: (from: number, to: number) => void;
  courseName: string;
  setCourseName: (name: string) => void;
}

const FavoriteCourse = ({ onClose, onPlaceSelect, onContentSelect, favorites, removeFavorite, clearAll, reorder, courseName, setCourseName }: FavoriteCourseProps) => {
  const [editingName, setEditingName] = useState(false);
  useModalBehavior(onClose);
  const allPlaces = useMemo(() => getMergedPlaces(), []);
  const allContent = useMemo(() => getMergedContent(), []);

  // Resolve each saved item against current data so renamed places show their
  // up-to-date name, and removed places can be flagged instead of dead-clicking.
  const rows = useMemo(() => favorites.map(item => {
    const source = item.type === 'place'
      ? allPlaces.find(p => p.id === item.id)
      : allContent.find(c => c.id === item.id);
    return { item, source, name: source?.name ?? item.name, available: !!source };
  }), [favorites, allPlaces, allContent]);

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'place') {
      const place = allPlaces.find(p => p.id === item.id);
      if (place && onPlaceSelect) onPlaceSelect(place);
    } else {
      const content = allContent.find(c => c.id === item.id);
      if (content && onContentSelect) onContentSelect(content);
    }
  };

  const totalDistance = useMemo(() => {
    if (favorites.length < 2) return null;
    let total = 0;
    for (let i = 1; i < favorites.length; i++) {
      const prev = favorites[i - 1];
      const curr = favorites[i];
      const R = 6371;
      const dLat = (curr.lat - prev.lat) * Math.PI / 180;
      const dLng = (curr.lng - prev.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(prev.lat * Math.PI / 180) * Math.cos(curr.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    return total < 1 ? `${Math.round(total * 1000)}m` : `${total.toFixed(1)}km`;
  }, [favorites]);


  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex flex-col animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-accent fill-accent" />
            {editingName ? (
              <input
                autoFocus
                value={courseName}
                onChange={e => setCourseName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                className="text-lg font-bold bg-transparent border-b-2 border-primary outline-none text-foreground w-40"
              />
            ) : (
              <h2 className="text-lg font-bold text-foreground cursor-pointer" onClick={() => setEditingName(true)}>
                {courseName}
              </h2>
            )}
          </div>
          <button onClick={onClose} aria-label="내 코스 창 닫기" className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={22} /></button>
        </div>

        {/* Stats */}
        {favorites.length > 0 && (
          <div className="px-4 py-2 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>📍 {favorites.length}곳</span>
            {totalDistance && <span><Navigation size={11} className="inline mr-1" />총 거리: {totalDistance}</span>}
            <button onClick={clearAll} aria-label="내 코스 전체 비우기" className="text-destructive hover:underline cursor-pointer flex items-center gap-1">
              <Trash2 size={11} />전체 삭제
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-auto p-3">
          {favorites.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="아직 담아 둔 장소가 없어요."
              description={'마음에 드는 장소를 찾아 내 코스에 담아 보세요.\n장소 카드에서 ⭐ 버튼을 눌러 추가할 수 있어요.'}
            />
          ) : (
            <div className="space-y-1">
              {rows.map(({ item, name, available }, idx) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-xs font-bold text-primary w-5 text-center flex-shrink-0">{idx + 1}</span>
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={!available}
                    title={available ? name : `${name} (지금은 지도에서 찾을 수 없어요)`}
                    className="flex-1 min-w-0 text-left text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    <MapPin size={12} className="inline mr-1 text-muted-foreground" />
                    {name}
                    {!available && <span className="ml-1 text-[10px] text-muted-foreground">(정보 없음)</span>}
                  </button>
                  {/* Controls stay mounted and visible so touch users can reach them,
                      and their positions never shift while reordering. */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => reorder(idx, idx - 1)}
                      disabled={idx === 0}
                      aria-label={`${name} 위로 이동`}
                      className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:bg-muted rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    ><ChevronUp size={14} /></button>
                    <button
                      onClick={() => reorder(idx, idx + 1)}
                      disabled={idx === rows.length - 1}
                      aria-label={`${name} 아래로 이동`}
                      className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:bg-muted rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    ><ChevronDown size={14} /></button>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      aria-label={`${name} 내 코스에서 빼기`}
                      className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:bg-destructive/10 rounded text-destructive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                    ><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>

        {/* Tip */}
        <div className="p-3 border-t text-xs text-muted-foreground text-center">
          💡 이름을 클릭하면 코스 이름을 변경할 수 있어요
        </div>
      </div>
    </div>
  );
};

export default FavoriteCourse;
