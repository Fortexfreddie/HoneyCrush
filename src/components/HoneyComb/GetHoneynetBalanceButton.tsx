import { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Coins } from "lucide-react";


const GetHoneynetBalanceButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const getHoneynetBalance = async () => {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        setLoading(true);
        try {
            const conn = new Connection("https://rpc.test.honeycombprotocol.com");
            // const conn = new Connection(clusterApiUrl("devnet"));
            const pubkey = new PublicKey(wallet.publicKey);
            const lamports = await conn.getBalance(pubkey);
            const sol = lamports / 1e9;

            alert(`Wallet balance: ${sol} SOL (Honeynet)`);
        } catch (error) {
            console.error("Error fetching balance:", error);
            alert("Failed to get balance. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={getHoneynetBalance}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Coins className="w-4 h-4" />
            {loading ? "Checking..." : "Check My Wallet Balance"}
        </button>
    );
}
 
export default GetHoneynetBalanceButton;