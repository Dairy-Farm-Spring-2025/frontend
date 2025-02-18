import { Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import FormComponent from '../../../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import { RootState } from '../../../../../../../../core/store/store';
import SelectComponent from '../../../../../../../../components/Select/SelectComponent';
import {
  statusOptions,
  unitOptions,
} from '../../../../../../../../service/data/item';
import { useEffect, useState } from 'react';
import { Warehouse } from '../../../../../../../../model/Warehouse/warehouse';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import useToast from '../../../../../../../../hooks/useToast';
import CardComponent from '../../../../../../../../components/Card/CardComponent';
import { ItemRequestBody } from '../../../../../../../../model/Warehouse/items';
import { useTranslation } from 'react-i18next';

interface ModalAddItemProps {
  modal: any;
  mutate: any;
}

const ModalAddItem = ({ modal, mutate }: ModalAddItemProps) => {
  const [idWarehouse, setIdWarehouse] = useState<number>(0);
  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [available, setAvailable] = useState(false);
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const toast = useToast();
  const { isLoading, trigger } = useFetcher<Warehouse>('');
  const { isLoading: loadingFinish, trigger: triggerFinish } = useFetcher(
    'items/create',
    'POST'
  );
  useEffect(() => {
    const fetchWarehouse = async (id: number) => {
      try {
        const response = await trigger({ url: `warehouses/${id}` });
        setWarehouse(response);
      } catch (error: any) {
        toast.showError(error.message);
      }
    };
    if (idWarehouse !== 0) {
      fetchWarehouse(idWarehouse);
    }
  }, [idWarehouse]);

  const handleChangeWarehouse = (id: number) => {
    setIdWarehouse(id);
  };

  const handleChangeUnit = () => {
    setAvailable(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIdWarehouse(0);
    setAvailable(false);
    setWarehouse(undefined);
    modal.closeModal();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = async (values: ItemRequestBody) => {
    try {
      const response = await triggerFinish({ body: values });
      toast.showSuccess(response.message);
      mutate();
      handleCancel();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <div>
      <ModalComponent
        loading={loadingFinish}
        title={t("Create Item")}
        open={modal.open}
        onCancel={handleCancel}
        onOk={handleOk}
        width={800}
      >
        <FormComponent onFinish={handleFinish} form={form}>
          <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>{t("Name")}</LabelForm>}
          >
            <InputComponent />
          </FormItemComponent>
          <div className="grid grid-cols-2 gap-5">
            <FormItemComponent
              rules={[{ required: true }]}
              name="unit"
              label={<LabelForm>{t("Unit")}</LabelForm>}
            >
              <SelectComponent
                options={unitOptions}
                onChange={handleChangeUnit}
              />
            </FormItemComponent>
            <FormItemComponent
              name="quantity"
              rules={[{ required: true }]}
              label={<LabelForm>{t("Quantity")}</LabelForm>}
            >
              <InputComponent.Number disabled={!available} />
            </FormItemComponent>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormItemComponent
              name="categoryId"
              rules={[{ required: true }]}
              label={<LabelForm>{t("Category")}</LabelForm>}
            >
              <SelectComponent options={itemManagementWarehouse.categories} />
            </FormItemComponent>
            <FormItemComponent
              name="status"
              rules={[{ required: true }]}
              label={<LabelForm>{t("Status")}</LabelForm>}
            >
              <SelectComponent options={statusOptions} />
            </FormItemComponent>
          </div>
          <FormItemComponent
            name="locationId"
            rules={[{ required: true }]}
            label={<LabelForm>{t("Location")}</LabelForm>}
          >
            <SelectComponent
              options={itemManagementWarehouse.warehouses}
              onChange={handleChangeWarehouse}
            />
          </FormItemComponent>
          {isLoading ? (
            <Spin />
          ) : (
            warehouse && (
              <CardComponent title={warehouse?.name}>
                {warehouse?.description}
              </CardComponent>
            )
          )}
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalAddItem;
