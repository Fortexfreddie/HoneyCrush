import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";


const CreateMissionPoolButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateMissionPool = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;
            const characterModelAddress = import.meta.env.VITE_CHARACTER_MODEL_ADDY;

            const { createCreateMissionPoolTransaction: { missionPoolAddress: missionPoolAddress, tx: txResponse } } =
                await client.createCreateMissionPoolTransaction({
                data: {
                    name: "Test Mission Pool",
                    project: projectAddress.toString(),
                    payer: wallet.publicKey.toString(),
                    authority: wallet.publicKey.toString(),
                    characterModel: characterModelAddress,
                },
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`Mission pool created at: ${missionPoolAddress}`);
        } catch (err) {
            alert("Failed to create Mission Pool");
        console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleCreateMissionPool}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Mission Pool"}
        </button>
    );
}
 
export default CreateMissionPoolButton;