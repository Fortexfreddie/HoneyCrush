import { client } from "../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import type { WalletContextState } from "@solana/wallet-adapter-react";

export interface Profile {
    address?: string;
    info?: {
        wallet?: string | null;
        name?: string | null;
        bio?: string | null;
        pfp?: string | null;
    };
    wallet?: string | null;
    platformData?: {
        xp?: number;
        achievements?: string[];
        custom?: Record<string, string>;
    };
    user?: {
        address?: string;
        id?: number;
        wallets?: {
        wallets?: string[];
        };
        info?: {
        name?: string | null;
        bio?: string | null;
        pfp?: string | null;
        username?: string | null;
        };
        socialInfo?: {
        discord?: string | null;
        twitter?: string | null;
        steam?: string | null;
        };
    };
}


function normalizeProfile(apiProfile: any): Profile {
  return {
    address: apiProfile.address,
    info: {
      wallet: apiProfile.info?.wallet ?? undefined,
      name: apiProfile.info?.name ?? undefined,
      bio: apiProfile.info?.bio ?? undefined,
      pfp: apiProfile.info?.pfp ?? undefined,
    },
    wallet: apiProfile.wallet ?? undefined,
    platformData: {
      xp: Number(apiProfile.platformData?.xp ?? 0),
      achievements: apiProfile.platformData?.achievements ?? [],
      custom: apiProfile.platformData?.custom ?? {},
    },
    user: apiProfile.user
      ? { wallets: { wallets: apiProfile.user.wallets?.wallets ?? [] } }
      : undefined,
  };
}


/**
 * Ensures the connected wallet has a profile.
 * 1. Searches for an existing profile for the wallet.
 * 2. If none exists, creates a new User + Profile in one call.
 * 3. Returns the found or created profile.
 */
export async function createOrFetchProfile(
    wallet: WalletContextState
    ): Promise<Profile | null> {
    if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
    }

    const walletBase58 = wallet.publicKey.toBase58();
    const project = import.meta.env.VITE_HONEYCOMB_PROJECT_ID;

    // Step 1: Search for existing profile linked to this wallet
    const search = await client.findProfiles({
        projects: [project],
        includeUsers: true // so you can check linked user.wallet
    });

    // This will usually contain 0 or more profiles
    let profile = search?.profile?.find((p) =>
      p.user?.wallets?.wallets?.includes(walletBase58)
    ) ?? null;

    // Step 2: If none exists → create new User + Profile
    if (!profile) {
        const name = `Player-${walletBase58.slice(0, 4)}`;
        const bio = "Puzzle master in the making!";
        const pfp = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${walletBase58}`;

        const { createNewUserWithProfileTransaction: txResponse } =
        await client.createNewUserWithProfileTransaction({
            project,
            wallet: walletBase58,
            payer: walletBase58,
            profileIdentity: "main",
            userInfo: { name, bio, pfp },
        });

        await sendClientTransactions(client, wallet, txResponse);

        // Step 3: Fetch newly created profile
        const afterCreate = await client.findProfiles({
            projects: [project],
            includeUsers: true,
        });

        profile =
        afterCreate?.profile?.find((p) =>
            p.user?.wallets?.wallets?.includes(walletBase58)
        ) ?? null;
    }

    return profile ? normalizeProfile(profile) : null;
}
