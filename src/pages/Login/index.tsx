import { Button, Divider, Form, Input, Popover } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import ButtonComponent from "../../components/Button/ButtonComponent";
import toast from "react-hot-toast";
import LabelForm from "../../components/LabelForm/LabelForm";
import backgroundImage from "../../assets/background.webp";

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [messageError, setMessageError] = useState<string>("");

    const [form] = Form.useForm();

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        form.resetFields();
    };

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-300 to-purple-300">
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >

            <div className="w-[450px] p-10 bg-white shadow-2xl rounded-lg border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-darkGreen">Welcome Back</h2>

                </div>
                <Divider className="my-5" />
                <div className="w-full">
                    <Form
                        form={form}
                        labelCol={{ span: 24 }}
                        className="flex flex-col gap-4"
                    >
                        <Form.Item
                            label={
                                <span className="text-lg font-semibold">
                                    Username
                                </span>
                            }
                            name="username"
                            rules={[{ required: true, message: "Please enter your username" }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-500" />}
                                placeholder="Username"
                                className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-lg font-semibold">
                                    Password
                                </span>
                            }
                            name="password"
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-500" />}
                                placeholder="Password"
                                className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </Form.Item>

                        {messageError && (
                            <p className="text-red-500 text-sm">{messageError}</p>
                        )}

                        <Popover
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
                            <ButtonComponent

                                className="text-blue-500 hover:text-blue-700 forgot-password-btn"

                            >
                                Forgot Password?
                            </ButtonComponent>
                        </Popover>

                        <Form.Item>
                            <ButtonComponent
                                loading={loading}
                                htmlType="submit"
                                type="primary"
                                className="w-full "
                            >
                                Login
                            </ButtonComponent>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
