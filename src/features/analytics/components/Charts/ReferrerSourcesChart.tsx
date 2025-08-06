import React from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';

interface ReferrerSourcesChartProps {
  metrics: AnalyticsMetrics;
}

const ReferrerSourcesChart: React.FC<ReferrerSourcesChartProps> = ({ metrics }) => {
  return (
    <div className="bg-surface border border-divider rounded-card p-sm">
      <div className="flex justify-between items-center mb-sm">
        <h3 className="text-text-muted font-semibold">Referans Kaynakları</h3>
        <div className="text-text-muted text-sm">
          Top 5
        </div>
      </div>
      
      <div className="space-y-2xs">
        {metrics.referrerSources.slice(0, 5).map((source, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-sm"
          >
            <div className="flex-grow">
              <div className="text-sm">{source.domain}</div>
              {source.utmCampaigns.length > 0 && (
                <div className="text-2xs text-text-muted">
                  {source.utmCampaigns.map(campaign => campaign.name).join(', ')}
                </div>
              )}
            </div>
            <div className="w-1/4 bg-success/10 rounded-full">
              <div 
                className="bg-success h-2 rounded-full" 
                style={{ width: `${source.percentage}%` }}
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