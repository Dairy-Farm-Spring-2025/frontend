import { Divider } from "antd";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import TableComponent, {
  Column,
} from "../../../../components/Table/TableComponent";
import AnimationAppear from "../../../../components/UI/AnimationAppear";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useFetcher from "../../../../hooks/useFetcher";
import useModal from "../../../../hooks/useModal";
import { formatDateHour, formatSTT } from "../../../../utils/format";
import ModalTypes from "./components/ModalAddTypes/ModalTypes";
import { useState } from "react";
import ModalEditTypes from "./components/ModalEditTypes/ModalEditTypes";
import { CowType } from "../../../../model/Cow/CowType";

const CowTypeManagement = () => {
  const modal = useModal();
  const modalEdit = useModal();
  const { data, isLoading, mutate } = useFetcher<CowType[]>("cow-types", "GET");
  const [id, setId] = useState<number>(0);

  const handleEdit = (id: number) => {
    setId(id);
    modalEdit.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: "cowTypeId",
      key: "cowTypeId",
      title: "#",
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created Date",
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (element: string, data) => (
        <p
          onClick={() => handleEdit(data.cowTypeId)}
          className="text-blue-600 underline underline-offset-1 cursor-pointer"
        >
          {element}
        </p>
      ),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (data) => (data === "exist" ? "Exist" : "Not Exist"),
    },
    {
      dataIndex: "cowTypeId",
      key: "action",
      title: "Action",
      render: (data) => (
        <ButtonComponent
          onClick={() => console.log(data)}
          danger
          type="primary"
        >
          Delete
        </ButtonComponent>
      ),
    },
  ];
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalTypes modal={modal} mutate={mutate} />
        <ModalEditTypes id={id} modal={modalEdit} mutate={mutate} />
        <Divider className="my-4" />
        <TableComponent
          columns={columns}
          dataSource={data ? formatSTT(data) : []}
          loading={isLoading}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CowTypeManagement;
