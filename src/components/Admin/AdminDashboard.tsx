import { Users, Puzzle, Gift, Trophy } from "lucide-react";

const stats = [
  {
    label: "Active Players",
    value: "1,248",
    icon: <Users className="w-5 h-5 text-[#D4AA7D]" />,
  },
  {
    label: "Current Missions",
    value: "12",
    icon: <Trophy className="w-5 h-5 text-[#D4AA7D]" />,
  },
  {
    label: "Rewards Distributed",
    value: "84.2k",
    icon: <Gift className="w-5 h-5 text-[#D4AA7D]" />,
  },
  {
    label: "Puzzle Levels",
    value: "48",
    icon: <Puzzle className="w-5 h-5 text-[#D4AA7D]" />,
  },
];

const AdminDashboard = () => {
  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold">
        Dashboard Overview
      </h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <section
            key={index}
            className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center justify-between w-full">
              <h2 className="text-sm opacity-70">{stat.label}</h2>
              <span>{stat.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
