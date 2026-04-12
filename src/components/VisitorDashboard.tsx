import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getHourlyStats, getDailyStats } from '@/data/visitorStats';
import { getVisitorCount, getTodayVisitorCount } from '@/data/dataManager';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';

const VisitorDashboard = () => {
  const hourlyData = getHourlyStats();
  const dailyData = getDailyStats();
  const todayCount = getTodayVisitorCount();
  const cloudTotal = getVisitorCount();

  const stats = [
    { label: '오늘 방문자', value: todayCount, icon: Clock, color: 'hsl(var(--primary))' },
    { label: '누적 방문자', value: cloudTotal, icon: Users, color: 'hsl(var(--accent))' },
    { label: '통계 기간', value: `${dailyData.length}일`, icon: Calendar, color: 'hsl(142 50% 42%)' },
    { label: '일평균', value: dailyData.length > 0 ? Math.round(cloudTotal / Math.max(dailyData.length, 1)) : 0, icon: TrendingUp, color: 'hsl(210 60% 50%)' },
  ];

  return (
    <div className="space-y-4">
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
          <Calendar size={14} /> 일별 방문자 추이 (최근 14일)
        </h4>
        <div className="h-48">
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
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
