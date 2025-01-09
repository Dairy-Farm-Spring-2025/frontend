interface WhiteBackgroundComponents {
  children?: React.ReactNode;
  className?: string;
}

const WhiteBackground = ({
  children,
  className,
  ...props
}: WhiteBackgroundComponents) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default WhiteBackground;
