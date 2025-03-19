// // import { DatePicker, Form, Select } from 'antd';
// // import FormComponent from '@components/Form/FormComponent';
// // import FormItemComponent from '@components/Form/Item/FormItemComponent';
// // import InputComponent from '@components/Input/InputComponent';
// // import LabelForm from '@components/LabelForm/LabelForm';
// // import ModalComponent from '@components/Modal/ModalComponent';

// // import { useTranslation } from 'react-i18next';
// // import useFetcher from '@hooks/useFetcher';
// // import useToast from '@hooks/useToast';
// // import { Cow } from '@model/Cow/Cow';
// // import { healthSeverity } from '@service/data/health';
// // import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
// // import { COW_PATH } from '@service/api/Cow/cowApi';
// // import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';

// // interface ModalCreateIllNessProps {
// //   modal: any;
// //   mutate: any;
// // }

// // const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
// //   const { t } = useTranslation();
// //   const [form] = Form.useForm();
// //   const toast = useToast();
// //   const { trigger, isLoading } = useFetcher(
// //     HEALTH_RECORD_PATH.CREATE_ILLNESS,
// //     'POST'
// //   );
// //   const { data: dataCows } = useFetcher<any>(COW_PATH.COWS, 'GET');

// //   const handleFinish = async (values: any) => {
// //     try {
// //       const response = await trigger({ body: values });
// //       toast.showSuccess(response.message);
// //       mutate();
// //       handleClose();
// //     } catch (error: any) {
// //       toast.showSuccess(error.message);
// //     }
// //   };

// //   const handleClose = () => {
// //     modal.closeModal();
// //     form.resetFields();
// //   };
// //   return (
// //     <ModalComponent
// //       title={t('Create IllNess')}
// //       open={modal.open}
// //       onCancel={handleClose}
// //       loading={isLoading}
// //       onOk={() => form.submit()}
// //       width={1200}
// //     >
// //       <FormComponent form={form} onFinish={handleFinish}>
// //         <FormItemComponent
// //           name="cowId"
// //           label={<LabelForm>{t('Cow')}</LabelForm>}
// //           rules={[{ required: true }]}
// //         >
// //           <Select
// //             placeholder="Select a cow"
// //             options={
// //               dataCows?.map((cow: Cow) => ({
// //                 value: cow.cowId,
// //                 label: cow.name,
// //               })) || []
// //             }
// //           />
// //         </FormItemComponent>
// //         <FormItemComponent
// //           name="symptoms"
// //           label={<LabelForm>{t('Symptoms')}</LabelForm>}
// //           rules={[{ required: true }]}
// //         >
// //           <ReactQuillComponent placeholder="Enter symptoms" />
// //         </FormItemComponent>
// //         <FormItemComponent
// //           name="severity"
// //           label={<LabelForm>{t('Severity')}</LabelForm>}
// //           rules={[{ required: true }]}
// //         >
// //           <Select options={healthSeverity} placeholder="Select severity " />
// //         </FormItemComponent>
// //         <FormItemComponent
// //           name="prognosis"
// //           label={<LabelForm>{t('Prognosis')}</LabelForm>}
// //           rules={[{ required: true }]}
// //         >
// //           <ReactQuillComponent placeholder="Enter prognosis" />
// //         </FormItemComponent>
// //         <div className='flex'>


// //           <FormItemComponent
// //             name="startDate"
// //             label={<LabelForm>{t('Start Date')}</LabelForm>}
// //             rules={[{ required: true }]}
// //           >
// //             <DatePicker className="w-full" />
// //           </FormItemComponent>
// //           <FormItemComponent
// //             name="endDate"
// //             label={<LabelForm>{t('End Date')}</LabelForm>}
// //             rules={[{ required: true }]}
// //             className='ml-5'
// //           >
// //             <DatePicker className="w-full" />
// //           </FormItemComponent>
// //         </div>
// //       </FormComponent>
// //     </ModalComponent>
// //   );
// // };

