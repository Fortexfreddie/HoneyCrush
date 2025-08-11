import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Outlet } from 'react-router-dom';

const Admin = () => {
    return (
      <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
        <Header />
        <div className="flex-grow">
          <main className="container mx-auto">
            <div className="px-4 mt-4 flex flex-row">
              <Sidebar />
              <div className="flex-1 max-w-[100%]">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
}
 
export default Admin;