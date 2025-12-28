import { useCube } from '@/contexts/CubeContext';
import { Cube2D } from './Cube2D';
import { Cube3D } from './Cube3D';

export function CubeViewer() {
  const { cubeState, renderMode, rotationAnimation } = useCube();

  if (renderMode === '2d') {
    return <Cube2D cubeState={cubeState} />;
  }

  return <Cube3D cubeState={cubeState} rotationAnimation={rotationAnimation} />;
}
