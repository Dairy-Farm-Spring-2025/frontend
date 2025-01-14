import { Image } from "antd";
import { useEffect, useState } from "react";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import TextLink from "../../../../components/UI/TextLink";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useFetch from "../../../../hooks/useFetcher";
import { Cow } from "../../../../model/Cow/Cow";
import useToast from "../../../../hooks/useToast";
import AnimationAppear from "../../../../components/UI/AnimationAppear";
import { formatSTT } from "../../../../utils/format";
const ListCow = () => {
  const [cow, setCow] = useState<Cow[]>([]);
  const { data, error, isLoading } = useFetch<Cow[]>("cows", "GET");
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
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created At",
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
    {
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      title: "Date Of Birth",
    },
    {
      dataIndex: "dateOfEnter",
      key: "dateOfEnter",
      title: "Date Of Enter",
    },
    {
      dataIndex: "dateOfOut",
      key: "dateOfOut",
      title: "Date Of Out",
    },
    {
      dataIndex: "cowOrigin",
      key: "cowOrigin",
      title: "Origin",
    },
    {
      dataIndex: "gender",
      key: "gender",
      title: "Gender",
    },
    {
      dataIndex: "cowType",
      key: "cowType",
      title: "Cow Type",
    },
    {
      dataIndex: "cowStatus",
      key: "cowStatus",
      title: "Cow Status",
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
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <TableComponent
          loading={isLoading}
          columns={columns}
          dataSource={formatSTT(cow)}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListCow;
