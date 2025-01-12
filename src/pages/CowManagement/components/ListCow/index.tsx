import { Image } from "antd";
import { useEffect, useState } from "react";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import TextLink from "../../../../components/UI/TextLink";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useFetch from "../../../../hooks/useFetcher";
import { Cow } from "../../../../model/Cow";
import useToast from "../../../../hooks/useToast";
const ListCow = () => {
  const [cow, setCow] = useState<Cow[]>([]);
  const { data, error, isLoading } = useFetch<Cow[]>("product");
  const toast = useToast();
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
      render: (element) => <Image width={150} src={element} />,
    },
    {
      dataIndex: "productName",
      key: "name",
      title: "Name",
      render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
  ];
  useEffect(() => {
    console.log(data);
    if (data) {
      setCow(data);
    }
    if (error) {
      toast.showError(error);
    }
  }, [data, error, toast]);
  return (
    <WhiteBackground>
      <TableComponent loading={isLoading} columns={columns} dataSource={cow} />
    </WhiteBackground>
  );
};

export default ListCow;
