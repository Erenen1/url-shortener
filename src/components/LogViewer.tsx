import React, { useState } from 'react';
import { 
  DocumentIcon, 
  LinkIcon, 
  ClockIcon, 
  DocumentCheckIcon 
} from '@heroicons/react/24/outline';

const LogViewer: React.FC = () => {
  const [dateRange, setDateRange] = useState('7 gün');
  const dateRangeOptions = ['7 gün', '30 gün', '90 gün'];

  const logs = [
    { 
      id: 1, 
      timestamp: '2023-06-15 10:30:45', 
      url: 'https://example.com', 
      shortUrl: 'http://short.url/abc123', 
      action: 'Created',
      icon: <DocumentIcon className="w-5 h-5 text-primary-accent" />
    },
    { 
      id: 2, 
      timestamp: '2023-06-15 11:15:22', 
      url: 'https://another-example.com', 
      shortUrl: 'http://short.url/def456', 
      action: 'Accessed',
      icon: <LinkIcon className="w-5 h-5 text-success" />
    },
    { 
      id: 3, 
      timestamp: '2023-06-15 12:05:11', 
      url: 'https://test.com', 
      shortUrl: 'http://short.url/ghi789', 
      action: 'Deleted',
      icon: <DocumentCheckIcon className="w-5 h-5 text-danger" />
    },
  ];

  return (
    <div className="space-y-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-h1 text-text-primary flex items-center">
          <ClockIcon className="w-6 h-6 mr-2xs text-primary-accent" />
          URL Log Kayıtları
        </h2>
        <div className="flex items-center space-x-2xs">
          <span className="text-text-secondary text-meta">Tarih Aralığı:</span>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-surface border border-divider rounded-md px-2xs py-4xs text-body"
          >
            {dateRangeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-surface border border-divider rounded-card shadow-sm">
        <table className="w-full">
          <thead className="bg-subtle border-b border-divider">
            <tr>
              <th className="p-2xs text-left text-meta text-text-secondary">İşlem</th>
              <th className="p-2xs text-left text-meta text-text-secondary">Zaman Damgası</th>
              <th className="p-2xs text-left text-meta text-text-secondary">Orijinal URL</th>
              <th className="p-2xs text-left text-meta text-text-secondary">Kısa URL</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr 
                key={log.id} 
                className="border-b border-divider last:border-b-0 hover:bg-subtle transition-colors-all"
              >
                <td className="p-2xs">
                  <div className="flex items-center space-x-2xs">
                    {log.icon}
                    <span className={`
                      text-meta px-2xs py-4xs rounded-sm
                      ${log.action === 'Created' ? 'bg-primary-accent/10 text-primary-accent' : 
                        log.action === 'Accessed' ? 'bg-success/10 text-success' : 
                        'bg-danger/10 text-danger'}
                    `}>
                      {log.action}
                    </span>
                  </div>
                </td>
                <td className="p-2xs text-body text-text-secondary">
                  <div className="flex items-center space-x-2xs">
                    <ClockIcon className="w-4 h-4 text-text-muted" />
                    <span>{log.timestamp}</span>
                  </div>
                </td>
                <td className="p-2xs text-body text-text-secondary truncate max-w-xs">{log.url}</td>
                <td className="p-2xs text-body text-text-secondary">{log.shortUrl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogViewer; 