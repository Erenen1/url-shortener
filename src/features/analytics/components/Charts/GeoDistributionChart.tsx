import React, { useMemo, useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
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
}> = {
  'TR': { name: 'Türkiye', coordinates: [35, 39] },
  'US': { name: 'Amerika', coordinates: [-95.7129, 37.0902] },
  'DE': { name: 'Almanya', coordinates: [10.4515, 51.1657] },
  'FR': { name: 'Fransa', coordinates: [2.2137, 46.2276] },
  'JP': { name: 'Japonya', coordinates: [137.8389, 36.5748] },
  'CN': { name: 'Çin', coordinates: [104.1954, 35.8617] },
  'IN': { name: 'Hindistan', coordinates: [78.9629, 20.5937] },
  'BR': { name: 'Brezilya', coordinates: [-51.9253, -14.2350] },
  'RU': { name: 'Rusya', coordinates: [105.3188, 61.5240] },
  'AU': { name: 'Avustralya', coordinates: [133.7751, -25.2744] }
};

const GeoDistributionChart: React.FC<{ metrics: AnalyticsMetrics }> = ({ metrics }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

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
          percentage: ((clicks / Object.values(metrics.geoDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(2)
        };
      })
      .filter(country => country.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks);

    return processedData;
  }, [metrics.geoDistribution]);

  // Tıklama sayısına göre renk ve boyut skalası
  const colorScale = useMemo(() => {
    const clicks = geoData.map(country => Number(country.clicks));
    return {
      color: scaleLinear<string>()
        .domain([Math.min(...clicks), Math.max(...clicks)])
        .range(['#E6F3FF', '#1E40AF']),
      size: scaleLinear<number>()
        .domain([Math.min(...clicks), Math.max(...clicks)])
        .range([5, 25])
    };
  }, [geoData]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-md">
      {/* Dünya Haritası */}
      <div className="col-span-1 relative">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Dünya Trafik Dağılımı</h3>
        
        <div className="w-full h-[500px] border border-gray-200 rounded-lg">
          <ComposableMap 
            width={800}
            height={500}
            projection="geoMercator"
            projectionConfig={{
              center: [0, 20],
              scale: 140
            }}
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: GeographyType[] }) =>
                  geographies.map((geo: GeographyType) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#D6D6DA"
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Ülke işaretçileri */}
              {geoData.map((country) => (
                <Marker 
                  key={country.code}
                  coordinates={country.coordinates}
                  onMouseEnter={() => setHoveredCountry(country.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <circle
                    r={colorScale.size(Number(country.clicks))}
                    fill={colorScale.color(Number(country.clicks))}
                    fillOpacity={0.7}
                    stroke="#1E40AF"
                    strokeWidth={2}
                  />
                  
                  {/* Hover bilgisi */}
                  {hoveredCountry === country.code && (
                    <text
                      textAnchor="middle"
                      y={-20}
                      style={{ 
                        fontFamily: 'Arial', 
                        fontSize: '10px', 
                        fill: '#1E40AF',
                        fontWeight: 'bold'
                      }}
                    >
                      {country.name}
                    </text>
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>

      {/* Ülke Detayları */}
      <div className="col-span-1 bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Ülke Detayları</h3>
        
        {geoData.map((country) => (
          <div 
            key={country.code} 
            className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
            onMouseEnter={() => setHoveredCountry(country.code)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ 
                  backgroundColor: colorScale.color(Number(country.clicks)),
                  opacity: 0.7
                }}
              >
                {country.code}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {country.name}
                </div>
                <div className="text-sm text-gray-500">
                  Ülke Kodu: {country.code}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div 
                className="text-lg font-bold"
                style={{ color: colorScale.color(Number(country.clicks)) }}
              >
                {country.clicks} Tık
              </div>
              <div className="text-xs text-gray-500">
                %{country.percentage} Pay
              </div>
            </div>
          </div>
        ))}

        <div className="text-center text-xs text-gray-500 mt-4">
          Toplam: {geoData.reduce((sum, country) => sum + Number(country.clicks), 0)} Tıklama
        </div>
      </div>
    </div>
  );
};

export default GeoDistributionChart; 