
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquareQuote, 
  Send, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Database, 
  Loader2, 
  BookOpen, 
  FileCheck, 
  Languages, 
  Scale,
  BrainCircuit,
  Paperclip,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { performRegulatoryChat } from '../services/geminiService';
import { Vendor, ChatMessage } from '../types';

const ComplianceChat: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getVendors().then(setVendors);
    
    // Initial system greeting
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'ERCA Regulatory Node Active. I am specialized in healthcare compliance forensics. Select a vendor node to sync context or ask a regulatory question directly.',
      timestamp: new Date().toLocaleTimeString(),
      reasoningChain: ['Kernel initialized', 'Compliance database sync: OK', 'Handshake Protocol: PASS']
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const result = await performRegulatoryChat(
        userMsg.content,
        history,
        selectedVendor ? {
          vendorName: selectedVendor.name,
          industry: selectedVendor.industry,
          details: `Risk Index: ${selectedVendor.overallScore}. Last Analysis: ${selectedVendor.lastAnalysis}.`
        } : undefined
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.content,
        citations: result.citations,
        reasoningChain: result.reasoningChain,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: 'System error in regulatory logic sequence. Please re-initialize node.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    // Simulated upload for demo
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `upload-${Date.now()}`,
        role: 'assistant',
        content: 'Regulatory document processed. I have extracted key clauses. You may now perform a "Debate Analysis" on any specific section of the file.',
        timestamp: new Date().toLocaleTimeString(),
        citations: ['Internal Policy V2.4', 'Local Data Mandate §44']
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-104px)] bg-[#161616] overflow-hidden animate-in fade-in duration-500">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#393939]">
        {/* Chat Header */}
        <div className="h-16 bg-[#1c1c1c] border-b border-[#393939] px-8 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0062FF]/10 text-[#0062FF] border border-[#0062FF]/20">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Regulatory Forensics Chat</h2>
                <p className="text-[10px] text-[#A8A8A8] font-mono tracking-tighter uppercase">Mode: Ask the Regulator (Beta)</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 text-[10px] font-bold text-[#A8A8A8] hover:text-white uppercase tracking-widest transition-colors">
                <Languages className="w-4 h-4" /> Explain Simple
              </button>
              <button className="flex items-center gap-2 text-[10px] font-bold text-[#A8A8A8] hover:text-white uppercase tracking-widest transition-colors">
                <FileCheck className="w-4 h-4" /> Checklist Mode
              </button>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-0'}`}>
                <div className={`p-6 rounded-sm border ${
                  msg.role === 'user' 
                    ? 'bg-[#0062FF] border-[#0062FF] text-white' 
                    : 'bg-[#262626] border-[#393939] text-[#F4F4F4]'
                }`}>
                  <div className="flex items-center justify-between mb-4 opacity-50">
                    <span className="text-[9px] font-bold uppercase tracking-widest">{msg.role === 'user' ? 'Operator' : 'Regulatory_AI_Node'}</span>
                    <span className="text-[9px] font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-[#393939] space-y-2">
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-2 flex items-center gap-2">
                        <BookOpen className="w-3 h-3 text-[#0062FF]" /> Formal Citations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, i) => (
                          <span key={i} className="bg-[#161616] px-2 py-1 text-[9px] font-mono text-[#0062FF] border border-[#0062FF]/20">{cite}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.reasoningChain && msg.reasoningChain.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#393939]">
                      <details className="group">
                        <summary className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest cursor-pointer list-none flex items-center gap-2">
                          <BrainCircuit className="w-3 h-3 text-[#00C853]" /> Logic Chain <ChevronRight className="w-2 h-2 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="mt-3 space-y-2 pl-2 border-l border-[#393939]">
                          {msg.reasoningChain.map((step, i) => (
                            <p key={i} className="text-[10px] text-[#A8A8A8] font-mono leading-tight">[{i+1}] {step}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#262626] border border-[#393939] p-6 rounded-sm w-32 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#0062FF] animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-[#1c1c1c] border-t border-[#393939]">
           <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#A8A8A8] hover:text-[#0062FF] transition-colors"
                 >
                    <Paperclip className="w-5 h-5" />
                 </button>
                 <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                 />
              </div>
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about HIPAA Safe Harbor, GDPR Article 9, or sync vendor context..."
                className="w-full bg-[#262626] border border-[#393939] focus:border-[#0062FF] pl-16 pr-16 py-4 text-sm text-white resize-none h-16 rounded-sm outline-none transition-all placeholder:text-[#525252]"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#0062FF] text-white disabled:bg-[#393939] transition-all rounded-sm shadow-lg shadow-blue-900/20"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
           <p className="text-center text-[9px] text-[#393939] font-mono mt-4 uppercase tracking-[0.2em]">
             System: Regulatory Logic Version 3.1.2 | Security Level: Multi-Region Distributed
           </p>
        </div>
      </div>

      {/* Sidebar: Context Control */}
      <div className={`transition-all duration-500 ${isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'} bg-[#161616] overflow-y-auto`}>
        <div className="p-8 space-y-10">
          <div className="flex items-center justify-between border-b border-[#393939] pb-4">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest">Chat Context</h3>
             <button onClick={() => setIsSidebarOpen(false)} className="text-[#393939] hover:text-white transition-colors">
               <X className="w-4 h-4" />
             </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0062FF]" /> Active Vendor Node
              </label>
              <select 
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full bg-[#262626] border border-[#393939] p-3 text-xs text-white outline-none focus:border-[#0062FF] transition-colors rounded-sm appearance-none"
              >
                <option value="">-- SYSTEM STANDALONE --</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {selectedVendor && (
              <div className="bg-[#262626] border border-[#393939] p-5 space-y-4 animate-in fade-in zoom-in duration-300">
                <div>
                   <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Industry Classification</p>
                   <p className="text-xs font-mono text-[#0062FF]">{selectedVendor.industry}</p>
                </div>
                <div>
                   <p className="text-[9px] font-bold text-[#A8A8A8] uppercase tracking-widest mb-1">Assessed Risk</p>
                   <p className="text-xs font-mono text-white">{selectedVendor.overallScore}/10</p>
                </div>
                <div className="p-3 bg-[#161616] border border-[#393939] flex items-start gap-3">
                   <Info className="w-4 h-4 text-[#FFD600] flex-shrink-0 mt-0.5" />
                   <p className="text-[10px] text-[#A8A8A8] leading-relaxed italic">AI is currently syncing regulatory citations relevant to {selectedVendor.industry} labs.</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 border-t border-[#393939] space-y-8">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Regulator Debate Mode</h4>
            <div className="space-y-4">
              <button className="w-full py-4 px-4 bg-[#262626] border border-[#393939] hover:border-[#00C853] text-[#A8A8A8] hover:text-white transition-all text-left group">
                 <div className="flex items-center justify-between mb-2">
                   <Scale className="w-4 h-4 group-hover:text-[#00C853]" />
                   <span className="text-[8px] font-mono text-[#393939]">V_DEBATE_4.1</span>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-tight">Challenge AI Logic</p>
                 <p className="text-[9px] text-[#525252] mt-1 leading-tight">Start a formal debate session on a specific compliance flag.</p>
              </button>
              
              <button className="w-full py-4 px-4 bg-[#262626] border border-[#393939] hover:border-[#A78BFA] text-[#A8A8A8] hover:text-white transition-all text-left group">
                 <div className="flex items-center justify-between mb-2">
                   <BrainCircuit className="w-4 h-4 group-hover:text-[#A78BFA]" />
                   <span className="text-[8px] font-mono text-[#393939]">GENOSYM_LINK</span>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-tight">Explain Genomic Drift</p>
                 <p className="text-[9px] text-[#525252] mt-1 leading-tight">Use legal terminology to describe technical genetic data bias.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Toggle (Collapsed State) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-screen bg-[#1c1c1c] border-l border-[#393939] flex items-center justify-center text-[#A8A8A8] hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
      )}
    </div>
  );
};

export default ComplianceChat;
