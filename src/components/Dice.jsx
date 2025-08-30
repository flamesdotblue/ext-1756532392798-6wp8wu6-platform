import { memo, useMemo } from 'react';

function Pip({ x, y }) {
  return (
    <span
      className="absolute bg-slate-100 rounded-full shadow"
      style={{ left: x, top: y, width: '10px', height: '10px', boxShadow: '0 0 4px rgba(255,255,255,0.6)' }}
    />
  );
}

function pipsForValue(val) {
  // Positions relative to 60x60 box
  const c = '50%';
  const m = '26%';
  const s = '12%';
  const positions = {
    1: [[c, c]],
    2: [[s, s], ['78%', '78%']],
    3: [[s, s], [c, c], ['78%', '78%']],
    4: [[s, s], ['78%', s], [s, '78%'], ['78%', '78%']],
    5: [[s, s], ['78%', s], [c, c], [s, '78%'], ['78%', '78%']],
    6: [[s, s], ['78%', s], [s, c], ['78%', c], [s, '78%'], ['78%', '78%']],
  };
  return positions[val] || [];
}

function Dice({ value = 1, held = false, index, onToggle, style }) {
  const pips = useMemo(() => pipsForValue(value), [value]);

  return (
    <button
      onClick={() => onToggle(index)}
      title={held ? 'Release die' : 'Hold die'}
      className={`relative select-none [transform-style:preserve-3d] transition-transform duration-500 ease-out ${held ? 'cursor-pointer' : 'cursor-pointer'}`}
      style={style}
    >
      <div className={`relative w-16 h-16 rounded-xl border border-white/30 bg-gradient-to-br from-slate-200 to-slate-300 text-slate-900 shadow-[inset_0_1px_8px_rgba(0,0,0,0.25),0_12px_30px_rgba(0,0,0,0.6)]`}>
        <div className="absolute inset-0 rounded-xl" style={{ boxShadow: held ? '0 0 20px rgba(239,68,68,0.6) inset' : 'none' }} />
        <div className="absolute inset-0" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
          {pips.map(([x, y], i) => (
            <Pip key={i} x={x} y={y} />
          ))}
        </div>
        {held && (
          <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white shadow">
            Held
          </span>
        )}
      </div>
    </button>
  );
}

export default memo(Dice);
