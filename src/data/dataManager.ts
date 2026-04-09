// Centralized data manager that merges localStorage edits with defaults
import { places as defaultPlaces, Place } from './places';
import { stories, placenames, heritages, pastPresent, natureContent, MapContent, ContentCategory } from './content';
import { schools as defaultSchools, School, getInitialConsonant } from './schools';

const CUSTOM_PLACES_KEY = 'geoje-custom-places';
const CUSTOM_CONTENT_KEY = 'geoje-custom-content';
const PLACE_EDITS_KEY = 'geoje-place-edits';
const CONTENT_EDITS_KEY = 'geoje-content-edits';
const SCHOOL_EDITS_KEY = 'geoje-school-edits';

export const SCHOOLS_UPDATED_EVENT = 'geoje-schools-updated';

function getLocalStorageJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

export function getMergedPlaces(): Place[] {
  const edits = getLocalStorageJSON<Record<string, Partial<Place>>>(PLACE_EDITS_KEY, {});
  const custom = getLocalStorageJSON<Place[]>(CUSTOM_PLACES_KEY, []);

  const merged = defaultPlaces.map(p => {
    const edit = edits[p.id];
    return edit ? { ...p, ...edit } as Place : p;
  });

  return [...merged, ...custom];
}

export function getMergedPlacesByGrade(grade: 3 | 4): Place[] {
  return getMergedPlaces().filter(p => p.grade === grade || p.grade === 'all');
}

export function getMergedContent(): MapContent[] {
  const edits = getLocalStorageJSON<Record<string, Partial<MapContent>>>(CONTENT_EDITS_KEY, {});
  const custom = getLocalStorageJSON<MapContent[]>(CUSTOM_CONTENT_KEY, []);

  const allDefaults = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent];
  const merged = allDefaults.map(c => {
    const edit = edits[c.id];
    return edit ? { ...c, ...edit } as MapContent : c;
  });

  return [...merged, ...custom];
}

export function getMergedContentByCategory(contentType: ContentCategory, grade?: 3 | 4): MapContent[] {
  const all = getMergedContent();
  const filtered = all.filter(c => c.contentType === contentType);
  if (grade) {
    return filtered.filter(i => i.grade === grade || i.grade === 'all');
  }
  return filtered;
}

export function getMergedSchools(): School[] {
  const edits = getLocalStorageJSON<Record<string, Partial<School>>>(SCHOOL_EDITS_KEY, {});

  return defaultSchools.map((school, index) => {
    const edit = edits[String(index)];
    return edit ? { ...school, ...edit } as School : school;
  });
}

export function getMergedSchoolByName(name: string): School | null {
  const mergedSchools = getMergedSchools();
  const exactMatch = mergedSchools.find((school) => school.name === name);
  if (exactMatch) return exactMatch;

  const defaultIndex = defaultSchools.findIndex((school) => school.name === name);
  return defaultIndex >= 0 ? mergedSchools[defaultIndex] : null;
}

export function getMergedAvailableConsonants(): string[] {
  const consonantSet = new Set<string>();

  getMergedSchools().forEach((school) => {
    const initial = getInitialConsonant(school.name[0]);
    consonantSet.add(initial);
  });

  return ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].filter((consonant) => consonantSet.has(consonant));
}

export function filterMergedSchoolsByConsonant(consonant: string): School[] {
  return getMergedSchools().filter((school) => getInitialConsonant(school.name[0]) === consonant);
}
