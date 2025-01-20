import { Form, Input, InputProps } from 'antd';
import React, { useState } from 'react';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import { PasswordRequest } from '../../../../model/Authentication/PasswordRequest';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';

const classNameStyle = '!w-1/3 !h-10 !text-base';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    specialChar: false,
    number: false,
    uppercase: false,
  });
  const { trigger, isLoading } = useFetcher('users/changepassword', 'PUT');
  const toast = useToast();

  const validatePassword = (value: string) => {
    const requirements = {
      minLength: value.length >= 6,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      number: /\d/.test(value),
      uppercase: /[A-Z]/.test(value),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every((isValid) => isValid);
  };

  const onFinish = async (values: PasswordRequest) => {
    try {
      const response = await trigger({ body: values });
      if (response.message === 'Old password incorrect') {
        toast.showError(response.message);
        return;
      }
      if (
        response.message === 'New password and confirm password do not match'
      ) {
        toast.showError(response.message);
        return;
      }
      toast.showSuccess('Change password success');
      form.resetFields();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <FormComponent form={form} onFinish={onFinish}>
      {/* Old Password Field */}
      <FormItemComponent
        name="oldPassword"
        label={<LabelForm>Old Password</LabelForm>}
        rules={[{ required: true, message: 'Old password is required!' }]}
      >
        <Input.Password className={classNameStyle} disabled={isLoading} />
      </FormItemComponent>

      {/* New Password Field */}
      <FormItemComponent
        name="newPassword"
        dependencies={['oldPassword']}
        hasFeedback
        label={<LabelForm>New Password</LabelForm>}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('oldPassword') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The new password is match with the old password')
              );
            },
          }),
          {
            validator: (_, value) => {
              if (!validatePassword(value)) {
                return Promise.reject(
                  new Error('Password does not meet all the required criteria.')
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputPassword
          showValidation
          requirements={passwordRequirements}
          onChange={(e) => validatePassword(e.target.value)}
          disabled={isLoading}
        />
      </FormItemComponent>

      {/* Confirm Password Field */}
      <FormItemComponent
        name="confirmedPassword"
        label={<LabelForm>Confirm Password</LabelForm>}
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match.')
              );
            },
          }),
        ]}
      >
        <Input.Password className={classNameStyle} disabled={isLoading} />
      </FormItemComponent>

      {/* Submit Button */}
      <ButtonComponent
        type="primary"
        htmlType="submit"
        className="!w-1/3 !text-lg !h-10 font-bold"
        loading={isLoading}
      >
        Change Password
      </ButtonComponent>
    </FormComponent>
  );
};

// InputPassword Component
interface InputPasswordProps extends InputProps {
  value?: string; // Controlled value prop from the Form
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requirements?: {
    minLength: boolean;
    specialChar: boolean;
    number: boolean;
    uppercase: boolean;
  };
  showValidation?: boolean;
}

const InputPassword: React.FC<InputPasswordProps> = ({
  value = '', // Default to an empty string if no value is provided
  onChange,
  requirements,
  showValidation = false,
  ...props
}) => {
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle both: Form `onChange` and custom password validation logic
    if (onChange) {
      onChange(e); // Propagate to the Form
    }
  };

  return (
    <>
      <Input.Password
        className={classNameStyle}
        value={value}
        onChange={handlePasswordChange}
        {...props}
      />
      {showValidation && requirements && (
        <div className="password-requirements mt-2 text-sm">
          <ul className="list-disc ml-5 text-base">
            <li
              className={`${
                requirements.minLength ? 'text-green-600' : 'text-red-500'
              }`}
            >
              At least 6 characters
            </li>
            <li
              className={`${
                requirements.specialChar ? 'text-green-600' : 'text-red-500'
              }`}
            >
              At least 1 special character
            </li>
            <li
              className={`${
                requirements.number ? 'text-green-600' : 'text-red-500'
              }`}
            >
              At least 1 number
            </li>
            <li
              className={`${
                requirements.uppercase ? 'text-green-600' : 'text-red-500'
              }`}
            >
              At least 1 uppercase letter
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
