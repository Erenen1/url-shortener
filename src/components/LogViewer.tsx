import React, { useState, useMemo } from 'react';
import { 
  DocumentIcon, 
  LinkIcon, 
  ClockIcon, 
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Log tipi tanımlaması
interface LogEntry {
  id: number;
  timestamp: string;
  url: string;
  shortUrl: string;
  action: 'Created' | 'Accessed' | 'Deleted' | 'Updated';
  ipAddress: string;
  userAgent: string;
  country: string;
  clicks?: number;
}

// Filtreleme seçenekleri
interface FilterOptions {
  dateRange: string;
  actionType: string;
  searchUrl: string;
  searchShortUrl: string;
  country: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const LogViewer: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    actionType: 'all',
    searchUrl: '',
    searchShortUrl: '',
    country: 'all',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Mock log verileri - daha kapsamlı
  const allLogs: LogEntry[] = [
    { 
      id: 1, 
      timestamp: '2024-01-15 10:30:45', 
      url: 'https://example.com/blog/react-tutorial', 
      shortUrl: 'http://short.url/abc123', 
      action: 'Created',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      country: 'TR',
      clicks: 45
    },
    { 
      id: 2, 
      timestamp: '2024-01-15 11:15:22', 
      url: 'https://github.com/user/repo', 
      shortUrl: 'http://short.url/def456', 
      action: 'Accessed',
      ipAddress: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      country: 'US',
      clicks: 23
    },
    { 
      id: 3, 
      timestamp: '2024-01-15 12:05:11', 
      url: 'https://docs.google.com/spreadsheet', 
      shortUrl: 'http://short.url/ghi789', 
      action: 'Deleted',
      ipAddress: '172.16.0.5',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      country: 'DE',
      clicks: 0
    },
    { 
      id: 4, 
      timestamp: '2024-01-15 14:20:30', 
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', 
      shortUrl: 'http://short.url/jkl012', 
      action: 'Created',
      ipAddress: '203.0.113.1',
      userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
      country: 'JP',
      clicks: 127
    },
    { 
      id: 5, 
      timestamp: '2024-01-15 15:45:18', 
      url: 'https://stackoverflow.com/questions/react-hooks', 
      shortUrl: 'http://short.url/mno345', 
      action: 'Accessed',
      ipAddress: '198.51.100.2',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/96.0',
      country: 'FR',
      clicks: 89
    },
    { 
      id: 6, 
      timestamp: '2024-01-15 16:12:07', 
      url: 'https://medium.com/@author/article', 
      shortUrl: 'http://short.url/pqr678', 
      action: 'Updated',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/108.0',
      country: 'TR',
      clicks: 56
    }
  ];

  // Filtrelenmiş logları hesapla
  const filteredLogs = useMemo(() => {
    let filtered = [...allLogs];

    // İşlem türü filtresi
    if (filters.actionType !== 'all') {
      filtered = filtered.filter(log => log.action.toLowerCase() === filters.actionType);
    }

    // URL arama filtresi
    if (filters.searchUrl.trim()) {
      filtered = filtered.filter(log => 
        log.url.toLowerCase().includes(filters.searchUrl.toLowerCase())
      );
    }

    // Kısa URL arama filtresi
    if (filters.searchShortUrl.trim()) {
      filtered = filtered.filter(log => 
        log.shortUrl.toLowerCase().includes(filters.searchShortUrl.toLowerCase())
      );
    }

    // Ülke filtresi
    if (filters.country !== 'all') {
      filtered = filtered.filter(log => log.country === filters.country);
    }

    // Tarih filtresi (basit versiyon)
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= cutoffDate;
      });
    }

    // Sıralama
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'url':
          comparison = a.url.localeCompare(b.url);
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'clicks':
          comparison = (a.clicks || 0) - (b.clicks || 0);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [allLogs, filters]);

  // Filtre güncelleme fonksiyonu
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      actionType: 'all',
      searchUrl: '',
      searchShortUrl: '',
      country: 'all',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
  };

  // İşlem türü ikonları
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Created':
        return <PlusIcon className="w-5 h-5 text-green-600" />;
      case 'Accessed':
        return <EyeIcon className="w-5 h-5 text-blue-600" />;
      case 'Deleted':
        return <TrashIcon className="w-5 h-5 text-red-600" />;
      case 'Updated':
        return <DocumentCheckIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  // İşlem türü rengi
  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Accessed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Deleted':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Updated':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <ClockIcon className="w-8 h-8 mr-3 text-blue-600" />
              URL Log Kayıtları
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredLogs.length} kayıt bulundu • Toplam {allLogs.length} kayıt
            </p>
          </div>
          
          {/* Hızlı Filtreler */}
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Gelişmiş Filtre</span>
            </button>
            
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Temizle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Gelişmiş Filtreler */}
        {showAdvancedFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2 text-blue-600" />
              Filtreleme Seçenekleri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tarih Aralığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih Aralığı
                </label>
                <select 
                  value={filters.dateRange} 
                  onChange={(e) => updateFilter('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm Zamanlar</option>
                  <option value="1">Son 1 Gün</option>
                  <option value="7">Son 7 Gün</option>
                  <option value="30">Son 30 Gün</option>
                  <option value="90">Son 90 Gün</option>
                </select>
              </div>

              {/* İşlem Türü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İşlem Türü
                </label>
                <select 
                  value={filters.actionType} 
                  onChange={(e) => updateFilter('actionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm İşlemler</option>
                  <option value="created">Oluşturma</option>
                  <option value="accessed">Erişim</option>
                  <option value="updated">Güncelleme</option>
                  <option value="deleted">Silme</option>
                </select>
              </div>

              {/* Ülke */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ülke
                </label>
                <select 
                  value={filters.country} 
                  onChange={(e) => updateFilter('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm Ülkeler</option>
                  <option value="TR">Türkiye</option>
                  <option value="US">Amerika</option>
                  <option value="DE">Almanya</option>
                  <option value="FR">Fransa</option>
                  <option value="JP">Japonya</option>
                </select>
              </div>

              {/* URL Arama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orijinal URL'de Ara
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchUrl}
                    onChange={(e) => updateFilter('searchUrl', e.target.value)}
                    placeholder="URL'de ara..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Kısa URL Arama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kısa URL'de Ara
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchShortUrl}
                    onChange={(e) => updateFilter('searchShortUrl', e.target.value)}
                    placeholder="Kısa URL'de ara..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <div className="flex space-x-2">
                  <select 
                    value={filters.sortBy} 
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="timestamp">Tarih</option>
                    <option value="url">URL</option>
                    <option value="action">İşlem</option>
                    <option value="clicks">Tıklama</option>
                  </select>
                  <select 
                    value={filters.sortOrder} 
                    onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="desc">↓ Azalan</option>
                    <option value="asc">↑ Artan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Tablosu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orijinal URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kısa URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ülke
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tıklama
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getActionIcon(log.action)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={log.url}>
                        {log.url}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {log.shortUrl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {log.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">{log.clicks || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sonuç yoksa */}
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sonuç bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Filtreleme kriterlerinizi değiştirmeyi deneyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 