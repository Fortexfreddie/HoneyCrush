type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
}& React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({children, className="", type="button", ...props}: ButtonProps) => {
    return (  
        <button type={type} className={`font-bold py-2 px-4 rounded-xl shadow-lg transition inline-flex items-center justify-center cursor-pointer ${className}`} {...props}>{children}</button>
    );
}
 
export default Button;