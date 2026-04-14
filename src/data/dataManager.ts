// Centralized data manager that merges cloud DB edits with defaults
import { places as defaultPlaces, Place, PlaceCategory } from './places';
import { stories, placenames, heritages, pastPresent, natureContent, MapContent, ContentCategory } from './content';
import { schools as defaultSchools, School, getInitialConsonant } from './schools';
import { supabase } from '@/integrations/supabase/client';


export const SCHOOLS_UPDATED_EVENT = 'geoje-schools-updated';
export const PLACES_UPDATED_EVENT = 'geoje-places-updated';
export const CONTENT_UPDATED_EVENT = 'geoje-content-updated';

// ─── In-memory caches ───
let placeEditsCache: Record<string, Partial<Place>> = {};
let customPlacesCache: Place[] = [];
let contentEditsCache: Record<string, Partial<MapContent>> = {};
let customContentCache: MapContent[] = [];
let schoolEditsCache: Record<number, Partial<School>> = {};
let deletedPlaceIdsCache: string[] = [];
let siteSettingsCache: Record<string, any> = {};

let dataLoaded = false;

// ─── Load all data from cloud ───
export async function loadAllDataFromCloud(): Promise<void> {
  try {
    const [peRes, cpRes, ceRes, ccRes, seRes, ssRes] = await Promise.all([
      supabase.from('place_edits').select('*'),
      supabase.from('custom_places').select('*'),
      supabase.from('content_edits').select('*'),
      supabase.from('custom_content').select('*'),
      supabase.from('school_edits').select('*'),
      supabase.from('site_settings').select('*'),
    ]);

    // Place edits
    if (peRes.data) {
      const edits: Record<string, Partial<Place>> = {};
      peRes.data.forEach((row: any) => {
        const edit: any = {};
        if (row.name) edit.name = row.name;
        if (row.description) edit.description = row.description;
        if (row.address) edit.address = row.address;
        if (row.lat != null) edit.lat = Number(row.lat);
        if (row.lng != null) edit.lng = Number(row.lng);
        if (row.category) edit.category = row.category;
        if (row.image_url) edit.imageUrl = row.image_url;
        if (row.origin) edit.origin = row.origin;
        if (row.reference_url) edit.referenceUrl = row.reference_url;
        if (row.youtube_url) edit.youtubeUrl = row.youtube_url;
        if (row.sub_category) edit.subCategory = row.sub_category;
        if (row.grade) edit.grade = row.grade === 'all' ? 'all' : Number(row.grade);
        edits[row.place_id] = edit;
      });
      placeEditsCache = edits;
    }

    // Custom places
    if (cpRes.data) {
      customPlacesCache = cpRes.data.map((row: any) => ({
        id: row.place_id,
        name: row.name,
        description: row.description || '',
        address: row.address || '',
        lat: Number(row.lat),
        lng: Number(row.lng),
        category: row.category as PlaceCategory,
        imageUrl: row.image_url || undefined,
        origin: row.origin || undefined,
        referenceUrl: row.reference_url || undefined,
        youtubeUrl: row.youtube_url || undefined,
        subCategory: row.sub_category || undefined,
        grade: row.grade === 'all' ? 'all' : Number(row.grade || 3),
      })) as Place[];
    }

    // Content edits
    if (ceRes.data) {
      const edits: Record<string, Partial<MapContent>> = {};
      ceRes.data.forEach((row: any) => {
        const edit: any = {};
        if (row.name) edit.name = row.name;
        if (row.description) edit.description = row.description;
        if (row.lat != null) edit.lat = Number(row.lat);
        if (row.lng != null) edit.lng = Number(row.lng);
        if (row.content_type) edit.contentType = row.content_type;
        if (row.icon) edit.icon = row.icon;
        if (row.image_url) edit.imageUrl = row.image_url;
        if (row.source) edit.source = row.source;
        if (row.reference_url) edit.referenceUrl = row.reference_url;
        if (row.youtube_url) edit.youtubeUrl = row.youtube_url;
        if (row.grade) edit.grade = row.grade === 'all' ? 'all' : Number(row.grade);
        edits[row.content_id] = edit;
      });
      contentEditsCache = edits;
    }

    // Custom content
    if (ccRes.data) {
      customContentCache = ccRes.data.map((row: any) => ({
        id: row.content_id,
        name: row.name,
        description: row.description || '',
        lat: Number(row.lat),
        lng: Number(row.lng),
        contentType: row.content_type as ContentCategory,
        icon: row.icon || '📍',
        imageUrl: row.image_url || undefined,
        source: row.source || undefined,
        referenceUrl: row.reference_url || undefined,
        youtubeUrl: row.youtube_url || undefined,
        grade: row.grade === 'all' ? 'all' : Number(row.grade || 3),
      })) as MapContent[];
    }

    // School edits
    if (seRes.data) {
      const edits: Record<number, Partial<School>> = {};
      seRes.data.forEach((row: any) => {
        const edit: any = {};
        if (row.name) edit.name = row.name;
        if (row.address) edit.address = row.address;
        if (row.lat != null) edit.lat = Number(row.lat);
        if (row.lng != null) edit.lng = Number(row.lng);
        if (row.phone) edit.phone = row.phone;
        if (row.district) edit.district = row.district;
        if (row.website) edit.website = row.website;
        edits[row.school_index] = edit;
      });
      schoolEditsCache = edits;
    }

    // Site settings
    if (ssRes.data) {
      ssRes.data.forEach((row: any) => {
        siteSettingsCache[row.key] = row.value;
      });
      const deletedPlaceIds = siteSettingsCache['deleted_place_ids'];
      deletedPlaceIdsCache = Array.isArray(deletedPlaceIds)
        ? deletedPlaceIds.filter((id: unknown): id is string => typeof id === 'string')
        : [];
    }


    dataLoaded = true;
  } catch (e) {
    console.error('Failed to load data from cloud, falling back to localStorage:', e);
    loadFromLocalStorage();
    dataLoaded = true;
  }
}

