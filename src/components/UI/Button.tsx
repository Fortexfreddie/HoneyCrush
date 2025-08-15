type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`font-bold px-2 py-1 shadow-lg transition inline-flex items-center justify-center cursor-pointer  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const DashboardButton = ({
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`px-2 py-1 shadow-md rounded-sm cursor-pointer flex items-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, DashboardButton };
