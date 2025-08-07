// Kanal enum'ı
export type Channel = 'qr' | 'link';

// Analitik olay tipi
export interface AnalyticsEvent {
  shortUrl: string;
  timestamp: Date;
  ipHash: string;
  userAgent: string;
  referrer?: string;
  utmCampaign?: string;
  country?: string;
  channel?: Channel;
  statusCode?: number;
  latencyMs?: number;
  uniqueVisitorKey?: string;
}

// Analitik metrikler tipi
export interface AnalyticsMetrics {
  totalClicks: number;
  uniqueVisitors: number;
  avgClicksPerUrl: number;
  p95Latency: number;
  errorRate: number;
  activeUrls: number;
  deviceBreakdown: Record<string, number>;
  geoDistribution: Record<string, number>;
  topUrls: Array<{ url: string; clicks: number; percentage: number }>;
  referrerSources: Array<{
    domain: string;
    clicks: number;
    percentage: number;
    utmCampaigns: Array<{ name: string; clicks: number }>;
  }>;
}

// Filtre seçenekleri tipi
export interface AnalyticsFilterOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
  userId?: string;
  tag?: string;
  channel?: Channel;
  country?: string;
  campaign?: string;
} 