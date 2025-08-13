import { createContext, useContext, useState } from "react";

type WalletRequiredModalContextType = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void
};

type WalletRequiredModalProviderProps = {
    children: React.ReactNode;
}

const WalletRequiredModalContext = createContext<WalletRequiredModalContextType | undefined>(undefined);

export const WalletRequiredModalProvider = ({children}: WalletRequiredModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <WalletRequiredModalContext.Provider value={{isOpen, setIsOpen }}>
            {children}
        </WalletRequiredModalContext.Provider>
    )
}

export const useWalletRequiredModal = () => {
    const context = useContext(WalletRequiredModalContext);
    if (context === undefined) {
        throw new Error("useWalletRequiredModal must be used within a WalletRequiredModalProvider");
    }
    return context;
}