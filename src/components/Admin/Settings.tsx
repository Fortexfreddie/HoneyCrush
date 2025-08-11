import { useState } from "react";
import { FolderPlus, Gamepad2,Wallet } from "lucide-react";
import CreateProjectButton from "../CreateProjectButton";
import FundWalletButton from "../FundWalletButton";
import GetHoneynetBalanceButton from "../GetHoneynetBalanceButton";

const Settings = () => {
    const [isOn, setIsOn] = useState(false);

    return (  
        <div className="px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-extrabold">
                Settings
            </h1>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <h2 className="font-bold flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-[#D4AA7D]" /> Game Rules
                    </h2>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Enable Power-Ups</span>
                        <button
                            className={`w-12 h-7 rounded-full border border-white/20 relative transition-colors duration-300 
                            ${isOn ? "bg-[#D4AA7D]" : "bg-[#272727]"}`}
                        >
                            <span
                                onClick={() => setIsOn(!isOn)}
                                className={`absolute top-[1.5px] w-6 h-6 rounded-full shadow transition-all duration-300
                                ${isOn ? "right-0.5 bg-[#272727]" : "left-0.5 bg-[#D4AA7D]"}`}
                            />
                        </button>
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Match Combo Window (ms)</label>
                        <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="e.g. 800"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <h2 className="font-bold flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-[#D4AA7D]" /> Project Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage game projects</p>
                    <CreateProjectButton />
                </div>
                <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <h2 className="font-bold flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#D4AA7D]" /> Fund Wallet
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fund Wallet to Create and manage game projects</p>
                    <FundWalletButton />
                </div>
                <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <h2 className="font-bold flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#D4AA7D]" /> Fund Wallet
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check Wallet Balance</p>
                    <GetHoneynetBalanceButton />
                </div>
            </div>
        </div>
    );
}
 
export default Settings;