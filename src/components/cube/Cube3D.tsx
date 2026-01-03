import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CubeState, FaceColor, RotationAnimation, Face } from '@/lib/rubik/types';
import { FACE_COLORS } from '@/lib/rubik/constants';

interface Cube3DProps {
  cubeState: CubeState;
  rotationAnimation: RotationAnimation | null;
}

interface CubieFaceProps {
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function CubieFace({ color, position, rotation }: CubieFaceProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.85, 0.85]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

interface CubieProps {
  position: [number, number, number];
  colors: { [key: string]: string };
}

function Cubie({ position, colors }: CubieProps) {
  return (
    <group position={position}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#111111" />
      </RoundedBox>
      
      {/* Face stickers */}
      {colors.right && <CubieFace color={colors.right} position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]} />}
      {colors.left && <CubieFace color={colors.left} position={[-0.48, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />}
      {colors.top && <CubieFace color={colors.top} position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} />}
      {colors.bottom && <CubieFace color={colors.bottom} position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]} />}
      {colors.front && <CubieFace color={colors.front} position={[0, 0, 0.48]} rotation={[0, 0, 0]} />}
      {colors.back && <CubieFace color={colors.back} position={[0, 0, -0.48]} rotation={[0, Math.PI, 0]} />}
    </group>
  );
}

// Face label component - floats near each face using Html for reliable rendering
function FaceLabel({ face, position }: { face: string; position: [number, number, number] }) {
  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-white text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] select-none">
        {face}
      </div>
    </Html>
  );
}

// Check if a cubie at position is affected by a face rotation
function isAffectedByRotation(position: [number, number, number], face: Face): boolean {
  const [x, y, z] = position;
  switch (face) {
    case 'R': return x === 1;
    case 'L': return x === -1;
    case 'U': return y === 1;
    case 'D': return y === -1;
    case 'F': return z === 1;
    case 'B': return z === -1;
    default: return false;
  }
}

// Get rotation axis for a face - returns normalized axis (direction determined by angle sign)
function getRotationAxis(face: Face): THREE.Vector3 {
  switch (face) {
    case 'R': return new THREE.Vector3(1, 0, 0);
    case 'L': return new THREE.Vector3(1, 0, 0);
    case 'U': return new THREE.Vector3(0, 1, 0);
    case 'D': return new THREE.Vector3(0, 1, 0);
    case 'F': return new THREE.Vector3(0, 0, 1);
    case 'B': return new THREE.Vector3(0, 0, 1);
    default: return new THREE.Vector3(0, 1, 0);
  }
}

interface CubieData {
  position: [number, number, number];
  colors: { [key: string]: string };
}

