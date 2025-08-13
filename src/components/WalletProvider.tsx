import { type ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

interface Props {
  children: ReactNode;
}

export default function WalletContextProvider({ children }: Props) {
  const network = "https://rpc.test.honeycombprotocol.com";

  const endpoint = useMemo(() => network, []);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  // const network = WalletAdapterNetwork.Devnet;
  //   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  //   const wallets = useMemo(
  //     () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  //     [network]
  // );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
