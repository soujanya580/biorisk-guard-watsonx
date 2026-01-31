
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Globe, 
  ShieldAlert, 
  Activity, 
  Layers, 
  MapPin, 
  Search, 
  Info, 
  Zap, 
  TrendingUp, 
  Network,
  Maximize2,
  ChevronRight,
  Filter,
  ArrowUpRight,
  X,
  History as HistoryIcon,
  Terminal
} from 'lucide-react';
import { api } from '../services/api';
import { Vendor } from '../types';
import { COLORS } from '../constants';
import RiskGlobe from '../components/RiskGlobe';

const GlobalRiskMap: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<'HEATMAP' | 'SUPPLY_CHAIN'>('HEATMAP');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getVendors().then(setVendors);
    
    // Load recent searches from local storage
    const saved = localStorage.getItem('biorisk_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));

    // Keyboard shortcut to focus search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === '/') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return vendors.filter(v => 
      v.location?.city.toLowerCase().includes(query) || 
      v.location?.country.toLowerCase().includes(query) ||
      v.name.toLowerCase().includes(query) ||
      v.industry.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, vendors]);

  const clusters = [
    { name: 'Western European Hub', risk: 'Stable', count: 8 },
    { name: 'Southeast Asian Cluster', risk: 'High', count: 12 },
    { name: 'North American Biotech Valley', risk: 'Moderate', count: 15 },
    { name: 'Indian Software & Bio Hub', risk: 'Stable', count: 9 }
  ];

  const handleSelectSuggestion = (v: Vendor) => {
    setSelectedVendor(v);
    setSearchQuery(v.name);
    setShowSuggestions(false);
    
    // Update recent searches
    const newRecent = [v.name, ...recentSearches.filter(s => s !== v.name)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('biorisk_recent_searches', JSON.stringify(newRecent));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedVendor(null);
    setShowSuggestions(false);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#0062FF] flex items-center justify-center rounded-sm shadow-lg shadow-[#0062FF]/20">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">Global Risk <span className="font-bold">Heat Map</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Geographic vulnerability patterns and real-time supply chain dependency mapping.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-[#161616] border border-[#393939] p-1 rounded-sm">
            <button 
              onClick={() => setViewMode('HEATMAP')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'HEATMAP' ? 'bg-[#0062FF] text-white' : 'text-[#A8A8A8] hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" /> Heat Map
            </button>
            <button 
              onClick={() => setViewMode('SUPPLY_CHAIN')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'SUPPLY_CHAIN' ? 'bg-[#0062FF] text-white' : 'text-[#A8A8A8] hover:text-white'}`}
            >
              <Network className="w-3.5 h-3.5" /> Supply Chain
            </button>
          </div>
          <button className="px-6 py-2.5 bg-[#FF2D55]/10 border border-[#FF2D55]/20 text-[#FF2D55] hover:bg-[#FF2D55]/20 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm">
            <ShieldAlert className="w-4 h-4" />
            Alert: Cluster Drift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Map Visualization (Left Panel) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-[#050505] border border-[#393939] aspect-video relative overflow-hidden group shadow-inner flex items-stretch">
            
            {/* 3D Risk Globe Integration */}
            <div className="flex-1 w-full h-full relative">
              <RiskGlobe 
                vendors={vendors} 
                selectedVendor={selectedVendor} 
                onSelectVendor={setSelectedVendor}
                viewMode={viewMode}
              />
            </div>

            {/* Map HUD UI - Search Bar Area */}
            <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-none z-30">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 text-[10px] font-mono text-white flex flex-col gap-1 w-fit">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                   <span className="uppercase tracking-[0.2em]">GEOSPATIAL_3D_RENDER_V4</span>
                 </div>
                 <div className="text-[8px] text-[#0062FF]">NODES_ONLINE: {vendors.length} | DEP_ARC_ACTIVE: {viewMode === 'SUPPLY_CHAIN' ? 'TRUE' : 'FALSE'}</div>
              </div>

              {/* Robust Geographic Search Bar */}
              <div className="relative pointer-events-auto w-96 group">
                <div className="flex items-center bg-black/90 backdrop-blur-2xl border border-white/10 group-focus-within:border-[#0062FF] group-focus-within:ring-1 group-focus-within:ring-[#0062FF]/30 transition-all px-4 py-3 shadow-2xl">
                  <Search className={`w-4 h-4 mr-3 transition-colors ${searchQuery ? 'text-[#0062FF]' : 'text-[#A8A8A8]'}`} />
                  <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search city (e.g. Bangalore), country (India, China), or vendor..."
                    className="bg-transparent border-none focus:outline-none text-xs text-white placeholder:text-[#525252] w-full font-mono"
                  />
                  <div className="flex items-center gap-2">
                    {!searchQuery && (
                      <span className="text-[9px] font-mono text-[#393939] border border-[#393939] px-1.5 py-0.5 rounded-sm">⌘K</span>
                    )}
                    {searchQuery && (
                      <button onClick={clearSearch} className="p-1 text-[#525252] hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {showSuggestions && (
                  <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border border-white/10 mt-1 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[400px] overflow-y-auto">
                    {searchQuery.trim() === '' ? (
                      recentSearches.length > 0 && (
                        <div className="p-2">
                          <p className="px-3 py-1.5 text-[8px] font-black text-[#393939] uppercase tracking-[0.2em] flex items-center gap-2">
                            <HistoryIcon className="w-2.5 h-2.5" /> Recent Forensic Queries
                          </p>
                          {recentSearches.map((s, i) => (
                            <button 
                              key={i} 
                              onClick={() => setSearchQuery(s)}
                              className="w-full text-left px-3 py-2.5 text-[10px] text-[#A8A8A8] hover:text-white hover:bg-white/5 transition-colors font-mono flex items-center gap-3"
                            >
                              <Search className="w-3 h-3 opacity-30" />
                              {s}
                            </button>
                          ))}
                        </div>
                      )
                    ) : suggestions.length > 0 ? (
                      <div className="py-2">
                        <p className="px-5 py-2 text-[8px] font-black text-[#393939] uppercase tracking-[0.2em]">Matching Nodes</p>
                        {suggestions.map((v) => (
                          <button 
                            key={v.id}
                            onClick={() => handleSelectSuggestion(v)}
                            className="w-full text-left px-5 py-4 hover:bg-[#0062FF]/10 flex items-center justify-between border-b border-white/5 last:border-none transition-colors group/item"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-1 h-8 rounded-full ${v.overallScore > 7 ? 'bg-[#FF2D55]' : v.overallScore > 4 ? 'bg-[#FFD600]' : 'bg-[#00C853]'}`} />
                              <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-0.5 group-hover/item:text-[#0062FF] transition-colors">{v.name}</p>
                                <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter flex items-center gap-1.5">
                                  <MapPin className="w-2.5 h-2.5" /> {v.location?.city}, {v.location?.country}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-[11px] font-mono font-bold ${v.overallScore > 7 ? 'text-[#FF2D55]' : v.overallScore > 4 ? 'text-[#FFD600]' : 'text-[#00C853]'}`}>
                                {v.overallScore}
                              </p>
                              <p className="text-[8px] text-[#525252] font-mono uppercase">Index</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center space-y-3">
                        <Terminal className="w-8 h-8 text-[#161616] mx-auto" />
                        <p className="text-[10px] font-mono text-[#393939] uppercase tracking-widest">No matching clusters found in global registry</p>
                        <button onClick={() => setSearchQuery('')} className="text-[9px] font-bold text-[#0062FF] uppercase underline">Reset Filter</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
               <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00C853]" /> Low Risk
                  </div>
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFD600]" /> Review Req.
                  </div>
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF2D55]" /> Critical
                  </div>
               </div>
               <p className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Drag to Rotate • Scroll to Zoom • Select Node</p>
            </div>
          </div>

          {/* Predictive Insights Bar */}
          <div className="bg-[#262626] border border-[#393939] p-8 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="p-3 bg-[#161616] border border-[#393939] text-[#00C853]">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-white uppercase tracking-widest">Global Risk Anomaly detected</h4>
                   <p className="text-[11px] text-[#A8A8A8] mt-1">High concentration of <strong>Genomic Bias</strong> found in the Shanghai & Singapore Hub Clusters. Predicted drift: +12.4% over 6 months.</p>
                </div>
             </div>
             <button className="px-6 py-2 border border-[#393939] text-[10px] font-bold text-white uppercase tracking-widest hover:bg-[#161616] transition-colors rounded-sm">
                Deploy Forensic Probe
             </button>
          </div>
        </div>

        {/* Sidebar Info (Right Panel) */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#262626] border border-[#393939] p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-[#393939] pb-4">
                 <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#FFD600]" />
                    <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">AI Cluster Insights</h3>
                 </div>
              </div>

              <div className="space-y-4">
                {clusters.map((c, i) => (
                  <div key={i} className="bg-[#161616] border border-[#393939] p-5 hover:border-white/20 transition-all group">
                     <div className="flex justify-between items-start mb-3">
                        <p className="text-[10px] font-bold text-white uppercase tracking-tight">{c.name}</p>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                          c.risk === 'High' ? 'bg-[#FF2D55]/10 text-[#FF2D55]' : 
                          c.risk === 'Moderate' ? 'bg-[#FFD600]/10 text-[#FFD600]' : 'bg-[#00C853]/10 text-[#00C853]'
                        }`}>{c.risk} RISK</span>
                     </div>
                     <div className="flex items-end justify-between">
                        <div className="flex gap-4">
                           <div className="text-center">
                              <p className="text-[8px] text-[#525252] uppercase font-mono">Nodes</p>
                              <p className="text-xs font-bold text-[#A8A8A8]">{c.count}</p>
                           </div>
                           <div className="text-center">
                              <p className="text-[8px] text-[#525252] uppercase font-mono">Drift</p>
                              <p className="text-xs font-bold text-[#A8A8A8]">{i === 1 ? '+4.2%' : '0.0%'}</p>
                           </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#393939] group-hover:text-white transition-colors" />
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {selectedVendor ? (
             <div className="bg-[#161616] border border-[#0062FF]/50 p-8 space-y-8 animate-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0062FF]/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                
                <div className="relative">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-[#0062FF]/10 text-[#0062FF] border border-[#0062FF]/20"><MapPin className="w-5 h-5" /></div>
                      <button onClick={clearSearch} className="text-[9px] font-bold text-[#393939] hover:text-white uppercase tracking-widest">Deselect</button>
                   </div>
                   
                   <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">{selectedVendor.name}</h3>
                   <p className="text-[10px] text-[#0062FF] font-mono uppercase tracking-[0.15em] mb-6">{selectedVendor.industry} • {selectedVendor.location?.city}, {selectedVendor.location?.country}</p>
                   
                   <div className="space-y-6 pt-6 border-t border-[#393939]">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Dependency Depth</span>
                         <span className="text-xs font-mono font-bold text-white">{selectedVendor.dependencies?.length || 0} Layers</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Failure Ripple Index</span>
                         <span className={`text-xs font-mono font-bold ${selectedVendor.importance && selectedVendor.importance > 8 ? 'text-[#FF2D55]' : 'text-white'}`}>
                            {selectedVendor.importance ? (selectedVendor.importance * 1.5).toFixed(1) : '0.0'}
                         </span>
                      </div>
                      
                      <div className="bg-[#262626] p-4 rounded-sm border-l-2 border-[#0062FF]">
                         <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Network className="w-3.5 h-3.5 text-[#0062FF]" /> Downstream Risk
                         </p>
                         <p className="text-[11px] text-[#A8A8A8] leading-relaxed italic">
                           "Failure of this node impacts clinical trials and local genomic datasets across {selectedVendor.location?.country} region."
                         </p>
                      </div>

                      <button 
                        onClick={() => window.location.hash = `#/vendors/${selectedVendor.id}`}
                        className="w-full py-3 bg-[#0062FF] text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0052cc] transition-colors rounded-sm shadow-2xl shadow-[#0062FF]/20"
                      >
                         Open Forensic Detail
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-[#161616] border border-[#393939] border-dashed p-12 text-center h-[500px] flex flex-col items-center justify-center">
                <Search className="w-12 h-12 text-[#262626] mb-6" />
                <h4 className="text-xs font-bold text-[#393939] uppercase tracking-[0.2em] mb-2">Node Forensics Offline</h4>
                <p className="text-[10px] text-[#393939] max-w-[180px] leading-relaxed italic">Select a node on the globe or use search to initiate deep dependency analysis and ripple impact simulation.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GlobalRiskMap;
