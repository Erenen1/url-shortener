import React, { useState } from 'react';
import { AnalyticsFilterOptions } from '../../model/analytics.types';

interface CommonFiltersProps {
  filters: Partial<AnalyticsFilterOptions>;
  onChange: (filters: Partial<AnalyticsFilterOptions>) => void;
  icon?: React.ReactNode;
}

const CommonFilters: React.FC<CommonFiltersProps> = ({ filters, onChange, icon }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof AnalyticsFilterOptions, value: string | undefined) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onChange(updatedFilters);
  };

  return (
    <div className="flex items-center space-x-2xs">
      {icon}
      <div className="flex items-center space-x-2xs">
        <select 
          value={localFilters.channel || ''} 
          onChange={(e) => handleFilterChange('channel', e.target.value || undefined)}
          className="border border-divider rounded-md p-2xs"
        >
          <option value="">Tüm Kanallar</option>
          <option value="qr">QR Kod</option>
          <option value="link">Link</option>
        </select>

        <select 
          value={localFilters.country || ''} 
          onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
          className="border border-divider rounded-md p-2xs"
        >
          <option value="">Tüm Ülkeler</option>
          <option value="tr">Türkiye</option>
          <option value="us">Amerika</option>
        </select>

        <input 
          type="text" 
          placeholder="Etiket" 
          value={localFilters.tag || ''} 
          onChange={(e) => handleFilterChange('tag', e.target.value || undefined)}
          className="border border-divider rounded-md p-2xs"
        />
      </div>
    </div>
  );
};

export default CommonFilters; 