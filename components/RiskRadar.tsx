
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RiskRadarProps {
  scores: {
    compliance: number;
    genomic: number;
    financial: number;
    security: number;
    operational: number;
  };
}

const RiskRadar: React.FC<RiskRadarProps> = ({ scores }) => {
  const data = [
    { subject: 'Compliance', A: scores.compliance, fullMark: 10 },
    { subject: 'Genomic', A: scores.genomic, fullMark: 10 },
    { subject: 'Financial', A: scores.financial, fullMark: 10 },
    { subject: 'Security', A: scores.security, fullMark: 10 },
    { subject: 'Operational', A: scores.operational, fullMark: 10 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Risk Level"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskRadar;
