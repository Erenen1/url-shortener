import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsMetrics } from '../../model/analytics.types';

interface TotalClicksChartProps {
  metrics: AnalyticsMetrics;
}

const TotalClicksChart: React.FC<TotalClicksChartProps> = ({ metrics }) => {
  // Mock data - gerçek uygulamada zaman serisi verisi olacak
  const chartData = [
    { name: 'Pzt', clicks: 120, visitors: 80 },
    { name: 'Sal', clicks: 150, visitors: 95 },
    { name: 'Çar', clicks: 180, visitors: 110 },
    { name: 'Per', clicks: 220, visitors: 140 },
    { name: 'Cum', clicks: 190, visitors: 125 },
    { name: 'Cmt', clicks: 160, visitors: 100 },
    { name: 'Paz', clicks: 140, visitors: 90 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Başlık */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              📈 Tıklama Trendi
            </h3>
            <p className="text-blue-100 text-sm">
              Son 7 günlük tıklama ve ziyaretçi analizi
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Özet Kartları */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {metrics.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Toplam Tıklama</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              +12.5% son 7 gün
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {metrics.uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Benzersiz Ziyaretçi</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              +8.2% son 7 gün
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                name="Tıklamalar"
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name="Ziyaretçiler"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Tıklamalar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Ziyaretçiler</span>
              </div>
            </div>
            <div>
              Son güncelleme: 2 dk önce
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalClicksChart; 