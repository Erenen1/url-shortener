import * as z from 'zod';

// Kanal enum'ı
export const ChannelEnum = z.enum(['qr', 'link']);

// Analitik olay şeması
export const AnalyticsEventSchema = z.object({
  shortUrl: z.string(),
  timestamp: z.string().transform(val => new Date(val)),
  ipHash: z.string(),
  userAgent: z.string(),
  referrer: z.string().optional(),
  utmCampaign: z.string().optional(),
  country: z.string().optional(),
  channel: ChannelEnum.optional()
});

// Analitik olay tipi
export type AnalyticsEvent = z.ZodType.infer<typeof AnalyticsEventSchema>;

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
  channel?: 'qr' | 'link';
  country?: string;
  campaign?: string;
} 