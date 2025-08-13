import { useState, useRef, useEffect } from "react";
import { useGame } from "../contexts/GameContext";

const COLORS = [
  "#FF0000", "#00CED1", "#FFD700", "#8A2BE2", "#0000FF", "#FF1493", "#00FF7F", "#FF6347",
];

const getRandomColor = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

export function useGameLogic() {
  const timerRef = useRef<number | null>(null);
  const { timer, setTimer, setScore, score, total, setTotal } = useGame();
  const currentScore = score.reduce((sum, val) => sum + val, 0);
  const scoreRef = useRef<number>(currentScore);
  useEffect(() => { scoreRef.current = currentScore; }, [currentScore]);

  const [boardSize, setBoardSize] = useState<number>(36);
  const [board, setBoard] = useState<string[]>([...Array(36)].map(() => getRandomColor(COLORS)));
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const width = boardSize === 36 ? 6 : 4;
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleDrop = async (targetIndex: number) => {
    if (isResolving || !hasStarted || timer <= 0) return;
    if (draggedTile === null || draggedTile === targetIndex) return;
    if (!isAdjacent(draggedTile, targetIndex, width)) {
      setDraggedTile(null);
      return;
    }
    const swapped = [...board];
    [swapped[draggedTile], swapped[targetIndex]] = [swapped[targetIndex], swapped[draggedTile]];
    const m = checkMatches(swapped, width);
    if (m.size === 0) {
      setDraggedTile(null);
      return;
    }
    setBoard(swapped);
    setDraggedTile(null);
    await resolveBoard(swapped, width);
  };

  const handleCleared = (cleared: number) => setScore((prev) => [...prev, cleared]);

  const checkMatches = (board: string[], width: number): Set<number> => {
    const matched = new Set<number>();
    const height = Math.floor(board.length / width);
    for (let r = 0; r < height; r++) {
      let c = 0;
      while (c <= width - 3) {
        const start = r * width + c;
        const color = board[start];
        if (!color) { c++; continue; }
        let run = 1;
        while (c + run < width && board[r * width + (c + run)] === color) run++;
        if (run >= 3) for (let k = 0; k < run; k++) matched.add(r * width + c + k);
        c += run;
      }
    }
    for (let c = 0; c < width; c++) {
      let r = 0;
      while (r <= height - 3) {
        const start = r * width + c;
        const color = board[start];
        if (!color) { r++; continue; }
        let run = 1;
        while (r + run < height && board[(r + run) * width + c] === color) run++;
        if (run >= 3) for (let k = 0; k < run; k++) matched.add((r + k) * width + c);
        r += run;
      }
    }
    return matched;
  };

  const isAdjacent = (a: number, b: number, width: number): boolean => {
    if (Math.floor(a / width) === Math.floor(b / width) && Math.abs(a - b) === 1) return true;
    if (Math.abs(a - b) === width) return true;
    return false;
  };

  const clearMatches = (grid: string[], matches: Set<number>) => {
    const next: (string | null)[] = [...grid];
    matches.forEach((idx) => { next[idx] = null; });
    return { board: next, cleared: matches.size };
  };

  const applyGravity = (grid: (string | null)[], width: number) => {
    const height = Math.floor(grid.length / width);
    const next = [...grid];
    for (let c = 0; c < width; c++) {
      const stack: string[] = [];
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

  const refill = (grid: (string | null)[], colors: string[]) =>
    grid.map((v) => (v ? v : getRandomColor(colors)));

  const hasPossibleMoves = (grid: string[], width: number): boolean => {
    const size = grid.length, height = Math.floor(size / width);
    for (let i = 0; i < size; i++) {
      const r = Math.floor(i / width), c = i % width;
      if (c + 1 < width) {
        const j = i + 1;
        if (grid[j] !== grid[i]) {
          const swapped = [...grid];
          [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
          if (checkMatches(swapped, width).size > 0) return true;
        }
      }
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

  const generatePlayableBoard = (size: number, colors: string[]): string[] => {
    const w = size === 36 ? 6 : 4;
    for (let attempts = 0; attempts < 500; attempts++) {
      const fresh = [...Array(size)].map(() => getRandomColor(colors));
      if (checkMatches(fresh, w).size > 0) continue;
      if (hasPossibleMoves(fresh, w)) return fresh;
    }
    return [...Array(size)].map(() => getRandomColor(colors));
  };

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
      if (matches.size === 0) { setMatched(new Set()); break; }
      setMatched(matches);
      await sleep(200);
      const { board: clearedBoard, cleared } = clearMatches(current, matches);
      if (awardScore) handleCleared(cleared);
      const afterGravity = applyGravity(clearedBoard, w);
      const refilled = refill(afterGravity, COLORS);
      setBoard(refilled);
      current = refilled;
    }
    if (!hasPossibleMoves(current, w)) {
      const fresh = generatePlayableBoard(boardSize, COLORS);
      setBoard(fresh);
    }
    setIsResolving(false);
  };

  const regenerateBoard = async (size: number) => {
    const fresh = generatePlayableBoard(size, COLORS);
    setBoardSize(size);
    setBoard(fresh);
  };

  const endTheGame = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const roundScore = scoreRef.current;
    if (roundScore > 0) {
      setTotal((prev) => prev + roundScore);
      setScore([]);
    }
    setHasStarted(false);
    setTimer(0);
  };

  const startTheGame = async () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setScore([]);
    setTimer(120);
    setMatched(new Set());
    setHasStarted(true);
    await resolveBoard([...board], width, { awardScore: false });
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
          const roundScore = scoreRef.current;
          if (roundScore > 0) {
            setTotal((prevTotal) => prevTotal + roundScore);
            setScore([]);
          }
          setHasStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    COLORS,
    boardSize,
    setBoardSize,
    board,
    setBoard,
    draggedTile,
    setDraggedTile,
    width,
    matched,
    isResolving,
    hasStarted,
    timer,
    score,
    total,
    startTheGame,
    endTheGame,
    regenerateBoard,
    handleDrop,
  };
}