import { useCube } from '@/contexts/CubeContext';
import { Cube2D } from './Cube2D';
import { Cube3D } from './Cube3D';

export function CubeViewer() {
  const { cubeState, renderMode } = useCube();

  return (
    <div className="cube-viewer">
      {renderMode === '3d' ? (
        <Cube3D cubeState={cubeState} />
      ) : (
        <Cube2D cubeState={cubeState} />
      )}
    </div>
  );
}
