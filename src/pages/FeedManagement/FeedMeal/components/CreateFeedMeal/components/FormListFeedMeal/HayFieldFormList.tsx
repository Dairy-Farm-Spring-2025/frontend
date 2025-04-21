import { PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import InputComponent from '@components/Input/InputComponent';
import Title from '@components/UI/Title';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormItemQuantity from './components/FormItemQuantity';

interface HayFieldFormListProps {
  hayTotal: number;
  hay: any;
  disabled?: boolean;
}

const HayFieldFormList = ({
  hayTotal,
  hay,
  disabled = false,
}: HayFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsHay = Form.useWatch('detailsHay', form) || [];
  const minValidate = Number((hayTotal * 0.9).toFixed(2));
  const maxValidate = Number((hayTotal * 1.1).toFixed(2));
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsHay') || [];
    const totalQuantity = details.reduce(
      (sum: number, item: { quantity: number }) =>
        sum + (Number(item?.quantity) || 0),
      0
    );
    if (totalQuantity < minValidate || totalQuantity > maxValidate) {
      return Promise.reject(
        new Error(
          t('total_quantity_range', {
            min: minValidate,
            max: maxValidate,
          })
        )
      );
    }
    return Promise.resolve();
  };
  return (
    <Form.List name={'detailsHay'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('hay')} (35%)</Title>
          {fields.map(({ key, name, ...restField }, index) => {
            const currentSelected = detailsHay[index]?.itemId;
            const selectedOthers = detailsHay
              .filter((_: any, i: number) => i !== index)
              .map((item: any) => item?.itemId)
              .filter(Boolean);
            const filteredOptions = hay.filter((option: any) => {
              if (option.value === currentSelected) return true;
              return !selectedOthers.includes(option.value);
            });

            return (
              <div key={key} className="flex flex-col gap-2">
                <div>
                  <p className="text-base font-semibold mb-2">
                    {t('Field Feed Meal Hay')} {index + 1}
                  </p>
                  <FormItemQuantity
                    restField={restField}
                    options={filteredOptions}
                    remove={remove}
                    index={index}
                    name={name}
                    disabledButton={disabled}
                  />
                </div>
                <Divider className="!my-1" />
              </div>
            );
          })}
          {!disabled && fields.length !== hay?.length && (
            <Form.Item>
              <ButtonComponent
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {t('Add more field')}
              </ButtonComponent>
            </Form.Item>
          )}
          <Form.Item
            name="hayTotalValidation"
            noStyle
            rules={[
              {
                validator: handleValidation,
              },
            ]}
          >
            <InputComponent style={{ display: 'none' }} />
          </Form.Item>

          <div style={{ marginBottom: 16, fontSize: 16 }}>
            {(() => {
              const totalQuantity = detailsHay.reduce(
                (acc: any, field: any) => acc + Number(field?.quantity || 0),
                0
              );
              if (totalQuantity < minValidate || totalQuantity > maxValidate) {
                return (
                  <div style={{ color: 'red' }}>
                    {t('total_quantity_range', {
                      min: minValidate,
                      max: maxValidate,
                    })}
                  </div>
                );
              }
              return (
                <div style={{ color: 'green' }}>
                  {t('total_quantity_range', {
                    min: minValidate,
                    max: maxValidate,
                  })}
                </div>
              );
            })()}
          </div>
        </>
      )}
    </Form.List>
  );
};

export default HayFieldFormList;
