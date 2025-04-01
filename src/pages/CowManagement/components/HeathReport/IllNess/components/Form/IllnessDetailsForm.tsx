import { Row, Col, Form, Divider, Select, DatePicker } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import Title from '@components/UI/Title';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import InputComponent from '@components/Input/InputComponent';
import ButtonComponent from '@components/Button/ButtonComponent';
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
    hasAddedDefaultField,
}: IllnessDetailsFormProps) => {
    const { t } = useTranslation();

    return (
        <FormComponent form={form} layout="vertical">
            <div className="p-6">
                <Title className="!text-2xl w-1/2 mb-5">{t('Illness Details')}</Title>
                <Form.List name="treatmentDetails">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <div key={key}>
                                    <Row gutter={[16, 16]} className="flex items-center">
                                        <Col span={22}>
                                            <Row gutter={[16, 16]}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'itemId']}
                                                        label={<LabelForm>{t('Item')}</LabelForm>}
                                                        rules={[{ required: true, message: t('Please select an item') }]}
                                                    >
                                                        <Select
                                                            placeholder={t('Select an item')}
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
                                                            { required: true, message: t('Please enter dosage') },
                                                            { type: 'number', min: 0, message: t('Dosage must be non-negative') },
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
                                                        rules={[{ required: true, message: t('Please select an injection site') }]}
                                                    >
                                                        <Select placeholder={t('Select an injection site')} options={injectionSiteOptions} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'treatmentDate']}
                                                        label={<LabelForm>{t('Treatment Date')}</LabelForm>}
                                                        rules={[{ required: true, message: t('Please select treatment date') }]}
                                                    >
                                                        <DatePicker className="w-full" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'treatmentPlan']}
                                                        label={<LabelForm>{t('Treatment Plan')}</LabelForm>}
                                                        rules={[{ required: true, message: t('Please enter treatment plan') }]}
                                                    >
                                                        <ReactQuillComponent placeholder={t('Describe the treatment plan here...')} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={2} className="flex justify-center">
                                            {index > 0 && (
                                                <MinusCircleOutlined
                                                    onClick={() => remove(name)}
                                                    className="!text-xl text-red-500"
                                                />
                                            )}
                                        </Col>
                                    </Row>
                                    {index < fields.length - 1 && <Divider />}
                                </div>
                            ))}
                            <Form.Item>
                                <ButtonComponent type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    {t('Add more field')}
                                </ButtonComponent>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </div>
        </FormComponent>
    );
};

export default IllnessDetailsForm;