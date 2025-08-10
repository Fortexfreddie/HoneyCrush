import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TutorialPage from "../components/TutorialPage";

const Tutorial = () => {
    return (
        <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
          <Navbar />
          <div className="flex-grow">
            <main className="container mx-auto">
              <TutorialPage />
            </main>
          </div>
          <Footer />
        </div>
    );
}
 
export default Tutorial;