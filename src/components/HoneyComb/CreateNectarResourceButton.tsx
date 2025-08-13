import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { ResourceStorageEnum } from "@honeycomb-protocol/edge-client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const CreateNectarResourceButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateResource = async () => {
        if (!wallet.publicKey) {
        alert("Connect your wallet first");
        return;
        }
        setLoading(true);
        try {
            const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;
            const { createCreateNewResourceTransaction: { resource: resourceAddress, tx: txResponse } } =
                await client.createCreateNewResourceTransaction({
                project: projectAddress,
                authority: wallet.publicKey.toString(),
                payer: wallet.publicKey.toString(),
                params: {
                    name: "Nectar",
                    decimals: 0,
                    symbol: "NECTAR",
                    uri: "http://localhost:5173/resource/nectar.json",
                    storage: ResourceStorageEnum.LedgerState,
                    tags: ["currency", "reward"],
                },
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`Nectar resource created! Address: ${resourceAddress}`);
        } catch (err) {
            alert("Failed to create resource");
        console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreateResource}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Nectar Resource"}
        </button>
    );
};

export default CreateNectarResourceButton;