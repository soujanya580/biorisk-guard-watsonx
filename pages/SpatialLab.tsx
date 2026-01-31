
import React from 'react';
import { 
  View, 
  Smartphone, 
  Monitor, 
  Layers, 
  Zap, 
  Globe, 
  Box, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Info,
  Maximize2,
  Lock,
  SearchCode,
  Dna
} from 'lucide-react';
import { ARViewSimulator, VRCommandSimulator } from '../components/SpatialViewers';

const SpatialLab: React.FC = () => {
  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-[#393939] pb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[#FFD600] flex items-center justify-center rounded-sm shadow-lg shadow-[#FFD600]/20">
            <View className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">Spatial <span className="font-bold">Command Lab</span></h1>
            <p className="text-[#A8A8A8] text-sm mt-1">Immersive AR/VR risk visualization and remote facility inspection frameworks.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 border border-[#393939] text-[#A8A8A8] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm">
            <Users className="w-4 h-4" />
            Invite Collaborators
          </button>
          <button className="px-6 py-2.5 bg-[#0062FF] text-white hover:bg-[#0052cc] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-sm shadow-xl shadow-blue-900/10">
            <Zap className="w-4 h-4" />
            Launch Immersive Node
          </button>
        </div>
      </div>

      {/* Hero: Concept Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#262626] border border-[#393939] p-10 space-y-10 h-full relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD600]/5 blur-[60px] rounded-full group-hover:bg-[#FFD600]/10 transition-colors" />
            
            <div className="space-y-6">
              <div className="p-4 bg-[#161616] border border-[#393939] text-[#FFD600] w-fit">
                <Box className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-tight leading-tight">Beyond the <br/><span className="text-[#FFD600]">Flat Dashboard</span></h2>
              <p className="text-sm text-[#A8A8A8] leading-relaxed font-light">
                BioRisk Guard leverages spatial computing to transform complex genomic and compliance data into tangible, 
                interactive environments. By using <strong>Vision Pro</strong> or <strong>Quest 3</strong>, 
                risk leads experience data with depth, scale, and context.
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-[#393939]">
              <div className="flex gap-5 items-start group/item">
                 <div className="p-3 bg-[#161616] border border-[#393939] text-[#0062FF] group-hover/item:border-[#0062FF] transition-colors"><Smartphone className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">AR Facility Overlays</h4>
                    <p className="text-[11px] text-[#A8A8A8] leading-relaxed font-light">
                      Point a device at vendor facilities to see real-time health markers, bias indices, and documented non-compliance events in physical space.
                    </p>
                 </div>
              </div>
              <div className="flex gap-5 items-start group/item">
                 <div className="p-3 bg-[#161616] border border-[#393939] text-[#00C853] group-hover/item:border-[#00C853] transition-colors"><SearchCode className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">3D Gene Inspection</h4>
                    <p className="text-[11px] text-[#A8A8A8] leading-relaxed font-light">
                      Literally walk through the DNA helix. Grab and rotate mutation clusters to inspect pathogenicity in a way 2D charts can never match.
                    </p>
                 </div>
              </div>
              <div className="flex gap-5 items-start group/item">
                 <div className="p-3 bg-[#161616] border border-[#393939] text-[#A78BFA] group-hover/item:border-[#A78BFA] transition-colors"><Users className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">VR Global War Rooms</h4>
                    <p className="text-[11px] text-[#A8A8A8] leading-relaxed font-light">
                      Collaborate with auditors across timezones in a virtual command center. Drag risk blocks between colleagues to reach consensus faster.
                    </p>
                 </div>
              </div>
            </div>

            <div className="p-5 bg-[#FFD600]/5 border border-[#FFD600]/20 flex items-start gap-4">
               <Info className="w-5 h-5 text-[#FFD600] flex-shrink-0 mt-0.5" />
               <p className="text-[10px] text-[#A8A8A8] leading-relaxed italic">
                 Spatial Lab features require an ERCA-Spatial license and VisionOS 1.2+ or Meta Quest OS v56+.
               </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {/* AR Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-l-4 border-[#0062FF] pl-4">
               <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-[0.2em]">AR Risk Contextualizer</h3>
                  <p className="text-[10px] text-[#A8A8A8] font-mono mt-1">SIM_MODE: HANDHELD_TABLET_VIEW</p>
               </div>
               <div className="flex gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-[#0062FF] uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0062FF] animate-pulse" />
                     Tracking Active
                  </div>
               </div>
            </div>
            <ARViewSimulator />
          </div>

          {/* VR Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-l-4 border-[#A78BFA] pl-4">
               <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-[0.2em]">VR Immersive Command</h3>
                  <p className="text-[10px] text-[#A8A8A8] font-mono mt-1">SIM_MODE: VISION_OS_IMMERSIVE</p>
               </div>
               <div className="flex gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-[#A78BFA] uppercase">
                     <Lock className="w-3 h-3" />
                     Encrypted Room
                  </div>
               </div>
            </div>
            <VRCommandSimulator />
          </div>
        </div>
      </div>

      {/* Deployment & Device Synergy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#393939] border border-[#393939]">
        <div className="bg-[#161616] p-8 space-y-4 group hover:bg-[#1c1c1c] transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Maximize2 className="w-4 h-4 text-[#FFD600]" />
            <p className="text-[10px] font-bold text-[#FFD600] uppercase tracking-widest">Apple Vision Pro</p>
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight">Shared Spatial Anchors</h4>
          <p className="text-[11px] text-[#A8A8A8] font-light leading-relaxed">
            Collaborative AR sessions where multiple auditors see the same 3D risk models floating in their shared physical space.
          </p>
        </div>
        <div className="bg-[#161616] p-8 space-y-4 group hover:bg-[#1c1c1c] transition-colors border-l border-[#393939]">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-4 h-4 text-[#0062FF]" />
            <p className="text-[10px] font-bold text-[#0062FF] uppercase tracking-widest">Meta Quest 3</p>
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight">Full VR Command Room</h4>
          <p className="text-[11px] text-[#A8A8A8] font-light leading-relaxed">
            A 100% immersive environment for deep forensics where the entire supply chain is visualized as a galaxy of risk nodes.
          </p>
        </div>
        <div className="bg-[#161616] p-8 space-y-4 group hover:bg-[#1c1c1c] transition-colors border-l border-[#393939]">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-4 h-4 text-[#00C853]" />
            <p className="text-[10px] font-bold text-[#00C853] uppercase tracking-widest">WebXR Support</p>
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight">Mobile AR Fallback</h4>
          <p className="text-[11px] text-[#A8A8A8] font-light leading-relaxed">
            Field agents can use standard iOS/Android devices to scan lab barcodes and see instant risk overlays via browser-based AR.
          </p>
        </div>
        <div className="bg-[#161616] p-8 space-y-4 group hover:bg-[#1c1c1c] transition-colors border-l border-[#393939]">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-4 h-4 text-[#A78BFA]" />
            <p className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest">Haptic Integration</p>
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight">Vibration Feedback</h4>
          <p className="text-[11px] text-[#A8A8A8] font-light leading-relaxed">
            Feel the 'texture' of risk. Haptic pulses intensify as you move closer to high-bias genomic clusters in VR.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpatialLab;
