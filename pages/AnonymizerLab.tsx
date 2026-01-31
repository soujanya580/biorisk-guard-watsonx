
import React, { useState, useEffect, useRef } from 'react';
import { 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Fingerprint,
  FileText,
  Lock,
  Zap,
  Info,
  ChevronDown,
  Database,
  BarChart3,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { useHackathon } from '../context/HackathonContext';
import { sounds } from '../services/soundService';
import { useNavigate } from 'react-router-dom';

interface SampleData {
  name: string;
  file: string;
  records: string;
  piiFields: string[];
  risk: string;
  raw: string;
  anonymized: string;
}

const SAMPLES: Record<string, SampleData> = {
  BRCA1: {
    name: 'BRCA1 Cancer Data',
    file: 'BRCA1_Sequencing_Data.vcf',
    records: '50,240 variants',
    piiFields: ['Name', 'DOB', 'Home Address', 'Clinic ID', 'Physician'],
    risk: 'HIGH (GDPR Article 9 violation)',
    raw: `##fileformat=VCFv4.2
#CHROM POS ID REF ALT QUAL FILTER INFO
17 43044295 rs80357713 G A 100 PASS NAME=John_Smith;DOB=1985-03-15;ADDR=123_Main_St_Boston;CLINIC=Mass_General;MD=Dr_House
17 43045712 rs80357714 C T 100 PASS NAME=John_Smith;DOB=1985-03-15;ADDR=123_Main_St_Boston;CLINIC=Mass_General;MD=Dr_House
17 43046001 rs80357715 A G 100 PASS NAME=John_Smith;DOB=1985-03-15;ADDR=123_Main_St_Boston;CLINIC=Mass_General;MD=Dr_House`,
    anonymized: `##fileformat=VCFv4.2
#CHROM POS ID REF ALT QUAL FILTER INFO
17 43044295 rs80357713 G A 100 PASS PATIENT_ID=PS-8492-XF;DOB=[REDACTED];ADDR=[REDACTED];CLINIC=[REDACTED];MD=[REDACTED]
17 43045712 rs80357714 C T 100 PASS PATIENT_ID=PS-8492-XF;DOB=[REDACTED];ADDR=[REDACTED];CLINIC=[REDACTED];MD=[REDACTED]
17 43046001 rs80357715 A G 100 PASS PATIENT_ID=PS-8492-XF;DOB=[REDACTED];ADDR=[REDACTED];CLINIC=[REDACTED];MD=[REDACTED]`
  },
  ALZHEIMERS: {
    name: "Alzheimer's Genetic Study",
    file: 'ALZ_Cohort_B.csv',
    records: '12,400 samples',
    piiFields: ['Patient Full Name', 'Insurance ID', 'Postal Code'],
    risk: 'MEDIUM (HIPAA Safe Harbor Breach)',
    raw: `ID,Name,Insurance_ID,Zip,Gene,Status
1001,Jane_Doe,ABC-99238,02134,APOE4,Carrier
1002,Jane_Doe,ABC-99238,02134,PSEN1,Negative`,
    anonymized: `ID,Name,Insurance_ID,Zip,Gene,Status
1001,[REDACTED],[REDACTED],021XX,APOE4,Carrier
1002,[REDACTED],[REDACTED],021XX,PSEN1,Negative`
  },
  COVID: {
    name: 'COVID-19 Genome Sequences',
    file: 'Sars-Cov-2-Patient-Metadata.fasta',
    records: '5,000 sequences',
    piiFields: ['Collection Site', 'Patient Name', 'Travel History'],
    risk: 'MEDIUM (PHI Leakage)',
    raw: `>Site:London_Airport | Patient:Alice_Vane | Collected:2022-01-05
ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC`,
    anonymized: `>Site:[REDACTED] | Patient:P-00441 | Collected:2022-01-XX
ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC`
  }
};

const AnonymizerLab: React.FC = () => {
  const navigate = useNavigate();
  const { isHackathonMode, isAutoDemoActive } = useHackathon();
  const [selectedKey, setSelectedKey] = useState<keyof typeof SAMPLES>('BRCA1');
  const [aggressiveness, setAggressiveness] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [activeTab, setActiveTab] = useState<'BEFORE' | 'AFTER'>('BEFORE');

  const currentSample = SAMPLES[selectedKey];

  const handleExecute = async () => {
    setIsProcessing(true);
    setIsResolved(false);
    setProcessingStep(1);
    sounds.playTone(400, 0.2);

    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep(2);
    sounds.playTone(600, 0.2);

    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep(3);
    sounds.playTone(800, 0.2);

    await new Promise(r => setTimeout(r, 800));
    setIsProcessing(false);
    setIsResolved(true);
    setActiveTab('AFTER');
    sounds.playSuccess();
  };

  const privacyScore = Math.floor(aggressiveness * 1.15);
  const utilityScore = 100 - Math.floor((aggressiveness - 50) * 1.5);

  return (
    <div className={`p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700 ${isAutoDemoActive ? 'ring-4 ring-indigo-500/20' : ''}`}>
      {isAutoDemoActive && (
        <div className="bg-indigo-600 text-white px-6 py-2 rounded-sm flex items-center justify-between shadow-lg">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Auto-Demo Active: Genomic Anonymizer
           </span>
           <span className="text-[9px] font-mono opacity-60">Protecting Sensitive Data...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#0062FF] flex items-center justify-center rounded-sm shadow-lg shadow-blue-900/20">
            <EyeOff className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">Genomic <span className="font-bold">Anonymizer Lab</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Autonomous PII redaction using IBM Data Privacy Patterns & Gemini-3-Pro.</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4 bg-[#161616] border border-[#393939] px-4 py-2">
            <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest text-[#0062FF]">Target Sample</label>
            <div className="relative">
              <select 
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-white outline-none font-mono cursor-pointer appearance-none pr-8"
              >
                {Object.keys(SAMPLES).map(k => (
                  <option key={k} value={k}>{SAMPLES[k as keyof typeof SAMPLES].name}</option>
                ))}
                <option value="CUSTOM">Custom Upload...</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={handleExecute}
            disabled={isProcessing}
            className={`px-8 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest rounded-sm shadow-xl shadow-blue-900/30 disabled:bg-[#393939]`}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Execute Anonymization
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          
          {/* Metadata Card */}
          <div className="bg-[#262626] border border-[#393939] p-8 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-[#161616] border border-[#393939] text-[#0062FF]">
                   <Database className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      SAMPLE LOADED: <span className="text-[#0062FF]">{currentSample.file}</span>
                   </h3>
                   <div className="flex gap-6 mt-1">
                      <p className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">Records: {currentSample.records}</p>
                      <p className="text-[10px] text-[#A8A8A8] font-mono uppercase tracking-widest">PII Fields Detected: {currentSample.piiFields.length}</p>
                   </div>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-1">Pre-Analysis Risk</p>
                <span className="text-xs font-black text-[#FF2D55] bg-[#FF2D55]/10 px-2 py-1 border border-[#FF2D55]/30 uppercase rounded-sm">
                   {currentSample.risk}
                </span>
             </div>
          </div>

          {/* Code Viewer Workspace */}
          <div className="bg-[#161616] border border-[#393939] flex flex-col h-[550px] relative overflow-hidden">
             {/* Workspace Tabs */}
             <div className="flex items-center justify-between bg-[#1c1c1c] border-b border-[#393939] px-6 py-3">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('BEFORE')}
                    className={`text-[10px] font-bold uppercase tracking-widest pb-1 transition-all ${activeTab === 'BEFORE' ? 'text-[#0062FF] border-b border-[#0062FF]' : 'text-[#A8A8A8] hover:text-white'}`}
                  >
                    Source Data (Pre)
                  </button>
                  {isResolved && (
                    <button 
                      onClick={() => setActiveTab('AFTER')}
                      className={`text-[10px] font-bold uppercase tracking-widest pb-1 transition-all ${activeTab === 'AFTER' ? 'text-[#00C853] border-b border-[#00C853]' : 'text-[#A8A8A8] hover:text-white'}`}
                    >
                      Anonymized View (Post)
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-[#525252]">MODE: {isHackathonMode ? 'HACK_MODE_BYPASS' : 'SECURE_VIEW'}</span>
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 p-10 overflow-y-auto scrollbar-hide relative">
                {isProcessing ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
                      <div className="relative">
                         <Loader2 className="w-16 h-16 text-[#0062FF] animate-spin" />
                         <div className="absolute inset-0 bg-[#0062FF]/10 rounded-full animate-ping" />
                      </div>
                      <div className="space-y-4 w-full max-sm">
                         <div className={`flex items-center justify-between p-3 border ${processingStep >= 1 ? 'border-[#00C853] bg-[#00C853]/5 text-[#00C853]' : 'border-[#393939] text-[#525252]'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-widest">STEP 1: Scanning for PII...</span>
                            {processingStep >= 1 && <CheckCircle2 className="w-4 h-4" />}
                         </div>
                         <div className={`flex items-center justify-between p-3 border ${processingStep >= 2 ? 'border-[#00C853] bg-[#00C853]/5 text-[#00C853]' : 'border-[#393939] text-[#525252]'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-widest">STEP 2: Redacting identifiers...</span>
                            {processingStep >= 2 && <CheckCircle2 className="w-4 h-4" />}
                         </div>
                         <div className={`flex items-center justify-between p-3 border ${processingStep >= 3 ? 'border-[#00C853] bg-[#00C853]/5 text-[#00C853]' : 'border-[#393939] text-[#525252]'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-widest">STEP 3: Verifying anonymization...</span>
                            {processingStep >= 3 && <CheckCircle2 className="w-4 h-4" />}
                         </div>
                      </div>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {/* Hack Mode Warning */}
                    {isHackathonMode && activeTab === 'BEFORE' && (
                       <div className="mb-6 p-4 bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center gap-4 text-[#FF2D55]">
                          <ShieldAlert className="w-5 h-5 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest">WARNING: HACK_MODE EXPOSES RAW PII DATA. DO NOT SHIP TO PRODUCTION NODES.</p>
                       </div>
                    )}
                    
                    <pre className="font-mono text-xs leading-relaxed text-[#F4F4F4]">
                      {(activeTab === 'BEFORE' || isHackathonMode) ? currentSample.raw : currentSample.anonymized}
                    </pre>

                    {isResolved && activeTab === 'AFTER' && (
                       <div className="mt-10 p-8 bg-[#00C853]/5 border-t border-b border-[#00C853]/20 space-y-4">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3 text-[#00C853]">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-widest">Privacy Verification Complete</span>
                             </div>
                             <span className="text-[10px] font-mono text-[#00C853]/60 tracking-widest uppercase">IBM_SAFE_HARBOR_V3.2</span>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             <div>
                                <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Privacy Score</p>
                                <p className="text-3xl font-black text-white font-mono">{privacyScore}/100 <span className="text-[#00C853] text-sm font-bold">✅</span></p>
                             </div>
                             <div>
                                <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Compliance Status</p>
                                <p className="text-3xl font-black text-white font-mono">GDPR ACHIEVED <span className="text-[#00C853] text-sm font-bold">✓</span></p>
                             </div>
                          </div>
                       </div>
                    )}
                  </div>
                )}
             </div>

             {/* Redaction Visualizer Summary */}
             {isResolved && activeTab === 'AFTER' && (
               <div className="absolute bottom-6 left-6 p-4 bg-[#050505]/80 backdrop-blur-xl border border-[#0062FF]/40 shadow-2xl animate-in slide-in-from-left-4">
                  <div className="flex items-center gap-4 mb-3">
                     <Fingerprint className="w-6 h-6 text-[#0062FF]" />
                     <div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Redaction Visualizer</p>
                        <p className="text-[8px] text-[#A8A8A8] font-mono">{currentSample.piiFields.length} fields redacted, 3 pseudonymized</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <span className="bg-[#0062FF]/10 text-[#0062FF] border border-[#0062FF]/20 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase">Name → ID Mapping</span>
                     <span className="bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase">DOB → Redacted</span>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Privacy Score Calculator */}
          <div className="bg-[#262626] border border-[#393939] p-8 space-y-10">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-[#393939] pb-4 flex items-center gap-3">
               <BarChart3 className="w-5 h-5 text-[#0062FF]" />
               Privacy Logic Control
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">Privacy Aggressiveness</label>
                    <span className={`text-[10px] font-mono font-bold ${aggressiveness > 80 ? 'text-[#00C853]' : 'text-[#FFD600]'}`}>
                       {aggressiveness}% {aggressiveness > 80 ? 'STRICT' : 'STANDARD'}
                    </span>
                  </div>
                  <input 
                    type="range" min="50" max="100" 
                    value={aggressiveness}
                    onChange={(e) => setAggressiveness(parseInt(e.target.value))}
                    className="w-full accent-[#0062FF] bg-[#161616] h-1.5 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-[#393939] font-mono uppercase tracking-widest">
                     <span>Low Privacy</span>
                     <span>High Research Utility</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#393939]">
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Privacy Index</p>
                    <p className="text-2xl font-black text-white font-mono">{privacyScore}/100</p>
                  </div>
                  <div className="text-center border-l border-[#393939]">
                    <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Utility Index</p>
                    <p className="text-2xl font-black text-white font-mono">{utilityScore}/100</p>
                  </div>
               </div>
            </div>
          </div>

          {/* IBM Integration Badges */}
          <div className="bg-[#161616] border border-[#393939] p-8 space-y-6">
             <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4">Enterprise Verifications</h3>
             <div className="space-y-3">
                {[
                  { label: 'IBM Data Privacy Patterns', status: 'ACTIVE ✓', color: 'text-[#0062FF]' },
                  { label: 'GDPR Article 9 Compliance', status: 'VERIFIED ✓', color: 'text-[#00C853]' },
                  { label: 'HIPAA Safe Harbor', status: 'ACHIEVED ✓', color: 'text-[#00C853]' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[#262626] border border-[#393939]">
                     <span className="text-[10px] text-white/60 font-bold uppercase tracking-tight">{item.label}</span>
                     <span className={`text-[9px] font-mono font-black ${item.color}`}>{item.status}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Terminal Diagnostics */}
          <div className="bg-[#050505] border border-[#393939] p-6 space-y-4">
             <div className="flex items-center gap-3 text-[#A8A8A8]">
                <Terminal className="w-4 h-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.4em]">Engine_Audit_Log</span>
             </div>
             <div className="space-y-1 font-mono text-[9px] text-[#393939]">
                <p>> Loading Gem_3_Pro model...</p>
                <p>> Context window: 128k</p>
                <p>> Redaction seeds deployed.</p>
                {isResolved && <p className="text-[#00C853]">> SUCCESS: {currentSample.piiFields.length} entities masked.</p>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnonymizerLab;
