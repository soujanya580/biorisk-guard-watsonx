
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Zap, 
  Users, 
  TrendingDown, 
  Loader2, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  History, 
  Trophy,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Play,
  Clock,
  Dna,
  DollarSign,
  Gavel,
  Check,
  // Added Heart import to fix "Cannot find name 'Heart'" error
  Heart
} from 'lucide-react';
import { CRISIS_SCENARIOS } from '../constants';
import { SimulationScenario } from '../types';
import { sounds } from '../services/soundService';

// --- MOCK DATA & CONSTANTS ---
const AUTO_LOGS = [
  { message: 'CONTAINMENT: +12% (Firewall deployed)', type: 'SUCCESS' },
  { message: 'PUBLIC TRUST: +8% (Transparency statement released)', type: 'INFO' },
  { message: 'STABILITY: +10% (Emergency funding secured)', type: 'SUCCESS' },
  { message: 'AI_AGENT_BRAVO: Patching genomic metadata leak points...', type: 'INFO' },
  { message: 'REGULATOR_SYNC: FDA confirmed receipt of preliminary report.', type: 'SUCCESS' },
];

const TIMELINE_STEPS = [
  { time: '00:00', event: 'CRISIS DETECTED' },
  { time: '00:30', event: 'IBM AI AGENTS DEPLOYED' },
  { time: '01:15', event: 'CONTAINMENT PROTOCOLS ACTIVATED' },
  { time: '02:45', event: 'STAKEHOLDER NOTIFICATIONS SENT' },
  { time: '04:20', event: 'MITIGATION PLAN EXECUTED' },
  { time: '06:00', event: 'CRISIS RESOLVED' },
];

const INITIAL_STAKEHOLDERS = [
  { name: 'Global Media', status: 'Hostile', color: '#FF2D55' },
  { name: 'FDA Regulators', status: 'Intervening', color: '#FFD600' },
  { name: 'Equity Partners', status: 'Concerned', color: '#FFD600' },
  { name: 'Public Patients', status: 'Alarmed', color: '#FF2D55' }
];

const RESOLVED_STAKEHOLDERS = [
  { name: 'Global Media', status: 'Neutral', color: '#A8A8A8' },
  { name: 'FDA Regulators', status: 'Satisfied', color: '#00C853' },
  { name: 'Equity Partners', status: 'Confident', color: '#00C853' },
  { name: 'Public Patients', status: 'Reassured', color: '#00C853' }
];

// --- HELPER COMPONENTS ---
const NumberTicker: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    let startValue = displayValue;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(startValue + (value - startValue) * progress);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{displayValue}{suffix}</span>;
};

