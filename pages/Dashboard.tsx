import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { 
  Plus, 
  FileText, 
  MoreVertical,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_STATS, RISK_DISTRIBUTION, MOCK_VENDORS, COLORS } from '../constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-500 transition-all">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#161616] via-[#1a1a1a] to-[#262626] border border-[#393939] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0062FF]/10 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#0062FF]/20 text-[#0062FF] text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-[#0062FF]/30">ERCA Node V2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
            <span className="text-[10px] text-[#A8A8A8] font-mono">SYSTEM_STATUS: NOMINAL</span>
          </div>
          <h1 className="text-5xl font-light text-white tracking-tight mb-2">
            BioRisk <span className="font-bold">Guard</span>
          </h1>
          <p className="text-xl text-[#A8A8A8] font-light max-w-2xl mb-8">
            Enterprise-grade autonomous risk management for the modern healthcare and biotech supply chain.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/assessments')}
              className="px-6 py-3 bg-[#0062FF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0052cc] transition-all flex items-center gap-3 rounded-sm shadow-xl shadow-blue-900/20"
            >
              <Plus className="w-4 h-4" />
              New Assessment
            </button>
            <button 
              onClick={() => navigate('/audit')}
              className="px-6 py-3 border border-[#00C853]/30 bg-[#00C853]/5 text-[#00C853] text-xs font-bold uppercase tracking-widest hover:bg-[#00C853]/10 transition-all flex items-center gap-3 rounded-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Blockchain Explorer
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="px-6 py-3 border border-[#393939] text-[#F4F4F4] text-xs font-bold uppercase tracking-widest hover:bg-[#262626] transition-all flex items-center gap-3 rounded-sm"
            >
              <FileText className="w-4 h-4" />
              Audit Vault
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#393939] border border-[#393939]">
        {DASHBOARD_STATS.map((stat, i) => (
          <div key={i} className="bg-[#161616] p-8 hover:bg-[#1c1c1c] transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div 
                className="p-3 bg-[#262626] border border-[#393939] group-hover:border-opacity-100 transition-colors"
                style={{ color: stat.color, borderColor: `${stat.color}33` }}
              >
                {stat.icon}
              </div>
              <div className={`text-[10px] font-mono font-bold px-2 py-1 ${
                stat.trend.includes('+') ? 'text-[#FF2D55] bg-[#FF2D55]/10' : 
                stat.trend.includes('-') ? 'text-[#00C853] bg-[#00C853]/10' : 
                'text-[#A8A8A8] bg-[#262626]'
              }`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-[#A8A8A8] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-4xl font-semibold text-white tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Risk Distribution Chart */}
        <div className="lg:col-span-5 bg-[#262626] border border-[#393939] p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-[#F4F4F4] text-sm uppercase tracking-widest">Risk Distribution</h3>
              <p className="text-[11px] text-[#A8A8A8] mt-1 font-mono">METRIC_ID: GLOBAL_RISK_MAP</p>
            </div>
          </div>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', border: '1px solid #393939', borderRadius: '0px', fontSize: '12px' }}
                  itemStyle={{ color: '#F4F4F4' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="rect"
                  formatter={(value) => <span className="text-[10px] font-mono uppercase text-[#A8A8A8] px-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-[#393939] grid grid-cols-3 gap-4">
            {RISK_DISTRIBUTION.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-1">{item.name}</p>
                <p className="text-xl font-bold text-white font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessments Table */}
        <div className="lg:col-span-7 bg-[#262626] border border-[#393939] p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-[#F4F4F4] text-sm uppercase tracking-widest">Recent Assessments</h3>
              <p className="text-[11px] text-[#A8A8A8] mt-1 font-mono">ERCA_LOG_SESSION: 48A-92B</p>
            </div>
            <button 
              onClick={() => navigate('/vendors')}
              className="text-[10px] font-bold uppercase text-[#0062FF] tracking-widest hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#393939]">
                  <th className="py-4 px-2 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Vendor Entity</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Risk Score</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Status</th>
                  <th className="py-4 px-2 text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#393939]">
                {MOCK_VENDORS.slice(0, 5).map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className="group hover:bg-[#161616]/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white group-hover:text-[#0062FF] transition-colors">{vendor.name}</span>
                        <span className="text-[10px] text-[#A8A8A8] uppercase tracking-wider font-mono">{vendor.industry}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[#161616] rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000" 
                            style={{ 
                              width: `${vendor.overallScore * 10}%`,
                              backgroundColor: vendor.overallScore > 7 ? COLORS.DANGER : vendor.overallScore > 4 ? COLORS.WARNING : COLORS.HEALTHCARE_GREEN
                            }} 
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-white">{vendor.overallScore}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[9px] font-bold px-2 py-1 uppercase tracking-tighter ${
                        vendor.status === 'ACTIVE' ? 'bg-[#00C853]/10 text-[#00C853]' : 
                        vendor.status === 'PENDING' ? 'bg-[#FFD600]/10 text-[#FFD600]' : 
                        'bg-[#FF2D55]/10 text-[#FF2D55]'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#393939] hover:text-[#0062FF] transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#393939] hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;