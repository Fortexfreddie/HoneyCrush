import { Search, Ban, UserCheck } from "lucide-react";
import {Button} from "../UI/Button";


const users = [
  { id: "1", handle: "HNYc...9xA1", name: "NovaBee", role: "player", status: "active" },
  { id: "2", handle: "HNYc...3fD2", name: "PhotonAI", role: "player", status: "suspended" },
  { id: "3", handle: "HNYc...7kZ9", name: "Glitcher", role: "player", status: "active" },
  { id: "4", handle: "HNYc...2qL5", name: "QueenBee", role: "admin", status: "active" },
]

const Users = () => {
    return (
      <div className="px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            User Management
          </h1>
          <div className="px-4 flex items-center rounded-xl bg-white/60 dark:bg-black/30 border border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <Search className="w-4 h-4 opacity-60" />
            <input
              placeholder="Search players..."
              className="pl-4 py-2 outline-none"
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Player</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-black/10 dark:border-white/10"
                >
                  <td className="flex flex-col tracking-wider leading-relaxed py-3 pr-4">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs opacity-70">{user.handle}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span>{user.role}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        user.status === "active"
                          ? "bg-emerald-400/80"
                          : "bg-rose-400/80"
                      } text-[#272727] dark:text-white/90`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button className="bg-rose-400/80 text-black gap-1">
                        <Ban className="w-4 h-4" /> Suspend
                      </Button>
                      <Button className="bg-emerald-400/80 text-black gap-1">
                        <UserCheck className="w-4 h-4" /> Unban
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
 
export default Users;