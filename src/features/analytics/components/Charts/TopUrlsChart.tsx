import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface TopUrlsChartProps {
  metrics: AnalyticsMetrics;
}

const TopUrlsChart: React.FC<TopUrlsChartProps> = ({ metrics }) => {
  return (
    <div className="bg-gradient-to-br from-white to-surface border border-divider rounded-card p-sm shadow-sm">
      <div className="flex justify-between items-center mb-sm">
        <h3 className="text-text-secondary font-semibold flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-primary-accent" /> En Çok Tıklanan URL'ler
        </h3>
        <span className="text-2xs px-2 py-0.5 rounded-full bg-subtle text-text-muted border border-divider">Top 10</span>
      </div>
      
      <div className="space-y-2xs">
        {metrics.topUrls.map((url, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-sm p-1 rounded-md hover:bg-subtle transition-colors"
          >
            <div className="w-6 text-2xs text-text-muted">#{index + 1}</div>
            <div className="flex-grow">
              <div className="text-sm truncate font-medium text-text-primary" title={url.url}>{url.url}</div>
            </div>
            <div className="flex-1 max-w-[160px] bg-primary-accent/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ width: `${url.percentage}%`, background: 'linear-gradient(90deg,#93c5fd,#2563eb)' }}
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