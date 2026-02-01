import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  History, 
  ShieldCheck, 
  Database,
  Link as LinkIcon,
  ShieldAlert,
  CheckCircle2,
  Box,
  Fingerprint,
  Lock,
  Globe,
  Loader2,
  Monitor,
  Shield,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { COLORS } from '../constants';
import { sounds } from '../services/soundService';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [showVerificationStatus, setShowVerificationStatus] = useState(false);
  
  const chainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = api.subscribeToAudit((data) => {
      setLogs(data);
    });
    return unsubscribe;
  }, []);

  const sortedLogsForChain = useMemo(() => [...logs].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ), [logs]);

  const handleVerifyFullChain = async () => {
    setIsVerifyingAll(true);
    setShowVerificationStatus(false);
    sounds.playTone(400, 0.2);
    
    await new Promise(r => setTimeout(r, 2000));
    
    setIsVerifyingAll(false);
    setShowVerificationStatus(true);
    sounds.playSuccess();
  };

  const handleSimulateTamper = () => {
    setIsTampered(true);
    sounds.playAlert();
    alert("SECURITY BREACH: Hacker attempting to alter Block history... Hash mismatch detected in Merkle Root!");
  };

  const verifyIntegrity = async (index: number) => {
    setVerifyingIndex(index);
    sounds.playTone(440, 0.1);
    await new Promise(r => setTimeout(r, 800));
    setVerifyingIndex(null);
    sounds.playSuccess();
  };

  const getRiskColor = (score: number) => {
    if (score === 0) return '#0062FF';
    if (score > 7) return COLORS.DANGER;
    if (score > 4) return COLORS.WARNING;
    return COLORS.HEALTHCARE_GREEN;
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#00C853] flex items-center justify-center rounded-sm shadow-lg shadow-[#00C853]/20">
            <History className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase italic">Audit <span className="font-bold text-[#00C853]">Chain Ledger</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Immutable risk blocks secured via SHA-256 simulation and multi-agent signatures.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSimulateTamper}
            className="px-6 py-2.5 border border-[#FF2D55]/30 text-[#FF2D55] text-xs font-bold uppercase tracking-widest hover:bg-[#FF2D55]/10 rounded-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Simulate Tampering
          </button>
          <button 
            onClick={handleVerifyFullChain}
            disabled={isVerifyingAll}
            className="px-6 py-2.5 bg-[#0062FF] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm shadow-xl shadow-blue-900/20"
          >
             {isVerifyingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
             Verify Full Chain
          </button>
        </div>
      </div>

      {/* Visual Blockchain */}
      <div className="space-y-12">
        <div className="overflow-x-auto pb-10 scrollbar-hide" ref={chainScrollRef}>
          <div className="flex items-center gap-12 px-6 min-w-max">
             {sortedLogsForChain.map((log, i) => (
               <div key={log.id} className="relative">
                 {i > 0 && (
                   <div className="absolute right-full top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-[#0062FF] to-[#393939] flex items-center justify-center">
                      <LinkIcon className={`w-3 h-3 rotate-45 ${isTampered && i === 2 ? 'text-[#FF2D55] animate-bounce' : 'text-[#0062FF]'}`} />
                   </div>
                 )}
                 <div 
                  onClick={() => { setSelectedLog(log); verifyIntegrity(i); }}
                  className={`w-64 p-5 bg-[#161616] border-2 cursor-pointer transition-all hover:scale-105 relative group ${
                    selectedLog?.id === log.id ? 'border-[#0062FF] shadow-2xl shadow-[#0062FF]/10' : 'border-[#393939]'
                  } ${isTampered && i === 1 ? 'border-[#FF2D55] animate-shake' : ''}`}
                 >
                    {verifyingIndex === i && (
                      <div className="absolute inset-0 bg-[#0062FF]/20 flex items-center justify-center z-10 backdrop-blur-sm">
                         <Loader2 className="w-8 h-8 text-[#0062FF] animate-spin" />
                      </div>
                    )}
                    <div className="h-1 w-full absolute top-0 left-0" style={{ backgroundColor: isTampered && i === 1 ? '#FF2D55' : getRiskColor(log.riskScore) }} />
                    <div className="flex justify-between items-start mb-6 pt-2">
                       <div className={`p-2 bg-[#262626] border border-[#393939] ${isTampered && i === 1 ? 'text-[#FF2D55]' : 'text-[#A8A8A8]'} group-hover:text-white transition-colors`}>
                         <Box className="w-5 h-5" />
                       </div>
                       <span className="text-[10px] font-mono text-[#393939]">#BLOCK_{i}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate mb-1">{log.vendorName}</h4>
                    <p className="text-[9px] text-[#A8A8A8] font-mono uppercase truncate">{log.action}</p>
                    
                    <div className="mt-6 flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[8px] font-bold text-[#525252] uppercase">{isTampered && i === 1 ? 'Tamper Detected' : 'Hash Verified'}</p>
                          <div className="flex gap-1">
                             <div className={`w-1.5 h-1.5 rounded-full ${isTampered && i === 1 ? 'bg-[#FF2D55]' : 'bg-[#00C853]'}`} />
                             <div className={`w-1.5 h-1.5 rounded-full ${isTampered && i === 1 ? 'bg-[#FF2D55]' : 'bg-[#00C853]'}`} />
                          </div>
                       </div>
                       <Lock className={`w-3 h-3 ${isTampered && i === 1 ? 'text-[#FF2D55]' : 'text-[#393939]'}`} />
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Verification Report Overlay */}
        {showVerificationStatus && (
          <div className="bg-[#161616] border border-[#00C853]/50 p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#00C853]/10 text-[#00C853]"><ShieldCheck className="w-6 h-6" /></div>
                   <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-widest">Global Chain Verification: SUCCESS</h3>
                      <p className="text-[10px] text-[#A8A8A8] uppercase tracking-[0.2em] font-mono">Consensus: Valid • Hashes: Matched • Signatures: Verified</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-[#00C853] font-mono">100% SECURE</p>
                   <p className="text-[9px] text-[#A8A8A8] uppercase font-bold tracking-widest">Ledger Integrity</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-[#393939]">
                {['Genesis Sync', 'Merkle Root Integrity', 'Agent Consensus', 'Timestamp Drift'].map((check, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <CheckCircle2 className="w-3 h-3 text-[#00C853]" />
                     <span className="text-[10px] text-white uppercase tracking-widest">{check}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Forensic View */}
        {selectedLog ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-500">
             <div className="lg:col-span-8 bg-[#262626] border border-[#393939] p-10 space-y-10">
                <div className="flex justify-between items-start">
                   <div className="flex gap-6">
                      <div className="p-4 bg-[#161616] border border-[#393939] text-[#0062FF]">
                         <Fingerprint className="w-12 h-12" />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Forensic <span className="text-[#0062FF]">Block Inspection</span></h2>
                         <p className="text-[10px] font-mono text-[#A8A8A8] mt-1">UUID: {selectedLog.id.toUpperCase()} | STATUS: IMMUTABLE</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Block Detail Matrix</p>
                      <div className="p-6 bg-[#161616] border border-[#393939] space-y-4">
                         <div className="flex justify-between">
                            <span className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-widest">Vendor Entity</span>
                            <span className="text-[10px] text-white font-black uppercase">{selectedLog.vendorName}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-widest">Protocol Action</span>
                            <span className="text-[10px] text-[#0062FF] font-black uppercase">{selectedLog.action}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-widest">Risk Score</span>
                            <span className={`text-[10px] font-black ${selectedLog.riskScore > 7 ? 'text-[#FF2D55]' : 'text-white'}`}>{selectedLog.riskScore} / 10</span>
                         </div>
                         <div className="pt-4 border-t border-[#262626]">
                            <p className="text-[9px] font-bold text-[#A8A8A8] uppercase mb-2">Agent Verification signatures</p>
                            <div className="flex flex-wrap gap-2">
                               {selectedLog.agentSignatures.map((sig, idx) => (
                                 <span key={idx} className="px-2 py-1 bg-[#262626] border border-[#393939] text-[8px] font-mono text-[#00C853] flex items-center gap-1">
                                    <Check className="w-2 h-2" /> {sig}
                                 </span>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.3em]">Hash Proof (SHA-256)</p>
                      <div className="p-6 bg-[#161616] border border-[#393939] font-mono text-[11px] text-[#00C853] break-all leading-relaxed h-full">
                         {selectedLog.hash}
                         <div className="mt-6 pt-6 border-t border-[#262626]">
                            <p className="text-[8px] font-bold text-[#525252] uppercase mb-1">Parent Linkage</p>
                            <p className="text-[9px] text-[#393939] truncate">{selectedLog.previousHash}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between border-b border-[#393939] pb-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Raw Audit Telemetry</h3>
                   </div>
                   <div className="bg-[#000] p-8 h-64 overflow-y-auto scrollbar-hide border border-[#393939]">
                      <pre className="text-[11px] font-mono text-[#A8A8A8] leading-relaxed whitespace-pre-wrap">
                         {JSON.stringify(selectedLog.snapshot, null, 2)}
                      </pre>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                {/* IBM Blockchain Pattern Badge */}
                <div className="bg-[#161616] border border-[#0062FF]/50 p-8 space-y-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Shield className="w-24 h-24 text-white" />
                   </div>
                   <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3 text-[#0062FF]">
                         <Monitor className="w-5 h-5" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest">IBM Blockchain Patterns</h4>
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-[#00C853]" />
                            <span className="text-[10px] text-[#A8A8A8] uppercase font-bold">IBM Hyperledger Fabric Pattern ✓</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-[#00C853]" />
                            <span className="text-[10px] text-[#A8A8A8] uppercase font-bold">Immutable Audit Trail ACTIVE ✓</span>
                         </div>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed italic border-t border-[#393939] pt-4 uppercase tracking-tighter font-mono">
                        System ready for IBM Blockchain Platform deployment. Orchestrate consensus across global nodes.
                      </p>
                   </div>
                </div>

                <div className="bg-[#262626] border border-[#393939] p-8 space-y-6">
                   <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-[#393939] pb-4">Timeline History</h3>
                   <div className="space-y-6 relative pl-4 border-l border-[#393939]">
                      {[
                        { date: '2024-01-28', event: 'Vendor Onboarded' },
                        { date: '2024-01-29', event: 'Initial Assessment (Risk: 5.2)' },
                        { date: '2024-01-30', event: 'Compliance Violation Detected' },
                        { date: '2024-01-30', event: 'Risk Updated (8.7 -> REJECTED)' },
                        { date: '2024-01-31', event: 'Mitigation Plan Created' },
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                           <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#393939] border-2 border-[#262626]" />
                           <p className="text-[9px] font-mono text-[#525252]">{step.date}</p>
                           <p className="text-[10px] font-bold text-[#A8A8A8] uppercase mt-0.5">{step.event}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="h-[600px] border-2 border-dashed border-[#393939] bg-[#161616]/50 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
             <Globe className="w-20 h-20 text-[#262626] mb-8" />
             <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Chain Explorer Active</h3>
             <p className="text-[#A8A8A8] text-xs max-w-sm font-light italic leading-relaxed">
               Select a risk block from the horizontal chain above to perform a forensic audit of the autonomous decisions and agent signatures.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;