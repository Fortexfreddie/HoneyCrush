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
      className={`font-bold px-2 py-1 shadow-lg transition inline-flex items-center justify-center cursor-pointer ${className}`}
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
      className={`border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] px-1 py-2 rounded-lg transition-all font-bold inline-flex items-center justify-center cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, DashboardButton };
