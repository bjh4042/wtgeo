import { useState, useCallback, useEffect } from 'react';
import { Place } from '@/data/places';
import { MapContent } from '@/data/content';

const FAVORITES_KEY = 'geoje-favorites';
const COURSE_NAME_KEY = 'geoje-course-name';

export interface FavoriteItem {
  id: string;
  type: 'place' | 'content';
  name: string;
  lat: number;
  lng: number;
  addedAt: number;
}

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    // Drop malformed rows and any duplicated ids that older builds may have stored.
    const seen = new Set<string>();
    return raw.filter((f: FavoriteItem) => {
      if (!f || typeof f.id !== 'string' || typeof f.lat !== 'number' || typeof f.lng !== 'number') return false;
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  } catch { return []; }
}

function saveFavorites(items: FavoriteItem[]) {
  // Storage can throw (private mode / quota); never let it break the UI.
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);
  const [courseName, setCourseName] = useState(() => {
    try { return localStorage.getItem(COURSE_NAME_KEY) || '나의 탐험 코스'; } catch { return '나의 탐험 코스'; }
  });

  useEffect(() => {
    try { localStorage.setItem(COURSE_NAME_KEY, courseName); } catch { /* ignore */ }
  }, [courseName]);


  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Place | MapContent) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      let next: FavoriteItem[];
      if (exists) {
        next = prev.filter(f => f.id !== item.id);
      } else {
        const type = 'category' in item ? 'place' : 'content';
        next = [...prev, { id: item.id, type, name: item.name, lat: item.lat, lng: item.lng, addedAt: Date.now() }];
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      if (next.length === prev.length) return prev; // already gone: no re-render
      saveFavorites(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFavorites(prev => {
      if (prev.length === 0) return prev;
      saveFavorites([]);
      return [];
    });
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setFavorites(prev => {
      // Guard against stale indexes from fast repeated clicks: a negative index
      // would make splice() silently move the wrong item.
      if (
        fromIndex === toIndex ||
        fromIndex < 0 || fromIndex >= prev.length ||
        toIndex < 0 || toIndex >= prev.length
      ) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      saveFavorites(next);
      return next;
    });
  }, []);


  return { favorites, isFavorite, toggleFavorite, removeFavorite, clearAll, reorder, courseName, setCourseName };
}
