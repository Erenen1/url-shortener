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
  DeviceBreakdownChart
} from './Charts';
import { DateRangeFilter, CommonFilters } from './Filters';

// KPI Kartı bileşeni - Mobil uyumlu
const KPICard: React.FC<{
  title: string, 
  value: number, 
  change: number, 
  icon: React.ReactNode,
  onClick?: () => void
}> = ({ title, value, change, icon, onClick }) => (
  <div 
    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-105"
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      <div className="ml-2 flex-shrink-0">
        {icon}
      </div>
    </div>
    <div className="flex items-center mt-2 text-xs sm:text-sm">
      <span className={`
        mr-1 font-medium
        ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}
      `}>
        {change > 0 ? '↗' : change < 0 ? '↘' : '→'} {Math.abs(change).toFixed(1)}%
      </span>
      <span className="text-gray-500">son 7 gün</span>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">URL kısaltma analitikleri ve istatistikleri</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <DateRangeFilter 
                value={dateRange} 
                onChange={handleDateRangeChange} 
                icon={<CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />} 
              />
              <CommonFilters 
                filters={filters} 
                onChange={handleFilterChange} 
                icon={<AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />} 
              />
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            Son senkron: 2 dk önce
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Kartları - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <KPICard 
            title="Toplam Tıklama" 
            value={metrics.totalClicks}
            change={12.5}
            icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
          />
          <KPICard 
            title="Benzersiz Ziyaretçi" 
            value={metrics.uniqueVisitors}
            change={8.2}
            icon={<LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
          />
          <KPICard 
            title="Ortalama Tıklama" 
            value={Math.round(metrics.avgClicksPerUrl)}
            change={-2.1}
            icon={<ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />}
          />
          <KPICard 
            title="P95 Gecikme" 
            value={Math.round(metrics.p95Latency)}
            change={-5.4}
            icon={<ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />}
          />
          <KPICard 
            title="Hata Oranı" 
            value={Math.round(metrics.errorRate * 100) / 100}
            change={-15.3}
            icon={<ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
          />
          <KPICard 
            title="Aktif URL" 
            value={metrics.activeUrls}
            change={22.1}
            icon={<GlobeAltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />}
          />
        </div>

        {/* Ana Grafik Bölümü - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TotalClicksChart metrics={metrics} />
          <TopUrlsChart metrics={metrics} />
        </div>

        {/* İkinci Grafik Bölümü - Tam Genişlik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferrerSourcesChart metrics={metrics} />
          <DeviceBreakdownChart metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 