import { X, Star, Trash2, ChevronUp, ChevronDown, MapPin, Navigation } from 'lucide-react';
import { FavoriteItem, useFavorites } from '@/hooks/useFavorites';
import { getMergedPlaces, getMergedContent } from '@/data/dataManager';
import { Place } from '@/data/places';
import { MapContent } from '@/data/content';
import { useState } from 'react';

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
  const allPlaces = getMergedPlaces();
  const allContent = getMergedContent();

  const handleItemClick = (item: FavoriteItem) => {
    if (item.type === 'place') {
      const place = allPlaces.find(p => p.id === item.id);
      if (place && onPlaceSelect) onPlaceSelect(place);
    } else {
      const content = allContent.find(c => c.id === item.id);
      if (content && onContentSelect) onContentSelect(content);
    }
  };

  const getTotalDistance = () => {
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
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-scale-in" onClick={e => e.stopPropagation()}>
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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={22} /></button>
        </div>

        {/* Stats */}
        {favorites.length > 0 && (
          <div className="px-4 py-2 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>📍 {favorites.length}곳</span>
            {getTotalDistance() && <span><Navigation size={11} className="inline mr-1" />총 거리: {getTotalDistance()}</span>}
            <button onClick={clearAll} className="text-destructive hover:underline cursor-pointer flex items-center gap-1">
              <Trash2 size={11} />전체 삭제
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-auto p-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Star size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">즐겨찾기한 장소가 없어요</p>
              <p className="text-xs mt-1">장소 카드에서 ⭐ 버튼을 눌러 추가해보세요!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {favorites.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                  <span className="text-xs font-bold text-primary w-5 text-center flex-shrink-0">{idx + 1}</span>
                  <button
                    onClick={() => handleItemClick(item)}
                    className="flex-1 text-left text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                  >
                    <MapPin size={12} className="inline mr-1 text-muted-foreground" />
                    {item.name}
                  </button>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button onClick={() => reorder(idx, idx - 1)} className="p-1 hover:bg-muted rounded cursor-pointer"><ChevronUp size={14} /></button>
                    )}
                    {idx < favorites.length - 1 && (
                      <button onClick={() => reorder(idx, idx + 1)} className="p-1 hover:bg-muted rounded cursor-pointer"><ChevronDown size={14} /></button>
                    )}
                    <button onClick={() => removeFavorite(item.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive cursor-pointer"><Trash2 size={14} /></button>
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
