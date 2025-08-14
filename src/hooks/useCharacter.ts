import type { WalletContextState } from "@solana/wallet-adapter-react";
import { client } from "../lib/honeycombClient";

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



export async function fetchCharacters(
  wallet: WalletContextState
): Promise<Character[]> {
  const result = await client.findCharacters({
    wallets: wallet?.publicKey?.toBase58(),
    includeProof: true,
    filters: {},
  });

  return result.character;
}
