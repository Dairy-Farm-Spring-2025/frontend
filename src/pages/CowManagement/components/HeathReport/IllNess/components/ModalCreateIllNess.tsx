// import { DatePicker, Form, Select } from 'antd';
// import FormComponent from '@components/Form/FormComponent';
// import FormItemComponent from '@components/Form/Item/FormItemComponent';
// import InputComponent from '@components/Input/InputComponent';
// import LabelForm from '@components/LabelForm/LabelForm';
// import ModalComponent from '@components/Modal/ModalComponent';

// import { useTranslation } from 'react-i18next';
// import useFetcher from '@hooks/useFetcher';
// import useToast from '@hooks/useToast';
// import { Cow } from '@model/Cow/Cow';
// import { healthSeverity } from '@service/data/health';
// import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
// import { COW_PATH } from '@service/api/Cow/cowApi';
// import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';

// interface ModalCreateIllNessProps {
//   modal: any;
//   mutate: any;
// }

// const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
//   const { t } = useTranslation();
//   const [form] = Form.useForm();
//   const toast = useToast();
//   const { trigger, isLoading } = useFetcher(
//     HEALTH_RECORD_PATH.CREATE_ILLNESS,
//     'POST'
//   );
//   const { data: dataCows } = useFetcher<any>(COW_PATH.COWS, 'GET');

//   const handleFinish = async (values: any) => {
//     try {
//       const response = await trigger({ body: values });
//       toast.showSuccess(response.message);
//       mutate();
//       handleClose();
//     } catch (error: any) {
//       toast.showSuccess(error.message);
//     }
//   };

//   const handleClose = () => {
//     modal.closeModal();
//     form.resetFields();
//   };
//   return (
//     <ModalComponent
//       title={t('Create IllNess')}
//       open={modal.open}
//       onCancel={handleClose}
//       loading={isLoading}
//       onOk={() => form.submit()}
//       width={1200}
//     >
//       <FormComponent form={form} onFinish={handleFinish}>
//         <FormItemComponent
//           name="cowId"
//           label={<LabelForm>{t('Cow')}</LabelForm>}
//           rules={[{ required: true }]}
//         >
//           <Select
//             placeholder="Select a cow"
//             options={
//               dataCows?.map((cow: Cow) => ({
//                 value: cow.cowId,
//                 label: cow.name,
//               })) || []
//             }
//           />
//         </FormItemComponent>
//         <FormItemComponent
//           name="symptoms"
//           label={<LabelForm>{t('Symptoms')}</LabelForm>}
//           rules={[{ required: true }]}
//         >
//           <ReactQuillComponent placeholder="Enter symptoms" />
//         </FormItemComponent>
//         <FormItemComponent
//           name="severity"
//           label={<LabelForm>{t('Severity')}</LabelForm>}
//           rules={[{ required: true }]}
//         >
//           <Select options={healthSeverity} placeholder="Select severity " />
//         </FormItemComponent>
//         <FormItemComponent
//           name="prognosis"
//           label={<LabelForm>{t('Prognosis')}</LabelForm>}
//           rules={[{ required: true }]}
//         >
//           <ReactQuillComponent placeholder="Enter prognosis" />
//         </FormItemComponent>
//         <div className='flex'>


//           <FormItemComponent
//             name="startDate"
//             label={<LabelForm>{t('Start Date')}</LabelForm>}
//             rules={[{ required: true }]}
//           >
//             <DatePicker className="w-full" />
//           </FormItemComponent>
//           <FormItemComponent
//             name="endDate"
//             label={<LabelForm>{t('End Date')}</LabelForm>}
//             rules={[{ required: true }]}
//             className='ml-5'
//           >
//             <DatePicker className="w-full" />
//           </FormItemComponent>
//         </div>
//       </FormComponent>
//     </ModalComponent>
//   );
// };

// export default ModalCreateIllNess;
import { DatePicker, Form, Select, Row, Col } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import { useTranslation } from 'react-i18next';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { healthSeverity } from '@service/data/health';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { COW_PATH } from '@service/api/Cow/cowApi';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import Title from '@components/UI/Title';

interface ModalCreateIllNessProps {
  modal: any;
  mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(
    HEALTH_RECORD_PATH.CREATE_ILLNESS,
    'POST'
  );
  const { data: dataCows } = useFetcher<any>(COW_PATH.COWS, 'GET');

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      mutate();
      handleClose();
    } catch (error: any) {
      toast.showError(error.message || t('Failed to create illness record')); // Cải thiện thông báo lỗi
    }
  };

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
  };

  return (
    <ModalComponent
      title={t('Create Illness Record')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
      width={800} // Giảm width để giao diện gọn gàng hơn
      className="rounded-lg"
    >
      <FormComponent form={form} onFinish={handleFinish} layout="vertical">
        <div className="p-6">
          {/* Section 1: Cow Information */}
          <div className="mb-6">
            <Title className="!text-2xl w-1/2 mb-5">{t('Cow Information')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormItemComponent
                  name="cowId"
                  label={<LabelForm>{t('Select Cow')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={t('Select a cow')}
                    options={
                      dataCows?.map((cow: Cow) => ({
                        value: cow.cowId,
                        label: cow.name,
                      })) || []
                    }
                    showSearch
                    optionFilterProp="label"
                  />
                </FormItemComponent>
              </Col>
            </Row>
          </div>

          {/* Section 2: Illness Details */}
          <div className="mb-6">

            <Title className="!text-2xl w-1/2 mb-5">{t('Illness Details')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormItemComponent
                  name="symptoms"
                  label={<LabelForm>{t('Symptoms')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <ReactQuillComponent placeholder={t('Describe the symptoms here...')} />
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="severity"
                  label={<LabelForm>{t('Severity')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={t('Select severity level')}
                    options={healthSeverity}
                    className="w-full"
                  />
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="prognosis"
                  label={<LabelForm>{t('Prognosis')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <ReactQuillComponent placeholder={t('Describe the prognosis here...')} />
                </FormItemComponent>
              </Col>
            </Row>
          </div>

          {/* Section 3: Date Range */}
          <div>
            <Title className="!text-2xl w-1/2 mb-5">{t('Date Range')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormItemComponent
                  name="startDate"
                  label={<LabelForm>{t('Start Date')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-full" />
                </FormItemComponent>
              </Col>
              <Col span={12}>
                <FormItemComponent
                  name="endDate"
                  label={<LabelForm>{t('End Date')}</LabelForm>}
                  rules={[{ required: true, }]}
                >
                  <DatePicker className="w-full" />
                </FormItemComponent>
              </Col>
            </Row>
          </div>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalCreateIllNess;