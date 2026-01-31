
import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Zap, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  FileText, 
  Loader2,
  Monitor,
  Printer,
  Share2,
  Calculator,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { generatePitchDeck } from '../services/geminiService';
import { Vendor, PitchDeck, AudienceType, Slide } from '../types';

const PitchGenerator: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [audience, setAudience] = useState<AudienceType>('BOARD');
  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getVendors().then(setVendors);
  }, []);

  const handleGenerate = async () => {
    if (!selectedVendorId) return;
    setIsLoading(true);
    setDeck(null);
    try {
      const report = await api.getReportByVendorId(selectedVendorId);
      if (!report) throw new Error("Entity forensics not found. Run a risk assessment first.");
      const newDeck = await generatePitchDeck(report, audience);
      setDeck(newDeck);
      setCurrentSlide(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const audiences: { value: AudienceType; label: string; icon: React.ReactNode }[] = [
    { value: 'BOARD', label: 'Board of Directors', icon: <Users className="w-4 h-4" /> },
    { value: 'INSURANCE', label: 'Insurance Underwriters', icon: <ShieldCheck className="w-4 h-4" /> },
    { value: 'REGULATOR', label: 'Regulatory Bodies', icon: <Target className="w-4 h-4" /> },
    { value: 'ACQUIRER', label: 'Strategic Acquirers', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#0062FF] flex items-center justify-center rounded-sm shadow-lg shadow-[#0062FF]/20">
            <Presentation className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase italic">Pitch <span className="font-bold">Architect AI</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Transform complex bio-risk forensics into executive-ready strategic decks.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Sponsor Node</label>
            <select 
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none font-mono"
            >
              <option value="">-- SELECT CLUSTER --</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={!selectedVendorId || isLoading}
            className="px-8 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest rounded-sm disabled:bg-[#393939]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Monitor className="w-4 h-4" />}
            Synthesize Presentation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Configuration Sidebar */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-8 space-y-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-[#393939] pb-4">Audience Personalization</h3>
            <div className="space-y-3">
              {audiences.map((aud) => (
                <button
                  key={aud.value}
                  onClick={() => setAudience(aud.value)}
                  className={`w-full p-4 flex items-center gap-4 border transition-all text-left group ${
                    audience === aud.value ? 'bg-[#0062FF]/10 border-[#0062FF] text-white' : 'bg-[#161616] border-[#393939] text-[#A8A8A8] hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 transition-colors ${audience === aud.value ? 'text-[#0062FF]' : 'text-[#393939] group-hover:text-[#A8A8A8]'}`}>
                    {aud.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{aud.label}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-6 space-y-4">
               <h4 className="text-[9px] font-bold text-[#525252] uppercase tracking-[0.3em]">AI Synthesis Mode</h4>
               <div className="flex gap-2">
                  <div className="flex-1 h-1 bg-[#0062FF]" />
                  <div className="flex-1 h-1 bg-[#0062FF]/20" />
                  <div className="flex-1 h-1 bg-[#0062FF]/20" />
               </div>
               <p className="text-[10px] text-[#A8A8A8] italic">Engine is currently utilizing <strong>Executive Persuasion</strong> heuristics for Board-level reporting.</p>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#393939] p-8 space-y-6">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00C853]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Compliance Lock</h4>
             </div>
             <p className="text-[10px] text-[#A8A8A8] leading-relaxed">Decks generated include automatic redaction of non-authorized personnel identifiers (GDPR Phase 4 compliance).</p>
          </div>
        </div>

        {/* Slide Viewer Area */}
        <div className="lg:col-span-9 space-y-8">
           {!deck && !isLoading ? (
             <div className="h-[600px] border-2 border-dashed border-[#393939] bg-[#161616] flex flex-col items-center justify-center p-20 text-center">
                <Presentation className="w-16 h-16 text-[#262626] mb-8" />
                <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">No Deck Initialized</h3>
                <p className="text-[#A8A8A8] text-xs max-w-sm font-light italic leading-relaxed">
                  Select a vendor cluster and define your target audience to generate a specialized risk-mitigation pitch deck.
                </p>
             </div>
           ) : isLoading ? (
             <div className="h-[600px] bg-[#262626] border border-[#393939] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0062FF_1px,transparent_1px)] [background-size:30px_30px]" />
                <Loader2 className="w-16 h-16 text-[#0062FF] animate-spin mb-8" />
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2 animate-pulse">Rendering Strategic Narrative</h3>
                <p className="text-[10px] font-mono text-[#0062FF] uppercase tracking-[0.2em]">Agent: DR_GENE + RISK_ORACLE COLLABORATING...</p>
             </div>
           ) : deck && (
             <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                {/* Slide Preview Container */}
                <div className="aspect-video bg-white shadow-2xl relative overflow-hidden flex flex-col">
                   {/* Presentation Header */}
                   <div className="h-20 bg-[#0062FF] flex items-center justify-between px-12 text-white">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 border-2 border-white flex items-center justify-center font-black">B</div>
                         <span className="text-xs font-bold uppercase tracking-[0.3em]">BioRisk Guard Enterprise</span>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Strategic Assessment</p>
                         <p className="text-sm font-bold uppercase">{deck.vendorName}</p>
                      </div>
                   </div>

                   {/* Slide Content */}
                   <div className="flex-1 p-20 flex flex-col justify-center bg-white relative">
                      <div className="absolute top-0 right-0 p-12 opacity-5">
                         <Target className="w-64 h-64 text-[#0062FF]" />
                      </div>

                      <div className="relative z-10 space-y-10">
                         <div>
                            <h2 className="text-5xl font-black text-[#161616] uppercase tracking-tighter mb-4 leading-tight">
                               {deck.slides[currentSlide].title}
                            </h2>
                            {deck.slides[currentSlide].subtitle && (
                              <p className="text-xl text-[#0062FF] font-medium tracking-tight border-l-4 border-[#0062FF] pl-6 uppercase">
                                {deck.slides[currentSlide].subtitle}
                              </p>
                            )}
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                            <ul className="space-y-6">
                               {deck.slides[currentSlide].bulletPoints.map((bp, i) => (
                                 <li key={i} className="flex gap-4 items-start group">
                                    <div className="w-2 h-2 rounded-full bg-[#0062FF] mt-2 group-hover:scale-125 transition-transform" />
                                    <p className="text-lg text-[#393939] leading-relaxed font-medium">{bp}</p>
                                 </li>
                               ))}
                            </ul>
                            
                            {deck.slides[currentSlide].metrics && (
                              <div className="bg-[#F4F4F4] p-8 border border-[#D1D1D1] space-y-6 flex flex-col justify-center">
                                 {Object.entries(deck.slides[currentSlide].metrics).map(([key, val], idx) => (
                                   <div key={idx} className="border-b border-[#D1D1D1] pb-4 last:border-0">
                                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                                      <p className="text-3xl font-black text-[#161616] font-mono">{val}</p>
                                   </div>
                                 ))}
                              </div>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Slide Footer */}
                   <div className="h-16 border-t border-[#F4F4F4] px-12 flex items-center justify-between text-[#A8A8A8]">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Confidential Audit Documentation</span>
                      <span className="text-[10px] font-mono">SLIDE {currentSlide + 1} // 06</span>
                   </div>
                </div>

                {/* Controls & Tools */}
                <div className="flex items-center justify-between bg-[#262626] border border-[#393939] p-6">
                   <div className="flex items-center gap-8">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                          disabled={currentSlide === 0}
                          className="p-3 bg-[#161616] border border-[#393939] text-white disabled:opacity-30 hover:bg-[#393939] transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setCurrentSlide(prev => Math.min(deck.slides.length - 1, prev + 1))}
                          disabled={currentSlide === deck.slides.length - 1}
                          className="p-3 bg-[#161616] border border-[#393939] text-white disabled:opacity-30 hover:bg-[#393939] transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="h-8 w-px bg-[#393939]" />
                      <div className="flex gap-4">
                        {deck.slides.map((_, i) => (
                          <div 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentSlide === i ? 'bg-[#0062FF] scale-125' : 'bg-[#393939]'}`} 
                          />
                        ))}
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button className="px-6 py-2.5 bg-[#262626] border border-[#393939] text-[#A8A8A8] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                         <Printer className="w-4 h-4" /> Print
                      </button>
                      <button className="px-6 py-2.5 bg-[#262626] border border-[#393939] text-[#A8A8A8] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                         <Share2 className="w-4 h-4" /> Secure Share
                      </button>
                      <button className="px-8 py-2.5 bg-[#00C853] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#00a846] transition-all flex items-center gap-2 shadow-xl shadow-green-900/10">
                         <Download className="w-4 h-4" /> Export PPTX/PDF
                      </button>
                   </div>
                </div>

                {/* AI Reasoning Insight */}
                <div className="bg-[#161616] border border-[#393939] p-8 flex items-start gap-8">
                   <div className="p-4 bg-[#262626] border border-[#393939] text-[#0062FF]">
                      <Calculator className="w-6 h-6" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Architect Logic Note</h4>
                      <p className="text-sm text-[#A8A8A8] leading-relaxed italic font-light">
                        "The tone of Slide {currentSlide + 1} has been automatically adjusted to '{deck.slides[currentSlide].tone}'. Bullet points emphasize fiduciary responsibility while abstracting technical genomic drift metrics for Board-level accessibility."
                      </p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PitchGenerator;
