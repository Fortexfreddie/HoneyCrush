import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Send } from "lucide-react";
import Button from "../UI/Button";

const TransferResource = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [userPublicKey, setUserPublicKey] = useState("");
    const [recipientPublicKey, setRecipientPublicKey] = useState("");
    const [amount, setAmount] = useState("");

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
            setLoading(true);
        try {
            const resourceAddress = import.meta.env.VITE_NECTAR_RESOURCE_ADDY;
            const { createTransferResourceTransaction: txResponse } = await client.createTransferResourceTransaction({
                resource: resourceAddress,
                owner: userPublicKey,
                recipient: recipientPublicKey,
                amount: amount.toString(),
                payer: wallet.publicKey.toString(),
            });
            await sendClientTransactions(client, wallet, txResponse);
            alert("Resource transfered!");
            console.log(txResponse);
        } catch (err) {
            alert("Transfer failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleTransfer}>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-sm font-semibold">Sender's address</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="9xJ9Abc...5678"
                        value={userPublicKey}
                        onChange={(e) => setUserPublicKey(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold">Recipient's address</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="9xJ9Abc...5678"
                        value={recipientPublicKey}
                        onChange={(e) => setRecipientPublicKey(e.target.value)}
                        disabled={loading}
                    />
                </div>
            </div>
            <div className="w-full">
                <label className="text-sm font-semibold">Amount of the resource to transfer</label>
                <input
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                    placeholder="10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
            >
                <Send className="w-4 h-4" />
                {loading ? "Transfering..." : "Transfer Resource"}
            </Button>
        </form>
    );
}
 
export default TransferResource;