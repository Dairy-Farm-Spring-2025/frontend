import { PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import InputComponent from '@components/Input/InputComponent';
import Title from '@components/UI/Title';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormItemQuantity from './components/FormItemQuantity';
interface SilageFieldFormListProps {
  silageTotal: number;
  silage: any;
  disabled?: boolean;
}
const SilageFieldFormList = ({
  silage,
  silageTotal,
  disabled = false,
}: SilageFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsSilage = Form.useWatch('detailsSilage', form) || [];
  const minValidate = silageTotal * 0.9;
  const maxValidate = silageTotal * 1.1;
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsSilage') || [];
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
    <Form.List name={'detailsSilage'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('silage')} (30%)</Title>
          {fields.map(({ key, name, ...restField }, index) => {
            const currentSelected = detailsSilage[index]?.itemId;
            // Build an array of selected values from the other fields
            const selectedOthers = detailsSilage
              .filter((_: any, i: any) => i !== index)
              .map((item: any) => item?.itemId)
              .filter(Boolean);
            // Filter the hay options: always include the current selection
            // and remove options already selected in other fields.
            const filteredOptions = silage.filter((option: any) => {
              if (option.value === currentSelected) return true;
              return !selectedOthers.includes(option.value);
            });

            return (
              <div key={key} className="flex flex-col gap-2">
                <div>
                  <p className="text-base font-semibold mb-2">
                    {t('Field Feed Meal Silage')} {index + 1}
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
          {!disabled && fields.length !== silage?.length && (
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
            name="silageTotalValidation"
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
              const details = form.getFieldValue('detailsSilage') || [];
              const totalQuantity = details.reduce(
                (acc: any, field: any) => acc + Number(field?.quantity || 0),
                0
              );
              if (totalQuantity < minValidate || totalQuantity > maxValidate) {
                return (
                  <div style={{ color: 'red' }}>
                    {t('total_quantity_range', {
                      min: minValidate.toFixed(2),
                      max: maxValidate.toFixed(2),
                    })}
                  </div>
                );
              }
              return (
                <div style={{ color: 'green' }}>
                  {t('total_quantity_range', {
                    min: minValidate.toFixed(2),
                    max: maxValidate.toFixed(2),
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

export default SilageFieldFormList;
