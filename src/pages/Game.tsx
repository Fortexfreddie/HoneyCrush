import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GamePage from "../components/GamePage";
import WalletRequiredModal from "../components/WalletRequiredModal";
import { useWalletRequiredModal } from "../contexts/WalletRequiredModalContext";


const Game = () => {
    const {isOpen, setIsOpen} = useWalletRequiredModal();
    return (  
        <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
          {
            isOpen && (<WalletRequiredModal />)
          }
          <Navbar />
          <div className="flex-grow">
            <main className="container mx-auto">
              {
                !isOpen && (<GamePage />)
              }
            </main>
          </div>
          <Footer />
        </div>
    );
}
 
export default Game;