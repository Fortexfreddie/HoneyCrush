import { useWalletRequiredModal } from "../contexts/WalletRequiredModalContext";
import { Wallet, Coins, Trophy, Shield } from "lucide-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Button from "./UI/Button";
import { useRef } from "react";

const WalletRequiredModal = () => {
    const {isOpen, setIsOpen} = useWalletRequiredModal();
    const walletMultiButtonWrapperRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        const btn = walletMultiButtonWrapperRef.current?.querySelector('button');
        if (btn) btn.click();
    };

    return (  
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 dark:bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <div className="z-10 w-full max-w-md mx-auto border border-[#D4AA7D]/20 bg-white/45 dark:bg-black/35 backdrop-blur-md rounded-2xl dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ring-2 ring-[#D4AA7D]/70 backdrop-blur-md shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">
                            <Wallet className="w-8 h-8 text-[#D4AA7D]" />
                        </div>
                        <h2 className="text-2xl mb-2 font-extrabold leading-tight tracking-[-0.02em] text-shadow-[0_0_12px_rgba(212,170,125,0.35),0_0_30px_rgba(239,208,158,0.25)]">Connect Your Wallet</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Connect your wallet to start playing the game
                        </p>
                    </div>
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#D4AA7D]/50 dark:bg-[#D4AA7D]/20 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-[#EFD09E] dark:text-[#D4AA7D]" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Earn Rewards</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Collect Nectar, XP, and Tokens while playing</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EFD09E]/30 dark:bg-[#EFD09E]/20 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-[#EFD09E] dark:text-[#D4AA7D]" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Complete Missions</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Unlock achievements and special rewards</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#9EEFD0]/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-[#9EEFD0]" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Secure & Decentralized</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                Your assets are stored safely on the blockchain
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Button onClick={handleClick} className="w-full bg-[#D4AA7D] hover:bg-[#EFD09E] text-black/90">Connect Wallet</Button>
                            <div ref={walletMultiButtonWrapperRef} style={{ display: 'none' }}>
                                <WalletMultiButton />
                            </div>

                            <Button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-sm border border-[#D4AA7D]/20 hover:border-[#D4AA7D]/40">
                                Maybe later
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default WalletRequiredModal;