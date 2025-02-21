import { Divider, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Title from '../../../../../../../components/UI/Title';
import TagComponents from '../../../../../../../components/UI/TagComponents';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import { useTranslation } from 'react-i18next';
interface SilageFieldFormListProps {
  silageTotal: number;
  silage: any;
  handleValidatorQuantity: any;
}
const SilageFieldFormList = ({
  handleValidatorQuantity,
  silage,
  silageTotal,
}: SilageFieldFormListProps) => {
  const { t } = useTranslation();
  return (
    <Form.List name={'detailsSilage'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('silage')}</Title>
          <div className="flex gap-2 my-3">
            <p className="font-semibold text-lg">{t('Total')}:</p>
            <TagComponents color="magenta" className="text-lg">
              <span className="font-bold">
                {(silageTotal * 0.8).toFixed(2)} ~ {silageTotal}
              </span>{' '}
            </TagComponents>
          </div>
          {fields.map(({ key, name, ...restField }, index) => (
            <div key={key} className="flex flex-col gap-2">
              <div>
                <p className="text-base font-semibold mb-2">
                  {t('Field Feed Meal Silage')} {index + 1}
                </p>
                <FormItemComponent
                  {...restField}
                  name={[name, 'itemId'] as any}
                  rules={[
                    {
                      required: true,
                      message: t('Please select a hay type'),
                    },
                  ]}
                >
                  <SelectComponent options={silage} search={true} />
                </FormItemComponent>
                <FormItemComponent
                  {...restField}
                  name={[name, 'quantity'] as any}
                  rules={[
                    {
                      required: true,
                      message: t('Please enter the quantity'),
                    },
                    {
                      validator: async () =>
                        handleValidatorQuantity('detailsSilage', silageTotal),
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
          ))}
          {fields.length !== silage?.length && (
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
        </>
      )}
    </Form.List>
  );
};

export default SilageFieldFormList;
