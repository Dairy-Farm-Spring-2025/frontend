interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}
const Title = ({ children, className }: TitleProps) => {
  return (
    <p
      className={`md:text-xs lg:text-base xl:text-lg 2xl:text-lg font-bold text-primary ${className}`}
    >
      {children}
    </p>
  );
};

export default Title;
