import { Tag, TagProps } from 'antd';

interface TagComponentsProps extends TagProps {
  children?: React.ReactNode;
  className?: string;
}
const TagComponents = ({
  children,
  className,
  ...props
}: TagComponentsProps) => {
  return (
    <Tag className={`text-sm font-normal ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default TagComponents;
