import { client } from "../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { ResourceStorageEnum } from "@honeycomb-protocol/edge-client";

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

/**
 * Normalize a raw profile response from the Honeycomb edge client
 * into a shape we can use safely in the UI.
 */
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
      ? {
          id: apiProfile.user.id,
          address: apiProfile.user.address,
          wallets: { wallets: apiProfile.user.wallets?.wallets ?? [] },
          info: apiProfile.user.info,
          socialInfo: apiProfile.user.socialInfo,
        }
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
    let profile = search?.profile?.find((p: any) =>
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
        afterCreate?.profile?.find((p: any) =>
            p.user?.wallets?.wallets?.includes(walletBase58)
        ) ?? null;
    }

    return profile ? normalizeProfile(profile) : null;
}

/**
 * Compute level/progress values for the progress bar using total XP from profile.platformData.xp.
 * Level 0 → 1 requires 100 XP, then each next level requires +25% XP (floored).
 */
export function getLevelProgress(totalXp?: number | null) {
  const xp = Math.max(0, Number(totalXp ?? 0));
  let level = 0;
  let requirement = 500; // XP to go from level 0 -> 1
  let remaining = xp;

  while (remaining >= requirement) {
    remaining -= requirement;
    level += 1;
    requirement = Math.floor(requirement * 1.75);
  }

  const progress = requirement > 0 ? remaining / requirement : 0;
  return {
    level,            // current level (0-based; display as level)
    current: remaining, // xp inside current level
    required: requirement, // xp required to reach next level
    progress,         // 0..1 for progress bar fill
  };
}

/**
 * Internal helper to obtain the project ID from localStorage or env.
 */
function getProjectId(): string {
  const ls = typeof window !== "undefined" ? window.localStorage.getItem("honeycomb_project") : null;
  const env = (import.meta as any)?.env?.VITE_HONEYCOMB_PROJECT_ID as string | undefined;
  const project = ls || env;
  if (!project) throw new Error("Project ID not configured. Set localStorage.honeycomb_project or VITE_HONEYCOMB_PROJECT_ID");
  return project;
}

/**
 * Create the Nectar resource as a project Resource on Honeycomb (LedgerState storage).
 * This does not affect profile XP; it creates a fungible in-game currency tracked by Honeycomb's ledger.
 * Returns the created resource address if the API returns it.
 */
export async function createNectarResource(
  wallet: WalletContextState,
  resourceMetaUri: string = "https://example.com/nectar.json"
): Promise<string | undefined> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const payer = wallet.publicKey.toBase58();
  const project = getProjectId();

  const { createCreateNewResourceTransaction } =
    await client.createCreateNewResourceTransaction({
      authority: payer,
      payer,
      project,
      params: {
        name: "Nectar",
        symbol: "NECT",
        decimals: 9,
        storage: ResourceStorageEnum.LedgerState,
        uri: resourceMetaUri,
        tags: ["game", "currency"],
      },
    });

  await sendClientTransactions(
    client,
    wallet,
    createCreateNewResourceTransaction()
  );

  // If available in response, return the resource address
  return (createCreateNewResourceTransaction as any)?.resource;
}

/**
 * Create an XP resource. This is optional and separate from profile.platformData.xp.
 * - Keep decimals at 0 so XP is an integer resource (no fractions).
 * - This will not change how your progress bar works (it still uses profile.platformData.xp).
 */
export async function createXpResource(
  wallet: WalletContextState,
  resourceMetaUri: string = "https://example.com/xp.json"
): Promise<string | undefined> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const payer = wallet.publicKey.toBase58();
  const project = getProjectId();

  const { createCreateNewResourceTransaction } =
    await client.createCreateNewResourceTransaction({
      authority: payer,
      payer,
      project,
      params: {
        name: "Experience Points",
        symbol: "XP",
        decimals: 0, // XP as whole numbers
        storage: ResourceStorageEnum.LedgerState,
        uri: resourceMetaUri,
        tags: ["game", "xp"],
      },
    });

  await sendClientTransactions(
    client,
    wallet,
    createCreateNewResourceTransaction
  );

  return (createCreateNewResourceTransaction as any)?.resource;
}

