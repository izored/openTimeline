import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';

interface ColorCubeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ColorCube({ isOpen, onClose }: ColorCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());

  const [rotSpeed, setRotSpeed] = useState(0.4);
  const [colorSpeed, setColorSpeed] = useState(0.6);
  const [deform, setDeform] = useState(0.3);

  const targetRotSpeedRef = useRef(0.4);
  const targetColorSpeedRef = useRef(0.6);
  const targetDeformRef = useRef(0.3);
  const currentRotSpeedRef = useRef(0.4);
  const currentColorSpeedRef = useRef(0.6);

  useEffect(() => {
    targetRotSpeedRef.current = rotSpeed;
  }, [rotSpeed]);

  useEffect(() => {
    targetColorSpeedRef.current = colorSpeed;
  }, [colorSpeed]);

  useEffect(() => {
    targetDeformRef.current = deform;
  }, [deform]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Always dark for cube

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(3.5, 2.8, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Cube geometry
    const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2, 4, 4, 4);
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Store original positions and color norms
    const origPositions: THREE.Vector3[] = [];
    const origColorNorms: { r: number; g: number; b: number }[] = [];

    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      origPositions.push(new THREE.Vector3(x, y, z));

      const xNorm = Math.max(0, Math.min(1, x / 1.1 + 0.5));
      const yNorm = Math.max(0, Math.min(1, y / 1.1 + 0.5));
      const zNorm = Math.max(0, Math.min(1, z / 1.1 + 0.5));
      origColorNorms.push({ r: xNorm, g: yNorm, b: zNorm });
    }

    // Initial colors
    const colors = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      const c = origColorNorms[i];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Mesh
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    cubeGroup.add(mesh);

    // Wireframe overlay
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.12,
      transparent: true,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    cubeGroup.add(edges);

    // Axes
    const axesGroup = new THREE.Group();
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true,
    });

    // X axis (red-ish)
    const xAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.5, 0, 0),
    ]);
    axesGroup.add(new THREE.Line(xAxisGeo, new THREE.LineBasicMaterial({ color: 0xe85d5d, opacity: 0.3, transparent: true })));

    // Y axis (green-ish)
    const yAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 2.5, 0),
    ]);
    axesGroup.add(new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({ color: 0x2dd4a8, opacity: 0.3, transparent: true })));

    // Z axis (blue-ish)
    const zAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 2.5),
    ]);
    axesGroup.add(new THREE.Line(zAxisGeo, new THREE.LineBasicMaterial({ color: 0x4a9eff, opacity: 0.3, transparent: true })));

    scene.add(axesGroup);

    // Label sprites for axes
    function createLabel(text: string, color: string): THREE.Sprite {
      const canvas2d = document.createElement('canvas');
      canvas2d.width = 64;
      canvas2d.height = 32;
      const ctx = canvas2d.getContext('2d')!;
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, 32, 22);

      const texture = new THREE.CanvasTexture(canvas2d);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.8, 0.4, 1);
      return sprite;
    }

    const xLabel = createLabel('R', '#e85d5d');
    xLabel.position.set(2.6, 0.1, 0);
    axesGroup.add(xLabel);

    const yLabel = createLabel('G', '#2dd4a8');
    yLabel.position.set(0.1, 2.6, 0);
    axesGroup.add(yLabel);

    const zLabel = createLabel('B', '#4a9eff');
    zLabel.position.set(0, 0.1, 2.6);
    axesGroup.add(zLabel);

    // Vertex color update
    function updateVertexColors(time: number, speed: number) {
      const colorAttr = geometry.attributes.color;
      for (let i = 0; i < vertexCount; i++) {
        const base = origColorNorms[i];
        const t = time * speed;
        const cycle = Math.sin(t + (base.r + base.g + base.b) * 2.0) * 0.5 + 0.5;

        function channelCycle(baseVal: number, cyc: number): number {
          let v = baseVal * (0.6 + 0.4 * cyc);
          v += Math.sin(t * 1.3 + baseVal * 7.5) * 0.08;
          return Math.max(0, Math.min(1, v));
        }

        const r = channelCycle(base.r, cycle);
        const g = channelCycle(base.g, cycle);
        const b = channelCycle(base.b, cycle);

        colorAttr.setXYZ(i, r, g, b);
      }
      colorAttr.needsUpdate = true;
    }

    // Vertex deformation
    function updateVertexDeformation(time: number, deformAmount: number) {
      const posAttr = geometry.attributes.position;
      const freq = 2.5;
      const amp = 0.35 * deformAmount;
      const t = time * 1.2;

      for (let i = 0; i < vertexCount; i++) {
        const pos = origPositions[i];
        const dx = Math.sin(pos.y * freq + t) * Math.cos(pos.z * freq + t) * amp;
        const dy = Math.cos(pos.x * freq + t) * Math.sin(pos.z * freq + t) * amp;
        const dz = Math.sin(pos.x * freq + t) * Math.cos(pos.y * freq + t) * amp;
        posAttr.setXYZ(i, pos.x + dx, pos.y + dy, pos.z + dz);
      }
      posAttr.needsUpdate = true;
    }

    // Animation loop
    const clock = clockRef.current;
    clock.start();

    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      clock.getDelta();
      const time = clock.getElapsedTime();

      // Lerp values
      currentRotSpeedRef.current += (targetRotSpeedRef.current - currentRotSpeedRef.current) * 0.05;
      currentColorSpeedRef.current += (targetColorSpeedRef.current - currentColorSpeedRef.current) * 0.05;

      // Rotate cube
      cubeGroup.rotation.y = time * currentRotSpeedRef.current * 0.5;
      cubeGroup.rotation.x = Math.sin(time * 0.2) * 0.15;

      // Update vertices
      updateVertexColors(time, currentColorSpeedRef.current);
      updateVertexDeformation(time, targetDeformRef.current);

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    function onResize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
    window.addEventListener('resize', onResize);

    // Keyboard
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      clock.stop();

      geometry.dispose();
      material.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      xAxisGeo.dispose();
      yAxisGeo.dispose();
      zAxisGeo.dispose();
      axisMaterial.dispose();
      renderer.dispose();

      if (containerRef.current && canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
      canvasRef.current = null;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" style={{ background: '#1a1a1a' }}>
      {/* Canvas container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Close color cube"
      >
        <X size={32} />
      </button>

      {/* Title */}
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-xl font-semibold text-text-primary">ColorCube</h2>
        <p className="text-xs text-text-secondary mt-1">Interactive RGB Color Space Visualization</p>
      </div>

      {/* Slider panel */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col md:flex-row gap-6 px-7 py-5 rounded-xl border border-white/[0.08]"
        style={{ background: 'rgba(26, 26, 26, 0.9)', backdropFilter: 'blur(12px)', minWidth: 400 }}
      >
        <SliderControl label="Rotation" min={0} max={2.0} step={0.1} value={rotSpeed} onChange={setRotSpeed} />
        <SliderControl label="Color Flow" min={0} max={3.0} step={0.1} value={colorSpeed} onChange={setColorSpeed} />
        <SliderControl label="Deform" min={0} max={1.5} step={0.05} value={deform} onChange={setDeform} />
      </div>
    </div>
  );
}

function SliderControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.06em]">{label}</span>
        <span className="text-[13px] text-text-primary ml-2">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-[140px] h-1 bg-white/[0.12] rounded-full appearance-none cursor-pointer accent-teal-slider"
        style={{
          accentColor: '#2dd4a8',
        }}
      />
    </div>
  );
}
