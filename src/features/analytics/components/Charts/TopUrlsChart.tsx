import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';

interface TopUrlsChartProps {
  metrics: AnalyticsMetrics;
}

const TopUrlsChart: React.FC<TopUrlsChartProps> = ({ metrics }) => {
  return (
    <div className="bg-surface border border-divider rounded-card p-sm">
      <div className="flex justify-between items-center mb-sm">
        <h3 className="text-text-muted font-semibold">En Çok Tıklanan URL'ler</h3>
        <div className="text-text-muted text-sm">
          Top 10
        </div>
      </div>
      
      <div className="space-y-2xs">
        {metrics.topUrls.map((url, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-sm"
          >
            <div className="flex-grow">
              <div className="text-sm truncate">{url.url}</div>
            </div>
            <div className="w-1/4 bg-primary-accent/10 rounded-full">
              <div 
                className="bg-primary-accent h-2 rounded-full" 
                style={{ width: `${url.percentage}%` }}
              />
            </div>
            <div className="text-text-muted text-sm w-16 text-right">
              {url.clicks} tık
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUrlsChart; 