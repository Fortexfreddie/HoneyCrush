import { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Coins } from "lucide-react";


const FundWalletButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const requestHoneynetSol = async () => {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        setLoading(true);
        try {
            const conn = new Connection("https://rpc.test.honeycombprotocol.com");
            // const conn = new Connection(clusterApiUrl("devnet"));
            const pubkey = new PublicKey(wallet.publicKey);
            const sig = await conn.requestAirdrop(pubkey, 2 * 1e9); // 2 SOL
            await conn.confirmTransaction(sig, "confirmed");

            alert("2 Honeynet SOL airdropped!");
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed. See console for details.");
        } finally {
        setLoading(false);
        }
    };
    return (
        <button
            onClick={requestHoneynetSol}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Coins className="w-4 h-4" />
            {loading ? "Airdropping..." : "Fund My Wallet"}
        </button>
    );
}
 
export default FundWalletButton;