# HoneyCrush — On-chain Match-3 on Solana

HoneyCrush is a fast, neon-styled match-3 web game inspired by Candy Crush, integrated with on-chain profiles and rewards. Players swap tiles to make matches, earn scores, level up with XP, and complete missions. The game connects a Solana wallet to a Honeycomb Protocol profile, where XP and total score persist across sessions. NFT characters are featured in the UI, and the app supports daily missions and dynamic board themes.

## Highlights

- Real-time match-3 gameplay (`4x4` and `6x6` boards)
- Profile persistence via Honeycomb Protocol:
  - XP tracked in `platformData.xp`
  - Total score tracked in `platformData.custom.totalScore`
  - Missions stored in `platformData.custom.missionsState`
  - Additional custom keys like `totalMatchesPlayed`
- Solana wallet connectivity (`wallet-adapter`)
- NFT characters rendered in Dashboard
- Non-time-based missions (matches & total score milestones)
- Mobile-friendly UI with neon/cyberpunk themes
- Admin interface for game and Honeycomb project management

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS (utility classes)
- Icons: `lucide-react`
- Wallet: `@solana/wallet-adapter-react`
- Honeycomb Protocol: `@honeycomb-protocol/edge-client`

## Core Integrations

### Honeycomb Protocol (Edge Client)

- Profiles are fetched or created on first wallet connect.
- XP is updated using a dedicated transaction builder (see `addXpToProfile`).
- Total score and mission state are written to `platformData.custom` as key/value entries using `setTotalScoreOnProfile`.
- Custom data is persisted as an array of `{ key, value }` pairs (see Notes below).

**Files to review:**
- `src/hooks/useHoneycombProfile.ts` — profile normalization, XP/score updates, helper utilities
- `src/lib/honeycombClient.ts` — Honeycomb client configuration (project-level)

### Solana Wallet Adapter

- The site uses the Solana wallet adapter React providers for connecting and reading the public key.

## Game Mechanics (Overview)

- Board: `4x4` or `6x6` grid with themed tiles
- Interactions: drag to swap adjacent tiles
- Matching: `3+` in a row/column clears tiles; chain reactions are supported
- Scoring: per clear and chain; per-round score summed into the running total
- Timer: round timer starts at `120` seconds; round ends when timer hits `0` or the user presses End Game
- Round end flow (critical for persistence):
  - XP is awarded based on cleared tiles
  - `totalScore` is persisted to the profile (absolute value)
  - `totalMatchesPlayed` increments by `1` and timestamps recorded
- Progression: User's score increases their XP, which in turn increases their level. With each level increase, the user gains access to new characters and new game board styles.

**Implementation references:**
- `src/hooks/useGameLogic.ts` — board generation, match detection, gravity, refill
- `src/components/GamePage.tsx` — UI glue, XP/score integration on round end

## Missions System (Non-Time-Based)

- `10` static missions:
  - `5` based on total matches played (`platformData.custom.totalMatchesPlayed`)
  - `5` based on total score (`platformData.custom.totalScore`)
- Rewards:
  - Claiming adds XP to the user profile
  - Claimed state is stored in `platformData.custom.missionsState`
- Progress updates:
  - The Game page persists `totalMatchesPlayed` and `totalScore` when a round ends
  - Missions page periodically polls profile state so progress is reflected shortly after play

**Implementation references:**
- `src/components/MissionsPage.tsx`

## NFT Characters (Dashboard)

- Featured Characters section showcases art from `src/assets/characters/` with unlock levels (e.g., Level `1`, `5`, `10`, `15`, `20`, `25`).
- If you have on-chain character data, you can also render wallet characters via `fetchCharacters`.

**Implementation references:**
- `src/components/Dashboard.tsx`

## Admin Interface

