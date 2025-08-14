import {Button} from "./UI/Button";
import { useEffect, useState, useRef } from "react";
import { User } from "lucide-react";
import NeonBee from "../assets/neon-bee-avatar-rare.png";
import { useGameLogic } from "../hooks/useGameLogic";
import {
  type Profile,
  createOrFetchProfile,
  addXpToProfile,
  getLevelProgress,
} from "../hooks/useHoneycombProfile";
import { useWallet } from "@solana/wallet-adapter-react";

const GamePage = () => {
  const wallet = useWallet();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      createOrFetchProfile(wallet)
        .then((profileData) => setProfile(profileData))
        .catch((err) => {
          console.error("Profile error:", err);
        });
    }
  }, [wallet, wallet.connected, wallet.publicKey]);

  const {
    // COLORS,
    boardSize,
    // setBoardSize,
    board,
    // setBoard,
    // draggedTile,
    setDraggedTile,
    // width,
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
  } = useGameLogic();

  const currentScore = score.reduce((sum, val) => sum + val, 0);
  const level = getLevelProgress(profile?.platformData?.xp);

  // Award XP when a round finishes (timer reaches 0) by tracking total's increase
  // We compute delta tiles cleared from the change in total and apply the same XP formula.
  const prevTotalRef = useRef<number>(total);
  useEffect(() => {
    const prev = prevTotalRef.current;
    if (total > prev) {
      const tilesCleared = total - prev; // round delta
      // XP formula: 5–10 XP per approx 3-tile match, with board multiplier
      const approxMatches = Math.floor(tilesCleared / 3);
      const perMatchXp = Math.min(10, 5 + Math.floor(tilesCleared / 30));
      const boardMultiplier = boardSize === 36 ? 1.5 : 1.0;
      const earnedXp = Math.max(1, Math.floor(approxMatches * perMatchXp * boardMultiplier));

      if (!wallet.connected || !wallet.publicKey || !profile?.address) {
        console.warn("[XP] Skipping XP update on timer end: wallet/profile unavailable", {
          connected: wallet.connected,
          hasPubkey: !!wallet.publicKey,
          hasProfile: !!profile?.address,
        });
      } else {
        const prevXp = profile?.platformData?.xp ?? 0;
        console.log("[XP] Timer-end XP", { tilesCleared, approxMatches, perMatchXp, boardMultiplier, earnedXp, prevXp });
        (async () => {
          try {
            await addXpToProfile(wallet, profile.address!, earnedXp);
            const updated = await createOrFetchProfile(wallet);
            const newXp = updated?.platformData?.xp ?? 0;
            console.log("[XP] Profile XP updated", { prevXp, newXp, delta: newXp - prevXp });
            setProfile(updated);
          } catch (e) {
            console.error("[XP] Failed to update XP on timer end:", e);
          }
        })();
      }
    }
    prevTotalRef.current = total;
  }, [total]);

  // End Game now just resets the timer by starting a new round
  const handleEndGame = () => {
    endTheGame()
  };

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <div className="md:w-4/6 flex flex-col gap-4">
          <div className="p-5 rounded-2xl order-2 lg:order-2 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl backdrop-blur-md border border-white/20 overflow-hidden">
                <img
                  src={profile?.info?.pfp || NeonBee}
                  alt="User Avatar"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.info?.name || "Player"}</span>
                <span className="text-sm">Level {level.level}</span>
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
                  {profile?.platformData?.xp ?? 0}
                </span>
              </div>
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">
                  Total Score
                </span>
                <span className="text-2xl font-extrabold dark:text-[#9EEFD0]">
                  {total}
                </span>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl order-3 lg:order-2 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold">Stats</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 flex flex-col text-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="text-xs uppercase opacity-80">Score</span>
                <span className="text-2xl font-extrabold">{currentScore}</span>
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
                onClick={handleEndGame}
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
          <div className="p-5 rounded-2xl order-1 lg:order-3 bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h3 className="text-lg font-bold">Power-Ups</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-800/90 dark:text-gray-200/90">
              <li>- Row Blaster (clear a row)</li>
              <li>- Column Blaster (clear a column)</li>
              <li>- Wildcard (match any color)</li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col gap-4">
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
                  onDragEnd={() => setDraggedTile(null)}
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
