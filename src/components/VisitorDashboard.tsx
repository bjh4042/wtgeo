import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getVisitorCount, getTodayVisitorCount, getCloudHourlyStats, getCloudDailyStats } from '@/data/dataManager';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RangePreset = 'today' | '7d' | '30d' | 'custom';

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const VisitorDashboard = () => {
  const [preset, setPreset] = useState<RangePreset>('7d');
  const [customStart, setCustomStart] = useState<string>(daysAgoISO(6));
  const [customEnd, setCustomEnd] = useState<string>(todayISO());

  const hourlyData = getCloudHourlyStats();
  const todayCount = getTodayVisitorCount();
  const cloudTotal = getVisitorCount();

  const { dailyData, rangeLabel, periodTotal } = useMemo(() => {
    let data: { date: string; fullDate: string; count: number }[] = [];
    let label = '';
    const today = todayISO();

    if (preset === 'today') {
      data = getCloudDailyStats({ startDate: today, endDate: today });
      label = '오늘';
    } else if (preset === '7d') {
      data = getCloudDailyStats({ startDate: daysAgoISO(6), endDate: today });
      label = '최근 7일';
    } else if (preset === '30d') {
      data = getCloudDailyStats({ startDate: daysAgoISO(29), endDate: today });
      label = '최근 30일';
    } else {
      const s = customStart || daysAgoISO(6);
      const e = customEnd || today;
      data = getCloudDailyStats({ startDate: s, endDate: e });
      label = `${s} ~ ${e}`;
    }

    const total = data.reduce((sum, d) => sum + (d.count || 0), 0);
    return { dailyData: data, rangeLabel: label, periodTotal: total };
  }, [preset, customStart, customEnd]);

  const dayCount = dailyData.length || 1;
  const periodAvg = Math.round(periodTotal / dayCount);

  const stats = [
    { label: '오늘 방문자', value: todayCount, icon: Clock, color: 'hsl(var(--primary))' },
    { label: '누적 방문자', value: cloudTotal, icon: Users, color: 'hsl(var(--accent))' },
    { label: `${rangeLabel} 합계`, value: periodTotal, icon: Calendar, color: 'hsl(142 50% 42%)' },
    { label: `${rangeLabel} 일평균`, value: periodAvg, icon: TrendingUp, color: 'hsl(210 60% 50%)' },
  ];

  const presets: { key: RangePreset; label: string }[] = [
    { key: 'today', label: '오늘' },
    { key: '7d', label: '7일' },
    { key: '30d', label: '30일' },
    { key: 'custom', label: '직접 입력' },
  ];

  return (
    <div className="space-y-4">
      {/* Range filter */}
      <div className="bg-muted/20 rounded-xl p-3 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">기간</span>
          {presets.map(p => (
            <Button
              key={p.key}
              size="sm"
              variant={preset === p.key ? 'default' : 'outline'}
              onClick={() => setPreset(p.key)}
              className="h-7 px-3 text-xs"
            >
              {p.label}
            </Button>
          ))}
        </div>
        {preset === 'custom' && (
          <div className="flex items-end gap-2 flex-wrap">
            <div className="flex flex-col gap-1">
              <Label htmlFor="start-date" className="text-[10px] text-muted-foreground">시작일</Label>
              <Input
                id="start-date"
                type="date"
                value={customStart}
                max={customEnd || todayISO()}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-8 text-xs w-40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="end-date" className="text-[10px] text-muted-foreground">종료일</Label>
              <Input
                id="end-date"
                type="date"
                value={customEnd}
                min={customStart}
                max={todayISO()}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-8 text-xs w-40"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-muted/30 rounded-xl p-3 text-center">
            <s.icon size={20} className="mx-auto mb-1" style={{ color: s.color }} />
            <div className="text-xl font-bold text-foreground">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today Hourly Chart */}
      <div className="bg-muted/20 rounded-xl p-4">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Clock size={14} /> 오늘 시간대별 방문자
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" name="방문자" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-muted/20 rounded-xl p-4">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar size={14} /> 일별 방문자 추이 ({rangeLabel})
        </h4>
        <div className="h-48">
          {dailyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              해당 기간의 방문 데이터가 없습니다.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="count" name="방문자" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
