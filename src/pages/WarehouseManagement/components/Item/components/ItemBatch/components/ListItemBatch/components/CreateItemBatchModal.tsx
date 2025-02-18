import { DatePicker, Form, Tag } from 'antd';
import ModalComponent from '../../../../../../../../../components/Modal/ModalComponent';
import FormComponent from '../../../../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../../../components/LabelForm/LabelForm';
import useFetcher from '../../../../../../../../../hooks/useFetcher';
import { useEffect, useState } from 'react';
import { Item } from '../../../../../../../../../model/Warehouse/items';
import { Supplier } from '../../../../../../../../../model/Warehouse/supplier';
import SelectComponent from '../../../../../../../../../components/Select/SelectComponent';
import { ItemBatchCreate } from '../../../../../../../../../model/Warehouse/itemBatch';
import useToast from '../../../../../../../../../hooks/useToast';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface CreateItemBatchModalProps {
  modal: any;
  mutate: any;
}

const CreateItemBatchModal = ({ modal, mutate }: CreateItemBatchModalProps) => {
  const [form] = Form.useForm();
  const [optionItem, setOptionItem] = useState<any[]>([]);
  const [optionSupplier, setOptionSupplier] = useState<any[]>([]);
  const { data: dataItem } = useFetcher<Item[]>('items', 'GET');
  const { data: dataSupplier } = useFetcher<Supplier[]>('suppliers', 'GET');
  const { isLoading, trigger } = useFetcher('itembatchs/create', 'POST');
  const toast = useToast();
  const { t } = useTranslation();
  useEffect(() => {
    if (modal.open && dataItem && dataSupplier) {
      setOptionItem(
        dataItem.map((element: Item) => {
          const searchLabel = `${element.name} ${element.quantity} ${element.unit} ${element.status} ${element.categoryEntity.name} ${element.warehouseLocationEntity.name}`;
          return {
            label: (
              <div>
                <Tag color="blue">{element.name}</Tag> -{' '}
                <Tag color="orange">
                  {element.quantity} ({element.unit})
                </Tag>{' '}
                - <Tag color="cyan">{element.status}</Tag> -{' '}
                <Tag color="purple">{element.categoryEntity.name}</Tag> -{' '}
                <Tag color="volcano">
                  {element.warehouseLocationEntity.name}
                </Tag>
              </div>
            ),
            value: element.itemId,
            searchLabel,
          };
        })
      );
      setOptionSupplier(
        dataSupplier.map((element: Supplier) => {
          const searchLabel = `${element.name} ${element.address} ${element.email} ${element.phone}`;

          return {
            label: (
              <div>
                <Tag color="blue">{element.name}</Tag> -{' '}
                <Tag color="orange">{element.address}</Tag> -{' '}
                <Tag color="cyan">{element.email}</Tag> -{' '}
                <Tag color="purple">{element.phone}</Tag> -{' '}
              </div>
            ),
            value: element.supplierId,
            searchLabel,
          };
        })
      );
    }
  }, [dataItem, dataSupplier, modal.open]);

  const handleCancel = () => {
    modal.closeModal();
    form.resetFields();
  };

  const onFinish = async (values: ItemBatchCreate) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      mutate();
      handleCancel();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const disablePastDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().endOf('day'); // Disable today and past dates
  };
  return (
    <ModalComponent
      title={t("Create Item Batch")}
      open={modal.open}
      onCancel={handleCancel}
      width={800}
      onOk={() => form.submit()}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={onFinish}>
        <div className="grid grid-cols-2 gap-5">
          <FormItemComponent
            name="quantity"
            label={<LabelForm>{t("Quantity")}</LabelForm>}
            rules={[{ required: true }]}
          >
            <InputComponent.Number />
          </FormItemComponent>
          <FormItemComponent
            name="expiryDate"
            label={<LabelForm>{t("Expired Date")}</LabelForm>}
            rules={[{ required: true }]}
          >
            <DatePicker
              className="w-full !text-[18px]"
              disabledDate={disablePastDates}
            />
          </FormItemComponent>
        </div>
        <div>
          <FormItemComponent
            name="itemId"
            label={<LabelForm>{t("Item")}</LabelForm>}
            rules={[{ required: true }]}
          >
            <SelectComponent options={optionItem} search={true} />
          </FormItemComponent>
          <div className="grid grid-cols-5 gap-1 mt-2">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> -{' '}
              <p>{t("Name")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div> -{' '}
              <p>{t("Quantity")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div> -{' '}
              <p>{t("Status")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div> -{' '}
              <p>{t("Category")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-orange-600 rounded-sm"></div> -{' '}
              <p>{t("Warehouse")}</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <FormItemComponent
            name="supplierId"
            label={<LabelForm>{t("Supplier")}</LabelForm>}
            rules={[{ required: true }]}
          >
            <SelectComponent options={optionSupplier} search={true} />
          </FormItemComponent>
          <div className="grid grid-cols-5 gap-1 mt-2">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> -{' '}
              <p>{t("Name")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div> -{' '}
              <p>{t("Address")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div> -{' '}
              <p>{t("Email")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div> -{' '}
              <p>{t("Phone")}</p>
            </div>
          </div>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default CreateItemBatchModal;
