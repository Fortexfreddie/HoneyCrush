import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";
import { MintAsKind } from "@honeycomb-protocol/edge-client";

const CreateCharacterModelButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false); 
    
    
    const handleCreateCharacterModel = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;
            const assemblerConfigAddress = import.meta.env.VITE_ASSEMBLER_CONFIG_ADDY;

            const { createCreateCharacterModelTransaction: { characterModel: characterModel, tx: txResponse } } =
            await client.createCreateCharacterModelTransaction({
                project: projectAddress,
                authority: wallet.publicKey.toString(),
                payer: wallet.publicKey.toString(),
                mintAs: { kind: MintAsKind.MplCore },
                config: {
                    kind: "Assembled",
                    assemblerConfigInput: {
                        assemblerConfig: assemblerConfigAddress,
                        collectionName: "Bee Warriors",
                        name: "Bee Warrior",
                        symbol: "BWARRIOR",
                        description: "A brave bee warrior character.",
                        sellerFeeBasisPoints: 0,
                        creators: [{ address: wallet.publicKey.toString(), share: 100 }],
                    },
                },
                attributes: [["Weapon", "Bow"], ["Armor", "Helmet"]],
                cooldown: { ejection: 1 },
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`character model created: ${characterModel}`);
        } catch (err) {
            alert("Failed to create character model");
        console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleCreateCharacterModel}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create character model"}
        </button>
    );
}
 
export default CreateCharacterModelButton;