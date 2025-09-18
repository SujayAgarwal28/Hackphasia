import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationItems: NavItem[] = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5h8" />
        </svg>
      ),
      description: 'Overview & Quick Access'
    },
    { 
      path: '/ai-triage', 
      label: 'AI Assessment', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: 'AI-Powered Health Triage'
    },
    { 
      path: '/multilingual', 
      label: 'Translation', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      description: 'Multilingual AI Support'
    },
    { 
      path: '/mental-health', 
      label: 'Mental Health', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      description: 'Wellness & Support Resources'
    },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`group relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <span className={`mr-2 transition-colors duration-200 ${
              isActive ? 'text-blue-600' : 'text-neutral-500 group-hover:text-neutral-700'
            }`}>
              {item.icon}
            </span>
            <span className="hidden xl:inline">{item.label}</span>
            
            {/* Tooltip for smaller screens */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap xl:hidden z-50">
              <div className="text-center">
                <div className="font-medium">{item.label}</div>
                <div className="text-neutral-300 text-xs">{item.description}</div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;