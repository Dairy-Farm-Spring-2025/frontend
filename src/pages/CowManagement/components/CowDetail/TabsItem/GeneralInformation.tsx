import { DatePicker, Form, SelectProps, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { Cow } from '../../../../../model/Cow/Cow';
import { CowType } from '../../../../../model/Cow/CowType';
import { cowOrigin } from '../../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../../service/data/cowStatus';
import { genderData } from '../../../../../service/data/gender';

interface CowGeneralInformationProps {
  id: string;
  dataDetail: Cow;
  isLoadingDetail: boolean;
  mutateDetail: any;
}

const CowGeneralInformation = ({
  id,
  dataDetail,
  isLoadingDetail,
  mutateDetail,
}: CowGeneralInformationProps) => {
  const [form] = Form.useForm();
  const { trigger, isLoading } = useFetcher(`cows/${id}`, 'PUT');
  const { data } = useFetcher<any[]>('cow-types', 'GET');
  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>(
    []
  );
  const toast = useToast();

  useEffect(() => {
    if (data) {
      const options = data.map((element: CowType) => ({
        label: element.name,
        value: element.cowTypeId,
      }));
      setOptionsCowType(options);
    }
  }, [data]);

  useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        cowStatus: dataDetail.cowStatus,
        dateOfBirth: dayjs(dataDetail.dateOfBirth),
        dateOfEnter: dayjs(dataDetail.dateOfEnter),
        cowOrigin: dataDetail.cowOrigin,
        gender: dataDetail.gender,
        cowTypeId: dataDetail.cowType.cowTypeId,
        description: dataDetail.description,
      });
    }
  }, [dataDetail, form]);

  const handleFinish = async (values: any) => {
    const data = {
      cowStatus: values.cowStatus,
      dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
      dateOfEnter: dayjs(values.dateOfEnter).format('YYYY-MM-DD'),
      cowOrigin: values.cowOrigin,
      gender: values.gender,
      cowTypeId: values.cowTypeId,
      description: values.description,
    };
    try {
      const response = await trigger({ body: data });
      toast.showSuccess(response.message);
      mutateDetail();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  if (isLoadingDetail) {
    return <Spin />;
  }

  return (
    <FormComponent
      onFinish={handleFinish}
      form={form}
      className="p-2 flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Date information</p>
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
            rules={[{ required: true }]}
            className="w-full"
            name="dateOfEnter"
            label={<LabelForm>Date of enter</LabelForm>}
          >
            <DatePicker className="w-full" />
          </FormItemComponent>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Cow Information</p>
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
        <div className="flex justify-end items-center gap-3">
          <p className="text-lg text-orange-600 font-semibold">
            (You can edit cow's information)
          </p>
          <ButtonComponent loading={isLoading} htmlType="submit" type="primary">
            Save
          </ButtonComponent>
        </div>
      </div>
    </FormComponent>
  );
};

export default CowGeneralInformation;
