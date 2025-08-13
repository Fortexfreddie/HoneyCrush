import { Gift, Plus } from "lucide-react";
import MintResourceButton from "../HoneyComb/MintResourceButton";
import TransferResourceButton from "../HoneyComb/TransferResourceButton";


const Rewards = () => {
  return (
    <div className="px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">Rewards & Economy</h1>
        <div className="mt-4 flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="font-bold flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#D4AA7D]" /> Balances
            </h2>
            <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white/40 dark:bg-black/30 border border-white/20 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <span className="text-sm opacity-80">Nectar</span>
                    <span className="font-extrabold">1,240,000</span>
                </div>
            </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AA7D]" /> Mint Resource
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mint Nectar Resource for a user (to the address)
                </p>
                <MintResourceButton />
            </div>
            <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AA7D]" /> Transfer Resource
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transfer Nectar Resource for a user to another (via address)
                </p>
                <TransferResourceButton />
            </div>
        </div>
    </div>
  );
}
 
export default Rewards;