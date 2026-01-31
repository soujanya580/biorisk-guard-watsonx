
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MonteCarloChartProps {
  data: { score: number; frequency: number }[];
  mean: number;
  varValue: number;
}

const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ data, mean, varValue }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0062FF" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#0062FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="score" 
            stroke="#393939" 
            tick={{ fill: '#A8A8A8', fontSize: 10 }}
            label={{ value: 'Risk Score (1-10)', position: 'insideBottom', offset: -5, fill: '#525252', fontSize: 9 }}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', fontSize: '10px', color: '#fff' }}
            itemStyle={{ color: '#0062FF' }}
            formatter={(value: any) => [value, 'Occurrences']}
          />
          <Area 
            type="monotone" 
            dataKey="frequency" 
            stroke="#0062FF" 
            fillOpacity={1} 
            fill="url(#colorFreq)" 
            strokeWidth={2}
          />
          <ReferenceLine x={mean} stroke="#00C853" strokeDasharray="3 3" label={{ value: 'Mean', fill: '#00C853', fontSize: 9, position: 'top' }} />
          <ReferenceLine x={varValue} stroke="#FF2D55" strokeDasharray="3 3" label={{ value: 'VaR', fill: '#FF2D55', fontSize: 9, position: 'top' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonteCarloChart;
