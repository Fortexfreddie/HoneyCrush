import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const MintCharacterButton = () => {
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
            const characterModelAddress = import.meta.env.VITE_CHARACTER_MODEL_ADDY;

            const { createCreateCharactersTreeTransaction: { treeAddress: treeAddress, tx: txResponse } } =
            await client.createCreateCharactersTreeTransaction({
                project: projectAddress,
                authority: wallet.publicKey.toString(),
                characterModel: characterModelAddress,
                payer: wallet.publicKey.toString(),
                treeConfig: { basic: { numAssets: 100000 } }
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`characters tree created: ${treeAddress}`);
        } catch (err) {
            alert("Failed to create characters tree");
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
            {loading ? "Creating..." : "Create characters tree"}
        </button>
    );
}
 
export default MintCharacterButton;