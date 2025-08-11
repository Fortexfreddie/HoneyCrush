import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { Plus } from "lucide-react";

const CreateProjectButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateProject = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            alert("Please connect your wallet first");
            return;
        }

        setLoading(true);
        try {
        const { createCreateProjectTransaction } =
            await client.createCreateProjectTransaction({
            name: "HoneyCrush Game",
            authority: wallet.publicKey.toBase58(),
            payer: wallet.publicKey.toBase58(),
            profileDataConfig: {
                achievements: [
                "Puzzle Master",
                "Speed Solver",
                "Combo King",
                "Treasure Collector",
                "Level Legend",
                ],
                customDataFields: [
                "Games Played",
                "High Score",
                "Nectar Earned",
                "Last Active",
                ],
            },
            });

        // createCreateProjectTransaction returns an object that has the tx payload.
        // pass it into sendClientTransactions (this signs with the connected wallet and submits).
        const response = await sendClientTransactions(
            client,
            wallet,
            createCreateProjectTransaction.tx ?? createCreateProjectTransaction
        );
        // `response` shape depends on the helper; you should get the sent tx info.
        console.log("Project created. Response:", response);

        // if the `project` address is returned separately by the create call, save it:
        // (some docs show `project` alongside `tx` in the returned object)
        if (createCreateProjectTransaction.project) {
            localStorage.setItem(
            "honeycomb_project",
            createCreateProjectTransaction.project
            );
            console.log(
            "Project address saved:",
            createCreateProjectTransaction.project
            );
        }
        } catch (err) {
            console.error("Failed to create project", err);
            alert("Failed to create project (see console)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreateProject}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Project"}
        </button>
    );
};

export default CreateProjectButton;
