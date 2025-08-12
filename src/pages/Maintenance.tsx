import MaintenancePage from "../components/MaintenancePage";

const Maintenance = () => {
    return (  
        <div className="min-h-screen flex flex-col bg-gray-200 dark:bg-[#272727]/80 text-gray-900 dark:text-gray-100">
            <div className="flex-grow">
                <main className="container mx-auto">
                    <MaintenancePage />
                </main>
            </div>
        </div>
    );
}
 
export default Maintenance;