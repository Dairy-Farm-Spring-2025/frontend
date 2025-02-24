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
  const { trigger, isLoading } = useFetcher(`warehouses/${id}`, 'PUT');
  const [edit, setEdit] = useState(false);
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<WarehouseType>(`warehouses/${id}`, 'GET');
  const { t } = useTranslation();
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
      });
    }
  }, [data, form]);

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
      title={t("Create Warehouse")}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && (
          <ButtonComponent type="primary" onClick={() => setEdit(true)}>
            {t("Edit")}
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
              {t("Save")}
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

export default ModalDetailWarehouse;
