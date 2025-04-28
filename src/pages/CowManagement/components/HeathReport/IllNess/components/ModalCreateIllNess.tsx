import { useState, useMemo, useEffect, useRef } from 'react';
import { Form, UploadFile } from 'antd';
import ModalComponent from '@components/Modal/ModalComponent';
import { useTranslation } from 'react-i18next';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { Item } from '@model/Warehouse/items';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { COW_PATH } from '@service/api/Cow/cowApi';
import StepsComponent, { StepItem } from '@components/Steps/StepsComponent';

import { injectionSiteOptions as getInjectionSiteOptions } from '@service/data/vaccine';
import dayjs from 'dayjs';
import IllnessInformationForm from './Form/IllnessInformationForm';
import IllnessDetailsForm from './Form/IllnessDetailsForm';
import ReviewInformation from './Form/ReviewInformation';

interface ModalCreateIllNessProps {
  modal: any;
  mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
  const [file, setFile] = useState<UploadFile[]>([]);
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [illnessForm] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const { data: dataCows, isLoading: isLoadingCows } = useFetcher<Cow[]>(
    COW_PATH.COWS,
    'GET'
  );
  const { data: itemData, isLoading: isLoadingItems } = useFetcher<Item[]>(
    'items',
    'GET'
  );
  const { trigger: triggerIllness, isLoading: isLoadingIllness } = useFetcher(
    HEALTH_RECORD_PATH.CREATE_ILLNESS,
    'POST',
    'multipart/form-data'
  );
  const toast = useToast();

  const [apiBody, setApiBody] = useState<any>(null);
  const [isCowSelected, setIsCowSelected] = useState(false);
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [treatmentDetails, setTreatmentDetails] = useState<any[]>([]);
  const hasAddedDefaultField = useRef(false);

  const injectionSiteOptions = useMemo(
    () =>
      getInjectionSiteOptions().map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );
  const cowOptions = useMemo(
    () =>
      dataCows?.map((cow: Cow) => ({ value: cow.cowId, label: cow.name })) ||
      [],
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

  useEffect(() => {
  }, [treatmentDetails]);

  useEffect(() => {
    if (
      current === 1 &&
      treatmentDetails.length === 0 &&
      !hasAddedDefaultField.current
    ) {
      hasAddedDefaultField.current = true;
      detailsForm.setFieldsValue({ treatmentDetails: [{}] });
    }
  }, [current, treatmentDetails, detailsForm]);

  useEffect(() => {
    if (!modal.open) {
      setCurrent(0);
      illnessForm.resetFields();
      detailsForm.resetFields();
      setApiBody(null);
      setIsCowSelected(false);
      setSelectedCow(null);
      setTreatmentDetails([]);
      hasAddedDefaultField.current = false;
    }
  }, [modal.open, illnessForm, detailsForm]);

  const handleCowChange = (value: number) => {
    const cow = dataCows?.find((c: Cow) => c.cowId === value);
    setIsCowSelected(!!value);
    setSelectedCow(cow || null);
  };

  const handleNextIllness = async () => {
    try {
      const illnessValues = await illnessForm.validateFields();
      setApiBody((prevState: any) => ({ ...prevState, ...illnessValues }));
    } catch (error) {
      throw error;
    }
  };

  const handleNextDetails = async () => {
    try {
      detailsForm.submit();
      const detailValues = detailsForm.getFieldsValue();
      const treatments = detailValues.treatmentDetails || [];
      const validTreatments = treatments.filter((treatment: any) =>
        Object.values(treatment).some((value) => value !== undefined)
      );
      setTreatmentDetails(validTreatments);
      await detailsForm.validateFields();
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const detail = (treatmentDetails || []).map((detail: any) => ({
        dosage: Number(detail.dosage),
        injectionSite: detail.injectionSite,
        date: detail.treatmentDate
          ? dayjs(detail.treatmentDate).format('YYYY-MM-DD')
          : undefined,
        description: detail.treatmentPlan,
        vaccineId: Number(detail.itemId),
      }));

      const formData = new FormData();

      // Thêm dữ liệu từ illnessForm vào FormData
      formData.append('cowId', apiBody.cowId);
      formData.append('symptoms', apiBody.symptoms);
      formData.append('severity', apiBody.severity);
      formData.append('prognosis', apiBody.prognosis);
      // Thêm từng chi tiết điều trị vào FormData
      detail.forEach((treatment: any, index: number) => {
        formData.append(`detail[${index}].dosage`, treatment.dosage.toString());
        formData.append(
          `detail[${index}].injectionSite`,
          treatment.injectionSite
        );
        formData.append(`detail[${index}].date`, treatment.date);
        formData.append(`detail[${index}].description`, treatment.description);
        formData.append(
          `detail[${index}].vaccineId`,
          treatment.vaccineId.toString()
        );
      });
      file.forEach((file: any) => {
        formData.append('newImages', file.originFileObj);
      });
      // Gửi request API với FormData
      const response = await triggerIllness({ body: formData });

      // Hiển thị thông báo thành công
      toast.showSuccess(
        response.message || t('Illness record created successfully')
      );

      // Cập nhật lại dữ liệu sau khi thành công
      mutate();

      // Đóng modal và reset form
      handleCancel();
    } catch (error: any) {
      // Hiển thị thông báo lỗi nếu có
      toast.showError(error.message || t('Failed to create illness record'));
      throw error;
    }
  };

  const handleCancel = () => {
    illnessForm.resetFields();
    detailsForm.resetFields();
    setApiBody(null);
    setIsCowSelected(false);
    setSelectedCow(null);
    setTreatmentDetails([]);
    setCurrent(0);
    setFile([]);
    modal.closeModal();
  };

  const steps: StepItem[] = [
    {
      title: t('Illness Information'),
      content: (
        <IllnessInformationForm
          form={illnessForm}
          cowOptions={cowOptions}
          isCowSelected={isCowSelected}
          selectedCow={selectedCow}
          handleCowChange={handleCowChange}
          isLoadingCows={isLoadingCows}
        />
      ),
      onNext: handleNextIllness,
    },
    {
      title: t('Illness Details'),
      content: (
        <IllnessDetailsForm
          form={detailsForm}
          itemOptions={itemOptions}
          injectionSiteOptions={injectionSiteOptions}
          isLoadingItems={isLoadingItems}
          hasAddedDefaultField={hasAddedDefaultField}
        />
      ),
      onNext: handleNextDetails,
    },
    {
      title: t('Review'),
      content: (
        <ReviewInformation
          apiBody={apiBody}
          cowOptions={cowOptions}
          selectedCow={selectedCow}
          treatmentDetails={treatmentDetails}
          itemOptions={itemOptions}
          injectionSiteOptions={injectionSiteOptions}
          fileState={{
            file: file,
            setFile: setFile,
          }}
          form={illnessForm}
        />
      ),
      onDone: handleSubmit,
    },
  ];

  return (
    <ModalComponent
      title={t('Create Illness Record')}
      open={modal.open}
      onCancel={handleCancel}
      width={1000}
      footer={[]}
      confirmLoading={isLoadingIllness}
      className="rounded-lg"
    >
      <div className="mt-5">
        <StepsComponent
          steps={steps}
          current={current}
          setCurrent={setCurrent}
        />
      </div>
    </ModalComponent>
  );
};

export default ModalCreateIllNess;
