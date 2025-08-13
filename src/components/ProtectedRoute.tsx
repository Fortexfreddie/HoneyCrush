import { useWallet } from "@solana/wallet-adapter-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useWalletRequiredModal } from "../contexts/WalletRequiredModalContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting } = useWallet();
  const { isOpen, setIsOpen } = useWalletRequiredModal();
  const hasShown = useRef(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Wait until wallet is done connecting on load
    if (!connecting) {
      setInitialCheckDone(true);
    }
  }, [connecting]);

  useEffect(() => {
    if (!initialCheckDone) return; // skip until wallet has finished loading

    if (!connected && !publicKey && !isOpen && !hasShown.current) {
      setIsOpen(true);
      hasShown.current = true;
    }

    if (publicKey) {
      hasShown.current = false;
    }
  }, [connected, publicKey, isOpen, setIsOpen, initialCheckDone]);

  return children;
}

export default ProtectedRoute;
