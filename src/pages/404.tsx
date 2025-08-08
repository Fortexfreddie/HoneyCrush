import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Confused from '../assets/confused.jpg'


const NotFoundPage = () => {
    return (  
        <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-[#272727]">
            <Navbar />
            <div className="flex-grow flex-col items-center justify-center w-full">
                <div className='mt-10 w-3xl mx-auto flex flex-col items-center justify-center'>
                    <img src={Confused} alt="" className='h-40 rounded-md backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]' />
                </div>
                <h1 className="text-4xl font-bold text-center mt-10">404 - Page Not Found</h1>
                <p className="text-center mt-4">The page you are looking for does not exist.</p>
            </div>
            <Footer />
        </div>
    );
}
 
export default NotFoundPage;