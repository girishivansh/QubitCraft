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

// Arrow component for the Legend
function LegendArrow({ color }: { color: string }) {
  return (
    <div className="flex items-center">
      <div className="w-6 h-0.5" style={{ backgroundColor: color }}></div>
      <div 
        className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-t-transparent border-b-transparent" 
        style={{ borderLeftColor: color }}
      ></div>
    </div>
  );
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
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|0⟩</div>
          <div className="text-sm font-bold text-blue-500">+Z</div>
        </div>
      </Html>
      <Html position={[0, -L, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-blue-500">-Z</div>
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|1⟩</div>
        </div>
      </Html>
      
      <Html position={[L, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-red-500">+X</div>
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|+⟩</div>
        </div>
      </Html>
      <Html position={[-L, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-red-500">-X</div>
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|−⟩</div>
        </div>
      </Html>
      
      <Html position={[0, 0, L]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|+i⟩</div>
          <div className="text-sm font-bold text-green-500">+Y</div>
        </div>
      </Html>
      <Html position={[0, 0, -L]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-green-500">-Y</div>
          <div className="font-serif text-xl font-bold text-slate-800 leading-none">|−i⟩</div>
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
    ? "fixed inset-0 z-[200] bg-slate-50 flex flex-col p-6 overflow-hidden" 
    : "flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-4 space-y-4";

  return (
    <div className={containerClasses}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isFullscreen ? 'mb-4' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="text-indigo-600 mt-1"><Atom size={28} strokeWidth={1.5} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Interactive Bloch Sphere</h2>
            <p className="text-sm text-slate-500">Visualize the quantum state of a single qubit in 3D. Drag to rotate, scroll to zoom.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetCamera}
            className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCw size={16} />
            <span>Reset View</span>
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 h-full">
        {/* Left Side: 3D Canvas */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Qubit Selector */}
          {numQubits > 1 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-700">Select Qubit:</span>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: numQubits }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQubit(i)}
                    className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors ${
                      selectedQubit === i 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    q{i}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Canvas Container */}
          <div 
            ref={canvasContainerRef}
            className="flex-1 min-h-[400px] w-full rounded-xl bg-white border border-slate-100 relative"
          >
            <Canvas camera={{ position: [3, 1.5, 3], fov: 40 }}>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
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
        </div>

        {/* Right Side: Info Cards */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          
          {/* Current State Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center">
            <div className="w-full text-left text-sm font-bold text-slate-700 mb-2">Current State</div>
            <div className="flex items-center gap-4 my-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
              <div className="text-5xl font-serif text-slate-800 tracking-tighter">{stateInfo.symbol}</div>
            </div>
            <div className="text-xs text-slate-500 mb-4">({stateInfo.desc})</div>
            <div className="bg-indigo-50/50 rounded-lg p-3 text-sm text-indigo-800 w-full text-center border border-indigo-100">
              {stateInfo.detail}
            </div>
          </div>

          {/* Coordinates Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-3">Bloch Vector Coordinates</div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                <span className="font-bold text-red-500">X</span>
                <span className="text-slate-800">{currentVector.x > 0 ? '+' : ''}{currentVector.x.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                <span className="font-bold text-green-500">Y</span>
                <span className="text-slate-800">{currentVector.y > 0 ? '+' : ''}{currentVector.y.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                <span className="font-bold text-blue-500">Z</span>
                <span className="text-slate-800">{currentVector.z > 0 ? '+' : ''}{currentVector.z.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* State Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-3">State Details</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Amplitude α (|0⟩)</span>
                <span className="font-mono text-slate-700">{formatComplex(details.alphaReal, details.alphaImag)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Amplitude β (|1⟩)</span>
                <span className="font-mono text-slate-700">{formatComplex(details.betaReal, details.betaImag)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Probability |0⟩</span>
                <span className="font-mono text-slate-700">{(details.p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Probability |1⟩</span>
                <span className="font-mono text-slate-700">{(details.p1 * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Explanation Footer */}
      <div className="flex flex-col gap-3">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>
            <span>Current State</span>
          </div>
          <div className="flex items-center gap-2">
            <LegendArrow color="#a855f7" />
            <span>State Vector</span>
          </div>
          <div className="flex items-center gap-2">
            <LegendArrow color="#ef4444" />
            <span>X axis (|+⟩ / |−⟩)</span>
          </div>
          <div className="flex items-center gap-2">
            <LegendArrow color="#22c55e" />
            <span>Y axis (|+i⟩ / |−i⟩)</span>
          </div>
          <div className="flex items-center gap-2">
            <LegendArrow color="#3b82f6" />
            <span>Z axis (|0⟩ / |1⟩)</span>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <div className="text-indigo-600 mt-0.5"><Info size={20} /></div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900 mb-1">What am I seeing?</h4>
            <p className="text-xs text-indigo-800 leading-relaxed">
              The Bloch sphere is a geometric representation of the pure state space of a single qubit. The north and south poles represent |0⟩ and |1⟩. Points on the surface represent all possible pure states. The purple vector shows the current state of the selected qubit.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
