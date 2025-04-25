// import {
//   HomeOutlined,
//   InfoCircleOutlined,
//   TagOutlined,
// } from '@ant-design/icons';
// import ButtonComponent from '@components/Button/ButtonComponent';
// import FormItemComponent from '@components/Form/Item/FormItemComponent';
// import LabelForm from '@components/LabelForm/LabelForm';
// import SelectComponent from '@components/Select/SelectComponent';
// import TableComponent, { Column } from '@components/Table/TableComponent';
// import WhiteBackground from '@components/UI/WhiteBackground';
// import useFetcher from '@hooks/useFetcher';
// import useGetRole from '@hooks/useGetRole';
// import useToast from '@hooks/useToast';
// import { Area } from '@model/Area';
// import { PenEntity } from '@model/CowPen/CowPen';
// import { formatDateHour, formatStatusWithCamel } from '@utils/format';
// import { Divider, Form, Tag } from 'antd';
// import { useEffect, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// interface CowPenHistory {
//   penEntity: PenEntity;
//   fromDate: string;
//   toDate: string | null;
//   cowStatus: string;
//   cowType: string;
// }

// interface CowDetails {
//   cowId: number;
//   name: string;
//   cowStatus: string;
//   cowType: { cowTypeId: number; name: string };
//   penResponse?: { area: { areaType: string } };
// }

// interface HistoryMoveCowProps {
//   id: string;
//   isLoadingHistory: boolean;
// }

// const HistoryMoveCow = ({ id, isLoadingHistory }: HistoryMoveCowProps) => {
//   const { t } = useTranslation();
//   const role = useGetRole();
//   const toast = useToast();

//   // Fetch cow details to get cowStatus and cowTypeId
//   const { data: cowDetails } = useFetcher<CowDetails>(`cows/${id}`, 'GET');

//   const {
//     data,
//     mutate,
//     error: fetchError,
//   } = useFetcher<CowPenHistory[]>(`cow-pens/cow/${id}`, 'GET');

//   const [form] = Form.useForm<{
//     areaId: number | null;
//     penId: number | null;
//   }>();
//   const areaId = Form.useWatch('areaId', form);
//   const penId = Form.useWatch('penId', form);

//   const { data: areasData } = useFetcher<Area[]>('areas', 'GET');

//   // Extract cowStatus and cowTypeId from cow details
//   const cowStatus = cowDetails?.cowStatus || 'milkingCow'; // Default fallback
//   const cowTypeId = cowDetails?.cowType?.cowTypeId || 1; // Default fallback

//   // Get areaType from the selected area
//   const selectedArea = areasData?.find((area) => area.areaId === areaId);
//   const areaType = selectedArea?.areaType || '';

//   // Fetch pens with areaType, cowStatus, and cowTypeId as query params
//   const { data: allPensInArea, mutate: mutatePens } = useFetcher<PenEntity[]>(
//     areaId && areaType
//       ? `pens/available/cow?areaType=${areaType}&cowStatus=${cowStatus}&cowTypeId=${cowTypeId}`
//       : '',
//     'GET'
//   );

//   const { trigger: moveCow, isLoading } = useFetcher('cow-pens/create', 'POST');

//   const emptyPens = useMemo(
//     () => allPensInArea?.filter((pen) => pen.penStatus === 'empty') || [],
//     [allPensInArea]
//   );

//   const areaOptions = useMemo(
//     () =>
//       areasData?.map((area) => ({ label: area.name, value: area.areaId })) ||
//       [],
//     [areasData]
//   );

//   const penOptions = useMemo(
//     () => emptyPens.map((pen) => ({ value: pen.penId, label: pen.name })),
//     [emptyPens]
//   );

//   const isFormValid = !!areaId && !!penId;

//   useEffect(() => {
//     if (areaId) {
//       mutatePens();
//       form.setFieldsValue({ penId: null });
//     }
//   }, [areaId, mutatePens, form]);

//   const handleMoveCow = async () => {
//     if (!isFormValid) return;

//     try {
//       const values = await form.validateFields();
//       if (!id || !values.penId) return;

//       const response = await moveCow({
//         body: { cowId: id, penId: values.penId },
//       });

//       if (response) {
//         const newRecord: CowPenHistory = {
//           penEntity: emptyPens.find((pen) => pen.penId === values.penId)!,
//           fromDate: new Date().toISOString(),
//           toDate: null,
//           cowStatus,
//           cowType: cowDetails?.cowType?.name || 'adult',
//         };
//         mutate([newRecord, ...(data || [])]);
//       } else {
//         mutate();
//       }

