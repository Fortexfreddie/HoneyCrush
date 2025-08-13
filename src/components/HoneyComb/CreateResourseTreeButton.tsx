import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const CreateResourseTreeButton = () => {
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
            const resourceAddress = import.meta.env.VITE_NECTAR_RESOURCE_ADDY;

            const { createCreateNewResourceTreeTransaction: { treeAddress: merkleTreeAddress, tx: txResponse } } =
                await client.createCreateNewResourceTreeTransaction({
                project: projectAddress,
                authority: wallet.publicKey.toString(),
                resource: resourceAddress,
                treeConfig: {
                    basic: { numAssets: 100000 }
                }
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`Merkle tree created at: ${merkleTreeAddress}`);
        } catch (err) {
            alert("Failed to create Merkle tree");
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
            {loading ? "Creating..." : "Create Merkle tree"}
        </button>
    );
}
 
export default CreateResourseTreeButton;