/**
 * Generic resource mint helper. Mints an amount of a Resource to an owner wallet.
 * - resourceAddress: Resource account (string)
 * - amount: string integer (respect resource decimals). Example: "50000"
 * - ownerBase58: recipient wallet; defaults to connected wallet
 * Notes:
 *   - In Honeycomb LedgerState, balances are tracked per wallet, effectively attaching to the user.
 *   - This is what you should call when the user presses a "Claim" button after mission completion.
 */
export async function mintResourceToUser(
  wallet: WalletContextState,
  resourceAddress: string,
  amount: string,
  ownerBase58?: string
): Promise<void> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const payer = wallet.publicKey.toBase58();
  const owner = ownerBase58 ?? payer;

  const { createMintResourceTransaction } = await client.createMintResourceTransaction({
    resource: resourceAddress,
    amount,          // string, e.g. "50000"
    authority: payer,
    owner,           // recipient wallet address
    payer,           // the connected wallet pays fee by default
  });

  await sendClientTransactions(
    client,
    wallet,
    createMintResourceTransaction
  );
}

/**
 * Convenience wrapper for Nectar specifically; delegates to mintResourceToUser.
 */
export async function mintNectarToUser(
  wallet: WalletContextState,
  nectarResourceAddress: string,
  amount: string,
  ownerBase58?: string
): Promise<void> {
  return mintResourceToUser(wallet, nectarResourceAddress, amount, ownerBase58);
}

/**
 * Add XP to a profile's platform data on-chain. This is what feeds your progress bar.
 * Use this after a match or mission completion so Level/progress updates correctly.
 */
export async function addXpToProfile(
  wallet: WalletContextState,
  profileAddress: string,
  xp: number
): Promise<void> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  if (xp <= 0) return;

  const payer = wallet.publicKey.toBase58();

  const { createUpdatePlatformDataTransaction } = await client.createUpdatePlatformDataTransaction({
    authority: payer,
    payer,
    profile: profileAddress,
    platformData: { addXp: xp.toString() },
  });

  await sendClientTransactions(
    client,
    wallet,
    createUpdatePlatformDataTransaction
  );
}

/**
 * Set the user's total score into platformData.custom.totalScore (stringified integer).
 * Provide baseCustom if you want to preserve existing keys; otherwise only totalScore is set.
 */
export async function setTotalScoreOnProfile(
  wallet: WalletContextState,
  profileAddress: string,
  totalScore: number,
  baseCustom?: Record<string, string>
): Promise<void> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  if (totalScore < 0) return;

  const payer = wallet.publicKey.toBase58();
  const custom = {
    ...(baseCustom ?? {}),
    totalScore: Math.max(0, Math.floor(totalScore)).toString(),
  };

  const { createUpdatePlatformDataTransaction } = await client.createUpdatePlatformDataTransaction({
    authority: payer,
    payer,
    profile: profileAddress,
    platformData: { custom },
  });

  await sendClientTransactions(
    client,
    wallet,
    createUpdatePlatformDataTransaction
  );
}

/**
 * Increment the user's total score by deltaScore using current stored total as a base.
 * If currentStoredTotal is omitted, caller should pass baseCustom containing an up-to-date value.
 */
export async function addScoreToProfile(
  wallet: WalletContextState,
  profileAddress: string,
  deltaScore: number,
  currentStoredTotal?: number,
  baseCustom?: Record<string, string>
): Promise<void> {
  if (deltaScore <= 0) return;
  const prev = Math.max(0, Math.floor(Number(currentStoredTotal ?? 0)));
  const next = prev + Math.max(0, Math.floor(deltaScore));
  await setTotalScoreOnProfile(wallet, profileAddress, next, baseCustom);
}
