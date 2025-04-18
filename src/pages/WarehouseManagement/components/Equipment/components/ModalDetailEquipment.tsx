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
import { formatStatusWithCamel } from '@utils/format';
import TagComponents from '@components/UI/TagComponents';
import { getEquipmentStatusTag } from '@utils/statusRender/equipmentStatusRender';

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
  const [edit, setEdit] = useState(false);

  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<EquipmentType>(
    `equipment/${id}`,
    'GET',
    'application/json',
    modal.open
  );
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
    setEdit(false);
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'warehouseLocationEntity', // Sửa key cho đúng với dữ liệu thiết bị
      label: t('Location'),
      children: !edit ? (
        data?.warehouseLocationEntity?.name || ''
      ) : (
        <FormItemComponent
          name="warehouseLocationEntity"
          rules={[{ required: true }]}
          noStyle
        >
          <SelectComponent
            options={
              dataWarehouse
                ?.filter((element) => element.type === 'equipment')
                ?.map((warehouse) => ({
                  label: warehouse.name,
                  value: warehouse.warehouseLocationId,
                })) || []
            }
            className="!w-full"
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
        <FormItemComponent noStyle name="name" rules={[{ required: true }]}>
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
          t(formatStatusWithCamel(data?.type))
        ) : (
          ''
        )
      ) : (
        <FormItemComponent noStyle name="type" rules={[{ required: true }]}>
          <SelectComponent
            options={equipmentTypeSelect()}
            className="!w-full"
          />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'status',
      label: t('Status'),
      children: !edit ? (
        data ? (
          <TagComponents color={getEquipmentStatusTag(data.status)}>
            {t(formatStatusWithCamel(data.status as any))}
          </TagComponents>
        ) : (
          ''
        )
      ) : (
        <FormItemComponent noStyle name="status" rules={[{ required: true }]}>
          <SelectComponent options={EquipmentStatus()} className="!w-full" />
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
        <FormItemComponent noStyle name="quantity" rules={[{ required: true }]}>
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
        <FormItemComponent
          noStyle
          name="description"
          rules={[{ required: true }]}
        >
          <InputComponent.TextArea />
        </FormItemComponent>
      ),
    },
  ];

  return (
    <ModalComponent
      title={t('Detail Equipment')}
      open={modal.open}
      width={800}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && (
          <ButtonComponent
            type="primary"
            buttonType="warning"
            onClick={() => setEdit(true)}
          >
            {t('Edit')}
          </ButtonComponent>
        ),
        edit && (
          <div className="flex gap-5 justify-end">
            <ButtonComponent onClick={() => setEdit(false)}>
              {t('Cancel')}
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
        <DescriptionComponent items={items} layout="horizontal" />
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalDetailEquipment;
