
import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  Zap, 
  ShieldAlert,
  Search,
  Users,
  Target,
  FlaskConical,
  Bell,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  AlertCircle,
  Briefcase,
  Monitor,
  Database,
  Calculator,
  Gavel,
  History,
  Info
} from 'lucide-react';
import { fetchClinicalTrialsForVendor } from '../services/clinicalTrialService';
import { api } from '../services/api';
import { ClinicalTrial, Vendor, RegulatoryMilestone } from '../types';
import { COLORS } from '../constants';
import { sounds } from '../services/soundService';

const ClinicalTrialHub: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('pfizer-oncology');
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [isSuccessPredicted, setIsSuccessPredicted] = useState(false);
  const [riskScore, setRiskScore] = useState(3.8);
  const [revenueAtRisk, setRevenueAtRisk] = useState('$5B');
  const [regMilestones, setRegMilestones] = useState<RegulatoryMilestone[]>([]);

  useEffect(() => {
    api.getVendors().then(vends => {
      setVendors(vends);
      // Auto-select Pfizer Oncology
      const target = vends.find(v => v.id === 'pfizer-oncology');
      if (target) {
        handleVendorSelect('pfizer-oncology');
      }
    });
  }, []);

  const handleVendorSelect = async (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setIsCrisis(false);
    setIsSuccessPredicted(false);
    
    if (!vendorId) {
      setTrials([]);
      setRegMilestones([]);
      return;
    }

    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    setRiskScore(vendor.overallScore || 3.8);
    setIsLoading(true);
    
    try {
      const trialData = await fetchClinicalTrialsForVendor(vendor.name);
      setTrials(trialData);
      
      // Mock regulatory milestones
      setRegMilestones([
        { agency: 'FDA', submissionType: 'BLA', currentStatus: 'UNDER_REVIEW', submissionDate: '2023-11-20', predictedDecisionDate: '2024-12-15' },
        { agency: 'EMA', submissionType: 'NDA', currentStatus: 'SUBMITTED', submissionDate: '2024-02-01', predictedDecisionDate: '2025-03-10' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateTrialFailure = () => {
    setIsCrisis(true);
    setIsSuccessPredicted(false);
    setRiskScore(9.2);
    setRevenueAtRisk('$12.4B');
    sounds.playAlert();
    
    // Impact message
    console.log("CRISIS: Trial halted, stock -35%");
  };

  const simulatePredictSuccess = () => {
    setIsCrisis(false);
    setIsSuccessPredicted(true);
    setRiskScore(1.4);
    setRevenueAtRisk('$0');
    sounds.playSuccess();
  };

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  return (
    <div className={`p-10 space-y-10 max-w-[1600px] mx-auto transition-all duration-300 ${isCrisis ? 'animate-shake' : 'animate-in fade-in duration-700'}`}>
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-600 flex items-center justify-center rounded-sm shadow-lg shadow-indigo-600/20">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase italic">Clinical Trial <span className="font-bold">Mission Control</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Real-time trial telemetry, regulatory tracking, and predictive failure modeling.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-indigo-400">Sponsor Node</label>
            <select 
              value={selectedVendorId}
              onChange={(e) => handleVendorSelect(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none font-mono cursor-pointer appearance-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-[#393939] rotate-90" />
          </div>
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            IBM Clinical Development Patterns: Active ✓
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[600px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center">
           <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-8" />
           <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Establishing Clinical Registry Handshake...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-8 space-y-8">
            {/* Live Dashboard Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#393939] border border-[#393939] shadow-2xl">
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Active Trials</p>
                     <FlaskConical className="w-4 h-4" />
                  </div>
                  <h4 className="text-4xl font-black text-white font-mono tracking-tighter">{trials.length}</h4>
                  <p className="text-[9px] text-[#00C853] font-mono font-bold uppercase">Sync Frequency: 15s</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Aggregate Risk</p>
                     <Zap className="w-4 h-4" />
                  </div>
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${riskScore > 7 ? 'text-[#FF2D55]' : 'text-white'}`}>{riskScore}</h4>
                  <p className={`text-[9px] font-mono font-bold uppercase ${riskScore > 7 ? 'text-[#FF2D55] animate-pulse' : 'text-[#A8A8A8]'}`}>
                    {riskScore > 7 ? 'CRITICAL ALERT' : 'STABLE'}
                  </p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Success Probability</p>
                     <Target className="w-4 h-4" />
                  </div>
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${isSuccessPredicted ? 'text-[#00C853]' : 'text-white'}`}>
                    {isSuccessPredicted ? '85%' : (isCrisis ? '12%' : '68%')}
                  </h4>
                  <p className="text-[9px] text-[#A8A8A8] font-mono font-bold uppercase">AI Projected</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Revenue at Risk</p>
                     <Calculator className="w-4 h-4" />
                  </div>
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${isCrisis ? 'text-[#FF2D55]' : 'text-white'}`}>{revenueAtRisk}</h4>
                  <p className="text-[9px] text-[#A8A8A8] font-mono font-bold uppercase">Est. Market Impact</p>
               </div>
            </div>

            {/* Trial List Table */}
            <div className="bg-[#262626] border border-[#393939] overflow-hidden">
               <div className="p-6 bg-[#1c1c1c] border-b border-[#393939] flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                     <Monitor className="w-4 h-4 text-indigo-400" />
                     Live Trial Dashboard
                  </h3>
                  <div className="flex gap-2">
                     <span className="bg-[#00C853]/20 text-[#00C853] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Registry Sync: Active</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#161616] text-[9px] font-bold text-[#525252] uppercase tracking-widest border-b border-[#393939]">
                           <th className="p-5">NCT_ID</th>
                           <th className="p-5">Title</th>
                           <th className="p-5">Phase</th>
                           <th className="p-5">Enrollment</th>
                           <th className="p-5">Status</th>
                           <th className="p-5">Drift</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#393939]">
                        {trials.map((trial) => (
                           <tr key={trial.nctId} className="hover:bg-[#1c1c1c] transition-colors group">
                              <td className="p-5 font-mono text-xs text-indigo-400 font-bold">{trial.nctId}</td>
                              <td className="p-5">
                                 <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{trial.title}</p>
                                 <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter mt-0.5">{trial.primaryIndication}</p>
                              </td>
                              <td className="p-5 text-xs text-white font-mono">{trial.phase}</td>
                              <td className="p-5 text-xs text-white font-mono">{trial.enrollment}</td>
                              <td className="p-5">
                                 <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                                    trial.status === 'TERMINATED' ? 'bg-[#FF2D55]/10 text-[#FF2D55]' : 'bg-[#00C853]/10 text-[#00C853]'
                                 }`}>
                                    {trial.status}
                                 </span>
                              </td>
                              <td className="p-5 text-xs font-mono text-[#525252]">+0.04</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Regulatory Tracking */}
            <div className="bg-[#262626] border border-[#393939] p-8 space-y-6">
               <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Gavel className="w-5 h-5 text-indigo-400" />
                  Regulatory Submission Tracking
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regMilestones.map((m, i) => (
                    <div key={i} className="bg-[#161616] border border-[#393939] p-6 space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <p className="text-[10px] font-bold text-[#525252] uppercase tracking-widest">{m.agency} Submission</p>
                             <h4 className="text-lg font-black text-white font-mono">{m.submissionType}</h4>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-1 bg-[#0062FF]/10 text-[#0062FF] uppercase tracking-widest">{m.currentStatus}</span>
                       </div>
                       <div className="space-y-2 border-t border-[#393939] pt-4">
                          <div className="flex justify-between text-[10px]">
                             <span className="text-[#A8A8A8]">Submitted:</span>
                             <span className="text-white font-mono">{m.submissionDate}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                             <span className="text-[#A8A8A8]">Est. Decision:</span>
                             <span className="text-white font-mono">{m.predictedDecisionDate}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-4 space-y-8">
            {/* Interactive Predictive Analytics */}
            <div className={`bg-[#161616] border p-8 space-y-8 transition-all duration-700 ${isCrisis ? 'border-[#FF2D55] bg-[#FF2D55]/5 shadow-[0_0_50px_#FF2D5515]' : (isSuccessPredicted ? 'border-[#00C853] bg-[#00C853]/5' : 'border-[#393939]')}`}>
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Target className={`w-5 h-5 ${isCrisis ? 'text-[#FF2D55]' : (isSuccessPredicted ? 'text-[#00C853]' : 'text-indigo-400')}`} />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Predictive Analytics</h3>
               </div>
               
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-2">Success Probability Index</p>
                     <div className="flex items-end gap-3">
                        <span className={`text-6xl font-black font-mono tracking-tighter ${isCrisis ? 'text-[#FF2D55]' : (isSuccessPredicted ? 'text-[#00C853]' : 'text-white')}`}>
                           {isSuccessPredicted ? '85' : (isCrisis ? '12' : '68')}
                        </span>
                        <span className="text-xl font-bold text-[#525252] mb-2">%</span>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em]">Heuristic Breakdown</p>
                     <div className="space-y-3">
                        <div className="space-y-1">
                           <div className="flex justify-between text-[9px] uppercase font-bold text-white/40">
                              <span>Trial Design</span>
                              <span className="text-white">30%</span>
                           </div>
                           <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[30%]" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[9px] uppercase font-bold text-white/40">
                              <span>Biomarker Pattern</span>
                              <span className="text-white">40%</span>
                           </div>
                           <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[40%]" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[9px] uppercase font-bold text-white/40">
                              <span>Historical Stability</span>
                              <span className="text-white">30%</span>
                           </div>
                           <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[30%]" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
               <button 
                onClick={simulateTrialFailure}
                disabled={isCrisis}
                className="w-full py-5 bg-[#FF2D55] hover:bg-[#d02546] text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
               >
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  SIMULATE TRIAL FAILURE
               </button>
               <button 
                onClick={simulatePredictSuccess}
                disabled={isSuccessPredicted}
                className="w-full py-5 bg-[#00C853] hover:bg-[#00a846] text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
               >
                  <Target className="w-5 h-5" />
                  PREDICT SUCCESS
               </button>
            </div>

            {/* Contingency Plan or Recommendation Overlay */}
            {isCrisis && (
              <div className="bg-[#161616] border border-[#FF2D55]/50 p-8 space-y-6 animate-in slide-in-from-right-10 duration-500">
                 <div className="flex items-center gap-3 text-[#FF2D55]">
                    <History className="w-5 h-5" />
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em]">CONTINGENCY PLAN A: ENGAGED</h4>
                 </div>
                 <p className="text-xs text-[#A8A8A8] leading-relaxed italic">
                    "Crisis detected: Oncology Trial BNT-321 halted. Market sentiment shifted (-35% stock impact). Initiating supply chain redirection to backup oncology pipeline nodes."
                 </p>
                 <button className="w-full py-3 bg-[#262626] border border-[#FF2D55]/20 text-[#FF2D55] text-[10px] font-bold uppercase tracking-widest hover:bg-[#FF2D55]/10 transition-colors">
                    Download AAR Preview
                 </button>
              </div>
            )}

            {isSuccessPredicted && (
              <div className="bg-[#161616] border border-[#00C853]/50 p-8 space-y-6 animate-in slide-in-from-right-10 duration-500">
                 <div className="flex items-center gap-3 text-[#00C853]">
                    <Briefcase className="w-5 h-5" />
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em]">STRATEGIC RECOMMENDATION</h4>
                 </div>
                 <p className="text-xs text-[#A8A8A8] leading-relaxed italic">
                    "AI Analysis: Strong biomarker alignment in phase III cohort. 85% success threshold met. Recommendation: <strong>Accelerate manufacturing preparation</strong> and initialize early-access filings."
                 </p>
                 <button className="w-full py-3 bg-[#00C853] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#00a846] transition-colors">
                    Initialize Logistics Node
                 </button>
              </div>
            )}

            {/* IBM Integration Panel */}
            <div className="bg-[#161616] border border-[#393939] p-8 space-y-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">IBM Systems Integration</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Activity className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Clinical Development</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">Full lifecycle trial data patterns synchronized.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Target className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Watson Matching</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">AI-driven patient-to-trial recruitment matching active.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Lock className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Regulatory Sciences</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">Framework for automated FDA submission compliance.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalTrialHub;