function CubeGroup({ cubeState, rotationAnimation }: { cubeState: CubeState; rotationAnimation: RotationAnimation | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const staticGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle idle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + state.clock.elapsedTime * 0.05;
    }
    
    // Apply rotation animation
    if (rotatingGroupRef.current && rotationAnimation?.isAnimating) {
      const axis = getRotationAxis(rotationAnimation.face);
      const angle = THREE.MathUtils.degToRad(rotationAnimation.angle);
      rotatingGroupRef.current.rotation.set(
        axis.x * angle,
        axis.y * angle,
        axis.z * angle
      );
    }
  });

  const { staticCubies, rotatingCubies } = useMemo(() => {
    const static_: CubieData[] = [];
    const rotating: CubieData[] = [];
    
    // Helper to get color from face state
    const getColor = (face: FaceColor[]) => (index: number) => FACE_COLORS[face[index]];
    
    const uColor = getColor(cubeState.U);
    const dColor = getColor(cubeState.D);
    const fColor = getColor(cubeState.F);
    const bColor = getColor(cubeState.B);
    const lColor = getColor(cubeState.L);
    const rColor = getColor(cubeState.R);

    // Generate all 26 visible cubies (excluding center)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          const colors: { [key: string]: string } = {};
          const position: [number, number, number] = [x, y, z];
          
          // Map positions to face indices
          const getIndex = (row: number, col: number) => row * 3 + col;
          
          if (x === 1) {
            const row = 1 - y;
            const col = 1 - z;
            colors.right = rColor(getIndex(row, col));
          }
          
          if (x === -1) {
            const row = 1 - y;
            const col = z + 1;
            colors.left = lColor(getIndex(row, col));
          }
          
          if (y === 1) {
            const row = z + 1;
            const col = x + 1;
            colors.top = uColor(getIndex(row, col));
          }
          
          if (y === -1) {
            const row = 1 - z;
            const col = x + 1;
            colors.bottom = dColor(getIndex(row, col));
          }
          
          if (z === 1) {
            const row = 1 - y;
            const col = x + 1;
            colors.front = fColor(getIndex(row, col));
          }
          
          if (z === -1) {
            const row = 1 - y;
            const col = 1 - x;
            colors.back = bColor(getIndex(row, col));
          }

          const cubieData = { position, colors };
          
          if (rotationAnimation?.isAnimating && isAffectedByRotation(position, rotationAnimation.face)) {
            rotating.push(cubieData);
          } else {
            static_.push(cubieData);
          }
        }
      }
    }

    return { staticCubies: static_, rotatingCubies: rotating };
  }, [cubeState, rotationAnimation?.isAnimating, rotationAnimation?.face]);

  return (
    <group ref={groupRef}>
      {/* Face labels - positioned slightly outside each face */}
      <FaceLabel face="U" position={[0, 2.2, 0]} />
      <FaceLabel face="D" position={[0, -2.2, 0]} />
      <FaceLabel face="F" position={[0, 0, 2.2]} />
      <FaceLabel face="B" position={[0, 0, -2.2]} />
      <FaceLabel face="L" position={[-2.2, 0, 0]} />
      <FaceLabel face="R" position={[2.2, 0, 0]} />
      
      {/* Static cubies */}
      <group ref={staticGroupRef}>
        {staticCubies.map((cubie, index) => (
          <Cubie key={`static-${index}`} position={cubie.position} colors={cubie.colors} />
        ))}
      </group>
      
      {/* Rotating cubies */}
      <group ref={rotatingGroupRef}>
        {rotatingCubies.map((cubie, index) => (
          <Cubie key={`rotating-${index}`} position={cubie.position} colors={cubie.colors} />
        ))}
      </group>
    </group>
  );
}

// Axis indicator - shows orientation like in 3D software
function AxisIndicator() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef} scale={0.8}>
      {/* X axis - Red (R/L) */}
      <group>
        <mesh position={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <Html position={[1.4, 0, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] font-bold text-red-500 select-none">R</div>
        </Html>
      </group>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#ef4444" opacity={0.3} transparent />
      </mesh>
      <Html position={[-0.6, 0, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-bold text-orange-500 select-none">L</div>
      </Html>
      
      {/* Y axis - White/Yellow (U/D) */}
      <group>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <Html position={[0, 1.4, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] select-none">U</div>
        </Html>
      </group>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#fcd34d" opacity={0.5} transparent />
      </mesh>
      <Html position={[0, -0.6, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-bold text-yellow-400 select-none">D</div>
      </Html>
      
      {/* Z axis - Green/Blue (F/B) */}
      <group>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <Html position={[0, 0, 1.4]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] font-bold text-green-500 select-none">F</div>
        </Html>
      </group>
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#3b82f6" opacity={0.5} transparent />
      </mesh>
      <Html position={[0, 0, -0.6]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-bold text-blue-500 select-none">B</div>
      </Html>
      
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

interface Cube3DContainerProps extends Cube3DProps {
  isFullscreen?: boolean;
}

export function Cube3D({ cubeState, rotationAnimation, isFullscreen }: Cube3DContainerProps) {
  return (
    <div 
      className={`w-full rounded-xl overflow-hidden relative ${isFullscreen ? 'h-full' : 'h-[380px]'}`}
      style={{ background: 'hsl(var(--card))' }}
    >
      {/* Main cube canvas */}
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <CubeGroup cubeState={cubeState} rotationAnimation={rotationAnimation} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Axis indicator - fixed in corner */}
      <div className="absolute bottom-3 right-3 w-20 h-20 rounded-lg overflow-hidden bg-background/80 backdrop-blur border border-border/50">
        <Canvas camera={{ position: [2.5, 2, 2.5], fov: 40 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <AxisIndicator />
        </Canvas>
      </div>
    </div>
  );
}
