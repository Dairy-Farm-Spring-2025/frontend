import { Form, Input, InputNumber, Select } from 'antd';
import useToast from '../../../../hooks/useToast';
import useFetcher from '../../../../hooks/useFetcher';

import ButtonComponent from '../../../../components/Button/ButtonComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import { AreaType } from '../../../../model/Area/AreaType';
import { useEffect, useState } from 'react';

interface ModalCreateAreaProps {
  mutate: any;
  modal: any;
}

const areaTypes: { label: string; value: AreaType }[] = [
  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'warehouse' },
];

// Define minimum dimensions with explicit types
const minDimensions: Record<AreaType, { length: number; width: number }> = {
  cowHousing: { length: 20, width: 10 },
  milkingParlor: { length: 15, width: 8 },
  warehouse: { length: 10, width: 5 },
};

const ModalCreateArea = ({ mutate, modal }: ModalCreateAreaProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('areas/create', 'POST');
  const [form] = Form.useForm();

  const [areaTypeSelected, setAreaTypeSelected] = useState<AreaType | null>(null);

  const validateDimensions = (areaType: AreaType, length: number, width: number) => {
    const { length: minLength, width: minWidth } = minDimensions[areaType];
    return length >= minLength && width >= minWidth;
  };

  useEffect(() => {
    const { length, width } = minDimensions[areaTypeSelected || 'cowHousing'];
    form.setFieldsValue({ width: width });
    form.setFieldsValue({ length: length });
  }, [areaTypeSelected]);

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
            rules={[{ required: true, message: 'Area type is required' }]}
            name='areaType'
            label={<LabelForm>Area Type:</LabelForm>}
          >
            <Select options={areaTypes} onChange={(value) => setAreaTypeSelected(value)} />
          </FormItemComponent>
          <div className='flex justify-between '>
            <FormItemComponent
              rules={[
                { required: true, message: 'Length is required' },
                { type: 'number', min: 1, message: 'Length must be a positive number' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    // Ensure that the value for areaType is inferred as AreaType
                    const areaType: AreaType = getFieldValue('areaType');
                    const width = getFieldValue('width');
                    if (!areaType || !width || validateDimensions(areaType, value, width)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Minimum length is ${minDimensions[areaType].length}m`)
                    );
                  },
                }),
              ]}
              name='length'
              label={<LabelForm>Length (m):</LabelForm>}
            >
              <InputNumber
                className='w-[50%]'
                type='number'
                min={1}
                disabled={!areaTypeSelected} // Disable if no area type is selected
                onChange={(value) => {
                  form.setFieldsValue({ length: value }); // Make sure it's a number
                }}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[
                { required: true, message: 'Width is required' },
                { type: 'number', min: 1, message: 'Width must be a positive number' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    // Ensure that the value for areaType is inferred as AreaType
                    const areaType: AreaType = getFieldValue('areaType');
                    const length = getFieldValue('length');
                    if (!areaType || !length || validateDimensions(areaType, length, value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Minimum width is ${minDimensions[areaType].width}m`)
                    );
                  },
                }),
              ]}
              name='width'
              label={<LabelForm>Width (m):</LabelForm>}
            >
              <InputNumber
                className='w-[50%]'
                min={1}
                disabled={!areaTypeSelected} // Disable if no area type is selected
                onChange={(value) => {
                  form.setFieldsValue({ width: value }); // Make sure it's a number
                }}
              />
            </FormItemComponent>
          </div>
          <FormItemComponent
            rules={[
              { required: true, message: 'Name is required' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
            name='name'
            label={<LabelForm>Name:</LabelForm>}
          >
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true, message: 'Description is required' }]}
            name='description'
            label={<LabelForm>Description:</LabelForm>}
          >
            <Input.TextArea style={{ height: 120 }} placeholder='Enter a description' />
          </FormItemComponent>
        </FormComponent>
        <div className='mb-4 text-sm text-gray-700'>
          <p className='font-semibold'>Note:</p>
          <p>The minimum dimensions required for each area type are as follows:</p>
          <ul className='list-disc pl-5'>
            <li>
              <span className='font-medium'>Cow Housing:</span> Minimum length 20m, minimum width
              10m
            </li>
            <li>
              <span className='font-medium'>Milking Parlor:</span> Minimum length 15m, minimum width
              8m
            </li>
            <li>
              <span className='font-medium'>Warehouse:</span> Minimum length 10m, minimum width 5m
            </li>
          </ul>
          <p>
            Ensure that the dimensions you enter meet or exceed the minimum requirements for the
            selected area type.
          </p>
          <p className='mt-2 text-blue-600'>
            <strong>Tip:</strong> You can refer to the required dimensions when filling in the
            length and width.
          </p>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateArea;
