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
import { t } from 'i18next';
import { validateNameCategory } from '@utils/validate/categoryValidate';

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
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      mutate();
      mutateEdit();
      setEdit(false);
    } catch (error: any) {
      toast.showError(error.message);
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
  ];

  return (
    <ModalComponent
      title={t('Category detail')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={
        !validateNameCategory(data ? data?.name : '') && [
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
                buttonType="secondary"
                onClick={() => form.submit()}
              >
                {t('Save')}
              </ButtonComponent>
            </div>
          ),
        ]
      }
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <DescriptionComponent items={items} />
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalDetailCategory;
