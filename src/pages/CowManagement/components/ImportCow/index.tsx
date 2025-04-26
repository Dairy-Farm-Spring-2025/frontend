import {
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    SaveOutlined,
    CheckOutlined,
  } from '@ant-design/icons';
  import TableComponent, { Column } from '@components/Table/TableComponent';
  import AnimationAppear from '@components/UI/AnimationAppear';
  import WhiteBackground from '@components/UI/WhiteBackground';
  import useFetcher from '@hooks/useFetcher';
  import { Cow, HealthResponse, CowStatus } from '@model/Cow/Cow';
  import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
  import { cowStatus } from '@service/data/cowStatus';
  import { formatDateHour, formatStatusWithCamel, formatSTT } from '@utils/format';
  import ButtonComponent from '@components/Button/ButtonComponent';
  import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
  import InputComponent from '@components/Input/InputComponent';
  import SelectComponent from '@components/Select/SelectComponent';
  import { CowType } from '@model/Cow/CowType';

  import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
  import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
  import { Divider, InputNumber, message, Modal, Popover } from 'antd';
  import dayjs from 'dayjs';
  import { useState, useMemo } from 'react';
  import { useTranslation } from 'react-i18next';
  import { IoMdFemale, IoMdMale } from 'react-icons/io';
  import { MdErrorOutline } from 'react-icons/md';
  import ConfirmImport from './components/ConfirmImport';
  import ReviewImportCow from './components/ReviewImportCow';
  import ModalListError from './components/ModalListErrors';
  import FloatButtonComponent from '@components/FloatButton/FloatButtonComponent';
