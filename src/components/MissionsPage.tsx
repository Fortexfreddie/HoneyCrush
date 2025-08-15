import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Trophy, Clock, Gift, BadgeCheck, CheckCircle2 } from "lucide-react";
import MissionsCard from "./UI/MissionsCard";
import {
  createOrFetchProfile,
  type Profile,
  addXpToProfile,
  setTotalScoreOnProfile,
} from "../hooks/useHoneycombProfile";

// Mission shape (no time-based fields)
type Mission = {
  id: string;
  title: string;
  description: string;
  kind: "matches" | "score"; // progress source
  target: number; // threshold to complete
  rewardXp: number; // XP reward on claim
  claimed?: boolean; // whether user claimed the reward
};

// Persisted state in profile.platformData.custom.missionsState
interface MissionsState {
  missions: Mission[];
}

// Generate a fixed set of 10 missions (5 for matches, 5 for score)
function generateStaticMissions(): Mission[] {
  const missions: Mission[] = [];
  const matchTargets = [5, 10, 20, 50, 100];
  const scoreTargets = [1000, 5000, 10000, 25000, 50000];
  matchTargets.forEach((t, i) => {
    missions.push({
      id: `m-matches-${t}-${i}`,
      title: `Play ${t} matches`,
      description: `Complete ${t} total matches (cumulative).`,
      kind: "matches",
      target: t,
      rewardXp: 100 + i * 50,
      claimed: false,
    });
  });
  scoreTargets.forEach((t, i) => {
    missions.push({
      id: `m-score-${t}-${i}`,
      title: `Reach ${t.toLocaleString()} total score`,
      description: `Accumulate a total score of ${t.toLocaleString()} (cumulative).`,
      kind: "score",
      target: t,
      rewardXp: 150 + i * 75,
      claimed: false,
    });
  });
  return missions;
}

