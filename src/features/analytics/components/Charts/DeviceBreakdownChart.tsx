import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AnalyticsMetrics } from '../../model/analytics.types';

// Modern renkler
const DEVICE_COLORS = {
  mobile: '#3B82F6',
  desktop: '#10B981', 
  tablet: '#F59E0B',
  other: '#6B7280'
};

const BROWSER_COLORS = {
  chrome: '#4285F4',
  firefox: '#FF7139',
  safari: '#00B4D8',
  edge: '#0078D4',
  other: '#8B5CF6'
};

const DeviceBreakdownChart: React.FC<{ metrics: AnalyticsMetrics }> = ({ metrics }) => {
  // User agent'ları parse et
  const parseUserAgents = (deviceBreakdown: Record<string, number>) => {
    const deviceData: Record<string, number> = {};
    const browserData: Record<string, number> = {};
    
    Object.entries(deviceBreakdown).forEach(([userAgent, count]) => {
      // Cihaz tipi belirleme
      let deviceType = 'desktop';
      if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/iPad|Tablet/i.test(userAgent)) {
        deviceType = 'tablet';
      }
      
      // Tarayıcı belirleme
      let browser = 'other';
      if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) {
        browser = 'chrome';
      } else if (/Firefox/i.test(userAgent)) {
        browser = 'firefox';
      } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        browser = 'safari';
      } else if (/Edge|Edg/i.test(userAgent)) {
        browser = 'edge';
      }
      
      deviceData[deviceType] = (deviceData[deviceType] || 0) + count;
      browserData[browser] = (browserData[browser] || 0) + count;
    });
    
    return { deviceData, browserData };
  };

  const { deviceData, browserData } = parseUserAgents(metrics.deviceBreakdown);
  const totalClicks = Object.values(deviceData).reduce((a, b) => a + b, 0);

  // Cihaz verileri
  const deviceChartData = Object.entries(deviceData)
    .map(([type, clicks]) => ({
      name: type === 'mobile' ? 'Mobil' : 
            type === 'desktop' ? 'Masaüstü' : 
            type === 'tablet' ? 'Tablet' : 'Diğer',
      value: clicks,
      percentage: ((clicks / totalClicks) * 100).toFixed(1),
      color: DEVICE_COLORS[type as keyof typeof DEVICE_COLORS] || DEVICE_COLORS.other
    }))
    .sort((a, b) => b.value - a.value);

  // Tarayıcı verileri
  const browserChartData = Object.entries(browserData)
    .map(([browser, clicks]) => ({
      name: browser === 'chrome' ? 'Chrome' :
            browser === 'firefox' ? 'Firefox' :
            browser === 'safari' ? 'Safari' :
            browser === 'edge' ? 'Edge' : 'Diğer',
      value: clicks,
      percentage: ((clicks / totalClicks) * 100).toFixed(1),
      color: BROWSER_COLORS[browser as keyof typeof BROWSER_COLORS] || BROWSER_COLORS.other
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">📱 Cihaz ve Tarayıcı Analizi</h3>
          <p className="text-sm text-gray-600">
            Toplam {totalClicks} ziyaretçinin cihaz ve tarayıcı dağılımı
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Cihaz Dağılımı */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            💻 Cihaz Türleri
          </h4>
          
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {deviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} ziyaret`, 'Sayı']}
                  labelFormatter={(label) => `${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cihaz Listesi */}
          <div className="space-y-2">
            {deviceChartData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="font-medium text-gray-700">{device.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{device.value}</div>
                  <div className="text-xs text-gray-500">%{device.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarayıcı Dağılımı */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            🌐 Tarayıcılar
          </h4>
          
          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={browserChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} ziyaret`, 'Sayı']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {browserChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tarayıcı Listesi */}
          <div className="space-y-2">
            {browserChartData.map((browser, index) => (
              <div key={browser.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: browser.color }}
                  />
                  <span className="font-medium text-gray-700">{browser.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{browser.value}</div>
                  <div className="text-xs text-gray-500">%{browser.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Özet Bilgiler */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((deviceData.mobile || 0) / totalClicks * 100)}%
          </div>
          <div className="text-sm text-gray-600">Mobil Kullanım</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Math.round((deviceData.desktop || 0) / totalClicks * 100)}%
          </div>
          <div className="text-sm text-gray-600">Masaüstü Kullanım</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {browserChartData[0]?.name || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">En Popüler Tarayıcı</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceBreakdownChart; 