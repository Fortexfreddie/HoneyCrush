import { useState } from "react";
import {
  FolderPlus,
  Gamepad2,
  Wallet,
  AlertTriangle,
  UserCheck,
  TreePine,
  Plus
} from "lucide-react";
import CreateProjectButton from "../HoneyComb/CreateProjectButton";
import FundWalletButton from "../HoneyComb/FundWalletButton";
import GetHoneynetBalanceButton from "../HoneyComb/GetHoneynetBalanceButton";
import { useNavigate } from "react-router-dom";
import DelegateForm from "../HoneyComb/DelegateForm";
import ProjectDriverForm from "../HoneyComb/ProjectDriverForm";
import CreateProfilesTreeButton from "../HoneyComb/CreateProfilesTreeButton";
import CreateNectarResourceButton from "../HoneyComb/CreateNectarResourceButton";
import MintResourceButton from "../HoneyComb/MintResourceButton";
import CreateResourseTreeButton from "../HoneyComb/CreateResourseTreeButton";


const Settings = () => {
  const [isOn, setIsOn] = useState(false);
  console.log(localStorage.getItem("honeycomb_project")); // project ID

  const navigate = useNavigate();

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">Settings</h1>
      <div className="mt-4 flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-[#D4AA7D]" /> Game Rules &
            Settings
          </h2>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 p-3 border border-[#D4AA7D]/30 dark:border-[#272727] rounded-xl ${
                isOn ? "bg-red-500/10 border-red-500/20" : "bg-transparent"
              }`}
            >
              <AlertTriangle
                onClick={() => navigate("/maintenance")}
                className="w-4 h-4 text-red-500"
              />
              <span
                className={`text-sm font-semibold ${
                  isOn ? "text-red-600 dark:text-red-400" : "text-base"
                }`}
              >
                Maintainance Mode
              </span>
            </div>
            <button
              className={`w-12 h-7 rounded-full relative transition-all duration-300 
                            ${
                              isOn
                                ? "bg-[#D4AA7D]/30 dark:bg-[#272727]"
                                : "bg-[#272727]/30  dark:bg-black/40"
                            }`}
            >
              <span
                onClick={() => setIsOn(!isOn)}
                className={`absolute top-0.5 bg-[#272727] dark:bg-[#D4AA7D] left-0.5 w-6 h-6 rounded-full shadow-sm transition-transform duration-300
                                ${
                                  isOn ? "translate-x-5" : "translate-x-0"
                                } cursor-pointer`}
              />
              {/* <span
                                onClick={() => setIsOn(!isOn)}
                                className={`absolute top-[1.5px] w-6 h-6 rounded-full shadow transition-all duration-300
                                ${isOn ? "right-0.5 bg-[#272727]" : "left-0.5 bg-[#D4AA7D]"}`}
                            /> */}
            </button>
          </div>
          <div>
            <label className="text-sm font-semibold">
              Match Combo Window (ms)
            </label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
              placeholder="e.g. 800"
            />
          </div>
        </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#D4AA7D]" /> Project Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage game projects
          </p>
          <CreateProjectButton />
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <TreePine className="w-4 h-4 text-[#D4AA7D]" /> Profiles Tree
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create Profiles Tree
          </p>
          <CreateProfilesTreeButton />
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#D4AA7D]" /> Project Driver
          </h2>
          <div>
            <ProjectDriverForm />
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#D4AA7D]" /> Delegate Authority
          </h2>
          <div>
            <DelegateForm />
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#D4AA7D]" /> Create Resource
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create Nectar Resource
          </p>
          <CreateNectarResourceButton />
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#D4AA7D]" /> Create Merkle tree
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create the Merkle tree for the nectar Resource
          </p>
          <CreateResourseTreeButton />
        </div>
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
            <Wallet className="w-4 h-4 text-[#D4AA7D]" /> Fund Wallet
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fund Wallet to Create and manage game projects
          </p>
          <FundWalletButton />
        </div>
        <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="font-bold flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#D4AA7D]" /> Check Wallet
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check Wallet Balance
          </p>
          <GetHoneynetBalanceButton />
        </div>
      </div>
    </div>
  );
};
 
export default Settings;