import { ConfigProvider, Descriptions, DescriptionsProps } from 'antd';
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
    <ConfigProvider
      theme={{
        components: {
          Descriptions: {
            labelBg: '#eeeeee',
            borderRadiusLG: 8,
            borderRadiusOuter: 8,
            borderRadiusSM: 8,
            borderRadius: 8,
            borderRadiusXS: 8,
          },
        },
      }}
      descriptions={{
        className: 'description-component',
      }}
    >
      <Descriptions
        className={`!bg-white !shadow-md !border-black !rounded-[8px] ${className}`}
        title={title}
        items={items}
        layout={layout}
        labelStyle={{
          fontWeight: 'bold',
        }}
        bordered
        {...props}
      />
    </ConfigProvider>
  );
};

export default DescriptionComponent;