// // export default ModalCreateIllNess;
// import { DatePicker, Form, Select, Row, Col } from 'antd';
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
// import Title from '@components/UI/Title';

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
//       toast.showError(error.message || t('Failed to create illness record')); // Cải thiện thông báo lỗi
//     }
//   };

//   const handleClose = () => {
//     modal.closeModal();
//     form.resetFields();
//   };

//   return (
//     <ModalComponent
//       title={t('Create Illness Record')}
//       open={modal.open}
//       onCancel={handleClose}
//       loading={isLoading}
//       onOk={() => form.submit()}
//       width={800} // Giảm width để giao diện gọn gàng hơn
//       className="rounded-lg"
//     >
//       <FormComponent form={form} onFinish={handleFinish} layout="vertical">
//         <div className="p-6">
//           {/* Section 1: Cow Information */}
//           <div className="mb-6">
//             <Title className="!text-2xl w-1/2 mb-5">{t('Cow Information')}</Title>
//             <Row gutter={[16, 16]}>
//               <Col span={24}>
//                 <FormItemComponent
//                   name="cowId"
//                   label={<LabelForm>{t('Select Cow')}</LabelForm>}
//                   rules={[{ required: true }]}
//                 >
//                   <Select
//                     placeholder={t('Select a cow')}
//                     options={
//                       dataCows?.map((cow: Cow) => ({
//                         value: cow.cowId,
//                         label: cow.name,
//                       })) || []
//                     }
//                     showSearch
//                     optionFilterProp="label"
//                   />
//                 </FormItemComponent>
//               </Col>
//             </Row>
//           </div>

//           {/* Section 2: Illness Details */}
//           <div className="mb-6">

//             <Title className="!text-2xl w-1/2 mb-5">{t('Illness Details')}</Title>
//             <Row gutter={[16, 16]}>
//               <Col span={24}>
//                 <FormItemComponent
//                   name="symptoms"
//                   label={<LabelForm>{t('Symptoms')}</LabelForm>}
//                   rules={[{ required: true }]}
//                 >
//                   <ReactQuillComponent placeholder={t('Describe the symptoms here...')} />
//                 </FormItemComponent>
//               </Col>
//               <Col span={24}>
//                 <FormItemComponent
//                   name="severity"
//                   label={<LabelForm>{t('Severity')}</LabelForm>}
//                   rules={[{ required: true }]}
//                 >
//                   <Select
//                     placeholder={t('Select severity level')}
//                     options={healthSeverity}
//                     className="w-full"
//                   />
//                 </FormItemComponent>
//               </Col>
//               <Col span={24}>
//                 <FormItemComponent
//                   name="prognosis"
//                   label={<LabelForm>{t('Prognosis')}</LabelForm>}
//                   rules={[{ required: true }]}
//                 >
//                   <ReactQuillComponent placeholder={t('Describe the prognosis here...')} />
//                 </FormItemComponent>
//               </Col>
//             </Row>
//           </div>

//           {/* Section 3: Date Range */}
//           <div>
//             <Title className="!text-2xl w-1/2 mb-5">{t('Date Range')}</Title>
//             <Row gutter={[16, 16]}>
//               <Col span={12}>
//                 <FormItemComponent
//                   name="startDate"
//                   label={<LabelForm>{t('Start Date')}</LabelForm>}
//                   rules={[{ required: true }]}
//                 >
//                   <DatePicker className="w-full" />
//                 </FormItemComponent>
//               </Col>
//               <Col span={12}>
//                 <FormItemComponent
//                   name="endDate"
//                   label={<LabelForm>{t('End Date')}</LabelForm>}
//                   rules={[{ required: true, }]}
//                 >
//                   <DatePicker className="w-full" />
//                 </FormItemComponent>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </FormComponent>
//     </ModalComponent>
//   );
// };

// export default ModalCreateIllNess;



import { DatePicker, Form, Select, Row, Col } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
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
import { useState } from 'react';
import dayjs from 'dayjs';
import { formatAreaType } from '@utils/format';

