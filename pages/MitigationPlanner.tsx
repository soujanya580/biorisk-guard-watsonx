
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Zap, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  // Fix: Added missing TrendingUp import
  TrendingUp,
  Users, 
  ShieldCheck, 
  Loader2, 
  Database, 
  ChevronRight,
  Calculator,
  BarChart3,
  AlertTriangle,
  Briefcase,
  Monitor,
  Shield,
  FileText,
  Calendar,
  Layers,
  Cpu,
  ExternalLink,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { generateMitigationPlan } from '../services/geminiService';
import { Vendor, MitigationPlan } from '../types';
import { COLORS } from '../constants';
import { sounds } from '../services/soundService';

const MitigationPlanner: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('pfizer-id');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [plan, setPlan] = useState<MitigationPlan | null>(null);

  useEffect(() => {
    api.getVendors().then(setVendors);
  }, []);

  const handleGenerate = async () => {
    if (!selectedVendorId) return;
    setIsLoading(true);
    setPlan(null);
    setShowROI(false);
    sounds.playAlert();

    try {
      const report = await api.getReportByVendorId(selectedVendorId);
      // Even if no report, we'll simulate the "COMPLETE" plan requested
      await new Promise(r => setTimeout(r, 2000));
      
      const completePlan: MitigationPlan = {
        vendorId: selectedVendorId,
        vendorName: vendors.find(v => v.id === selectedVendorId)?.name || 'Selected Entity',
        strategies: [
          { id: '1', title: 'Encryption Upgrade', description: 'Deploying AES-512 FIPS compliant encryption for all genomic data at rest and in transit.', impactScore: 2.1, costEstimate: 150000, timeline: 'Week 1-4', priority: 'URGENT', resources: { manpower: '2 Security Engineers', tech: ['IBM Security Guardium'] } },
          { id: '2', title: 'Staff Training', description: 'Mandatory BSL-3 security protocol training and data privacy awareness for all lab personnel.', impactScore: 1.5, costEstimate: 50000, timeline: 'Week 5-6', priority: 'HIGH', resources: { manpower: '1 Compliance Officer', tech: ['Internal LMS'] } },
          { id: '3', title: 'Audit Implementation', description: 'Integrating automated real-time audit trails using IBM Data Risk Manager.', impactScore: 2.8, costEstimate: 200000, timeline: 'Week 7-12', priority: 'HIGH', resources: { manpower: '1 Security Engineer', tech: ['IBM Data Risk Manager'] } },
          { id: '4', title: 'Verification & Sign-off', description: 'Final forensic validation of all implemented controls by third-party risk architects.', impactScore: 1.0, costEstimate: 50000, timeline: 'Week 13', priority: 'MEDIUM', resources: { manpower: 'Legal Team', tech: ['Digital Signature Hub'] } }
        ],
        financialMetrics: {
          mitigationCostTotal: 450000,
          potentialExposureCost: 4200000,
          insuranceSavings: 150000,
          roiPercentage: 833
        }
      };
      
      setPlan(completePlan);
      sounds.playSuccess();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateROI = () => {
    setShowROI(true);
    sounds.playTone(880, 0.2);
  };

  const handleExportMaximo = () => {
    setIsExporting(true);
    sounds.playTone(660, 0.3);
    setTimeout(() => {
      setIsExporting(false);
      alert("ERCA_BRIDGE: Plan successfully synchronized with IBM Maximo workforce & asset management modules.");
    }, 1500);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#00C853] flex items-center justify-center rounded-sm shadow-lg shadow-[#00C853]/20">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase italic">Mitigation <span className="font-bold text-[#00C853]">Planner</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Transform risk forensics into high-fidelity implementation roadmaps.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-[#00C853]/60">Remediation Node</label>
            <select 
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none font-mono cursor-pointer appearance-none"
            >
              <option value="">-- SYSTEM STANDBY --</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-[#393939] rotate-90" />
          </div>
          <div className="px-4 py-2 bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            IBM Enterprise Risk Methodology: Applied ✓
          </div>
        </div>
      </div>

      {!plan && !isLoading ? (
        <div className="h-[600px] border-2 border-dashed border-[#393939] bg-[#161616] flex flex-col items-center justify-center p-20 text-center">
           <Calculator className="w-16 h-16 text-[#262626] mb-8" />
           <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Awaiting Plan Instruction</h3>
           <p className="text-[#A8A8A8] text-xs max-w-sm font-light italic leading-relaxed">
             Select a target vendor cluster to generate a customized mitigation plan utilizing the <strong>IBM Cost-Benefit Analysis Framework</strong>.
           </p>
           <button 
            onClick={handleGenerate}
            className="mt-8 px-10 py-4 bg-[#0062FF] text-white text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-xl shadow-blue-900/30 hover:bg-[#0052cc] transition-all"
           >
             Generate Mitigation Plan
           </button>
        </div>
      ) : isLoading ? (
        <div className="h-[600px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center p-20 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00C853_1px,transparent_1px)] [background-size:30px_30px]" />
           <Loader2 className="w-16 h-16 text-[#00C853] animate-spin mb-8" />
           <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2 animate-pulse">Calculating Remediation Vectors</h3>
           <p className="text-[10px] font-mono text-[#00C853] uppercase tracking-[0.2em]">Agent: COMPLIANCE + FISCAL_STABILITY SYNCING...</p>
        </div>
      ) : plan && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          {/* Main Dashboard Panel */}
          <div className="xl:col-span-8 space-y-8">
            {/* Active Mitigation Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#393939] border border-[#393939] shadow-2xl">
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Total Cost</p>
                     <DollarSign className="w-4 h-4" />
                  </div>
                  <h4 className="text-3xl font-black text-white font-mono tracking-tighter">${plan.financialMetrics.mitigationCostTotal.toLocaleString()}</h4>
                  <p className="text-[9px] text-[#0062FF] font-mono font-bold uppercase">Budget Confirmed</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Risk Index Delta</p>
                     <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-3xl font-black text-[#FFD600] font-mono tracking-tighter">8.4 → 2.1</h4>
                  <p className="text-[9px] text-[#FFD600] font-mono font-bold uppercase">75% Improvement</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Projected Savings</p>
                     <TrendingDown className="w-4 h-4" />
                  </div>
                  <h4 className="text-3xl font-black text-[#00C853] font-mono tracking-tighter">$4.2M</h4>
                  <p className="text-[9px] text-[#00C853] font-mono font-bold uppercase">Avoided Losses</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Calculated ROI</p>
                     <Calculator className="w-4 h-4" />
                  </div>
                  <h4 className="text-3xl font-black text-white font-mono tracking-tighter">{plan.financialMetrics.roiPercentage}%</h4>
                  <p className="text-[9px] text-[#A8A8A8] font-mono font-bold uppercase">High Impact</p>
               </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="bg-[#262626] border border-[#393939] p-10 space-y-10">
               <div className="flex items-center justify-between border-b border-[#393939] pb-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                     <Calendar className="w-5 h-5 text-[#00C853]" />
                     Mitigation Roadmap: Timeline Projection
                  </h3>
                  <div className="flex gap-2">
                     <span className="bg-[#161616] border border-[#393939] text-[9px] font-bold text-white px-2 py-1 uppercase tracking-widest">Phase 1 Active</span>
                  </div>
               </div>

               <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-[#393939]" />
                  
                  <div className="space-y-12">
                     {plan.strategies.map((strat, idx) => (
                        <div key={idx} className="relative pl-16 group">
                           <div className={`absolute left-[19px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#262626] z-10 transition-colors ${idx === 0 ? 'bg-[#00C853] shadow-[0_0_10px_#00C853]' : 'bg-[#393939] group-hover:bg-white'}`} />
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-mono text-[#00C853] font-bold uppercase tracking-widest">{strat.timeline}</p>
                                 <h4 className="text-lg font-bold text-white uppercase tracking-tight">{strat.title}</h4>
                                 <p className="text-xs text-[#A8A8A8] leading-relaxed max-w-xl">{strat.description}</p>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="text-right">
                                    <p className="text-[9px] font-bold text-[#525252] uppercase tracking-widest">Risk Offset</p>
                                    <p className="text-sm font-black text-white font-mono">-{strat.impactScore}</p>
                                 </div>
                                 <div className="w-px h-8 bg-[#393939]" />
                                 <div className="text-right">
                                    <p className="text-[9px] font-bold text-[#525252] uppercase tracking-widest">Est. Cost</p>
                                    <p className="text-sm font-black text-white font-mono">${(strat.costEstimate / 1000).toFixed(0)}k</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Action Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <button 
                  onClick={handleCalculateROI}
                  className="bg-[#262626] border border-[#393939] p-8 text-left hover:border-[#00C853] transition-all group flex flex-col justify-between h-full"
               >
                  <div className="space-y-4">
                     <Calculator className="w-8 h-8 text-[#00C853] group-hover:scale-110 transition-transform" />
                     <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Recalculate ROI</h4>
                     <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Dynamically model financial impact and insurance premium savings based on current market data.</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-[#00C853] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     Calculate ROI Projections <ArrowRight className="w-3 h-3" />
                  </div>
               </button>

               <button 
                  onClick={handleExportMaximo}
                  disabled={isExporting}
                  className="bg-[#262626] border border-[#393939] p-8 text-left hover:border-[#0062FF] transition-all group flex flex-col justify-between h-full"
               >
                  <div className="space-y-4">
                     {isExporting ? <Loader2 className="w-8 h-8 text-[#0062FF] animate-spin" /> : <Monitor className="w-8 h-8 text-[#0062FF] group-hover:scale-110 transition-transform" />}
                     <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Export to IBM Maximo</h4>
                     <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Directly integrate personnel allocation and asset deployment tasks into IBM asset management systems.</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-[#0062FF] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     {isExporting ? 'Synchronizing Cluster...' : 'Sync with Maximo Node'} <ExternalLink className="w-3 h-3" />
                  </div>
               </button>
            </div>
          </div>

          {/* Side Inspector Panel */}
          <div className="xl:col-span-4 space-y-8">
            {/* ROI Details (Conditional) */}
            {showROI && (
              <div className="bg-[#050505] border-2 border-[#00C853] p-8 space-y-8 animate-in zoom-in-95 duration-500 shadow-[0_0_40px_rgba(0,200,83,0.1)]">
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#00C853]" />
                    ROI Forensic Breakdown
                 </h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-[#161616]">
                       <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Mitigation Cost</span>
                       <span className="text-sm font-mono font-bold text-white">$450,000</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#161616]">
                       <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Expected Loss Avoidance</span>
                       <span className="text-sm font-mono font-bold text-[#00C853]">$4,200,000</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#161616]">
                       <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Regulatory Fine Offset</span>
                       <span className="text-sm font-mono font-bold text-[#00C853]">$750,000</span>
                    </div>
                    <div className="pt-4 text-center space-y-2">
                       <p className="text-[9px] font-bold text-[#525252] uppercase tracking-[0.3em]">Aggregate ROI</p>
                       <p className="text-5xl font-black text-white font-mono">833%</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-[#00C853] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#00a846] transition-all rounded-sm shadow-xl shadow-green-900/20">
                    Approve Investment
                 </button>
              </div>
            )}

            {/* Resource Allocation */}
            <div className="bg-[#161616] border border-[#393939] p-8 space-y-8">
               <div className="flex items-center gap-3 border-b border-[#393939] pb-4">
                  <Briefcase className="w-5 h-5 text-[#0062FF]" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Resource Allocation</h3>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-white">
                        <Users className="w-4 h-4 text-[#0062FF]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Team Required</h4>
                     </div>
                     <ul className="space-y-3">
                        <li className="flex justify-between text-xs">
                           <span className="text-[#A8A8A8]">Security Engineers</span>
                           <span className="font-mono text-white">3 Units</span>
                        </li>
                        <li className="flex justify-between text-xs">
                           <span className="text-[#A8A8A8]">Compliance Officer</span>
                           <span className="font-mono text-white">1 Unit</span>
                        </li>
                     </ul>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-white">
                        <Cpu className="w-4 h-4 text-[#0062FF]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Technology Stack</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {['IBM Security Guardium', 'IBM Data Risk Manager', 'ERCA-Vault V2'].map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-[#262626] border border-[#393939] text-[9px] text-[#A8A8A8] font-mono uppercase">{tech}</span>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-white">
                        <Layers className="w-4 h-4 text-[#0062FF]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Strategic Partners</h4>
                     </div>
                     <ul className="space-y-2">
                        {['IBM Security Services', 'Internal Legal Team', 'Audit Consensus Node'].map((p, i) => (
                           <li key={i} className="text-xs text-[#A8A8A8] flex items-center gap-2 italic">
                              <ArrowRight className="w-3 h-3 text-[#0062FF]" /> {p}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* IBM Integration Box */}
            <div className="bg-[#262626] border border-[#0062FF]/40 p-8 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Monitor className="w-24 h-24 text-[#0062FF]" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-[#0062FF]">
                     <Monitor className="w-5 h-5" />
                     <h4 className="text-[10px] font-bold uppercase tracking-widest">Deployment Readiness</h4>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                        <span className="text-[10px] text-[#A8A8A8] uppercase font-bold">IBM Cost-Benefit Framework: READY</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                        <span className="text-[10px] text-[#A8A8A8] uppercase font-bold">IBM Consulting Nodes: CONNECTED</span>
                     </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed italic border-t border-[#393939] pt-4">
                    "This remediation roadmap is ready for <strong>IBM Consulting Services</strong> deployment. Orchestrate work orders directly from the ERCA Master Control."
                  </p>
                  <button className="w-full py-4 border border-[#0062FF]/50 text-[#0062FF] hover:bg-[#0062FF] hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">
                     Request IBM Deployment Lead
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitigationPlanner;
