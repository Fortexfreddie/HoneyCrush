import Button from "./Button";

type MissionsCardProps = {
    title: string;
    icon?: React.ReactNode;
    description: string;
    nectar: number;
    xp: number;
    tokens: number;
    valid?: string;
    onClaim?: () => void;
};

const MissionsCard = ({title, icon, description, nectar, xp, tokens, valid, onClaim}: MissionsCardProps) => {
    return (  
        <div className="p-4 rounded-2xl transition border border-white/10 hover:border-white/20 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-start justify-between gap-3">
            <div className="w-full">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{title}</h3>
                    {icon}
                </div>
                <p className="text-sm text-gray-800/90 dark:text-gray-200/90 mt-1">
                    {description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs w-full">
                    <span className="px-2 py-1 rounded-lg bg-[#D4AA7D] text-black font-bold">
                        +{nectar} Nectar
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-[#EFD09E] text-black font-bold">
                        +{xp} XP
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-[#9EEFD0] text-black font-bold">
                        +{tokens} Token(s)
                    </span>
                    <span className="ml-2 opacity-80">{valid}</span>
                </div>
            </div>
            {
                onClaim && 
                <Button 
                    onClick={onClaim} 
                    className="bg-[#D4AA7D] hover:bg-[#EFD09E] text-black"
                >
                    Claim
                </Button>
            }
            </div>
        </div>
    );
}
 
export default MissionsCard;