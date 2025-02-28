interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}
const Title = ({ children, className }: TitleProps) => {
  return (
    <p className={`text-xl font-bold text-primary ${className}`}>{children}</p>
  );
};

export default Title;
