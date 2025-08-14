import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";
import { RewardKind } from "@honeycomb-protocol/edge-client";

const CreateMissionButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateMission = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;
            const resourceAddress = import.meta.env.VITE_NECTAR_RESOURCE_ADDY;
            const missionPoolAddress = import.meta.env.VITE_MISSION_POOL_ADDY;

            const { createCreateMissionTransaction: { missionAddress: missionAddress, tx: txResponse } } =
                await client.createCreateMissionTransaction({
                data: {
                    name: "Defeat the Queen Bee",
                    project: projectAddress.toString(),
                    cost: {
                        address: resourceAddress.toString(),
                        amount: "1", // Cost to participate (Nectar)
                    },
                    duration: "86400", // 1 day
                    minXp: "1000", // Minimum XP required to participate in the mission
                    rewards: [
                        {
                            kind: RewardKind.Xp,
                            max: "1000",
                            min: "100",
                        },
                        {
                            kind: RewardKind.Resource,
                            max: "50", 
                            min: "10", 
                            resource: resourceAddress.toString(),
                        },
                    ],
                    missionPool: missionPoolAddress.toString(),
                    authority: wallet.publicKey.toString(),
                    payer: wallet.publicKey.toString(),
                },
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`Mission created! Address: ${missionAddress}`);
        } catch (err) {
            alert("Failed to create mission");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleCreateMission}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Mission"}
        </button>
    );
}
 
export default CreateMissionButton;