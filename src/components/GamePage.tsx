import Button from "./UI/Button";
import { User } from "lucide-react";
import { useState } from "react";

const GamePage = () => {
  const [boardSize, setBoardSize] = useState<number>(36); // Default is 6x6
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <div className="p-5 rounded-2xl bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold">Stats</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xs uppercase opacity-80">Score</span>
                <span className="text-2xl font-extrabold">10</span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xs uppercase opacity-80">Time</span>
                <span className="text-2xl font-extrabold">20s</span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xs uppercase opacity-80">Board</span>
                <span className="text-2xl font-extrabold">6x6</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black">
                Start Game
              </Button>
              <Button className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black">
                Pause
              </Button>
              <Button className="bg-transparent border-2 border-[#D4AA7D] text-[#D4AA7D] hover:bg-[#D4AA7D] hover:text-black">
                End Game
              </Button>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h3 className="text-lg font-bold">Power-Ups</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-800/90 dark:text-gray-200/90">
              <li>- Row Blaster (clear a row)</li>
              <li>- Column Blaster (clear a column)</li>
              <li>- Wildcard (match any color)</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 order-1 lg:order-2">
          <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  Nectar
                </span>
                <span className="font-extrabold text-[#D4AA7D]">150</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  XP
                </span>
                <span className="font-extrabold text-[#EFD09E]">1500</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  Tokens
                </span>
                <span className="font-extrabold text-[#9EEFD0]">3</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-black/5 dark:bg-white/5">
                <span className="text-xs uppercase tracking-wider opacity-80">
                  Board
                </span>
                <button
                  onClick={() => setBoardSize(36)}
                  className={`text-sm font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    boardSize == 36
                      ? "bg-[#D4AA7D]"
                      : "bg-transparent hover:bg-white/10"
                  } text-black`}
                >
                  6x6
                </button>
                <button
                  onClick={() => setBoardSize(64)}
                  className={`text-sm font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    boardSize == 64
                      ? "bg-[#D4AA7D]"
                      : "bg-transparent hover:bg-white/10"
                  } text-black`}
                >
                  8x8
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <User className="w-4 h-4 text-[#D4AA7D]" />
                <span className="text-sm">NFT: Cyber Bee v1</span>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto max-w-[900px] p-3 md:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div
              className={`grid ${
                boardSize == 36 ? "grid-cols-6" : "grid-cols-8"
              } gap-1 md:gap-2`}
            >
              {[...Array(boardSize)].map((_, index) => (
                <div
                  key={index}
                  className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100 hover:scale-105 hover:ring-2 ring-[#D4AA7D] transition-transform duration-200 cursor-pointer"
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs opacity-70">
              Tip: Tap/click one tile, then an adjacent tile to swap. Create
              matches of 3+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default GamePage;