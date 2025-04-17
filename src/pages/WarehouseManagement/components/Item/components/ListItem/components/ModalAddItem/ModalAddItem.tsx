import { Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import { RootState } from '@core/store/store';
import SelectComponent from '@components/Select/SelectComponent';
import { statusOptions, unitOptions } from '@service/data/item';
import { useEffect, useState } from 'react';
import { WarehouseType } from '@model/Warehouse/warehouse';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import CardComponent from '@components/Card/CardComponent';
import { ItemRequestBody } from '@model/Warehouse/items';
import { useTranslation } from 'react-i18next';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import { STORAGE_PATH } from '@service/api/Storage/storageApi';

interface ModalAddItemProps {
  modal: any;
  mutate: any;
}

const ModalAddItem = ({ modal, mutate }: ModalAddItemProps) => {
  const [idWarehouse, setIdWarehouse] = useState<string>('');
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  const [warehouse, setWarehouse] = useState<WarehouseType>();
  const [, setAvailable] = useState(false);
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );
  const { t } = useTranslation();
  const toast = useToast();
  const { isLoading, trigger } = useFetcher<WarehouseType>('');
  const { isLoading: loadingFinish, trigger: triggerFinish } = useFetcher(
    ITEMS_PATH.ITEMS_CREATE,
    'POST'
  );

  useEffect(() => {
    if (modal.open) {
      setDisabledButton(true); // Disable nút ngay từ đầu
    }
  }, [modal.open]);

  useEffect(() => {
    const isButtonDisabled =
      !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

  useEffect(() => {
    const fetchWarehouse = async (id: string) => {
      try {
        const response = await trigger({
          url: STORAGE_PATH.STORAGE_DETAIL(id),
        });
        setWarehouse(response);
      } catch (error: any) {
        toast.showError(error.message);
      }
    };
    if (idWarehouse !== '') {
      fetchWarehouse(idWarehouse);
    }
  }, [idWarehouse]);

  const handleChangeWarehouse = (id: string) => {
    setIdWarehouse(id);
  };

  const handleChangeUnit = () => {
    setAvailable(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIdWarehouse('');
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
        disabledButtonOk={disabledButton}
        loading={loadingFinish}
        title={t('Create Item')}
        open={modal.open}
        onCancel={handleCancel}
        onOk={handleOk}
        width={800}
      >
        <FormComponent onFinish={handleFinish} form={form}>

          <div className="grid grid-cols-2 gap-5">
            <FormItemComponent
              rules={[{ required: true }]}
              name="name"
              label={<LabelForm>{t('Name')}</LabelForm>}
            >
              <InputComponent />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              name="unit"
              label={<LabelForm>{t('Unit')}</LabelForm>}
            >
              <SelectComponent
                options={unitOptions()}
                onChange={handleChangeUnit}
              />
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
    </div>
  );
};

export default ModalAddItem;
