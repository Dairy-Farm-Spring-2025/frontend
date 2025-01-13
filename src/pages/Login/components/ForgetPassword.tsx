import { Form, Input, Tooltip } from "antd";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/Button/ButtonComponent";
import FormComponent from "../../../components/Form/FormComponent";
import FormItemComponent from "../../../components/Form/Item/FormItemComponent";
import { UserRequestForgetPassword } from "../../../model/Authentication/UserRequest";
import useToast from "../../../hooks/useToast";
import authenticationApi from "../../../service/api/Authentication/authenticationApi";
import { useState } from "react";
const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleBackToLogin = () => {
    navigate("/login");
    form.resetFields();
  };
  const handleFinish = async (event: UserRequestForgetPassword) => {
    setLoading(true);
    try {
      const data = event.email;
      await authenticationApi.forgotPassword(data);
      toast.showSuccess("Please check your email");
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex relative w-full justify-center items-center">
          <Tooltip
            title={"Back to login"}
            arrow
            className="absolute left-0 top-0 hover:opacity-50 duration-300 cursor-pointer mt-1"
          >
            <MdArrowBack size={25} onClick={handleBackToLogin} />
          </Tooltip>
          <p className="font-bold text-xl text-primary">Forget Password?</p>
        </div>
        <FormComponent form={form} className="w-full" onFinish={handleFinish}>
          <FormItemComponent
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter your email..." />
          </FormItemComponent>
          <ButtonComponent loading={loading} htmlType="submit" type="primary">
            Submit
          </ButtonComponent>
        </FormComponent>
      </div>
    </div>
  );
};

export default ForgetPassword;
