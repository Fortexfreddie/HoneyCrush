import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { TreePine } from "lucide-react";

const CreateProfilesTreeButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateProfilesTree = async () => {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        setLoading(true);

        try {
            const adminPublicKey = wallet.publicKey.toBase58();
            const payer = adminPublicKey;

            const {
                createCreateProfilesTreeTransaction: { tx: txResponse },
            } = await client.createCreateProfilesTreeTransaction({
                payer,
                project: import.meta.env.VITE_HONEYCOMB_PROJECT_ID,
                treeConfig: {
                basic: {
                    numAssets: 100000, // Max profiles that can be stored
                },
                },
            });

            const txSig = await sendClientTransactions(client, wallet, txResponse);

            console.log("Profiles Tree Created!", txSig);
            alert(`Profiles Tree created successfully! : ${txSig}`);
        } catch (err) {
            console.error("Failed to create profiles tree", err);
            alert("Failed to create profiles tree (see console for details)");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
      <button
        onClick={handleCreateProfilesTree}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <TreePine className="w-4 h-4" />
        {loading ? "Creating..." : "Create Profiles Tree"}
      </button>
    </div>
  );
};

export default CreateProfilesTreeButton;
