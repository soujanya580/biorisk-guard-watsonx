
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Dna,
  TrendingDown,
  Info,
  Quote,
  Fingerprint,
  Activity,
  Layers,
  Code,
  Zap,
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { MultiAgentRiskReport, AgentFindings } from '../types';
import { COLORS, AGENT_CONFIG } from '../constants';
import { sounds } from '../services/soundService';
import { useHackathon } from '../context/HackathonContext';

interface AssessmentResultsProps {
  report: MultiAgentRiskReport;
  onReset: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ report, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showBehindNumbers, setShowBehindNumbers] = useState(false);
  const { isHackathonMode } = useHackathon();

  useEffect(() => {
    sounds.playAssessmentComplete();
    if (report.overallRiskScore > 7) {
      setTimeout(() => sounds.playAlert(), 1000);
    }
  }, [report.overallRiskScore]);

  const getRiskColor = (score: number) => {
    if (score > 7) return COLORS.DANGER;
    if (score > 4) return COLORS.WARNING;
    return COLORS.HEALTHCARE_GREEN;
  };

  const agents = [
    { 
      data: report.complianceAgent, 
      config: AGENT_CONFIG.COMPLIANCE,
      color: '#0062FF',
      watsonPattern: 'Agentic Governance Pattern',
      logicSnippet: 'validate_policy(HIPAA_DEID, source_metadata)'
    },
    { 
      data: report.genomicAgent, 
      config: AGENT_CONFIG.GENOMIC,
      color: '#00C853',
      watsonPattern: 'Granular Data Filtering',
      logicSnippet: 'detect_bias(seq_matrix, ethnicity_baseline)'
    },
    { 
      data: report.financialAgent, 
      config: AGENT_CONFIG.FINANCIAL,
      color: '#A78BFA',
      watsonPattern: 'Multi-Modal Reasoning',
      logicSnippet: 'score_fiscal_stability(market_trends, burn_rate)'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hackathon Header */}
      {isHackathonMode && (
        <div className="bg-[#00FF00]/5 border border-[#00FF00]/20 p-4 flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[#00FF00]" />
            <span className="text-[10px] font-black text-[#00FF00] uppercase tracking-[0.2em]">WATSONX_ARCHITECTURE_OVERLAY: ACTIVE</span>
          </div>
          <div className="text-[9px] font-mono text-[#00FF00]/60">Gemini-3-Pro-Preview // Temperature: 0.2 // Tokens: 18.2k</div>
        </div>
      )}

      {/* Header Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[#393939] border border-[#393939]">
        <div className="md:col-span-8 bg-[#262626] p-10">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-[#0062FF]/10 text-[#0062FF] text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-[#0062FF]/20">ERCA Multi-Agent Consensus reached</span>
             <span className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">{new Date(report.timestamp).toLocaleString()}</span>
             {isHackathonMode && <span className="bg-[#00FF00]/20 text-[#00FF00] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-[#00FF00]/30 animate-pulse">Confidence: {(report.confidenceScore * 100).toFixed(1)}%</span>}
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">{report.vendorName}</h2>
          <div className="bg-[#161616] p-6 border-l-2 border-[#393939] italic">
            <p className="text-[#A8A8A8] text-sm font-light leading-relaxed max-w-3xl">
              <Quote className="w-4 h-4 inline-block mr-2 text-[#393939]" />
              {report.summary}
            </p>
          </div>
        </div>
        <div className="md:col-span-4 bg-[#262626] p-10 flex flex-col items-center justify-center border-l border-[#393939] relative overflow-hidden">
          {showBehindNumbers && (
            <div className="absolute inset-0 bg-[#000] z-20 p-8 flex flex-col justify-center animate-in fade-in duration-300">
              <p className="text-[9px] font-mono text-[#0062FF] uppercase mb-4">AUDIT_TRACE_SNAPSHOT</p>
              <div className="space-y-2">
                <p className="text-[10px] text-[#A8A8A8] leading-tight">Total Tokens: 12.4k</p>
                <p className="text-[10px] text-[#A8A8A8] leading-tight">Model Latency: 4.2s</p>
                <p className="text-[10px] text-[#A8A8A8] leading-tight">Consensus: 0.982 Delta</p>
                <button 
                  onClick={() => setShowBehindNumbers(false)}
                  className="mt-6 text-[9px] font-bold text-white uppercase tracking-widest bg-[#393939] px-3 py-1 hover:bg-[#525252]"
                >
                  Close Data
                </button>
              </div>
            </div>
          )}
          
          <div 
            draggable 
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              setIsDragging(false);
              setShowBehindNumbers(true);
            }}
            className={`relative mb-4 cursor-grab active:cursor-grabbing transition-transform ${isDragging ? 'scale-110 rotate-3 opacity-50' : 'hover:scale-105'}`}
            title="Drag risk score to see technical audit trace"
          >
            <div 
              className="text-7xl font-black font-mono tracking-tighter"
              style={{ color: getRiskColor(report.overallRiskScore) }}
            >
              {report.overallRiskScore}
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#161616] border border-[#393939] rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono shadow-xl">
              VAR
            </div>
          </div>
          <p className="text-[10px] text-[#A8A8A8] font-bold uppercase tracking-[0.2em]">Risk Index Aggregate</p>
          <div className="mt-4 flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#00C853]" />
            <p className="text-[9px] text-[#525252] font-mono uppercase tracking-widest">Confidence: {(report.confidenceScore * 100).toFixed(0)}%</p>
          </div>
          <p className="text-[8px] text-[#393939] mt-6 font-mono uppercase">Drag Score to inspect trace</p>
        </div>
      </div>

      {/* Agent Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {agents.map((agent, i) => (
          <div key={i} className={`bg-[#262626] border p-8 flex flex-col transition-all group ${isHackathonMode ? 'border-[#00FF00]/30 shadow-[0_0_15px_#00FF000a]' : 'border-[#393939] hover:border-[#0062FF]'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className={`p-3 bg-[#161616] border border-[#393939] group-hover:border-white/20 transition-colors`} style={{ color: agent.color }}>
                {agent.config.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white font-mono">{agent.data.score}</p>
                <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter">Vector Metric</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="w-4 h-4 text-[#A8A8A8]" />
                <h4 className="font-bold text-[#F4F4F4] text-sm uppercase tracking-widest leading-none">{agent.data.personaName || agent.config.name}</h4>
              </div>
              <p className="text-[9px] text-[#525252] uppercase font-mono tracking-widest pl-6">{agent.config.role}</p>
            </div>
            
            <div className="space-y-4 flex-1 mb-6">
              {agent.data.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-3 text-[11px] text-[#A8A8A8] leading-relaxed italic">
                  <span className="text-[#0062FF] mt-1">•</span>
                  {finding}
                </div>
              ))}
            </div>

            {isHackathonMode && (
              <div className="mb-6 p-4 bg-[#000] border-l-2 border-[#00FF00] font-mono text-[9px]">
                <p className="text-[#00FF00] uppercase font-bold mb-2">PATTERN: {agent.watsonPattern}</p>
                <code className="text-white opacity-60">{agent.logicSnippet}</code>
              </div>
            )}

            {agent.data.signature && (
              <div className="mb-6 pt-4 border-t border-[#161616]">
                <p className="text-[9px] font-mono italic text-[#525252] text-right">{agent.data.signature}</p>
              </div>
            )}
            
            <div className={`pt-6 border-t border-[#393939] flex items-center justify-between text-[10px] font-bold ${agent.data.score > 6 ? 'text-[#FF2D55]' : 'text-[#00C853]'}`}>
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest">{agent.data.score > 6 ? 'Insecure' : 'Compliant'}</span>
              </div>
              {agent.data.score > 6 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>

      {/* Raw Thinking Trace (Hackathon Only) */}
      {isHackathonMode && (
        <div className="bg-[#050505] border border-[#00FF00]/30 p-10 font-mono">
          <div className="flex items-center justify-between mb-8 border-b border-[#00FF00]/10 pb-4">
             <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#00FF00]" />
                <h3 className="text-xs font-bold text-[#00FF00] uppercase tracking-[0.4em]">Multi-Agent Thinking Trace</h3>
             </div>
             <div className="flex gap-4">
                <span className="text-[9px] text-[#00FF00]/40 tracking-widest">TRACE_ID: 0x8892_ERCA_SYN</span>
             </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-64">
             <div className="bg-[#161616] p-6 overflow-y-auto scrollbar-hide text-[10px] leading-relaxed text-[#00FF00]/70 space-y-2">
                <p>INITIALIZING CONSENSUS PROTOCOL...</p>
                <p>> Loading IBM Governance Guardrails (v4.2)</p>
                <p>> Injecting Vendor Context: {report.vendorName}</p>
                <p>> Running drift analysis on NUGENE_BIOTECH_SEQ_99...</p>
                <p>> Agent COMPLIANCE flagged HIPAA Section 164.308 violation (Prob: 0.88)</p>
                <p>> Agent GENOMIC confirms drift in population cluster B (Variance: 0.12)</p>
                <p>> Aggregating risk matrices via weighted harmonic mean...</p>
                <p>RESULT_READY: Risk Score {report.overallRiskScore}</p>
                <p>TERMINATING SESSION...</p>
             </div>
             <div className="bg-[#161616] p-6 overflow-y-auto scrollbar-hide text-[10px] leading-relaxed text-blue-400/70">
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold uppercase">
                   <Layers className="w-3 h-3" /> Raw API Request Structure
                </div>
                <pre className="whitespace-pre-wrap">
{`{
  "model": "gemini-3-pro-preview",
  "contents": [
    { "role": "user", "parts": [{ "text": "Analyze ${report.vendorName}..." }] }
  ],
  "config": {
    "responseMimeType": "application/json",
    "temperature": 0.2,
    "guardrails": ["IBM_WATSONX_SECURE"]
  }
}`}
                </pre>
             </div>
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      <div className="bg-[#262626] border border-[#393939] p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#161616] border border-[#393939] text-[#0062FF]"><FileText className="w-5 h-5" /></div>
            <h3 className="font-bold text-white text-sm uppercase tracking-[0.2em]">Enterprise Remediation Matrix</h3>
          </div>
          <button className="text-[10px] font-bold uppercase text-[#0062FF] hover:underline tracking-widest">Digital Audit Vault</button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#161616] p-8 border-l-4 border-[#0062FF]">
            <p className="text-[10px] font-bold text-[#A8A8A8] mb-6 uppercase tracking-[0.2em]">Mitigation Roadmap</p>
            <ul className="space-y-4">
              {[...report.complianceAgent.recommendations, ...report.genomicAgent.recommendations].slice(0, 4).map((rec, i) => (
                <li key={i} className="flex gap-4 text-xs text-[#F4F4F4] leading-relaxed group cursor-pointer" onClick={() => sounds.playSuccess()}>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0062FF] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[#161616] p-8 border-l-4 border-[#FF2D55]">
            <p className="text-[10px] font-bold text-[#FF2D55] mb-6 uppercase tracking-[0.2em]">Risk Anomalies</p>
            <ul className="space-y-4">
              {[...report.complianceAgent.criticalAlerts, ...report.genomicAgent.criticalAlerts].slice(0, 4).map((alert, i) => (
                <li key={i} className="flex gap-4 text-xs text-red-100 leading-relaxed bg-red-500/5 p-2 border border-red-500/10">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#FF2D55] flex-shrink-0 mt-0.5" />
                  {alert}
                </li>
              ))}
              {([...report.complianceAgent.criticalAlerts, ...report.genomicAgent.criticalAlerts]).length === 0 && (
                <li className="text-[10px] text-[#393939] uppercase tracking-widest italic">No urgent anomalies detected.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Audit Detail Section */}
      <div className="bg-[#161616] border border-[#393939] p-8">
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-5 h-5 text-[#FFD600]" />
          <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">ERCA Forensic Evidence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
             <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Decision Logic</p>
             <div className="flex flex-wrap gap-2">
               {report.auditAgent.decisionPath.map((path, i) => (
                 <span key={i} className="bg-[#262626] px-2 py-1 text-[9px] font-mono text-[#00C853] border border-[#393939]">{path}</span>
               ))}
             </div>
           </div>
           <div className="space-y-2">
             <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Regulatory Frameworks</p>
             <div className="flex flex-wrap gap-2">
               {report.auditAgent.regulatoryMapping.map((reg, i) => (
                 <span key={i} className="bg-[#262626] px-2 py-1 text-[9px] font-mono text-[#0062FF] border border-[#393939]">{reg}</span>
               ))}
             </div>
           </div>
           <div className="space-y-2">
             <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Explainable AI Narrative</p>
             <p className="text-[11px] text-[#F4F4F4] leading-relaxed italic border-l border-[#393939] pl-3">"{report.auditAgent.explanation}"</p>
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center py-6 border-t border-[#393939]">
        <button 
          onClick={onReset}
          className="px-8 py-3 border border-[#393939] text-[#A8A8A8] text-xs font-bold uppercase tracking-widest hover:bg-[#262626] hover:text-white transition-all rounded-sm"
        >
          Reset Autopilot
        </button>
        <div className="flex gap-4">
          <button className="px-8 py-3 border border-[#393939] text-[#F4F4F4] text-xs font-bold uppercase tracking-widest hover:bg-[#262626] transition-all flex items-center gap-3 rounded-sm">
            <Download className="w-4 h-4" />
            Export Evidence
          </button>
          <button className="px-10 py-3 bg-[#0062FF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0052cc] transition-all flex items-center gap-3 rounded-sm shadow-xl shadow-blue-900/20">
            Finalize Vetting
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
