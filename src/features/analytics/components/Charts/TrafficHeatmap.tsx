import React, { useMemo, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface HeatmapCellData {
  day: string;
  hour: string;
  value: number;
}

interface TrafficHeatmapProps {
  title?: string;
  days?: string[];
  hours?: string[];
  data?: HeatmapCellData[];
}

const defaultDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const defaultHours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const generateDefaultData = (days: string[], hours: string[]): HeatmapCellData[] => {
  const result: HeatmapCellData[] = [];
  days.forEach((day, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      const base = Math.max(0, Math.sin(dayIndex * 0.6 + hourIndex * 0.25) * 45 + 35);
      const workHoursBoost = hourIndex >= 9 && hourIndex <= 18 ? 20 : 0;
      const weekendBoost = (dayIndex === 5 || dayIndex === 6) ? 10 : 0;
      const noise = Math.random() * 15;
      result.push({ day, hour, value: Math.floor(base + workHoursBoost + weekendBoost + noise) });
    });
  });
  return result;
};

const getIntensityColor = (value: number) => {
  // 0-100 ölçeğinde normalize edilmiş değer için mavi tonları
  const clamped = Math.max(0, Math.min(100, value));
  const alpha = 0.12 + (clamped / 100) * 0.78; // 0.12 - 0.9 arası
  // #3B82F6 (59,130,246)
  return `rgba(59, 130, 246, ${alpha})`;
};

const TrafficHeatmap: React.FC<TrafficHeatmapProps> = ({ title = 'Saat ve Gün Bazlı Trafik', days = defaultDays, hours = defaultHours, data }) => {
  const heatmapData = useMemo(() => data ?? generateDefaultData(days, hours), [data, days, hours]);

  const valueByKey = useMemo(() => {
    const map = new Map<string, number>();
    heatmapData.forEach(cell => {
      map.set(`${cell.day}-${cell.hour}`, cell.value);
    });
    return map;
  }, [heatmapData]);

  // Hızlı tooltip durumu
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    day: string;
    hour: string;
    value: number;
    visible: boolean;
  } | null>(null);

  return (
    <div className="bg-gradient-to-br from-white to-surface border border-divider rounded-card p-sm shadow-sm relative">
      <div className="flex justify-between items-center mb-2xs">
        <h3 className="text-h2 text-text-secondary flex items-center">
          <ClockIcon className="w-5 h-5 mr-2 text-warning" />
          {title}
        </h3>
        <span className="text-2xs px-2 py-0.5 rounded-full bg-subtle text-text-muted border border-divider">Isı Haritası</span>
      </div>

      {/* Headings */}
      <div 
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `72px repeat(${hours.length}, minmax(0, 1fr))` }}
      >
        {/* Empty top-left corner */}
        <div />
        {hours.map((h, i) => (
          <div key={h} className="text-[10px] sm:text-2xs text-text-muted text-center px-1 py-1 select-none h-6">
            {i % 3 === 0 ? h : ''}
          </div>
        ))}

        {days.map(day => (
          <React.Fragment key={day}>
            <div className="text-2xs text-text-muted flex items-center px-1 select-none">{day}</div>
            {hours.map(h => {
              const v = valueByKey.get(`${day}-${h}`) ?? 0;
              return (
                <div
                  key={`${day}-${h}`}
                  className="h-10 md:h-12 rounded-md transition transform hover:scale-[1.02] cursor-crosshair"
                  style={{ backgroundColor: getIntensityColor(v) }}
                  onMouseEnter={(e) => {
                    setTooltip({ x: e.clientX, y: e.clientY, day, hour: h, value: v, visible: true });
                  }}
                  onMouseMove={(e) => {
                    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev);
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Anında hover tooltip */}
      {tooltip?.visible && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-800 text-sm"
          style={{
            left: Math.min(tooltip.x + 14, window.innerWidth - 180),
            top: Math.min(tooltip.y + 12, window.innerHeight - 80)
          }}
        >
          <div className="font-semibold">{tooltip.day} {tooltip.hour}</div>
          <div className="opacity-90">{tooltip.value.toLocaleString()} tıklama</div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 mt-2">
        <span className="text-2xs text-text-muted">Az</span>
        <div className="h-2 w-20 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(147,197,253,0.15), rgba(37,99,235,0.9))' }} />
        <span className="text-2xs text-text-muted">Çok</span>
      </div>
    </div>
  );
};

export default TrafficHeatmap; 