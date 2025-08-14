import type { WalletContextState } from "@solana/wallet-adapter-react";
import { client } from "../lib/honeycombClient";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
// CharacterSourceKind, SourceKind, AssetCriteriaKind would ideally be imported
// from your GraphQL types or manually typed as enums.
type CharacterSourceKind = string;
type SourceKind = string;
type AssetCriteriaKind = string;

interface AssembledSource {
  __typename?: "Assembled";
  hash?: string | null;
  mint: string;
  uri: string;
  attributes?: Record<string, any> | null;
  assemblerConfig: string;
}

interface WrappedSource {
  __typename?: "Wrapped";
  mint: string;
  kind?: SourceKind | null;
  criteria: {
    __typename?: "AssetCriteria";
    kind: AssetCriteriaKind;
    params?: string | null;
  };
}

interface CharacterSource {
  __typename?: "CharacterSource";
  kind: CharacterSourceKind;
  params: AssembledSource | WrappedSource;
}

interface Proof {
  __typename?: "Proof";
  leaf: string;
  leaf_index: string;
  node_index: string;
  maxDepth: number;
  proof: string[];
  root: string;
  tree_id: string;
  canopy_depth: number;
}

interface UsedByCustom {
  __typename?: "UsedByCustom";
  user: string;
  data: any;
}

interface UsedByEjected {
  __typename?: "UsedByEjected";
  mint: string;
}

interface UsedByGuild {
  __typename?: "UsedByGuild";
  id: string;
  order: number;
  role: {
    __typename?: "GuildRole";
    kind: string;
  };
}

interface EarnedRewards {
  __typename?: "EarnedRewards";
  delta: number;
  rewardIdx: number;
  collected: boolean;
}

interface UsedByMission {
  __typename?: "UsedByMission";
  missionId: string;
  participationId: string;
  endTime: number;
  rewards: EarnedRewards[];
}

interface UsedByStaking {
  __typename?: "UsedByStaking";
  pool: string;
  staker: string;
  stakedAt: number;
  claimedAt: number;
}

type UsedByParams =
  | UsedByCustom
  | UsedByEjected
  | UsedByGuild
  | UsedByMission
  | UsedByStaking
  | null;

interface CharacterUsedBy {
  __typename?: "CharacterUsedBy";
  kind: string;
  params?: UsedByParams;
}

interface CharacterCooldown {
  __typename?: "CharacterCooldown";
  ejection: number;
}

export interface Character {
  __typename?: "Character";
  owner: string;
  equipments: Record<string, any>;
  leaf_idx: string;
  tree_id: string;
  address: string;
  asset?: any | null;
  source: CharacterSource;
  proof?: Proof | null;
  usedBy: CharacterUsedBy;
  cooldown: CharacterCooldown;
}

/**
 * Helper to resolve the most reliable image URI for a character.
 * - Prefers Assembled source.params.uri
 * - Falls back to common asset metadata locations
 */
export function getCharacterImageUri(
  character: Character | undefined | null
): string | undefined {
  if (!character) return undefined;
  const params = (character.source?.params ?? {}) as Partial<
    AssembledSource & WrappedSource
  >;
  const uriFromSource = (params as Partial<AssembledSource>)?.uri;

  // Common places URIs live depending on backend metadata
  const asset = character.asset as any;
  const uriFromAssetFiles = asset?.content?.files?.[0]?.uri;
  const uriFromJson = asset?.content?.json_uri ?? asset?.content?.json?.image;

  return uriFromSource || uriFromAssetFiles || uriFromJson;
}

export async function equipResourceToCharacters(wallet: WalletContextState) {
  const characterModelAddress = import.meta.env.VITE_CHARACTER_MODEL_ADDY;
  const characterAddress = import.meta.env.VITE_CHARACTER_ADDY;
  const resourceAddress = import.meta.env.VITE_NECTAR_RESOURCE_ADDY;
  const walletString = wallet?.publicKey?.toString() || "";

  if (!characterModelAddress || !characterAddress || !resourceAddress || !walletString) {
    throw new Error("Missing required parameters for equipResourceToCharacters");
  }

  try {
    const { createEquipResourceOnCharacterTransaction } =
      await client.createEquipResourceOnCharacterTransaction({
        characterModel: characterModelAddress.toString(), // The address of the character model
        characterAddress: characterAddress.toString(), // The character the resource is being equipped to
        resource: resourceAddress.toString(), // The address of the resource being equipped
        owner: walletString, // The public key of the owner
        amount: "5",
      });
    // await sendClientTransactions(
    //   client,
    //   walletString,
    //   createEquipResourceOnCharacterTransaction
    // );
    return(createEquipResourceOnCharacterTransaction);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchCharacters(
  wallet: WalletContextState
): Promise<Character[]> {
  try {
    if (!wallet?.publicKey) return [];
    const walletStr = wallet.publicKey.toBase58();

    const result = await client.findCharacters({
      wallets: [walletStr], // important: the API expects an array
      includeProof: true,
      filters: {},
    });

    return result?.character ?? [];
  } catch (e) {
    console.error("Failed to fetch characters:", e);
    return [];
  }
}
