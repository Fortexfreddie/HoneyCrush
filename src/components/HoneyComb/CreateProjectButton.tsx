import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const CreateProjectButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [projectID, setProjectID] = useState("");

    const handleCreateProject = async () => {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        setLoading(true);
        try {
            const authority = wallet.publicKey.toBase58();
            const payer = authority;

            const profileDataConfig = {
                achievements: ["Pioneer"],
                customDataFields: ["NFTs owned"],
            };

            const {
                createCreateProjectTransaction: { project: projectAddress, tx: txResponse },
            } = await client.createCreateProjectTransaction({
                name: "HoneyCrush Game",
                authority,
                payer,
                profileDataConfig,
            });

            await sendClientTransactions(client, wallet, txResponse);

            console.log("Honeycomb Project Created! Project Address:", projectAddress);
            alert(`Project created successfully! Address: ${projectAddress}`);
            setProjectID(projectAddress);
        } catch (err) {
            console.error("Failed to create project", err);
            alert("Failed to create project (see console)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p className="text-xs text-wrap font-semibold text-gray-600 dark:text-gray-400 mb-4">
                Project ID: {projectID}
            </p>
            <button
                onClick={handleCreateProject}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                {loading ? "Creating..." : "Create Project"}
            </button>
        </div>
    );
};

export default CreateProjectButton;