function loadFromLocalStorage() {
  try {
    const pe = localStorage.getItem('geoje-place-edits');
    if (pe) placeEditsCache = JSON.parse(pe);
    const cp = localStorage.getItem('geoje-custom-places');
    if (cp) customPlacesCache = JSON.parse(cp);
    const ce = localStorage.getItem('geoje-content-edits');
    if (ce) contentEditsCache = JSON.parse(ce);
    const cc = localStorage.getItem('geoje-custom-content');
    if (cc) customContentCache = JSON.parse(cc);
    const se = localStorage.getItem('geoje-school-edits');
    if (se) schoolEditsCache = JSON.parse(se);
    const dp = localStorage.getItem('geoje-deleted-places');
    if (dp) deletedPlaceIdsCache = JSON.parse(dp);
  } catch {}
}

export function isDataLoaded(): boolean { return dataLoaded; }

// ─── Place operations ───
export function getMergedPlaces(): Place[] {
  const merged = defaultPlaces
    .filter(p => !deletedPlaceIdsCache.includes(p.id))
    .map(p => {
      const edit = placeEditsCache[p.id];
      return edit ? { ...p, ...edit } as Place : p;
    });
  return [...merged, ...customPlacesCache];
}

export function getMergedPlacesByGrade(grade: 3 | 4): Place[] {
  return getMergedPlaces().filter(p => p.grade === grade || p.grade === 'all');
}

