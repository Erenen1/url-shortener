import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon, 
  LinkIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ChartPieIcon,
  GlobeAltIcon,
  EyeIcon,
  ChartBarSquareIcon,
  DeviceTabletIcon,
  GlobeAltIcon as CountryIcon,
  FireIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

// Analitik bileşenlerini import et
import { 
  DeviceBreakdownChart,
  TopUrlsChart,
  ReferrerSourcesChart,
  TrafficHeatmap
} from '../features/analytics/components/Charts';
import { AnalyticsService } from '../features/analytics/services/analytics.service';

// Mock veriler
const mockKPIData = {
  totalClicks: { value: 45_678, change: 12.5 },
  uniqueVisitors: { value: 23_456, change: -5.2 },
  avgClicksPerUrl: { value: 7.3, change: 3.1 },
  p95Latency: { value: 85, change: -2.3 },
  errorRate: { value: 0.5, change: 1.2 },
  activeUrls: { value: 1_234, change: 8.7 }
};

// Yardımcı: Tarih aralığını gün sayısına çevir
const getDaysForRange = (range: 'Tüm Zamanlar' | '7 gün' | '30 gün' | '90 gün'): number => {
  switch (range) {
    case '7 gün':
      return 7;
    case '30 gün':
      return 30;
    case '90 gün':
      return 90;
    case 'Tüm Zamanlar':
    default:
      return 90; // Veri sınırlı olduğundan varsayılan 90 gün
  }
};

// Trend verisi için dinamik üretim fonksiyonu
const generateTrendData = (days: number) => {
  const today = new Date();
  const trendData = Array.from({ length: days }, (_, index) => {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - (days - 1 - index));
    
    // Gerçekçi trafik desenleri
    const baseClicks = Math.floor(Math.random() * 1000) + 1000;
    const baseVisitors = Math.floor(baseClicks * 0.6);
    
    // Hafta sonu/hafta içi farklılaştırma
    const dayOfWeek = currentDate.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    
    const dateLabel = currentDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    return {
      dateLabel,
      totalClicks: Math.floor(baseClicks * weekendMultiplier),
      uniqueVisitors: Math.floor(baseVisitors * weekendMultiplier)
    };
  });

  return trendData;
};

// Filtre seçenekleri
const filterOptions = {
  channels: [
    { value: 'qr', label: 'QR Kod', icon: <DeviceTabletIcon className="w-4 h-4" /> },
    { value: 'link', label: 'Link', icon: <LinkIcon className="w-4 h-4" /> }
  ],
  countries: [
    { value: 'tr', label: 'Türkiye', icon: <CountryIcon className="w-4 h-4" /> },
    { value: 'us', label: 'Amerika', icon: <CountryIcon className="w-4 h-4" /> }
  ],
  devices: [
    { value: 'mobile', label: 'Mobil', icon: <DeviceTabletIcon className="w-4 h-4" /> },
    { value: 'desktop', label: 'Masaüstü', icon: <DeviceTabletIcon className="w-4 h-4" /> }
  ]
};

 