const CrisisSimulation: React.FC = () => {
  const [gameState, setGameState] = useState<'SELECTING' | 'SIMULATING' | 'SUCCESS'>('SELECTING');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ containment: 10, trust: 30, stability: 50 });
  const [fiscalHemorrhage, setFiscalHemorrhage] = useState(75);
  const [legalExposure, setLegalExposure] = useState(98.2);
  const [stakeholders, setStakeholders] = useState(INITIAL_STAKEHOLDERS);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [resolutionStep, setResolutionStep] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // --- AUTOMATIC METRIC INCREASES ---
  useEffect(() => {
    if (gameState === 'SIMULATING' && !isDemoRunning) {
      const timer1 = setTimeout(() => setMetrics(prev => ({ ...prev, containment: 35, trust: 48, stability: 68 })), 2000);
      const timer2 = setTimeout(() => setMetrics(prev => ({ ...prev, containment: 65, trust: 72, stability: 82 })), 4000);
      const timer3 = setTimeout(() => setMetrics(prev => ({ ...prev, containment: 85, trust: 88, stability: 94 })), 8000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [gameState, isDemoRunning]);

  // --- AUTOMATIC LOG UPDATES ---
  useEffect(() => {
    if (gameState === 'SIMULATING') {
      const interval = setInterval(() => {
        const nextLog = AUTO_LOGS[Math.floor(Math.random() * AUTO_LOGS.length)];
        setLogs(prev => [...prev, { ...nextLog, agent: 'SYSTEM', timestamp: new Date().toLocaleTimeString() }]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const startSim = (scen: SimulationScenario) => {
    setSelectedScenario(scen);
    setGameState('SIMULATING');
    setMetrics({ containment: 10, trust: 30, stability: 50 });
    setFiscalHemorrhage(75);
    setLegalExposure(98.2);
    setStakeholders(INITIAL_STAKEHOLDERS);
    setResolutionStep(0);
    setLogs([{
      agent: 'SYSTEM',
      timestamp: new Date().toLocaleTimeString(),
      message: 'CRISIS_ORCHESTRATOR ACTIVE • RESPONSE TEAMS DEPLOYED',
      type: 'INFO'
    }]);
    sounds.playAlert();
  };

  const handleDeployEmergencyResponse = () => {
    setLogs(prev => [...prev, { agent: 'SYSTEM', message: 'DEPLOYING IBM INCIDENT RESPONSE FRAMEWORK...', type: 'SUCCESS', timestamp: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      setMetrics({ containment: 98, trust: 95, stability: 99 });
      setFiscalHemorrhage(0);
      setLegalExposure(15);
      setStakeholders(RESOLVED_STAKEHOLDERS);
      setResolutionStep(5);
      setLogs(prev => [...prev, { agent: 'SYSTEM', message: 'CRISIS CONTAINED • LOSSES MINIMIZED', type: 'SUCCESS', timestamp: new Date().toLocaleTimeString() }]);
      sounds.playSuccess();
      setTimeout(() => setGameState('SUCCESS'), 3000);
    }, 1500);
  };

  const handleOption = (option: 'A' | 'B' | 'C') => {
    // Correctly using playTone which is now public in SoundService to fix line 155 error
    sounds.playTone(600, 0.2);
    if (option === 'A') {
      setMetrics(prev => ({ ...prev, trust: Math.min(100, prev.trust + 40), stability: Math.max(0, prev.stability - 25) }));
      setLogs(prev => [...prev, { agent: 'COMMAND', message: 'EXECUTED: FULL DISCLOSURE PROTOCOL', type: 'INFO', timestamp: new Date().toLocaleTimeString() }]);
    } else if (option === 'B') {
      setMetrics(prev => ({ ...prev, stability: Math.min(100, prev.stability + 30) }));
      setLegalExposure(prev => Math.min(100, prev + 15));
      setLogs(prev => [...prev, { agent: 'COMMAND', message: 'EXECUTED: CONTROLLED RELEASE STRATEGY', type: 'INFO', timestamp: new Date().toLocaleTimeString() }]);
    } else {
      setMetrics(prev => ({ ...prev, trust: Math.max(0, prev.trust - 20), stability: Math.min(100, prev.stability + 10) }));
      setLogs(prev => [...prev, { agent: 'COMMAND', message: 'EXECUTED: SILENT CONTAINMENT SEQUENCE', type: 'INFO', timestamp: new Date().toLocaleTimeString() }]);
    }
  };

  const runAutoDemo = () => {
    setIsDemoRunning(true);
    startSim(CRISIS_SCENARIOS[0]);
    
    // Automation sequence
    setTimeout(() => handleOption('A'), 5000);
    setTimeout(() => handleOption('B'), 15000);
    setTimeout(() => setResolutionStep(3), 25000);
    setTimeout(() => handleDeployEmergencyResponse(), 45000);
  };

  if (gameState === 'SELECTING') {
    return (
      <div className="p-10 space-y-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 bg-[#FF2D55]/10 border border-[#FF2D55]/20 text-[#FF2D55] rounded-full mb-4">
            <Flame className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Crisis <span className="text-[#FF2D55]">Simulation Command</span></h1>
          <p className="text-lg text-[#A8A8A8] max-w-2xl mx-auto font-light leading-relaxed">
            Battle-test your risk protocols against black-swan events. Coordinate IBM AI agents to contain catastrophic bio-leaks and regulatory meltdowns.
          </p>
          <button 
            onClick={runAutoDemo}
            className="mt-6 px-10 py-4 bg-[#0062FF] hover:bg-[#0052cc] text-white text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 mx-auto rounded-sm shadow-2xl shadow-blue-900/30"
          >
            <Play className="w-4 h-4 fill-current" />
            PLAY CRISIS RESOLUTION DEMO
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          {CRISIS_SCENARIOS.map((scen) => (
            <div 
              key={scen.id} 
              className="bg-[#262626] border border-[#393939] p-8 space-y-8 group hover:border-[#FF2D55] transition-all cursor-pointer relative overflow-hidden"
              onClick={() => startSim(scen)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-24 h-24 text-white" />
              </div>

              <div className="flex justify-between items-start">
                <div className={`p-3 bg-[#161616] border border-[#393939] text-[#FF2D55]`}>
                   <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-bold px-2 py-1 uppercase tracking-widest bg-[#FF2D55]/10 text-[#FF2D55] border border-[#FF2D55]/20">CRITICAL</span>
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{scen.title}</h3>
                <p className="text-sm text-[#A8A8A8] leading-relaxed line-clamp-3">{scen.description}</p>
              </div>

              <button className="w-full py-4 border border-[#393939] text-[10px] font-bold text-white uppercase tracking-[0.2em] group-hover:bg-[#FF2D55] group-hover:border-[#FF2D55] transition-all flex items-center justify-center gap-2">
                Initialize War Room <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'SIMULATING') {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden animate-in fade-in duration-500">
        {/* HUD Header */}
        <div className="h-24 bg-[#161616] border-b border-[#FF2D55]/40 flex items-center justify-between px-10 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D55]/10 to-transparent animate-pulse pointer-events-none" />
           <div className="relative z-10 flex items-center gap-8">
              <div className="w-12 h-12 bg-[#FF2D55] flex items-center justify-center shadow-[0_0_20px_rgba(255,45,85,0.4)]">
                 <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{selectedScenario?.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                   <span className="text-[10px] text-[#FF2D55] font-mono font-bold uppercase tracking-[0.3em] bg-[#FF2D55]/10 px-2 py-0.5">CODE_RED</span>
                   <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
                      5 AGENTS COORDINATING RESPONSE
                   </span>
                </div>
              </div>
           </div>

           <div className="relative z-10 flex gap-12">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                    <span>Containment</span>
                    <span className="text-white font-mono"><NumberTicker value={metrics.containment} suffix="%" /></span>
                 </div>
                 <div className="w-48 h-2 bg-white/5 border border-white/10 overflow-hidden">
                    <div className="h-full bg-[#0062FF] transition-all duration-1000 shadow-[0_0_10px_#0062FF]" style={{ width: `${metrics.containment}%` }} />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                    <span>Public Trust</span>
                    <span className="text-white font-mono"><NumberTicker value={metrics.trust} suffix="%" /></span>
                 </div>
                 <div className="w-48 h-2 bg-white/5 border border-white/10 overflow-hidden">
                    <div className="h-full bg-[#00C853] transition-all duration-1000 shadow-[0_0_10px_#00C853]" style={{ width: `${metrics.trust}%` }} />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">
                    <span>Stability</span>
                    <span className="text-white font-mono"><NumberTicker value={metrics.stability} suffix="%" /></span>
                 </div>
                 <div className="w-48 h-2 bg-white/5 border border-white/10 overflow-hidden">
                    <div className="h-full bg-[#FFD600] transition-all duration-1000 shadow-[0_0_10px_#FFD600]" style={{ width: `${metrics.stability}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Panel: Feed & Controls */}
          <div className="lg:col-span-8 flex flex-col bg-[#050505] border-r border-[#393939]">
            {/* Active Status Display */}
            <div className="p-6 bg-[#111] border-b border-[#393939]">
               <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-2">
                  <span className="flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> CRISIS_ORCHESTRATOR_STREAM</span>
                  <span className="text-[#FF2D55]">DECISION WINDOW: 8:28 REMAINING</span>
               </div>
               <div className="bg-[#161616] p-4 border-l-4 border-[#FF2D55] text-white">
                  <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">
                     STATUS: CRITICAL DATA LEAK IN CLUSTER-B. IBM AI DETECTED 14,000 EXPOSED GENOMIC RECORDS.
                  </p>
               </div>
            </div>

            {/* Agent Feed */}
            <div ref={logContainerRef} className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-6 animate-in slide-in-from-left-4 duration-500 ${log.agent === 'COMMAND' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-sm max-w-xl ${
                    log.agent === 'COMMAND' 
                      ? 'bg-[#FF2D55] text-white border border-[#FF2D55] shadow-lg' 
                      : 'bg-[#161616] border border-[#393939] text-[#F4F4F4]'
                  }`}>
                    <div className="flex items-center justify-between mb-2 opacity-50">
                       <span className="text-[9px] font-bold uppercase tracking-widest">{log.agent}</span>
                       <span className="text-[8px] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed font-mono">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Command Console */}
            <div className="p-8 bg-[#161616] border-t border-[#393939] space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button onClick={() => handleOption('A')} className="bg-[#262626] border border-[#393939] p-4 text-left hover:border-[#FF2D55] transition-all group">
                     <p className="text-[10px] font-black text-[#FF2D55] uppercase mb-1">[🔴 OPTION A] FULL DISCLOSURE</p>
                     <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter">Public Trust +40%, Stock -25%</p>
                  </button>
                  <button onClick={() => handleOption('B')} className="bg-[#262626] border border-[#393939] p-4 text-left hover:border-[#FFD600] transition-all group">
                     <p className="text-[10px] font-black text-[#FFD600] uppercase mb-1">[🟡 OPTION B] CONTROLLED RELEASE</p>
                     <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter">Stability +30%, Legal Risk +15%</p>
                  </button>
                  <button onClick={() => handleOption('C')} className="bg-[#262626] border border-[#393939] p-4 text-left hover:border-[#0062FF] transition-all group">
                     <p className="text-[10px] font-black text-[#0062FF] uppercase mb-1">[🟢 OPTION C] SILENT CONTAINMENT</p>
                     <p className="text-[9px] text-[#A8A8A8] uppercase tracking-tighter">Stock +10%, Trust Crisis Risk</p>
                  </button>
               </div>

               <button 
                  onClick={handleDeployEmergencyResponse}
                  className="w-full py-5 bg-[#0062FF] hover:bg-[#0052cc] text-white text-sm font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40 rounded-sm group active:scale-[0.98] transition-all"
               >
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  🚀 DEPLOY EMERGENCY RESPONSE
               </button>
            </div>
          </div>

          {/* Right Panel: Side Status */}
          <div className="lg:col-span-4 bg-[#111] p-10 space-y-12 overflow-y-auto scrollbar-hide border-l border-[#393939]">
             {/* Loss Predictor */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#FFD600] uppercase tracking-[0.4em] flex items-center gap-3 border-b border-white/5 pb-4">
                  <TrendingDown className="w-5 h-5" /> Live Loss Predictor
                </h3>
                <div className="grid grid-cols-1 gap-6">
                   <div className="bg-[#161616] border border-[#393939] p-6 space-y-2">
                      <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest">Fiscal Hemorrhage</p>
                      <p className={`text-4xl font-black font-mono transition-colors duration-1000 ${fiscalHemorrhage === 0 ? 'text-[#00C853]' : 'text-[#FF2D55]'}`}>
                         <NumberTicker value={fiscalHemorrhage} />M <span className="text-xs font-normal">/ hr</span>
                      </p>
                   </div>
                   <div className="bg-[#161616] border border-[#393939] p-6 space-y-2">
                      <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest">Legal Exposure</p>
                      <p className={`text-4xl font-black font-mono transition-colors duration-1000 ${legalExposure < 20 ? 'text-[#00C853]' : 'text-[#FFD600]'}`}>
                         <NumberTicker value={legalExposure} suffix="%" />
                      </p>
                   </div>
                </div>
             </div>

             {/* Stakeholder Grid */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#0062FF] uppercase tracking-[0.4em] flex items-center gap-3 border-b border-white/5 pb-4">
                  <Users className="w-5 h-5" /> Stakeholder Matrix
                </h3>
                <div className="space-y-4">
                   {stakeholders.map((sh, idx) => (
                     <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-xs text-white/60 uppercase font-bold">{sh.name}</span>
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sh.color }} />
                           <span className="text-[11px] font-bold uppercase tracking-widest font-mono" style={{ color: sh.color }}>{sh.status}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Timeline */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.4em] flex items-center gap-3 border-b border-white/5 pb-4">
                  <History className="w-5 h-5" /> Resolution Timeline
                </h3>
                <div className="space-y-6 relative pl-4 border-l border-[#393939]">
                   {TIMELINE_STEPS.map((step, idx) => (
                     <div key={idx} className={`relative ${idx <= resolutionStep ? 'opacity-100' : 'opacity-20'}`}>
                        <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#111] ${idx <= resolutionStep ? 'bg-[#00C853]' : 'bg-[#393939]'}`} />
                        <p className="text-[9px] font-mono text-[#525252]">{step.time}</p>
                        <p className="text-[10px] font-bold text-white uppercase mt-0.5">{step.event}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'SUCCESS') {
    return (
      <div className="p-20 flex items-center justify-center min-h-screen animate-in zoom-in-95 duration-1000">
        <div className="w-full max-w-xl bg-[#262626] border-2 border-[#00C853] p-12 shadow-[0_0_50px_rgba(0,200,83,0.15)] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-64 h-64 text-[#00C853]" />
           </div>
           
           <div className="relative z-10 space-y-10">
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-[#00C853] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_#00C853]">
                    <Check className="w-12 h-12 text-white stroke-[4px]" />
                 </div>
                 <h2 className="text-3xl font-black text-white uppercase tracking-tight">CRISIS RESOLUTION COMPLETE</h2>
                 <p className="text-[10px] font-mono text-[#00C853] uppercase tracking-[0.4em]">IBM_INCIDENT_RESPONSE: SUCCESS</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {[
                   { label: 'FINANCIAL IMPACT', value: '$18.2M SAVED', icon: <DollarSign className="w-4 h-4" />, color: 'text-white' },
                   { label: 'LEGAL EXPOSURE', value: 'REDUCED BY 83%', icon: <Gavel className="w-4 h-4" />, color: 'text-[#00C853]' },
                   // Fixed Heart icon usage by adding missing import from lucide-react
                   { label: 'REPUTATION', value: 'PROTECTED', icon: <Heart className="w-4 h-4" />, color: 'text-[#00C853]' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-[#161616] p-6 border border-[#393939] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-[#262626] border border-[#393939] text-[#00C853]">{stat.icon}</div>
                         <span className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className={`text-sm font-black font-mono ${stat.color}`}>{stat.value}</span>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-[#393939] flex items-center justify-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">IBM WATSONX ORCHESTRATE: ACTIVE</span>
              </div>

              <button 
                onClick={() => setGameState('SELECTING')}
                className="w-full py-4 bg-[#161616] border border-[#393939] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#393939] transition-all"
              >
                Return to Simulation Lab
              </button>
           </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CrisisSimulation;
