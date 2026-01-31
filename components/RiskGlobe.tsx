
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Vendor } from '../types';

interface RiskGlobeProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectVendor: (v: Vendor) => void;
  viewMode: 'HEATMAP' | 'SUPPLY_CHAIN';
}

const RiskGlobe: React.FC<RiskGlobeProps> = ({ vendors, selectedVendor, onSelectVendor, viewMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{ x: number, y: number, name: string } | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const isTransitioning = useRef(false);

  // Helper: Lat/Lng to Vector3
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    
    // 1. Realistic High-Quality Earth Base
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthNormal = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecular = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

    const sphereGeo = new THREE.SphereGeometry(5, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: earthNormal,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x333333),
      shininess: 15,
    });
    const earth = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earth);

    // 2. Subtle Cloud Layer
    const cloudTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');
    const cloudGeo = new THREE.SphereGeometry(5.08, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(clouds);

    // 3. Atmosphere Glow
    const atmosphereGeo = new THREE.SphereGeometry(6.2, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // 4. Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    camera.position.z = 16;

    // 5. Vendor Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const sonarRings: THREE.Mesh[] = [];

    vendors.forEach(v => {
      if (!v.location) return;
      const pos = latLngToVector3(v.location.lat, v.location.lng, 5.15);
      const color = v.overallScore > 7 ? 0xFF2D55 : (v.overallScore > 4 ? 0xFFD600 : 0x00C853);
      
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshPhongMaterial({ 
        color, 
        emissive: color, 
        emissiveIntensity: 0.8 
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(pos);
      node.userData = { vendor: v };
      globeGroup.add(node);
      nodeMeshes.push(node);

      if (v.overallScore > 7) {
        const ringGeo = new THREE.RingGeometry(0.15, 0.28, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF2D55, transparent: true, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0,0,0));
        ring.userData = { isRing: true };
        globeGroup.add(ring);
        sonarRings.push(ring);
      }
    });

    // 6. Supply Chain Arcs
    if (viewMode === 'SUPPLY_CHAIN') {
      vendors.forEach(v => {
        v.dependencies?.forEach(depId => {
          const dep = vendors.find(vend => vend.id === depId);
          if (v.location && dep?.location) {
            const start = latLngToVector3(v.location.lat, v.location.lng, 5.1);
            const end = latLngToVector3(dep.location.lat, dep.location.lng, 5.1);
            
            const distance = start.distanceTo(end);
            const mid = start.clone().lerp(end, 0.5).multiplyScalar(1 + distance * 0.15);
            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(50);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({ 
              color: v.overallScore > 7 ? 0xFF2D55 : 0x0062FF,
              transparent: true,
              opacity: 0.4
            });
            const line = new THREE.Line(lineGeo, lineMat);
            globeGroup.add(line);
          }
        });
      });
    }

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => { 
      isDragging = true; 
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
      isTransitioning.current = false;
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        };
        globeGroup.rotation.y += deltaMove.x * 0.005;
        globeGroup.rotation.x += deltaMove.y * 0.005;
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
      }

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      
      if (intersects.length > 0) {
        const v = intersects[0].object.userData.vendor as Vendor;
        setHoveredInfo({ x: e.clientX - rect.left, y: e.clientY - rect.top, name: v.name });
        mountRef.current!.style.cursor = 'pointer';
      } else {
        setHoveredInfo(null);
        mountRef.current!.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isDragging) return;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        onSelectVendor(intersects[0].object.userData.vendor);
      }
    };

    mountRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      
      if (!isDragging && !selectedVendor) {
        globeGroup.rotation.y += 0.001;
      }

      // Smooth interpolation for selected vendor
      if (isTransitioning.current && !isDragging) {
        globeGroup.rotation.x += (targetRotation.current.x - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.y += (targetRotation.current.y - globeGroup.rotation.y) * 0.05;
        if (Math.abs(globeGroup.rotation.x - targetRotation.current.x) < 0.01 && 
            Math.abs(globeGroup.rotation.y - targetRotation.current.y) < 0.01) {
          isTransitioning.current = false;
        }
      }
      
      clouds.rotation.y += 0.0012;

      sonarRings.forEach(ring => {
        ring.scale.x += 0.012;
        ring.scale.y += 0.012;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity -= 0.012;
        if (mat.opacity <= 0) {
           ring.scale.set(1, 1, 1);
           mat.opacity = 0.8;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [vendors, viewMode, onSelectVendor]);

  // Handle auto-rotation to selected vendor
  useEffect(() => {
    if (selectedVendor && selectedVendor.location && globeGroupRef.current) {
      const { lat, lng } = selectedVendor.location;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      targetRotation.current = {
        x: phi - Math.PI / 2,
        y: -theta + Math.PI / 2
      };
      isTransitioning.current = true;
    }
  }, [selectedVendor]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mountRef} className="w-full h-full" />
      {hoveredInfo && (
        <div 
          className="absolute pointer-events-none bg-black/90 border border-white/20 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest z-50 shadow-2xl animate-in fade-in zoom-in duration-200 backdrop-blur-sm"
          style={{ left: hoveredInfo.x + 15, top: hoveredInfo.y - 10 }}
        >
          {hoveredInfo.name}
        </div>
      )}
      
      {selectedVendor && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="w-32 h-32 border-2 border-white/30 rounded-full animate-[ping_2s_infinite]" />
        </div>
      )}
    </div>
  );
};

export default RiskGlobe;