//       toast.showSuccess(t('Move cow successfully'));
//       form.resetFields();
//     } catch (error: any) {
//       toast.showError(error?.message || t('Failed to move cow'));
//     }
//   };

//   const columns = useMemo<Column[]>(
//     () => [
//       {
//         title: t('#'),
//         dataIndex: 'stt',
//         key: 'stt',
//         render: (_: unknown, __: CowPenHistory, index: number) => index + 1,
//       },
//       {
//         title: t('In Pen Name'),
//         dataIndex: 'penEntity',
//         key: 'penName',
//         render: (penEntity: PenEntity) => penEntity.name,
//         searchable: true,
//       },
//       {
//         title: t('Area'),
//         dataIndex: 'penEntity',
//         key: 'areaBelongto',
//         render: (penEntity: PenEntity) =>
//           penEntity?.areaBelongto?.name ?? 'N/A',
//         searchable: true,
//       },
//       {
//         title: t('From Date'),
//         dataIndex: 'fromDate',
//         key: 'fromDate',
//         render: (fromDate: string) => formatDateHour(fromDate),
//         sorter: (a: CowPenHistory, b: CowPenHistory) =>
//           new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
//         defaultSortOrder: 'descend',
//       },
//       {
//         title: t('To Date'),
//         dataIndex: 'toDate',
//         key: 'toDate',
//         render: (toDate: string | null) =>
//           toDate ? formatDateHour(toDate) : <Tag color="blue">{t('Now')}</Tag>,
//         sorter: (a: CowPenHistory, b: CowPenHistory) => {
//           if (!a.toDate && !b.toDate) return 0;
//           if (!a.toDate) return -1;
//           if (!b.toDate) return 1;
//           return new Date(a.toDate).getTime() - new Date(b.toDate).getTime();
//         },
//       },
//     ],
//     [t]
//   );

//   if (isLoadingHistory) {
//     return (
//       <WhiteBackground>
//         <p>{t('Loading...')}</p>
//       </WhiteBackground>
//     );
//   }

//   if (fetchError) {
//     return (
//       <WhiteBackground>
//         <p className="text-red-500">{t('Error loading history')}</p>
//       </WhiteBackground>
//     );
//   }

//   return (
//     <>
//       {role !== 'Veterinarians' && (
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{ areaId: null, penId: null }}
//         >
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <div className="text-2xl font-bold text-primary mb-6">
//               {t('Choose Area & Pen to Move Cow')}
//             </div>
//             <div className="flex flex-col gap-6">
//               <div className="flex flex-col gap-4">
//                 <div className="flex items-center gap-4">
//                   <FormItemComponent
//                     name="areaId"
//                     label={<LabelForm>{t('Area')}</LabelForm>}
//                     rules={[
//                       { required: true, message: t('Please select an area') },
//                     ]}
//                     className="w-48"
//                   >
//                     <SelectComponent
//                       options={areaOptions}
//                       placeholder={t('Select area')}
//                       size="middle"
//                     />
//                   </FormItemComponent>

//                   <FormItemComponent
//                     name="penId"
//                     label={<LabelForm>{t('Pen')}</LabelForm>}
//                     rules={[
//                       { required: true, message: t('Please select a pen') },
//                     ]}
//                     className="w-48"
//                   >
//                     <SelectComponent
//                       placeholder={t('Select Pen')}
//                       options={penOptions}
//                       disabled={!areaId || emptyPens.length === 0}
//                       size="middle"
//                     />
//                   </FormItemComponent>

//                   <ButtonComponent
//                     type="primary"
//                     onClick={handleMoveCow}
//                     disabled={!isFormValid}
//                     loading={isLoading}
//                     size="middle"
//                     className="px-6 h-10"
//                   >
//                     {t('Move Cow')}
//                   </ButtonComponent>
//                 </div>

