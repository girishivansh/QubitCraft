import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { BlochVector } from '../simulation/simulationTypes';
import { RefreshCw, Atom, Info, Maximize, Minimize } from 'lucide-react';

interface BlochSphereProps {
  blochVectors?: Record<number, BlochVector>;
  numQubits: number;
}

// Custom Axis component with an arrow head
function AxisLine({ points, color }: { points: [number, number, number][], color: string }) {
  const start = new THREE.Vector3(...points[0]);
  const end = new THREE.Vector3(...points[1]);
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  
  // Calculate quaternion for cone
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

  return (
    <group>
      <Line points={points} color={color} lineWidth={2} opacity={0.7} transparent />
      <Cone 
        args={[0.04, 0.12, 16]} 
        position={[end.x, end.y, end.z]} 
        quaternion={quaternion}
      >
        <meshBasicMaterial color={color} opacity={0.9} transparent />
      </Cone>
    </group>
  );
}

function BlochSphere3D({ vector }: { vector: BlochVector }) {
  const arrowRef = useRef<THREE.Group>(null);

  // Mapping:
  // Three.X = Quantum.X (Red)
  // Three.Y = Quantum.Z (Blue)
  // Three.Z = Quantum.Y (Green)
  const targetDir = new THREE.Vector3(vector.x, vector.z, vector.y);
  const length = targetDir.length();
  if (length === 0) targetDir.set(0, 1, 0); // fallback if completely mixed/zero
  else targetDir.normalize();

  useFrame(() => {
    if (arrowRef.current) {
      const currentDir = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(currentDir, targetDir);
      arrowRef.current.quaternion.slerp(quaternion, 0.15); 
    }
  });

  const R = 1.0; // Sphere radius
  const L = 1.35; // Label distance
  
  const colorX = "#ef4444"; // Red
  const colorY = "#22c55e"; // Green
  const colorZ = "#3b82f6"; // Blue
  const colorState = "#a855f7"; // Purple

  return (
    <group>
      {/* Great circles with dashed lines (approximated with many small segments or just solid thin lines for performance) */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[R, 0.003, 16, 64]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <torusGeometry args={[R, 0.003, 16, 64]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0, Math.PI/2, 0]}>
        <torusGeometry args={[R, 0.003, 16, 64]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
      </mesh>

      {/* Sphere volume */}
      <mesh>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial color="#e0e7ff" transparent opacity={0.2} roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Coordinate Axes */}
      <AxisLine points={[[0, -R * 1.15, 0], [0, R * 1.15, 0]]} color={colorZ} /> {/* Z */}
      <AxisLine points={[[-R * 1.15, 0, 0], [R * 1.15, 0, 0]]} color={colorX} /> {/* X */}
      <AxisLine points={[[0, 0, -R * 1.15], [0, 0, R * 1.15]]} color={colorY} /> {/* Y */}

      {/* Clear DOM Labels placed far enough to avoid clipping */}
      <Html position={[0, L, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|0⟩</div>
          <div className="text-sm font-bold text-blue-500">+Z</div>
        </div>
      </Html>
      <Html position={[0, -L, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-blue-500">-Z</div>
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|1⟩</div>
        </div>
      </Html>
      
      <Html position={[L, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-red-500">+X</div>
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|+⟩</div>
        </div>
      </Html>
      <Html position={[-L, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-red-500">-X</div>
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|−⟩</div>
        </div>
      </Html>
      
      <Html position={[0, 0, L]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|+i⟩</div>
          <div className="text-sm font-bold text-green-500">+Y</div>
        </div>
      </Html>
      <Html position={[0, 0, -L]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-green-500">-Y</div>
          <div className="font-serif text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">|−i⟩</div>
        </div>
      </Html>

      {/* THE HERO: State Vector */}
      <group ref={arrowRef}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, length, 16]} />
          <meshBasicMaterial color={colorState} />
        </mesh>
        
        {/* State point with halo */}
        {length > 0 && (
          <mesh position={[0, length, 0]}>
            <sphereGeometry args={[0.06, 24, 24]} />
            <meshBasicMaterial color={colorState} />
            <mesh scale={[2.0, 2.0, 2.0]}>
              <sphereGeometry args={[0.06, 24, 24]} />
              <meshBasicMaterial color={colorState} transparent opacity={0.2} />
            </mesh>
          </mesh>
        )}
      </group>
    </group>
  );
}

function getStateInfo(v: BlochVector) {
  const eps = 0.05;
  if (Math.abs(v.z - 1) < eps) return { symbol: '|0⟩', desc: 'Computational basis state', detail: 'The qubit is in the definitive |0⟩ state, pointing along the +Z axis.' };
  if (Math.abs(v.z + 1) < eps) return { symbol: '|1⟩', desc: 'Computational basis state', detail: 'The qubit is in the definitive |1⟩ state, pointing along the -Z axis.' };
  if (Math.abs(v.x - 1) < eps) return { symbol: '|+⟩', desc: 'Superposition state', detail: 'The qubit is in an equal superposition of |0⟩ and |1⟩, pointing along the +X axis.' };
  if (Math.abs(v.x + 1) < eps) return { symbol: '|−⟩', desc: 'Superposition state', detail: 'The qubit is in an equal superposition of |0⟩ and |1⟩ with a relative phase of π, pointing along the -X axis.' };
  if (Math.abs(v.y - 1) < eps) return { symbol: '|+i⟩', desc: 'Superposition state', detail: 'The qubit is in an equal superposition of |0⟩ and |1⟩ with a relative phase of π/2, pointing along the +Y axis.' };
  if (Math.abs(v.y + 1) < eps) return { symbol: '|−i⟩', desc: 'Superposition state', detail: 'The qubit is in an equal superposition of |0⟩ and |1⟩ with a relative phase of 3π/2, pointing along the -Y axis.' };
  return { symbol: '|ψ⟩', desc: 'Arbitrary quantum state', detail: 'The qubit is in a superposition of |0⟩ and |1⟩ with arbitrary amplitudes.' };
}

function calculateStateDetails(v: BlochVector) {
  const p0 = (1 + v.z) / 2;
  const p1 = (1 - v.z) / 2;
  
  const mag0 = Math.sqrt(p0);
  const mag1 = Math.sqrt(p1);
  
  let phase = 0;
  if (v.x !== 0 || v.y !== 0) {
    phase = Math.atan2(v.y, v.x);
  }
  
  const alphaReal = mag0;
  const alphaImag = 0;
  const betaReal = mag1 * Math.cos(phase);
  const betaImag = mag1 * Math.sin(phase);
  
  return { p0, p1, alphaReal, alphaImag, betaReal, betaImag };
}

function formatComplex(real: number, imag: number) {
  const r = real.toFixed(3);
  const i = Math.abs(imag).toFixed(3);
  const sign = imag >= 0 ? '+' : '-';
  return `${r} ${sign} ${i}i`;
}

export function BlochSphere({ blochVectors, numQubits }: BlochSphereProps) {
  const [selectedQubit, setSelectedQubit] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Prevent the entire sidebar from scrolling when zooming in/out of the 3D canvas
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener('wheel', preventScroll, { passive: false });
    return () => el.removeEventListener('wheel', preventScroll);
  }, []);

  if (!blochVectors || Object.keys(blochVectors).length === 0) {
    return <div className="text-sm text-slate-500 text-center py-8">No Bloch vector data available</div>;
  }

  const currentVector = blochVectors[selectedQubit] || { x: 0, y: 0, z: 1 };
  const stateInfo = getStateInfo(currentVector);
  const details = calculateStateDetails(currentVector);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-[200] bg-white dark:bg-[#0d0e24] flex flex-col p-6 overflow-hidden select-none" 
    : "flex flex-col h-full w-full bg-white dark:bg-[#0d0e24] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative select-none";

  return (
    <div className={containerClasses}>
      
      {/* 1. Integrated Top Studio Bar */}
      <div className="h-14 px-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d0e24] flex items-center justify-between flex-shrink-0 gap-3">
        {/* Left: Title & Qubit Selector */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto custom-scrollbar py-1">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Atom size={18} strokeWidth={2} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Interactive Bloch Sphere</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block">Unit sphere quantum state geometry</p>
            </div>
          </div>

          {/* Qubit Selector Pills */}
          {numQubits > 1 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 flex-shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Qubit:</span>
              <div className="flex gap-1">
                {Array.from({ length: numQubits }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQubit(i)}
                    className={`px-2.5 py-1 rounded-md font-bold text-xs font-mono transition-all ${
                      selectedQubit === i 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    q{i}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Active State Pill, Reset & Fullscreen */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Active state pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/60 rounded-lg text-xs font-semibold text-purple-800 dark:text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-serif font-bold text-sm">{stateInfo.symbol}</span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-normal">({stateInfo.desc})</span>
          </div>

          {/* Reset Camera */}
          <button 
            onClick={resetCamera}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors text-xs shadow-xs"
            title="Reset 3D camera orientation"
          >
            <RefreshCw size={13} className="text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Fullscreen Toggle */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-xs shadow-xs"
            title="Toggle full screen"
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Body: Full 3D Canvas + Side Info Panel */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* Left / Center: Full Card 3D Canvas */}
        <div className="flex-1 h-full min-h-[360px] relative flex flex-col bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-[#0d0e24] dark:via-[#070813] dark:to-[#0d0e24] overflow-hidden">
          
          {/* 3D Canvas Area */}
          <div 
            ref={canvasContainerRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Canvas camera={{ position: [2.9, 1.4, 2.9], fov: 38 }}>
              <ambientLight intensity={1.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.6} />
              <BlochSphere3D vector={currentVector} />
              <OrbitControls 
                ref={controlsRef} 
                enablePan={false} 
                enableZoom={true} 
                minDistance={1.8} 
                maxDistance={8} 
              />
            </Canvas>
          </div>

          {/* Floating Bottom HUD Overlay: Coordinates & Axes Legend */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none z-10">
            {/* Coordinate values & State HUD */}
            <div className="pointer-events-auto bg-white/90 dark:bg-[#070813]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-3 text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider font-sans">Vector:</span>
              <span className="text-red-600 dark:text-red-400 font-bold">X: {currentVector.x >= 0 ? '+' : ''}{currentVector.x.toFixed(3)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Y: {currentVector.y >= 0 ? '+' : ''}{currentVector.y.toFixed(3)}</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Z: {currentVector.z >= 0 ? '+' : ''}{currentVector.z.toFixed(3)}</span>
            </div>

            {/* Axes Legend HUD */}
            <div className="pointer-events-auto bg-white/90 dark:bg-[#070813]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs" />
                <span>State</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>X (|+⟩)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Y (|+i⟩)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Z (|0⟩)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Info Drawer */}
        <div className="w-full lg:w-80 h-full border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070813]/80 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-shrink-0">
          
          {/* Current State Card */}
          <div className="bg-white dark:bg-[#0d0e24] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current State</div>
            
            <div className="flex items-center gap-3 my-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center flex-shrink-0 shadow-xs">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">{stateInfo.symbol}</div>
                <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">{stateInfo.desc}</div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 rounded-lg p-2.5">
              {stateInfo.detail}
            </p>
          </div>

          {/* Probabilities & Amplitudes Card */}
          <div className="bg-white dark:bg-[#0d0e24] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Measurement Probabilities</div>
            
            {/* |0> probability */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="font-serif">P(|0⟩)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{(details.p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(0, details.p0 * 100))}%` }} 
                />
              </div>
            </div>

            {/* |1> probability */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="font-serif">P(|1⟩)</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">{(details.p1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(0, details.p1 * 100))}%` }} 
                />
              </div>
            </div>

            {/* Complex Amplitudes */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Amplitude α (|0⟩)</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{formatComplex(details.alphaReal, details.alphaImag)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Amplitude β (|1⟩)</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{formatComplex(details.betaReal, details.betaImag)}</span>
              </div>
            </div>
          </div>

          {/* Educational Guide Card */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
            <Info size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Drag on the canvas to rotate the sphere in 3D. The purple vector represents the quantum state vector $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
