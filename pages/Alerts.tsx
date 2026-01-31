
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Dna, 
  TrendingDown, 
  CheckCircle2, 
  Filter, 
  Search,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Alert, AlertType } from '../types';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<AlertType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = api.subscribeToAlerts((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });
    return unsubscribe;
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = filter === 'ALL' || a.type === filter;
    const matchesSearch = a.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: AlertType) => {
    switch(type) {
      case 'HIGH_RISK': return <ShieldAlert className="w-5 h-5 text-[#FF2D55]" />;
      case 'GENOMIC': return <Dna className="w-5 h-5 text-[#00C853]" />;
      case 'FINANCIAL': return <TrendingDown className="w-5 h-5 text-purple-400" />;
      case 'COMPLIANCE': return <Bell className="w-5 h-5 text-[#0062FF]" />;
    }
  };

  const handleMarkRead = (id: string) => {
    api.markAlertAsRead(id);
  };

  const handleMarkAllRead = () => {
    api.markAllAlertsAsRead();
  };

  return (
    <div className="p-10 space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">System <span className="font-bold">Alert Console</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Real-time risk telemetry and anomaly detection from global ERCA nodes.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="px-5 py-2.5 bg-[#262626] border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          <Check className="w-4 h-4" />
          Mark All As Read
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#262626] p-4 border border-[#393939]">
        <div className="flex gap-4 items-center flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A8A8]" />
            <input 
              type="text" 
              placeholder="Search anomalies or entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161616] border border-[#393939] pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#0062FF] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#161616] border border-[#393939] px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-[#A8A8A8]" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-transparent text-xs font-bold uppercase text-[#A8A8A8] outline-none tracking-widest"
            >
              <option value="ALL">All Sources</option>
              <option value="HIGH_RISK">High Risk</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="GENOMIC">Genomic</option>
              <option value="FINANCIAL">Financial</option>
            </select>
          </div>
        </div>
        <div className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">
          {filteredAlerts.length} Active Notifications
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`group p-6 border border-[#393939] flex items-start gap-6 transition-all ${
              alert.isRead ? 'bg-[#161616]/50 opacity-60' : 'bg-[#262626] border-l-4 border-l-[#FF2D55] shadow-lg shadow-[#FF2D55]/5'
            }`}
          >
            <div className="p-3 bg-[#161616] border border-[#393939]">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">{alert.vendorName}</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${
                    alert.severity === 'CRITICAL' ? 'bg-[#FF2D55] text-white' : 
                    alert.severity === 'WARNING' ? 'bg-[#FFD600] text-black' : 
                    'bg-[#0062FF] text-white'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#A8A8A8] font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                  {!alert.isRead && (
                    <button 
                      onClick={() => handleMarkRead(alert.id)}
                      className="p-1.5 text-[#393939] hover:text-[#00C853] transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#F4F4F4] leading-relaxed max-w-3xl">
                {alert.message}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <span className="text-[9px] text-[#525252] font-mono uppercase tracking-widest">NODE_ID: ERCA-ALPHA-{alert.id.toUpperCase()}</span>
                <button className="text-[9px] font-bold text-[#0062FF] hover:underline uppercase tracking-widest">View Entity Logic</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center uppercase tracking-[0.3em] text-[#393939] font-mono italic border border-dashed border-[#393939]">
            No anomalies found in current telemetry batch
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
