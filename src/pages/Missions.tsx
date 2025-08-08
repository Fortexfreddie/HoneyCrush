import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MissionsPage from "../components/MissionsPage";

const Missions = () => {
    return (
        <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
          <Navbar />
          <div className="flex-grow">
            <main className="container mx-auto">
              <MissionsPage />
            </main>
          </div>
          <Footer />
        </div>
    );
}
 
export default Missions;