import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const CreateAssemblerConfigButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false); 
    
    
    const handleCreateAssemblerConfig = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;

            const { createCreateAssemblerConfigTransaction: { assemblerConfig: assemblerConfig, cost: cost, treeAddress: treeAddress, tx: txResponse } } =
            await client.createCreateAssemblerConfigTransaction({
                project: projectAddress,
                authority: wallet.publicKey.toString(),
                payer: wallet.publicKey.toString(),
                treeConfig: {
                    basic: { numAssets: 100000 }
                },
                ticker: "bee-warrior-config", // unique string
                order: ["Class", "Weapon", "Armor", "Background"], // trait order
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, txResponse);

            console.log(txResponse);
            alert(`assembler config created at: ${assemblerConfig}`);
            console.log(`Cost: ${cost}`);
            console.log(`Tree Address: ${treeAddress}`);
        } catch (err) {
            alert("Failed to create assembler config");
        console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
            onClick={handleCreateAssemblerConfig}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create assembler config"}
        </button>
    );
}
 
export default CreateAssemblerConfigButton;