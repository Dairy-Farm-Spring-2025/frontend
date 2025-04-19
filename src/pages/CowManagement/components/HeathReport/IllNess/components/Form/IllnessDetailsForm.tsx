import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { Col, Divider, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface IllnessDetailsFormProps {
  form: any;
  itemOptions: any[];
  injectionSiteOptions: any[];
  isLoadingItems: boolean;
  hasAddedDefaultField: React.MutableRefObject<boolean>;
}

const IllnessDetailsForm = ({
  form,
  itemOptions,
  injectionSiteOptions,
  isLoadingItems,
}: IllnessDetailsFormProps) => {
  const { t } = useTranslation();

  return (
    <FormComponent form={form} layout="vertical">
      <Form.List name="treatmentDetails">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key}>
                <Title className="mb-2">
                  {t('Treatment plan')} {index + 1}
                </Title>
                <Row gutter={[16, 16]} className="flex items-center">
                  <Col span={22}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'itemId']}
                          label={<LabelForm>{t('Item')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <SelectComponent
                            options={itemOptions}
                            showSearch
                            optionFilterProp="label"
                            disabled={isLoadingItems}
                            loading={isLoadingItems}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'dosage']}
                          label={<LabelForm>{t('Dosage (ml)')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                            },
                            {
                              type: 'number',
                              min: 0,
                              message: t('Dosage must be non-negative'),
                            },
                          ]}
                        >
                          <InputComponent.Number />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'injectionSite']}
                          label={<LabelForm>{t('Injection Site')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <SelectComponent options={injectionSiteOptions} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'treatmentDate']}
                          label={<LabelForm>{t('Treatment Date')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                              message: t('Treatment Date is required'),
                            },
                            {
                              validator: (_, value) => {
                                const currentFieldIndex = index;
                                const allValues =
                                  form.getFieldValue('treatmentDetails');

                                if (!value) return Promise.resolve();
                                // Rule 2: Each treatment date must be greater than the previous one
                                if (currentFieldIndex > 0) {
                                  const prevDate =
                                    allValues[currentFieldIndex - 1]
                                      ?.treatmentDate;
                                  if (
                                    (prevDate &&
                                      dayjs(value).isSame(
                                        dayjs(prevDate),
                                        'day'
                                      )) ||
                                    dayjs(value).isBefore(
                                      dayjs(prevDate),
                                      'day'
                                    )
                                  ) {
                                    return Promise.reject(
                                      t(
                                        'Each treatment date must be greater than the previous one'
                                      )
                                    );
                                  }
                                }

                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <DatePickerComponent
                            className="w-full"
                            disabledDate={(current) => {
                              return (
                                current &&
                                current.isBefore(dayjs().startOf('day'))
                              );
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'treatmentPlan']}
                          label={<LabelForm>{t('Treatment Plan')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <ReactQuillComponent />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={2} className="flex justify-center">
                    {index > 0 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="!text-3xl text-red-500"
                      />
                    )}
                  </Col>
                </Row>
                {index < fields.length - 1 && (
                  <Divider className="border-gray-400" />
                )}
              </div>
            ))}
            <Form.Item>
              <ButtonComponent
                type="primary"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                buttonType="secondary"
              >
                {t('Add more field')}
              </ButtonComponent>
            </Form.Item>
          </>
        )}
      </Form.List>
    </FormComponent>
  );
};

export default IllnessDetailsForm;
