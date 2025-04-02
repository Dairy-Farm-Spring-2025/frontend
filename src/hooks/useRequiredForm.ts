import { useEffect, useState } from 'react';
import { Form, FormInstance } from 'antd';

const useRequiredForm = (form: FormInstance, requiredFields: string[]) => {
  const values = Form.useWatch([], form); // Watch all form fields
  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    if (!values) return;

    const isButtonDisabled = requiredFields.some((field) => {
      const value = values[field];
      return value === undefined || value === null || value === '';
    });

    setDisabledButton(isButtonDisabled);
  }, [values, requiredFields]); // Depend on `values` for reactivity

  return disabledButton;
};

export default useRequiredForm;
