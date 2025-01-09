import { useState } from "react";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import { cows } from "../../../../service/data/cow";
import { Cow } from "../../../../model/Cow";
import { Image } from "antd";
import TextLink from "../../../../components/UI/TextLink";
import WhiteBackground from "../../../../components/UI/WhiteBackground";

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
    <WhiteBackground>
      <TableComponent columns={columns} dataSource={cow} />
    </WhiteBackground>
  );
};

export default ListCow;
