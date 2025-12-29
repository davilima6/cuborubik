import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { useCube } from '@/contexts/CubeContext';
import { Move } from '@/lib/rubik/types';

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

const LONG_PRESS_DURATION = 400; // ms

export function MobileTouchControls() {
  const { executeMove, rotationAnimation } = useCube();

  const handleTouch = useCallback((move: Move, isPrime: boolean) => {
    if (rotationAnimation?.isAnimating) return;
    executeMove(isPrime ? (move.replace("'", "") + "'") as Move : move.replace("'", "") as Move);
  }, [executeMove, rotationAnimation?.isAnimating]);

  return (
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
  const [isLongPress, setIsLongPress] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasLongPressRef = useRef(false);

  const sizeClasses = isCorner
    ? 'w-12 h-12'
    : isHorizontal
      ? 'w-20 h-10'
      : 'w-10 h-20';

  const vibrate = useCallback((ms: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // iOS Safari typically doesn't support this; Android does.
      (navigator as Navigator).vibrate?.(ms);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePressStart = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Prevent the synthetic click / "ghost" mouse events some mobile browsers dispatch after touch.
    e.preventDefault();

    wasLongPressRef.current = false;

    // Capture ensures we keep receiving the pointerup even if the finger moves slightly.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    clearTimer();
    timerRef.current = setTimeout(() => {
      wasLongPressRef.current = true;
      setIsLongPress(true);
      onTap(true); // prime move
      vibrate(25);
    }, LONG_PRESS_DURATION);
  }, [clearTimer, disabled, onTap, vibrate]);

  const handlePressEnd = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearTimer();

    if (!disabled && !wasLongPressRef.current) {
      onTap(false); // normal move
      vibrate(10);
    }

    setIsLongPress(false);
  }, [clearTimer, disabled, onTap, vibrate]);

  const handlePressCancel = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearTimer();
    setIsLongPress(false);
  }, [clearTimer]);

  return (
    <button
      type="button"
      className={
        `
        absolute ${zone.position} ${sizeClasses}
        pointer-events-auto touch-none select-none
        flex items-center justify-center
        ${zone.bgColor} text-black font-bold text-sm
        rounded-lg ${isLongPress ? 'opacity-100 scale-110' : 'opacity-60'}
        active:opacity-100
        transition-all duration-150
        border-2 border-black/20 shadow-md
        disabled:opacity-30
      `
      }
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressCancel}
      onPointerLeave={handlePressCancel}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={`${zone.label}: tap for ${zone.move}, hold for ${zone.primeMove}`}
    >
      <span className="flex flex-col items-center leading-none">
        <span>{zone.label}</span>
        {isLongPress && <span className="text-[10px] mt-0.5">&apos;</span>}
      </span>
    </button>
  );
}