import { useCallback } from 'react';
import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TouchZone {
  position: string;
  move: Move;
  primeMove: Move;
  label: string;
  bgColor: string;
}

const TOUCH_ZONES: TouchZone[] = [
  { position: 'top-0 left-1/2 -translate-x-1/2', move: 'U', primeMove: "U'", label: 'U', bgColor: 'bg-[hsl(var(--rubik-white))]' },
  { position: 'bottom-0 left-1/2 -translate-x-1/2', move: 'D', primeMove: "D'", label: 'D', bgColor: 'bg-[hsl(var(--rubik-yellow))]' },
  { position: 'left-0 top-1/2 -translate-y-1/2', move: 'L', primeMove: "L'", label: 'L', bgColor: 'bg-[hsl(var(--rubik-orange))]' },
  { position: 'right-0 top-1/2 -translate-y-1/2', move: 'R', primeMove: "R'", label: 'R', bgColor: 'bg-[hsl(var(--rubik-red))]' },
  { position: 'top-0 left-0', move: 'B', primeMove: "B'", label: 'B', bgColor: 'bg-[hsl(var(--rubik-blue))]' },
  { position: 'bottom-0 right-0', move: 'F', primeMove: "F'", label: 'F', bgColor: 'bg-[hsl(var(--rubik-green))]' },
];

export function MobileTouchControls() {
  const { executeMove, rotationAnimation } = useCube();

  const handleTouch = useCallback((move: Move, isPrime: boolean) => {
    if (rotationAnimation?.isAnimating) return;
    executeMove(isPrime ? (move.replace("'", "") + "'") as Move : move.replace("'", "") as Move);
  }, [executeMove, rotationAnimation?.isAnimating]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute inset-0 pointer-events-none z-10">
        {TOUCH_ZONES.map((zone) => (
          <TouchZoneButton
            key={zone.label}
            zone={zone}
            onTap={(isPrime) => handleTouch(zone.move, isPrime)}
            disabled={rotationAnimation?.isAnimating ?? false}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

interface TouchZoneButtonProps {
  zone: TouchZone;
  onTap: (isPrime: boolean) => void;
  disabled: boolean;
}

function TouchZoneButton({ zone, onTap, disabled }: TouchZoneButtonProps) {
  const isCorner = zone.label === 'B' || zone.label === 'F';
  const isHorizontal = zone.label === 'U' || zone.label === 'D';
  
  const sizeClasses = isCorner 
    ? 'w-12 h-12' 
    : isHorizontal 
      ? 'w-20 h-10' 
      : 'w-10 h-20';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={`
            absolute ${zone.position} ${sizeClasses}
            pointer-events-auto touch-none select-none
            flex items-center justify-center
            ${zone.bgColor} text-black font-bold text-sm
            rounded-lg opacity-60 hover:opacity-90 active:opacity-100
            transition-opacity duration-150
            border-2 border-black/20 shadow-md
            disabled:opacity-30
          `}
          onClick={() => onTap(false)}
          onContextMenu={(e) => {
            e.preventDefault();
            onTap(true);
          }}
          disabled={disabled}
          aria-label={`Execute ${zone.label} move`}
        >
          {zone.label}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p>Tap: {zone.move} | Long press: {zone.primeMove}</p>
      </TooltipContent>
    </Tooltip>
  );
}
