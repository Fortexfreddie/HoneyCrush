import {
  Sparkles,
  Gamepad2,
  Wallet,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import {Button, DashboardButton} from "./UI/Button";
import { useNavigate } from "react-router-dom";
import neonbee from "../assets/neon-bee-avatar-rare.png";

const avatars = [
  { name: "Cyber Bee v1", rarity: "Rare", img: { neonbee } },
  {
    name: "Glitch Hornet",
    rarity: "Epic",
    img: { neonbee },
  },
  {
    name: "Photon Wasp",
    rarity: "Legendary",
    img: { neonbee },
  },
  {
    name: "Quantum Drone",
    rarity: "Rare",
    img: { neonbee },
  },
  { name: "Nova Bee", rarity: "Epic", img: { neonbee } },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dx: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dx, behavior: "smooth" });
  };
  return (
    <div className="px-4 py-8 md:py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="p-6 md:p-8 rounded-[20px] bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-[#D4AA7D]" />
            <span>Futuristic Match-3</span>
          </div>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight tracking-[-0.02em] text-shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">
            HoneyCrush
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-700/90 dark:text-gray-200/90">
            Match. Win. Earn. Align neon tiles, power-up your NFT characters,
            and collect on-chain rewards.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <DashboardButton
              onClick={() => navigate("/game")}
              className="w-full sm:w-auto bg-[#D4AA7D]  text-black"
            >
              Start Playing
            </DashboardButton>
            <DashboardButton
              onClick={() => navigate("/tutorial")}
              className="w-full sm:w-auto bg-transparent border-2 border-[#D4AA7D] text-[#D4AA7D]  hover:text-black"
            >
              Learn How It Works
            </DashboardButton>
            <DashboardButton className="w-full sm:w-auto bg-white/20 dark:bg-white/10 text-black dark:text-white hover:bg-white/30 dark:hover:bg-white/20">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </DashboardButton>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-700/80 dark:text-gray-300/80">
            <Info className="w-4 h-4 mr-2" />
            <span>
              Powered by NFT avatars, missions, and rewards via Honeycomb on
              Solana.
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-[20px] bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl md:text-2xl font-bold">Featured Avatars</h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollBy(-300)}
                className="w-9 h-9 rounded-xl bg-white/40 dark:bg-black/30 border border-white/20 hover:border-white/40"
              >
                <ChevronLeft className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => scrollBy(300)}
                className="w-9 h-9 rounded-xl bg-white/40 dark:bg-black/30 border border-white/20 hover:border-white/40"
              >
                <ChevronRight className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {avatars.map((nft, index) => (
              <div key={index} className="min-w-[200px]">
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-lg">
                  <img
                    src={nft.img.neonbee}
                    alt={nft.name}
                    className="w-full h-40 object-cover object-center"
                  />
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold">{nft.name}</div>
                      <div className="text-xs opacity-75">{nft.rarity}</div>
                    </div>
                    <span className="cursor-pointer px-2 py-1 rounded-lg bg-[#D4AA7D] text-black text-xs font-bold">
                      NFT
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-[#D4AA7D]" />
            <h3 className="text-xl font-bold">How it works</h3>
          </div>
          <p className="mt-3 text-gray-800/90 dark:text-gray-200/90">
            Swap adjacent tiles to form matches of 3+ in a row. Clear combos,
            chain reactions, and earn points against the clock.
          </p>
          <span
            onClick={() => navigate("/game")}
            className="cursor-pointer mt-4 inline-flex items-center text-[#D4AA7D] hover:text-[#EFD09E] transition"
          >
            Play the demo
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        <div className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#D4AA7D]" />
            <h3 className="text-xl font-bold">Earn NFTs</h3>
          </div>
          <p className="mt-3 text-gray-800/90 dark:text-gray-200/90">
            Power up and collect NFT characters. Complete challenges to unlock
            traits and rare skins that boost your gameplay.
          </p>
          <span
            onClick={() => navigate("/missions")}
            className="cursor-pointer mt-4 inline-flex items-center text-[#D4AA7D] hover:text-[#EFD09E] transition"
          >
            See rewards
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        <div className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[#D4AA7D]" />
            <h3 className="text-xl font-bold">Play Missions</h3>
          </div>
          <p className="mt-3 text-gray-800/90 dark:text-gray-200/90">
            Take on daily and seasonal missions via Honeycomb Protocol to earn
            Nectar, XP, and token rewards.
          </p>
          <span
            onClick={() => navigate("/missions")}
            className="cursor-pointer mt-4 inline-flex items-center text-[#D4AA7D] hover:text-[#EFD09E] transition"
          >
            Explore missions
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
