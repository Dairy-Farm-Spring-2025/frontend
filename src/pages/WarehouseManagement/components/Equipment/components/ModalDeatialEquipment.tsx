import { Form } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';

import { useTranslation } from 'react-i18next';
import { EquipmentType } from '../../../../../model/Warehouse/equipment';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import {
  EquipmentStatus,
  equipmentTypeSelect,
} from '../../../../../service/data/equipment';
import { WarehouseType } from '../../../../../model/Warehouse/warehouse';

interface ModalDetailEquipmentProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailEquipment = ({
  modal,
  mutate,
  id,
}: ModalDetailEquipmentProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(`equipment/${id}`, 'PUT');
  const { data: dataWarehouse } = useFetcher<WarehouseType[]>(
    'warehouses',
    'GET'
  );
  console.log('check data warehouse: ', dataWarehouse);
  const [edit, setEdit] = useState(false);

  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<EquipmentType>(`equipment/${id}`, 'GET');
  const { t } = useTranslation();
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description.replace(/<\/?p>/g, ''), // Loại bỏ thẻ <p>
        type: data.type,
        status: data.status,
        quantity: data.quantity,
        warehouseLocationEntity:
          data.warehouseLocationEntity?.warehouseLocationId,
      });
    }
  }, [data, form, modal.open]);

  const handleFinish = async (values: any) => {
    try {
      await trigger({ body: values });
      toast.showSuccess('Update success');
      mutate();
      mutateEdit();
      setEdit(false);
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'warehouseLocationEntity', // Sửa key cho đúng với dữ liệu thiết bị
      label: t('Location'),
      children: !edit ? (
        dataWarehouse?.[0].name || ''
      ) : (
        <FormItemComponent
          name="warehouseLocationEntity"
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={
              dataWarehouse?.map((warehouse) => ({
                label: warehouse.name,
                value: warehouse.warehouseLocationId,
              })) || []
            }
          />
        </FormItemComponent>
      ),

      span: 3,
    },
    {
      key: 'name',
      label: t('Name'),
      children: !edit ? (
        data ? (
          data?.name
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="name" rules={[{ required: true }]}>
          <InputComponent />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'type',
      label: t('Type'),
      children: !edit ? (
        data ? (
          data?.type
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="type" rules={[{ required: true }]}>
          <SelectComponent options={equipmentTypeSelect()} />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'status',
      label: t('Status'),
      children: !edit ? (
        data ? (
          data?.status
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="status" rules={[{ required: true }]}>
          <SelectComponent options={EquipmentStatus()} />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'quantity',
      label: t('Quantity'),
      children: !edit ? (
        data ? (
          data?.quantity
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="quantity" rules={[{ required: true }]}>
          <InputComponent />
        </FormItemComponent>
      ),
      span: 3,
    },

    {
      key: 'description',
      label: t('Description'),
      children: !edit ? (
        data ? (
          <div>{data.description.replace(/<\/?p>/g, '')}</div>
        ) : (
          ''
        )
      ) : (
        <FormItemComponent name="description" rules={[{ required: true }]}>
          <InputComponent.TextArea />
        </FormItemComponent>
      ),
    },
  ];

  return (
    <ModalComponent
      title={t('Create Warehouse')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && (
          <ButtonComponent type="primary" onClick={() => setEdit(true)}>
            {t('Edit')}
          </ButtonComponent>
        ),
        edit && (
          <div className="flex gap-5 justify-end">
            <ButtonComponent onClick={() => setEdit(false)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              loading={isLoading}
              type="primary"
              onClick={() => form.submit()}
            >
              {t('Save')}
            </ButtonComponent>
          </div>
        ),
      ]}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <DescriptionComponent items={items} />
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalDetailEquipment;