// KPI Kartı bileşeni
const KPICard: React.FC<{
  title: string, 
  value: number, 
  change: number, 
  icon: React.ReactNode
}> = ({ title, value, change, icon }) => (
  <div className="bg-surface border border-divider rounded-card p-xs shadow-sm hover:shadow-md transition-colors-all group">
    <div className="flex justify-between items-center mb-2xs">
      <div className="text-text-muted text-meta">{title}</div>
      {icon}
    </div>
    <div className="flex items-center">
      <div className="text-[24px] font-bold text-text-primary mr-2xs">
        {new Intl.NumberFormat('tr-TR').format(value)}
      </div>
      <span className={`
        text-meta px-2xs py-4xs rounded-sm
        ${change >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}
      `}>
        {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
      </span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'Tüm Zamanlar' | '7 gün' | '30 gün' | '90 gün'>('7 gün');
  const [lastSync, setLastSync] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[]
  }>({});

  // Trend verisi için dinamik hesaplama
  const trendData = useMemo(() => {
    return generateTrendData(getDaysForRange(dateRange));
  }, [dateRange]);

  const dateRangeOptions: Array<'Tüm Zamanlar' | '7 gün' | '30 gün' | '90 gün'> = ['Tüm Zamanlar', '7 gün', '30 gün', '90 gün'];

  const handleRefresh = () => {
    // Burada gerçek veri yenileme işlemi yapılacak
    setLastSync(new Date());
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const currentFilters = prev[category] || [];
      const isActive = currentFilters.includes(value);
      
      return {
        ...prev,
        [category]: isActive 
          ? currentFilters.filter(f => f !== value)
          : [...currentFilters, value]
      };
    });
  };

  const FilterDropdown: React.FC<{
    category: string, 
    options: Array<{value: string, label: string, icon: React.ReactNode}>
  }> = ({ category, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeValues = activeFilters[category] || [];

    return (
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center space-x-2xs px-2xs py-4xs rounded-md transition-colors
            ${activeValues.length > 0 
              ? 'bg-primary-accent/10 text-primary-accent' 
              : 'text-text-muted hover:bg-subtle'}
          `}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          <span className="text-meta">
            {category === 'channels' ? 'Kanal' : category === 'countries' ? 'Ülke' : 'Cihaz'}
          </span>
          {activeValues.length > 0 && (
            <span className="bg-primary-accent text-white text-[10px] px-2xs rounded-full ml-2xs">
              {activeValues.length}
            </span>
          )}
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-2xs bg-surface border border-divider rounded-md shadow-md p-2xs">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  toggleFilter(category, option.value);
                }}
                className={`
                  flex items-center w-full text-left px-2xs py-4xs rounded-md
                  ${activeValues.includes(option.value) 
                    ? 'bg-primary-accent/10 text-primary-accent' 
                    : 'hover:bg-subtle'}
                `}
              >
                {option.icon}
                <span className="ml-2xs text-meta">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // AnalyticsService ile metrik üret (mock)
  const analyticsService = useMemo(() => new AnalyticsService(), []);
  const analyticsMetrics = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - getDaysForRange(dateRange));
    return analyticsService.calculateMetrics(start, new Date());
  }, [analyticsService, dateRange]);

  // Ek metrikler: Boş referer oranı ve bilinmeyen ülke oranı
  const missingReferrerPercentage = useMemo(() => {
    const ref = analyticsMetrics.referrerSources.find(s => s.domain === 'default.com');
    return ref ? ref.percentage : 0;
  }, [analyticsMetrics]);

  const unknownCountryPercentage = useMemo(() => {
    const dist = analyticsMetrics.geoDistribution || {};
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    const unknown = dist['Unknown'] || 0;
    return total > 0 ? (unknown / total) * 100 : 0;
  }, [analyticsMetrics]);

  return (
    <div className="space-y-sm">
      {/* Üst Şerit */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2xs">
          <span className="text-text-secondary text-meta mr-2xs">Tarih Aralığı:</span>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as 'Tüm Zamanlar' | '7 gün' | '30 gün' | '90 gün')}
            className="bg-surface border border-divider rounded-md px-2xs py-4xs text-body"
          >
            {dateRangeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          {/* Filtre Dropdown'ları */}
          <div className="flex space-x-2xs ml-2xs">
            {Object.entries(filterOptions).map(([category, options]) => (
              <FilterDropdown 
                key={category} 
                category={category} 
                options={options} 
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2xs">
          <span className="text-text-muted text-meta">
            Son senkron: {Math.round((new Date().getTime() - lastSync.getTime()) / 60000)} dk önce
          </span>
          <button 
            onClick={handleRefresh}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Aktif Filtreler */}
      {Object.entries(activeFilters).some(([_, filters]) => filters.length > 0) && (
        <div className="flex items-center space-x-2xs">
          <span className="text-text-muted text-meta">Aktif Filtreler:</span>
          {Object.entries(activeFilters).map(([category, filters]) => 
            filters.map(filter => {
              const option = filterOptions[category as keyof typeof filterOptions]
                .find(opt => opt.value === filter);
              return option ? (
                <span 
                  key={`${category}-${filter}`}
                  className="
                    flex items-center bg-subtle text-text-secondary 
                    text-meta px-2xs py-4xs rounded-md space-x-2xs
                  "
                >
                  {option.icon}
                  <span>{option.label}</span>
                  <button 
                    onClick={() => toggleFilter(category, filter)}
                    className="text-text-muted hover:text-danger"
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })
          )}
        </div>
      )}

      {/* KPI Kartları */}
      <div className="grid grid-cols-6 gap-sm">
        <KPICard 
          title="Toplam Tıklamalar" 
          value={mockKPIData.totalClicks.value}
          change={mockKPIData.totalClicks.change}
          icon={<ChartBarIcon className="w-5 h-5 text-primary-accent" />}
        />
        <KPICard 
          title="Benzersiz Ziyaretçi" 
          value={mockKPIData.uniqueVisitors.value}
          change={mockKPIData.uniqueVisitors.change}
          icon={<LinkIcon className="w-5 h-5 text-success" />}
        />
        <KPICard 
          title="Ortalama URL Tıklaması" 
          value={mockKPIData.avgClicksPerUrl.value}
          change={mockKPIData.avgClicksPerUrl.change}
          icon={<ChartPieIcon className="w-5 h-5 text-warning" />}
        />
        <KPICard 
          title="p95 Gecikme (ms)" 
          value={mockKPIData.p95Latency.value}
          change={mockKPIData.p95Latency.change}
          icon={<ClockIcon className="w-5 h-5 text-text-muted" />}
        />
        <KPICard 
          title="Hata Oranı (%)" 
          value={mockKPIData.errorRate.value}
          change={mockKPIData.errorRate.change}
          icon={<ArrowTrendingUpIcon className="w-5 h-5 text-danger" />}
        />
        <KPICard 
          title="Aktif URL" 
          value={mockKPIData.activeUrls.value}
          change={mockKPIData.activeUrls.change}
          icon={<GlobeAltIcon className="w-5 h-5 text-primary-accent" />}
        />
      </div>

      {/* Ana Trend Grafiği */}
      <div className="bg-surface border border-divider rounded-card p-xs">
        <div className="flex justify-between items-center mb-2xs">
          <h3 className="text-h2 text-text-secondary flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2xs text-primary-accent" />
            Tıklama Trendi
          </h3>
          <div className="flex items-center space-x-2xs text-text-muted">
            {dateRangeOptions.map(option => (
              <button 
                key={option}
                onClick={() => setDateRange(option)}
                className={`
                  px-2xs py-4xs rounded-md transition-colors
                  ${dateRange === option 
                    ? 'bg-primary-accent text-white' 
                    : 'hover:bg-subtle hover:text-text-primary'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotalClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUniqueVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#E2E8F0" 
            />
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false} 
              tickLine={false} 
              height={60}
              tick={(props: any) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="end"
                      fill="#6b7280"
                      transform="rotate(-45)"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              className="text-text-muted"
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-divider rounded-lg p-2xs shadow-md">
                      <p className="text-text-secondary text-meta font-semibold">{label}</p>
                      <div className="flex items-center">
                        <ChartBarSquareIcon className="w-4 h-4 text-primary-accent mr-2xs" />
                        <p className="text-body text-text-primary">
                          Toplam Tıklamalar: {payload[0].value}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 text-success mr-2xs" />
                        <p className="text-body text-text-primary">
                          Benzersiz Ziyaretçi: {payload[1].value}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              formatter={(value) => (
                <span className="text-text-secondary text-meta">
                  {value === 'totalClicks' ? 'Toplam Tıklamalar' : 'Benzersiz Ziyaretçi'}
                </span>
              )}
            />
            <Area 
              type="monotone" 
              dataKey="totalClicks" 
              stroke="#2563EB" 
              fillOpacity={1} 
              fill="url(#colorTotalClicks)"
            />
            <Area 
              type="monotone" 
              dataKey="uniqueVisitors" 
              stroke="#10B981" 
              fillOpacity={1} 
              fill="url(#colorUniqueVisitors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alt Bölüm */}
      <div className="grid grid-cols-3 gap-sm">
        {/* Isı Haritası - Tam Genişlik */}
        <div className="col-span-3">
          <TrafficHeatmap />
        </div>

        {/* Üçlü Grid: Referans, Top URL'ler, Anomaliler */}
        <div className="col-span-3 grid grid-cols-3 gap-sm">
          <div>
            <ReferrerSourcesChart metrics={analyticsMetrics} />
          </div>
          <div>
            <TopUrlsChart metrics={analyticsMetrics} />
          </div>
          {/* Sağ: Anomaliler ve Veri Kalitesi */}
          <div className="bg-gradient-to-br from-white to-surface border border-divider rounded-card p-xs shadow-sm">
            <div className="flex justify-between items-center mb-2xs">
              <h3 className="text-h2 text-text-secondary flex items-center">
                <FireIcon className="w-5 h-5 mr-2xs text-danger" />
                Anomaliler ve Veri Kalitesi
              </h3>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2xs">
              <div className="text-center p-3 bg-red-50 border border-red-100 rounded-md">
                <div className="text-lg font-bold text-red-600">
                  {analyticsMetrics.errorRate.toFixed(2)}%
                </div>
                <div className="text-2xs text-red-700">Hata Oranı</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                <div className="text-lg font-bold text-yellow-600">
                  {Math.round(analyticsMetrics.p95Latency)} ms
                </div>
                <div className="text-2xs text-yellow-700">p95 Gecikme</div>
              </div>
              <div className="text-center p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="text-lg font-bold text-blue-600">
                  {analyticsMetrics.activeUrls}
                </div>
                <div className="text-2xs text-blue-700">Aktif URL</div>
              </div>
              <div className="text-center p-3 bg-purple-50 border border-purple-100 rounded-md">
                <div className="text-lg font-bold text-purple-700">
                  {missingReferrerPercentage.toFixed(1)}%
                </div>
                <div className="text-2xs text-purple-700">Boş Referer</div>
              </div>
              <div className="text-center p-3 bg-slate-100 border border-slate-200 rounded-md">
                <div className="text-lg font-bold text-slate-700">
                  {unknownCountryPercentage.toFixed(1)}%
                </div>
                <div className="text-2xs text-slate-700">Bilinmeyen Ülke</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bölüm: Cihaz Dağılımı */}
      <div className="mt-sm">
        <div className="bg-gradient-to-br from-white to-surface border border-divider rounded-card p-xs shadow-sm">
          <h3 className="text-h2 text-text-secondary mb-2xs flex items-center">
            <DeviceTabletIcon className="w-5 h-5 mr-2xs text-primary-accent" />
            Cihaz ve İşletim Sistemi
          </h3>
          <DeviceBreakdownChart metrics={analyticsMetrics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 