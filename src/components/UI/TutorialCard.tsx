type TutorialCardProps = {
    title: string;
    icon?: React.ReactNode;
    description: string;
};
const TutorialCard = ({title, icon, description}: TutorialCardProps) => {
    return (  
        <section className="p-6 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl border border-white/35 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-10 h-10 flex items-center justify-center text-black/80 p-2 rounded-2xl bg-[#D4AA7D]">{icon}</span>
                {title}
            </h2>
            <p className="mt-4">{description}</p>
        </section>
    );
}
 
export default TutorialCard;