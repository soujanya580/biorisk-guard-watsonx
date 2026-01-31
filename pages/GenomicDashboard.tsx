
import React, { useState } from 'react';
import { 
  Dna, 
  Activity, 
  TrendingUp, 
  Download, 
  Search, 
  Cpu, 
  FlaskConical,
  Database,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DNAHelix from '../components/DNAHelix';
import BiomarkerRadar from '../components/BiomarkerRadar';

const TIMELINE_DATA = [
  { year: '2020', mutations: 2, predicted: 2 },
  { year: '2021', mutations: 5, predicted: 5 },
  { year: '2022', mutations: 9, predicted: 9 },
  { year: '2023', mutations: 14, predicted: 15 },
  { year: '2024', mutations: 18, predicted: 22 },
  { year: '2025 (P)', predicted: 31 },
  { year: '2026 (P)', predicted: 45 },
];

const GenomicDashboard: React.FC = () => {
  const [activeMutation, setActiveMutation] = useState<string | null>(null);

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#00C853] flex items-center justify-center rounded-sm shadow-lg shadow-[#00C853]/20">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight">Bio-Visualization <span className="font-bold">Lab</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Advanced genomic forensics and biomarker predictive modeling.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm">
            <Database className="w-4 h-4" />
            Sync Cluster Data
          </button>
          <button className="px-5 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm shadow-xl shadow-blue-900/10">
            <Zap className="w-4 h-4" />
            Run Predictive Sweep
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Visualization Area */}
        <div className="xl:col-span-8 space-y-8">
          <div className="h-[600px]">
            <DNAHelix />
          </div>

          <div className="bg-[#262626] border border-[#393939] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Mutation Accumulation & Projection</h3>
                <p className="text-[10px] text-[#A8A8A8] mt-1 font-mono">MODEL: LSTM_BIO_GEN_V4</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0062FF]" />
                  <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">Observed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-dashed border-[#FF2D55]" />
                  <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">AI Projected</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TIMELINE_DATA}>
                  <defs>
                    <linearGradient id="colorMut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0062FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0062FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF2D55" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                  <XAxis dataKey="year" stroke="#393939" tick={{ fill: '#A8A8A8', fontSize: 10 }} />
                  <YAxis stroke="#393939" tick={{ fill: '#A8A8A8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', fontSize: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="mutations" stroke="#0062FF" fillOpacity={1} fill="url(#colorMut)" strokeWidth={2} />
                  <Area type="monotone" dataKey="predicted" stroke="#FF2D55" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Panel: Biomarkers & Insights */}
        <div className="xl:col-span-4 space-y-8">
          <div className="h-[450px]">
            <BiomarkerRadar />
          </div>

          <div className="bg-[#161616] border border-[#393939] p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-[#393939] pb-4">
              <ShieldCheck className="w-5 h-5 text-[#00C853]" />
              <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Forensic Gene Log</h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {[
                { gene: 'BRCA1', id: 'rs28897672', type: 'Pathogenic', color: 'bg-[#FF2D55]' },
                { gene: 'TP53', id: 'rs28934571', type: 'Loss of Function', color: 'bg-[#FF2D55]' },
                { gene: 'PTEN', id: 'rs121909224', type: 'Structural', color: 'bg-[#FFD600]' },
                { gene: 'MLH1', id: 'rs63750818', type: 'Lynch Syndrome', color: 'bg-[#00C853]' },
                { gene: 'MSH2', id: 'rs63750821', type: 'Stable', color: 'bg-[#00C853]' },
              ].map((item, i) => (
                <div key={i} className="bg-[#262626] border border-[#393939] p-4 group hover:border-white transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      <span className="text-sm font-bold text-white tracking-wide">{item.gene}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#525252]">{item.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#A8A8A8] uppercase tracking-widest">{item.type}</span>
                    <ChevronRight className="w-3 h-3 text-[#393939] group-hover:text-white" />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-[#262626] border border-[#393939] text-[#A8A8A8] text-[10px] font-bold uppercase tracking-widest hover:bg-[#393939] hover:text-white transition-all flex items-center justify-center gap-3 rounded-sm">
              <Download className="w-4 h-4" />
              Export Genomic Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenomicDashboard;
