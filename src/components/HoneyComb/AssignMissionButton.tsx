import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";
import { type Profile, createOrFetchProfile } from "../../hooks/useHoneycombProfile";

const AssignMissionButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
          createOrFetchProfile(wallet)
            .then((profileData) => setProfile(profileData))
            .catch((err) => {
              console.error("Profile error:", err);
            });
        }
    }, [wallet, wallet.connected, wallet.publicKey]);

    const userId = profile?.user?.id;
    console.log("User Id:", userId);

    const handleAssignMission = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const characterAddress = import.meta.env.VITE_CHARACTER_ADDY;
            const missionAddress = import.meta.env.VITE_MISSION_DefeatQueenBee_ADDY;

            console.log("Mission:", missionAddress);
            console.log("Character:", characterAddress);
            console.log("User Id:", userId);
            console.log("Wallet:", wallet.publicKey?.toString());

            const { createSendCharactersOnMissionTransaction } =
                await client.createSendCharactersOnMissionTransaction({
                data: {
                    mission: missionAddress.toString(),
                    characterAddresses: [
                        characterAddress.toString(),
                    ],
                    authority: wallet.publicKey.toString(),
                    payer: wallet.publicKey.toString(), // Optional
                },
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, createSendCharactersOnMissionTransaction);

            alert(`Mission assigned to character: ${characterAddress}`);
        } catch (err) {
            alert("Failed to assign mission to character");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleAssignMission}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Assigning..." : "Assign Mission"}
        </button>
    );
}
 
export default AssignMissionButton;