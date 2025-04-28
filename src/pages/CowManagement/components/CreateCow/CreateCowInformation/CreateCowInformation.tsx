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
import { cowStatusCreateCow } from '@service/data/cowStatus';
import dayjs from 'dayjs';
import InputComponent from '@components/Input/InputComponent';

const CreateCowInformation = () => {
  const { data } = useFetcher<any[]>('cow-types', 'GET');
  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>([]);
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
          <div className="flex flex-col gap-5 w-full">
            <FormItemComponent
              dependencies={['cowStatus', 'dateOfEnter']}
              rules={[
                { required: true, message: t('Date of Birth is required') },
                ({ getFieldValue }) => ({
                  validator(_, value: any) {
                    const dateOfEnter = getFieldValue('dateOfEnter');
                    const cowStatus = getFieldValue('cowStatus');

                    if (!value) {
                      return Promise.resolve();
                    }

                    if (dateOfEnter && !value.isBefore(dateOfEnter)) {
                      return Promise.reject(
                        new Error(
                          t('Date of Birth must be earlier than Date of Enter')
                        )
                      );
                    }

                    if (cowStatus === 'milkingCow') {
                      const today = value.clone().add(10, 'month');
                      if (today.isAfter(dayjs())) {
                        return Promise.reject(
                          new Error(
                            t(
                              'Date of Birth must be at least 10 months before today for "Milking Cow"'
                            )
                          )
                        );
                      }
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
              className="w-full"
              name="dateOfBirth"
              label={<LabelForm>{t('Date Of Birth')}</LabelForm>}
            >
              <DatePickerComponent
                className="w-full !text-[18px]"
                disabledDate={(current) => {
                  return current && current.isAfter(dayjs().startOf('day'));
                }}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[
                { required: true, message: t('Date of Enter is required') },
                ({ getFieldValue }) => ({
                  validator(_, value: any) {
                    const dateOfBirth = getFieldValue('dateOfBirth');
                    if (!value || !dateOfBirth || value.isAfter(dateOfBirth)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        t('Date of Birth must be earlier than Date of Enter')
                      )
                    );
                  },
                }),
              ]}
              className="w-full"
              name="dateOfEnter"
              label={<LabelForm>{t('Date Of Enter')}</LabelForm>}
            >
              <DatePickerComponent
                className="w-full"
                disabledDate={(current) => {
                  return current && current.isBefore(dayjs().startOf('day'));
                }}
              />
            </FormItemComponent>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Title className="!text-2xl">{t('Cow Information')}</Title>
          <div className="flex flex-col gap-5 w-full">
          <FormItemComponent
              rules={[{ required: true, message: t('Gender is required') }]}
              name="gender"
              className="w-full"
              label={<LabelForm>{t('Gender')}</LabelForm>}
              initialValue={t('cow.female')} 

            >
              <InputComponent
                className="w-full"
                disabled
                value={t('Female')} // Display translated text ("Cái" in Vietnamese)
                key={t('Female')} // Force re-render when translation changes
              />
            </FormItemComponent>
            <FormItemComponent
              name="cowTypeId"
              rules={[{ required: true, message: t('Cow Type is required') }]}
              className="w-full"
              label={<LabelForm>{t('Cow Type')}</LabelForm>}
            >
              <SelectComponent options={optionsCowType} className="w-full" />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true, message: t('Cow Status is required') }]}
              className="w-full"
              name="cowStatus"
              label={<LabelForm>{t('Cow Status')}</LabelForm>}
            >
              <SelectComponent options={cowStatusCreateCow()} className="w-full" />
            </FormItemComponent>
            <FormItemComponent
              name="cowOrigin"
              rules={[{ required: true, message: t('Origin is required') }]}
              className="w-full"
              label={<LabelForm>{t('Origin')}</LabelForm>}
            >
              <SelectComponent options={cowOrigin()} className="w-full" />
            </FormItemComponent>
          </div>
        </div>
      </div>
      <div className="w-3/4 flex justify-center">
        <FormItemComponent
          className="w-full"
          name="description"
          rules={[{ required: true, message: t('Description is required') }]}
          label={<LabelForm>{t('Description')}</LabelForm>}
        >
          <ReactQuillComponent />
        </FormItemComponent>
      </div>
    </div>
  );
};

export default CreateCowInformation;