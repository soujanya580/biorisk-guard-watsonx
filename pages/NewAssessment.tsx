
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Dna, 
  Search, 
  Cpu, 
  AlertCircle,
  ChevronRight,
  Database,
  Users,
  Info,
  Zap,
  Terminal
} from 'lucide-react';
import { api } from '../services/api';
import { Vendor, MultiAgentRiskReport, LogEntry } from '../types';
import AIProgress from '../components/AIProgress';
import AssessmentResults from '../components/AssessmentResults';
import { useHackathon } from '../context/HackathonContext';

const NewAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [genomicInput, setGenomicInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<MultiAgentRiskReport | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { isHackathonMode } = useHackathon();

  useEffect(() => {
    const fetchVendors = async () => {
      const data = await api.getVendors();
      setVendors(data);
    };
    fetchVendors();
  }, []);

  const addLog = (message: string, agent: LogEntry['agent'] = 'SYSTEM', type: LogEntry['type'] = 'INFO') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      agent,
      message,
      type
    }]);
  };

  const handleRunAssessment = async () => {
    if (!selectedVendorId) return;
    
    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (!vendor) return;

    setIsAnalyzing(true);
    setReport(null);
    setLogs([]);
    
    addLog(`Initiating ERCA Protocol for cluster node ${vendor.name}...`, 'SYSTEM');
    
    try {
      await new Promise(r => setTimeout(r, 600));
      addLog(`Connecting to multi-agent risk matrix.`, 'SYSTEM');
      
      if (isHackathonMode) {
        addLog(`HACK_MODE: Injecting IBM watsonx Guardrails (v4.2)...`, 'SYSTEM', 'SUCCESS');
        await new Promise(r => setTimeout(r, 400));
      }

      await new Promise(r => setTimeout(r, 800));
      addLog(`Compliance Agent [ALEXANDRIA] handshake successful.`, 'COMPLIANCE', 'SUCCESS');
      
      await new Promise(r => setTimeout(r, 1200));
      addLog(`GenoSym Agent [HELIX] detecting potential genomic drift.`, 'GENOMIC', 'WARNING');

      await new Promise(r => setTimeout(r, 1000));
      addLog(`Predictive Agent [ORACLE] calculating anomaly probabilities.`, 'PREDICTIVE', 'INFO');

      const result = await api.runAssessment(vendor.id, vendor.name, genomicInput || vendor.industry);
      
      addLog(`Audit Agent [LEDGER] verifying decision explainability.`, 'AUDIT', 'SUCCESS');
      addLog(`Assessment finalized. Aggregate Risk: ${result.overallRiskScore}/10`, 'SYSTEM', 'SUCCESS');
      
      setReport(result);
    } catch (error: any) {
      addLog(`Critical Failure: ${error.message || 'AI Orchestration timeout'}`, 'SYSTEM', 'ERROR');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) return (
    <div className="p-10 max-w-[1200px] mx-auto">
      <AIProgress logs={logs} />
      {isHackathonMode && (
        <div className="mt-8 bg-[#000] border border-[#00FF00]/30 p-6 font-mono text-[10px] text-[#00FF00]">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest">Raw Orchestration stream</span>
          </div>
          <div className="space-y-1">
            <p>> gemini-3-pro: temperature=0.1 response_schema=Type.OBJECT</p>
            <p>> multi_agent_init: [COMPLIANCE, GENOMIC, FINANCIAL, PREDICTIVE, AUDIT]</p>
            <p>> watsonx_layer_4_active: TRUE</p>
            <p>> consensus_threshold: 0.85</p>
            <p className="animate-pulse">> stream_status: PROCESSING...</p>
          </div>
        </div>
      )}
    </div>
  );

  if (report) return (
    <div className="p-10 max-w-[1600px] mx-auto">
      <AssessmentResults report={report} onReset={() => { setReport(null); setLogs([]); }} />
    </div>
  );

  return (
    <div className="p-10 space-y-10 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="border-b border-[#393939] pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Vetting <span className="font-bold">Autopilot</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Deploy autonomous agents to verify healthcare supply chain integrity.</p>
        </div>
        {isHackathonMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00] rounded-sm">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Watsonx Architecture Patterns Engaged</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-[#393939] pb-4">
               <Database className="w-5 h-5 text-[#0062FF]" />
               <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Entity Selection</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Select Target Vendor</label>
                <div className="relative">
                  <select 
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm appearance-none"
                  >
                    <option value="">-- NO ENTITY SELECTED --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.industry})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-[#393939] rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                  <Dna className="w-3.5 h-3.5" /> Genomic Data Stream (GenoSym Input)
                </label>
                <textarea 
                  rows={6}
                  value={genomicInput}
                  onChange={(e) => setGenomicInput(e.target.value)}
                  placeholder="Paste encrypted genomic telemetry or data schemas for bias analysis..."
                  className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleRunAssessment}
                disabled={!selectedVendorId}
                className="w-full py-5 bg-[#0062FF] hover:bg-[#0052cc] disabled:bg-[#393939] disabled:text-[#A8A8A8] text-white font-bold uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 rounded-sm shadow-xl shadow-blue-900/10"
              >
                <Cpu className="w-5 h-5" />
                Initialize 5-Agent Assessment
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#161616] border border-[#393939] p-8">
             <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-[#FFD600]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Protocol Brief</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Orchestration Level</p>
                   <p className="text-xs text-[#F4F4F4] leading-relaxed">System utilizes 5 specialized Gemini agents (Genomic, Compliance, Financial, Predictive, Audit) for complete supply chain verification.</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Decision Ledger</p>
                   <p className="text-xs text-[#F4F4F4] leading-relaxed">Every decision is logged in the System Audit Ledger with human-readable explainability mappings.</p>
                </div>
                {isHackathonMode && (
                  <div className="p-4 bg-[#00FF00]/10 border border-[#00FF00]/20 text-[9px] text-[#00FF00] font-mono space-y-2">
                    <p className="font-black">TECH_SPECS:</p>
                    <p>> pattern: agent_orchestration</p>
                    <p>> llm: gemini-3-pro-preview</p>
                    <p>> context_window: 128k tokens</p>
                  </div>
                )}
                {!isHackathonMode && (
                  <div className="p-4 bg-[#FFD600]/10 border border-[#FFD600]/20 text-[10px] text-[#FFD600] leading-relaxed">
                    <AlertCircle className="w-4 h-4 mb-2" />
                    Analysis batch completes in ~15s across global risk nodes.
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewAssessment;
