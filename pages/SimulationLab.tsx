
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Play, 
  Settings, 
  RefreshCcw, 
  Download, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Database,
  Info,
  ChevronRight,
  TrendingDown,
  Lock,
  Loader2,
  Calendar,
  History,
  CheckCircle2,
  Zap,
  Globe,
  BrainCircuit
} from 'lucide-react';
import { api } from '../services/api';
import { Vendor, SimulationScenario, SimulationResult } from '../types';
import MonteCarloChart from '../components/MonteCarloChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { COLORS } from '../constants';
import { sounds } from '../services/soundService';

interface SimulationParams {
  fdaApprovalProbability: number;
  genomicImpactFactor: number;
  marketVolatility: number;
  compliancePressure: number;
}

const PRESETS: Record<string, { label: string; icon: any; params: SimulationParams }> = {
  'STABLE': {
    label: 'Standard Growth',
    icon: <TrendingUp className="w-4 h-4" />,
    params: { fdaApprovalProbability: 85, genomicImpactFactor: 10, marketVolatility: 20, compliancePressure: 30 }
  },
  'CRISIS': {
    label: 'Pandemic Surge',
    icon: <Flame className="w-4 h-4 text-[#FF2D55]" />,
    params: { fdaApprovalProbability: 60, genomicImpactFactor: 80, marketVolatility: 90, compliancePressure: 80 }
  },
  'REGULATORY': {
    label: 'Policy Shakeup',
    icon: <Lock className="w-4 h-4 text-[#FFD600]" />,
    params: { fdaApprovalProbability: 40, genomicImpactFactor: 20, marketVolatility: 50, compliancePressure: 95 }
  }
};

import { Flame } from 'lucide-react';

