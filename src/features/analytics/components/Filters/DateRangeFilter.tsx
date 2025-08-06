import React from 'react';

interface DateRangeFilterProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
  icon?: React.ReactNode;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange, icon }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ 
      start: new Date(e.target.value), 
      end: value.end 
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ 
      start: value.start, 
      end: new Date(e.target.value) 
    });
  };

  return (
    <div className="flex items-center space-x-2xs">
      {icon}
      <div className="flex items-center space-x-2xs">
        <label className="text-text-muted text-sm">Başlangıç:</label>
        <input 
          type="date" 
          value={value.start.toISOString().split('T')[0]} 
          onChange={handleStartDateChange}
          className="border border-divider rounded-md p-2xs"
        />
        <label className="text-text-muted text-sm">Bitiş:</label>
        <input 
          type="date" 
          value={value.end.toISOString().split('T')[0]} 
          onChange={handleEndDateChange}
          className="border border-divider rounded-md p-2xs"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter; 