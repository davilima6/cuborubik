import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text, Html } from '@react-three/drei';
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

// Face label component - floats near each face
function FaceLabel({ face, position, rotation }: { face: string; position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
      font="/fonts/inter-bold.woff"
    >
      {face}
    </Text>
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
      <FaceLabel face="U" position={[0, 2.2, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <FaceLabel face="D" position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <FaceLabel face="F" position={[0, 0, 2.2]} rotation={[0, 0, 0]} />
      <FaceLabel face="B" position={[0, 0, -2.2]} rotation={[0, Math.PI, 0]} />
      <FaceLabel face="L" position={[-2.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <FaceLabel face="R" position={[2.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      
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

// Mini reference cube - shows standard orientation
function MiniReferenceCube() {
  const faceColors = {
    U: '#ffffff', // White
    D: '#fcd34d', // Yellow
    F: '#22c55e', // Green
    B: '#3b82f6', // Blue
    L: '#f97316', // Orange
    R: '#ef4444', // Red
  };

  return (
    <group scale={0.4}>
      {/* Core */}
      <RoundedBox args={[1.9, 1.9, 1.9]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#222222" />
      </RoundedBox>
      
      {/* Face stickers with labels */}
      {/* Right - R */}
      <mesh position={[0.96, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.R} />
      </mesh>
      <Text position={[1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.5} color="#000000">R</Text>
      
      {/* Left - L */}
      <mesh position={[-0.96, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.L} />
      </mesh>
      <Text position={[-1.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.5} color="#000000">L</Text>
      
      {/* Top - U */}
      <mesh position={[0, 0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.U} />
      </mesh>
      <Text position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="#000000">U</Text>
      
      {/* Bottom - D */}
      <mesh position={[0, -0.96, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.D} />
      </mesh>
      <Text position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.5} color="#000000">D</Text>
      
      {/* Front - F */}
      <mesh position={[0, 0, 0.96]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.F} />
      </mesh>
      <Text position={[0, 0, 1.0]} fontSize={0.5} color="#000000">F</Text>
      
      {/* Back - B */}
      <mesh position={[0, 0, -0.96]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial color={faceColors.B} />
      </mesh>
      <Text position={[0, 0, -1.0]} rotation={[0, Math.PI, 0]} fontSize={0.5} color="#000000">B</Text>
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
      
      {/* Mini reference cube - fixed in corner */}
      <div className="absolute bottom-3 right-3 w-24 h-24 rounded-lg overflow-hidden bg-background/80 backdrop-blur border border-border/50">
        <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <MiniReferenceCube />
        </Canvas>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[9px] text-muted-foreground font-medium">Reference</span>
        </div>
      </div>
    </div>
  );
}
