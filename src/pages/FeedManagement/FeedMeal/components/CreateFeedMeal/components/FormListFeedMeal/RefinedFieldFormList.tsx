import { PlusOutlined } from '@ant-design/icons';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
interface RefinedFieldFormListProps {
  refinedTotal: number;
  refinedFood: any;
}
const RefinedFieldFormList = ({
  refinedFood,
  refinedTotal,
}: RefinedFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsRefined = Form.useWatch('detailsRefined', form) || [];
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsRefined') || [];
    const totalQuantity = details.reduce(
      (sum: number, item: { quantity: number }) =>
        sum + (Number(item?.quantity) || 0),
      0
    );
    const min = refinedTotal * 0.8;
    const max = refinedTotal;
    if (totalQuantity < min || totalQuantity > max) {
      return Promise.reject(
        new Error(
          t('total_quantity_range', {
            min: min.toFixed(2),
            max: max.toFixed(2),
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
          <Title className="text-xl no-underline">{t('refined')}</Title>
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
                  <FormItemComponent
                    {...restField}
                    name={[name, 'itemId'] as any}
                    rules={[
                      {
                        required: true,
                        message: t('Please select a item type'),
                      },
                    ]}
                  >
                    <SelectComponent options={filteredOptions} search={true} />
                  </FormItemComponent>
                  <FormItemComponent
                    {...restField}
                    name={[name, 'quantity'] as any}
                    rules={[
                      {
                        required: true,
                        message: t('Please enter the quantity'),
                      },
                    ]}
                  >
                    <InputComponent.Number decimal={true} />
                  </FormItemComponent>
                  {index > 0 && (
                    <div className="flex justify-start">
                      <ButtonComponent
                        danger
                        onClick={() => {
                          remove(name);
                        }}
                      >
                        {t('Remove field')}
                      </ButtonComponent>
                    </div>
                  )}
                </div>
                <Divider className="!my-1" />
              </div>
            );
          })}
          {fields.length !== refinedFood?.length && (
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
              const details = form.getFieldValue('detailsRefined') || [];
              const totalQuantity = details.reduce(
                (acc: any, field: any) => acc + Number(field?.quantity || 0),
                0
              );
              if (
                totalQuantity < refinedTotal * 0.8 ||
                totalQuantity > refinedTotal
              ) {
                return (
                  <div style={{ color: 'red' }}>
                    {t('total_quantity_range', {
                      min: (refinedTotal * 0.8).toFixed(2),
                      max: refinedTotal.toFixed(2),
                    })}
                  </div>
                );
              }
              return (
                <div style={{ color: 'green' }}>
                  {t('total_quantity_range', {
                    min: (refinedTotal * 0.8).toFixed(2),
                    max: refinedTotal.toFixed(2),
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
