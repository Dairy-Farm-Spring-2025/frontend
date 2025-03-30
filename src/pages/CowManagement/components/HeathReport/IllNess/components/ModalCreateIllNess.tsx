import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DatePicker, Form, Select, Row, Col, Divider } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import { useTranslation } from 'react-i18next';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { Item } from '@model/Warehouse/items';
import { healthSeverity } from '@service/data/health';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { COW_PATH } from '@service/api/Cow/cowApi';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import Title from '@components/UI/Title';
import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { formatAreaType } from '@utils/format';
import InputComponent from '@components/Input/InputComponent';
import { injectionSiteOptions as getInjectionSiteOptions } from '@service/data/vaccine';
import { useWatch } from 'antd/es/form/Form';
import ButtonComponent from '@components/Button/ButtonComponent';

interface ModalCreateIllNessProps {
  modal: any;
  mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
  const { t } = useTranslation();
  const { data: dataCows, isLoading: isLoadingCows } = useFetcher<Cow[]>(COW_PATH.COWS, 'GET');
  const { data: itemData, isLoading: isLoadingItems } = useFetcher<Item[]>('items', 'GET');

  const injectionSiteOptions = useMemo(() => {
    const options = getInjectionSiteOptions();
    return options.map((option) => ({
      ...option,
      label: t(option.label),
    }));
  }, [t]);

  const useIllnessForm = (modal: any, mutate: any) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger: triggerIllness, isLoading: isLoadingIllness } = useFetcher(
      HEALTH_RECORD_PATH.CREATE_ILLNESS,
      'POST'
    );
    const [isCowSelected, setIsCowSelected] = useState(false);
    const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

    const severity = useWatch('severity', form);

    // Tự động thêm một nhóm trường khi severity thay đổi và khác 'none'
    useEffect(() => {
      if (severity && severity !== 'none') {
        const currentDetails = form.getFieldValue('treatmentDetails') || [];
        if (currentDetails.length === 0) {
          form.setFieldsValue({
            treatmentDetails: [
              {
                itemId: undefined,
                dosage: undefined,
                injectionSite: undefined,
                treatmentDate: undefined,
                treatmentPlan: undefined,
              },
            ],
          });
        }
      } else {
        form.setFieldsValue({ treatmentDetails: [] });
      }
    }, [severity, form]);

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();

        const detail = values.severity && values.severity !== 'none'
          ? (values.treatmentDetails || []).map((detail: any) => ({
            dosage: Number(detail.dosage),
            injectionSite: detail.injectionSite,
            date: detail.treatmentDate ? dayjs(detail.treatmentDate).format('YYYY-MM-DD') : undefined,
            description: detail.treatmentPlan,
            vaccineId: Number(detail.itemId),
          }))
          : [];

        const payload = {
          cowId: Number(values.cowId),
          symptoms: values.symptoms,
          severity: values.severity,
          prognosis: values.prognosis,
          detail: detail,
        };

        const response = await triggerIllness({ body: payload });
        toast.showSuccess(response.message || t('Illness record created successfully'));
        mutate();
        handleCancel();
      } catch (error: any) {
        toast.showError(error.message || t('Failed to create illness record'));
      }
    };

    const handleCancel = () => {
      form.resetFields();
      setIsCowSelected(false);
      setSelectedCow(null);
      modal.closeModal();
    };

    const handleCowChange = (value: string) => {
      const cow = dataCows?.find((c: Cow) => c.cowId === value);
      setIsCowSelected(!!value);
      setSelectedCow(cow || null);
    };

    return {
      form,
      isLoading: isLoadingIllness,
      handleSubmit,
      handleCancel,
      handleCowChange,
      isCowSelected,
      selectedCow,
      severity,
    };
  };

  const {
    form,
    isLoading,
    handleSubmit,
    handleCancel,
    handleCowChange,
    isCowSelected,
    selectedCow,
    severity,
  } = useIllnessForm(modal, mutate);

  const cowOptions = useMemo(
    () => dataCows?.map((cow: Cow) => ({ value: cow.cowId, label: cow.name })) || [],
    [dataCows]
  );

  const itemOptions = useMemo(
    () =>
      itemData?.map((element: Item) => ({
        label: element.name,
        value: element.itemId,
        searchLabel: element.name,
      })) || [],
    [itemData]
  );

  return (
    <ModalComponent
      title={t('Create Illness Record')}
      open={modal.open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={1000}
      confirmLoading={isLoading}
      className="rounded-lg"
    >
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
                <LabelForm>{t('Date of Birth')}</LabelForm>
                <div>
                  {selectedCow.dateOfBirth ? dayjs(selectedCow.dateOfBirth).format('DD/MM/YYYY') : t('No data')}
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
              <div className="mb-6">
                <Title className="!text-2xl w-1/2 mb-5">{t('Illness Informations')}</Title>
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
                        options={healthSeverity().filter(option => option.value !== 'none')}
                        className="w-full"
                      />
                    </FormItemComponent>
                  </Col>

                  {severity && severity !== 'none' && (
                    <Col span={24}>
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
                                          label={<LabelForm>{t('Dosage')}</LabelForm>}
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
                                          label={<LabelForm>{t('Description')}</LabelForm>}
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
                              <ButtonComponent
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                {t('Add more field')}
                              </ButtonComponent>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Col>
                  )}
                </Row>
              </div>
            </>
          )}
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalCreateIllNess;