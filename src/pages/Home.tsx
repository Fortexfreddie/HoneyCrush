import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
      <Navbar />
      <div className="flex-grow">
        <main className="container mx-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Home;
