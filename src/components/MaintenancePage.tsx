import { Wrench, Clock, ArrowLeft, Zap } from "lucide-react";
import Button from "./UI/Button";
import { useNavigate } from "react-router-dom";

const MaintenancePage = () => {
    const navigate = useNavigate();

    return (  
        <div className="min-h-screen flex items-center justify-center">
            <div className="px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="p-8 md:p-12 rounded-2xl bg-white/45 dark:bg-black/35 border border-white/35 dark:border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                            <span className="p-4 rounded-full ring-2 ring-[#D4AA7D]/70 backdrop-blur-md shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]"><Wrench className="w-10 h-10 text-[#D4AA7D]" /></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">Under Maintenance</h1>
                        <p className="text-lg md:text-xl mb-8">
                            We're upgrading HoneyCrush to bring you better gameplay, enhanced NFT features, and smoother blockchain
                            integration.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-white/45 dark:bg-black/35 border border-black/20 dark:border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-5 h-5 text-[#D4AA7D]" />
                                    <h3 className="font-semibold text-shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">Estimated Time</h3>
                                </div>
                                <p className="text-start text-gray-800/90 dark:text-gray-200/90">2-4 hours</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/45 dark:bg-black/35 border border-black/20 dark:border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-5 h-5 text-[#D4AA7D]" />
                                    <h3 className="font-semibold text-shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">What's New</h3>
                                </div>
                                <p className="text-start text-gray-800/90 dark:text-gray-200/90">Enhanced rewards & bug fixes</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <Button onClick={() => navigate("/")} className="max-w-sm mx-auto px-6 py-2 border-2 border-[#D4AA7D] text-[#D4AA7D] hover:bg-[#D4AA7D] hover:text-black transition-all duration-200">
                                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                            </Button>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    );
}
 
export default MaintenancePage;