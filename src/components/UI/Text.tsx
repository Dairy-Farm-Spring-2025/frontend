interface TextComponentProps {
  children: any;
  className?: string;
}
const Text = ({ children, className }: TextComponentProps) => {
  return <p className={`text-base ${className}`}>{children}</p>;
};

export default Text;
