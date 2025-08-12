import Button from "../UI/Button";
import { UserCheck } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { HiveControlPermissionInput } from "@honeycomb-protocol/edge-client";

const DelegateForm = () => {
    const wallet = useWallet();
    const [delegateAddress, setDelegateAddress] = useState("");
    const [selectedPermission, setSelectedPermission] = useState<HiveControlPermissionInput>(HiveControlPermissionInput.ManageProjectDriver);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        if (!delegateAddress) {
            alert("Please enter a delegate address");
            return;
        }

        setLoading(true);

        try {
            const adminPublicKey = wallet.publicKey?.toBase58();
            const payer = adminPublicKey;
            // const projectAddress = localStorage.getItem("honeycomb_project") || "";

            // if (!projectAddress) {
            //     throw new Error("No project address found in local storage");
            // }

            const {
                createCreateDelegateAuthorityTransaction,
            } = await client.createCreateDelegateAuthorityTransaction({
                authority: adminPublicKey!,
                delegate: delegateAddress,
                project: import.meta.env.VITE_HONEYCOMB_PROJECT_ID,
                payer,
                serviceDelegations: {
                HiveControl: [
                    {
                    permission: selectedPermission,
                    },
                ],
                },
            });

            await sendClientTransactions(client, wallet, createCreateDelegateAuthorityTransaction);

            alert("Delegate authority successfully created!");
            console.log("Delegate authority created for:", delegateAddress);

            setDelegateAddress("");
        } catch (err) {
            console.error("Failed to create delegate authority", err);
            alert("Failed to create delegate authority (see console for details)");
        } finally {
            setLoading(false);
        }
    };

    return (  
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 place-items-center gap-2">
                <div>
                    <label className="text-sm font-semibold">Delegate Address</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        placeholder="9xJ9Abc...5678"
                        value={delegateAddress}
                        onChange={(e) => setDelegateAddress(e.target.value)}
                        disabled={loading}
                    />
                </div>    

                <div>
                    <label className="text-sm font-semibold mt-4">Select Permission</label>
                    <select
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-white/20"
                        value={selectedPermission}
                        onChange={(e) => setSelectedPermission(e.target.value as HiveControlPermissionInput)}
                        disabled={loading}
                    >
                        <option value={HiveControlPermissionInput.ManageProjectDriver}>Manage Project Driver</option>
                        <option value={HiveControlPermissionInput.ManageCriterias}>Manage Criterias</option>
                        <option value={HiveControlPermissionInput.ManageServices}>Manage Services</option>
                        <option value={HiveControlPermissionInput.UpdatePlatformData}>Update PlatformData</option>
                    </select>
                </div>    
            </div>
            <Button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4">
                <UserCheck className="w-4 h-4" /> Delegate
            </Button>
        </form>
    );
}
 
export default DelegateForm;