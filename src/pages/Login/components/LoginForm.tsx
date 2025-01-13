import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Divider, Form, Input } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/Button/ButtonComponent";
import FormComponent from "../../../components/Form/FormComponent";
import FormItemComponent from "../../../components/Form/Item/FormItemComponent";
import useFetcher from "../../../hooks/useFetcher";
import useToast from "../../../hooks/useToast";
import UserRequest from "../../../model/Authentication/UserRequest";
import UserResponse from "../../../model/Authentication/UserResponse";
import { login } from "../../../core/store/slice/userSlice";
const LoginForm = () => {
  const navigate = useNavigate();
  const { trigger, isLoading } = useFetcher<UserResponse>(
    "users/signin",
    "POST"
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const [form] = Form.useForm();
  const handleForgetPassword = () => {
    navigate("forget-password");
  };
  const handleFinish = async (values: UserRequest) => {
    const data: UserRequest = {
      email: values.email,
      password: values.password,
    };
    try {
      const response: UserResponse = await trigger({ body: data });
      console.log(response);
      if (response.message && response.data) {
        const role = response.data.roleName;
        if (role !== "Manager" && role !== "Admin") {
          toast.showError("You do not permission to access");
        } else {
          toast.showSuccess("Signin Success");
          dispatch(login(response.data));
          navigate("/dairy");
        }
      } else {
        toast.showError(response.message);
      }
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);
  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-darkGreen">Welcome Back</h2>
      </div>
      <Divider className="my-5" />
      <div className="w-full">
        <FormComponent
          onFinish={handleFinish}
          form={form}
          labelCol={{ span: 24 }}
          className="flex flex-col gap-4"
        >
          <FormItemComponent
            label={<span className="text-base font-semibold">Email</span>}
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              placeholder="Email..."
              className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </FormItemComponent>

          <FormItemComponent
            label={<span className="text-base font-semibold">Password</span>}
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-500" />}
              placeholder="Password"
              className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </FormItemComponent>

          {/* <Popover
            placement="topLeft"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            content={
              <div className="p-4">
                <Form
                  onFinish={(values) => {
                    toast.success("Check your email for reset instructions");
                    setOpen(false);
                  }}
                  layout="vertical"
                >
                  <Form.Item
                    name="email"
                    label={<LabelForm>Enter your email:</LabelForm>}
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Invalid email format" },
                    ]}
                  >
                    <Input placeholder="example@gmail.com" />
                  </Form.Item>
                  <ButtonComponent
                    type="primary"
                    htmlType="submit"
                    block
                    className="mt-2"
                  >
                    Submit
                  </ButtonComponent>
                </Form>
              </div>
            }
          >

          </Popover> */}
          <ButtonComponent
            onClick={handleForgetPassword}
            className="text-blue-500 hover:text-blue-700 forgot-password-btn"
          >
            Forgot Password?
          </ButtonComponent>
          <ButtonComponent
            loading={isLoading}
            htmlType="submit"
            type="primary"
            className="w-full "
          >
            Login
          </ButtonComponent>
        </FormComponent>
      </div>
    </div>
  );
};

export default LoginForm;
