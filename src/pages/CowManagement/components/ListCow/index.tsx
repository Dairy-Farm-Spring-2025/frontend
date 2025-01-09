import { useState } from "react";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import { cows } from "../../../../service/data/cow";
import { Cow } from "../../../../model/Cow";
import { Image } from "antd";
import TextLink from "../../../../components/UI/TextLink";

const ListCow = () => {
  const [cow, setCow] = useState<Cow[]>(cows);
  const columns: Column[] = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "image",
      key: "image",
      title: "Image",
      render: (element) => <Image src={element} />,
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
  ];
  return (
    <div className="p-4 bg-white rounded-lg">
      <TableComponent columns={columns} dataSource={cow} />
    </div>
  );
};

export default ListCow;
