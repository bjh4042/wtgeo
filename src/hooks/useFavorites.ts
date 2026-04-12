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
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch { return []; }
}

function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);
  const [courseName, setCourseName] = useState(() => localStorage.getItem(COURSE_NAME_KEY) || '나의 탐험 코스');

  useEffect(() => {
    localStorage.setItem(COURSE_NAME_KEY, courseName);
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
      saveFavorites(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setFavorites(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      saveFavorites(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite, clearAll, reorder, courseName, setCourseName };
}
