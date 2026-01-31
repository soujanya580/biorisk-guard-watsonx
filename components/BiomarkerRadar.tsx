
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface BiomarkerRadarProps {
  data?: {
    biomarker: string;
    value: number;
    normal: number;
  }[];
}

const BiomarkerRadar: React.FC<BiomarkerRadarProps> = ({ 
  data = [
    { biomarker: 'CA-125', value: 85, normal: 35 },
    { biomarker: 'CEA', value: 12, normal: 3 },
    { biomarker: 'PSA', value: 4.5, normal: 4.0 },
    { biomarker: 'AFP', value: 15, normal: 10 },
    { biomarker: 'CA19-9', value: 45, normal: 37 },
    { biomarker: 'LDH', value: 280, normal: 240 }
  ]
}) => {
  // Normalize values for visualization (percentage of risk threshold)
  const normalizedData = data.map(d => ({
    ...d,
    A: (d.value / (d.normal * 1.5)) * 100, // Normalized user value
    B: (d.normal / (d.normal * 1.5)) * 100 // Normalized baseline
  }));

  return (
    <div className="w-full h-full bg-[#161616] border border-[#393939] p-6 relative">
      <div className="absolute top-6 left-6 z-10">
        <h4 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-1">Oncology Biomarkers</h4>
        <p className="text-[9px] text-[#0062FF] font-mono tracking-widest uppercase">Node: SERUM_ANALYZER_7</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={normalizedData}>
          <PolarGrid stroke="#262626" />
          <PolarAngleAxis dataKey="biomarker" tick={{ fill: '#A8A8A8', fontSize: 10, fontWeight: 700 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          
          <Radar
            name="Normal Threshold"
            dataKey="B"
            stroke="#393939"
            fill="#393939"
            fillOpacity={0.2}
          />
          <Radar
            name="Vendor Data"
            dataKey="A"
            stroke="#0062FF"
            fill="#0062FF"
            fillOpacity={0.4}
            animationDuration={1500}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', color: '#fff', fontSize: '10px' }}
            itemStyle={{ color: '#0062FF' }}
            formatter={(value: any, name: string) => [`${value.toFixed(1)}% of baseline`, name]}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4 border-t border-[#393939] pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#0062FF]/40 border border-[#0062FF]" />
          <span className="text-[9px] text-[#A8A8A8] uppercase tracking-widest">Target Serum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#393939]/40 border border-[#393939]" />
          <span className="text-[9px] text-[#A8A8A8] uppercase tracking-widest">Baseline Control</span>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerRadar;
