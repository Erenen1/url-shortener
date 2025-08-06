import { AnalyticsEvent, AnalyticsMetrics } from '../model/analytics.types';

// Analitik olayları toplama ve işleme servisi
export class AnalyticsService {
  private events: AnalyticsEvent[] = [
    // Mock Cihaz Dağılımı Olayları
    {
      shortUrl: 'short.url/abc123',
      timestamp: new Date(),
      ipHash: 'hash1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      statusCode: 200,
      country: 'TR',
      latencyMs: 50
    },
    {
      shortUrl: 'short.url/def456',
      timestamp: new Date(),
      ipHash: 'hash2',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      statusCode: 200,
      country: 'US',
      latencyMs: 75
    },
    {
      shortUrl: 'short.url/ghi789',
      timestamp: new Date(),
      ipHash: 'hash3',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36',
      statusCode: 200,
      country: 'DE',
      latencyMs: 60
    },
    {
      shortUrl: 'short.url/jkl012',
      timestamp: new Date(),
      ipHash: 'hash4',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      statusCode: 200,
      country: 'FR',
      latencyMs: 40
    },
    {
      shortUrl: 'short.url/mno345',
      timestamp: new Date(),
      ipHash: 'hash5',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      statusCode: 200,
      country: 'JP',
      latencyMs: 65
    }
  ];

  // Yeni bir analitik olayı kaydet
  public logEvent(event: AnalyticsEvent): void {
    // IP hash ve kullanıcı ajanını kontrol et (unique visitor)
    const uniqueVisitorKey = this.generateUniqueVisitorKey(event);
    event.uniqueVisitorKey = uniqueVisitorKey;

    this.events.push(event);
  }

  // Belirli bir tarih aralığındaki metrikleri hesapla
  public calculateMetrics(
    startDate: Date, 
    endDate: Date, 
    filters?: Partial<{
      userId: string, 
      tag: string, 
      channel: 'qr' | 'link',
      country: string
    }>
  ): AnalyticsMetrics {
    const filteredEvents = this.events.filter(event => 
      event.timestamp >= startDate && 
      event.timestamp <= endDate &&
      this.matchesFilters(event, filters)
    );

    return {
      totalClicks: filteredEvents.length,
      uniqueVisitors: new Set(filteredEvents.map(e => e.uniqueVisitorKey)).size,
      avgClicksPerUrl: this.calculateAvgClicksPerUrl(filteredEvents),
      p95Latency: this.calculateP95Latency(filteredEvents),
      errorRate: this.calculateErrorRate(filteredEvents),
      activeUrls: this.countActiveUrls(filteredEvents),
      topUrls: this.getTopUrls(filteredEvents),
      referrerSources: this.getReferrerSources(filteredEvents),
      deviceBreakdown: this.getDeviceBreakdown(filteredEvents),
      geoDistribution: this.getGeoDistribution(filteredEvents)
    };
  }

  // Unique visitor anahtarı oluştur
  private generateUniqueVisitorKey(event: AnalyticsEvent): string {
    return `${event.ipHash}-${event.userAgent}-${new Date(event.timestamp).toISOString().split('T')[0]}`;
  }

  // Filtre eşleşmelerini kontrol et
  private matchesFilters(
    event: AnalyticsEvent, 
    filters?: Partial<{
      userId: string, 
      tag: string, 
      channel: 'qr' | 'link',
      country: string
    }>
  ): boolean {
    if (!filters) return true;

    return Object.entries(filters).every(([key, value]) => 
      value === undefined || event[key as keyof AnalyticsEvent] === value
    );
  }

  // URL başına ortalama tıklamaları hesapla
  private calculateAvgClicksPerUrl(events: AnalyticsEvent[]): number {
    const urlClickCounts = events.reduce((acc, event) => {
      acc[event.shortUrl] = (acc[event.shortUrl] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalUrls = Object.keys(urlClickCounts).length;
    const totalClicks = Object.values(urlClickCounts).reduce((a, b) => (a as number) + (b as number), 0);

    return totalUrls > 0 ? (totalClicks as number) / totalUrls : 0;
  }

  // p95 gecikme süresini hesapla
  private calculateP95Latency(events: AnalyticsEvent[]): number {
    const latencies = events
      .map(event => event.latencyMs)
      .filter((latency): latency is number => latency !== undefined)
      .sort((a, b) => a - b);

    const index = Math.floor(latencies.length * 0.95);
    return latencies[index] || 0;
  }

  // Hata oranını hesapla
  private calculateErrorRate(events: AnalyticsEvent[]): number {
    const errorEvents = events.filter(event => 
      event.statusCode >= 400 && event.statusCode < 600
    );
    return (errorEvents.length / events.length) * 100;
  }

  // Aktif URL sayısını hesapla
  private countActiveUrls(events: AnalyticsEvent[]): number {
    return new Set(events.map(event => event.shortUrl)).size;
  }

  // En çok tıklanan URL'leri getir
  private getTopUrls(events: AnalyticsEvent[]): Array<{url: string, clicks: number, percentage: number}> {
    const urlClickCounts = events.reduce((acc, event) => {
      acc[event.shortUrl] = (acc[event.shortUrl] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalClicks = events.length;
    return Object.entries(urlClickCounts)
      .map(([url, clicks]) => ({
        url, 
        clicks: clicks as number, 
        percentage: ((clicks as number) / totalClicks) * 100
      }))
      .sort((a, b) => (b.clicks as number) - (a.clicks as number))
      .slice(0, 10);
  }

  // Referans kaynaklarını getir
  private getReferrerSources(events: AnalyticsEvent[]): Array<{
    domain: string, 
    clicks: number, 
    percentage: number,
    utmCampaigns: Array<{name: string, clicks: number}>
  }> {
    interface ReferrerCount {
      clicks: number;
      utmCampaigns: Record<string, number>;
    }

    const referrerCounts = events.reduce((acc, event) => {
      const domain = new URL(event.referrer || 'https://default.com').hostname;
      if (!acc[domain]) {
        acc[domain] = { 
          clicks: 0, 
          utmCampaigns: {} 
        };
      }
      
      acc[domain].clicks++;

      if (event.utmCampaign) {
        acc[domain].utmCampaigns[event.utmCampaign] = 
          (acc[domain].utmCampaigns[event.utmCampaign] || 0) + 1;
      }

      return acc;
    }, {} as Record<string, ReferrerCount>);

    const totalClicks = events.length;
    return Object.entries(referrerCounts)
      .map(([domain, data]) => {
        const referrerData = data as ReferrerCount;
        return {
          domain,
          clicks: referrerData.clicks,
          percentage: (referrerData.clicks / totalClicks) * 100,
          utmCampaigns: Object.entries(referrerData.utmCampaigns)
            .map(([name, campaignClicks]) => ({ 
              name, 
              clicks: campaignClicks 
            }))
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  }

  // Cihaz dağılımını getir
  private getDeviceBreakdown(events: AnalyticsEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      const deviceType = this.detectDeviceType(event.userAgent);
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Coğrafi dağılımı getir
  private getGeoDistribution(events: AnalyticsEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.country] = (acc[event.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Kullanıcı ajanından cihaz türünü tespit et
  private detectDeviceType(userAgent: string): string {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const tabletRegex = /iPad|Tablet/i;

    if (mobileRegex.test(userAgent)) return 'mobile';
    if (tabletRegex.test(userAgent)) return 'tablet';
    return 'desktop';
  }
} 