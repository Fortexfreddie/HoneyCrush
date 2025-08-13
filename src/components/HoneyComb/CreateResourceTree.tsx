import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";

const CreateResourcesTree = () => {
  const wallet = useWallet();

  const handleCreateResourcesTree = async () => {
    if (!wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const adminPublicKey = wallet.publicKey.toBase58();
      const payer = adminPublicKey;

      const {
        createCreateResourceTreeTransaction: {
          treeAddress: merkleTreeAddress,
          tx: txResponse,
        },
      } = await client.createCreateNewResourceTreeTransaction({
        payer,
        project: import.meta.env.VITE_HONEYCOMB_PROJECT_ID,
        treeConfig: {
          basic: {
            numAssets: 100000,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to create Resource Tree`, error);
    }
  };

  return <></>;
};
