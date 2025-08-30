export default function Controls({ rollsLeft, onRoll, onResetTurn, onNewRound, canRoll, heldCount }) {
  return (
    <div className="relative z-10 w-full border-t border-red-950/40 bg-black/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2 py-1 rounded bg-red-900/30 border border-red-800/50 text-red-200">Rolls left: {rollsLeft}</span>
          <span className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/60 text-slate-200">Held: {heldCount}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRoll}
            disabled={!canRoll}
            className={`px-4 py-2 rounded bg-red-600 text-white font-medium shadow transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${canRoll ? 'hover:bg-red-500' : ''}`}
          >
            Roll
          </button>
          <button
            onClick={onResetTurn}
            className="px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 transition"
          >
            Reset Holds
          </button>
          <button
            onClick={onNewRound}
            className="px-3 py-2 rounded bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800 transition"
          >
            New Round
          </button>
        </div>
      </div>
    </div>
  );
}
