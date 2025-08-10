import Button from "./UI/Button";
import { User } from "lucide-react";
import { useState, useRef } from "react";
import NeonBee from "../assets/neon-bee-avatar-rare.png";
import { useGame } from "../contexts/GameContext";

const GamePage = () => {
  const colors = [
    "#FF5711", // orange-red
    "#33FF57", // lime green
    "#3357FF", // blue
    "#F1C40F", // yellow
    "#9B59B6", // purple
    "#1ABC9C", // teal
    "#654321", // brown
    "#E74C3C", // red
  ];
  const timerRef = useRef<number | null>(null)
  const { timer, setTimer, score, setScore } = useGame();
  const [boardSize, setBoardSize] = useState<number>(36);
  const getRandomColor = (colors: string[]) => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const [board, setBoard] = useState<string[]>(
    [...Array(36)].map(() => getRandomColor(colors))
  );
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const width = boardSize === 36 ? 6 : 4;
  // Tiles currently flagged as matched (for destroy animation)
  const [matched, setMatched] = useState<Set<number>>(new Set());
  // Lock user input while resolving cascades
  const [isResolving, setIsResolving] = useState<boolean>(false);
  // Game active flag - prevents interaction until Start is clicked
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Small helper to wait for CSS transitions
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Swap handler with adjacency validation and match resolution
  const handleDrop = async (targetIndex: number) => {
    // Ignore interactions while resolving animations/cascades or before game start or after time up
    if (isResolving || !hasStarted || timer <= 0) return;
    if (draggedTile === null || draggedTile === targetIndex) return;
    // Only allow adjacent swaps
    if (!isAdjacent(draggedTile, targetIndex, width)) {
      setDraggedTile(null);
      return;
    }

    // Try the swap in a copy
    const swapped = [...board];
    [swapped[draggedTile], swapped[targetIndex]] = [
      swapped[targetIndex],
      swapped[draggedTile],
    ];

    // Check if swap creates any match
    const m = checkMatches(swapped, width);
    if (m.size === 0) {
      // Revert: do not commit a swap that doesn't create matches
      setDraggedTile(null);
      return;
    }

    // Commit the swap visually
    setBoard(swapped);
    setDraggedTile(null);

    // Resolve matches/cascades with animation and scoring
    await resolveBoard(swapped, width);
  };

  //for checking color match
  const checkMatches = (board: string[], width: number): Set<number> => {
    const matched = new Set<number>();
    const height = Math.floor(board.length / width);

    // Horizontal scan: iterate each row and find runs of length >= 3
    for (let r = 0; r < height; r++) {
      let c = 0;
      while (c <= width - 3) {
        const start = r * width + c;
        const color = board[start];
        if (!color) {
          c++;
          continue;
        }
        let run = 1;
        while (c + run < width && board[r * width + (c + run)] === color) {
          run++;
        }
        if (run >= 3) {
          for (let k = 0; k < run; k++) {
            matched.add(r * width + c + k);
          }
        }
        c += run; // skip past this run
      }
    }

    // Vertical scan: iterate each column and find runs of length >= 3
    for (let c = 0; c < width; c++) {
      let r = 0;
      while (r <= height - 3) {
        const start = r * width + c;
        const color = board[start];
        if (!color) {
          r++;
          continue;
        }
        let run = 1;
        while (r + run < height && board[(r + run) * width + c] === color) {
          run++;
        }
        if (run >= 3) {
          for (let k = 0; k < run; k++) {
            matched.add((r + k) * width + c);
          }
        }
        r += run; // skip past this run
      }
    }
    return matched;
  };

  //check if they are adjacent
  const isAdjacent = (a: number, b: number, width: number): boolean => {
    // Same row → difference of 1 but not wrapping
    if (
      Math.floor(a / width) === Math.floor(b / width) &&
      Math.abs(a - b) === 1
    ) {
      return true;
    }

    // Same column → difference of exactly `width`
    if (Math.abs(a - b) === width) {
      return true;
    }

    return false;
  };

  // Clear matched tiles by setting them to null and return cleared count
  const clearMatches = (
    grid: string[],
    matches: Set<number>
  ): { board: (string | null)[]; cleared: number } => {
    const next: (string | null)[] = [...grid];
    matches.forEach((idx) => {
      next[idx] = null;
    });
    return { board: next, cleared: matches.size };
  };

  // Apply gravity: for each column, let non-null tiles fall down
  const applyGravity = (
    grid: (string | null)[],
    width: number
  ): (string | null)[] => {
    const height = Math.floor(grid.length / width);
    const next = [...grid];

    for (let c = 0; c < width; c++) {
      // Collect non-null tiles from bottom to top
      const stack: string[] = [];
      for (let r = height - 1; r >= 0; r--) {
        const idx = r * width + c;
        const val = next[idx];
        if (val) stack.push(val);
      }
      // Write back bottom-up
      let r = height - 1;
      for (const val of stack) {
        next[r * width + c] = val;
        r--;
      }
      // Fill remaining cells above with null
      for (; r >= 0; r--) {
        next[r * width + c] = null;
      }
    }
    return next;
  };

  // Refill any null tiles with new random colors
  const refill = (grid: (string | null)[], colors: string[]): string[] => {
    return grid.map((v) => (v ? v : getRandomColor(colors)));
  };

  // Check if any single adjacent swap can produce a match
  const hasPossibleMoves = (grid: string[], width: number): boolean => {
    const size = grid.length;
    const height = Math.floor(size / width);

    for (let i = 0; i < size; i++) {
      const r = Math.floor(i / width);
      const c = i % width;

      // Try swap to the right
      if (c + 1 < width) {
        const j = i + 1;
        if (grid[j] !== grid[i]) {
          const swapped = [...grid];
          [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
          if (checkMatches(swapped, width).size > 0) return true;
        }
      }
      // Try swap downward
      if (r + 1 < height) {
        const j = i + width;
        if (grid[j] !== grid[i]) {
          const swapped = [...grid];
          [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
          if (checkMatches(swapped, width).size > 0) return true;
        }
      }
    }
    return false;
  };

  // Generate a fresh board with no immediate matches and at least one possible move
  const generatePlayableBoard = (size: number, colors: string[]): string[] => {
    const w = size === 36 ? 6 : 4;
    for (let attempts = 0; attempts < 500; attempts++) {
      const fresh = [...Array(size)].map(() => getRandomColor(colors));
      if (checkMatches(fresh, w).size > 0) continue; // avoid immediate matches
      if (hasPossibleMoves(fresh, w)) return fresh; // ensure at least one move
    }
    // Fallback (rare): return a random board; start will resolve if needed
    return [...Array(size)].map(() => getRandomColor(colors));
  };

  // Resolve matches with animation, gravity, refills, and scoring.
  // widthArg is passed in to avoid stale width during a board size switch.
  const resolveBoard = async (
  initial: string[],
  widthArg?: number,
  options?: { awardScore?: boolean }
  ) => {
  const w = widthArg ?? width;
  const awardScore = options?.awardScore !== false;
  setIsResolving(true);
  let current: string[] = initial;

    while (true) {
      const matches = checkMatches(current, w);
      if (matches.size === 0) {
        // Clear any previous match flags and finish
        setMatched(new Set());
        break;
      }

      // Flag matched tiles for a brief destroy animation
      setMatched(matches);
      await sleep(250); // keep in sync with CSS duration

      // Clear matched tiles and score them
      const { board: clearedBoard, cleared } = clearMatches(current, matches);
      // Update score (+1 per cleared tile) - stored in GameContext
      if (awardScore) {
      setScore((prev: number) => prev + cleared);
      }

      // Apply gravity, then refill, then continue to look for cascades
      const afterGravity = applyGravity(clearedBoard, w);
      const refilled = refill(afterGravity, colors);

      // Publish the new board state for the next loop/cascade
      setBoard(refilled);
      current = refilled;
    }

    // After stabilizing, if no more possible moves remain, generate a new playable board
    if (!hasPossibleMoves(current, w)) {
      const fresh = generatePlayableBoard(boardSize, colors);
      setBoard(fresh);
    }

    setIsResolving(false);
  };

  // Build a new board for a given size and immediately resolve any pre-existing matches
  const regenerateBoard = async (size: number) => {
    const fresh = generatePlayableBoard(size, colors);
    setBoardSize(size);
    setBoard(fresh);
  };

  const endTheGame = async () => {
    if(timerRef.current) clearInterval(timerRef.current)
    setHasStarted(false);
    setTimer(20)
  }

  //start button function
  const startTheGame = async () => {
    // Stop any running timer to avoid multiple intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset state for a fresh run
    setScore(0);
    setTimer(20);
    setMatched(new Set());
    setHasStarted(true);

    // Clean the initial board so no immediate matches remain and ensure future moves exist,
    // without awarding points for this cleanup
    await resolveBoard([...board], width, { awardScore: false });

    // Start countdown timer
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // lock the board when time is up
          setHasStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <div className="md:w-4/6 flex flex-col gap-4 order-1 lg:order-1">
          <div className="p-5 rounded-2xl order-1 lg:order-2 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl backdrop-blur-md border border-white/20 overflow-hidden">
                <img
                  src={NeonBee}
                  alt="User Avatar"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Cyber Bee v1</span>
                <span>Level 2</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Nectar</span>
                <span className="text-2xl font-extrabold dark:text-[#D4AA7D]">
                  120
                </span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Xp</span>
                <span className="text-2xl font-extrabold dark:text-[#EFD09E]">
                  320
                </span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Tokens</span>
                <span className="text-2xl font-extrabold dark:text-[#9EEFD0]">
                  5
                </span>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl order-1 lg:order-2 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold">Stats</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Score</span>
                <span className="text-2xl font-extrabold">{score}</span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Time</span>
                <span className="text-2xl font-extrabold">{timer}s</span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Board</span>
                <span className="text-2xl font-extrabold">
                  {boardSize === 36 ? "6x6" : "4x4"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  startTheGame();
                }}
                className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black active:scale-95 active:translate-y-0 transition-transform duration-150"
              >
                Start Game
              </Button>
              {/* <Button className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black">
                Pause
              </Button> */}
              <Button
              onClick={() => {endTheGame()}}
                className="
                   bg-transparent border-2 border-[#D4AA7D] text-[#D4AA7D] 
                  hover:bg-[#D4AA7D] hover:text-black
                    active:scale-95 active:translate-y-0 transition-transform duration-150
                    "
              >
                End Game
              </Button>
            </div>
          </div>
          <div className="p-5 rounded-2xl order-3 lg:order-3 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h3 className="text-lg font-bold">Power-Ups</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-800/90 dark:text-gray-200/90">
              <li>- Row Blaster (clear a row)</li>
              <li>- Column Blaster (clear a column)</li>
              <li>- Wildcard (match any color)</li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col gap-4 order-1 lg:order-2">
          <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  Nectar
                </span>
                <span className="font-extrabold dark:text-[#D4AA7D]">150</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  XP
                </span>
                <span className="font-extrabold dark:text-[#EFD09E]">1500</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-widest opacity-70">
                  Tokens
                </span>
                <span className="font-extrabold dark:text-[#9EEFD0]">3</span>
              </div>
            </div> */}
            <div className="flex items-center gap-3 max-w-xl mx-auto">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-black/5 dark:bg-white/5">
                <span className="text-xs uppercase tracking-wider opacity-80">
                  Board
                </span>
                <button
                  onClick={() => {
                    regenerateBoard(16);
                  }}
                  className={`text-sm font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    boardSize === 16
                      ? "bg-[#D4AA7D]"
                      : "bg-transparent hover:bg-white/10"
                  } text-black dark:text-white`}
                >
                  4x4
                </button>
                <button
                  onClick={() => {
                    regenerateBoard(36);
                  }}
                  className={`text-sm font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    boardSize === 36
                      ? "bg-[#D4AA7D]"
                      : "bg-transparent hover:bg-white/10"
                  } text-black dark:text-white`}
                >
                  6x6
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <User className="w-4 h-4 text-[#D4AA7D]" />
                <span className="text-sm">NFT: Cyber Bee v1</span>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="w-full mx-auto max-w-[900px] p-3 md:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div
              className={`grid ${
                boardSize === 36 ? "grid-cols-6" : "grid-cols-4"
              } gap-1 md:gap-2`}
            >
              {board.map((tileColor, index) => (
                <div
                  key={index}
                  draggable={hasStarted && !isResolving && timer > 0}
                  onDragStart={() => setDraggedTile(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  style={{
                    background: tileColor,
                    boxShadow:
                      "inset 2px 2px 5px rgba(255, 255, 255, 0.2), inset -2px -2px 5px rgba(0, 0, 0, 0.5), 2px 2px 6px rgba(0, 0, 0, 0.7), 5px 5px 0px rgba(0, 0, 0, 0.3)",
                  }}
                  className={`w-full aspect-square rounded-xl md:rounded-2xl flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100 hover:scale-105 hover:ring-2 transition-all duration-200 cursor-pointer ${
                    matched.has(index) ? "opacity-0 scale-75 blur-[1px]" : ""
                  } ${isResolving ? "pointer-events-none" : ""}`}
                >
                  {/* {tileColor} */}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs opacity-70">
              Tip: Drag a tile onto another to swap them. Create matches of 3+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
