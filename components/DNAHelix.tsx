
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Mutation {
  index: number;
  gene: string;
  impact: string;
  score: number;
}

interface DNAHelixProps {
  mutations?: Mutation[];
}

const DNAHelix: React.FC<DNAHelixProps> = ({ 
  mutations = [
    { index: 5, gene: 'BRCA1', impact: 'High Pathogenicity', score: 9.2 },
    { index: 12, gene: 'TP53', impact: 'Loss of Function', score: 8.7 },
    { index: 18, gene: 'PTEN', impact: 'Structural Anomaly', score: 7.4 }
  ] 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: Mutation | null }>({ x: 0, y: 0, content: null });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // DNA Geometry constants
    const r = 2; // Radius
    const h = 0.5; // Vertical step
    const count = 30; // Number of base pairs
    const dnaObjects: THREE.Mesh[] = [];

    for (let i = 0; i < count; i++) {
      const angle = i * 0.4;
      const y = (i - count / 2) * h;

      // Base spheres for both strands
      const mutation = mutations.find(m => m.index === i);
      const color = mutation ? 0xFF2D55 : 0x0062FF;
      const size = mutation ? 0.25 : 0.15;

      const sphereGeo = new THREE.SphereGeometry(size, 16, 16);
      const sphereMat = new THREE.MeshPhongMaterial({ 
        color, 
        emissive: color, 
        emissiveIntensity: mutation ? 0.5 : 0.1 
      });

      // Strand 1
      const s1 = new THREE.Mesh(sphereGeo, sphereMat);
      s1.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      s1.userData = { mutation };
      group.add(s1);
      dnaObjects.push(s1);

      // Strand 2
      const s2 = new THREE.Mesh(sphereGeo, sphereMat);
      s2.position.set(Math.cos(angle + Math.PI) * r, y, Math.sin(angle + Math.PI) * r);
      s2.userData = { mutation };
      group.add(s2);
      dnaObjects.push(s2);

      // Connector (Rung)
      const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, r * 2);
      const rungMat = new THREE.MeshPhongMaterial({ color: 0x393939, transparent: true, opacity: 0.6 });
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      group.add(rung);
    }

    const light = new THREE.PointLight(0xffffff, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 12;

    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(dnaObjects);

      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj.userData.mutation) {
          setTooltip({
            x: event.clientX - rect.left + 15,
            y: event.clientY - rect.top + 15,
            content: obj.userData.mutation
          });
        }
      } else {
        setTooltip(prev => ({ ...prev, content: null }));
      }
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('mousemove', onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [mutations]);

  return (
    <div className="relative w-full h-full bg-[#161616] border border-[#393939] overflow-hidden group">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-[0.2em] mb-1">Live Sequence Viewer</h4>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse" />
           <span className="text-[9px] text-white font-mono uppercase tracking-widest">Mutation Detection Active</span>
        </div>
      </div>
      
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {tooltip.content && (
        <div 
          className="dna-tooltip absolute bg-[#262626] border border-[#FF2D55] p-3 shadow-2xl"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-[10px] font-bold text-[#FF2D55] uppercase tracking-widest mb-1">Gene: {tooltip.content.gene}</p>
          <p className="text-[11px] text-white font-medium mb-1">{tooltip.content.impact}</p>
          <div className="flex justify-between items-center gap-4 border-t border-[#393939] mt-2 pt-2">
            <span className="text-[9px] text-[#A8A8A8] uppercase tracking-widest">Risk Score</span>
            <span className="text-[10px] font-mono font-bold text-white">{tooltip.content.score}/10</span>
          </div>
        </div>
      )}

      {/* Grid Overlay for Scientific Look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};

export default DNAHelix;
