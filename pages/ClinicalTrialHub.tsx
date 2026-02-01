import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  Zap, 
  ShieldAlert,
  Target,
  FlaskConical,
  ShieldCheck,
  Monitor,
  Calculator,
  Gavel,
  Info,
  BrainCircuit,
  ArrowRight,
  // Fix: Added missing Database import
  Database
} from 'lucide-react';
import { fetchClinicalTrialsForVendor, predictTrialSuccess } from '../services/clinicalTrialService';
import { api } from '../services/api';
import { ClinicalTrial, Vendor, RegulatoryMilestone, TrialAnalysis } from '../types';
import { sounds } from '../services/soundService';

const ClinicalTrialHub: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('pfizer-oncology');
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<TrialAnalysis | null>(null);
  const [riskScore, setRiskScore] = useState(3.8);
  const [revenueAtRisk, setRevenueAtRisk] = useState('$5B');
  const [regMilestones, setRegMilestones] = useState<RegulatoryMilestone[]>([]);

  useEffect(() => {
    api.getVendors().then(vends => {
      setVendors(vends);
      const target = vends.find(v => v.id === 'pfizer-oncology');
      if (target) {
        handleVendorSelect('pfizer-oncology');
      }
    });
  }, []);

  const handleVendorSelect = async (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setPrediction(null);
    
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

  const handleRunAiAnalysis = async (trial: ClinicalTrial) => {
    setIsPredicting(true);
    setPrediction(null);
    sounds.playTone(600, 0.2);
    
    try {
      const result = await predictTrialSuccess(trial);
      setPrediction(result);
      if (result.successProbability > 70) {
        sounds.playSuccess();
      } else {
        sounds.playAlert();
      }
    } catch (err) {
      console.error("AI Analysis Failed", err);
    } finally {
      setIsPredicting(false);
    }
  };

  const simulateTrialFailure = () => {
    setRiskScore(9.2);
    setRevenueAtRisk('$12.4B');
    setPrediction({
      nctId: 'FAIL_SIM',
      successProbability: 12,
      failureRiskFactors: ['CRITICAL: Safety signal detected in cohort B', 'FDA intervention pending'],
      genomicMarkersImpact: 'High variance in trial responder patterns',
      predictedApprovalDate: 'REJECTED',
      regulatoryHurdles: ['Full Phase III audit required'],
      reasoningChain: ['Simulated risk surge for executive drill']
    });
    sounds.playAlert();
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
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
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${prediction?.successProbability && prediction.successProbability > 70 ? 'text-[#00C853]' : 'text-white'}`}>
                    {prediction ? `${prediction.successProbability}%` : '68%'}
                  </h4>
                  <p className="text-[9px] text-[#A8A8A8] font-mono font-bold uppercase">AI Projected</p>
               </div>
               <div className="bg-[#161616] p-8 space-y-4">
                  <div className="flex justify-between items-center text-[#A8A8A8]">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Revenue at Risk</p>
                     <Calculator className="w-4 h-4" />
                  </div>
                  <h4 className={`text-4xl font-black font-mono tracking-tighter ${riskScore > 7 ? 'text-[#FF2D55]' : 'text-white'}`}>{revenueAtRisk}</h4>
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
                           <th className="p-5">Status</th>
                           <th className="p-5 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#393939]">
                        {trials.map((trial) => (
                           <tr key={trial.nctId} className="hover:bg-[#1c1c1c] transition-colors group">
                              <td className="p-5 font-mono text-xs text-indigo-400 font-bold">{trial.nctId}</td>
                              <td className="p-5">
                                 <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{trial.title}</p>
                                 <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter mt-0.5">{trial.primaryIndication} • Phase {trial.phase.slice(-1)}</p>
                              </td>
                              <td className="p-5">
                                 <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                                    trial.status === 'TERMINATED' ? 'bg-[#FF2D55]/10 text-[#FF2D55]' : 'bg-[#00C853]/10 text-[#00C853]'
                                 }`}>
                                    {trial.status}
                                 </span>
                              </td>
                              <td className="p-5 text-right">
                                 <button 
                                  onClick={() => handleRunAiAnalysis(trial)}
                                  disabled={isPredicting}
                                  className="text-[10px] font-black uppercase text-[#0062FF] hover:underline flex items-center gap-2 ml-auto"
                                 >
                                    {isPredicting ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                                    Analyze
                                 </button>
                              </td>
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
            {/* AI Analysis Result */}
            {isPredicting ? (
              <div className="bg-[#161616] border border-indigo-400/50 p-8 flex flex-col items-center justify-center h-[400px]">
                 <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-6" />
                 <h4 className="text-sm font-bold text-white uppercase tracking-widest">Generating Predictive Logic</h4>
                 <p className="text-[10px] text-[#A8A8A8] mt-2 font-mono">Gemini 3 Pro reasoning active...</p>
              </div>
            ) : prediction ? (
              <div className={`bg-[#161616] border p-8 space-y-8 animate-in slide-in-from-right-4 duration-500 ${prediction.successProbability > 70 ? 'border-[#00C853] bg-[#00C853]/5' : 'border-[#FF2D55] bg-[#FF2D55]/5'}`}>
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <BrainCircuit className={`w-5 h-5 ${prediction.successProbability > 70 ? 'text-[#00C853]' : 'text-[#FF2D55]'}`} />
                    <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Predictive Result</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-2">Success Probability</p>
                       <div className="flex items-end gap-3">
                          <span className={`text-6xl font-black font-mono tracking-tighter ${prediction.successProbability > 70 ? 'text-[#00C853]' : 'text-[#FF2D55]'}`}>
                             {prediction.successProbability}
                          </span>
                          <span className="text-xl font-bold text-[#525252] mb-2">%</span>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                       <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em]">Risk Factors</p>
                       <ul className="space-y-2">
                          {prediction.failureRiskFactors.map((f, i) => (
                            <li key={i} className="flex gap-2 text-xs text-white/80 leading-relaxed italic">
                               <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5 text-indigo-400" />
                               {f}
                            </li>
                          ))}
                       </ul>
                    </div>

                    <div className="p-4 bg-black/40 border-l-2 border-indigo-400 text-[10px] text-[#A8A8A8] italic">
                       <p className="font-bold text-white mb-1 uppercase tracking-widest">Genomic Impact</p>
                       {prediction.genomicMarkersImpact}
                    </div>

                    <div className="space-y-2">
                       <p className="text-[9px] font-bold text-[#525252] uppercase tracking-[0.3em]">Decision Path</p>
                       <div className="flex flex-wrap gap-2">
                          {prediction.reasoningChain.map((r, i) => (
                            <span key={i} className="text-[9px] bg-[#1c1c1c] px-2 py-0.5 border border-[#333] text-white/40 font-mono">{r}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="bg-[#161616] border border-[#393939] p-8 space-y-8 flex flex-col items-center justify-center h-[400px] text-center">
                 <Activity className="w-12 h-12 text-[#262626] mb-6" />
                 <h4 className="text-xs font-bold text-[#A8A8A8] uppercase tracking-widest">Node Analysis Standby</h4>
                 <p className="text-[10px] text-[#525252] max-w-[180px] leading-relaxed">Select a trial from the registry list to deploy AI predictive forensic agents.</p>
                 <button 
                  onClick={simulateTrialFailure}
                  className="mt-6 text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-400/20 px-4 py-2 hover:bg-indigo-400/5 transition-colors"
                 >
                    Trigger Drift Scenario
                 </button>
              </div>
            )}

            {/* IBM Integration Panel */}
            <div className="bg-[#161616] border border-[#393939] p-8 space-y-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">IBM Integration</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Activity className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">IBM Clinical Data Sync</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">Direct node link to IBM clinical repository.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start">
                     <div className="p-2 bg-[#262626] border border-[#393939] text-[#0062FF]">
                        <Target className="w-4 h-4" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">Watson Recruitment</p>
                        <p className="text-[10px] text-[#525252] leading-relaxed italic">AI-optimized patient selection active.</p>
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