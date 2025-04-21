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

import SelectComponent from '@components/Select/SelectComponent';
import { STORAGE_PATH } from '@service/api/Storage/storageApi';
import { warehouseType } from '@service/data/warehouse';
import { formatStatusWithCamel } from '@utils/format';
import { useTranslation } from 'react-i18next';
import { WarehouseType } from '../../../../../model/Warehouse/warehouse';

interface ModalDetailWarehouseProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailWarehouse = ({
  modal,
  mutate,
  id,
}: ModalDetailWarehouseProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(
    STORAGE_PATH.UPDATE_STORAGE(id),
    'PUT'
  );
  const [edit, setEdit] = useState(false);
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<WarehouseType>(
    STORAGE_PATH.STORAGE_DETAIL(id),
    'GET',
    'application/json',
    modal.open
  );
  const { t } = useTranslation();
  useEffect(() => {
    if (data && modal.open) {
      form.setFieldsValue({
        name: data?.name,
        description: data?.description,
        type: data?.type,
      });
    }
  }, [data, form]);

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message || t('Update success'));
      mutate();
      mutateEdit();
      setEdit(false);
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };

  const handleClose = () => {
    setEdit(false);
    modal.closeModal();
    form.resetFields();
  };

  const items: DescriptionPropsItem['items'] = [
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
          t(formatStatusWithCamel(data.type))
        ) : (
          'N/A'
        )
      ) : (
        <FormItemComponent name="type" rules={[{ required: true }]}>
          <SelectComponent options={warehouseType()} className="!w-full" />
        </FormItemComponent>
      ),
      span: 3,
    },
    {
      key: 'description',
      label: t('Description'),
      children: !edit ? (
        data ? (
          data?.description
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
      title={t('Detail')}
      open={modal.open}
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
            <ButtonComponent danger onClick={() => setEdit(false)}>
              {t('Cancel')}
            </ButtonComponent>
            <ButtonComponent
              loading={isLoading}
              type="primary"
              buttonType="secondary"
              onClick={() => form.submit()}
            >
              {t('Save')}
            </ButtonComponent>
          </div>
        ),
      ]}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <DescriptionComponent layout="horizontal" items={items} />
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalDetailWarehouse;
