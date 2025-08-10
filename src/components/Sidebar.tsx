import { useSidebar } from "../contexts/SidebarContext";
import Button from "./UI/Button";
import { X, Home, Users, Puzzle, Gift, Trophy, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navs = [
    { title: "Overview", href: "/admin", icon: <Home className="w-5 h-5" /> },
    { title: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { title: "Puzzles", href: "/admin/puzzles", icon: <Puzzle className="w-5 h-5" /> },
    { title: "Rewards & Economy", href: "/admin/rewards", icon: <Gift className="w-5 h-5" /> },
    { title: "Missions", href: "/admin/missions", icon: <Trophy className="w-5 h-5" /> },
    { title: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> }
]
const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    const navigate = useNavigate();

    const SidebarContent = (
        <div className="py-6">
            <ul className="flex flex-col gap-4">
                {
                    navs.map((nav, index) => (
                        <li key={index} onClick={() => navigate(nav.href)} className="flex items-center gap-2 hover:bg-[#D4AA7D]/20 rounded-xl px-4 py-2 cursor-pointer">
                            {nav.icon}
                            <span className="text-sm text-gray-800/90 dark:text-gray-200/90 font-semibold">{nav.title}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );


    return (  
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:block p-4 h-fit w-72 rounded-2xl bg-white/35 dark:bg-black/28 border border-white/30 dark:border-white/12 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
                <div className="flex items-center w-full border-b border-black/30 dark:border-white/50 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#272727] grid place-items-center shadow-[0_0_0_2px_rgba(212,170,125,0.35)_inset,0_0_16px_rgba(212,170,125,0.35),0_0_32px_rgba(122,92,255,0.25)]">
                            <span className="text-[#D4AA7D] font-black">$</span>
                        </div>
                        <div className="leading-tight">
                            <div className="font-extrabold tracking-tight">Admin</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-70">
                            Panel
                            </div>
                        </div>
                    </div>
                </div>
                {SidebarContent}
            </aside>


            {/* Mobile Sidebar */}
            {
                sidebarOpen && (
                    <aside className="lg:hidden fixed top-5 left-6 z-50 p-4 h-[90vh] w-60 rounded-2xl bg-white/35 dark:bg-black/28 border border-white/30 dark:border-white/12 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <div className="flex items-center justify-between w-full border-b border-black/30 dark:border-white/50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-[#272727] grid place-items-center shadow-[0_0_0_2px_rgba(212,170,125,0.35)_inset,0_0_16px_rgba(212,170,125,0.35),0_0_32px_rgba(122,92,255,0.25)]">
                                    <span className="text-[#D4AA7D] font-black">$</span>
                                </div>
                                <div className="leading-tight">
                                    <div className="font-extrabold tracking-tight">Admin</div>
                                    <div className="text-[10px] uppercase tracking-widest opacity-70">
                                    Panel
                                    </div>
                                </div>
                            </div>
                            <Button className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        {SidebarContent}
                    </aside>
                )
            }

            {/* Overlay for Mobile */}
            {sidebarOpen && (
                <div
                className="fixed inset-0 bg-black/70 bg-opacity-40 z-40 xl:hidden transition-opacity duration-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            )}
        </>
    );
}
 
export default Sidebar;