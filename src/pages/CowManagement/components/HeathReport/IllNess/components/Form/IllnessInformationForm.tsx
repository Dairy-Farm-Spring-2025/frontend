import { Row, Col, Select } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import Title from '@components/UI/Title';
import { Cow } from '@model/Cow/Cow';
import { healthSeverity } from '@service/data/health';
import { useTranslation } from 'react-i18next';
import { formatAreaType, formatDateHour } from '@utils/format';


interface IllnessInformationFormProps {
    form: any;
    cowOptions: any[];
    isCowSelected: boolean;
    selectedCow: Cow | null;
    handleCowChange: (value: string) => void;
    isLoadingCows: boolean;
}

const IllnessInformationForm = ({
    form,
    cowOptions,
    isCowSelected,
    selectedCow,
    handleCowChange,
    isLoadingCows,
}: IllnessInformationFormProps) => {
    const { t } = useTranslation();

    return (
        <FormComponent form={form} layout="vertical">
            <div className="p-6">
                <Title className="!text-2xl w-1/2 mb-5">{t('Cow Information')}</Title>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <FormItemComponent
                            name="cowId"
                            label={<LabelForm>{t('Select Cow')}</LabelForm>}
                            rules={[{ required: true, message: t('Please select a cow') }]}
                        >
                            <Select
                                placeholder={t('Select a cow')}
                                options={cowOptions}
                                showSearch
                                optionFilterProp="label"
                                onChange={handleCowChange}
                                disabled={isLoadingCows}
                                loading={isLoadingCows}
                            />
                        </FormItemComponent>
                    </Col>
                </Row>

                {isCowSelected && selectedCow && (
                    <Row gutter={[16, 16]} className="mt-4">
                        <Col span={12}>
                            <LabelForm>{t('Cow Status')}</LabelForm>
                            <div>{formatAreaType(selectedCow.cowStatus) || t('No data')}</div>
                        </Col>
                        <Col span={12}>
                            <LabelForm>{t('Date Of Birth')}</LabelForm>
                            <div>
                                {selectedCow.dateOfBirth ? formatDateHour(selectedCow.dateOfBirth) : t('No data')}
                            </div>
                        </Col>
                        <Col span={12}>
                            <LabelForm>{t('Cow Origin')}</LabelForm>
                            <div>{formatAreaType(selectedCow.cowOrigin) || t('No data')}</div>
                        </Col>
                        <Col span={12}>
                            <LabelForm>{t('Gender')}</LabelForm>
                            <div>{formatAreaType(selectedCow.gender) || t('No data')}</div>
                        </Col>
                    </Row>
                )}

                {isCowSelected && (
                    <>
                        <Title className="!text-2xl w-1/2 mb-5 mt-6">{t('Illness Information')}</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <FormItemComponent
                                    name="symptoms"
                                    label={<LabelForm>{t('Symptoms')}</LabelForm>}
                                    rules={[{ required: true, message: t('Please enter symptoms') }]}
                                >
                                    <ReactQuillComponent placeholder={t('Describe the symptoms here...')} />
                                </FormItemComponent>
                            </Col>
                            <Col span={24}>
                                <FormItemComponent
                                    name="prognosis"
                                    label={<LabelForm>{t('Prognosis')}</LabelForm>}
                                    rules={[{ required: true, message: t('Please enter prognosis') }]}
                                >
                                    <ReactQuillComponent placeholder={t('Describe the prognosis here...')} />
                                </FormItemComponent>
                            </Col>
                            <Col span={24}>
                                <FormItemComponent
                                    name="severity"
                                    label={<LabelForm>{t('Severity')}</LabelForm>}
                                    rules={[{ required: true, message: t('Please select severity') }]}
                                >
                                    <Select
                                        placeholder={t('Select severity level')}
                                        options={healthSeverity().filter((option) => option.value !== 'none')}
                                        className="w-full"
                                    />
                                </FormItemComponent>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </FormComponent>
    );
};

export default IllnessInformationForm;