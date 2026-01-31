
import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Dna, TrendingDown, Terminal, FileText, BarChart3 } from 'lucide-react';

interface AIProgressProps {
  logs: Array<{
    agent: string;
    message: string;
    timestamp: string;
    type: string;
  }>;
}

const AIProgress: React.FC<AIProgressProps> = ({ logs }) => {
  const [complianceProgress, setComplianceProgress] = useState(0);
  const [genomicProgress, setGenomicProgress] = useState(0);
  const [financialProgress, setFinancialProgress] = useState(0);

  useEffect(() => {
    if (logs.some(l => l.agent === 'COMPLIANCE')) setComplianceProgress(65);
    if (logs.some(l => l.agent === 'GENOMIC')) setGenomicProgress(45);
    if (logs.some(l => l.agent === 'FINANCIAL')) setFinancialProgress(30);
    
    if (logs.some(l => l.agent === 'COMPLIANCE' && l.type === 'SUCCESS')) setComplianceProgress(100);
    if (logs.some(l => l.agent === 'GENOMIC' && l.type === 'SUCCESS')) setGenomicProgress(100);
    if (logs.some(l => l.agent === 'FINANCIAL' && l.type === 'SUCCESS')) setFinancialProgress(100);
  }, [logs]);

  const agents = [
    { 
      name: 'Compliance Agent', 
      icon: (
        <div className="relative">
          <FileText className="w-4 h-4" />
          {complianceProgress < 100 && complianceProgress > 0 && (
            <div className="absolute inset-0 bg-[#0062FF]/20 animate-[pulse_1s_infinite] border-t-2 border-[#0062FF] translate-y-[-2px] h-[2px] w-full" 
                 style={{ top: `${Math.sin(Date.now()/200)*50 + 50}%` }} />
          )}
        </div>
      ), 
      progress: complianceProgress, 
      color: '#0062FF' 
    },
    { 
      name: 'Genomic Risk Agent', 
      icon: <Dna className={`w-4 h-4 ${genomicProgress < 100 && genomicProgress > 0 ? 'animate-[spin_3s_linear_infinite]' : ''}`} />, 
      progress: genomicProgress, 
      color: '#00C853' 
    },
    { 
      name: 'Financial Risk Agent', 
      icon: <BarChart3 className={`w-4 h-4 ${financialProgress < 100 && financialProgress > 0 ? 'animate-bounce' : ''}`} />, 
      progress: financialProgress, 
      color: '#A78BFA' 
    },
  ];

  return (
    <div className="bg-[#262626] border border-[#393939] p-8 flex flex-col items-center justify-center space-y-10 min-h-[500px]" aria-busy="true" aria-live="polite">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-20 h-20 border-4 border-[#0062FF]/10 border-t-[#0062FF] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-[#0062FF] animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Orchestrating Logic</h3>
        <p className="text-[#A8A8A8] text-sm max-w-sm font-light">
          Simulating ERCA multi-agent protocol via Gemini-3-Pro-Preview engine.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {agents.map((agent, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2" style={{ color: agent.color }}>
                {agent.icon}
                <span>{agent.name}</span>
              </div>
              <span className="text-[#A8A8A8]" aria-label={`${agent.name} at ${agent.progress} percent`}>{agent.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#161616] rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-700 ease-out rounded-full" 
                style={{ width: `${agent.progress}%`, backgroundColor: agent.color }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full bg-[#161616] border border-[#393939] rounded-sm p-4 h-32 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-3 border-b border-[#393939] pb-2">
          <Terminal className="w-3 h-3 text-[#A8A8A8]" />
          <span className="text-[8px] font-mono text-[#A8A8A8] uppercase tracking-widest">Kernel Stream</span>
        </div>
        <div className="space-y-1 font-mono text-[9px] text-[#525252]">
          {logs.slice(-3).map((log, i) => (
            <p key={i} className="truncate">
              <span className="text-[#393939]">[{log.timestamp}]</span> <span className="text-[#0062FF]">{log.agent}</span> {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

import { Cpu } from 'lucide-react';
export default AIProgress;
