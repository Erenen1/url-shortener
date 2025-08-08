import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';
import { LinkIcon } from '@heroicons/react/24/outline';

interface ReferrerSourcesChartProps {
  metrics: AnalyticsMetrics;
}

const ReferrerSourcesChart: React.FC<ReferrerSourcesChartProps> = ({ metrics }) => {
  return (
    <div className="bg-gradient-to-br from-white to-surface border border-divider rounded-card p-sm shadow-sm">
      <div className="flex justify-between items-center mb-sm">
        <h3 className="text-text-secondary font-semibold flex items-center">
          <LinkIcon className="w-5 h-5 mr-2 text-success" /> Referans Kaynakları
        </h3>
        <span className="text-2xs px-2 py-0.5 rounded-full bg-subtle text-text-muted border border-divider">Top 5</span>
      </div>
      
      <div className="space-y-2xs">
        {metrics.referrerSources.slice(0, 5).map((source, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-sm p-1 rounded-md hover:bg-subtle transition-colors"
          >
            <div className="flex-grow">
              <div className="text-sm font-medium text-text-primary">{source.domain}</div>
              {source.utmCampaigns.length > 0 && (
                <div className="text-2xs text-text-muted">
                  {source.utmCampaigns.map(campaign => campaign.name).join(', ')}
                </div>
              )}
            </div>
            <div className="flex-1 max-w-[160px] bg-success/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ width: `${source.percentage}%`, background: 'linear-gradient(90deg,#34d399,#059669)' }}
              />
            </div>
            <div className="text-text-muted text-sm w-16 text-right">
              {source.clicks} tık
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferrerSourcesChart; 