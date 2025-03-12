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
import { CategoryType } from '@model/Warehouse/category';
import { CATEGORY_PATH } from '@service/api/Storage/categoryApi';

interface ModalDetailCategoryProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailCategory = ({
  modal,
  mutate,
  id,
}: ModalDetailCategoryProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(
    CATEGORY_PATH.CATEGORY_UPDATE(id),
    'PUT'
  );
  const [edit, setEdit] = useState(false);
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<CategoryType>(CATEGORY_PATH.CATEGORY_DETAIL(id), 'GET');

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
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
      label: 'Name',
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
  ];

  return (
    <ModalComponent
      title="Edit Category"
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && (
          <ButtonComponent type="primary" onClick={() => setEdit(true)}>
            Edit
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
              Save
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

export default ModalDetailCategory;
