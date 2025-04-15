interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}
const Title = ({ children, className }: TitleProps) => {
  return (
    <p
      className={`md:text-xs lg:text-xs xl:text-base font-bold text-primary ${className}`}
    >
      {children}
    </p>
  );
};

export default Title;