export async function savePlaceEdit(placeId: string, edit: Partial<Place>): Promise<void> {
  placeEditsCache[placeId] = { ...placeEditsCache[placeId], ...edit };
  localStorage.setItem('geoje-place-edits', JSON.stringify(placeEditsCache));
  try {
    const row: any = { place_id: placeId, updated_at: new Date().toISOString() };
    const merged = { ...placeEditsCache[placeId] };
    if (merged.name) row.name = merged.name;
    if (merged.description) row.description = merged.description;
    if (merged.address) row.address = merged.address;
    if (merged.lat != null) row.lat = merged.lat;
    if (merged.lng != null) row.lng = merged.lng;
    if (merged.category) row.category = merged.category;
    if (merged.imageUrl) row.image_url = merged.imageUrl;
    if (merged.origin) row.origin = merged.origin;
    if (merged.referenceUrl) row.reference_url = merged.referenceUrl;
    if (merged.youtubeUrl) row.youtube_url = merged.youtubeUrl;
    if (merged.subCategory) row.sub_category = merged.subCategory;
    if (merged.grade != null) row.grade = String(merged.grade);
    await supabase.from('place_edits').upsert(row, { onConflict: 'place_id' });
  } catch (e) { console.error('Failed to save place edit:', e); }
  window.dispatchEvent(new Event(PLACES_UPDATED_EVENT));
}

export async function saveCustomPlace(place: Place): Promise<void> {
  const idx = customPlacesCache.findIndex(p => p.id === place.id);
  if (idx >= 0) customPlacesCache[idx] = place;
  else customPlacesCache.push(place);
  localStorage.setItem('geoje-custom-places', JSON.stringify(customPlacesCache));
  try {
    await supabase.from('custom_places').upsert({
      place_id: place.id,
      name: place.name,
      description: place.description,
      address: place.address || '',
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      image_url: place.imageUrl || null,
      origin: place.origin || null,
      reference_url: place.referenceUrl || null,
      youtube_url: place.youtubeUrl || null,
      sub_category: (place as any).subCategory || null,
      grade: String(place.grade || 'all'),
    }, { onConflict: 'place_id' });
  } catch (e) { console.error('Failed to save custom place:', e); }
  window.dispatchEvent(new Event(PLACES_UPDATED_EVENT));
}

