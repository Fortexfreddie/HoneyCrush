import { Puzzle, Wallet, Gamepad2, Sparkles, Trophy, Shield } from "lucide-react";
import {Button} from "./UI/Button";
import { useNavigate } from "react-router-dom";
import TutorialCard from "./UI/TutorialCard";

const TutorialPage = () => {
    const navigate = useNavigate();
    return (  
        <div className="px-4 py-8 md:py-12">
            <div className="p-6 md:p-8 rounded-2xl bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
                        <Puzzle className="w-7 h-7 text-[#D4AA7D]" />
                        How It Works
                        </h1>
                        <p className="text-gray-700/90 dark:text-gray-200/90 mt-2">
                        HoneyCrush is a futuristic match-3 puzzle where you align neon tiles to earn on-chain rewards. Level up NFT characters, complete missions powered by Honeycomb Protocol, and climb the leaderboards.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                        onClick={() => navigate("/game")}
                        className="w-full sm:w-auto bg-[#D4AA7D] hover:bg-[#EFD09E] text-black"
                        >
                        Play Now
                        </Button>
                        <Button
                        onClick={() => navigate("/missions")}
                        className="w-full sm:w-auto bg-transparent border-2 border-[#D4AA7D] text-[#D4AA7D] hover:bg-[#D4AA7D] hover:text-black"
                        >
                        View Missions
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TutorialCard
                    title="1. Connect Your Wallet"
                    icon={<Wallet />}
                    description="Connect a Solana wallet to track progress and claim Honeycomb rewards on-chain."
                />
                <TutorialCard
                    title="2. Match Tiles"
                    icon={<Gamepad2 />}
                    description="Swap adjacent tiles to create lines of 3 or more. Chain reactions yield bonus score."
                />
                <TutorialCard
                    title="3. Power Up NFTs"
                    icon={<Sparkles />}
                    description="Collect and upgrade NFT avatars to unlock passive perks and special abilities."
                />
                <TutorialCard
                    title="4. Complete Missions"
                    icon={<Trophy />}
                    description="Tackle daily and seasonal missions powered by Honeycomb to earn Nectar, XP, and tokens."
                />
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TutorialCard
                    title="Rewards & Resources"
                    icon={<Sparkles />}
                    description="Earn Nectar for upgrades, XP to progress your profile, and tokens for special entries and claims."
                />
                <TutorialCard
                    title="On-Chain Ownership"
                    icon={<Shield />}
                    description="Your NFT avatars and rewards are verifiable on Solana via Honeycomb Protocol integrations."
                />
                <TutorialCard
                    title="Skill-Based Gameplay"
                    icon={<Puzzle />}
                    description="The faster and smarter your matches, the higher your score and the better your rewards."
                />
            </div>
        </div>
    );
}
 
export default TutorialPage;