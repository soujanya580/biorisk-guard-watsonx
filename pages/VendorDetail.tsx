
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Activity, 
  History, 
  Trash2, 
  Edit3,
  AlertTriangle,
  Globe,
  Mail,
  Dna,
  ChevronRight,
  Loader2,
  Wrench
} from 'lucide-react';
import { COLORS } from '../constants';
import { Vendor, MultiAgentRiskReport } from '../types';
import { api } from '../services/api';
import RiskRadar from '../components/RiskRadar';

const VendorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [report, setReport] = useState<MultiAgentRiskReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const [vData, rData] = await Promise.all([
        api.getVendorById(id),
        api.getReportByVendorId(id)
      ]);
      setVendor(vData || null);
      setReport(rData || null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleGenerateReport = async () => {
    if (!id) return;
    setIsGenerating(true);
    try {
      await api.createReport(id, 'FULL_RISK');
      navigate('/reports');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-40">
        <Loader2 className="w-12 h-12 text-[#0062FF] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-20 text-center uppercase tracking-[0.3em] text-[#393939] font-mono">
        Entity Not Found in Cluster
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <header className="flex items-center justify-between border-b border-[#393939] pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/vendors')}
            className="p-3 bg-[#262626] border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold text-white tracking-tight">{vendor.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm ${
                vendor.status === 'ACTIVE' ? 'bg-[#00C853]/10 text-[#00C853]' : 
                vendor.status === 'PENDING' ? 'bg-[#FFD600]/10 text-[#FFD600]' : 
                'bg-[#FF2D55]/10 text-[#FF2D55]'
              }`}>
                {vendor.status}
              </span>
            </div>
            <p className="text-[#A8A8A8] text-sm font-mono flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> healthcare-node-0{id}.internal</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> compliance@{vendor.name.toLowerCase().replace(/\s/g, '')}.com</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/mitigation', { state: { vendorId: vendor.id } })}
            className="px-6 py-3 border border-[#00C853]/30 bg-[#00C853]/5 text-[#00C853] text-xs font-bold uppercase tracking-widest hover:bg-[#00C853]/10 transition-all flex items-center gap-3 rounded-sm"
          >
            <Wrench className="w-4 h-4" />
            Mitigation Plan
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-6 py-3 border border-[#393939] text-[#F4F4F4] text-xs font-bold uppercase tracking-widest hover:bg-[#262626] transition-all flex items-center gap-3 rounded-sm"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Report
          </button>
          <button className="p-3 border border-[#393939] text-[#A8A8A8] hover:text-white hover:bg-[#262626] transition-all rounded-sm">
            <Edit3 className="w-5 h-5" />
          </button>
          <button className="p-3 border border-[#393939] text-[#A8A8A8] hover:text-[#FF2D55] hover:bg-red-500/10 transition-all rounded-sm">
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/assessments')}
            className="px-6 py-3 bg-[#0062FF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0052cc] transition-all rounded-sm shadow-xl shadow-blue-900/20"
          >
            Re-Assess Entity
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Risk Summary Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8">
            <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-8">Risk Index Profile</h3>
            <div className="h-64 mb-10">
               <RiskRadar scores={{
                 compliance: report?.complianceAgent.score || 5,
                 genomic: report?.genomicAgent.score || vendor.overallScore,
                 financial: report?.financialAgent.score || 4,
                 security: 6,
                 operational: 3
               }} />
            </div>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Aggregate Risk Level</span>
                    <span className={`text-xl font-bold font-mono ${vendor.overallScore > 7 ? 'text-[#FF2D55]' : 'text-[#00C853]'}`}>{vendor.overallScore}/10</span>
                  </div>
                  <div className="w-full h-2 bg-[#161616] rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        width: `${vendor.overallScore * 10}%`,
                        backgroundColor: vendor.overallScore > 7 ? COLORS.DANGER : COLORS.HEALTHCARE_GREEN
                      }} 
                    />
                  </div>
               </div>
               {vendor.overallScore > 7 && (
                 <div className="bg-[#161616] p-4 border-l-2 border-[#FF2D55] flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-[#FF2D55] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">ERCA CRITICAL STATUS</p>
                      <p className="text-[11px] text-[#A8A8A8] leading-relaxed">Entity shows higher-than-average genomic bias patterns. Deep inspection required.</p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div className="bg-[#262626] border border-[#393939] p-8">
            <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-6">Historical Baseline</h3>
            <div className="space-y-4">
              {[
                { date: vendor.lastAnalysis, score: vendor.overallScore, status: 'Completed' },
                { date: '2023-12-15', score: (vendor.overallScore - 1.2).toFixed(1), status: 'Archived' }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#393939] last:border-0 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <History className="w-3.5 h-3.5 text-[#393939] group-hover:text-[#0062FF]" />
                    <span className="text-xs font-mono text-[#A8A8A8]">{h.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-white font-mono">{h.score}</span>
                    <ChevronRight className="w-3 h-3 text-[#393939]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="bg-[#262626] border border-[#393939] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#161616] border border-[#393939] text-[#0062FF]"><ShieldCheck className="w-5 h-5" /></div>
                  <h3 className="font-bold text-[#F4F4F4] text-xs uppercase tracking-[0.2em]">Administrative Profile</h3>
                </div>
                <dl className="grid grid-cols-1 gap-y-6">
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Entity Classification</dt>
                    <dd className="text-sm text-white font-mono">{vendor.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Onboarding Date</dt>
                    <dd className="text-sm text-white font-mono">January 12, 2024</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">GDPR Compliance ID</dt>
                    <dd className="text-sm text-[#0062FF] font-mono underline decoration-[#0062FF]/30 underline-offset-4">GDPR-B-2024-0{id}</dd>
                  </div>
                </dl>
              </div>

              {/* Genomic Card */}
              <div className="bg-[#262626] border border-[#393939] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#161616] border border-[#393939] text-[#00C853]"><Dna className="w-5 h-5" /></div>
                  <h3 className="font-bold text-[#F4F4F4] text-xs uppercase tracking-[0.2em]">Genomic Protocol State</h3>
                </div>
                <dl className="grid grid-cols-1 gap-y-6">
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Bias Detection Version</dt>
                    <dd className="text-sm text-white font-mono">GenoSym-AI Node 4.2</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Last Sample Integrity</dt>
                    <dd className="text-sm text-[#00C853] font-mono">99.98% VERIFIED</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Active Bio-Signatures</dt>
                    <dd className="text-sm text-white font-mono tracking-tighter overflow-hidden truncate">0xAF923...293B</dd>
                  </div>
                </dl>
              </div>
           </div>

           {/* Documents Section */}
           <div className="bg-[#262626] border border-[#393939] p-8">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    {/* Fix: Added missing closing quote for className */}
                    <FileText className="w-5 h-5 text-[#A8A8A8]" />
                    <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Verified Documentation Cluster</h3>
                 </div>
                 <button className="text-[10px] font-bold uppercase text-[#0062FF] hover:text-white tracking-widest transition-colors">Manage Vault</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { name: 'Master Services Agreement', type: 'PDF', size: '2.4 MB' },
                   { name: 'HIPAA Business Assoc. Agreement', type: 'PDF', size: '1.1 MB' },
                   { name: 'Security Audit - Q1 2024', type: 'DOCX', size: '4.8 MB' },
                   { name: 'Data Privacy Impact Assess.', type: 'PDF', size: '3.2 MB' }
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-[#161616] border border-[#393939] group hover:border-[#0062FF] transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-[#262626] text-[#393939] group-hover:text-[#0062FF] transition-colors"><FileText className="w-4 h-4" /></div>
                         <div>
                            <p className="text-xs font-semibold text-white">{doc.name}</p>
                            <p className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">{doc.type} • {doc.size}</p>
                         </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#393939] group-hover:text-white transition-colors" />
                   </div>
                 ))}
              </div>
           </div>

           {/* Metrics Graph Placeholder */}
           <div className="bg-[#262626] border border-[#393939] p-8">
              <div className="flex items-center gap-3 mb-8">
                <Activity className="w-5 h-5 text-[#0062FF]" />
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em]">Real-time Transaction Telemetry</h3>
              </div>
              <div className="h-40 bg-[#161616] border border-[#393939] flex items-center justify-center p-10 relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0062FF_1px,transparent_1px)] [background-size:20px_20px]" />
                 <p className="text-[10px] text-[#393939] font-mono uppercase tracking-[0.3em] group-hover:text-[#0062FF] transition-colors">Awaiting Telemetry Stream...</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
