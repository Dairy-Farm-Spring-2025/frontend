import { Card, CardProps } from 'antd';
interface CardComponentProps extends CardProps {
  className?: string;
  children: React.ReactNode;
}
const CardComponent = ({
  className,
  children,
  ...props
}: CardComponentProps) => {
  return (
    <Card className={`!shadow-lg !h-fit ${className}`} {...props}>
      {children}
    </Card>
  );
};

export default CardComponent;
