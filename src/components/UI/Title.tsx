interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}
const Title = ({ children, className }: TitleProps) => {
  return (
    <p
      className={`text-3xl font-bold text-primary underline underline-offset-4 ${className}`}
    >
      {children}
    </p>
  );
};

export default Title;
