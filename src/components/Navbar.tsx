import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import {Button} from "./UI/Button";
import NavLink from "./UI/NavLink";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true; // default to dark
  });

  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      const theme = newMode ? "dark" : "light";
      localStorage.setItem("theme", theme);

      // Apply the theme class directly
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  };

  // Set theme on first load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <header className="container mx-auto px-4 pt-5">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/35 dark:bg-black/28 border border-white/30 dark:border-white/12 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#272727] grid place-items-center shadow-[0_0_0_2px_rgba(212,170,125,0.35)_inset,0_0_16px_rgba(212,170,125,0.35),0_0_32px_rgba(122,92,255,0.25)]">
            <span className="text-[#D4AA7D] font-black">$</span>
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">HoneyCrush</div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">
              Match • Win • Earn
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center">
          <ul className="flex items-center gap-1">
            <NavLink onClick={() => navigate("/")}>Home</NavLink>
            <NavLink onClick={() => navigate("/game")}>Game</NavLink>
            <NavLink onClick={() => navigate("/missions")}>Missions</NavLink>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            className={`rounded-full p-2 bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 hover:border-black/40 dark:hover:border-white/40 ${
              isDarkMode ? "rotate-180" : ""
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-[#D4AA7D]" />
            ) : (
              <Moon className="w-5 h-5 text-[#D4AA7D]" />
            )}
          </Button>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
