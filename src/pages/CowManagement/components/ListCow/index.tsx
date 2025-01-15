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
import { formatDateHour, formatSTT } from "../../../../utils/format";
import cowImage from "../../../../assets/cow.jpg";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import { cowOrigin } from "../../../../service/data/cowOrigin";
import { cowStatus } from "../../../../service/data/cowStatus";
const ListCow = () => {
  const [cow, setCow] = useState<Cow[]>([]);
  const { data, error, isLoading } = useFetch<Cow[]>("cows", "GET");
  const toast = useToast();
  const getLabelByValue = (value: string, listing: any[]) => {
    const item = listing.find((option) => option.value === value);
    return item ? item.label : "Unknown"; // Return "Unknown" if no match is found
  };
  const columns: Column[] = [
    {
      dataIndex: "cowId",
      key: "cowId",
      title: "#",
    },
    {
      dataIndex: "image",
      key: "image",
      title: "Image",
      render: () => <Image width={200} src={cowImage} />,
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created At",
      render: (data) => formatDateHour(data),
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
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: "dateOfEnter",
      key: "dateOfEnter",
      title: "Date Of Enter",
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: "dateOfOut",
      key: "dateOfOut",
      title: "Date Of Out",
      render: (data) => (data ? formatDateHour(data) : "Not Out"),
    },
    {
      dataIndex: "cowOrigin",
      key: "cowOrigin",
      title: "Origin",
      render: (data) => getLabelByValue(data, cowOrigin),
    },
    {
      dataIndex: "gender",
      key: "gender",
      title: "Gender",
      render: (data) => (data === "male" ? "Male" : "Female"),
    },
    {
      dataIndex: "cowType",
      key: "cowType",
      title: "Cow Type",
      render: (data) => <p>{data.name}</p>,
    },
    {
      dataIndex: "cowStatus",
      key: "cowStatus",
      title: "Cow Status",
      render: (data) => getLabelByValue(data, cowStatus),
    },
    {
      dataIndex: "cowId",
      key: "action",
      title: "Action",
      render: () => (
        <ButtonComponent type="primary" danger>
          Delete
        </ButtonComponent>
      ),
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
