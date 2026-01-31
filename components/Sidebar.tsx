
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ChevronRight, LogOut, Settings as SettingsIcon, Zap } from 'lucide-react';
import { NAVIGATION } from '../constants';
import { api } from '../services/api';
import { Alert } from '../types';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isWatsonMode, setIsWatsonMode] = useState(false);

  useEffect(() => {
    const unsubscribe = api.subscribeToAlerts((alerts) => {
      const count = alerts.filter(a => !a.isRead).length;
      setUnreadCount(count);
    });
    return unsubscribe;
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    if (newCount === 3) {
      setIsWatsonMode(!isWatsonMode);
      setLogoClicks(0);
      document.documentElement.classList.toggle('watson-theme');
    } else {
      setLogoClicks(newCount);
      setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  return (
    <div className={`w-64 h-screen border-r border-[#393939] flex flex-col fixed left-0 top-0 z-50 transition-colors duration-700 ${isWatsonMode ? 'bg-[#001141]' : 'bg-[#161616]'}`} role="navigation" aria-label="Sidebar Navigation">
      {/* BioRisk Brand Section */}
      <div 
        className="p-6 flex items-center gap-3 cursor-pointer group" 
        onClick={handleLogoClick}
        aria-label="BioRisk Guard Logo - Click 3 times for special mode"
      >
        <div className={`w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-500 ${isWatsonMode ? 'bg-gradient-to-br from-[#8A3FFC] to-[#08BDBA] rotate-12' : 'bg-[#0062FF]'}`}>
          {isWatsonMode ? <Zap className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-white leading-none">
            {isWatsonMode ? 'WatsonX' : 'BioRisk'}
          </span>
          <span className={`font-bold text-xs tracking-[0.2em] uppercase mt-1 transition-colors ${isWatsonMode ? 'text-[#08BDBA]' : 'text-[#0062FF]'}`}>
            {isWatsonMode ? 'Integrated' : 'Guard'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-0.5 px-0 overflow-y-auto">
        {NAVIGATION.map((item) => {
          const isActive = location.pathname === item.path;
          const isAlerts = item.name === 'Alerts';
          
          return (
            <Link
              key={item.name}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center justify-between px-6 py-3.5 transition-all duration-150 border-l-4 group ${
                isActive 
                  ? (isWatsonMode ? 'bg-[#122c7a] text-white border-[#08BDBA]' : 'bg-[#262626] text-white border-[#0062FF]')
                  : 'text-[#C6C6C6] hover:bg-[#262626] hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${isActive ? (isWatsonMode ? 'text-[#08BDBA]' : 'text-[#0062FF]') : 'text-[#A8A8A8] group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className="font-medium text-sm tracking-wide">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {isAlerts && unreadCount > 0 && (
                  <span className="bg-[#FF2D55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight className={`w-4 h-4 ${isWatsonMode ? 'text-[#08BDBA]' : 'text-[#0062FF]'}`} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto border-t border-[#393939]">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-2">
            <div className={`w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center font-bold text-white text-sm transition-all ${isWatsonMode ? 'bg-gradient-to-br from-[#8A3FFC] to-[#001141]' : 'bg-gradient-to-br from-[#0062FF] to-[#0043CE]'}`}>
              SS
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-[#F4F4F4] truncate">Soujanya S</span>
              <span className="text-[10px] text-[#A8A8A8] uppercase tracking-wider font-mono">Principal Risk Lead</span>
            </div>
          </div>
        </div>
        
        {/* System Status Banner */}
        <div className={`px-6 py-3 border-t transition-colors ${isWatsonMode ? 'bg-[#08BDBA]/10 border-[#08BDBA]/20' : 'bg-[#0062FF]/10 border-[#0062FF]/20'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isWatsonMode ? 'bg-[#08BDBA]' : 'bg-[#00C853]'}`} />
            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${isWatsonMode ? 'text-[#08BDBA]' : 'text-[#00C853]'}`}>
              {isWatsonMode ? 'Watson Logic Sync' : 'Agents Sync\'d'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