export default function MissionsPage() {
  const wallet = useWallet();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [missionsState, setMissionsState] = useState<MissionsState | null>(null);

  // Derive progress sources from profile
  const totalScore = useMemo(() => Number(profile?.platformData?.custom?.totalScore ?? 0), [profile]);
  const totalMatches = useMemo(() => Number(profile?.platformData?.custom?.totalMatchesPlayed ?? 0), [profile]);

  // Load profile on connect
  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;
    createOrFetchProfile(wallet)
      .then((p) => setProfile(p))
      .catch((e) => console.error("[Missions] Failed to fetch profile", e));
  }, [wallet, wallet.connected, wallet.publicKey]);

  // Poll profile periodically so progress updates after rounds
  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;
    const id = setInterval(() => {
      createOrFetchProfile(wallet).then((p) => setProfile(p)).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [wallet, wallet.connected, wallet.publicKey]);

  // Initialize or load missions
  useEffect(() => {
    if (!profile?.address) return;
    const custom = profile.platformData?.custom ?? {};
    const raw = custom.missionsState as string | undefined;
    let parsed: MissionsState | null = null;
    try {
      parsed = raw ? (JSON.parse(raw) as MissionsState) : null;
    } catch {
      parsed = null;
    }
    if (!parsed || !Array.isArray(parsed.missions)) {
      const missions = generateStaticMissions();
      const state: MissionsState = { missions };
      setMissionsState(state);
      // Persist initial missions state
      const preservedTotal = Number(custom.totalScore ?? 0);
      setTotalScoreOnProfile(
        wallet,
        profile.address,
        preservedTotal,
        { ...custom, missionsState: JSON.stringify(state) }
      )
        .then(async () => {
          const updated = await createOrFetchProfile(wallet);
          setProfile(updated);
        })
        .catch((e) => console.error("[Missions] Persist state failed", e));
      return;
    }
    setMissionsState(parsed);
  }, [profile?.address, profile?.platformData?.custom, profile?.platformData?.custom?.missionsState, wallet]);

  // Compute mission views
  const annotated = useMemo(() => {
    const missions = missionsState?.missions ?? [];
    const progressOf = (m: Mission) => (m.kind === "matches" ? totalMatches : totalScore);
    const withStatus = missions.map((m) => {
      const progress = progressOf(m);
      const done = progress >= m.target;
      const status: "completed" | "claimable" | "active" = m.claimed ? "completed" : done ? "claimable" : "active";
      return { ...m, progress, status } as Mission & { progress: number; status: "completed" | "claimable" | "active" };
    });
    const active = withStatus.filter((m) => m.status === "active");
    const claimable = withStatus.filter((m) => m.status === "claimable");
    const completed = withStatus.filter((m) => m.status === "completed");
    return { active, claimable, completed };
  }, [missionsState, totalMatches, totalScore]);

  async function persistMissions(next: MissionsState) {
    if (!profile?.address || !wallet.connected || !wallet.publicKey) return;
    const custom = profile.platformData?.custom ?? {};
    const preservedTotal = Number(custom.totalScore ?? 0);
    try {
      await setTotalScoreOnProfile(
        wallet,
        profile.address,
        preservedTotal,
        { ...custom, missionsState: JSON.stringify(next) }
      );
      const updated = await createOrFetchProfile(wallet);
      setProfile(updated);
      setMissionsState(next);
    } catch (e) {
      console.error("[Missions] Persist after update failed", e);
    }
  }

  async function onClaim(missionId: string, rewardXp: number) {
    if (!profile?.address || !wallet.connected || !wallet.publicKey || !missionsState) return;
    const missions = missionsState.missions.slice();
    const idx = missions.findIndex((m) => m.id === missionId);
    if (idx < 0) return;
    const m = missions[idx];
    const progress = m.kind === "matches" ? totalMatches : totalScore;
    if (m.claimed || progress < m.target) return;

    try {
      await addXpToProfile(wallet, profile.address, rewardXp);
    } catch (e) {
      console.error("[Missions] Failed to add XP on claim", e);
      return;
    }

    missions[idx] = { ...m, claimed: true };
    await persistMissions({ missions });
  }

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
              Complete missions by playing matches and increasing your total score.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Matches</span>
              <span className="font-extrabold text-[#D4AA7D]">{totalMatches}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Total Score</span>
              <span className="font-extrabold text-[#D4AA7D]">{totalScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active */}
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AA7D]" />
            Active
          </h2>
          <div className="mt-4 space-y-4">
            {[...annotated.active, ...annotated.claimable].map((m) => (
              <MissionsCard
                key={m.id}
                title={m.title}
                icon={m.status === "claimable" ? (
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Clock className="w-5 h-5 text-[#D4AA7D]" />
                )}
                description={`${m.description} — Progress: ${m.progress.toLocaleString()}/${m.target.toLocaleString()}`}
                nectar={0}
                xp={m.rewardXp}
                valid={m.status === "claimable" ? "Ready to claim" : "In progress"}
                onClaim={m.status === "claimable" ? () => onClaim(m.id, m.rewardXp) : undefined}
              />
            ))}
            {annotated.active.length === 0 && annotated.claimable.length === 0 && (
              <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
                No active missions. Check back soon!
              </div>
            )}
          </div>
        </section>

        {/* Claimable */}
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AA7D]" />
            Claim Rewards
          </h2>
          <div className="mt-4 space-y-4">
            {annotated.claimable.map((m) => (
              <MissionsCard
                key={`claim-${m.id}`}
                title={m.title}
                icon={<BadgeCheck className="w-5 h-5 text-emerald-400" />}
                description={`${m.description} — Progress: ${m.progress.toLocaleString()}/${m.target.toLocaleString()}`}
                nectar={0}
                xp={m.rewardXp}
                valid="Ready to claim"
                onClaim={() => onClaim(m.id, m.rewardXp)}
              />
            ))}
            {annotated.claimable.length === 0 && (
              <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
                No rewards ready to claim.
              </div>
            )}
          </div>
        </section>

        {/* Completed */}
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-[#D4AA7D]" />
            Completed
          </h2>
          <div className="mt-4 space-y-4">
            {annotated.completed.map((m) => (
              <MissionsCard
                key={`completed-${m.id}`}
                title={m.title}
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                description={`${m.description} — Completed`}
                nectar={0}
                xp={m.rewardXp}
                valid="Completed"
              />
            ))}
            {annotated.completed.length === 0 && (
              <div className="p-4 rounded-xl text-sm text-center opacity-75 border border-dashed border-black/15 dark:border-white/15">
                No completed missions yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
