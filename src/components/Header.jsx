import { Ghost } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
      <div className="flex items-center gap-2">
        <Ghost className="text-red-500" />
        <h1 className="font-semibold tracking-wide text-lg">Yahtzee at the End of the Table</h1>
      </div>
      <div className="text-xs text-gray-400">
        Roll thrice. Hold wisely. Don't look up.
      </div>
    </header>
  );
}
