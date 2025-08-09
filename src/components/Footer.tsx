const Footer = () => {
    return (  
        <footer className="container mx-auto px-4 py-8 opacity-80">
            <div className="p-6 text-center text-sm rounded-2xl bg-white/35 dark:bg-black/28 border border-white/30 dark:border-white/12 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <p>© {new Date().getFullYear()} HoneyCrush. All rights reserved.</p>
            </div>
        </footer>
    );
}
 
export default Footer;