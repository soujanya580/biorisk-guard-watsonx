
import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  Loader2, 
  ChevronRight, 
  Database,
  Calculator,
  Binary,
  Globe,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { api } from '../services/api';
import { performQuantumAudit } from '../services/quantumService';
import { Vendor, QuantumAnalysis } from '../types';
import { sounds } from '../services/soundService';

const QuantumLab: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('pfizer-quantum');
  const [analysis, setAnalysis] = useState<QuantumAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [timelineYear, setTimelineYear] = useState(2026);
  const [attackProgress, setAttackProgress] = useState(0);

  useEffect(() => {
    api.getVendors().then(vends => {
      setVendors(vends);
      // Ensure Pfizer is the initial selection
      const pfizer = vends.find(v => v.id === 'pfizer-quantum');
      if (pfizer) {
        handleAudit('pfizer-quantum');
      }
    });
  }, []);

  const handleAudit = async (vendorId: string) => {
    setSelectedVendorId(vendorId);
    if (!vendorId) {
      setAnalysis(null);
      return;
    }

    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    setIsLoading(true);
    try {
      const res = await performQuantumAudit(vendor);
      // Hard-coded specific requirements for the Pfizer demo
      if (vendorId === 'pfizer-quantum') {
        res.overallScore = 65;
        res.vulnerabilityTimeline = 7.2;
        res.migrationCost = 2400000;
        res.pqcStatus = 'TRANSITIONING';
      }
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runQuantumAudit = async () => {
    setIsAuditing(true);
    setAuditLog([]);
    sounds.playAlert();
    
    const messages = [
      "Initializing Post-Quantum Surface Scan...",
      "Auditing 15,000 genomic records...",
      "Intercepting RSA-2048 metadata headers...",
      "Calculating Shor's Algorithm vulnerability factor...",
      "RESULT: 3,214 records vulnerable to quantum decryption [CRITICAL]"
    ];

    for (const msg of messages) {
      setAuditLog(prev => [...prev, `> ${msg}`]);
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsAuditing(false);
    sounds.playSuccess();
  };

  const simulateAttack = async () => {
    setIsAttacking(true);
    setAttackProgress(0);
    sounds.playAlert();
    
    const interval = setInterval(() => {
      setAttackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 120);

    await new Promise(r => setTimeout(r, 3200));
    setIsAttacking(false);
    sounds.playAlert();
  };

  const getTimelineImpact = () => {
    const elapsed = timelineYear - 2026;
    const yearsRemaining = Math.max(0, 7.2 - elapsed);
    const scoreModifier = elapsed * 6;
    return {
      years: yearsRemaining.toFixed(1),
      score: Math.max(10, (analysis?.overallScore || 65) - scoreModifier)
    };
  };

  const impact = getTimelineImpact();

  return (
    <div className={`p-10 space-y-10 max-w-[1600px] mx-auto transition-all duration-300 ${isAttacking ? 'animate-shake' : 'animate-in fade-in duration-700'}`}>
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center rounded-sm shadow-lg shadow-cyan-500/10">
            <Atom className="w-7 h-7 text-cyan-400 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">Quantum <span className="font-bold text-cyan-400">Readiness Lab</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Post-quantum cryptography auditing and quantum-advantage forecasting for healthcare nodes.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-cyan-400/60">Node Cluster</label>
            <select 
              value={selectedVendorId}
              onChange={(e) => handleAudit(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none font-mono cursor-pointer appearance-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-[#393939] rotate-90" />
          </div>
          <div className="px-4 py-2 bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            IBM Quantum Safe Patterns Implemented ✓
          </div>
        </div>
      </div>

      {!analysis && isLoading ? (
        <div className="h-[600px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center relative">
           <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-8" />
           <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] animate-pulse">Calculating Shor's Algorithm Defenses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Visual Dashboard */}
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-[#050505] border-2 border-cyan-500/50 p-10 relative overflow-hidden shadow-2xl shadow-cyan-900/20 group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Binary className="w-64 h-64 text-cyan-400" />
               </div>
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <div>
                        <h2 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.4em] mb-4">Visual Dashboard</h2>
                        <div className="p-6 bg-[#161616] border border-[#393939] rounded-sm space-y-6">
                           <div className="flex justify-between items-center border-b border-[#262626] pb-4">
                              <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                 <Lock className="w-4 h-4 text-cyan-400" /> QUANTUM SECURITY SCORE
                              </span>
                              <span className="text-3xl font-black text-cyan-400 font-mono">{impact.score}/100</span>
                           </div>
                           <div className="flex justify-between items-center border-b border-[#262626] pb-4">
                              <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                 <Clock className="w-4 h-4 text-cyan-400" /> TIME TO QUANTUM ADVANTAGE
                              </span>
                              <span className="text-2xl font-black text-white font-mono">{impact.years}y</span>
                           </div>
                           <div className="flex justify-between items-center border-b border-[#262626] pb-4">
                              <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                 <DollarSign className="w-4 h-4 text-cyan-400" /> MIGRATION BUDGET REQUIRED
                              </span>
                              <span className="text-2xl font-black text-white font-mono">$2.4M</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                 <ShieldAlert className="w-4 h-4 text-[#FF2D55]" /> VULNERABLE RECORDS
                              </span>
                              <span className="text-2xl font-black text-[#FF2D55] font-mono">3,214</span>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 bg-[#0062FF]/10 border border-[#0062FF]/30 space-y-4">
                        <div className="flex items-center gap-3 text-[#0062FF]">
                           <ShieldCheck className="w-5 h-5" />
                           <h4 className="text-[10px] font-bold uppercase tracking-widest">IBM Quantum Connectivity</h4>
                        </div>
                        <p className="text-xs text-[#A8A8A8] leading-relaxed">
                           Compatible with <strong>IBM Quantum Safe Services</strong>. Node is currently <strong>Ready for IBM Cloud Quantum Migration</strong>.
                        </p>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white uppercase pt-2">
                           <span>IBM QUANTUM SAFE READINESS</span>
                           <span className="text-[#00C853]">45%</span>
                        </div>
                        <div className="h-1 bg-[#161616] w-full overflow-hidden rounded-full">
                           <div className="h-full bg-[#0062FF] w-[45%]" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 flex flex-col">
                     <div className="flex-1 bg-[#161616] border border-[#393939] p-8 space-y-6">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-[#393939] pb-4">Real-Time Quantum Metrics</h4>
                        <div className="space-y-5">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Quantum Threat Timeline</span>
                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">T-Minus 7.2 Years</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Current Encryption</span>
                              <span className="text-[10px] font-mono text-[#FF2D55] font-bold uppercase">Vulnerable to Shor's</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Migration Cost</span>
                              <span className="text-[10px] font-mono text-white font-bold uppercase">$2.4M</span>
                           </div>
                        </div>
                        
                        <div className="pt-6 border-t border-[#393939]">
                           <p className="text-[9px] text-[#525252] leading-relaxed italic uppercase tracking-[0.1em]">
                             "IBM Quantum Services allow this sponsor to simulate complex bio-molecular interactions 1,000x faster than classical HPC nodes by 2028."
                           </p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <p className="text-[10px] font-bold text-white uppercase tracking-widest">QUANTUM TIMELINE ADJUSTMENT</p>
                           <span className="text-xs font-mono text-cyan-400 font-bold">{timelineYear}</span>
                        </div>
                        <input 
                           type="range" min="2026" max="2035" 
                           value={timelineYear}
                           onChange={(e) => setTimelineYear(parseInt(e.target.value))}
                           className="w-full accent-cyan-400 bg-[#161616] h-1.5 rounded-full cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-[#393939] font-mono uppercase tracking-widest">
                           <span>Horizon: 2026</span>
                           <span>End: 2035</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Quantum Audit Section */}
               <div className="bg-[#262626] border border-[#393939] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#00C853]" />
                        Run Quantum Audit
                     </h3>
                  </div>
                  <div className="h-40 bg-[#161616] border border-[#393939] overflow-y-auto p-4 font-mono text-[10px] text-[#00C853] space-y-1">
                     {auditLog.length === 0 ? (
                        <p className="text-[#393939] italic">Awaiting instruction... Click 'RUN QUANTUM AUDIT'</p>
                     ) : (
                        auditLog.map((log, i) => <p key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</p>)
                     )}
                     {isAuditing && <p className="animate-pulse">_</p>}
                  </div>
                  <button 
                     onClick={runQuantumAudit}
                     disabled={isAuditing || isAttacking}
                     className="w-full py-4 bg-[#00C853] hover:bg-[#00a846] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:bg-[#393939] rounded-sm"
                  >
                     {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                     RUN QUANTUM AUDIT
                  </button>
               </div>

               {/* Quantum Attack Simulation Section */}
               <div className="bg-[#262626] border border-[#393939] p-8 space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-[#FF2D55]" />
                        Attack Simulation
                     </h3>
                  </div>
                  
                  <div className="h-40 bg-[#000] border border-[#393939] flex flex-col items-center justify-center p-6 text-center space-y-4">
                     {isAttacking ? (
                        <>
                           <p className="text-[10px] font-mono text-[#FF2D55] uppercase tracking-widest animate-pulse">Quantum computer decrypting...</p>
                           <div className="w-full h-1.5 bg-[#161616] rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF2D55] transition-all duration-150" style={{ width: `${attackProgress}%` }} />
                           </div>
                           <p className="text-[8px] font-mono text-[#525252] uppercase">Processing Qubit States: {attackProgress * 40} / 4000</p>
                        </>
                     ) : attackProgress === 100 ? (
                        <div className="animate-in zoom-in duration-500 text-center">
                           <AlertTriangle className="w-10 h-10 text-[#FF2D55] mx-auto mb-2" />
                           <p className="text-sm font-bold text-white uppercase">VULNERABILITY CONFIRMED</p>
                           <p className="text-[11px] text-[#FF2D55] font-mono mt-1 uppercase tracking-tighter">Patient data compromised in 4.2 hours</p>
                        </div>
                     ) : (
                        <div className="space-y-2">
                           <Zap className="w-8 h-8 text-[#393939] mx-auto" />
                           <p className="text-[9px] text-[#525252] uppercase tracking-[0.2em]">Ready for Simulation</p>
                        </div>
                     )}
                  </div>

                  <button 
                     onClick={simulateAttack}
                     disabled={isAttacking || isAuditing}
                     className="w-full py-4 bg-[#FF2D55] hover:bg-[#d02546] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:bg-[#393939] rounded-sm"
                  >
                     {isAttacking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                     SIMULATE QUANTUM ATTACK
                  </button>
               </div>
            </div>
          </div>

          {/* Sidebar Recommendations */}
          <div className="xl:col-span-4 space-y-8">
             <div className="bg-[#161616] border border-[#393939] p-8 space-y-8 h-full">
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-[#393939] pb-4">Quantum Directives</h3>
                <div className="space-y-6">
                   <div className="p-5 bg-[#262626] border-l-4 border-cyan-400 space-y-3">
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">PQC Migration</p>
                      <p className="text-xs text-white leading-relaxed font-light">Upgrade all asymmetric primitives to <strong>NIST-PQC algorithms</strong> (Crystal-Kyber / Dilithium) to mitigate Shor's algorithm risks.</p>
                   </div>
                   <div className="p-5 bg-[#262626] border-l-4 border-[#00C853] space-y-3">
                      <p className="text-[10px] font-bold text-[#00C853] uppercase tracking-widest">Key Distribution</p>
                      <p className="text-xs text-white leading-relaxed font-light">Implement <strong>Quantum Key Distribution (QKD)</strong> for site-to-site sequence transfers in BSL-3 laboratory clusters.</p>
                   </div>
                   <div className="p-5 bg-[#262626] border-l-4 border-[#0062FF] space-y-3 opacity-60">
                      <p className="text-[10px] font-bold text-[#0062FF] uppercase tracking-widest">Audit Policy</p>
                      <p className="text-xs text-white leading-relaxed font-light">Perform mandatory <strong>Cloud Vendor Readiness Audit</strong> for all external data archival partners.</p>
                   </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#262626]">
                   <button className="w-full py-4 border border-[#393939] text-[#A8A8A8] hover:text-white hover:bg-[#1c1c1c] transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      View Full NIST Roadmap <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>

                <div className="bg-cyan-900/10 border border-cyan-500/20 p-6 mt-10 space-y-4">
                   <div className="flex items-center gap-3 text-cyan-400">
                      <Monitor className="w-5 h-5" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Cloud Migration Status</h4>
                   </div>
                   <p className="text-[10px] text-[#A8A8A8] leading-relaxed">
                      This sponsor is currently flagged as: <span className="text-white font-bold underline">Ready for IBM Cloud Quantum Migration</span>.
                   </p>
                   <button className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:underline flex items-center gap-2 pt-2">
                      Initiate Migration Plan <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumLab;
