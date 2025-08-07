import React, { useMemo, useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup 
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { AnalyticsService } from '../services/analytics.service';

// Dünya haritası için GeoJSON dosyasının yolu
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Coğrafi veri için tür tanımlaması
interface GeographyType {
  rsmKey: string;
  type: string;
  properties: {
    name: string;
    ISO_A3?: string;
    ISO_A2?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

// Ülke koordinatları ve bilgileri
const COUNTRY_COORDS: Record<string, { 
  name: string; 
  coordinates: [number, number]; 
  iso3?: string;
}> = {
  'TR': { name: 'Türkiye', coordinates: [35, 39], iso3: 'TUR' },
  'US': { name: 'Amerika', coordinates: [-95.7129, 37.0902], iso3: 'USA' },
  'DE': { name: 'Almanya', coordinates: [10.4515, 51.1657], iso3: 'DEU' },
  'FR': { name: 'Fransa', coordinates: [2.2137, 46.2276], iso3: 'FRA' },
  'JP': { name: 'Japonya', coordinates: [137.8389, 36.5748], iso3: 'JPN' },
  'CN': { name: 'Çin', coordinates: [104.1954, 35.8617], iso3: 'CHN' },
  'IN': { name: 'Hindistan', coordinates: [78.9629, 20.5937], iso3: 'IND' },
  'BR': { name: 'Brezilya', coordinates: [-51.9253, -14.2350], iso3: 'BRA' },
  'RU': { name: 'Rusya', coordinates: [105.3188, 61.5240], iso3: 'RUS' },
  'AU': { name: 'Avustralya', coordinates: [133.7751, -25.2744], iso3: 'AUS' }
};

const WorldMap: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredGeo, setHoveredGeo] = useState<GeographyType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Analytics service'ten veri al
  const analyticsService = useMemo(() => new AnalyticsService(), []);
  const metrics = useMemo(() => {
    return analyticsService.calculateMetrics(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
      new Date(),
      {}
    );
  }, [analyticsService]);

  // Ülke verilerini işle
  const geoData = useMemo(() => {
    const processedData = Object.entries(metrics.geoDistribution)
      .map(([countryCode, clicks]) => {
        const countryInfo = COUNTRY_COORDS[countryCode.toUpperCase()] || { 
          name: countryCode, 
          coordinates: [0, 0]
        };
        
        return {
          ...countryInfo,
          code: countryCode.toUpperCase(),
          clicks,
          percentage: ((clicks / Object.values(metrics.geoDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        };
      })
      .filter(country => country.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks);

    return processedData;
  }, [metrics.geoDistribution]);

  // Renk skalası - Fotoğraftaki gibi mavi tonları
  const colorScale = useMemo(() => {
    const clicks = geoData.map(country => Number(country.clicks));
    const maxClicks = Math.max(...clicks);
    const minClicks = Math.min(...clicks);
    
    return scaleLinear<string>()
      .domain([0, minClicks, maxClicks])
      .range(['#F0F8FF', '#87CEEB', '#4682B4']); // Açık mavi → Orta mavi → Koyu mavi
  }, [geoData]);

  // Ülke kodlarını map'e çevir
  const countryDataMap = useMemo(() => {
    const map = new Map<string, number>();
    geoData.forEach(country => {
      map.set(country.code, country.clicks);
      if (country.iso3) {
        map.set(country.iso3, country.clicks);
      }
    });
    return map;
  }, [geoData]);

  // Ülke rengini belirle
  const getCountryColor = (geo: GeographyType) => {
    const iso2 = geo.properties.ISO_A2;
    const iso3 = geo.properties.ISO_A3;
    const countryName = geo.properties.name;
    
    let clicks = 0;
    if (iso2 && countryDataMap.has(iso2)) {
      clicks = countryDataMap.get(iso2) || 0;
    } else if (iso3 && countryDataMap.has(iso3)) {
      clicks = countryDataMap.get(iso3) || 0;
    } else {
      const manualMappings: Record<string, string> = {
        'Turkey': 'TR',
        'United States of America': 'US',
        'Germany': 'DE',
        'France': 'FR',
        'Japan': 'JP',
        'China': 'CN',
        'India': 'IN',
        'Brazil': 'BR',
        'Russia': 'RU',
        'Australia': 'AU'
      };
      
      const mappedCode = manualMappings[countryName];
      if (mappedCode && countryDataMap.has(mappedCode)) {
        clicks = countryDataMap.get(mappedCode) || 0;
      }
    }

    return colorScale(clicks);
  };

  // Ülke bilgisini al
  const getCountryInfo = (geo: GeographyType) => {
    const iso2 = geo.properties.ISO_A2;
    const iso3 = geo.properties.ISO_A3;
    const countryName = geo.properties.name;
    
    let clicks = 0;
    let countryDisplayName = countryName;
    
    if (iso2 && countryDataMap.has(iso2)) {
      clicks = countryDataMap.get(iso2) || 0;
      const countryInfo = geoData.find(c => c.code === iso2);
      if (countryInfo) countryDisplayName = countryInfo.name;
    } else if (iso3 && countryDataMap.has(iso3)) {
      clicks = countryDataMap.get(iso3) || 0;
      const countryInfo = geoData.find(c => c.iso3 === iso3);
      if (countryInfo) countryDisplayName = countryInfo.name;
    } else {
      const manualMappings: Record<string, string> = {
        'Turkey': 'TR',
        'United States of America': 'US',
        'Germany': 'DE',
        'France': 'FR',
        'Japan': 'JP',
        'China': 'CN',
        'India': 'IN',
        'Brazil': 'BR',
        'Russia': 'RU',
        'Australia': 'AU'
      };
      
      const mappedCode = manualMappings[countryName];
      if (mappedCode && countryDataMap.has(mappedCode)) {
        clicks = countryDataMap.get(mappedCode) || 0;
        const countryInfo = geoData.find(c => c.code === mappedCode);
        if (countryInfo) countryDisplayName = countryInfo.name;
      }
    }

    return { clicks, name: countryDisplayName };
  };

  const totalVisits = geoData.reduce((sum, country) => sum + Number(country.clicks), 0);

  // Mouse pozisyonunu takip et
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="min-h-screen bg-gray-50" onMouseMove={handleMouseMove}>
      {/* Full Screen Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🌍 Dünya Trafik Haritası
            </h1>
            <p className="text-sm text-gray-600">
              {totalVisits.toLocaleString()} toplam ziyaret • {geoData.length} aktif ülke • Gerçek zamanlı analitik
            </p>
          </div>
          
          {/* Renk Efsanesi */}
          <div className="flex items-center space-x-4 mt-3 sm:mt-0 text-sm">
            <span className="text-gray-600 font-medium">Trafik Yoğunluğu:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
                <span className="text-gray-600">Veri Yok</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span className="text-gray-600">Az</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-gray-600">Orta</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-700 rounded"></div>
                <span className="text-gray-600">Yoğun</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tam Ekran Harita */}
      <div className="relative bg-white">
        <div className="h-[calc(100vh-120px)] w-full overflow-hidden">
          <ComposableMap 
            width={1400}
            height={700}
            projection="geoEquirectangular"
            projectionConfig={{
              center: [0, 0],
              scale: 200
            }}
            className="w-full h-full"
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: GeographyType[] }) =>
                  geographies.map((geo: GeographyType) => {
                    const countryInfo = getCountryInfo(geo);
                    const isHovered = hoveredGeo?.rsmKey === geo.rsmKey;
                    
                    return (
                                             <Geography
                         key={geo.rsmKey}
                         geography={geo}
                         fill={getCountryColor(geo)}
                         stroke="#FFFFFF"
                         strokeWidth={0.5}
                         style={{
                           default: { 
                             outline: 'none',
                             transition: 'all 0.2s ease'
                           },
                           hover: { 
                             outline: 'none',
                             stroke: '#1E40AF',
                             strokeWidth: 2,
                             filter: 'brightness(1.1)',
                             cursor: 'pointer'
                           },
                           pressed: { outline: 'none' }
                         }}
                       />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Floating Tooltip - Resimdeki gibi */}
        {hoveredGeo && (
          <div 
            className="fixed bg-gray-900 bg-opacity-95 text-white px-4 py-3 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700 z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 15,
              top: mousePosition.y - 60,
              transform: mousePosition.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="text-sm font-semibold">
              {(() => {
                const countryInfo = getCountryInfo(hoveredGeo);
                return countryInfo.name;
              })()}
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {(() => {
                const countryInfo = getCountryInfo(hoveredGeo);
                return countryInfo.clicks > 0 
                  ? `${countryInfo.clicks.toLocaleString()} ziyaret` 
                  : 'Veri bulunmuyor';
              })()}
            </div>
          </div>
        )}

        {/* Sol Alt: Top Ülkeler */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 w-80">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            🏆 En Çok Ziyaret Edilen Ülkeler
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {geoData.slice(0, 8).map((country, index) => (
              <div 
                key={country.code}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colorScale(Number(country.clicks)) }}
                  ></div>
                  <span className="font-medium text-gray-800 text-sm">
                    {country.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-sm">
                    {country.clicks.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    %{country.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Alt: İstatistikler */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Özet İstatistik</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {totalVisits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Toplam Ziyaret</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {geoData.length}
              </div>
              <div className="text-xs text-gray-600">Aktif Ülke</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600">
                {geoData[0]?.name?.slice(0, 8) || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">En Yoğun</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">
                %{((geoData.length / 195) * 100).toFixed(0)}
              </div>
              <div className="text-xs text-gray-600">Kapsamak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 