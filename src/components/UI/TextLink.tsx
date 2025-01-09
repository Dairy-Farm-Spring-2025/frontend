import { Link, LinkProps } from "react-router-dom";

interface TextLinkProp extends LinkProps {
  to: string;
}

const TextLink = ({ to, children }: TextLinkProp) => {
  return (
    <Link className="text-blue-600 underline underline-offset-1" to={to}>
      {children}
    </Link>
  );
};

export default TextLink;
