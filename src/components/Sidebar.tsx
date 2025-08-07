import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  LinkIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <ChartBarIcon className="w-5 h-5" />,
      activeColor: 'text-blue-600',
      inactiveColor: 'text-gray-600'
    },
    { 
      path: '/map', 
      label: 'Dünya Haritası', 
      icon: <GlobeAltIcon className="w-5 h-5" />,
      activeColor: 'text-green-600',
      inactiveColor: 'text-gray-600'
    },
    { 
      path: '/logs', 
      label: 'Log Viewer', 
      icon: <DocumentTextIcon className="w-5 h-5" />,
      activeColor: 'text-purple-600',
      inactiveColor: 'text-gray-600'
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10"
      >
        {isCollapsed ? (
          <Bars3Icon className="w-4 h-4 text-gray-600" />
        ) : (
          <XMarkIcon className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="p-4">
        {/* Logo/Title */}
        <div className={`flex items-center mb-6 pb-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : ''}`}>
          <LinkIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900 ml-2 truncate">URL Shortener</h1>
          )}
        </div>
        
        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`
                      flex items-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? `bg-blue-50 ${item.activeColor} shadow-sm` 
                        : `hover:bg-gray-50 ${item.inactiveColor} hover:text-gray-900`}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={`${isActive ? 'opacity-100' : 'opacity-70'} flex-shrink-0`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className={`ml-3 text-sm ${isActive ? 'font-semibold' : 'font-medium'} truncate`}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && isActive && (
                      <div className="ml-auto w-2 h-2 bg-current rounded-full opacity-60"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Info - sadece açık durumda göster */}
        {!isCollapsed && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>URL Shortener v1.0</div>
              <div>Analytics Dashboard</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 