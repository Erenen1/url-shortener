import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  LinkIcon 
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <ChartBarIcon className="w-5 h-5" />,
      activeColor: 'text-primary-accent',
      inactiveColor: 'text-text-muted'
    },
    { 
      path: '/logs', 
      label: 'Log Viewer', 
      icon: <DocumentTextIcon className="w-5 h-5" />,
      activeColor: 'text-success',
      inactiveColor: 'text-text-muted'
    }
  ];

  return (
    <aside className="w-64 bg-surface border-r border-divider p-sm">
      <div className="flex items-center mb-md border-b border-divider pb-sm">
        <LinkIcon className="w-6 h-6 mr-2xs text-primary-accent" />
        <h1 className="text-h1 font-bold text-text-primary">URL Shortener</h1>
      </div>
      
      <nav>
        <ul className="space-y-2xs">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`
                    flex items-center p-2xs rounded-md transition-colors-all
                    ${isActive 
                      ? `bg-subtle ${item.activeColor}` 
                      : `hover:bg-subtle/50 ${item.inactiveColor}`}
                  `}
                >
                  <span className={`mr-2xs ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-body ${isActive ? 'font-semibold' : 'font-normal'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 