interface ModalCreateIllNessProps {
  modal: any;
  mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(HEALTH_RECORD_PATH.CREATE_ILLNESS, 'POST');
  const { data: dataCows } = useFetcher<any>(COW_PATH.COWS, 'GET');
  const [isCowSelected, setIsCowSelected] = useState(false);
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null); // Lưu thông tin con bò được chọn

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({
        body: {
          ...values,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
        },
      });
      toast.showSuccess(response.message || t('Illness record created successfully'));
      mutate();
      handleClose();
    } catch (error: any) {
      toast.showError(error.message || t('Failed to create illness record'));
    }
  };

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
    setIsCowSelected(false);
    setSelectedCow(null); // Reset thông tin bò khi đóng modal
  };

  // Xử lý khi chọn cow
  const handleCowChange = (value: string) => {
    const cow = dataCows?.find((c: Cow) => c.cowId === value);
    setIsCowSelected(!!value);
    setSelectedCow(cow || null); // Lưu thông tin con bò được chọn
  };

  return (
    <ModalComponent
      title={t('Create Illness Record')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: !isCowSelected }}
      width={1000} // Tăng width lên 1000px để modal rộng hơn
      className="rounded-lg"
      styles={{
        wrapper: { minHeight: '90vh', top: 20, paddingBottom: 0 }, // Tăng chiều cao tối thiểu lên 90vh
        body: { padding: 0, overflowY: 'visible' }, // Bỏ giới hạn chiều cao và scroll của body
      }}
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
                  rules={[{ required: true, message: t('Please select a cow') }]}
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
                    onChange={handleCowChange}
                  />
                </FormItemComponent>
              </Col>
            </Row>

            {/* Hiển thị thông tin bổ sung khi đã chọn cow */}
            {isCowSelected && selectedCow && (
              <Row gutter={[16, 16]} className="mt-4">
                <Col span={12}>
                  <LabelForm>{t('Cow Status')}</LabelForm>
                  <div className="font-medium text-gray-700">
                    {formatAreaType(selectedCow.cowStatus) || t('No data')}
                  </div>
                </Col>
                <Col span={12}>
                  <LabelForm>{t('Date of Birth')}</LabelForm>
                  <div className="font-medium text-gray-700">
                    {selectedCow.dateOfBirth
                      ? dayjs(selectedCow.dateOfBirth).format('DD/MM/YYYY')
                      : t('No data')}
                  </div>
                </Col>
                <Col span={12}>
                  <LabelForm>{t('Cow Origin')}</LabelForm>
                  <div className="font-medium text-gray-700">
                    {formatAreaType(selectedCow.cowOrigin) || t('No data')}
                  </div>
                </Col>
                <Col span={12}>
                  <LabelForm>{t('Gender')}</LabelForm>
                  <div className="font-medium text-gray-700">
                    {formatAreaType(selectedCow.gender) || t('No data')}
                  </div>
                </Col>
              </Row>
            )}
          </div>

          {/* Chỉ hiển thị các field khác khi đã chọn cow */}
          {isCowSelected && (
            <>
              {/* Section 2: Illness Details */}
              <div className="mb-6">
                <Title className="!text-2xl w-1/2 mb-5">{t('Illness Details')}</Title>
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
                      name="severity"
                      label={<LabelForm>{t('Severity')}</LabelForm>}
                      rules={[{ required: true, message: t('Please select severity') }]}
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
                      rules={[{ required: true, message: t('Please enter prognosis') }]}
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
                      rules={[{ required: true, message: t('Please select start date') }]}
                    >
                      <DatePicker className="w-full" />
                    </FormItemComponent>
                  </Col>
                  <Col span={12}>
                    <FormItemComponent
                      name="endDate"
                      label={<LabelForm>{t('End Date')}</LabelForm>}
                      rules={[{ required: true, message: t('Please select end date') }]}
                    >
                      <DatePicker className="w-full" />
                    </FormItemComponent>
                  </Col>
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