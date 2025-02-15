import { DatePicker, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import { CowType } from '../../../../../model/Cow/CowType';
import { cowOrigin } from '../../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../../service/data/cowStatus';
import { genderData } from '../../../../../service/data/gender';
import Title from '../../../../../components/UI/Title';
const CreateCowInformation = () => {
  const { data } = useFetcher<any[]>('cow-types', 'GET');
  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>(
    []
  );

  useEffect(() => {
    if (data) {
      const options = data.map((element: CowType) => ({
        label: element.name,
        value: element.cowTypeId,
      }));
      setOptionsCowType(options);
    }
  }, [data]);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        <Title className="!text-2xl">Date Information</Title>
        <div className="grid grid-cols-4 gap-5 w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            className="w-full"
            name="dateOfBirth"
            label={<LabelForm>Date of birth</LabelForm>}
          >
            <DatePicker className="w-full !text-[18px]" />
          </FormItemComponent>
          <FormItemComponent
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value: any) {
                  const dateOfBirth = getFieldValue('dateOfBirth');
                  if (!value || !dateOfBirth || value.isAfter(dateOfBirth)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Date of Enter must be greater than Date of Birth.'
                    )
                  );
                },
              }),
            ]}
            className="w-full"
            name="dateOfEnter"
            label={<LabelForm>Date of enter</LabelForm>}
          >
            <DatePicker className="w-full" />
          </FormItemComponent>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Title className="!text-2xl">Cow Information</Title>
        <div className="grid grid-cols-4 gap-5 w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            name="gender"
            className="w-full"
            label={<LabelForm>Gender</LabelForm>}
          >
            <SelectComponent
              options={genderData}
              className="w-full"
              placeholder="Select gender..."
            />
          </FormItemComponent>
          <FormItemComponent
            name="cowTypeId"
            rules={[{ required: true }]}
            className="w-full"
            label={<LabelForm>Cow Type</LabelForm>}
          >
            <SelectComponent
              options={optionsCowType}
              className="w-full"
              placeholder="Select cow type..."
            />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            className="w-full"
            name="cowStatus"
            label={<LabelForm>Cow Status</LabelForm>}
          >
            <SelectComponent
              options={cowStatus}
              className="w-full"
              placeholder="Select status..."
            />
          </FormItemComponent>
          <FormItemComponent
            name="cowOrigin"
            rules={[{ required: true }]}
            className="w-full"
            label={<LabelForm>Cow Origin</LabelForm>}
          >
            <SelectComponent
              options={cowOrigin}
              placeholder="Enter origin..."
              className="w-full"
            />
          </FormItemComponent>
          <FormItemComponent
            className="w-full !col-span-4"
            name="description"
            rules={[{ required: true }]}
            label={<LabelForm>Description</LabelForm>}
          >
            <ReactQuillComponent />
          </FormItemComponent>
        </div>
      </div>
    </div>
  );
};

export default CreateCowInformation;
