
import React, { useState, useEffect } from 'react';
import { 
  Watch, 
  Activity, 
  Heart, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Users, 
  Lock,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  BrainCircuit,
  Bell,
  Stethoscope,
  Terminal,
  Cpu,
  MapPin,
  TrendingUp,
  Monitor,
  Cloud,
  History
} from 'lucide-react';
import { api } from '../services/api';
import { fetchWearableData } from '../services/wearableService';
import { WearableTelemetry, Vendor } from '../types';
import { sounds } from '../services/soundService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STRESS_DATA_WEEKLY = [
  { day: 'Mon', stress: 4.2 },
  { day: 'Tue', stress: 4.8 },
  { day: 'Wed', stress: 6.8 },
  { day: 'Thu', stress: 5.1 },
  { day: 'Fri', stress: 7.4 },
  { day: 'Sat', stress: 3.9 },
  { day: 'Sun', stress: 3.2 },
];

const WearableMonitor: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('pfizer-boston-lab');
  const [telemetry, setTelemetry] = useState<WearableTelemetry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpiking, setIsSpiking] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [staffData, setStaffData] = useState<WearableTelemetry[]>([]);

  useEffect(() => {
    api.getVendors().then(vends => {
      setVendors(vends);
      const target = vends.find(v => v.id === 'pfizer-boston-lab');
      if (target) {
        handleSync('pfizer-boston-lab');
      }
    });
  }, []);

  const handleSync = async (vendorId: string) => {
    setSelectedVendorId(vendorId);
    if (!vendorId) return;

    setIsLoading(true);
    try {
      const data = await fetchWearableData(vendorId);
      // Augment data for Pfizer Boston Lab specific tech #14 requirement
      const augmentedData = data.map((t, i) => i === 0 ? { ...t, workerId: 'LAB-TECH-14', role: 'LAB_TECH' as any, stressScore: 6.8 } : t);
      setStaffData(augmentedData);
      setTelemetry(augmentedData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSpike = () => {
    setIsSpiking(true);
    sounds.playAlert();
    setStaffData(prev => prev.map(t => t.workerId === 'LAB-TECH-14' ? { ...t, stressScore: 9.8 } : t));
    
    setTimeout(() => {
      alert("EMERGENCY PROTOCOL TRIGGERED: Technician #14 stress exceeds 9.5. Supervisor notified. Sensitive BSL-3 genomic procedures paused automatically via ERCA-Maximo link.");
    }, 500);
  };

  const toggleTrends = () => {
    setShowTrends(!showTrends);
    sounds.playTone(400, 0.1);
  };

  return (
    <div className={`p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700 ${isSpiking ? 'animate-shake' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center rounded-sm shadow-lg shadow-indigo-500/10">
            <Watch className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase italic">Wearable <span className="font-bold text-indigo-400">Hub</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Personnel health command for high-containment biosafety environments.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-indigo-400/60">Active Facility</label>
            <select 
              value={selectedVendorId}
              onChange={(e) => handleSync(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none font-mono cursor-pointer appearance-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-[#393939] rotate-90" />
          </div>
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            IBM Watson IoT Patterns: Active ✓
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[600px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center">
           <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-8" />
           <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Syncing Personnel Telemetry Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Dashboard and Health Grid (Left 8 cols) */}
          <div className="xl:col-span-8 space-y-8">
            {/* Live Biometric Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#393939] border border-[#393939] shadow-2xl">
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Active Wearables</p>
                     <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-4xl font-black text-white font-mono tracking-tighter">47</h4>
                  <p className="text-[9px] text-indigo-400 font-mono font-bold uppercase">Devices Connected</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Real-time Stress Index</p>
                     <Zap className="w-4 h-4" />
                  </div>
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${isSpiking ? 'text-[#FF2D55]' : 'text-[#FFD600]'}`}>
                    {isSpiking ? '9.8' : '6.8'}<span className="text-sm font-normal">/10</span>
                  </h4>
                  <p className={`text-[9px] font-mono font-bold uppercase ${isSpiking ? 'text-[#FF2D55] animate-pulse' : 'text-[#FFD600]'}`}>
                    {isSpiking ? 'CRITICAL ATTENTION ⚠️' : 'Attention Required ⚠️'}
                  </p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Fatigue Alerts</p>
                     <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h4 className="text-4xl font-black text-[#FF2D55] font-mono tracking-tighter">12</h4>
                  <p className="text-[9px] text-[#FF2D55] font-mono font-bold uppercase">Staff Members</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Location Compliance</p>
                     <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-4xl font-black text-[#00C853] font-mono tracking-tighter">98%</h4>
                  <p className="text-[9px] text-[#00C853] font-mono font-bold uppercase">Zone Integrity ✅</p>
               </div>
            </div>

            {/* Personnel Grid */}
            <div className="bg-[#262626] border border-[#393939] p-8">
               <div className="flex items-center justify-between mb-8 border-b border-[#393939] pb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                     <Activity className="w-5 h-5 text-indigo-400" />
                     Personnel Health Grid
                  </h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {staffData.map((t) => (
                    <div key={t.workerId} className={`bg-[#161616] border p-6 space-y-6 transition-all ${t.stressScore > 7 ? 'border-[#FF2D55] ring-1 ring-[#FF2D55]/30' : 'border-[#393939]'}`}>
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-sm ${t.stressScore > 7 ? 'bg-[#FF2D55]/20 text-[#FF2D55]' : 'bg-[#262626] text-[#A8A8A8]'}`}>
                                <Users className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t.workerId}</h4>
                                <p className="text-[9px] text-[#525252] font-mono uppercase tracking-widest font-bold">{t.role.replace('_', ' ')}</p>
                             </div>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest ${t.stressScore > 7 ? 'bg-[#FF2D55] text-white' : 'bg-[#00C853]/10 text-[#00C853]'}`}>
                             {t.stressScore > 7 ? 'HIGH_RISK' : 'OPTIMAL'}
                          </span>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <div className="flex justify-between text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                                <span>Stress</span>
                                <span className={t.stressScore > 7 ? 'text-[#FF2D55]' : 'text-white'}>{t.stressScore}</span>
                             </div>
                             <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${t.stressScore > 7 ? 'bg-[#FF2D55]' : 'bg-indigo-400'}`} style={{ width: `${t.stressScore * 10}%` }} />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="flex justify-between text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                                <span>Fatigue</span>
                                <span className="text-white">{t.fatigueIndex}</span>
                             </div>
                             <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFD600]" style={{ width: `${t.fatigueIndex * 10}%` }} />
                             </div>
                          </div>
                       </div>

                       <div className="pt-4 border-t border-[#262626] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <MapPin className="w-3 h-3 text-indigo-400" />
                             <span className="text-[9px] text-[#A8A8A8] uppercase font-mono">{t.currentLocation.zone.replace(/_/g, ' ')}</span>
                          </div>
                          <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                             View Biometrics <ChevronRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Trends Section (Visible on demand) */}
            {showTrends && (
              <div className="bg-[#262626] border border-indigo-400/50 p-8 space-y-8 animate-in slide-in-from-bottom-4">
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <History className="w-5 h-5 text-indigo-400" />
                    Weekly Health Patterns
                 </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={STRESS_DATA_WEEKLY}>
                          <defs>
                             <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#393939" />
                          <XAxis dataKey="day" stroke="#A8A8A8" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#A8A8A8" tick={{ fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', fontSize: '10px' }}
                            itemStyle={{ color: '#818cf8' }}
                          />
                          <Area type="monotone" dataKey="stress" stroke="#818cf8" fillOpacity={1} fill="url(#colorStress)" strokeWidth={2} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="p-4 bg-indigo-500/5 border-l-4 border-indigo-500">
                    <p className="text-xs text-[#A8A8A8] italic leading-relaxed">
                       <strong>Insight:</strong> Peak stress times detected between 14:00 and 16:00 on Fridays. Correlated with late-shift BSL-3 laboratory handovers.
                    </p>
                 </div>
              </div>
            )}
          </div>

          {/* Sidebar Insights (Right 4 cols) */}
          <div className="xl:col-span-4 space-y-8">
            {/* Risk Predictions */}
            <div className={`bg-[#262626] border p-8 space-y-8 transition-all duration-700 ${isSpiking ? 'border-[#FF2D55] bg-[#FF2D55]/5' : 'border-[#393939]'}`}>
               <div className="flex items-center gap-3 border-b border-[#393939] pb-4">
                  <BrainCircuit className={`w-5 h-5 ${isSpiking ? 'text-[#FF2D55]' : 'text-indigo-400'}`} />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Risk Predictions</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <p className={`text-[10px] font-black uppercase tracking-widest ${isSpiking ? 'text-[#FF2D55]' : 'text-[#A8A8A8]'}`}>
                       {isSpiking ? '🚨 HIGH STRESS DETECTED: Lab Technician #14' : 'Potential Fatigue: STAFF-102'}
                     </p>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-3xl font-black text-white font-mono">{isSpiking ? '+42%' : '+8%'}</p>
                           <p className="text-[9px] text-[#525252] uppercase font-bold tracking-widest">Predicted Error Rate</p>
                        </div>
                        <TrendingUp className={`w-6 h-6 ${isSpiking ? 'text-[#FF2D55]' : 'text-[#FFD600]'}`} />
                     </div>
                  </div>

                  <div className={`p-5 space-y-4 ${isSpiking ? 'bg-[#FF2D55]/10 border border-[#FF2D55]/20' : 'bg-[#161616] border border-[#393939]'}`}>
                     <div className="flex items-center gap-3 text-white">
                        <AlertTriangle className={`w-4 h-4 ${isSpiking ? 'text-[#FF2D55]' : 'text-[#FFD600]'}`} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Recommendation</h4>
                     </div>
                     <p className="text-xs text-[#A8A8A8] leading-relaxed italic">
                        {isSpiking 
                          ? "IMMEDIATE ACTION: Alert supervisor, pause all sensitive BSL-3 genomic procedures for Tech #14. Enforce mandatory decompression period."
                          : "Scheduled Intervention: Technician stress patterns rising. Recommend 15-minute break and workload redistribution."}
                     </p>
                  </div>
               </div>
            </div>

            {/* IBM Maximo & Edge Integration */}
            <div className="bg-[#161616] border border-[#393939] p-8 space-y-8">
               <div className="flex items-center gap-3 border-b border-[#262626] pb-4 text-[#0062FF]">
                  <Monitor className="w-5 h-5" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">IBM Integration</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Cloud className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Maximo</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">Connected to Maximo for workforce & asset management.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start opacity-80">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Activity className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Edge Computing</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">Real-time biometric analytics utilizing localized edge nodes.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Demo Controls */}
            <div className="bg-[#262626] border border-[#393939] p-8 space-y-6">
               <h4 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.4em] mb-4">Demo Controls</h4>
               <div className="space-y-4">
                  <button 
                    onClick={simulateSpike}
                    disabled={isSpiking}
                    className="w-full py-4 bg-[#FF2D55] hover:bg-[#d02546] disabled:bg-[#393939] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-sm shadow-xl shadow-red-900/10"
                  >
                    <Zap className="w-4 h-4" />
                    SIMULATE BIOMETRIC SPIKE
                  </button>
                  <button 
                    onClick={toggleTrends}
                    className="w-full py-4 border border-[#393939] text-[#A8A8A8] hover:text-white hover:bg-[#161616] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-sm"
                  >
                    <Monitor className="w-4 h-4" />
                    {showTrends ? 'HIDE HEALTH TRENDS' : 'VIEW HEALTH TRENDS'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WearableMonitor;
