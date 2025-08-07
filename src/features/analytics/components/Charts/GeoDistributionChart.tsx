import React, { useMemo, useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup 
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { AnalyticsMetrics } from '../../model/analytics.types';

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

const GeoDistributionChart: React.FC<{ metrics: AnalyticsMetrics }> = ({ metrics }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);

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

  // Tıklama sayısına göre renk skalası - Daha belirgin ve resimdeki gibi
  const colorScale = useMemo(() => {
    const clicks = geoData.map(country => Number(country.clicks));
    const maxClicks = Math.max(...clicks);
    const minClicks = Math.min(...clicks);
    
    return scaleLinear<string>()
      .domain([0, minClicks, maxClicks])
      .range(['#E8F4FD', '#3B82F6', '#1E3A8A']); // Çok açık mavi -> Mavi -> Koyu mavi
  }, [geoData]);

  // Ülke kodlarını ISO3 formatına çevir
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Başlık Bölümü */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-3 sm:mb-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              🌍 Dünya Genelinde Trafik Dağılımı
            </h3>
            <p className="text-blue-100 text-sm">
              {totalVisits.toLocaleString()} toplam ziyaret • {geoData.length} aktif ülke
            </p>
          </div>
          
          {/* Renk Göstergesi */}
          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-slate-200 rounded border border-white"></div>
              <span className="text-blue-100">Veri Yok</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <span className="text-blue-100">Az</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-blue-100">Orta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-900 rounded"></div>
              <span className="text-blue-100">Yoğun</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Ana Harita - Tam Genişlik */}
        <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 relative">
          <div className="h-96 sm:h-[500px] lg:h-[600px] w-full">
            <ComposableMap 
              width={1200}
              height={600}
              projection="geoEquirectangular"
              projectionConfig={{
                center: [0, 0],
                scale: 180
              }}
              className="w-full h-full"
            >
              <ZoomableGroup zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: GeographyType[] }) =>
                    geographies.map((geo: GeographyType) => {
                      const countryInfo = getCountryInfo(geo);
                      const isHovered = hoveredGeo === geo.rsmKey;
                      
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
                              filter: 'brightness(1.1)'
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

          {/* Hover Tooltip */}
          {hoveredCountry && hoveredGeo && (
            <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 z-10">
                             <div className="text-sm font-semibold">
                 {(() => {
                   const foundCountry = geoData.find(c => 
                     hoveredGeo?.includes(c.code) || 
                     hoveredGeo?.includes(c.iso3 || '') ||
                     c.name.toLowerCase().includes(hoveredGeo?.toLowerCase() || '')
                   );
                   return foundCountry?.name || 'Hover edilen ülke';
                 })()}
               </div>
               <div className="text-xs text-gray-300 mt-1">
                 {(() => {
                   const foundCountry = geoData.find(c => 
                     hoveredGeo?.includes(c.code) || 
                     hoveredGeo?.includes(c.iso3 || '')
                   );
                   return foundCountry ? `${foundCountry.clicks.toLocaleString()} ziyaret` : 'Veri yok';
                 })()}
               </div>
            </div>
          )}
        </div>

        {/* Alt İstatistik Bölümü */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {geoData.slice(0, 6).map((country, index) => (
              <div 
                key={country.code}
                className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <div className="text-xs font-medium text-gray-500 mb-1">
                  #{index + 1}
                </div>
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: colorScale(Number(country.clicks)) }}
                >
                  {country.code}
                </div>
                <div className="font-semibold text-gray-800 text-sm truncate">
                  {country.name}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {country.clicks.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  %{country.percentage}
                </div>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{totalVisits.toLocaleString()}</span> toplam ziyaret • 
              <span className="font-semibold ml-1">{geoData.length}</span> aktif ülke • 
              <span className="ml-1">En yoğun: <span className="font-semibold">{geoData[0]?.name}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoDistributionChart; 