import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/triage', label: 'Health Check', icon: '🩺' },
    { path: '/map', label: 'Find Clinics', icon: '🗺️' },
    { path: '/first-aid', label: 'First Aid', icon: '🚑' },
    { path: '/mental-health', label: 'Mental Health', icon: '💙' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <nav className="flex space-x-4">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${
              location.pathname === item.path
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="hidden md:inline">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;