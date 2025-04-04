import { PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import InputComponent from '@components/Input/InputComponent';
import Title from '@components/UI/Title';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormItemQuantity from './components/FormItemQuantity';
interface MineralFieldFormListProps {
  mineralTotal: number;
  minerals: any;
  disabled?: boolean;
}
const MineralFieldFormList = ({
  minerals,
  mineralTotal,
  disabled = false,
}: MineralFieldFormListProps) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const detailsMineral = Form.useWatch('detailsMineral', form) || [];
  const minValidate = mineralTotal * 0.9;
  const maxValidate = mineralTotal * 1.1;
  const handleValidation = async () => {
    const details = form.getFieldValue('detailsMineral') || [];
    const totalQuantity = details.reduce(
      (sum: number, item: { quantity: number }) =>
        sum + (Number(item?.quantity) || 0),
      0
    );
    if (totalQuantity < minValidate || totalQuantity > maxValidate) {
      return Promise.reject(
        new Error(
          t('total_quantity_range', {
            min: minValidate.toFixed(2),
            max: maxValidate.toFixed(2),
          })
        )
      );
    }
    return Promise.resolve();
  };
  return (
    <Form.List name={'detailsMineral'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('minerals')} (10%)</Title>
          {fields.map(({ key, name, ...restField }, index) => {
            const currentSelected = detailsMineral[index]?.itemId;
            // Build an array of selected values from the other fields
            const selectedOthers = detailsMineral
              .filter((_: any, i: any) => i !== index)
              .map((item: any) => item?.itemId)
              .filter(Boolean);
            // Filter the hay options: always include the current selection
            // and remove options already selected in other fields.
            const filteredOptions = minerals.filter((option: any) => {
              if (option.value === currentSelected) return true;
              return !selectedOthers.includes(option.value);
            });

            return (
              <div key={key} className="flex flex-col gap-2">
                <div>
                  <p className="text-base font-semibold mb-2">
                    {t('Field Feed Meal Mineral')} {index + 1}
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
          {!disabled && fields.length !== minerals?.length && (
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
            name="mineralTotalValidation"
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
              const details = form.getFieldValue('detailsMineral') || [];
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

export default MineralFieldFormList;
