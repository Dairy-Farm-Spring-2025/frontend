import { Link, LinkProps } from 'react-router-dom';

interface TextLinkProp extends LinkProps {
  to: string;
  className?: string;
}

const TextLink = ({ to, className, children }: TextLinkProp) => {
  return (
    <Link
      className={`text-blue-600 underline underline-offset-1 ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};

export default TextLink;