The admin interface, accessible at `/admin` on the live site (https://honeycrush.netlify.app/admin), provides tools to manage the game and Honeycomb project. Key features include:

- Dashboard for overview and control (see `AdminDashboard.tsx`)
- Mission management (see `Missions.tsx`)
- Reward configuration (see `Rewards.tsx`)
- User management (see `Users.tsx`)
- Settings adjustments (see `Settings.tsx`)

From the admin page, you can retrieve values for environment variables (e.g., settings, missions, rewards) and top up balances for gas fees.

**Implementation references:**
- `src/components/Admin/` — all admin-related components

## Routing & Deployment

This is a single-page application (SPA). Deployments must rewrite all routes to `index.html` to allow client-side routing.

- Netlify: include `public/_redirects` with:
  ```
  /* /index.html 200
  ```
- Vercel: add `vercel.json` with a global rewrite
- GitHub Pages: copy `index.html` to `404.html` in the build output or use HashRouter
- S3/CloudFront, Nginx, Apache: configure a history fallback to `index.html`

This repository includes a Netlify-style `_redirects` file.

## Getting Started (Local)

### Prerequisites
- Node.js `18+`

### Setup
1. Install Honeycomb and Solana dependencies:
   ```bash
   npm install @solana/wallet-adapter-react @solana/wallet-adapter-base @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui @solana/web3.js @honeycomb-protocol/edge-client bs58
   ```
2. Install remaining dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and fill in the correct values:
   ```bash
   cp .env.example .env
   ```
   Obtain the necessary values (e.g., `VITE_HONEYCOMB_PROJECT_ID`) from the admin page under settings, missions, rewards, etc. You can also top up balances from the admin page to cover gas fees.
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```
6. Preview the production build:
   ```bash
   npm run preview
   ```

## Environment & Configuration

- `VITE_HONEYCOMB_PROJECT_ID` — Honeycomb project identifier used by the edge client
- Honeycomb Client: See `src/lib/honeycombClient.ts` for connection config

## Project Structure (Key Files)

```
src/
  assets/
    characters/          # Featured character art
  components/
    Admin/
      AdminDashboard.tsx # Admin overview and controls
      Missions.tsx       # Mission management
      Rewards.tsx        # Reward configuration
      Settings.tsx       # Settings adjustments
      Users.tsx          # User management
    HoneyComb/
      AssignMissionB...    # Mission assignment logic
      CreateCharacter...   # Character creation
      DelegateForm.tsx     # Delegation form
      FetchCharacter...    # Character fetching
      ProjectDriverFo...   # Project driver (form)
      TransferResource...  # Resource transfer
      .......
    Dashboard.tsx        # Landing, Featured Characters
    GamePage.tsx         # Gameplay + XP/Total persistence
    MissionsPage.tsx     # Static non-time-based missions
  contexts/
    GameContext.tsx      # Timer, score, totals
  hooks/
    useGameLogic.ts      # Board logic, matching, resolve cycles
    useHoneycombProfile.ts # Profile, XP, totalScore, missions persistence
    useCharacter.ts      # Wallet character helpers (optional)
  lib/
    honeycombClient.ts   # Honeycomb edge client setup
  main.tsx, App.tsx      # App root & routing
public/
  _redirects             # SPA history fallback for Netlify-style hosts
  UI/                    # UI components or assets
```

## Video Guide

For a step-by-step tutorial, watch the video guide: [Insert YouTube Video URL Here]

## Implementation Notes

- Custom data format: the Honeycomb edge client expects `platformData.custom` as an array of `{ key, value }` pairs. The helper `setTotalScoreOnProfile` converts/merges object data to the required array shape and ensures all values are strings.
- Total score persistence uses absolute writes (not deltas). This is robust against missed client updates.
- Missions read directly from persisted `totalMatchesPlayed` and `totalScore` to avoid UI drift.

## Disclaimer

HoneyCrush is currently in active development. While it demonstrates significant potential as an innovative on-chain gaming experience, features may evolve, and users should anticipate ongoing enhancements and potential modifications as the project matures.

## Contributing

Issues and PRs are welcome. For feature requests, please open an issue describing your use case.

## License

This project is provided under the MIT License. See `LICENSE`.
