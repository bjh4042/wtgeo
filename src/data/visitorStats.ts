// Visitor statistics tracking with hourly data
const HOURLY_STATS_KEY = 'geoje-visitor-hourly';
const DAILY_STATS_KEY = 'geoje-visitor-daily';

interface HourlyRecord {
  [hour: string]: number; // "2025-04-05-14" => count
}

interface DailyRecord {
  [date: string]: number; // "2025-04-05" => count
}

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCurrentHourKey(): string {
  const d = new Date();
  return `${getToday()}-${String(d.getHours()).padStart(2, '0')}`;
}

export function recordVisit(): void {
  const sessionKey = 'geoje-visit-recorded-hour';
  const hourKey = getCurrentHourKey();
  if (sessionStorage.getItem(sessionKey) === hourKey) return;
  sessionStorage.setItem(sessionKey, hourKey);

  // Hourly
  try {
    const hourly: HourlyRecord = JSON.parse(localStorage.getItem(HOURLY_STATS_KEY) || '{}');
    hourly[hourKey] = (hourly[hourKey] || 0) + 1;
    // Keep only last 7 days
    const keys = Object.keys(hourly).sort();
    const cutoff = keys.length > 168 ? keys.slice(0, keys.length - 168) : [];
    cutoff.forEach(k => delete hourly[k]);
    localStorage.setItem(HOURLY_STATS_KEY, JSON.stringify(hourly));
  } catch {}

  // Daily
  try {
    const daily: DailyRecord = JSON.parse(localStorage.getItem(DAILY_STATS_KEY) || '{}');
    const today = getToday();
    daily[today] = (daily[today] || 0) + 1;
    // Keep only last 30 days
    const keys = Object.keys(daily).sort();
    const cutoff = keys.length > 30 ? keys.slice(0, keys.length - 30) : [];
    cutoff.forEach(k => delete daily[k]);
    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(daily));
  } catch {}
}

export function getHourlyStats(): { hour: string; count: number }[] {
  try {
    const hourly: HourlyRecord = JSON.parse(localStorage.getItem(HOURLY_STATS_KEY) || '{}');
    const today = getToday();
    const result: { hour: string; count: number }[] = [];
    for (let h = 0; h < 24; h++) {
      const key = `${today}-${String(h).padStart(2, '0')}`;
      result.push({ hour: `${h}시`, count: hourly[key] || 0 });
    }
    return result;
  } catch { return []; }
}

export function getDailyStats(): { date: string; count: number }[] {
  try {
    const daily: DailyRecord = JSON.parse(localStorage.getItem(DAILY_STATS_KEY) || '{}');
    return Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({
        date: date.slice(5), // "04-05"
        count,
      }));
  } catch { return []; }
}

export function getTotalVisitors(): number {
  try {
    const daily: DailyRecord = JSON.parse(localStorage.getItem(DAILY_STATS_KEY) || '{}');
    return Object.values(daily).reduce((a, b) => a + b, 0);
  } catch { return 0; }
}

export function getTodayVisitors(): number {
  try {
    const daily: DailyRecord = JSON.parse(localStorage.getItem(DAILY_STATS_KEY) || '{}');
    return daily[getToday()] || 0;
  } catch { return 0; }
}
