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
  TagIcon,
  FireIcon,
  InformationCircleIcon,
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
  GeoDistributionChart 
} from '../features/analytics/components/Charts';

// Mock veriler
const mockKPIData = {
  totalClicks: { value: 45_678, change: 12.5 },
  uniqueVisitors: { value: 23_456, change: -5.2 },
  avgClicksPerUrl: { value: 7.3, change: 3.1 },
  p95Latency: { value: 85, change: -2.3 },
  errorRate: { value: 0.5, change: 1.2 },
  activeUrls: { value: 1_234, change: 8.7 }
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
    
    return {
      name: currentDate.toLocaleDateString('tr-TR', { weekday: 'short' }),
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
  campaigns: [
    { value: 'utm_source', label: 'UTM Kaynak', icon: <TagIcon className="w-4 h-4" /> }
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

// Mock veriler
const mockTopUrlsData = [
  { url: 'short.url/abc123', title: 'Marketing Campaign', clicks: 5678, percentage: 24.5 },
  { url: 'short.url/def456', title: 'Product Launch', clicks: 4321, percentage: 18.7 },
  { url: 'short.url/ghi789', title: 'Blog Post', clicks: 3210, percentage: 13.9 },
  { url: 'short.url/jkl012', title: 'Social Media', clicks: 2345, percentage: 10.2 },
  { url: 'short.url/mno345', title: 'Email Newsletter', clicks: 1876, percentage: 8.1 }
];

const mockReferrerData = [
  { 
    domain: 'google.com', 
    clicks: 12345, 
    percentage: 35.6,
    utmCampaigns: [
      { name: 'Summer Sale', clicks: 5678 },
      { name: 'New Product', clicks: 3456 }
    ]
  },
  { 
    domain: 'facebook.com', 
    clicks: 8765, 
    percentage: 25.3,
    utmCampaigns: [
      { name: 'Brand Awareness', clicks: 4321 },
      { name: 'Retargeting', clicks: 2345 }
    ]
  }
];

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

// Heatmap için veri üretimi
const generateHeatmapData = () => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const heatmapData = days.map((day, dayIndex) => ({
    day,
    data: hours.map((hour, hourIndex) => ({
      hour,
      value: Math.floor(
        // Gerçekçi trafik desenleri
        Math.sin(dayIndex * 0.5 + hourIndex * 0.2) * 50 + 
        Math.random() * 30 + 
        (hourIndex >= 9 && hourIndex <= 17 ? 20 : 5)
      )
    }))
  }));

  return heatmapData;
};

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7 gün' | '30 gün' | '90 gün'>('7 gün');
  const [lastSync, setLastSync] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[]
  }>({});

  // Trend verisi için dinamik hesaplama
  const trendData = useMemo(() => {
    const daysMap: { [key in '7 gün' | '30 gün' | '90 gün']: number } = {
      '7 gün': 7,
      '30 gün': 30,
      '90 gün': 90
    };
    return generateTrendData(daysMap[dateRange]);
  }, [dateRange]);

  const dateRangeOptions: Array<'7 gün' | '30 gün' | '90 gün'> = ['7 gün', '30 gün', '90 gün'];

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
            {category === 'channels' ? 'Kanal' : 
             category === 'campaigns' ? 'Kampanya' : 
             category === 'countries' ? 'Ülke' : 'Cihaz'}
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

  // Heatmap verisi
  const heatmapData = useMemo(generateHeatmapData, []);

  // Heatmap için renk hesaplama
  const getHeatmapColor = (value: number) => {
    const intensity = Math.min(value / 100, 1);
    return `rgba(16, 185, 129, ${intensity * 0.8})`;
  };

  return (
    <div className="space-y-sm">
      {/* Üst Şerit */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2xs">
          <span className="text-text-secondary text-meta mr-2xs">Tarih Aralığı:</span>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as '7 gün' | '30 gün' | '90 gün')}
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
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              className="text-text-muted"
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
        {/* Sol Bölüm: Saat ve Gün Bazlı Trafik */}
        <div className="bg-surface border border-divider rounded-card p-xs relative">
          <div className="flex justify-between items-center mb-2xs">
            <h3 className="text-h2 text-text-secondary flex items-center">
              <ClockIcon className="w-5 h-5 mr-2xs text-warning" />
              Saat ve Gün Bazlı Trafik
            </h3>
            <button 
              className="text-text-muted hover:text-text-primary"
              title="Trafik desenlerini açıklama"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Boş heatmap alanı */}
          <div className="h-64 flex items-center justify-center text-text-muted">
            Trafik Isı Haritası (Geliştirilecek)
          </div>
        </div>

        {/* Orta Bölüm: Üst Kaynaklar ve Kampanyalar */}
        <div className="bg-surface border border-divider rounded-card p-xs">
          <div className="flex justify-between items-center mb-2xs">
            <h3 className="text-h2 text-text-secondary flex items-center">
              <LinkIcon className="w-5 h-5 mr-2xs text-success" />
              Üst Kaynaklar ve Kampanyalar
            </h3>
          </div>
          
          <div className="space-y-2xs">
            {mockReferrerData.map((referrer, index) => (
              <div 
                key={referrer.domain} 
                className="border-b border-divider pb-2xs last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-body text-text-secondary mr-2xs">
                      {referrer.domain}
                    </span>
                    <span className="text-meta text-text-muted">
                      ({referrer.percentage}%)
                    </span>
                  </div>
                  <span className="text-meta text-text-secondary font-semibold">
                    {referrer.clicks.toLocaleString()}
                  </span>
                </div>
                
                {/* UTM Kampanyaları */}
                <div className="mt-2xs space-y-1">
                  {referrer.utmCampaigns.map(campaign => (
                    <div 
                      key={campaign.name} 
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <TagIcon className="w-4 h-4 text-primary-accent mr-2xs" />
                        <span className="text-meta text-text-muted">
                          {campaign.name}
                        </span>
                      </div>
                      <span className="text-meta text-text-secondary">
                        {campaign.clicks.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Bölüm: Anomaliler ve Veri Kalitesi */}
        <div className="bg-surface border border-divider rounded-card p-xs">
          <div className="flex justify-between items-center mb-2xs">
            <h3 className="text-h2 text-text-secondary flex items-center">
              <FireIcon className="w-5 h-5 mr-2xs text-danger" />
              Anomaliler ve Veri Kalitesi
            </h3>
          </div>
          
          <div className="space-y-2xs">
            <div className="flex justify-between items-center">
              <span className="text-meta text-text-secondary">Eksik Referans %</span>
              <span className="text-meta text-danger font-semibold">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-meta text-text-secondary">Bot Tahmini %</span>
              <span className="text-meta text-warning font-semibold">7.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-meta text-text-secondary">Geç Gelen Olaylar %</span>
              <span className="text-meta text-text-muted font-semibold">1.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bölüm: Dağılım ve Harita */}
      <div className="grid grid-cols-2 gap-sm">
        {/* Sol Bölüm: Cihaz Dağılımı */}
        <div className="bg-surface border border-divider rounded-card p-xs">
          <h3 className="text-h2 text-text-secondary mb-2xs flex items-center">
            <DeviceTabletIcon className="w-5 h-5 mr-2xs text-primary-accent" />
            Cihaz ve İşletim Sistemi
          </h3>
          <DeviceBreakdownChart 
            metrics={{
              totalClicks: 1000,
              uniqueVisitors: 750,
              avgClicksPerUrl: 5.5,
              p95Latency: 95,
              errorRate: 0.5,
              activeUrls: 50,
              topUrls: [],
              referrerSources: [],
              deviceBreakdown: {
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64)': 500,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)': 300,
                'Mozilla/5.0 (Linux; Android 10; SM-G970F)': 200
              },
              geoDistribution: {}
            }} 
          />
        </div>

        {/* Sağ Bölüm: Coğrafi Dağılım */}
        <div className="bg-surface border border-divider rounded-card p-xs">
          <h3 className="text-h2 text-text-secondary mb-2xs flex items-center">
            <CountryIcon className="w-5 h-5 mr-2xs text-success" />
            Ülke Bazlı Trafik
          </h3>
          <GeoDistributionChart 
            metrics={{
              totalClicks: 1000,
              uniqueVisitors: 750,
              avgClicksPerUrl: 5.5,
              p95Latency: 95,
              errorRate: 0.5,
              activeUrls: 50,
              topUrls: [],
              referrerSources: [],
              deviceBreakdown: {},
              geoDistribution: {
                'TR': 500,
                'US': 300,
                'DE': 200,
                'FR': 150,
                'JP': 100
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 