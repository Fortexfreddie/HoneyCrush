import { Trophy, Clock, Gift, BadgeCheck, CheckCircle2 } from "lucide-react";
import MissionsCard from "./UI/MissionsCard";

const MissionsPage = () => {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="p-6 md:p-8 rounded-2xl bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-[#D4AA7D]" />
              Missions & Rewards
            </h1>
            <p className="text-gray-700/90 dark:text-gray-200/90 mt-2">
              Complete objectives powered by Honeycomb Protocol to earn Nectar,
              XP, and tokens.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
              <span className="text-xs uppercase tracking-widest opacity-70">
                Nectar
              </span>
              <span className="font-extrabold text-[#D4AA7D]">150</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
              <span className="text-xs uppercase tracking-widest opacity-70">
                XP
              </span>
              <span className="font-extrabold text-[#EFD09E]">1500</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
              <span className="text-xs uppercase tracking-widest opacity-70">
                Tokens
              </span>
              <span className="font-extrabold text-[#9EEFD0]">3</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AA7D]" />
            Active
          </h2>
          <div className="mt-4 space-y-4">
            <MissionsCard
              title="Daily Challenge"
              //   icon={<Gift className="w-5 h-5 text-[#D4AA7D]" />}
              description="Complete 10 matches in under 5 minutes."
              nectar={20}
              xp={500}
              tokens={1}
              valid="Ends today"
              //   onClaim={() => alert("Claimed Daily Challenge!")}
            />
            <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
              No active missions. Check back soon!
            </div>
          </div>
        </section>
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AA7D]" />
            Claim Rewards
          </h2>
          <div className="mt-4 space-y-4">
            <MissionsCard
              title="Weekly Challenge"
              icon={<Gift className="w-5 h-5 text-[#D4AA7D]" />}
              description="Win 5 matches in a row."
              nectar={50}
              xp={1000}
              tokens={2}
              valid="Ready to claim"
              onClaim={() => alert("Claimed Weekly Challenge!")}
            />
            <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
              No rewards ready to claim.
            </div>
          </div>
        </section>
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-[#D4AA7D]" />
            Completed
          </h2>
          <div className="mt-4 space-y-4">
            <MissionsCard
              title="Daily Challenge"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              description="Complete 10 matches in under 5 minutes."
              nectar={20}
              xp={500}
              tokens={1}
              valid="Completed"
            />
            <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
              No completed missions yet.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MissionsPage;
