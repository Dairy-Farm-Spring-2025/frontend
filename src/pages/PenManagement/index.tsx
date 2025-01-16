import { Divider } from "antd";
import useModal from "../../hooks/useModal";
import useFetcher from "../../hooks/useFetcher";

import { Pen } from "../../model/Pen";
import { useState } from "react";
import TableComponent, { Column } from "../../components/Table/TableComponent";
import { formatDateHour, formatSTT } from "../../utils/format";

import AnimationAppear from "../../components/UI/AnimationAppear";
import WhiteBackground from "../../components/UI/WhiteBackground";

import ModalCreatePen from "./components/ModalCreatePen";
import ModalEditPens from "./components/ModalEditPen";

const PenManageMent = () => {
  const modal = useModal();
  const modalEdit = useModal();
  const { data, isLoading, mutate } = useFetcher<Pen[]>("pens", "GET");
  const [id, setId] = useState<number>(0);
  console.log("check data: ", data)
  const handleEdit = (id: number) => {
    setId(id);
    modalEdit.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: "penId",
      key: "penId",
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
          onClick={() => handleEdit(data.penId)}
          className="text-blue-600 underline underline-offset-1 cursor-pointer"
        >
          {element}
        </p>
      ),
    },
    {
      dataIndex: "area",
      key: "area",
      title: "area",
      render: (area: any) => area?.name,
    },
    {
      dataIndex: "length",
      key: "length",
      title: "Length"
    },
    {
      dataIndex: "width",
      key: "width",
      title: "Width"
    },
    {
      dataIndex: "description",
      key: "description",
      title: "description"
    },
    {
      dataIndex: "penStatus",
      key: "penStatus",
      title: "Status",

    },
    // {
    //   dataIndex: "penId",
    //   key: "action",
    //   title: "Action",
    //   render: (data) => (
    //     <ButtonComponent
    //       onClick={() => console.log(data)}
    //       danger
    //       type="primary"
    //     >
    //       Delete
    //     </ButtonComponent>
    //   ),
    // },
  ];
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalCreatePen modal={modal} mutate={mutate} />
        <ModalEditPens id={id} modal={modalEdit} mutate={mutate} />
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

export default PenManageMent;
