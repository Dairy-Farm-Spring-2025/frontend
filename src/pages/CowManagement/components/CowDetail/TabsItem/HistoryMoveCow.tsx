import { useState, useEffect, useMemo } from "react";
import { Divider, Form } from "antd";
import { useParams } from "react-router-dom";
import ButtonComponent from "@components/Button/ButtonComponent";
import useFetcher from "@hooks/useFetcher";
import { Area } from "@model/Area";
import { PenEntity } from "@model/CowPen/CowPen";
import { useTranslation } from "react-i18next";
import SelectComponent from "@components/Select/SelectComponent";
import TableComponent, { Column } from "@components/Table/TableComponent";
import WhiteBackground from "@components/UI/WhiteBackground";
import { Tag } from "antd";
import { formatDateHour } from "@utils/format";
import useToast from "@hooks/useToast";
import FormItemComponent from "@components/Form/Item/FormItemComponent";
import LabelForm from "@components/LabelForm/LabelForm";

// Định nghĩa type cho dữ liệu
interface CowPenHistory {
  penEntity: PenEntity;
  fromDate: string;
  toDate: string | null;
}

interface HistoryMoveCowProps {
  id: string;
  isLoadingHistory: boolean;
}

const HistoryMoveCow = ({ id, isLoadingHistory }: HistoryMoveCowProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, mutate, error: fetchError } = useFetcher<CowPenHistory[]>(`cow-pens/cow/${id}`, "GET");

  // Khởi tạo Ant Design Form
  const [form] = Form.useForm<{ areaId: number | null; penId: number | null }>();

  // Sử dụng useWatch để theo dõi giá trị
  const areaId = Form.useWatch("areaId", form);
  const penId = Form.useWatch("penId", form);

  // API Fetchers
  const { data: areasData } = useFetcher<Area[]>("areas", "GET");
  const { data: allPensInArea, mutate: mutatePens } = useFetcher<PenEntity[]>(
    areaId ? `pens/area/${areaId}` : "",
    "GET"
  );
  const { trigger: moveCow, isLoading } = useFetcher("cow-pens/create", "POST");

  // Chỉ lấy chuồng rỗng
  const emptyPens = allPensInArea?.filter((pen) => pen.penStatus === "empty") || [];

  // Danh sách khu vực và chuồng cho Select
  const areaOptions = useMemo(
    () =>
      areasData?.map((area) => ({
        label: area.name,
        value: area.areaId,
      })) || [],
    [areasData]
  );
  const penOptions = useMemo(
    () => emptyPens.map((pen) => ({ value: pen.penId, label: pen.name })),
    [emptyPens]
  );

  // Kiểm tra form hợp lệ
  const isFormValid = !!areaId && !!penId;

  // Cập nhật danh sách chuồng khi chọn khu vực
  useEffect(() => {
    if (areaId) {
      mutatePens();
      form.setFieldsValue({ penId: null });
    }
  }, [areaId, mutatePens, form]);

  // Xử lý di chuyển bò
  const handleMoveCow = async () => {
    if (!isFormValid) return;

    try {
      const values = await form.validateFields();
      if (!id || !values.penId) return;

      // Gửi request và lấy response
      const response = await moveCow({ body: { cowId: id, penId: values.penId } });

      // Cập nhật danh sách cục bộ nếu API trả về dữ liệu
      if (response) {
        const newRecord: CowPenHistory = {
          penEntity: emptyPens.find((pen) => pen.penId === values.penId)!,
          fromDate: new Date().toISOString(),
          toDate: null,
        };
        mutate([newRecord, ...(data || [])]); // Thêm vào đầu và refetch
      } else {
        mutate(); // Refetch nếu API không trả về dữ liệu
      }

      toast.showSuccess(t("Move cow successfully"));
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) return;
      toast.showError(t("Failed to move cow"));
    }
  };

  // Columns cho Table với type rõ ràng
  const columns = useMemo<Column[]>(() => [
    {
      title: t("#"),
      dataIndex: "stt",
      key: "stt",
      render: (_: unknown, __: CowPenHistory, index: number) => index + 1,
    },
    {
      title: t("In Pen Name"),
      dataIndex: "penEntity",
      key: "penName",
      render: (penEntity: PenEntity) => penEntity.name,
      searchable: true,
    },
    {
      title: t("Area"),
      dataIndex: "penEntity",
      key: "areaBelongto",
      render: (penEntity: PenEntity) => penEntity?.areaBelongto?.name ?? "N/A",
      searchable: true,
    },
    {
      title: t("From Date"),
      dataIndex: "fromDate",
      key: "fromDate",
      render: (fromDate: string) => formatDateHour(fromDate),
      sorter: (a: CowPenHistory, b: CowPenHistory) =>
        new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: t("To Date"),
      dataIndex: "toDate",
      key: "toDate",
      render: (toDate: string | null) => (toDate ? formatDateHour(toDate) : <Tag color="blue">{t("Now")}</Tag>),
      sorter: (a: CowPenHistory, b: CowPenHistory) => {
        if (!a.toDate && !b.toDate) return 0;
        if (!a.toDate) return -1;
        if (!b.toDate) return 1;
        return new Date(a.toDate).getTime() - new Date(b.toDate).getTime();
      },
    },
  ], [t]);

  if (isLoadingHistory) {
    return (
      <WhiteBackground>
        <p>{t("Loading...")}</p>
      </WhiteBackground>
    );
  }

  if (fetchError) {
    return (
      <WhiteBackground>
        <p className="text-red-500">{t("Error loading history")}</p>
      </WhiteBackground>
    );
  }

  return (
    <>
      <Form form={form} layout="vertical" initialValues={{ areaId: null, penId: null }}>
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-end gap-4">
            <FormItemComponent
              name="areaId"
              label={<LabelForm>{t("Area")}</LabelForm>}
              rules={[{ required: true, message: t("Please select an area") }]}
              className="w-40 md:w-48"
            >
              <SelectComponent
                options={areaOptions}
                placeholder={t("Select area")}
                size="middle"
              />
            </FormItemComponent>

            <FormItemComponent
              name="penId"
              label={<LabelForm>{t("Pen")}</LabelForm>}
              rules={[{ required: true, message: t("Please select a pen") }]}
              className="w-40 md:w-48"
            >
              <SelectComponent
                placeholder={t("Select Pen")}
                options={penOptions}
                disabled={!areaId || emptyPens.length === 0}
                size="middle"
              />
            </FormItemComponent>
          </div>

          <ButtonComponent
            type="primary"
            onClick={handleMoveCow}
            disabled={!isFormValid}
            loading={isLoading}
            size="large"
            className="px-6"
          >
            {t("Move Cow")}
          </ButtonComponent>
        </div>
      </Form>

      <Divider className="my-4" />

      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoadingHistory}
        rowKey={(record) => `${record.penEntity.name}-${record.fromDate}`}
      />
    </>
  );
};

export default HistoryMoveCow;