//                 {/* Improved Area Description Section */}
//                 {areaId && (
//                   <div className="mt-4">
//                     <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 max-w-2xl">
//                       <div className="flex items-center gap-2 mb-3">
//                         <HomeOutlined className="text-primary text-lg" />
//                         <h3 className="text-lg font-semibold text-gray-800">
//                           {t('Area Details')}
//                         </h3>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex items-start gap-2">
//                           <InfoCircleOutlined className="text-gray-500 mt-1" />
//                           <div>
//                             <span className="font-medium text-gray-700">
//                               {t('Description')}:
//                             </span>
//                             <p className="text-gray-600 mt-1">
//                               {areasData?.find((area) => area.areaId === areaId)
//                                 ?.description || t('No description')}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <TagOutlined className="text-gray-500" />
//                           <span className="font-medium text-gray-700">
//                             {t('Cow Type')}:
//                           </span>
//                           <Tag color="blue">
//                             {areasData?.find((area) => area.areaId === areaId)
//                               ?.cowTypeEntity?.name || t('Unknown')}
//                           </Tag>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <TagOutlined className="text-gray-500" />
//                           <span className="font-medium text-gray-700">
//                             {t('Cow Status')}:
//                           </span>
//                           <Tag color="green">
//                             {t(
//                               formatStatusWithCamel(
//                                 areasData?.find(
//                                   (area) => area.areaId === areaId
//                                 )?.cowStatus || 'Unknown'
//                               )
//                             )}
//                           </Tag>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {areaId && emptyPens.length === 0 && (
//                 <div className="text-red-500 text-sm">
//                   {t('No empty pens available in this area!')}
//                 </div>
//               )}
//             </div>
//           </div>
//         </Form>
//       )}

//       <Divider className="my-4" />

//       <TableComponent
//         columns={columns}
//         dataSource={data || []}
//         loading={isLoadingHistory}
//         rowKey={(record) => `${record.penEntity.name}-${record.fromDate}`}
//       />
//     </>
//   );
// };

// export default HistoryMoveCow;


import ButtonComponent from '@components/Button/ButtonComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useGetRole from '@hooks/useGetRole';
import useToast from '@hooks/useToast';
import { PenEntity } from '@model/CowPen/CowPen';
import { formatDateHour } from '@utils/format';
import { Divider, Form, Tag } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

// Define areaType function
interface SelectOption {
  value: string;
  label: string;
}

export const areaType = (): SelectOption[] => {
  return [
    { value: 'cowHousing', label: t('Cow Housing') },
    { value: 'quarantine', label: t('Quarantine') },
  ];
};

interface CowPenHistory {
  penEntity: PenEntity;
  fromDate: string;
  toDate: string | null;
  cowStatus: string;
  cowType: string;
}

interface CowDetails {
  cowId: number;
  name: string;
  cowStatus: string;
  cowType: { cowTypeId: number; name: string };
  penResponse?: { area: { areaType: string } };
}

interface HistoryMoveCowProps {
  id: string;
  isLoadingHistory: boolean;
}

