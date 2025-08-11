import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import { GameProvider } from "./contexts/GameContext.tsx";
import WalletContextProvider from "./components/WalletProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletContextProvider>
      <BrowserRouter>
        <SidebarProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </SidebarProvider>
      </BrowserRouter>
    </WalletContextProvider>
  </StrictMode>
);
