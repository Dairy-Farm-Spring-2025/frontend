import { Form, Input, Select } from 'antd';
import useToast from '../../../../hooks/useToast';
import useFetcher from '../../../../hooks/useFetcher';

import ButtonComponent from '../../../../components/Button/ButtonComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import { AreaType } from '../../../../model/Area/AreaType';

interface ModalCreateAreaProps {
  mutate: any;
  modal: any;
}

const areaTypes: { label: string; value: AreaType }[] = [
  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'wareHouse' },
];

const ModalCreateArea = ({ mutate, modal }: ModalCreateAreaProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('areas/create', 'POST');
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      onClose();
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      mutate();
    }
  };

  const onClose = () => {
    modal.closeModal();
    form.resetFields();
  };

  return (
    <div>
      <ButtonComponent onClick={modal.openModal} type='primary'>
        Create Area
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={onClose}
        title='Create New Area'
        loading={isLoading}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent
            rules={[{ required: true }]}
            name='name'
            label={<LabelForm>Name:</LabelForm>}
          >
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name='description'
            label={<LabelForm>Description:</LabelForm>}
          >
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true, type: 'string' }]}
            name='length'
            label={<LabelForm>Length:</LabelForm>}
          >
            <Input type='string' />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true, type: 'string' }]}
            name='width'
            label={<LabelForm>Width:</LabelForm>}
          >
            <Input type='string' />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name='areaType'
            label={<LabelForm>Area Type:</LabelForm>}
          >
            <Select options={areaTypes} />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateArea;
