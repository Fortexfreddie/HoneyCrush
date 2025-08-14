import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { UserCheck } from "lucide-react";
import {Button} from "../UI/Button";


const MintResourceButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [userPublicKey, setUserPublicKey] = useState("");
    const [amount, setAmount] = useState("");

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
            setLoading(true);
        try {
            const resourceAddress = import.meta.env.VITE_NECTAR_RESOURCE_ADDY;
            const { createMintResourceTransaction: txResponse } = await client.createMintResourceTransaction({
                resource: resourceAddress,
                amount: amount.toString(),
                authority: wallet.publicKey.toString(),
                owner: userPublicKey,
                payer: wallet.publicKey.toString(),
            });
            await sendClientTransactions(client, wallet, txResponse);
            alert("Resource minted!");
            console.log(txResponse);
        } catch (err) {
            alert("Mint failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleMint}>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-sm font-semibold">user's address</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="9xJ9Abc...5678"
                        value={userPublicKey}
                        onChange={(e) => setUserPublicKey(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold">set amount</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="10"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
            >
                <UserCheck className="w-4 h-4" />
                {loading ? "Minting..." : "Mint Resource"}
            </Button>
        </form>
    );
};

export default MintResourceButton;
