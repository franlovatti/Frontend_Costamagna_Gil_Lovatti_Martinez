type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Button({
  children,
  type = 'button',
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-primary ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function Submit({
  children,
  type = 'submit',
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-primary ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
