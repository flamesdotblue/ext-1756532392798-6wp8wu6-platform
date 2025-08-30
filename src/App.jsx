import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import TableScene from './components/TableScene';
import Controls from './components/Controls';

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

const initialDice = () => new Array(5).fill(0).map(() => ({ value: randomDie(), held: false, id: crypto.randomUUID() }));

export default function App() {
  const [dice, setDice] = useState(initialDice);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [lastHoldIndex, setLastHoldIndex] = useState(null);
  const rollIntervalRef = useRef(null);

  const canRoll = rollsLeft > 0 && !isRolling;

  const toggleHold = useCallback((index) => {
    setDice((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], held: !next[index].held };
      return next;
    });
    setLastHoldIndex(index);
  }, []);

  const resetTurn = useCallback(() => {
    setDice((prev) => prev.map((d) => ({ ...d, held: false })));
    setRollsLeft(3);
  }, []);

  const newRound = useCallback(() => {
    setDice(initialDice);
    setRollsLeft(3);
    setIsRolling(false);
  }, []);

  const roll = useCallback(() => {
    if (!canRoll) return;
    setIsRolling(true);
    setRollsLeft((r) => Math.max(0, r - 1));

    // Quick randomization effect for unheld dice
    const start = Date.now();
    const duration = 900;
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

    rollIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setDice((prev) =>
        prev.map((d) => (d.held ? d : { ...d, value: randomDie() }))
      );
      if (elapsed >= duration) {
        clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
        setIsRolling(false);
      }
    }, 75);
  }, [canRoll]);

  useEffect(() => () => {
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
  }, []);

  const heldCount = useMemo(() => dice.filter((d) => d.held).length, [dice]);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 grid grid-rows-[1fr_auto]">
        <TableScene
          dice={dice}
          isRolling={isRolling}
          onToggleHold={toggleHold}
          lastHoldIndex={lastHoldIndex}
        />
        <Controls
          rollsLeft={rollsLeft}
          onRoll={roll}
          onResetTurn={resetTurn}
          onNewRound={newRound}
          canRoll={canRoll}
          heldCount={heldCount}
        />
      </main>
      <footer className="text-center text-xs text-gray-500 py-3">
        Do you feel watched? Keep the dice close.
      </footer>
    </div>
  );
}
