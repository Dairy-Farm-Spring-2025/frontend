import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { CowType } from '@model/Cow/CowType';
import { cowOrigin } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { genderData } from '@service/data/gender';
const CreateCowInformation = () => {
  const { data } = useFetcher<any[]>('cow-types', 'GET');
  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>(
    []
  );
  const { t } = useTranslation();
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
    <div className="mt-5 flex flex-col items-center">
      <div className="flex gap-5 w-3/4">
        <div className="flex flex-col gap-2 w-full">
          <Title className="!text-2xl w-1/2">{t('Date Information')}</Title>
          <div className="flex flex-col gap-5 w-full ">
            <FormItemComponent
              rules={[{ required: true }]}
              className="w-full"
              name="dateOfBirth"
              label={<LabelForm>{t('Date Of Birth')}</LabelForm>}
            >
              <DatePickerComponent className="w-full !text-[18px]" />
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
              label={<LabelForm>{t('Date Of Enter')}</LabelForm>}
            >
              <DatePickerComponent className="w-full" />
            </FormItemComponent>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Title className="!text-2xl">{t('Cow Information')}</Title>
          <div className="flex flex-col gap-5 w-full">
            <FormItemComponent
              rules={[{ required: true }]}
              name="gender"
              className="w-full"
              label={<LabelForm>{t('Gender')}</LabelForm>}
            >
              <SelectComponent
                options={genderData()}
                className="w-full"
                placeholder="Select gender..."
              />
            </FormItemComponent>
            <FormItemComponent
              name="cowTypeId"
              rules={[{ required: true }]}
              className="w-full"
              label={<LabelForm>{t('Cow Type')}</LabelForm>}
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
              label={<LabelForm>{t('Cow Status')}</LabelForm>}
            >
              <SelectComponent
                options={cowStatus()}
                className="w-full"
                placeholder="Select status..."
              />
            </FormItemComponent>
            <FormItemComponent
              name="cowOrigin"
              rules={[{ required: true }]}
              className="w-full"
              label={<LabelForm>{t('Origin')}</LabelForm>}
            >
              <SelectComponent
                options={cowOrigin()}
                placeholder="Enter origin..."
                className="w-full"
              />
            </FormItemComponent>
          </div>
        </div>
      </div>
      <div className="w-3/4 flex justify-center">
        <FormItemComponent
          className="w-full "
          name="description"
          rules={[{ required: true }]}
          label={<LabelForm>{t('Description')}</LabelForm>}
        >
          <ReactQuillComponent />
        </FormItemComponent>
      </div>
    </div>
  );
};

export default CreateCowInformation;
