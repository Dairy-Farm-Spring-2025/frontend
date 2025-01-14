import { DatePicker, Form, Input, Select } from "antd";
import FormComponent from "../../../components/Form/FormComponent";
import ModalComponent from "../../../components/Modal/ModalComponent";
import { UserProfileData } from "../../../model/User";
import FormItemComponent from "../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../components/LabelForm/LabelForm";
import { useEffect, useState } from "react";
import { genderData } from "../../../service/data/gender";
import useToast from "../../../hooks/useToast";
import { profileApi } from "../../../service/api/Profile/profileApi";
import useFetcher from "../../../hooks/useFetcher";
import dayjs from "dayjs";

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
  const { trigger, isLoading } = useFetcher("users/update", "PUT");
  const parseAddress = (fullAddress: string) => {
    const [address, ward, district, province] = fullAddress
      .split(",")
      .map((part) => part.trim());
    return { address, ward, district, province };
  };
  useEffect(() => {
    if (modal.open) {
      const { address, ward, district, province } = parseAddress(
        profile?.address || ""
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
      const response = await profileApi.getDistrictApi(province.value);
      const data = response.data.map((element: any) => ({
        value: element.id,
        label: element.name_en,
      }));
      setDistrict(data);
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      setIsDistrict(false);
    }
  };

  const onChangeDistrict = async (district: any) => {
    try {
      const response = await profileApi.getWardApi(district.value);
      const data = response.data.map((element: any) => ({
        value: element.id,
        label: element.name_en,
      }));
      setWard(data);
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      setIsWard(false);
    }
  };

  const handleFinish = async (values: any) => {
    const address = `${values.address}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`;
    const data = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      address: address,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
    };
    try {
      const response = await trigger({ body: data });
      toast.showSuccess(response.message);
      handleClose();
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      mutate();
    }
  };
  const handleClose = () => {
    form.resetFields();
    modal.closeModal();
    setIsWard(true);
    setIsDistrict(true);
  };
  return (
    <ModalComponent
      open={modal.open}
      onCancel={handleClose}
      title="Edit Information"
      width={700}
      onOk={() => form.submit()}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="name"
          label={<LabelForm>Name</LabelForm>}
          rules={[{ required: true }]}
        >
          <Input />
        </FormItemComponent>
        <FormItemComponent
          name="phoneNumber"
          rules={[
            {
              required: true,
              pattern: /^\d{10}$/,
              message: "Must be number and have 10 digits",
            },
          ]}
          label={<LabelForm>Phone number</LabelForm>}
        >
          <Input />
        </FormItemComponent>
        <div className="grid grid-cols-2 gap-5">
          <FormItemComponent
            name="dob"
            rules={[{ required: true }]}
            label={<LabelForm>Date of birth</LabelForm>}
          >
            <DatePicker format={"DD-MM-YYYY"} className="!w-full" />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="gender"
            label={<LabelForm>Gender</LabelForm>}
          >
            <Select placeholder="Select gender..." options={genderData} />
          </FormItemComponent>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <FormItemComponent
            name="province"
            rules={[{ required: true }]}
            label={<LabelForm>Province</LabelForm>}
          >
            <Select
              placeholder={"Select Province..."}
              labelInValue
              optionFilterProp="children"
              showSearch
              allowClear
              options={province}
              onChange={onChangeProvince}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </FormItemComponent>

          <FormItemComponent
            name="district"
            rules={[{ required: true }]}
            label={<LabelForm>District</LabelForm>}
          >
            <Select
              labelInValue
              optionFilterProp="children"
              placeholder={"Select District..."}
              disabled={isDistrict}
              showSearch
              allowClear
              options={district}
              onChange={onChangeDistrict}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </FormItemComponent>

          <FormItemComponent
            name="ward"
            rules={[{ required: true }]}
            label={<LabelForm>Ward</LabelForm>}
          >
            <Select
              labelInValue
              placeholder={"Select Ward..."}
              optionFilterProp="children"
              disabled={isWard}
              showSearch
              allowClear
              options={ward}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </FormItemComponent>
        </div>
        <FormItemComponent
          name="address"
          rules={[{ required: true }]}
          label={<LabelForm>Address</LabelForm>}
        >
          <Input placeholder="Enter your address" />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalEditProfile;
