import { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext'; // Adjust path as needed

// Define the board styles with colors and icons
const BOARD_STYLES = {
  cyberpunk: [
    { id: 0, color: "#00b7eb", icon: "⚡" }, // Cyan
    { id: 1, color: "#e91e63", icon: "🔮" }, // Magenta
    { id: 2, color: "#6a1b9a", icon: "💫" }, // Deep purple
    { id: 3, color: "#26a69a", icon: "⭐" }, // Teal
    { id: 4, color: "#ad1457", icon: "🌟" }, // Dark pink
    { id: 5, color: "#0288d1", icon: "✨" }, // Blue
  ],
  neon: [
    { id: 0, color: "#d81b60", icon: "🔥" }, // Neon pink
    { id: 1, color: "#00c853", icon: "🌈" }, // Neon green
    { id: 2, color: "#6200ea", icon: "🌟" }, // Neon purple
    { id: 3, color: "#ff5722", icon: "💥" }, // Neon orange
    { id: 4, color: "#0288d1", icon: "🌊" }, // Neon blue
    { id: 5, color: "#c51162", icon: "💡" }, // Bright magenta
  ],
  pastel: [
    { id: 0, color: "#f8bbd0", icon: "🌸" }, // Soft pink
    { id: 1, color: "#c8e6c9", icon: "🌼" }, // Soft green
    { id: 2, color: "#bbdefb", icon: "🌺" }, // Soft blue
    { id: 3, color: "#fff9c4", icon: "🌻" }, // Soft yellow
    { id: 4, color: "#ffccbc", icon: "🌹" }, // Soft peach
    { id: 5, color: "#d1c4e9", icon: "🌷" }, // Soft lavender
  ],
  dark: [
    { id: 0, color: "#4a5568", icon: "🌑" },
    { id: 1, color: "#744210", icon: "🌒" },
    { id: 2, color: "#553c9a", icon: "🌓" },
    { id: 3, color: "#975a16", icon: "🌔" },
    { id: 4, color: "#2d3748", icon: "🌕" },
    { id: 5, color: "#4c1d95", icon: "🌖" },
  ],
  retro: [
    { id: 0, color: "#e57373", icon: "🎮" }, // Muted red
  { id: 1, color: "#4db6ac", icon: "🕹️" }, // Muted teal
  { id: 2, color: "#4fc3f7", icon: "🖲️" }, // Muted blue
  { id: 3, color: "#ffb300", icon: "🪙" }, // Muted amber
  { id: 4, color: "#ff8a65", icon: "🎲" }, // Muted orange
  { id: 5, color: "#ef5350", icon: "🕹️" }, // Muted coral
  ],
  fruits: [
    { id: 0, color: "#e74c3c", icon: "🍎" }, // Apple red
    { id: 1, color: "#f39c12", icon: "🍊" }, // Orange
    { id: 2, color: "#8e44ad", icon: "🍇" }, // Grape purple
    { id: 3, color: "#c0392b", icon: "🍒" }, // Cherry deep red
    { id: 4, color: "#27ae60", icon: "🥝" }, // Kiwi green
    { id: 5, color: "#16a085", icon: "🥭" }, // Mango teal
  ],
  gems: [
    { id: 0, color: "#3498db", icon: "💎" }, // Sapphire blue
    { id: 1, color: "#e74c3c", icon: "💍" }, // Ruby red
    { id: 2, color: "#9b59b6", icon: "🔷" }, // Amethyst purple
    { id: 3, color: "#d35400", icon: "🔹" }, // Deep amber (replaced #f39c12)
    { id: 4, color: "#1abc9c", icon: "⭐" }, // Emerald green
    { id: 5, color: "#8e44ad", icon: "✨" }, // Rich amethyst (replaced #f1c40f)
  ],
  shapes: [
    { id: 0, color: "#37474f", icon: "⚫" }, // Dark slate
  { id: 1, color: "#d32f2f", icon: "🔴" }, // Deep red
  { id: 2, color: "#0288d1", icon: "🔵" }, // Bright blue
  { id: 3, color: "#388e3c", icon: "🟢" }, // Forest green
  { id: 4, color: "#fbc02d", icon: "🟡" }, // Muted yellow
  { id: 5, color: "#7b1fa2", icon: "🟣" }, // Deep purple
  ],
  space: [
    { id: 0, color: "#f39c12", icon: "🌟" },
    { id: 1, color: "#95a5a6", icon: "🌙" },
    { id: 2, color: "#e67e22", icon: "☄️" },
    { id: 3, color: "#3498db", icon: "🪐" },
    { id: 4, color: "#e74c3c", icon: "🚀" },
    { id: 5, color: "#2ecc71", icon: "👽" },
  ],
};

// Define the Tile interface
interface Tile {
  id: number;
  color: string;
  icon: string;
}

// Get a random tile from the current theme
const getRandomTile = (theme: keyof typeof BOARD_STYLES): Tile => {
  const themeTiles = BOARD_STYLES[theme];
  return themeTiles[Math.floor(Math.random() * themeTiles.length)];
};

// Check for matches of 3+ identical tiles in rows or columns
const checkMatches = (board: Tile[], width: number): Set<number> => {
  const matched = new Set<number>();
  const height = Math.floor(board.length / width);
  // Check horizontal matches
  for (let r = 0; r < height; r++) {
    let c = 0;
    while (c <= width - 3) {
      const start = r * width + c;
      const id = board[start]?.id;
      if (!id && id !== 0) { c++; continue; }
      let run = 1;
      while (c + run < width && board[r * width + (c + run)]?.id === id) run++;
      if (run >= 3) for (let k = 0; k < run; k++) matched.add(r * width + c + k);
      c += run;
    }
  }
  // Check vertical matches
  for (let c = 0; c < width; c++) {
    let r = 0;
    while (r <= height - 3) {
      const start = r * width + c;
      const id = board[start]?.id;
      if (!id && id !== 0) { r++; continue; }
      let run = 1;
      while (r + run < height && board[(r + run) * width + c]?.id === id) run++;
      if (run >= 3) for (let k = 0; k < run; k++) matched.add((r + k) * width + c);
      r += run;
    }
  }
  return matched;
};

// Check if there are possible moves
const hasPossibleMoves = (grid: Tile[], width: number): boolean => {
  const size = grid.length, height = Math.floor(size / width);
  for (let i = 0; i < size; i++) {
    const r = Math.floor(i / width), c = i % width;
    if (c + 1 < width) {
      const j = i + 1;
      if (grid[j]?.id !== grid[i]?.id) {
        const swapped = [...grid];
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
        if (checkMatches(swapped, width).size > 0) return true;
      }
    }
    if (r + 1 < height) {
      const j = i + width;
      if (grid[j]?.id !== grid[i]?.id) {
        const swapped = [...grid];
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
        if (checkMatches(swapped, width).size > 0) return true;
      }
    }
  }
  return false;
};

// Generate a playable board with no initial matches and at least one possible move
const generatePlayableBoard = (size: number, theme: keyof typeof BOARD_STYLES): Tile[] => {
  const w = size === 36 ? 6 : 4;
  for (let attempts = 0; attempts < 500; attempts++) {
    const fresh = [...Array(size)].map(() => getRandomTile(theme));
    if (checkMatches(fresh, w).size > 0) continue;
    if (hasPossibleMoves(fresh, w)) return fresh;
  }
  return [...Array(size)].map(() => getRandomTile(theme));
};

// Define the game logic hook
export function useGameLogic() {
  // Use context for score, timer, and total
  const { score, setScore, timer, setTimer, total, setTotal } = useGame();

  // State for the board size (16 for 4x4, 36 for 6x6)
  const [boardSize, setBoardSize] = useState<number>(36);
  // State for the game board, initialized with a playable board
  const [board, setBoard] = useState<Tile[]>(generatePlayableBoard(36, 'cyberpunk'));
  // State for the dragged tile index
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  // State for matched tile indices
  const [matched, setMatched] = useState<Set<number>>(new Set());
  // State to track if the board is resolving matches
  const [isResolving, setIsResolving] = useState<boolean>(false);
  // State to track if the game has started
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  // State for the current theme
  const [theme, setTheme] = useState<keyof typeof BOARD_STYLES>('cyberpunk');
  // Ref for timer interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Ref for current score to handle async updates
  const scoreRef = useRef<number>(score.reduce((sum, val) => sum + val, 0));

  // Update scoreRef when score changes
  useEffect(() => {
    scoreRef.current = score.reduce((sum, val) => sum + val, 0);
  }, [score]);

  // Regenerate board when theme changes
  useEffect(() => {
    setBoard(generatePlayableBoard(boardSize, theme));
  }, [theme, boardSize]);

  // Sleep utility for delaying match resolution
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Check if two tiles are adjacent
  const isAdjacent = (a: number, b: number, width: number): boolean => {
    if (Math.floor(a / width) === Math.floor(b / width) && Math.abs(a - b) === 1) return true;
    if (Math.abs(a - b) === width) return true;
    return false;
  };

  // Clear matched tiles from the board
  const clearMatches = (grid: Tile[], matches: Set<number>): { board: (Tile | null)[]; cleared: number } => {
    const next: (Tile | null)[] = [...grid];
    matches.forEach((idx) => { next[idx] = null; });
    return { board: next, cleared: matches.size };
  };

  // Apply gravity to shift tiles down
  const applyGravity = (grid: (Tile | null)[], width: number): (Tile | null)[] => {
    const height = Math.floor(grid.length / width);
    const next = [...grid];
    for (let c = 0; c < width; c++) {
      const stack: Tile[] = [];
      for (let r = height - 1; r >= 0; r--) {
        const idx = r * width + c;
        const val = next[idx];
        if (val) stack.push(val);
      }
      let r = height - 1;
      for (const val of stack) { next[r * width + c] = val; r--; }
      for (; r >= 0; r--) { next[r * width + c] = null; }
    }
    return next;
  };

  // Refill null tiles with random tiles
  const refill = (grid: (Tile | null)[]): Tile[] =>
    grid.map((v) => (v ? v : getRandomTile(theme)));

  // Resolve matches on the board
  const resolveBoard = async (initial: Tile[], widthArg?: number, options?: { awardScore?: boolean }) => {
    const w = widthArg ?? (boardSize === 36 ? 6 : 4);
    const awardScore = options?.awardScore !== false;
    setIsResolving(true);
    let current: Tile[] = initial;
    while (true) {
      const matches = checkMatches(current, w);
      if (matches.size === 0) { setMatched(new Set()); break; }
      setMatched(matches);
      await sleep(200);
      const { board: clearedBoard, cleared } = clearMatches(current, matches);
      if (awardScore) setScore((prev) => [...prev, cleared]);
      const afterGravity = applyGravity(clearedBoard, w);
      const refilled = refill(afterGravity);
      setBoard(refilled);
      current = refilled;
    }
    if (!hasPossibleMoves(current, w)) {
      const fresh = generatePlayableBoard(boardSize, theme);
      setBoard(fresh);
    }
    setIsResolving(false);
  };

  // Handle tile drop for swapping
  const handleDrop = async (targetIndex: number) => {
    if (isResolving || !hasStarted || timer <= 0) return;
    if (draggedTile === null || draggedTile === targetIndex) return;
    const w = boardSize === 36 ? 6 : 4;
    if (!isAdjacent(draggedTile, targetIndex, w)) {
      setDraggedTile(null);
      return;
    }
    const swapped = [...board];
    [swapped[draggedTile], swapped[targetIndex]] = [swapped[targetIndex], swapped[draggedTile]];
    const m = checkMatches(swapped, w);
    if (m.size === 0) {
      setDraggedTile(null);
      return;
    }
    setBoard(swapped);
    setDraggedTile(null);
    await resolveBoard(swapped, w);
  };

  // Regenerate the board with a new size
  const regenerateBoard = async (size: number) => {
    const fresh = generatePlayableBoard(size, theme);
    setBoardSize(size);
    setBoard(fresh);
  };

  // Start the game
  const startTheGame = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScore([]);
    setTimer(120);
    setMatched(new Set());
    setHasStarted(true);
    await resolveBoard([...board], boardSize === 36 ? 6 : 4, { awardScore: false });
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          const roundScore = scoreRef.current;
          setTimeout(() => {
            if (roundScore > 0) {
              setTotal((prevTotal) => prevTotal + roundScore);
              setScore([]);
            }
            setHasStarted(false);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End the game
  const endTheGame = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const roundScore = scoreRef.current;
    if (roundScore > 0) {
      setTotal((prev) => prev + roundScore);
      setScore([]);
    }
    setHasStarted(false);
    setTimer(120);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    boardSize,
    board,
    setDraggedTile,
    matched,
    isResolving,
    hasStarted,
    timer,
    score,
    total,
    theme,
    setTheme,
    startTheGame,
    endTheGame,
    regenerateBoard,
    handleDrop,
  };
}