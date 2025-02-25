import { PlusOutlined } from '@ant-design/icons';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import Title from '../../../../../../../components/UI/Title';

interface HayFieldFormListProps {
  hayTotal: number;
  hay: any;
}

const HayFieldFormList = ({ hayTotal, hay }: HayFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsHay = Form.useWatch('detailsHay', form) || [];
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsHay') || [];
    const totalQuantity = details.reduce(
      (sum: number, item: { quantity: number }) =>
        sum + (Number(item?.quantity) || 0),
      0
    );
    const min = hayTotal * 0.8;
    const max = hayTotal;
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
    <Form.List name={'detailsHay'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('hay')}</Title>
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
                    dependencies={['quantity']}
                    rules={[
                      {
                        required: true,
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
          {fields.length !== hay?.length && (
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
              const details = form.getFieldValue('detailsHay') || [];
              const totalQuantity = details.reduce(
                (acc: any, field: any) => acc + Number(field?.quantity || 0),
                0
              );
              if (totalQuantity < hayTotal * 0.8 || totalQuantity > hayTotal) {
                return (
                  <div style={{ color: 'red' }}>
                    {t('total_quantity_range', {
                      min: (hayTotal * 0.8).toFixed(2),
                      max: hayTotal.toFixed(2),
                    })}
                  </div>
                );
              }
              return (
                <div style={{ color: 'green' }}>
                  {t('total_quantity_range', {
                    min: (hayTotal * 0.8).toFixed(2),
                    max: hayTotal.toFixed(2),
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
