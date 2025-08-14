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
            const assemblerConfigAddress = import.meta.env.VITE_ASSEMBLER_CONFIG_ADDY;
            const characterModelAddress = import.meta.env.VITE_CHARACTER_MODEL_ADDY;

            const { createAssembleCharacterTransaction } =
            await client.createAssembleCharacterTransaction({
                project: projectAddress,
                assemblerConfig: assemblerConfigAddress,
                characterModel: characterModelAddress,
                authority: wallet.publicKey.toString(),
                owner: wallet.publicKey.toString(),
                payer: wallet.publicKey.toString(),
                uri: "https://pw4kcdn-gvcydfg3b6hng4f7.z02.azurefd.net/media/bonlpgrh/2022_720x480headers_0006_small_bee-honeycomb.jpg?preset=fullWidth968@2x"
            });

            // Sign and send txResponse
            await sendClientTransactions(client, wallet, createAssembleCharacterTransaction);

            console.log(createAssembleCharacterTransaction);
            alert(`character assembled (Minted)`);
        } catch (err) {
            alert("Failed to assemble (Mint) character");
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
            {loading ? "Creating..." : "Assemble (Mint) character"}
        </button>
    );
}
 
export default MintCharacterButton;