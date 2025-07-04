import { PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import InputComponent from '@components/Input/InputComponent';
import Title from '@components/UI/Title';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormItemQuantity from './components/FormItemQuantity';
interface RefinedFieldFormListProps {
  refinedTotal: number;
  refinedFood: any;
  disabled?: boolean;
}
const RefinedFieldFormList = ({
  refinedFood,
  refinedTotal,
  disabled = false,
}: RefinedFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsRefined = Form.useWatch('detailsRefined', form) || [];
  const minValidate = Number((refinedTotal * 0.9).toFixed(2));
  const maxValidate = Number((refinedTotal * 1.1).toFixed(2));
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsRefined') || [];
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
    <Form.List name={'detailsRefined'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('refined')} (25%)</Title>
          {fields.map(({ key, name, ...restField }, index) => {
            const currentSelected = detailsRefined[index]?.itemId;
            // Build an array of selected values from the other fields
            const selectedOthers = detailsRefined
              .filter((_: any, i: any) => i !== index)
              .map((item: any) => item?.itemId)
              .filter(Boolean);
            // Filter the hay options: always include the current selection
            // and remove options already selected in other fields.
            const filteredOptions = refinedFood.filter((option: any) => {
              if (option.value === currentSelected) return true;
              return !selectedOthers.includes(option.value);
            });

            return (
              <div key={key} className="flex flex-col gap-2">
                <div>
                  <p className="text-base font-semibold mb-2">
                    {t('Field Feed Meal Refined')} {index + 1}
                  </p>
                  <FormItemQuantity
                    index={index}
                    name={name}
                    options={filteredOptions}
                    remove={remove}
                    restField={restField}
                    disabledButton={disabled}
                  />
                </div>
                <Divider className="!my-1" />
              </div>
            );
          })}
          {!disabled && fields.length !== refinedFood?.length && (
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
            name="refinedTotalValidation"
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
              const totalQuantity = detailsRefined.reduce(
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

export default RefinedFieldFormList;
