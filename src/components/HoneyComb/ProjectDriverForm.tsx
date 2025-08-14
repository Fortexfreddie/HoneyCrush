import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { UserCheck } from "lucide-react";
import {Button} from "../UI/Button";

const ProjectDriverForm = () => {
    const wallet = useWallet();
    const [driverAddress, setDriverAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // Hardcoded values
    const projectAddress = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;
    const adminPublicKey = wallet.publicKey?.toBase58();
    const payerPublicKey = adminPublicKey;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        if (!driverAddress) {
            alert("Please enter a driver address");
            return;
        }

        setLoading(true);
        try {
        const { createChangeProjectDriverTransaction: txResponse } =
            await client.createChangeProjectDriverTransaction({
                authority: adminPublicKey!,
                project: projectAddress,
                driver: driverAddress,
                payer: payerPublicKey!,
            });

            await sendClientTransactions(client, wallet, txResponse);

            alert("Project driver successfully changed!");
            setDriverAddress("");
        } catch (err) {
            console.error("Failed to change project driver", err);
            alert("Failed to change project driver. See console for details.");
        } finally {
            setLoading(false);
        }
    };

return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 place-items-center gap-2">
        <div>
          <label className="text-sm font-semibold">New Driver Address</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
            placeholder="9xJ9Abc...5678"
            value={driverAddress}
            onChange={(e) => setDriverAddress(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Project Address</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 border border-white/20"
            value={projectAddress}
            disabled
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
      >
        <UserCheck className="w-4 h-4" />
        {loading ? "Changing..." : "Change Driver"}
      </Button>
    </form>
);
};

export default ProjectDriverForm;