const HistoryMoveCow = ({ id, isLoadingHistory }: HistoryMoveCowProps) => {
  const { t } = useTranslation();
  const role = useGetRole();
  const toast = useToast();

  // Fetch cow details to get cowStatus and cowTypeId
  const { data: cowDetails } = useFetcher<CowDetails>(`cows/${id}`, 'GET');

  const {
    data,
    mutate,
    error: fetchError,
  } = useFetcher<CowPenHistory[]>(`cow-pens/cow/${id}`, 'GET');

  const [form] = Form.useForm<{
    areaId: string | null; // Updated to string
    penId: number | null;
  }>();
  const areaId = Form.useWatch('areaId', form);
  const penId = Form.useWatch('penId', form);

  // Extract cowStatus and cowTypeId from cow details
  const cowStatus = cowDetails?.cowStatus || 'milkingCow';
  const cowTypeId = cowDetails?.cowType?.cowTypeId || 1;

  // Use areaId directly as selectedAreaType
  const selectedAreaType = areaId || '';

  // Fetch pens with selectedAreaType, cowStatus, and cowTypeId as query params
  const { data: allPensInArea, mutate: mutatePens } = useFetcher<PenEntity[]>(
    areaId
      ? `pens/available/cow?areaType=${selectedAreaType}&cowStatus=${cowStatus}&cowTypeId=${cowTypeId}`
      : '',
    'GET'
  );

  const { trigger: moveCow, isLoading } = useFetcher('cow-pens/create', 'POST');

  const emptyPens = useMemo(
    () => allPensInArea?.filter((pen) => pen.penStatus === 'empty') || [],
    [allPensInArea]
  );

  const penOptions = useMemo(
    () => emptyPens.map((pen) => ({ value: pen.penId, label: `${pen.name} (${pen.area?.name || 'N/A'})`,})),
    [emptyPens]
  );

  const isFormValid = !!areaId && !!penId;

  useEffect(() => {
    if (areaId) {
      mutatePens();
      form.setFieldsValue({ penId: null });
    }
  }, [areaId, mutatePens, form]);

  const handleMoveCow = async () => {
    if (!isFormValid) return;

    try {
      const values = await form.validateFields();
      if (!id || !values.penId) return;

      const response = await moveCow({
        body: { cowId: id, penId: values.penId },
      });

      if (response) {
        const newRecord: CowPenHistory = {
          penEntity: emptyPens.find((pen) => pen.penId === values.penId)!,
          fromDate: new Date().toISOString(),
          toDate: null,
          cowStatus,
          cowType: cowDetails?.cowType?.name || 'adult',
        };
        mutate([newRecord, ...(data || [])]);
      } else {
        mutate();
      }

      toast.showSuccess(t('Move cow successfully'));
      form.resetFields();
    } catch (error: any) {
      toast.showError(error?.message || t('Failed to move cow'));
    }
  };

  const columns = useMemo<Column[]>(
    () => [
      {
        title: t('#'),
        dataIndex: 'stt',
        key: 'stt',
        render: (_: unknown, __: CowPenHistory, index: number) => index + 1,
      },
      {
        title: t('In Pen Name'),
        dataIndex: 'penEntity',
        key: 'penName',
        render: (penEntity: PenEntity) => penEntity.name,
        searchable: true,
      },
      {
        title: t('Area'),
        dataIndex: 'penEntity',
        key: 'areaBelongto',
        render: (penEntity: PenEntity) =>
          penEntity?.areaBelongto?.name ?? 'N/A',
        searchable: true,
      },
      {
        title: t('From Date'),
        dataIndex: 'fromDate',
        key: 'fromDate',
        render: (fromDate: string) => formatDateHour(fromDate),
        sorter: (a: CowPenHistory, b: CowPenHistory) =>
          new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
        defaultSortOrder: 'descend',
      },
      {
        title: t('To Date'),
        dataIndex: 'toDate',
        key: 'toDate',
        render: (toDate: string | null) =>
          toDate ? formatDateHour(toDate) : <Tag color="blue">{t('Now')}</Tag>,
        sorter: (a: CowPenHistory, b: CowPenHistory) => {
          if (!a.toDate && !b.toDate) return 0;
          if (!a.toDate) return -1;
          if (!b.toDate) return 1;
          return new Date(a.toDate).getTime() - new Date(b.toDate).getTime();
        },
      },
    ],
    [t]
  );

  if (isLoadingHistory) {
    return (
      <WhiteBackground>
        <p>{t('Loading...')}</p>
      </WhiteBackground>
    );
  }

  if (fetchError) {
    return (
      <WhiteBackground>
        <p className="text-red-500">{t('Error loading history')}</p>
      </WhiteBackground>
    );
  }

  return (
    <>
      {role !== 'Veterinarians' && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ areaId: null, penId: null }}
        >
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold text-primary mb-6">
              {t('Choose Area & Pen to Move Cow')}
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <FormItemComponent
                    name="areaId"
                    label={<LabelForm>{t('Area')}</LabelForm>}
                    rules={[
                      { required: true, message: t('Please select an area') },
                    ]}
                    className="w-48"
                  >
                    <SelectComponent
                      options={areaType()} // Use the areaType function
                      placeholder={t('Select area')}
                      size="middle"
                    />
                  </FormItemComponent>

                  <FormItemComponent
                    name="penId"
                    label={<LabelForm>{t('Pen')}</LabelForm>}
                    rules={[
                      { required: true, message: t('Please select a pen') },
                    ]}
                    className="w-48"
                  >
                    <SelectComponent
                      placeholder={t('Select Pen')}
                      options={penOptions}
                      disabled={!areaId || emptyPens.length === 0}
                      
                      size="middle"
                    />
                  </FormItemComponent>

                  <ButtonComponent
                    type="primary"
                    onClick={handleMoveCow}
                    disabled={!isFormValid}
                    loading={isLoading}
                    size="middle"
                    className="px-6 h-10"
                  >
                    {t('Move Cow')}
                  </ButtonComponent>
                </div>

              </div>

              {areaId && emptyPens.length === 0 && (
                <div className="text-red-500 text-sm">
                  {t('No empty pens available in this area!')}
                </div>
              )}
            </div>
          </div>
        </Form>
      )}

      <Divider className="my-4" />

      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoadingHistory}
        rowKey={(record) => `${record.penEntity.name}-${record.fromDate}`}
      />
    </>
  );
};

export default HistoryMoveCow;