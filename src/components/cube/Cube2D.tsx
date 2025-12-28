import { useRef, useEffect } from 'react';
import { CubeState, FaceColor } from '@/lib/rubik/types';
import { FACE_COLORS } from '@/lib/rubik/constants';

interface Cube2DProps {
  cubeState: CubeState;
}

const CELL_SIZE = 36;
const GAP = 2;
const FACE_SIZE = CELL_SIZE * 3 + GAP * 2;

export function Cube2D({ cubeState }: Cube2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw net layout:
    //       [U]
    //   [L][F][R][B]
    //       [D]
    
    const offsetX = (canvas.width - FACE_SIZE * 4) / 2;
    const offsetY = 20;

    const drawFace = (face: FaceColor[], x: number, y: number) => {
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const cellX = x + col * (CELL_SIZE + GAP);
        const cellY = y + row * (CELL_SIZE + GAP);

        // Draw cell background
        ctx.fillStyle = FACE_COLORS[face[i]];
        ctx.beginPath();
        ctx.roundRect(cellX, cellY, CELL_SIZE, CELL_SIZE, 4);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    // U (top)
    drawFace(cubeState.U, offsetX + FACE_SIZE + GAP, offsetY);
    
    // L, F, R, B (middle row)
    const middleY = offsetY + FACE_SIZE + GAP;
    drawFace(cubeState.L, offsetX, middleY);
    drawFace(cubeState.F, offsetX + FACE_SIZE + GAP, middleY);
    drawFace(cubeState.R, offsetX + (FACE_SIZE + GAP) * 2, middleY);
    drawFace(cubeState.B, offsetX + (FACE_SIZE + GAP) * 3, middleY);
    
    // D (bottom)
    drawFace(cubeState.D, offsetX + FACE_SIZE + GAP, middleY + FACE_SIZE + GAP);

    // Face labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const labelOffset = FACE_SIZE / 2;
    ctx.fillText('U', offsetX + FACE_SIZE + GAP + labelOffset, offsetY - 6);
    ctx.fillText('L', offsetX + labelOffset, middleY - 6);
    ctx.fillText('F', offsetX + FACE_SIZE + GAP + labelOffset, middleY - 6);
    ctx.fillText('R', offsetX + (FACE_SIZE + GAP) * 2 + labelOffset, middleY - 6);
    ctx.fillText('B', offsetX + (FACE_SIZE + GAP) * 3 + labelOffset, middleY - 6);
    ctx.fillText('D', offsetX + FACE_SIZE + GAP + labelOffset, middleY + FACE_SIZE + GAP - 6);

  }, [cubeState]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={380}
      className="rounded-xl"
      style={{ background: 'hsl(var(--card))' }}
    />
  );
}
