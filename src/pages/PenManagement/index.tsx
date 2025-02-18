
import { Divider, Image, Tag, Tooltip } from "antd";
import useModal from "../../hooks/useModal";
import useFetcher from "../../hooks/useFetcher";
import { Pen } from "../../model/Pen";
import { useState } from "react";
import TableComponent, { Column } from "../../components/Table/TableComponent";
import { formatAreaType, formatDateHour, formatSTT } from "../../utils/format";
import "./index.scss"
import AnimationAppear from "../../components/UI/AnimationAppear";
import WhiteBackground from "../../components/UI/WhiteBackground";
import penImage from "../../assets/pen.jpg";
import ModalCreatePen from "./components/ModalCreatePen";
import ModalEditPens from "./components/ModalEditPen";
import { penType, penStatus } from "../../service/data/pen";
import { Area } from "../../model/Area";
import { useTranslation } from "react-i18next";

const PenManageMent = () => {
  const modal = useModal();
  const modalEdit = useModal();
  const { data, isLoading, mutate } = useFetcher<Pen[]>("pens", "GET");
  const { data: dataArea } = useFetcher<Area[]>("areas", "GET");
  console.log("check dataArea: ", dataArea)
  const { t } = useTranslation();
  const [id, setId] = useState<number>(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(dataArea ? dataArea[0].areaId : null);
  console.log("check data: ", data);

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
      dataIndex: "image",
      key: "image",
      title: t("Image"),
      render: () => <Image width={200} src={penImage} />,
      width: 200,
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: t("Created Date"),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: "name",
      key: "name",
      title: t("Pen Name"),
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
      dataIndex: "penType",
      key: "penType",
      title: t("Pen Type"),
      render: (typeValue: string) => {

        const type = penType.find((type) => type.value === typeValue);

        return type ? <Tag color="blue">{type.label}</Tag> : null;
      }
    },
    {
      dataIndex: "area",
      key: "area",
      title: t("Area"),
      render: (area: any) => {
        const areaDetails = dataArea?.find((item) => item.areaId === area?.areaId);

        return (
          <Tooltip
            className="tooltip-content"
            title={
              areaDetails ? (
                <>
                  <div className="description"><strong>{t("Description")}:</strong> {areaDetails?.description}</div>
                  <div className="dimensions"><strong>{t("Dimensions")}:</strong> {areaDetails?.length} m x {areaDetails?.width} m</div>
                  <div className="type"><strong>{t("Area Type")}:</strong> {formatAreaType(areaDetails?.areaType)}</div>
                </>
              ) : (
                "No details available"
              )
            }

            color="#87d068"
            placement="top"

          >
            <span className="text-blue-600 ">{area?.name}</span>
          </Tooltip>
        );
      },
    },


    {
      dataIndex: "length",
      key: "length",
      title: t("Dimensions"),
      render: (element: any, data) => (
        <Tooltip className="tooltip-content"
          color="#87d068"
          placement="top"
          title={<div className="dimensions"><strong>{t("Length")}: </strong> {data.area.penLength} m,<strong> {t("Width")}: </strong>{data.area.penWidth} m </div>}
        >
          <span>
            {data.area.penLength} x {data.area.penWidth} m
          </span>
        </Tooltip>
      ),
    },
    {
      dataIndex: "penStatus",
      key: "penStatus",
      title: t("Status"),
      render: (statusValue: string) => {
        // Find the label for the given statusValue
        const status = penStatus.find((status) => status.value === statusValue);
        // Return the Tag with the status label
        return status ? <Tag color="green">{status.label}</Tag> : null;
      }
    }
  ];

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalCreatePen modal={modal} mutate={mutate} areaId={selectedAreaId} />
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
