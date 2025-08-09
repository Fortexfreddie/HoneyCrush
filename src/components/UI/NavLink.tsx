type NavProps = {
    children?: React.ReactNode;
    className?: string;
}& React.HTMLAttributes<HTMLLIElement>;
const NavLink = ({children, className="", ...props}: NavProps) => {
    return (  
        <li className={`px-3 py-2 rounded-lg text-sm font-semibold hover:text-gray-600 dark:hover:text-gray-300 active:text-gray-600 dark:active:text-gray-300 transition cursor-pointer ${className}`} {...props}>
            {children}
        </li>
    );
}
 
export default NavLink;