export async function deletePlace(placeId: string): Promise<void> {
  const isDefaultPlace = defaultPlaces.some(p => p.id === placeId);

  if (!isDefaultPlace) {
    customPlacesCache = customPlacesCache.filter(p => p.id !== placeId);
    localStorage.setItem('geoje-custom-places', JSON.stringify(customPlacesCache));
    try {
      await supabase.from('custom_places').delete().eq('place_id', placeId);
    } catch (e) { console.error('Failed to delete custom place:', e); }
    window.dispatchEvent(new Event(PLACES_UPDATED_EVENT));
    return;
  }

  deletedPlaceIdsCache = Array.from(new Set([...deletedPlaceIdsCache, placeId]));
  delete placeEditsCache[placeId];
  localStorage.setItem('geoje-place-edits', JSON.stringify(placeEditsCache));
  localStorage.setItem('geoje-deleted-places', JSON.stringify(deletedPlaceIdsCache));

  try {
    await Promise.all([
      supabase.from('place_edits').delete().eq('place_id', placeId),
      supabase.from('site_settings').upsert({
        key: 'deleted_place_ids',
        value: deletedPlaceIdsCache,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' }),
    ]);
  } catch (e) { console.error('Failed to delete place:', e); }

  window.dispatchEvent(new Event(PLACES_UPDATED_EVENT));
}

// ─── Content operations ───
export function getMergedContent(): MapContent[] {
  const deletedContentIds: string[] = Array.isArray(siteSettingsCache['deleted_content_ids'])
    ? siteSettingsCache['deleted_content_ids'].filter((id: unknown): id is string => typeof id === 'string')
    : [];
  const allDefaults = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent]
    .filter(c => !deletedContentIds.includes(c.id));
  const merged = allDefaults.map(c => {
    const edit = contentEditsCache[c.id];
    return edit ? { ...c, ...edit } as MapContent : c;
  });
  return [...merged, ...customContentCache];
}

export function getMergedContentByCategory(contentType: ContentCategory, grade?: 3 | 4): MapContent[] {
  const all = getMergedContent();
  const filtered = all.filter(c => c.contentType === contentType);
  if (grade) return filtered.filter(i => i.grade === grade || i.grade === 'all');
  return filtered;
}

export async function saveContentEdit(contentId: string, edit: Partial<MapContent>): Promise<void> {
  contentEditsCache[contentId] = { ...contentEditsCache[contentId], ...edit };
  localStorage.setItem('geoje-content-edits', JSON.stringify(contentEditsCache));
  try {
    const row: any = { content_id: contentId, updated_at: new Date().toISOString() };
    const merged = { ...contentEditsCache[contentId] };
    if (merged.name) row.name = merged.name;
    if (merged.description) row.description = merged.description;
    if (merged.lat != null) row.lat = merged.lat;
    if (merged.lng != null) row.lng = merged.lng;
    if (merged.contentType) row.content_type = merged.contentType;
    if (merged.icon) row.icon = merged.icon;
    if (merged.imageUrl) row.image_url = merged.imageUrl;
    if (merged.source) row.source = merged.source;
    if (merged.referenceUrl) row.reference_url = merged.referenceUrl;
    if (merged.youtubeUrl) row.youtube_url = merged.youtubeUrl;
    if (merged.grade != null) row.grade = String(merged.grade);
    await supabase.from('content_edits').upsert(row, { onConflict: 'content_id' });
  } catch (e) { console.error('Failed to save content edit:', e); }
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}

export async function saveCustomContent(content: MapContent): Promise<void> {
  const idx = customContentCache.findIndex(c => c.id === content.id);
  if (idx >= 0) customContentCache[idx] = content;
  else customContentCache.push(content);
  localStorage.setItem('geoje-custom-content', JSON.stringify(customContentCache));
  try {
    await supabase.from('custom_content').upsert({
      content_id: content.id,
      name: content.name,
      description: content.description,
      lat: content.lat,
      lng: content.lng,
      content_type: content.contentType,
      icon: content.icon || '📍',
      image_url: content.imageUrl || null,
      source: content.source || null,
      reference_url: content.referenceUrl || null,
      youtube_url: content.youtubeUrl || null,
      grade: String(content.grade || 'all'),
    }, { onConflict: 'content_id' });
  } catch (e) { console.error('Failed to save custom content:', e); }
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}

export async function deleteContent(contentId: string): Promise<void> {
  const allDefault = [...stories, ...placenames, ...heritages, ...pastPresent, ...natureContent];
  const isDefault = allDefault.some(c => c.id === contentId);

  if (!isDefault) {
    // Custom content - just remove it
    customContentCache = customContentCache.filter(c => c.id !== contentId);
    localStorage.setItem('geoje-custom-content', JSON.stringify(customContentCache));
    try {
      await supabase.from('custom_content').delete().eq('content_id', contentId);
    } catch (e) { console.error('Failed to delete custom content:', e); }
    window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
    return;
  }

  // Default content - use tombstone
  let deletedContentIds: string[] = [];
  const existing = siteSettingsCache['deleted_content_ids'];
  if (Array.isArray(existing)) {
    deletedContentIds = existing.filter((id: unknown): id is string => typeof id === 'string');
  }
  deletedContentIds = Array.from(new Set([...deletedContentIds, contentId]));
  siteSettingsCache['deleted_content_ids'] = deletedContentIds;
  delete contentEditsCache[contentId];
  localStorage.setItem('geoje-content-edits', JSON.stringify(contentEditsCache));

  try {
    await Promise.all([
      supabase.from('content_edits').delete().eq('content_id', contentId),
      supabase.from('site_settings').upsert({
        key: 'deleted_content_ids',
        value: deletedContentIds,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' }),
    ]);
  } catch (e) { console.error('Failed to delete content:', e); }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}

export async function deleteCustomContent(contentId: string): Promise<void> {
  return deleteContent(contentId);
}

// ─── School operations ───
export function getMergedSchools(): School[] {
  return defaultSchools.map((school, index) => {
    const edit = schoolEditsCache[index];
    return edit ? { ...school, ...edit } as School : school;
  });
}

export function getMergedSchoolByName(name: string): School | null {
  const mergedSchools = getMergedSchools();
  const exactMatch = mergedSchools.find(s => s.name === name);
  if (exactMatch) return exactMatch;
  const defaultIndex = defaultSchools.findIndex(s => s.name === name);
  return defaultIndex >= 0 ? mergedSchools[defaultIndex] : null;
}

export async function saveSchoolEdit(index: number, edit: Partial<School>): Promise<void> {
  schoolEditsCache[index] = { ...schoolEditsCache[index], ...edit };
  localStorage.setItem('geoje-school-edits', JSON.stringify(schoolEditsCache));
  try {
    const row: any = { school_index: index, updated_at: new Date().toISOString() };
    const merged = { ...schoolEditsCache[index] };
    if (merged.name) row.name = merged.name;
    if (merged.address) row.address = merged.address;
    if (merged.lat != null) row.lat = merged.lat;
    if (merged.lng != null) row.lng = merged.lng;
    if (merged.phone) row.phone = merged.phone;
    if (merged.district) row.district = merged.district;
    if (merged.website) row.website = merged.website;
    await supabase.from('school_edits').upsert(row, { onConflict: 'school_index' });
  } catch (e) { console.error('Failed to save school edit:', e); }
  window.dispatchEvent(new Event(SCHOOLS_UPDATED_EVENT));
}

// ─── Site settings ───
export function getNotice(): string | null {
  const cached = siteSettingsCache['notice'];
  if (cached) return typeof cached === 'string' ? cached : JSON.stringify(cached);
  return null;
}

export async function getNoticeFromCloud(): Promise<string | null> {
  try {
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'notice').maybeSingle();
    if (data?.value) {
      const val = data.value;
      const notice = typeof val === 'string' ? val : (typeof val === 'object' ? JSON.stringify(val) : String(val));
      // Remove wrapping quotes if JSON-stringified string
      const parsed = notice.startsWith('"') ? JSON.parse(notice) : notice;
      siteSettingsCache['notice'] = parsed;
      return parsed || null;
    }
  } catch (e) { console.error('Failed to fetch notice:', e); }
  return null;
}

export async function saveNotice(notice: string | null): Promise<void> {
  if (notice) {
    siteSettingsCache['notice'] = notice;
    localStorage.setItem('geoje-explorer-notice', notice);
  } else {
    delete siteSettingsCache['notice'];
    localStorage.removeItem('geoje-explorer-notice');
  }
  try {
    if (notice) {
      await supabase.from('site_settings').upsert({ key: 'notice', value: JSON.stringify(notice), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    } else {
      await supabase.from('site_settings').delete().eq('key', 'notice');
    }
  } catch (e) { console.error('Failed to save notice:', e); }
}

export function getSiteInfo(): { serviceName: string; version: string; devTool: string; mapApi: string; dataSource: string; siteNotice: string; devName: string; devTitle1: string; devTitle2: string; devTitle3: string; devEmail: string } {
  const DEFAULT = {
    serviceName: '거제탐험대', version: '1.0', devTool: 'Lovable', mapApi: 'Kakao MAP',
    dataSource: '공식 웹페이지',
    siteNotice: '알림: 본 웹서비스는 타이핑 및 조사 학습이 제한적인 학생들을 위하여 학생들의 개인정보를 수집하지 않고, 성취기준과 별도로 우리 지역 거제를 쉽고 재미있게 탐험하기 위해 제작되었습니다. 데이터 수집 및 제작 시점에 따라 실제 장소의 내용이 다소 상이할 수 있으므로 사실 정보는 검색 엔진을 적극 활용하시길 바랍니다.',
    devName: '수박쌤', devTitle1: '경남 초등학교 교사', devTitle2: '참쌤스쿨 크루', devTitle3: '교사 크리에이터 협회 회원', devEmail: 'bjh4042@naver.com',
  };
  const cloud = siteSettingsCache['site_info'];
  if (cloud) return { ...DEFAULT, ...(typeof cloud === 'string' ? JSON.parse(cloud) : cloud) };
  try {
    const saved = localStorage.getItem('geoje-site-info');
    if (saved) return { ...DEFAULT, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT;
}

export async function saveSiteInfo(info: any): Promise<void> {
  siteSettingsCache['site_info'] = info;
  localStorage.setItem('geoje-site-info', JSON.stringify(info));
  try {
    await supabase.from('site_settings').upsert({ key: 'site_info', value: info, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch (e) { console.error('Failed to save site info:', e); }
}

export function getVisitorCount(): number {
  const cloud = siteSettingsCache['visitor_count'];
  if (cloud) return typeof cloud === 'number' ? cloud : parseInt(String(cloud), 10) || 0;
  return parseInt(localStorage.getItem('geoje-explorer-visitors') || '0', 10);
}

export function getTodayVisitorCount(): number {
  // Check both old and new key names (DB function uses 'visitor_today')
  const cloud = siteSettingsCache['today_visitor_count'] || siteSettingsCache['visitor_today'];
  if (cloud && typeof cloud === 'object' && cloud !== null) {
    const { date, count } = cloud as { date: string; count: number };
    const today = new Date().toISOString().slice(0, 10);
    if (date === today) return count || 0;
  }
  return 0;
}

export function getCloudHourlyStats(): { hour: string; count: number }[] {
  const cloud = (siteSettingsCache['hourly_visitor_stats'] || siteSettingsCache['visitor_hourly']) as Record<string, number> | undefined;
  const today = new Date().toISOString().slice(0, 10);
  const result: { hour: string; count: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const key = `${today}-${String(h).padStart(2, '0')}`;
    result.push({ hour: `${h}시`, count: cloud?.[key] || 0 });
  }
  return result;
}

export function getCloudDailyStats(): { date: string; count: number }[] {
  const cloud = (siteSettingsCache['daily_visitor_stats'] || siteSettingsCache['visitor_daily']) as Record<string, number> | undefined;
  if (!cloud) return [];
  return Object.entries(cloud)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date: date.slice(5), count }));
}

export async function incrementVisitorCount(): Promise<number> {
  const sessionKey = 'geoje-explorer-visited';
  if (sessionStorage.getItem(sessionKey)) return getVisitorCount();
  sessionStorage.setItem(sessionKey, 'true');

  try {
    // Atomic increment via DB function — no race conditions
    await supabase.rpc('increment_visitor');

    // Refresh caches from DB after atomic update
    const { data } = await supabase.from('site_settings')
      .select('key, value')
      .in('key', ['visitor_count', 'visitor_today', 'visitor_hourly', 'visitor_daily']);

    if (data) {
      data.forEach((row: any) => {
        if (row.key === 'visitor_count') siteSettingsCache['visitor_count'] = row.value;
        if (row.key === 'visitor_today') siteSettingsCache['today_visitor_count'] = row.value;
        if (row.key === 'visitor_hourly') siteSettingsCache['hourly_visitor_stats'] = row.value;
        if (row.key === 'visitor_daily') siteSettingsCache['daily_visitor_stats'] = row.value;
      });
    }
  } catch (e) { console.error('Failed to increment visitor:', e); }

  return getVisitorCount();
}

// ─── Consonant helpers ───
export function getMergedAvailableConsonants(): string[] {
  const consonantSet = new Set<string>();
  getMergedSchools().forEach(school => {
    const initial = getInitialConsonant(school.name[0]);
    consonantSet.add(initial);
  });
  return ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].filter(c => consonantSet.has(c));
}

export function filterMergedSchoolsByConsonant(consonant: string): School[] {
  return getMergedSchools().filter(school => getInitialConsonant(school.name[0]) === consonant);
}
