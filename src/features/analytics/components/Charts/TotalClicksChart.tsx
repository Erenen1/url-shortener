import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';

interface TotalClicksChartProps {
  metrics: AnalyticsMetrics;
}

const TotalClicksChart: React.FC<TotalClicksChartProps> = ({ metrics }) => {
  return (
    <div className="bg-surface border border-divider rounded-card p-sm">
      <div className="flex justify-between items-center mb-sm">
        <h3 className="text-text-muted font-semibold">Toplam Tıklamalar</h3>
        <div className="text-text-muted text-sm">
          Son 7 gün
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-sm">
        <div>
          <div className="text-h2 font-bold">{metrics.totalClicks}</div>
          <div className="text-text-muted text-sm">Toplam Tıklama</div>
        </div>
        <div>
          <div className="text-h2 font-bold">{metrics.uniqueVisitors}</div>
          <div className="text-text-muted text-sm">Benzersiz Ziyaretçi</div>
        </div>
      </div>
    </div>
  );
};

export default TotalClicksChart; 