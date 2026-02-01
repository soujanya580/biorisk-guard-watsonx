import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Terminal, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import { useHackathon } from '../context/HackathonContext';
import { api } from '../services/api';
import { Alert } from '../types';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isGenosymActive, setIsGenosymActive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { isHackathonMode, toggleHackathonMode } = useHackathon();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const unsubscribe = api.subscribeToAlerts(setAlerts);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (searchValue.toLowerCase() === 'genosym') {
      setIsGenosymActive(true);
      setTimeout(() => setIsGenosymActive(false), 3000);
    }
  }, [searchValue]);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const pageTitle = NAVIGATION.find(item => item.path === location.pathname)?.name || 'BioRisk Guard';

  return (
    <div className="sticky top-0 z-40">
      <header className="h-16 bg-[#161616] border-b border-[#393939] flex items-center justify-between px-8" role="banner">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-white tracking-wide">{pageTitle}</h2>
          <div className="h-6 w-px bg-[#393939] hidden md:block" />
          <div className="relative hidden lg:block group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isGenosymActive ? 'text-ibm-green' : 'text-[#A8A8A8] group-focus-within:text-ibm-blue'}`} />
            <input 
              type="text" 
              placeholder="Search enterprise vendors or reports..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`bg-ibm-gray border rounded-sm py-1.5 pl-10 pr-4 text-xs text-white w-80 focus:outline-none transition-all placeholder:text-[#6F6F6F] ${isGenosymActive ? 'border-ibm-green shadow-[0_0_10px_#00C853]' : 'border-transparent focus:border-ibm-blue'}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleHackathonMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              isHackathonMode 
                ? 'bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00] shadow-[0_0_10px_#00FF0033]' 
                : 'bg-ibm-gray border-ibm-lightGray text-[#A8A8A8] hover:text-white hover:border-[#525252]'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 ${isHackathonMode ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isHackathonMode ? 'HACK_MODE: ON' : 'HACK_MODE: OFF'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 text-[#A8A8A8] hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 transition-colors relative ${showNotifications ? 'text-white bg-ibm-gray' : 'text-[#A8A8A8] hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF2D55] border-2 border-[#161616] rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-ibm-gray border border-ibm-lightGray shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-ibm-lightGray flex justify-between items-center bg-[#1c1c1c]">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">System Notifications</h3>
                    <button onClick={() => api.markAllAlertsAsRead()} className="text-[8px] font-bold text-ibm-blue hover:underline uppercase">Clear All</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {alerts.length > 0 ? (
                      alerts.slice(0, 10).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 border-b border-ibm-lightGray hover:bg-[#1c1c1c] transition-colors cursor-pointer group ${!alert.isRead ? 'border-l-2 border-l-[#FF2D55]' : ''}`}
                          onClick={() => {
                            api.markAlertAsRead(alert.id);
                            navigate('/alerts');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tight group-hover:text-ibm-blue">{alert.vendorName}</span>
                            <span className="text-[8px] font-mono text-[#525252] flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A8A8A8] leading-relaxed line-clamp-2">{alert.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-[10px] text-[#525252] uppercase font-mono italic">
                        Zero anomalies detected
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => { navigate('/alerts'); setShowNotifications(false); }}
                    className="w-full p-3 text-[9px] font-bold text-[#A8A8A8] hover:text-white uppercase tracking-widest border-t border-ibm-lightGray bg-[#1c1c1c]"
                  >
                    View All Alerts
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-ibm-lightGray mx-2" />

            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-sm hover:bg-ibm-gray transition-colors group">
              <div className="w-7 h-7 bg-ibm-lightGray rounded-sm flex items-center justify-center text-xs font-bold text-white group-hover:bg-ibm-blue transition-all">
                SS
              </div>
              <ChevronDown className="w-4 h-4 text-[#A8A8A8]" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;