import ButtonComponent from '@components/Button/ButtonComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import Title from '@components/UI/Title';
import { Cow } from '@model/Cow/Cow';
import { SEVERITY_OPTIONS } from '@service/data/severity';
import { formatAreaType, formatDateHour } from '@utils/format';
import { Col, Divider, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface IllnessInformationFormProps {
  form: any;
  cowOptions: any[];
  isCowSelected: boolean;
  selectedCow: Cow | null;
  handleCowChange: (value: number) => void;
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
  const navigate = useNavigate();
  return (
    <FormComponent form={form} layout="vertical">
      <div className="p-6">
        <Title className="!text-2xl w-1/2 mb-5">{t('Cow Information')}</Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FormItemComponent
              name="cowId"
              label={<LabelForm>{t('Select Cow')}</LabelForm>}
              rules={[{ required: true }]}
            >
              <Select
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
          <DescriptionComponent
            layout="horizontal"
            bordered
            items={[
              {
                label: t('Cow Status'),
                children:
                  t(formatAreaType(selectedCow.cowStatus)) || t('No data'),
                span: 2,
              },
              {
                label: t('Date Of Birth'),
                children: selectedCow.dateOfBirth
                  ? formatDateHour(selectedCow.dateOfBirth)
                  : t('No data'),
                span: 2,
              },
              {
                label: t('Cow Origin'),
                children:
                  t(formatAreaType(selectedCow.cowOrigin)) || t('No data'),
                span: 2,
              },
              {
                label: t('Gender'),
                children: t(formatAreaType(selectedCow.gender)) || t('No data'),
                span: 2,
              },
            ]}
          />
        )}
        {isCowSelected && selectedCow && selectedCow.inPen && (
          <>
            <Title className="!text-2xl w-1/2 mb-5 mt-6">
              {t('Illness Information')}
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormItemComponent
                  name="symptoms"
                  label={<LabelForm>{t('Symptoms')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <ReactQuillComponent />
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="prognosis"
                  label={<LabelForm>{t('Prognosis')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <ReactQuillComponent />
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="severity"
                  label={<LabelForm>{t('Severity')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <Select options={SEVERITY_OPTIONS()} className="w-full" />
                </FormItemComponent>
              </Col>
            </Row>
          </>
        )}
        {isCowSelected && selectedCow && !selectedCow?.inPen && (
          <>
            <Divider className="!my-3" />
            <div className="mt-5 flex flex-col gap-5">
              <p className="text-lg text-red-600">
                {t(
                  `Cow {{cow}} is not in pen. Please navigate to detail and move cow to pen first`,
                  {
                    cow: selectedCow?.name,
                  }
                )}
              </p>
              <ButtonComponent
                onClick={() => navigate(`../../${selectedCow?.cowId}`)}
              >
                {t('Move to cow detail')}
              </ButtonComponent>
            </div>
          </>
        )}
      </div>
    </FormComponent>
  );
};

export default IllnessInformationForm;
