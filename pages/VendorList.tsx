
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  MoreVertical,
  ChevronRight,
  Download,
  Loader2
} from 'lucide-react';
import { COLORS } from '../constants';
import { Vendor } from '../types';
import { api } from '../services/api';

const VendorList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      const data = await api.getVendors();
      setVendors(data);
      setLoading(false);
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-10 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Enterprise <span className="font-bold">Vendor Directory</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Manage and monitor high-risk third-party healthcare entities.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm">
            <Download className="w-4 h-4" />
            Export Directory
          </button>
          <button 
            onClick={() => navigate('/vendors/add')}
            className="px-5 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            <Plus className="w-4 h-4" />
            Onboard Vendor
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
              placeholder="Search by name, industry, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161616] border border-[#393939] pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#0062FF] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#161616] border border-[#393939] px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-[#A8A8A8]" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase text-[#A8A8A8] outline-none tracking-widest"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        <div className="text-[10px] text-[#A8A8A8] font-mono">
          DISPLAYING {filteredVendors.length} OF {vendors.length} NODES
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex items-center justify-center">
           <Loader2 className="w-10 h-10 text-[#0062FF] animate-spin" />
        </div>
      ) : (
        <div className="border border-[#393939] divide-y divide-[#393939] bg-[#262626]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#161616] text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em]">
            <div className="col-span-4">Vendor Entity</div>
            <div className="col-span-2 text-center">Industry</div>
            <div className="col-span-2 text-center">Risk Index</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {filteredVendors.length > 0 ? filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-[#1c1c1c] transition-colors cursor-pointer group"
              onClick={() => navigate(`/vendors/${vendor.id}`)}
            >
              <div className="col-span-4 flex items-center gap-4">
                <div className={`w-1 h-8 rounded-sm ${vendor.overallScore > 7 ? 'bg-[#FF2D55]' : vendor.overallScore > 4 ? 'bg-[#FFD600]' : 'bg-[#00C853]'}`} />
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#0062FF] transition-colors">{vendor.name}</p>
                  <p className="text-[10px] text-[#A8A8A8] font-mono mt-0.5 uppercase tracking-tighter">ID: VEND-00{vendor.id}</p>
                </div>
              </div>
              <div className="col-span-2 text-center text-xs text-[#A8A8A8] font-mono">{vendor.industry}</div>
              <div className="col-span-2 flex items-center justify-center gap-3">
                <div className="w-20 h-1 bg-[#161616] rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500" 
                    style={{ 
                      width: `${vendor.overallScore * 10}%`,
                      backgroundColor: vendor.overallScore > 7 ? COLORS.DANGER : vendor.overallScore > 4 ? COLORS.WARNING : COLORS.HEALTHCARE_GREEN
                    }} 
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white">{vendor.overallScore}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-tighter rounded-sm ${
                  vendor.status === 'ACTIVE' ? 'bg-[#00C853]/10 text-[#00C853]' : 
                  vendor.status === 'PENDING' ? 'bg-[#FFD600]/10 text-[#FFD600]' : 
                  'bg-[#FF2D55]/10 text-[#FF2D55]'
                }`}>
                  {vendor.status}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button className="p-2 text-[#393939] hover:text-[#0062FF] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#393939] hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center uppercase tracking-[0.3em] text-[#393939] font-mono italic">
              No entities found matching criteria
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-[10px] text-[#393939] font-mono uppercase tracking-widest pt-4">
        <span>ERCA DIRECTORY CLUSTER VERSION 2.4.0</span>
        <div className="flex gap-4">
          <button className="hover:text-white transition-colors">Previous</button>
          <span className="text-white">1</span>
          <button className="hover:text-white transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default VendorList;
