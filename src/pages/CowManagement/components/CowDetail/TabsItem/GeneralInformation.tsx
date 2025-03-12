import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import Text from '@components/UI/Text';
import TextBorder from '@components/UI/TextBorder';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Form, SelectProps, Spin } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import CowQRImage from '../../../../../components/CowQrImage/CowQrImage';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import Title from '../../../../../components/UI/Title';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { Cow } from '../../../../../model/Cow/Cow';
import { CowType } from '../../../../../model/Cow/CowType';
import { cowOrigin } from '../../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../../service/data/cowStatus';
import { genderData } from '../../../../../service/data/gender';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';

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
  const { trigger, isLoading } = useFetcher(COW_PATH.COW_UPDATE(id), 'PUT');
  const { data } = useFetcher<any[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
  const [optionsCowType, setOptionsCowType] = useState<SelectProps['options']>(
    []
  );
  const [showEdit, setShowEdit] = useState(false);
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
      className="p-2 flex flex-col items-center gap-5 w-full"
    >
      <div className="flex gap-5 w-3/4">
        <div className="flex gap-5 w-full">
          <div className="relative flex flex-col gap-2 w-full">
            <Title className="!text-2xl">{t('Date Information')}</Title>
            <div className="flex flex-col gap-5 w-3/4">
              <FormItemComponent
                rules={[{ required: true }]}
                className="w-full"
                name="dateOfBirth"
                label={<LabelForm>{t('Date Of Birth')}</LabelForm>}
              >
                {!showEdit ? (
                  <TextBorder>
                    <Text>{formatDateHour(dataDetail?.dateOfBirth)}</Text>
                  </TextBorder>
                ) : (
                  <DatePickerComponent className="w-full !text-[18px] min-w-[250px]" />
                )}
              </FormItemComponent>
              <FormItemComponent
                rules={[{ required: true }]}
                className="w-full"
                name="dateOfEnter"
                label={<LabelForm>{t('Date Of Enter')}</LabelForm>}
              >
                {!showEdit ? (
                  <TextBorder>
                    <Text>{formatDateHour(dataDetail?.dateOfEnter)}</Text>
                  </TextBorder>
                ) : (
                  <DatePickerComponent className="w-full min-w-[250px]" />
                )}
              </FormItemComponent>
              <div className="flex justify-center">
                <CowQRImage id={id} />
              </div>
            </div>
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
              {!showEdit ? (
                <TextBorder>
                  <Text>{formatStatusWithCamel(dataDetail?.gender)}</Text>
                </TextBorder>
              ) : (
                <SelectComponent options={genderData} className="w-full" />
              )}
            </FormItemComponent>
            <FormItemComponent
              name="cowTypeId"
              rules={[{ required: true }]}
              className="w-full"
              label={<LabelForm>{t('Cow Type')}</LabelForm>}
            >
              {!showEdit ? (
                <TextBorder>
                  <Text>
                    {formatStatusWithCamel(dataDetail?.cowType?.name)}
                  </Text>
                </TextBorder>
              ) : (
                <SelectComponent options={optionsCowType} className="w-full" />
              )}
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              className="w-full"
              name="cowStatus"
              label={<LabelForm>{t('Cow Status')}</LabelForm>}
            >
              {!showEdit ? (
                <TextBorder>
                  <Text>{formatStatusWithCamel(dataDetail?.cowStatus)}</Text>
                </TextBorder>
              ) : (
                <SelectComponent options={cowStatus} className="w-full" />
              )}
            </FormItemComponent>
            <FormItemComponent
              name="cowOrigin"
              rules={[{ required: true }]}
              className="w-full"
              label={<LabelForm>{t('Origin')}</LabelForm>}
            >
              {!showEdit ? (
                <TextBorder>
                  <Text>{formatStatusWithCamel(dataDetail?.cowOrigin)}</Text>
                </TextBorder>
              ) : (
                <SelectComponent options={cowOrigin} className="w-full" />
              )}
            </FormItemComponent>
          </div>
        </div>
      </div>
      <FormItemComponent
        className="w-3/4"
        name="description"
        rules={[{ required: true }]}
        label={<LabelForm>{t('Description')}</LabelForm>}
      >
        <ReactQuillComponent readOnly={!showEdit} />
      </FormItemComponent>
      <div className="flex justify-end items-center w-full gap-3">
        <p className="text-lg text-orange-600 font-semibold">
          ({t("You can edit cow's information")})
        </p>
        {!showEdit ? (
          <ButtonComponent type="primary" onClick={() => setShowEdit(true)}>
            {t('Edit')}
          </ButtonComponent>
        ) : (
          <div className="flex gap-5">
            <ButtonComponent
              type="primary"
              danger
              onClick={() => setShowEdit(false)}
            >
              {t('Cancel')}
            </ButtonComponent>
            <ButtonComponent
              loading={isLoading}
              htmlType="submit"
              type="primary"
            >
              {t('Save')}
            </ButtonComponent>
          </div>
        )}
      </div>
    </FormComponent>
  );
};

export default CowGeneralInformation;
