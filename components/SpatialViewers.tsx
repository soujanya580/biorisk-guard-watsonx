
import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, MapPin, Search, Maximize2, Smartphone, Monitor, Info, Box, Activity, Lock, Users, Zap } from 'lucide-react';
import * as THREE from 'three';

// AR Simulation Component
export const ARViewSimulator: React.FC = () => {
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev > 100 ? 0 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-[#000] overflow-hidden rounded-sm border border-[#393939] group shadow-2xl">
      {/* Background simulated image */}
      <img 
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.3]" 
        alt="AR Background"
      />
      
      {/* Scanning Beam Animation */}
      <div 
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#0062FF] to-transparent shadow-[0_0_15px_#0062FF] opacity-50 z-20 pointer-events-none"
        style={{ top: `${scanPos}%` }}
      />

      {/* Viewfinder Overlays */}
      <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#0062FF]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0062FF]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0062FF]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#0062FF]" />
      </div>

      <div className="absolute top-6 left-6 p-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white flex flex-col gap-1 z-30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="uppercase tracking-[0.2em]">AR_FORENSIC_FEED_V4</span>
        </div>
        <div className="text-[8px] text-[#0062FF]">LAT: 37.7749 / LONG: -122.4194</div>
      </div>

      {/* Floating AR Elements - Marker 1 */}
      <div className="absolute top-[20%] left-[15%] animate-in fade-in zoom-in duration-1000 delay-300">
        <div className="bg-black/60 backdrop-blur-xl border border-[#FF2D55]/50 p-5 w-60 shadow-2xl relative group-hover:scale-105 transition-transform">
          <div className="absolute -left-3 top-6 w-6 h-px bg-[#FF2D55]" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF2D55]" />
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">Lab: Helix_A2</span>
            </div>
            <span className="text-[9px] font-mono text-[#FF2D55] bg-[#FF2D55]/10 px-1.5 py-0.5 border border-[#FF2D55]/20">CRITICAL</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[9px] text-[#A8A8A8] mb-1">
                <span>GENOMIC DRIFT INDEX</span>
                <span className="text-white font-mono">8.5/10</span>
              </div>
              <div className="w-full h-1 bg-white/10">
                <div className="w-[85%] h-full bg-[#FF2D55] shadow-[0_0_10px_#FF2D55]" />
              </div>
            </div>
            <div className="flex items-start gap-2 text-[9px] text-white/70 leading-relaxed italic">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>Violation detected in HIPAA Privacy Rule Section 164.530.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AR Elements - Marker 2 (Node) */}
      <div className="absolute bottom-[30%] right-[20%] animate-in fade-in zoom-in duration-1000 delay-700">
        <div className="bg-black/60 backdrop-blur-xl border border-[#00C853]/50 p-4 w-48 shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-[#00C853] flex items-center justify-center bg-[#00C853]/10">
             <Box className="w-5 h-5 text-[#00C853]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Server_Node_09</p>
            <p className="text-[8px] text-[#00C853] font-mono mt-1">STATUS: SECURE</p>
          </div>
        </div>
      </div>

      {/* HUD Gauges */}
      <div className="absolute bottom-8 left-8 flex items-end gap-6 z-30">
        <div className="space-y-2">
           <div className="flex justify-between text-[8px] text-white/40 font-mono">
              <span>SCAN_PROGRESS</span>
              <span>{Math.round(scanPos)}%</span>
           </div>
           <div className="w-32 h-1 bg-white/5 border border-white/10">
              <div className="h-full bg-[#0062FF]" style={{ width: `${scanPos}%` }} />
           </div>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[#0062FF]/20 cursor-pointer transition-colors">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="w-10 h-10 border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-[#0062FF]/20 cursor-pointer transition-colors">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-8 right-8 text-right z-30">
        <div className="flex items-center gap-2 justify-end mb-2">
          <Activity className="w-4 h-4 text-[#0062FF] animate-pulse" />
          <span className="text-[10px] font-mono text-white/40">CALIBRATING_SENSORS...</span>
        </div>
        <h4 className="text-lg font-bold text-white uppercase tracking-[0.3em]">Spatial Inspection</h4>
        <p className="text-[10px] text-[#A8A8A8] font-mono mt-1 uppercase">Remote Lab Vetting Phase: Alpha</p>
      </div>
    </div>
  );
};

