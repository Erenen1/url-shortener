import { FC } from 'react';
import { AnalyticsMetrics } from '../../model/analytics.types';

interface ReferrerSourcesChartProps {
  metrics: AnalyticsMetrics;
}

declare const ReferrerSourcesChart: FC<ReferrerSourcesChartProps>;

export default ReferrerSourcesChart; 