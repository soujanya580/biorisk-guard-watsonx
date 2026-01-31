
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Cpu, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import { performMultiAgentAnalysis } from '../lib/gemini';
import { MultiAgentRiskReport, LogEntry } from '../types';
import { AGENT_CONFIG } from '../constants';
import RiskRadar from '../components/RiskRadar';

const VendorAnalysis: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<MultiAgentRiskReport | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, agent: LogEntry['agent'] = 'SYSTEM', type: LogEntry['type'] = 'INFO') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      agent,
      message,
      type
    }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRunAutopilot = async () => {
    if (!vendorName || !description) return;
    
    setIsAnalyzing(true);
    setReport(null);
    setLogs([]);
    
    addLog(`Initiating ERCA Protocol for instance ${vendorName}...`, 'SYSTEM');
    
    // Simulate orchestration
    await new Promise(r => setTimeout(r, 800));
    addLog(`Agent [COMPLIANCE] connected. Target: Global Regulatory Frameworks.`, 'COMPLIANCE');
    
    await new Promise(r => setTimeout(r, 1200));
    addLog(`Agent [GENOMIC] online. GenoSym-AI bias detection active.`, 'GENOMIC', 'WARNING');
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Agent [FINANCIAL] online. Fetching market volatility metrics.`, 'FINANCIAL');

    try {
      const result = await performMultiAgentAnalysis(vendorName, description);
      
      addLog(`Compliance verification batch processed. Result: ${result.complianceAgent.score > 7 ? 'Critical' : 'Moderate'} Risk.`, 'COMPLIANCE', result.complianceAgent.score > 7 ? 'ERROR' : 'SUCCESS');
      addLog(`Genomic analysis finalized. GenoSym index: ${result.genomicAgent.score}/10`, 'GENOMIC', result.genomicAgent.score > 5 ? 'WARNING' : 'SUCCESS');
      addLog(`Financial vetting complete. Vendor liquidity status updated.`, 'FINANCIAL', 'SUCCESS');
      
      setReport(result);
      addLog(`ERCA Master Controller: Risk profile aggregated successfully.`, 'SYSTEM', 'SUCCESS');
    } catch (error: any) {
      addLog(`System Failure: ${error?.message || 'Orchestration crash.'}`, 'SYSTEM', 'ERROR');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Risk <span className="font-bold">Assessment Autopilot</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Autonomous multi-agent vetting sequence (ERCA Node V2).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Col: Config & Terminal */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8">
            <h3 className="font-bold text-[#F4F4F4] text-xs uppercase tracking-[0.2em] mb-6">Entity Configuration</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase mb-2 tracking-[0.1em]">Target Name</label>
                <input 
                  type="text" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g., HelixBio Global"
                  className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase mb-2 tracking-[0.1em]">Target Description / Scope</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Input detailed scope, handled data types, and fiscal history..."
                  className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all resize-none font-mono text-sm rounded-sm"
                />
              </div>
              <button 
                onClick={handleRunAutopilot}
                disabled={isAnalyzing || !vendorName || !description}
                className="w-full py-4 bg-[#0062FF] hover:bg-[#0052cc] disabled:bg-[#393939] disabled:text-[#A8A8A8] text-white font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 rounded-sm shadow-xl shadow-blue-900/10"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing Agents
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    Initiate Assessment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-[#161616] border border-[#393939] overflow-hidden flex flex-col h-[350px]">
            <div className="bg-[#262626] px-4 py-3 border-b border-[#393939] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-[#0062FF]" />
                <span className="text-[10px] font-mono text-[#A8A8A8] uppercase tracking-[0.15em]">System Runtime Log</span>
              </div>
            </div>
            <div ref={scrollRef} className="p-5 flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
              {logs.length === 0 && <p className="text-[#393939] italic uppercase">Awaiting instruction matrix...</p>}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 leading-relaxed">
                  <span className="text-[#393939]">[{log.timestamp}]</span>
                  <span className={`font-bold ${
                    log.agent === 'COMPLIANCE' ? 'text-[#0062FF]' :
                    log.agent === 'GENOMIC' ? 'text-[#00C853]' :
                    log.agent === 'FINANCIAL' ? 'text-purple-400' : 'text-[#A8A8A8]'
                  }`}>
                    {log.agent}
                  </span>
                  <span className={`
                    ${log.type === 'ERROR' ? 'text-[#FF2D55]' : 
                      log.type === 'WARNING' ? 'text-[#FFD600]' : 
                      log.type === 'SUCCESS' ? 'text-[#00C853]' : 'text-[#F4F4F4]'}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Results */}
        <div className="xl:col-span-8 space-y-8">
          {!report && !isAnalyzing && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#262626]/20 border border-dashed border-[#393939] p-16 text-center">
              <div className="w-20 h-20 bg-[#262626] border border-[#393939] flex items-center justify-center mb-8 rounded-sm">
                <Search className="w-10 h-10 text-[#393939]" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Ready for Deployment</h3>
              <p className="text-[#A8A8A8] mt-3 max-w-sm text-sm font-light">Enter target entity details and initiate the ERCA autopilot sequence for multi-agent risk assessment.</p>
            </div>
          )}

          {isAnalyzing && !report && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#262626]/20 border border-[#393939] p-16 text-center">
              <div className="relative mb-10">
                <Loader2 className="w-20 h-20 text-[#0062FF] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#0062FF]/10 rounded-full animate-ping" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Orchestrating Logic</h3>
              <p className="text-[#A8A8A8] mt-3 max-w-sm text-sm font-light italic">Synthesizing specialized risk logic via Gemini Pro multi-agent simulation...</p>
            </div>
          )}

          {report && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[#393939] border border-[#393939]">
                <div className="md:col-span-8 bg-[#262626] p-8">
                  <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-2">Analysis Result Matrix</h3>
                  <h2 className="text-3xl font-bold text-white mb-4">{report.vendorName}</h2>
                  <p className="text-[#A8A8A8] text-sm font-light leading-relaxed">{report.summary}</p>
                </div>
                <div className="md:col-span-4 bg-[#262626] p-8 flex flex-col items-center justify-center border-l border-[#393939]">
                  <div className={`text-6xl font-black mb-2 font-mono ${report.overallRiskScore > 7 ? 'text-[#FF2D55]' : report.overallRiskScore > 4 ? 'text-[#FFD600]' : 'text-[#00C853]'}`}>
                    {report.overallRiskScore}
                  </div>
                  <p className="text-[10px] text-[#A8A8A8] font-bold uppercase tracking-[0.2em]">Risk Index Aggregate</p>
                </div>
              </div>

              {/* Agent Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AgentResultCard config={AGENT_CONFIG.COMPLIANCE} data={report.complianceAgent} />
                <AgentResultCard config={AGENT_CONFIG.GENOMIC} data={report.genomicAgent} />
                <AgentResultCard config={AGENT_CONFIG.FINANCIAL} data={report.financialAgent} />
              </div>

              {/* Actionables */}
              <div className="bg-[#262626] border border-[#393939] p-8">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                     <Download className="w-4 h-4 text-[#0062FF]" />
                     Enterprise Remediation Stack
                   </h3>
                   <button className="text-[10px] font-bold uppercase text-[#0062FF] hover:text-white tracking-[0.1em] transition-colors border-b border-transparent hover:border-[#0062FF]">Export Full Report (.JSON)</button>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#161616] p-6 border-l-2 border-[#0062FF]">
                      <p className="text-[10px] font-bold text-[#A8A8A8] mb-4 uppercase tracking-widest">Recommended Mitigation</p>
                      <ul className="space-y-3">
                        {[...report.complianceAgent.recommendations.slice(0, 2), ...report.genomicAgent.recommendations.slice(0, 2)].map((rec, i) => (
                          <li key={i} className="flex gap-3 text-xs text-[#F4F4F4] leading-relaxed">
                            <ArrowRight className="w-3 h-3 text-[#0062FF] flex-shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#161616] p-6 border-l-2 border-[#FF2D55]">
                      <p className="text-[10px] font-bold text-[#FF2D55] mb-4 uppercase tracking-widest">Critical Anomalies</p>
                      <ul className="space-y-3">
                        {[...report.complianceAgent.criticalAlerts, ...report.genomicAgent.criticalAlerts].map((alert, i) => (
                          <li key={i} className="flex gap-3 text-xs text-red-100 leading-relaxed">
                            <AlertTriangle className="w-3 h-3 text-[#FF2D55] flex-shrink-0 mt-0.5" />
                            {alert}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AgentResultCard: React.FC<{ config: any; data: any }> = ({ config, data }) => {
  return (
    <div className="bg-[#262626] border border-[#393939] p-6 flex flex-col hover:border-[#0062FF] transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 bg-[#161616] border border-[#393939] group-hover:border-[#0062FF]/50 transition-colors ${config.color}`}>
          {config.icon}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white font-mono">{data.score}</p>
          <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter">Metric</p>
        </div>
      </div>
      <h4 className="font-bold text-[#F4F4F4] text-xs uppercase tracking-widest mb-1">{config.name}</h4>
      <p className="text-[10px] text-[#393939] mb-4 font-mono uppercase">Agent State: Verified</p>
      
      <div className="space-y-3 flex-1 mb-6">
        {data.findings.slice(0, 2).map((finding: string, i: number) => (
          <div key={i} className="flex items-start gap-3 text-[11px] text-[#A8A8A8] leading-relaxed">
            <div className="w-1 h-1 bg-[#393939] group-hover:bg-[#0062FF] mt-1.5 flex-shrink-0" />
            {finding}
          </div>
        ))}
      </div>
      
      <div className={`pt-4 border-t border-[#393939] flex items-center justify-between text-[10px] font-bold ${data.score > 6 ? 'text-[#FF2D55]' : 'text-[#00C853]'}`}>
        <span className="uppercase tracking-widest">{data.score > 6 ? 'Insecure' : 'Compliant'}</span>
        {data.score > 6 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      </div>
    </div>
  );
};

export default VendorAnalysis;
