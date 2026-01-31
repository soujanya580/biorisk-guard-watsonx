import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Terminal, Play, Square, Clock, Zap, PauseCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import { useHackathon, FULL_DEMO_PATH } from '../context/HackathonContext';
import { sounds } from '../services/soundService';
import { api } from '../services/api';
import { Alert } from '../types';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isGenosymActive, setIsGenosymActive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { isHackathonMode, toggleHackathonMode, isAutoDemoActive, runAutoDemo, stopAutoDemo, demoStepIndex, setDemoStepIndex } = useHackathon();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to track if demo loop should continue
  const activeTourRef = useRef<boolean>(false);
  
  useEffect(() => {
    const unsubscribe = api.subscribeToAlerts(setAlerts);
    return unsubscribe;
  }, []);

  // PERFECT SYNC GUIDED TOUR LOOP
  useEffect(() => {
    if (isAutoDemoActive && demoStepIndex >= 0 && !activeTourRef.current) {
      const executePerfectSyncStep = async (index: number) => {
        if (!isAutoDemoActive || index >= FULL_DEMO_PATH.length) {
          stopAutoDemo();
          activeTourRef.current = false;
          navigate('/'); // Return home when done
          return;
        }

        activeTourRef.current = true;
        const step = FULL_DEMO_PATH[index];

        // 1. SWITCH TAB FIRST (INSTANTLY)
        if (location.pathname !== step.path) {
          navigate(step.path);
        }

        // 2. WAIT JUST 50ms FOR RENDER (as requested)
        await new Promise(r => setTimeout(r, 50));

        // 3. SPEAK IMMEDIATELY (Using native TTS for zero-latency start in Tour)
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(step.narrative);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || 
                               voices.find(v => v.lang.startsWith('en-US')) || 
                               voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 0.85; // Slower and clearer
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Promise to handle completion
        const speechEnded = new Promise<void>((resolve) => {
          utterance.onend = () => resolve();
          // Fallback timer if onend fails (character count * 65ms + buffer)
          setTimeout(resolve, step.narrative.length * 75 + 1000);
        });

        window.speechSynthesis.speak(utterance);

        // 4. WAIT FOR SPEECH FINISH + BUFFER
        await speechEnded;
        await new Promise(r => setTimeout(r, 400)); // Small breathing room between steps

        // 5. TRIGGER NEXT STEP
        if (isAutoDemoActive && activeTourRef.current) {
          activeTourRef.current = false;
          setDemoStepIndex(index + 1);
        }
      };

      executePerfectSyncStep(demoStepIndex);
    }
    
    return () => {
      if (!isAutoDemoActive) {
        activeTourRef.current = false;
        window.speechSynthesis.cancel();
      }
    };
  }, [demoStepIndex, isAutoDemoActive, navigate]);

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

  const handleStartFullDemo = () => {
    sounds.playTone(880, 0.2);
    runAutoDemo();
  };

  const handleStopDemo = () => {
    sounds.playTone(440, 0.2);
    activeTourRef.current = false;
    stopAutoDemo();
    navigate('/');
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const pageTitle = NAVIGATION.find(item => item.path === location.pathname)?.name || 'BioRisk Guard';

  return (
    <div className="sticky top-0 z-40">
      {isAutoDemoActive && demoStepIndex >= 0 && (
        <div className="bg-[#00C853] h-10 flex items-center px-8 justify-between text-[#161616] overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
              TOUR ACTIVE: {FULL_DEMO_PATH[demoStepIndex]?.name || 'Finalizing'}
            </span>
            <div className="flex-1 max-w-md h-1 bg-[#161616]/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#161616] transition-all duration-1000 ease-linear"
                style={{ width: `${((demoStepIndex + 1) / FULL_DEMO_PATH.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] font-bold">
            <span className="opacity-70 uppercase tracking-widest">Built with IBM Best Practices</span>
          </div>
        </div>
      )}
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
          {/* TOUR CONTROLS */}
          <div className="flex gap-2">
            {!isAutoDemoActive ? (
              <button 
                onClick={handleStartFullDemo}
                className="flex items-center gap-3 px-6 py-2.5 bg-[#00C853] hover:bg-[#00a846] text-[#161616] rounded-sm text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#00C853]/30 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                START GUIDED TOUR
              </button>
            ) : (
              <button 
                onClick={handleStopDemo}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#393939] border border-[#525252] hover:bg-[#525252] text-white rounded-sm text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg"
                title="Pause Tour"
              >
                <PauseCircle className="w-4 h-4" />
                PAUSE TOUR
              </button>
            )}
          </div>

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
