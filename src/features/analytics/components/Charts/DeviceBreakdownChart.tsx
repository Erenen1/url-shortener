import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';

// Modern ve minimal renkler
const DEVICE_PALETTE = {
  mobile: {
    primary: '#3B82F6',   // Canlı mavi
    secondary: '#93C5FD', // Açık mavi
    icon: '📱'
  },
  desktop: {
    primary: '#10B981',   // Yeşil
    secondary: '#6EE7B7', // Açık yeşil
    icon: '💻'
  },
  other: {
    primary: '#6B7280',   // Gri
    secondary: '#D1D5DB', // Açık gri
    icon: '❓'
  }
};

const DeviceBreakdownChart: React.FC<{ metrics: AnalyticsMetrics }> = ({ metrics }) => {
  // Cihaz verilerini işle
  const deviceData = Object.entries(metrics.deviceBreakdown)
    .reduce((acc, [userAgent, count]) => {
      const deviceType = userAgent.includes('mobile') || 
                         userAgent.includes('Android') || 
                         userAgent.includes('iOS') ? 'mobile' : 
                         userAgent.includes('Windows') || 
                         userAgent.includes('Mac') ? 'desktop' : 'other';
      
      acc[deviceType] = (acc[deviceType] || 0) + count;
      return acc;
    }, {} as Record<string, number>);

  const totalClicks = Object.values(deviceData).reduce((a, b) => a + b, 0);

  const processedData = Object.entries(deviceData)
    .map(([type, clicks]) => ({
      type,
      clicks,
      percentage: ((clicks / totalClicks) * 100).toFixed(1)
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-md">
      {/* Sol Taraf: Detaylı Grafik */}
      <div className="col-span-1 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">🖥️</span> Cihaz Dağılımı
        </h3>
        
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex">
          {processedData.map((device) => {
            const deviceInfo = DEVICE_PALETTE[device.type as keyof typeof DEVICE_PALETTE];
            return (
              <div 
                key={device.type}
                className="h-full transition-all duration-300 ease-in-out"
                style={{ 
                  width: `${device.percentage}%`, 
                  backgroundColor: deviceInfo.primary 
                }}
                title={`${device.type}: ${device.clicks} tık (%${device.percentage})`}
              />
            );
          })}
        </div>

        <div className="flex justify-between">
          {processedData.map((device) => {
            const deviceInfo = DEVICE_PALETTE[device.type as keyof typeof DEVICE_PALETTE];
            return (
              <div 
                key={device.type} 
                className="text-center flex flex-col items-center"
              >
                <div 
                  className="text-3xl mb-2"
                  role="img" 
                  aria-label={`${device.type} cihaz`}
                >
                  {deviceInfo.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {device.type === 'mobile' ? 'Mobil' : 
                   device.type === 'desktop' ? 'Masaüstü' : 'Diğer'}
                </div>
                <div className="text-xs text-gray-500">
                  %{device.percentage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sağ Taraf: Detaylı Bilgiler */}
      <div className="col-span-1 bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Detaylı Bilgiler</h3>
        
        {processedData.map((device) => {
          const deviceInfo = DEVICE_PALETTE[device.type as keyof typeof DEVICE_PALETTE];
          return (
            <div 
              key={device.type} 
              className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ 
                    backgroundColor: deviceInfo.secondary,
                    color: deviceInfo.primary 
                  }}
                >
                  {deviceInfo.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {device.type === 'mobile' ? 'Mobil Cihazlar' : 
                     device.type === 'desktop' ? 'Masaüstü Bilgisayarlar' : 'Diğer Cihazlar'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {device.clicks} Tıklama
                  </div>
                </div>
              </div>
              <div 
                className="text-lg font-bold"
                style={{ color: deviceInfo.primary }}
              >
                %{device.percentage}
              </div>
            </div>
          );
        })}

        <div className="text-center text-xs text-gray-500 mt-4">
          Toplam: {totalClicks} Tıklama
        </div>
      </div>
    </div>
  );
};

export default DeviceBreakdownChart; 