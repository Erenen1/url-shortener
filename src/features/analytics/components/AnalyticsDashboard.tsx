import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon, 
  LinkIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon, 
  GlobeAltIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { AnalyticsService } from '../services/analytics.service';
import { AnalyticsMetrics, AnalyticsFilterOptions } from '../model/analytics.types';
import { 
  TotalClicksChart, 
  TopUrlsChart, 
  ReferrerSourcesChart, 
  DeviceBreakdownChart, 
  GeoDistributionChart 
} from './Charts';
import { DateRangeFilter, CommonFilters } from './Filters';

// KPI Kartı bileşeni
const KPICard: React.FC<{
  title: string, 
  value: number, 
  change: number, 
  icon: React.ReactNode,
  onClick?: () => void
}> = ({ title, value, change, icon, onClick }) => (
  <div 
    className={`
      bg-surface border border-divider rounded-card p-sm 
      hover:bg-subtle/50 cursor-pointer transition-all
    `}
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-text-muted text-sm">{title}</h3>
        <p className="text-h2 font-bold">{value.toLocaleString()}</p>
      </div>
      {icon}
    </div>
    <div className="flex items-center mt-2xs text-sm">
      <span className={`
        mr-2xs 
        ${change > 0 ? 'text-success' : 'text-danger'}
      `}>
        {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
      </span>
      <span className="text-text-muted">son 7 gün</span>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [filters, setFilters] = useState<AnalyticsFilterOptions>({
    dateRange,
    channel: undefined,
    country: undefined,
    tag: undefined,
    userId: undefined,
    campaign: undefined
  });

  const analyticsService = useMemo(() => new AnalyticsService(), []);
  
  const metrics = useMemo(() => {
    return analyticsService.calculateMetrics(
      dateRange.start, 
      dateRange.end, 
      {
        channel: filters.channel,
        country: filters.country,
        tag: filters.tag,
        userId: filters.userId
      }
    );
  }, [dateRange, filters]);

  const handleDateRangeChange = (range: {start: Date, end: Date}) => {
    setDateRange(range);
  };

  const handleFilterChange = (newFilters: Partial<AnalyticsFilterOptions>) => {
    setFilters(prev => ({...prev, ...newFilters}));
  };

  return (
    <div className="p-md space-y-sm">
      {/* Üst Şerit */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2xs">
          <DateRangeFilter 
            value={dateRange} 
            onChange={handleDateRangeChange} 
            icon={<CalendarIcon className="w-5 h-5 text-text-muted" />} 
          />
          <CommonFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            icon={<AdjustmentsHorizontalIcon className="w-5 h-5 text-text-muted" />} 
          />
        </div>
        <div className="text-text-muted text-sm">
          Son senkron: 2 dk önce
        </div>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-6 gap-sm">
        <KPICard 
          title="Toplam Tıklamalar" 
          value={metrics.totalClicks}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<ChartBarIcon className="w-5 h-5 text-primary-accent" />}
        />
        <KPICard 
          title="Benzersiz Ziyaretçi" 
          value={metrics.uniqueVisitors}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<LinkIcon className="w-5 h-5 text-success" />}
        />
        <KPICard 
          title="Ortalama URL Tıklaması" 
          value={metrics.avgClicksPerUrl}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<ChartBarIcon className="w-5 h-5 text-warning" />}
        />
        <KPICard 
          title="p95 Gecikme (ms)" 
          value={metrics.p95Latency}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<ClockIcon className="w-5 h-5 text-text-muted" />}
        />
        <KPICard 
          title="Hata Oranı (%)" 
          value={metrics.errorRate}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<ArrowTrendingUpIcon className="w-5 h-5 text-danger" />}
        />
        <KPICard 
          title="Aktif URL" 
          value={metrics.activeUrls}
          change={0} // TODO: Önceki dönemle karşılaştırma
          icon={<GlobeAltIcon className="w-5 h-5 text-primary-accent" />}
        />
      </div>

      {/* Ana Grafik ve Detaylı Analizler */}
      <div className="grid grid-cols-2 gap-sm">
        <TotalClicksChart metrics={metrics} />
        <TopUrlsChart metrics={metrics} />
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <ReferrerSourcesChart metrics={metrics} />
        <div className="grid grid-cols-2 gap-sm">
          <DeviceBreakdownChart metrics={metrics} />
          <GeoDistributionChart metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 