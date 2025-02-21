import { Divider, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Title from '../../../../../../../components/UI/Title';
import TagComponents from '../../../../../../../components/UI/TagComponents';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import { useTranslation } from 'react-i18next';
interface MineralFieldFormListProps {
  mineralTotal: number;
  minerals: any;
  handleValidatorQuantity: any;
}
const MineralFieldFormList = ({
  handleValidatorQuantity,
  minerals,
  mineralTotal,
}: MineralFieldFormListProps) => {
  const { t } = useTranslation();
  return (
    <Form.List name={'detailsMineral'}>
      {(fields, { add, remove }) => (
        <>
          <Title className="text-xl no-underline">{t('minerals')}</Title>
          <div className="flex gap-2 my-3">
            <p className="font-semibold text-lg">{t('Total')}:</p>
            <TagComponents color="magenta" className="text-lg">
              <span className="font-bold">
                {(mineralTotal * 0.8).toFixed(2)} ~ {mineralTotal}
              </span>{' '}
              (kilogram)
            </TagComponents>
          </div>
          {fields.map(({ key, name, ...restField }, index) => (
            <div key={key} className="flex flex-col gap-2">
              <div>
                <p className="text-base font-semibold mb-2">
                  {t('Field Feed Meal Mineral')} {index + 1}
                </p>
                <FormItemComponent
                  {...restField}
                  name={[name, 'itemId'] as any}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <SelectComponent options={minerals} search={true} />
                </FormItemComponent>
                <FormItemComponent
                  {...restField}
                  name={[name, 'quantity'] as any}
                  rules={[
                    {
                      required: true,
                    },
                    {
                      validator: async () =>
                        handleValidatorQuantity('detailsMineral', mineralTotal),
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
          {fields.length !== minerals?.length && (
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

export default MineralFieldFormList;
