
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Dna, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

interface VendorFormData {
  name: string;
  industry: string;
  contactEmail: string;
  description: string;
  genomicDataSample: string;
}

const AddVendor: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<VendorFormData>();

  const onSubmit = async (data: VendorFormData) => {
    setIsSubmitting(true);
    try {
      await api.createVendor({
        name: data.name,
        industry: data.industry,
      });
      setIsComplete(true);
      setTimeout(() => navigate('/vendors'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#00C853]/10 border border-[#00C853]/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#00C853]" />
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">Entity Onboarded</h2>
        <p className="text-[#A8A8A8] font-light">ERCA Autopilot sequence has been scheduled for initial vetting.</p>
        <p className="text-[10px] text-[#393939] font-mono mt-10 uppercase tracking-[0.2em]">Redirecting to Directory...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/vendors')}
          className="p-3 bg-[#262626] border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Onboard <span className="font-bold">New Entity</span></h1>
          <p className="text-[#A8A8A8] text-sm mt-1">Register a healthcare vendor for ERCA risk orchestration.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section: Basic Information */}
        <div className="bg-[#262626] border border-[#393939] overflow-hidden">
          <div className="bg-[#161616] px-6 py-3 border-b border-[#393939] flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#0062FF]" />
            <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em]">Administrative Data</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Legal Name</label>
              <input 
                {...register("name", { required: true })}
                type="text" 
                placeholder="e.g., PharmaLogic Global"
                className={`w-full bg-[#161616] border ${errors.name ? 'border-[#FF2D55]' : 'border-[#393939]'} px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm`}
              />
              {errors.name && <span className="text-[10px] text-[#FF2D55] font-bold uppercase">Field Required</span>}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Industry Classification</label>
              <select 
                {...register("industry", { required: true })}
                className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-[#A8A8A8] focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm uppercase"
              >
                <option value="Biotech">Biotech</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Genomics">Genomics</option>
                <option value="Cloud Services">Cloud Services</option>
                <option value="Diagnostics">Diagnostics</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Point of Contact (Encrypted)</label>
              <input 
                {...register("contactEmail", { required: true, pattern: /^\S+@\S+$/i })}
                type="email" 
                placeholder="compliance@vendor.com"
                className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section: Genomic Data Strategy */}
        <div className="bg-[#262626] border border-[#393939] overflow-hidden">
          <div className="bg-[#161616] px-6 py-3 border-b border-[#393939] flex items-center gap-3">
            <Dna className="w-4 h-4 text-[#00C853]" />
            <h3 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em]">Genomic Protocol Assets</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="bg-[#161616] border-2 border-dashed border-[#393939] p-10 flex flex-col items-center justify-center group hover:border-[#0062FF] transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-[#393939] group-hover:text-[#0062FF] mb-4 transition-colors" />
                <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Contract / GDPR Documentation</p>
                <p className="text-[10px] text-[#393939] font-mono">PDF, DOCX (MAX 50MB)</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">GenoSym-AI Raw Input (Optional Sample)</label>
              <textarea 
                {...register("genomicDataSample")}
                rows={5}
                placeholder="Paste encrypted genomic sequences or data schema for bias detection analysis..."
                className="w-full bg-[#161616] border border-[#393939] px-4 py-3 text-white focus:outline-none focus:border-[#0062FF] transition-all resize-none font-mono text-xs"
              />
              <div className="flex items-start gap-2 text-[10px] text-[#A8A8A8] bg-[#161616] p-3 border-l-2 border-[#FFD600]">
                <AlertCircle className="w-3.5 h-3.5 text-[#FFD600] flex-shrink-0" />
                <span>Inputting PII genomic data without ERCA encryption active may violate local compliance mandates.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-6">
          <button 
            type="button"
            onClick={() => navigate('/vendors')}
            className="px-8 py-3 border border-[#393939] text-[#A8A8A8] text-xs font-bold uppercase tracking-widest hover:bg-[#262626] hover:text-white transition-all rounded-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-[#0062FF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0052cc] transition-all flex items-center gap-3 rounded-sm disabled:bg-[#393939] shadow-xl shadow-blue-900/10"
          >
            {isSubmitting ? <><Cpu className="w-4 h-4 animate-spin" /> Provisioning Node</> : "Onboard Entity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVendor;
