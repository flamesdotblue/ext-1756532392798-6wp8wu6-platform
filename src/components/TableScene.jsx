import { useEffect, useMemo, useRef, useState } from 'react';
import Dice from './Dice';

export default function TableScene({ dice, isRolling, onToggleHold, lastHoldIndex }) {
  const [handAnim, setHandAnim] = useState(null); // {side, y, mode}
  const containerRef = useRef(null);

  useEffect(() => {
    if (lastHoldIndex == null) return;
    // Determine which hand should push based on index
    const side = lastHoldIndex < 2 ? 'left' : lastHoldIndex > 2 ? 'right' : Math.random() > 0.5 ? 'left' : 'right';
    const rowY = 0.5; // middle row
    setHandAnim({ side, y: rowY, mode: 'poke', key: Date.now() });
    const t = setTimeout(() => setHandAnim(null), 900);
    return () => clearTimeout(t);
  }, [lastHoldIndex]);

  useEffect(() => {
    if (isRolling) {
      // Sweep both hands inward then back when rolling
      setHandAnim({ side: 'both', y: 0.5, mode: 'sweep', key: Date.now() });
      const t = setTimeout(() => setHandAnim(null), 1100);
      return () => clearTimeout(t);
    }
  }, [isRolling]);

  const positions = useMemo(() => {
    // Layout dice in a neat line across the table
    const baseX = 50; // px left offset start
    const gap = 90; // px between dice
    return dice.map((d, i) => ({ x: baseX + i * gap, y: 0 }));
  }, [dice.length]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <style>{`
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes blink { 0%, 90%, 100% { opacity: 1 } 92%, 98% { opacity: 0 } }
        @keyframes hand-poke { 0% { transform: translateX(0) } 40% { transform: translateX(24px) } 100% { transform: translateX(0) } }
        @keyframes hand-pokeright { 0% { transform: translateX(0) } 40% { transform: translateX(-24px) } 100% { transform: translateX(0) } }
        @keyframes hand-sweep-left { 0% { transform: translateX(-120%) } 40% { transform: translateX(-20%) } 60% { transform: translateX(-20%) } 100% { transform: translateX(-120%) } }
        @keyframes hand-sweep-right { 0% { transform: translateX(120%) } 40% { transform: translateX(20%) } 60% { transform: translateX(20%) } 100% { transform: translateX(120%) } }
        @keyframes dice-shake { 0%,100% { transform: rotateZ(0deg) } 25% { transform: rotateZ(2deg) } 50% { transform: rotateZ(-2deg) } 75% { transform: rotateZ(1deg) } }
      `}</style>
      <div className="relative max-w-5xl mx-auto h-[520px]">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,30,30,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-900/30 to-transparent pointer-events-none" />
        {/* The scary figure at the far end of the table */}
        <ScaryWatcher />

        {/* Table */}
        <div className="absolute left-1/2 -translate-x-1/2 top-28 w-[900px] h-[340px] [perspective:900px]">
          <div className="relative w-full h-full origin-top [transform:rotateX(58deg)] rounded-[22px] overflow-visible shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(ellipse_at_center,_rgba(120,30,30,0.15),_rgba(0,0,0,0.95))] border border-red-950/50" />
            <div className="absolute inset-[8px] rounded-[18px] bg-[repeating-linear-gradient(45deg,rgba(50,10,10,0.8)_0px,rgba(50,10,10,0.8)_8px,rgba(30,5,5,0.8)_8px,rgba(30,5,5,0.8)_16px)]" />

            {/* Dice row layer */}
            <div className="absolute left-0 right-0 top-[120px] h-[120px]">
              <DiceRow
                dice={dice}
                positions={positions}
                isRolling={isRolling}
                onToggleHold={onToggleHold}
              />
            </div>

            {/* Hands */}
            <HandsOverlay anim={handAnim} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DiceRow({ dice, positions, isRolling, onToggleHold }) {
  return (
    <div className="relative h-full">
      {dice.map((d, i) => {
        // Held dice slide slightly towards their side and backward to suggest being pushed aside
        const side = i < 2 ? 'left' : i > 2 ? 'right' : 'center';
        const heldXShift = side === 'left' ? -40 : side === 'right' ? 40 : Math.random() > 0.5 ? -30 : 30;
        const heldZ = -18; // simulated depth via translateY due to rotateX
        const base = positions[i];
        const style = {
          position: 'absolute',
          left: `${base.x}px`,
          top: `${base.y}px`,
          transform: `translate(-50%,-50%) ${d.held ? `translateX(${heldXShift}px) translateY(${heldZ}px)` : ''}`,
          transition: 'transform 420ms cubic-bezier(.2,.8,.2,1)',
          animation: isRolling && !d.held ? 'dice-shake 320ms ease-in-out infinite' : 'none',
        };
        return (
          <Dice key={d.id} value={d.value} held={d.held} index={i} onToggle={onToggleHold} style={style} />
        );
      })}
    </div>
  );
}

function HandsOverlay({ anim }) {
  // Render simple stylized hands that animate
  return (
    <>
      {/* Left hand */}
      <div
        className="absolute left-[-140px] top-[150px] w-[180px] h-[120px] opacity-70"
        style={{
          animation:
            anim?.mode === 'sweep' && (anim.side === 'both' || anim.side === 'left')
              ? 'hand-sweep-left 1.1s ease-in-out both'
              : anim?.mode === 'poke' && anim.side === 'left'
              ? 'hand-poke 0.9s ease-in-out both'
              : 'none',
        }}
      >
        <HandSVG side="left" />
      </div>
      {/* Right hand */}
      <div
        className="absolute right-[-140px] top-[150px] w-[180px] h-[120px] opacity-70"
        style={{
          animation:
            anim?.mode === 'sweep' && (anim.side === 'both' || anim.side === 'right')
              ? 'hand-sweep-right 1.1s ease-in-out both'
              : anim?.mode === 'poke' && anim.side === 'right'
              ? 'hand-pokeright 0.9s ease-in-out both'
              : 'none',
        }}
      >
        <HandSVG side="right" />
      </div>
    </>
  );
}

function HandSVG({ side = 'left' }) {
  const flip = side === 'right' ? 'scaleX(-1)' : 'none';
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" style={{ transform: flip }}>
      <defs>
        <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7a3d3d" />
          <stop offset="100%" stopColor="#3a1a1a" />
        </linearGradient>
      </defs>
      <g>
        <path d="M10,90 C20,40 50,30 70,32 C90,34 110,46 120,60 C130,74 170,74 180,90 C165,100 150,110 130,112 C95,116 50,110 18,100 Z" fill="url(#skin)" stroke="#200" strokeWidth="3" />
        {/* Fingers */}
        <ellipse cx="70" cy="40" rx="10" ry="16" fill="#532323" />
        <ellipse cx="90" cy="44" rx="10" ry="16" fill="#532323" />
        <ellipse cx="110" cy="50" rx="10" ry="16" fill="#532323" />
        <ellipse cx="130" cy="58" rx="10" ry="16" fill="#532323" />
      </g>
    </svg>
  );
}

function ScaryWatcher() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[220px] h-[140px] flex items-end justify-center pointer-events-none">
      <svg viewBox="0 0 300 200" className="w-[180px] drop-shadow-[0_12px_40px_rgba(255,0,0,0.35)] animate-[bob_4s_ease-in-out_infinite]">
        <defs>
          <radialGradient id="cloak" cx="50%" cy="10%" r="80%">
            <stop offset="0%" stopColor="#0b0000" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Cloaked silhouette */}
        <path d="M150,10 C200,20 240,80 260,160 L40,160 C60,80 100,20 150,10 Z" fill="url(#cloak)" stroke="#1a0000" strokeWidth="2" filter="url(#softGlow)" />
        {/* Eyes */}
        <g>
          <ellipse cx="125" cy="70" rx="16" ry="12" fill="#000" />
          <ellipse cx="175" cy="70" rx="16" ry="12" fill="#000" />
          <circle cx="125" cy="70" r="6" className="animate-[blink_3.8s_steps(2,start)_infinite]" fill="#ff4444" />
          <circle cx="175" cy="70" r="6" className="animate-[blink_3.8s_steps(2,start)_infinite]" fill="#ff4444" />
        </g>
      </svg>
    </div>
  );
}
