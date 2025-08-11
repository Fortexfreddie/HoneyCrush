import { createContext, useContext, useState } from "react";

type SidebarContextType = {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
};

type SidebarProviderProps = {
    children: React.ReactNode;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};