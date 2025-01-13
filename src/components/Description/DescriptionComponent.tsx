import { Descriptions, DescriptionsProps } from "antd";
import "./index.scss";
export interface DescriptionPropsItem extends DescriptionsProps {
  key: string;
  label: string;
  children: string | React.ReactNode;
}
interface DescriptionComponentProps {
  items: DescriptionPropsItem["items"];
  title?: string;
  layout?: "vertical" | "horizontal";
}
const DescriptionComponent = ({
  items,
  title,
  layout = "vertical",
  ...props
}: DescriptionComponentProps) => {
  return (
    <Descriptions
      className="description-component"
      title={title}
      items={items}
      layout={layout}
      labelStyle={{
        fontWeight: "bold",
      }}
      bordered
      {...props}
    />
  );
};

export default DescriptionComponent;
