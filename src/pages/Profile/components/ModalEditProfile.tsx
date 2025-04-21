import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import SelectComponent from '@components/Select/SelectComponent';
import { Form, Input } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import FormComponent from '../../../components/Form/FormComponent';
import FormItemComponent from '../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../components/Modal/ModalComponent';
import useFetcher from '../../../hooks/useFetcher';
import useToast from '../../../hooks/useToast';
import { UserProfileData } from '../../../model/User';
import { profileApi } from '../../../service/api/Profile/profileApi';
import { genderDataUser } from '../../../service/data/gender';
import InputComponent from '@components/Input/InputComponent';

interface ModalEditProfileProps {
  modal: any;
  profile: UserProfileData;
  mutate?: any;
}

const ModalEditProfile = ({
  modal,
  profile,
  mutate,
}: ModalEditProfileProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const [province, setProvince] = useState<any[]>([]);
  const [district, setDistrict] = useState<any[]>([]);
  const [ward, setWard] = useState<any[]>([]);
  const [isDistrict, setIsDistrict] = useState(true);
  const [isWard, setIsWard] = useState(true);
  const { trigger, isLoading } = useFetcher(
    'users/update',
    'PUT',
    'multipart/form-data'
  );
  const parseAddress = (fullAddress: string) => {
    const [address, ward, district, province] = fullAddress
      .split(',')
      .map((part) => part.trim());
    return { address, ward, district, province };
  };
  useEffect(() => {
    if (modal.open) {
      const { address, ward, district, province } = parseAddress(
        profile?.address || ''
      );
      form.setFieldsValue({
        name: profile?.name,
        phoneNumber: profile?.phoneNumber,
        gender: profile?.gender,
        dob: profile?.dob ? dayjs(profile.dob) : null,
        address,
        ward: ward ? { label: ward, value: ward } : undefined,
        district: district ? { label: district, value: district } : undefined,
        province: province ? { label: province, value: province } : undefined,
      });
      const fetchProvince = async () => {
        try {
          const response = await profileApi.getProvinceApi();
          const data = response.data.map((element: any) => ({
            value: element.id,
            label: element.name_en,
          }));
          setProvince(data);
        } catch (error: any) {
          toast.showError(error.message);
        }
      };
      fetchProvince();
      if (ward && district && province) {
        setIsWard(false);
        setIsDistrict(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form,
    modal.open,
    profile?.address,
    profile?.dob,
    profile?.gender,
    profile?.name,
    profile?.phoneNumber,
  ]);

  const onChangeProvince = async (province: any) => {
    try {
      form.setFieldsValue({ district: undefined, ward: undefined });
      setDistrict([]);
      const response = await profileApi.getDistrictApi(province.value);
      const data = response.data.map((element: any) => ({
        value: element.id,
        label: element.name_en,
      }));
      setDistrict(data);
    } finally {
      setIsDistrict(false);
      setIsWard(true); // 👈 Reset lại ward
    }
  };

  const onChangeDistrict = async (district: any) => {
    try {
      form.setFieldsValue({ ward: undefined }); // 👈 Clear ward
      setWard([]);
      const response = await profileApi.getWardApi(district.value);
      const data = response.data.map((element: any) => ({
        value: element.id,
        label: element.name_en,
      }));
      setWard(data);
    } finally {
      setIsWard(false);
    }
  };

  const disabledDOB = (current: dayjs.Dayjs) => {
    // Ngày hôm nay
    const today = dayjs();
    // Chỉ cho phép chọn ngày nhỏ hơn hoặc bằng hôm nay trừ 18 năm
    return current.isAfter(today.subtract(18, 'year'));
  };

  const handleFinish = async (values: any) => {
    const address = `${values.address}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('address', address);
    formData.append('dob', dayjs(values.dob).format('YYYY-MM-DD'));
    formData.append('gender', values.gender);
    try {
      const response = await trigger({ body: formData });
      toast.showSuccess(response.message);
      handleClose();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const handleClose = () => {
    form.resetFields();
    modal.closeModal();
    setIsWard(true);
    setIsDistrict(true);
    setWard([]);
    setDistrict([]);
    setProvince([]);
  };
  return (
    <ModalComponent
      open={modal.open}
      onCancel={handleClose}
      title={t('Edit Information')}
      width={700}
      onOk={() => form.submit()}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <div className="flex flex-col gap-5">
          <FormItemComponent
            name="name"
            label={<LabelForm>{t('Name')}</LabelForm>}
            rules={[{ required: true }]}
          >
            <InputComponent />
          </FormItemComponent>
          <FormItemComponent
            name="phoneNumber"
            rules={[
              { required: true },
              {
                pattern: /^0\d{9}$/,
                message: t(
                  'Must be a number starting with 0 and have 10 digits'
                ),
              },
            ]}
            label={<LabelForm>{t('phone_number')}</LabelForm>}
          >
            <InputComponent />
          </FormItemComponent>
          <div className="grid grid-cols-2 gap-5">
            <FormItemComponent
              name="dob"
              rules={[{ required: true }]}
              label={<LabelForm>{t('date_of_birth')}</LabelForm>}
            >
              <DatePickerComponent
                className="!w-full"
                disabledDate={disabledDOB}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              name="gender"
              label={<LabelForm>{t('gender')}</LabelForm>}
            >
              <SelectComponent options={genderDataUser()} />
            </FormItemComponent>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <FormItemComponent
              name="province"
              rules={[{ required: true }]}
              label={<LabelForm>{t('Province')}</LabelForm>}
            >
              <SelectComponent
                labelInValue
                optionFilterProp="children"
                showSearch
                allowClear
                options={province}
                onChange={onChangeProvince}
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </FormItemComponent>

            <FormItemComponent
              name="district"
              rules={[{ required: true }]}
              label={<LabelForm>{t('District')}</LabelForm>}
            >
              <SelectComponent
                labelInValue
                optionFilterProp="children"
                disabled={isDistrict || district.length === 0}
                showSearch
                allowClear
                options={district}
                onChange={onChangeDistrict}
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </FormItemComponent>

            <FormItemComponent
              name="ward"
              rules={[{ required: true }]}
              label={<LabelForm>{t('Ward')}</LabelForm>}
            >
              <SelectComponent
                labelInValue
                optionFilterProp="children"
                disabled={isWard || ward.length === 0}
                showSearch
                allowClear
                options={ward}
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </FormItemComponent>
          </div>
          <FormItemComponent
            name="address"
            rules={[{ required: true }]}
            label={<LabelForm>{t('Address')}</LabelForm>}
          >
            <Input placeholder="Enter your address" />
          </FormItemComponent>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalEditProfile;
