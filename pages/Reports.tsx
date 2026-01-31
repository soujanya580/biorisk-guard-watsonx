
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Report, Vendor, ReportType } from '../types';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedType, setSelectedType] = useState<ReportType>('FULL_RISK');

  useEffect(() => {
    const unsubscribeReports = api.subscribeToReports(setReports);
    api.getVendors().then(setVendors);
    return unsubscribeReports;
  }, []);

  const filteredReports = reports.filter(r => 
    r.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedVendorId) return;
    setIsGenerating(true);
    try {
      await api.createReport(selectedVendorId, selectedType);
      setShowGenModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this audit report?')) {
      api.deleteReport(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (r: Report) => {
    alert(`Mock: Link copied for ${r.vendorName} audit report.`);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Vendor,Type,Date,RiskScore,Status\n"
      + reports.map(r => `${r.id},${r.vendorName},${r.type},${r.date},${r.riskScore},${r.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `biorisk_audit_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Audit <span className="font-bold">Documentation Vault</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Authorized risk reports, compliance filings, and forensic audit trails.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportCSV}
            className="px-5 py-2.5 border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowGenModal(true)}
            className="px-6 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-blue-900/10"
          >
            <Plus className="w-4 h-4" />
            Generate Audit
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#262626] p-4 border border-[#393939]">
        <div className="flex gap-4 items-center flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A8A8]" />
            <input 
              type="text" 
              placeholder="Filter by vendor or report type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161616] border border-[#393939] pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#0062FF] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#161616] border border-[#393939] px-3 py-2 text-[#A8A8A8]">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Last 30 Days</span>
          </div>
        </div>
        <div className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">
          {filteredReports.length} Documented Audits
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="group bg-[#262626] border border-[#393939] p-6 hover:border-[#0062FF] transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#161616] border border-[#393939] text-[#0062FF] group-hover:bg-[#0062FF] group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ${
                  report.status === 'COMPLETED' ? 'bg-[#00C853]/10 text-[#00C853]' : 'bg-[#393939] text-[#A8A8A8]'
                }`}>
                  {report.status}
                </span>
                <p className="text-[10px] text-[#A8A8A8] font-mono mt-2">{report.date}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 truncate">{report.vendorName}</h3>
            <p className="text-[10px] text-[#0062FF] font-mono mb-4 uppercase tracking-widest">{report.type.replace('_', ' ')}</p>

            <div className="mt-auto pt-6 border-t border-[#393939] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#A8A8A8] font-bold uppercase tracking-widest">Risk Index:</span>
                <span className={`text-xs font-bold font-mono ${report.riskScore > 7 ? 'text-[#FF2D55]' : 'text-white'}`}>{report.riskScore}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="p-2 text-[#393939] hover:text-white transition-colors" title="Print">
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleShare(report)}
                  className="p-2 text-[#393939] hover:text-white transition-colors" title="Share">
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-[#393939] hover:text-[#FF2D55] transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
                <a 
                  href={report.downloadUrl}
                  className="p-2 text-[#A8A8A8] hover:text-[#00C853] transition-colors" title="Download PDF">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
        {filteredReports.length === 0 && (
          <div className="col-span-full py-32 text-center uppercase tracking-[0.3em] text-[#393939] font-mono italic border border-dashed border-[#393939]">
            No archived documentation found
          </div>
        )}
      </div>

      {/* Generation Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#161616]/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#262626] border border-[#393939] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-[#393939] pb-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#0062FF]" />
                  Generate Audit Report
                </h3>
                <button onClick={() => setShowGenModal(false)} className="text-[#A8A8A8] hover:text-white font-mono">X</button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Select Target Entity</label>
                  <select 
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm appearance-none"
                  >
                    <option value="">-- NO ENTITY SELECTED --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Report Complexity</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['FULL_RISK', 'COMPLIANCE', 'GENOMIC_AUDIT', 'FISCAL_STABILITY'] as ReportType[]).map(type => (
                      <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`p-3 border text-[10px] font-bold uppercase tracking-tighter text-left flex justify-between items-center transition-all ${
                          selectedType === type ? 'bg-[#0062FF] border-[#0062FF] text-white' : 'bg-[#161616] border-[#393939] text-[#A8A8A8] hover:border-[#0062FF]'
                        }`}
                      >
                        {type.replace('_', ' ')}
                        {selectedType === type && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!selectedVendorId || isGenerating}
                className="w-full py-4 bg-[#0062FF] hover:bg-[#0052cc] disabled:bg-[#393939] disabled:text-[#A8A8A8] text-white font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 rounded-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finalizing Logic
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Dispatch Report Generation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