import CreateBulkModal from '../ModalCreateBulk/CreateBulk';
  
  const ListCowImport = () => {
    const { t } = useTranslation();
    const [reviewData, setReviewData] = useState<Cow[]>([]);
    const [reviewErrors, setReviewErrors] = useState<{ source: string; message: string }[]>([]);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const { data: dataCowType } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
    const { data: importTimes, trigger: fetchImportTimes } = useFetcher<number>(COW_TYPE_PATH.IMPORT_TIME, 'GET');
    const [importedCowIds, setImportedCowIds] = useState<number[]>([]);
    const [importSuccess, setImportSuccess] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
    const modalControl = {
      open: isBulkModalOpen,
      openModal: () => setIsBulkModalOpen(true),
      closeModal: () => setIsBulkModalOpen(false),
    };
  
    // Tạo availableCows với cấu trúc đầy đủ theo Cow type
    const availableCows = useMemo((): Cow[] => {
      return importedCowIds.map((id, index) => {
        const reviewCow = reviewData[index] || {};
        // Tìm cowType từ dataCowType dựa trên cowTypeName hoặc cowType.name
        const cowType = dataCowType?.find(
          (type) => type.name === (reviewCow.cowTypeName || reviewCow.cowType?.name)
        ) || {
          cowTypeId: 0,
          name: reviewCow.cowTypeName || 'Unknown',
          description: '',
          status: 'exist' as const,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
        };
  
        return {
          cowId: id, // Ensure this is a number as expected
          name: reviewCow.name || `Cow ${id}`,
          cowStatus: (reviewCow.cowStatus || 'active') as CowStatus,
          cowType: {
            cowTypeId: cowType.cowTypeId,
            name: cowType.name,
            description: cowType.description,
            status: cowType.status,
            createdAt: cowType.createdAt,
            updatedAt: cowType.updatedAt,
          },
          dateOfBirth: reviewCow.dateOfBirth || '2000-01-01',
          dateOfEnter: reviewCow.dateOfEnter || dayjs().format('YYYY-MM-DD'),
          dateOfOut: reviewCow.dateOfOut || null,
          description: reviewCow.description || '',
          gender: (reviewCow.gender || 'male') as 'male' | 'female',
          cowOrigin: reviewCow.cowOrigin || 'local',
          healthInfoResponses: reviewCow.healthInfoResponses || [],
          cowTypeName: reviewCow.cowTypeName || cowType.name,
          cowTypeEntity: reviewCow.cowTypeEntity || null,
          errorStrings: reviewCow.errorStrings || [],
          createdAt: reviewCow.createdAt || dayjs().toISOString(),
          updatedAt: reviewCow.updatedAt || dayjs().toISOString(),
          inPen: reviewCow.inPen ?? false, // Use nullish coalescing to ensure boolean
          penResponse: reviewCow.penResponse || null,
          key: reviewCow.key || id.toString(), // Ensure key is a string
        } as Cow; // Explicitly cast to Cow to help TypeScript
      });
    }, [importedCowIds, reviewData, dataCowType]);
  
    const { handleConfirmImport } = ConfirmImport({
      reviewData,
      dataCowType,
      onImportSuccess: (cowIds, success) => {
        setImportedCowIds(cowIds);
        setImportSuccess(success);
        Modal.success({
          title: t('Đã nhập bò thành công'),
          okText: t('Tiếp theo'),
          onOk: () => {
            setIsBulkModalOpen(true);
          },
          onCancel: () => {},
        });
      },
      onFetchImportTimes: fetchImportTimes,
    });
  
    // Validation functions
    const validateCows = useMemo(() => {
      if (reviewData.length === 0) return false;
      const validCowOrigins = cowOrigin().map((origin: any) => origin.value);
      const validCowStatuses = cowStatus().map((status: any) => status.value);
      const validCowTypes = dataCowType?.map((type: any) => type.name) || [];
  
      return reviewData.every((cow) => {
        return (
          cow.name?.trim() &&
          cow.cowStatus &&
          validCowStatuses.includes(cow.cowStatus) &&
          cow.gender &&
          ['male', 'female'].includes(cow.gender) &&
          cow.cowOrigin &&
          validCowOrigins.includes(cow.cowOrigin) &&
          cow.cowTypeName &&
          validCowTypes.includes(cow.cowTypeName)
        );
      });
    }, [reviewData, dataCowType]);
  
    const validateHealthRecords = useMemo(() => {
      if (reviewData.length === 0) return false;
      return reviewData.every((cow) => {
        return (
          cow.healthInfoResponses[0]?.health?.status &&
          ['good', 'poor', 'critical', 'fair', 'recovering'].includes(cow.healthInfoResponses[0]?.health?.status)
        );
      });
    }, [reviewData]);
  
    const hasReviewErrors = useMemo(() => {
      return reviewErrors.length === 0;
    }, [reviewErrors]);
  
    const handleReviewData = (data: Cow[], errors: { source: string; message: string }[]) => {
      const dataWithKeys = data.map((item, index) => ({
        ...item,
        key: item.key || index.toString(),
        name: item.name || '',
        dateOfBirth: item.dateOfBirth || '',
        dateOfEnter: item.dateOfEnter || '',
        cowOrigin: item.cowOrigin || '',
        gender: item.gender || '',
        cowTypeName: item.cowTypeName || item.cowType?.name || '',
        cowStatus: item.cowStatus || '',
        healthInfoResponses: item.healthInfoResponses || [],
        description: item.description || '',
        errorStrings: item.errorStrings || [],
      }));
      console.log('Review data:', dataWithKeys);
      console.log('Review errors:', errors);
      setReviewData(dataWithKeys);
      setReviewErrors(errors);
      setImportSuccess(false);
  
      // Only open ModalListError if there are errors
      setIsErrorModalVisible(errors.length > 0);
    };
  
    const handleCloseErrorModal = () => {
      setIsErrorModalVisible(false);
    };
  
    const handleSaveErrorData = (updatedData: Cow[]) => {
      setReviewData((prev) =>
        prev.map((item) => {
          const updatedItem = updatedData.find((updated) => updated.key === item.key);
          return updatedItem || item;
        })
      );
      setReviewErrors([]);
      setIsErrorModalVisible(false);
      message.success('Đã lưu dữ liệu sửa lỗi!');
    };
  
    const columns: Column[] = [
      {
        dataIndex: 'name',
        key: 'name',
        title: t('Cow Name'),
        render: (data) => data || '-',
      },
      {
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        title: t('Date Of Birth'),
        sorter: (a: any, b: any) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
        filteredDate: true,
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <DatePickerComponent
              value={data ? dayjs(data) : null}
              onChange={(date) => handleChange(record.key, 'dateOfBirth', date)}
            />
          ) : (
            formatDateHour(data) || '-'
          ),
      },
      {
        dataIndex: 'dateOfEnter',
        key: 'dateOfEnter',
        title: t('Date Of Enter'),
        sorter: (a: any, b: any) => new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
        filteredDate: true,
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <DatePickerComponent
              value={data ? dayjs(data) : null}
              onChange={(date) => handleChange(record.key, 'dateOfEnter', date)}
            />
          ) : (
            formatDateHour(data) || '-'
          ),
      },
      {
        dataIndex: 'cowOrigin',
        key: 'cowOrigin',
        title: t('Origin'),
        filterable: true,
        filterOptions: cowOriginFiltered(),
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <SelectComponent
              value={formatStatusWithCamel(data)}
              options={cowOrigin()}
              onChange={(value) => handleChange(record.key, 'cowOrigin', value)}
            />
          ) : (
            formatStatusWithCamel(data) || '-'
          ),
      },
      {
        dataIndex: 'gender',
        key: 'gender',
        title: t('Gender'),
        filterable: true,
        filterOptions: [
          { text: 'Đực', value: 'male' },
          { text: 'Cái', value: 'female' },
        ],
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <SelectComponent
              value={data}
              options={[
                { value: 'male', label: 'Đực' },
                { value: 'female', label: 'Cái' },
              ]}
              onChange={(value) => handleChange(record.key, 'gender', value)}
            />
          ) : data === 'male' ? (
            <IoMdMale className="text-blue-600" size={20} />
          ) : (
            <IoMdFemale className="text-pink-600" size={20} />
          ),
      },
      {
        dataIndex: 'cowTypeName',
        key: 'cowType',
        title: t('Cow Type'),
        render: (data) => data || '-',
        filterable: true,
        filterOptions: dataCowType?.map((type) => ({ text: type.name, value: type.name })) || [],
      },
      {
        dataIndex: 'cowStatus',
        key: 'cowStatus',
        title: t('Cow Status'),
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <SelectComponent
              value={formatStatusWithCamel(data)}
              options={cowStatus()}
              onChange={(value) => handleChange(record.key, 'cowStatus', value)}
            />
          ) : (
            formatStatusWithCamel(data) || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'healthRecordStatus',
        title: t('Health Status'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <SelectComponent
              value={formatStatusWithCamel(data[0]?.health?.status)}
              options={HEALTH_RECORD_STATUS()}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, status: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            formatStatusWithCamel(data[0]?.health?.status) || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'healthRecordSize',
        title: t('Size (m)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.size}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, size: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.size || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'bodyTemperature',
        title: t('Body Temperature (°C)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.bodyTemperature}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, bodyTemperature: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.bodyTemperature || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'heartRate',
        title: t('Heart Rate (bpm)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.heartRate}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, heartRate: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.heartRate || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'respiratoryRate',
        title: t('Respiratory Rate (breaths/min)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.respiratoryRate}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, respiratoryRate: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.respiratoryRate || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'ruminateActivity',
        title: t('Ruminate Activity (min/day)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.ruminateActivity}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, ruminateActivity: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.ruminateActivity || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'chestCircumference',
        title: t('Chest Circumference (m)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.chestCircumference}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, chestCircumference: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.chestCircumference || '-'
          ),
      },
      {
        dataIndex: 'healthInfoResponses',
        key: 'bodyLength',
        title: t('Body Length (m)'),
        render: (data: HealthResponse[], record) =>
          editingKey === record.key ? (
            <InputNumber
              min={0}
              value={data[0]?.health?.bodyLength}
              onChange={(value) =>
                handleChange(record.key, 'healthInfoResponses', [
                  {
                    ...data[0],
                    health: { ...data[0]?.health, bodyLength: value },
                  },
                  ...data.slice(1),
                ])
              }
            />
          ) : (
            data[0]?.health?.bodyLength || '-'
          ),
      },
      {
        dataIndex: 'description',
        key: 'description',
        title: t('Description'),
        editable: true,
        render: (data, record) =>
          editingKey === record.key ? (
            <InputComponent
              value={data}
              onChange={(e) => handleChange(record.key, 'description', e.target.value)}
            />
          ) : (
            data || '-'
          ),
      },
      {
        title: t('Action'),
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        render: (_, record) =>
          editingKey === record.key ? (
            <>
              <ButtonComponent
                icon={<SaveOutlined />}
                onClick={handleSave}
                style={{ marginRight: 8 }}
                shape="circle"
                type="primary"
              />
              <ButtonComponent
                icon={<CloseOutlined />}
                shape="circle"
                onClick={handleCancel}
                danger
                type="primary"
              />
            </>
          ) : (
            !importSuccess && (
              <>
                <ButtonComponent
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record.key)}
                  style={{ marginRight: 8 }}
                  shape="circle"
                  type="primary"
                />
                <ButtonComponent
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.key)}
                  danger
                  shape="circle"
                  type="primary"
                />
              </>
            )
          ),
      },
    ];
  
    const handleDownloadTemplate = () => {
      window.location.href = 'https://api.dairyfarmfpt.website/api/v1/cows/templates/download/cow-bulk-excel';
      message.success('Đã bắt đầu tải template!');
    };
  
    const handleEdit = (key: string) => setEditingKey(key);
  
    const handleSave = () => {
      setEditingKey(null);
      message.success('Đã lưu thay đổi!');
    };
  
    const handleDelete = (key: string) => {
      setReviewData((prev) => prev.filter((item) => item.key !== key));
      message.success('Dữ liệu đã được xóa!');
    };
  
    const handleCancel = () => setEditingKey(null);
  
    const handleChange = (key: string, field: string, value: any) => {
      setReviewData((prev) =>
        prev.map((item) =>
          item.key === key
            ? {
                ...item,
                [field]:
                  field === 'dateOfBirth' || field === 'dateOfEnter'
                    ? value
                      ? dayjs(value).format('YYYY-MM-DD')
                      : ''
                    : field === 'healthInfoResponses'
                    ? value
                    : field === 'cowTypeName'
                    ? value
                    : value,
                cowType: field === 'cowTypeName' ? { ...item.cowType, name: value } : item.cowType,
                cowTypeEntity: field === 'cowTypeName' ? { ...item.cowTypeEntity, name: value } : item.cowTypeEntity,
              }
            : item
        )
      );
    };
  
    const handleDataChange = (newData: Cow[]) => {
      setReviewData(newData);
    };
  
    const mutateCows = () => {
      setReviewData([]);
      setImportedCowIds([]);
      setImportSuccess(false);
      console.log('Cows data mutated');
    };
  
    return (
      <AnimationAppear duration={0.5}>
        <WhiteBackground>
          <div style={{ marginBottom: 16 }}>
            <ReviewImportCow onReviewData={handleReviewData} />
            <ButtonComponent
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              style={{ marginLeft: 16 }}
            >
              {t('Download Template')}
            </ButtonComponent>
            <div style={{ marginTop: 10 }}>
              <span style={{ fontWeight: 'bold' }}>
                {t('Số lần đã import:')} {importTimes ?? 0}
              </span>
            </div>
          </div>
  
          <Divider className="my-4" />
          <TableComponent
            loading={false}
            columns={columns}
            dataSource={reviewData ? formatSTT(reviewData) : []}
            onDataChange={handleDataChange}
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          />
          {reviewData.length > 0 && (
            <FloatButtonComponent.Group>
              {validateCows && validateHealthRecords && hasReviewErrors ? (
                <FloatButtonComponent
                  tooltip={t('Confirm')}
                  type="primary"
                  onClick={handleConfirmImport}
                  icon={<CheckOutlined />}
                  children={undefined}
                />
              ) : (
                <Popover
                  title={t('Error')}
                  content={
                    <div className="flex flex-col gap-2 text-base bg-white">
                      {!validateCows && (
                        <span className="text-red-500">
                          - {t('Some cows have invalid or missing fields (name, status, gender, origin, type)')}
                        </span>
                      )}
                      {!validateHealthRecords && (
                        <span className="text-red-500">
                          - {t('Some health records have invalid or missing statuses')}
                        </span>
                      )}
                      {!hasReviewErrors && (
                        <span className="text-red-500">
                          - {t('Please resolve review errors before submitting')}
                        </span>
                      )}
                    </div>
                  }
                >
                  <FloatButtonComponent
                    type="primary"
                    buttonType="volcano"
                    tooltip=""
                    icon={<MdErrorOutline />}
                    children={undefined}
                  />
                </Popover>
              )}
              <FloatButtonComponent.BackTop />
            </FloatButtonComponent.Group>
          )}
          {importSuccess && (
            <CreateBulkModal
              modal={modalControl}
              availableCows={availableCows}
              mutateCows={mutateCows}
            />
          )}
          <ModalListError
            visible={isErrorModalVisible}
            errors={reviewErrors}
            data={reviewData}
            onClose={handleCloseErrorModal}
            onSave={handleSaveErrorData}
          />
        </WhiteBackground>
      </AnimationAppear>
    );
  };
  
  export default ListCowImport;