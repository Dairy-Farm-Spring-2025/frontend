import { Descriptions, DescriptionsProps } from 'antd';
import './index.scss';
export interface DescriptionPropsItem extends DescriptionsProps {
  key: string;
  label: string;
  children: string | React.ReactNode;
}
interface DescriptionComponentProps extends DescriptionsProps {
  items: DescriptionPropsItem['items'];
  title?: React.ReactNode | any;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}
const DescriptionComponent = ({
  items,
  title,
  className,
  layout = 'vertical',
  ...props
}: DescriptionComponentProps) => {
  return (
    <Descriptions
      className={`description-component !bg-white !rounded-lg !shadow-md ${className}`}
      title={title}
      items={items}
      layout={layout}
      labelStyle={{
        fontWeight: 'bold',
      }}
      bordered
      {...props}
    />
  );
};

export default DescriptionComponent;
