import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CubeState, FaceColor } from '@/lib/rubik/types';
import { FACE_COLORS } from '@/lib/rubik/constants';

interface Cube3DProps {
  cubeState: CubeState;
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
  const meshRef = useRef<THREE.Mesh>(null);

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

function CubeGroup({ cubeState }: { cubeState: CubeState }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle idle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + state.clock.elapsedTime * 0.05;
    }
  });

  const cubies = useMemo(() => {
    const result: { position: [number, number, number]; colors: { [key: string]: string } }[] = [];
    
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
          if (x === 0 && y === 0 && z === 0) continue; // Skip center

          const colors: { [key: string]: string } = {};
          
          // Map positions to face indices
          const getIndex = (row: number, col: number) => row * 3 + col;
          
          // Right face (x = 1)
          if (x === 1) {
            const row = 1 - y;
            const col = 1 - z;
            colors.right = rColor(getIndex(row, col));
          }
          
          // Left face (x = -1)
          if (x === -1) {
            const row = 1 - y;
            const col = z + 1;
            colors.left = lColor(getIndex(row, col));
          }
          
          // Top face (y = 1)
          if (y === 1) {
            const row = z + 1;
            const col = x + 1;
            colors.top = uColor(getIndex(row, col));
          }
          
          // Bottom face (y = -1)
          if (y === -1) {
            const row = 1 - z;
            const col = x + 1;
            colors.bottom = dColor(getIndex(row, col));
          }
          
          // Front face (z = 1)
          if (z === 1) {
            const row = 1 - y;
            const col = x + 1;
            colors.front = fColor(getIndex(row, col));
          }
          
          // Back face (z = -1)
          if (z === -1) {
            const row = 1 - y;
            const col = 1 - x;
            colors.back = bColor(getIndex(row, col));
          }

          result.push({
            position: [x, y, z],
            colors,
          });
        }
      }
    }

    return result;
  }, [cubeState]);

  return (
    <group ref={groupRef}>
      {cubies.map((cubie, index) => (
        <Cubie key={index} position={cubie.position} colors={cubie.colors} />
      ))}
    </group>
  );
}

export function Cube3D({ cubeState }: Cube3DProps) {
  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden" style={{ background: 'hsl(var(--card))' }}>
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <CubeGroup cubeState={cubeState} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