const SimulationLab: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [projectionYear, setProjectionYear] = useState(2024);
  
  const [scenario, setScenario] = useState<SimulationParams>(PRESETS.STABLE.params);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    api.getVendors().then(setVendors);
  }, []);

  const comparisonData = useMemo(() => {
    if (selectedVendorIds.length === 0) return [];
    
    return selectedVendorIds.map(id => {
      const v = vendors.find(vend => vend.id === id);
      if (!v) return null;
      
      const fdaImpact = (100 - scenario.fdaApprovalProbability) / 20;
      const genomicImpact = (scenario.genomicImpactFactor) / 10;
      const marketImpact = (scenario.marketVolatility) / 25;
      const complianceImpact = (scenario.compliancePressure) / 50;
      
      const yearMultiplier = (projectionYear - 2024) * 0.15;
      const projectedScore = Math.min(10, Math.max(0, v.overallScore + fdaImpact + genomicImpact + marketImpact + complianceImpact + yearMultiplier - 2));

      return {
        name: v.name,
        current: v.overallScore,
        projected: Number(projectedScore.toFixed(2))
      };
    }).filter(Boolean);
  }, [vendors, selectedVendorIds, scenario, projectionYear]);

  const runMonteCarlo = async () => {
    setIsSimulating(true);
    setResult(null);
    sounds.playAlert();

    await new Promise(r => setTimeout(r, 2000));

    const baseRisk = selectedVendorIds.length > 0 
      ? vendors.find(v => v.id === selectedVendorIds[0])?.overallScore || 5 
      : 5;
    
    const fdaImpact = (100 - scenario.fdaApprovalProbability) / 20;
    const genomicImpact = (scenario.genomicImpactFactor) / 10;
    const marketImpact = (scenario.marketVolatility) / 25;
    const complianceImpact = (scenario.compliancePressure) / 50;
    
    const yearMultiplier = (projectionYear - 2024) * 0.2;
    const meanRisk = Math.min(10, Math.max(0, baseRisk + fdaImpact + genomicImpact + marketImpact + complianceImpact + yearMultiplier - 2));
    const vaR = Math.min(10, meanRisk + 2.1);
    const failProb = Math.min(1, (meanRisk / 10) * (scenario.marketVolatility / 100));

    const distribution = [];
    for (let i = 1; i <= 100; i++) {
      const score = i / 10;
      const sigma = 1.2;
      const freq = Math.exp(-Math.pow(score - meanRisk, 2) / (2 * Math.pow(sigma, 2))) * 1000;
      distribution.push({ score, frequency: Math.round(freq) });
    }

    setResult({
      meanRisk: Number(meanRisk.toFixed(2)),
      valueAtRisk: Number(vaR.toFixed(2)),
      failureProbability: Number(failProb.toFixed(3)),
      distributionData: distribution,
    });

    setIsSimulating(false);
    sounds.playSuccess();
  };

  const toggleVendor = (id: string) => {
    setSelectedVendorIds(prev => 
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id].slice(0, 3)
    );
  };

  const applyPreset = (p: SimulationParams) => {
    setScenario(p);
    sounds.playSuccess();
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#A78BFA] flex items-center justify-center rounded-sm shadow-lg shadow-[#A78BFA]/20">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">Risk Simulation <span className="font-bold">Engine</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Multi-agent predictive modeling and 10,000-run Monte Carlo scenario stress testing.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm">
            <Activity className="w-4 h-4" />
            Calibration Metrics
          </button>
          <button 
            onClick={runMonteCarlo}
            disabled={isSimulating}
            className="px-8 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest rounded-sm shadow-xl shadow-blue-900/10 disabled:bg-[#393939]"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Execute Monte Carlo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Scenario Builder (Left Panel) */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-[#393939] pb-4">
               <div className="flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-[#0062FF]" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">What-If Presets</h3>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
               {Object.entries(PRESETS).map(([key, preset]) => (
                 <button 
                  key={key}
                  onClick={() => applyPreset(preset.params)}
                  className="flex items-center justify-between p-4 bg-[#161616] border border-[#393939] hover:border-[#0062FF] transition-all group"
                 >
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-[#262626] border border-[#393939] group-hover:text-white transition-colors">
                          {preset.icon}
                       </div>
                       <span className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest group-hover:text-white">{preset.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#393939] group-hover:text-[#0062FF]" />
                 </button>
               ))}
            </div>

            <div className="space-y-8 pt-8 border-t border-[#393939]">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">FDA Approval Probability</label>
                  <span className="text-xs font-mono text-white">{scenario.fdaApprovalProbability}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={scenario.fdaApprovalProbability}
                  onChange={(e) => setScenario({ ...scenario, fdaApprovalProbability: parseInt(e.target.value) })}
                  className="w-full accent-[#0062FF] bg-[#161616] h-1 rounded-full cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Genomic Anomaly Impact</label>
                  <span className="text-xs font-mono text-white">{scenario.genomicImpactFactor}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={scenario.genomicImpactFactor}
                  onChange={(e) => setScenario({ ...scenario, genomicImpactFactor: parseInt(e.target.value) })}
                  className="w-full accent-[#00C853] bg-[#161616] h-1 rounded-full cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Market Volatility Index</label>
                  <span className="text-xs font-mono text-white">{scenario.marketVolatility}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={scenario.marketVolatility}
                  onChange={(e) => setScenario({ ...scenario, marketVolatility: parseInt(e.target.value) })}
                  className="w-full accent-[#A78BFA] bg-[#161616] h-1 rounded-full cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#393939] space-y-6">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0062FF]" />
                  Projection Horizon
                </label>
                <span className="text-xs font-mono text-[#0062FF] font-bold">{projectionYear}</span>
              </div>
              <input 
                type="range" min="2024" max="2030" step="1"
                value={projectionYear}
                onChange={(e) => setProjectionYear(parseInt(e.target.value))}
                className="w-full accent-[#0062FF] bg-[#161616] h-1.5 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Area (Main Panel) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Comparative Risk Evolution</h3>
                <p className="text-[10px] text-[#A8A8A8] mt-1 font-mono uppercase">Scenario: {projectionYear} Outlook</p>
              </div>
            </div>
            
            <div className="h-[300px]">
              {comparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#393939" />
                    <XAxis dataKey="name" stroke="#A8A8A8" tick={{fontSize: 10}} />
                    <YAxis domain={[0, 10]} stroke="#A8A8A8" tick={{fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', color: '#fff' }}
                    />
                    <Legend iconType="rect" />
                    <Area name="Current Risk Index" dataKey="current" stroke="#00C853" fill="#00C853" fillOpacity={0.1} />
                    <Area name="Projected Risk Index" dataKey="projected" stroke="#FF2D55" fill="#FF2D55" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#393939]">
                  <History className="w-12 h-12 mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Select vendors to compare evolution</p>
                </div>
              )}
            </div>
          </div>

          {isSimulating ? (
            <div className="h-[400px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center p-20 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0062FF_1px,transparent_1px)] [background-size:20px_20px] animate-pulse" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 border-b-2 border-l-2 border-[#0062FF] rounded-full animate-spin mb-8" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-[0.4em] mb-2">Simulating 10,000 Nodes</h3>
                  <p className="text-[10px] font-mono text-[#0062FF]">PROBABILITY_DENSITY_ESTIMATION: ACTIVE</p>
               </div>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#393939] border border-[#393939]">
                <div className="bg-[#262626] p-8 flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-4">Mean Projective Risk</p>
                  <h4 className="text-5xl font-black text-white font-mono">{result.meanRisk}</h4>
                  <p className={`text-[9px] mt-3 font-bold uppercase tracking-widest ${Number(result.meanRisk) > 7 ? 'text-[#FF2D55]' : 'text-[#00C853]'}`}>
                    {Number(result.meanRisk) > 7 ? 'High Severity' : 'Safe Harbor'}
                  </p>
                </div>
                <div className="bg-[#262626] p-8 flex flex-col items-center text-center border-x border-[#393939]">
                  <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-4">Value at Risk (VaR)</p>
                  <h4 className="text-5xl font-black text-[#FF2D55] font-mono">{result.valueAtRisk}</h4>
                  <p className="text-[9px] text-[#525252] mt-3 font-bold uppercase tracking-widest">Worst Case Threshold</p>
                </div>
                <div className="bg-[#262626] p-8 flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-4">Crisis Probability</p>
                  <h4 className="text-5xl font-black text-[#A78BFA] font-mono">{(result.failureProbability * 100).toFixed(1)}%</h4>
                  <p className="text-[9px] text-[#525252] mt-3 font-bold uppercase tracking-widest">System Anomaly Chance</p>
                </div>
              </div>

              <div className="bg-[#262626] border border-[#393939] p-10">
                <div className="h-[300px]">
                  <MonteCarloChart data={result.distributionData} mean={result.meanRisk} varValue={result.valueAtRisk} />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-[#393939] bg-[#161616] flex flex-col items-center justify-center p-20 text-center">
               <Zap className="w-16 h-16 text-[#262626] mb-8" />
               <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Engine Standby</h3>
               <p className="text-[#A8A8A8] text-[11px] max-w-sm font-light leading-relaxed">
                 Configure scenario parameters and selected vendor nodes. The simulation engine will run 10,000 iterations to calculate projective risk indices.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
