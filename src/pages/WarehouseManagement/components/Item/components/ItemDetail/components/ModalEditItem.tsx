import { Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardComponent from '../../../../../../../components/Card/CardComponent';
import FormComponent from '../../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import { RootState } from '../../../../../../../core/store/store';
import useFetcher from '../../../../../../../hooks/useFetcher';
import useToast from '../../../../../../../hooks/useToast';
import {
  Item,
  ItemRequestBody,
} from '../../../../../../../model/Warehouse/items';
import {
  statusOptions,
  unitOptions,
} from '../../../../../../../service/data/item';
import { WarehouseType } from '@model/Warehouse/warehouse';
import { t } from 'i18next';

interface ModalEditItemProps {
  modal: any;
  data: Item;
  mutate: any;
}

const ModalEditItem = ({ modal, data, mutate }: ModalEditItemProps) => {
  const [form] = Form.useForm();
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );
  const [idWarehouse, setIdWarehouse] = useState<number>(
    data?.warehouseLocationEntity?.warehouseLocationId
  );
  const toast = useToast();
  const { isLoading, trigger } = useFetcher<WarehouseType>('');
  const [warehouse, setWarehouse] = useState<WarehouseType>();
  const { isLoading: isLoadingEdit, trigger: triggerEdit } = useFetcher<any>(
    `items/${data?.itemId}`,
    'PUT'
  );

  useEffect(() => {
    if (data && modal.open) {
      form.setFieldsValue({
        name: data?.name,
        status: data?.status,
        unit: data?.unit,
        categoryId: data?.categoryEntity?.categoryId,
        locationId: data?.warehouseLocationEntity?.warehouseLocationId,
      });
    }
  }, [data, form, modal.open]);

  useEffect(() => {
    const fetchWarehouse = async (id: number) => {
      const response = await trigger({ url: `warehouses/${id}` });
      setWarehouse(response);
    };
    if (idWarehouse !== 0) {
      fetchWarehouse(idWarehouse);
    }
  }, [idWarehouse]);

  const handleChangeWarehouse = (id: number) => {
    setIdWarehouse(id);
  };

  const handleCancel = () => {
    form.resetFields();
    setIdWarehouse(0);
    setWarehouse(undefined);
    modal.closeModal();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = async (values: ItemRequestBody) => {
    try {
      const response = await triggerEdit({ body: values });
      toast.showSuccess(response.message);
      handleCancel();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      loading={isLoadingEdit}
      onOk={handleOk}
      width={800}
      onCancel={handleCancel}
      title={t('Edit Item')}
      open={modal.open}
    >
      <FormComponent onFinish={handleFinish} form={form}>
        <FormItemComponent
          rules={[{ required: true }]}
          name="name"
          label={<LabelForm>{t('Name')}</LabelForm>}
        >
          <InputComponent />
        </FormItemComponent>
        <div className="grid grid-cols-2 gap-5">
          <FormItemComponent
            rules={[{ required: true }]}
            name="unit"
            label={<LabelForm>{t('Unit')}</LabelForm>}
          >
            <SelectComponent options={unitOptions()} />
          </FormItemComponent>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <FormItemComponent
            name="categoryId"
            rules={[{ required: true }]}
            label={<LabelForm>{t('Category')}</LabelForm>}
          >
            <SelectComponent options={itemManagementWarehouse.categories} />
          </FormItemComponent>
          <FormItemComponent
            name="status"
            rules={[{ required: true }]}
            label={<LabelForm>{t('Status')}</LabelForm>}
          >
            <SelectComponent options={statusOptions()} />
          </FormItemComponent>
        </div>
        <FormItemComponent
          name="locationId"
          rules={[{ required: true }]}
          label={<LabelForm>{t('Location')}</LabelForm>}
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
  );
};

export default ModalEditItem;