// VR Command Simulator
export const VRCommandSimulator: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Central Data Core (Sphere)
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const coreMat = new THREE.MeshPhongMaterial({ 
      color: 0x0062FF, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Floating Data Nodes
    const nodeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const nodes: THREE.Mesh[] = [];

    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshPhongMaterial({ 
        color: i % 3 === 0 ? 0xFF2D55 : (i % 3 === 1 ? 0x00C853 : 0x0062FF),
        emissive: i % 3 === 0 ? 0xFF2D55 : (i % 3 === 1 ? 0x00C853 : 0x0062FF),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
      });
      const node = new THREE.Mesh(nodeGeo, material);
      const angle = (i / 20) * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      node.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );
      scene.add(node);
      nodes.push(node);

      // Connecting lines to core
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        node.position
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x393939, transparent: true, opacity: 0.1 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    }

    const light = new THREE.PointLight(0xffffff, 80);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    const ambient = new THREE.AmbientLight(0x202020);
    scene.add(ambient);

    camera.position.z = 10;
    camera.position.y = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      core.rotation.y += 0.002;
      core.rotation.x += 0.001;
      
      nodes.forEach((n, idx) => {
        n.rotation.y += 0.02;
        n.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.005;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-[#050505] overflow-hidden rounded-sm border border-[#393939] shadow-2xl">
      {/* Three.js Layer */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* CRT Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] z-10" />

      {/* VR HUD UI */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className="w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite] opacity-30" />
         <div className="absolute w-[400px] h-[400px] border-2 border-dashed border-[#0062FF]/10 rounded-full animate-[spin_30s_linear_infinite_reverse] opacity-20" />
      </div>

      <div className="absolute top-10 left-10 p-8 bg-black/40 backdrop-blur-3xl border border-white/10 w-80 z-20">
        <div className="flex items-center gap-3 mb-6">
           <Monitor className="w-5 h-5 text-[#0062FF]" />
           <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Spatial Command V2</h4>
        </div>
        <h2 className="text-2xl font-light text-white leading-tight mb-6">Immersive <span className="font-bold">Risk Hub</span></h2>
        
        <div className="space-y-6">
           <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] mt-1.5" />
              <div className="space-y-1">
                 <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Telepresence Active</p>
                 <p className="text-[9px] text-white/40 leading-relaxed font-mono">NODE: CLUSTER_EAST_VR</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-1.5 animate-pulse" />
              <div className="space-y-1">
                 <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Anomaly Grabbing Enabled</p>
                 <p className="text-[9px] text-white/40 leading-relaxed font-mono">MODE: INSPECTION_DIRECT</p>
              </div>
           </div>
        </div>

        <div className="mt-10 flex gap-2">
           <div className="h-1 flex-1 bg-white/5"><div className="h-full bg-[#0062FF] w-[70%]" /></div>
           <div className="h-1 flex-1 bg-white/5"><div className="h-full bg-[#00C853] w-[40%]" /></div>
           <div className="h-1 flex-1 bg-white/5"><div className="h-full bg-[#FF2D55] w-[90%]" /></div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-6 z-20">
         <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-1">Collaborative Environment</p>
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border border-black bg-gradient-to-br from-[#161616] to-[#393939] flex items-center justify-center text-[10px] font-bold text-white">AV</div>
                 ))}
              </div>
           </div>
         </div>
         <button className="px-8 py-3 bg-[#0062FF] hover:bg-[#0052cc] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 group shadow-2xl shadow-[#0062FF]/20">
           Initialize VR Session
           <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
         </button>
      </div>
      
      {/* Floating HUD Gauges Bottom Left */}
      <div className="absolute bottom-10 left-10 flex gap-8 pointer-events-none z-20">
         <div className="space-y-2">
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Core_Temp</p>
            <div className="h-24 w-1 bg-white/5 relative">
               <div className="absolute bottom-0 w-full bg-[#0062FF] h-16 shadow-[0_0_10px_#0062FF]" />
            </div>
         </div>
         <div className="space-y-2">
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Logic_Flux</p>
            <div className="h-24 w-1 bg-white/5 relative">
               <div className="absolute bottom-0 w-full bg-[#00C853] h-20 shadow-[0_0_10px_#00C853]" />
            </div>
         </div>
         <div className="space-y-2">
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Risk_Volume</p>
            <div className="h-24 w-1 bg-white/5 relative">
               <div className="absolute bottom-0 w-full bg-[#FF2D55] h-12 shadow-[0_0_10px_#FF2D55]" />
            </div>
         </div>
      </div>
    </div>
  );
};
