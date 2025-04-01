import { DeleteOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import SelectComponent from '@components/Select/SelectComponent';
import { t } from 'i18next';
interface FormItemQuantityProps {
  restField: any;
  options: any;
  index: number;
  remove: any;
  name: any;
  disabledButton?: boolean;
}
const FormItemQuantity = ({
  restField,
  options,
  index,
  remove,
  name,
  disabledButton = false,
}: FormItemQuantityProps) => {
  return (
    <div className="flex gap-2 !h-fit">
      <FormItemComponent
        {...restField}
        name={[name, 'itemId'] as any}
        rules={[
          {
            required: true,
            message: t('Please select a item type'),
          },
        ]}
        className="!w-[60%]"
      >
        <SelectComponent
          options={options}
          search={true}
          disabled={disabledButton}
        />
      </FormItemComponent>
      <FormItemComponent
        {...restField}
        name={[name, 'quantity'] as any}
        dependencies={['quantity']}
        rules={[
          {
            required: true,
          },
        ]}
        className="!w-[30%]"
      >
        <InputComponent.Number decimal={true} disabled={disabledButton} />
      </FormItemComponent>
      {!disabledButton && (
        <div className="flex justify-start !w-[10%]">
          {index > 0 && (
            <ButtonComponent
              danger
              onClick={() => {
                remove(name);
              }}
              icon={<DeleteOutlined />}
              shape="circle"
              type="primary"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FormItemQuantity;
