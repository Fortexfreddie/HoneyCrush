import CreateMissionPoolButton from "../HoneyComb/CreateMissionPoolButton";
import CreateMissionButton from "../HoneyComb/CreateMissionButton";
import AssignMissionButton from "../HoneyComb/AssignMissionButton";
import { Trophy, Plus } from "lucide-react";
import Button from "../UI/Button";

const Missions = () => {
  return (
    <div className="px-4 py-8">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold">Mission Tracking</h1>
            <Button className="px-4 py-2 text-black bg-[#D4AA7D] hover:bg-[#EFD09E]">
                New Mission
            </Button>
        </div>
        <div className="mt-4 flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#D4AA7D]" /> Missions
            </h2>
            <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white/40 dark:bg-black/30 border border-white/20 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    <span className="text-sm opacity-80">Missions</span>
                    <span className="font-extrabold">12</span>
                </div>
            </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AA7D]" /> Create Mission Pool
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create Mission Pool to groups missions by type, level, etc.
                </p>
                <CreateMissionPoolButton />
            </div>
            <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AA7D]" /> Create Mission
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create Mission that define requirements and rewards for the mission.
                </p>
                <CreateMissionButton />
            </div>
            <div className="flex flex-col justify-between p-4 md:p-5 space-y-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AA7D]" /> Assign Mission to Character
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    When a user wants to start a mission, assign it to their character.
                </p>
                <AssignMissionButton />
            </div>
        </div>
    </div>
  );
}
 
export default Missions;