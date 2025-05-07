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
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import ConfirmImport from './components/ConfirmImport';
import ReviewImportCow from './components/ReviewImportCow';
import ModalListError from './components/ModalListErrors';
import FloatButtonComponent from '@components/FloatButton/FloatButtonComponent';
import CreateBulkAfterImportCow from './components/CreateBulkAfterImport';
import toast from 'react-hot-toast';

interface ValidationError {
  field: string;
  message: string;
}

const validateCow = (cow: Cow, t: (key: string) => string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!cow.dateOfBirth || cow.dateOfBirth === '2') {
    errors.push({ field: 'dateOfBirth', message: t('Date of Birth is required') });
  } else {
    const dob = dayjs(cow.dateOfBirth, 'YYYY-MM-DD', true);
    if (!dob.isValid() || dob.isAfter(dayjs().subtract(10, 'month'))) {
      errors.push({ field: 'dateOfBirth', message: t('Cow must be at least 10 months old') });
    }
  }

  if (!cow.dateOfEnter || cow.dateOfEnter === '2') {
    errors.push({ field: 'dateOfEnter', message: t('Date of Enter is required') });
  } else {
    const doe = dayjs(cow.dateOfEnter, 'YYYY-MM-DD', true);
    if (!doe.isValid() || doe.isBefore(dayjs().startOf('day'))) {
      errors.push({ field: 'dateOfEnter', message: t('Date of Enter must be today or in the future') });
    }
  }

  if (!cow.cowOrigin) errors.push({ field: 'cowOrigin', message: t('Cow Origin is required') });
  if (!cow.cowTypeName) errors.push({ field: 'cowTypeName', message: t('Cow Type is required') });
  if (!cow.cowStatus) errors.push({ field: 'cowStatus', message: t('Cow Status is required') });
  if (!cow.healthInfoResponses[0]?.health?.heartRate) {
    errors.push({ field: 'heartRate', message: t('Heart Rate is required') });
  }
  if (!cow.healthInfoResponses[0]?.health?.ruminateActivity) {
    errors.push({ field: 'ruminateActivity', message: t('Ruminate Activity is required') });
  }
  if (!cow.healthInfoResponses[0]?.health?.chestCircumference) {
    errors.push({ field: 'chestCircumference', message: t('Chest Circumference is required') });
  }
  if (!cow.healthInfoResponses[0]?.health?.bodyLength) {
    errors.push({ field: 'bodyLength', message: t('Body Length is required') });
  }
  if (!cow.healthInfoResponses[0]?.health?.respiratoryRate) {
    errors.push({ field: 'respiratoryRate', message: t('Respiratory Rate is required') });
  }

  return errors;
};

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

  const successfulData = useMemo(() => {
    return reviewData.filter(cow => !cow.errorStrings || cow.errorStrings.length === 0);
  }, [reviewData]);

  const availableCows = useMemo((): Cow[] => {
    return importedCowIds.map((id, index) => {
      const reviewCow = successfulData[index] || {};
      const cowType = dataCowType?.find(
        (type) => type.name.toLowerCase() === (reviewCow.cowTypeName || reviewCow.cowType?.name)?.toLowerCase()
      ) || {
        cowTypeId: 0,
        name: reviewCow.cowTypeName || 'Unknown',
        description: '',
        status: 'exist' as const,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };

      return {
        cowId: id,
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
        inPen: reviewCow.inPen ?? false,
        penResponse: reviewCow.penResponse || null,
        key: reviewCow.key || id.toString(),
      } as Cow;
    });
  }, [importedCowIds, successfulData, dataCowType]);

  const { handleConfirmImport } = ConfirmImport({
    reviewData: successfulData,
    dataCowType,
    onImportSuccess: (cowIds, success) => {
      setImportedCowIds(cowIds);
      setImportSuccess(success);
      Modal.success({
        title: t('Đã nhập bò thành công'),
        okText: t('Tiếp theo'),
        okButtonProps: {
          style: { backgroundColor: '#15803D', borderColor: '#15803D' },
          className: 'shadow-lg text-base px-5 !w-fit duration-300',
        },
        onOk: () => {
          setIsBulkModalOpen(true);
        },
        onCancel: () => {},
      });
    },
    onFetchImportTimes: fetchImportTimes,
  });

  const validateCows = useMemo(() => {
    if (successfulData.length === 0) return false;
    return successfulData.every((cow) => {
      const errors = validateCow(cow, t);
      return errors.length === 0;
    });
  }, [successfulData]);

  const validateHealthRecords = useMemo(() => {
    if (successfulData.length === 0) return false;
    return successfulData.every((cow) => {
      return (
        cow.healthInfoResponses[0]?.health?.status &&
        ['good', 'poor', 'critical', 'fair', 'recovering'].includes(cow.healthInfoResponses[0]?.health?.status)
      );
    });
  }, [successfulData]);

  const hasReviewErrors = useMemo(() => {
    return reviewErrors.length === 0;
  }, [reviewErrors]);

  useEffect(() => {
    console.log('successfulData:', successfulData);
    console.log('validateCows:', validateCows);
    console.log('validateHealthRecords:', validateHealthRecords);
    console.log('hasReviewErrors:', hasReviewErrors);
  }, [successfulData, validateCows, validateHealthRecords, hasReviewErrors]);

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
    setReviewData(dataWithKeys);
    setReviewErrors(errors);
    setImportSuccess(false);
    setIsErrorModalVisible(errors.length > 0);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalVisible(false);
    setReviewErrors([]);
  };

  const handleSaveErrorData = (updatedData: Cow[]) => {
    setReviewData((prev) =>
      prev.map((item) => {
        const updatedItem = updatedData.find((updated) => updated.key === item.key);
        return updatedItem ? { ...updatedItem } : item;
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
      render: (data, record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some(
          (err) =>
            err.field === 'dateOfBirth' &&
            (err.message === t('Date of Birth is required') || err.message === t('Cow must be at least 10 months old'))
        );
        return editingKey === record.key ? (
          <DatePickerComponent
            value={data ? dayjs(data) : null}
            onChange={(date) => handleChange(record.key, 'dateOfBirth', date)}
            disabledDate={(current) => current && current > dayjs().subtract(10, 'month').endOf('day')}
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{formatDateHour(data) || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'dateOfEnter',
      key: 'dateOfEnter',
      title: t('Date Of Enter'),
      sorter: (a: any, b: any) => new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
      filteredDate: true,
      editable: true,
      render: (data, record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some(
          (err) =>
            err.field === 'dateOfEnter' &&
            (err.message === t('Date of Enter is required') ||
              err.message === t('Date of Enter must be today or in the future'))
        );
        return editingKey === record.key ? (
          <DatePickerComponent
            value={data ? dayjs(data) : null}
            onChange={(date) => handleChange(record.key, 'dateOfEnter', date)}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{formatDateHour(data) || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      filterable: true,
      filterOptions: cowOriginFiltered(),
      editable: true,
      render: (data, record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some((err) => err.field === 'cowOrigin' && err.message === t('Cow Origin is required'));
        return editingKey === record.key ? (
          <SelectComponent
            value={t(formatStatusWithCamel(data))}
            options={cowOrigin()}
            onChange={(value) => handleChange(record.key, 'cowOrigin', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{t(formatStatusWithCamel(data)) || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: t('Gender'),
      render: () =>
          <IoMdFemale className="text-pink-600" size={20} />
    },
    {
      dataIndex: 'cowTypeName',
      key: 'cowType',
      title: t('Cow Type'),
      render: (data, record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some((err) => err.field === 'cowTypeName' && err.message === t('Cow Type is required'));
        return editingKey === record.key ? (
          <SelectComponent
            value={data || ''}
            options={dataCowType?.map((type) => ({ text: type.name, value: type.name })) || []}
            onChange={(value) => handleChange(record.key, 'cowTypeName', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data || '-'}</span>
        );
      },
      filterable: true,
      filterOptions: dataCowType?.map((type) => ({ text: type.name, value: type.name })) || [],
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow Status'),
      editable: true,
      render: (data, record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some((err) => err.field === 'cowStatus' && err.message === t('Cow Status is required'));
        return editingKey === record.key ? (
          <SelectComponent
            value={t(formatStatusWithCamel(data))}
            options={cowStatus()}
            onChange={(value) => handleChange(record.key, 'cowStatus', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{t(formatStatusWithCamel(data)) || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'healthRecordStatus',
      title: t('Health Status'),
      render: (data: HealthResponse[], record) =>
        editingKey === record.key ? (
          <SelectComponent
            value={t(formatStatusWithCamel(data[0]?.health?.status))}
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
          t(formatStatusWithCamel(data[0]?.health?.status)) || '-'
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
      render: (data: HealthResponse[], record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some((err) => err.field === 'heartRate' && err.message === t('Heart Rate is required'));
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.heartRate || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'respiratoryRate',
      title: t('Respiratory Rate (breaths/min)'),
      render: (data: HealthResponse[], record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some(
          (err) => err.field === 'respiratoryRate' && err.message === t('Respiratory Rate is required')
        );
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.respiratoryRate || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'ruminateActivity',
      title: t('Ruminate Activity (min/day)'),
      render: (data: HealthResponse[], record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some(
          (err) => err.field === 'ruminateActivity' && err.message === t('Ruminate Activity is required')
        );
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.ruminateActivity || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'chestCircumference',
      title: t('Chest Circumference (m)'),
      render: (data: HealthResponse[], record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some(
          (err) => err.field === 'chestCircumference' && err.message === t('Chest Circumference is required')
        );
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.chestCircumference || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'bodyLength',
      title: t('Body Length (m)'),
      render: (data: HealthResponse[], record) => {
        const errors = validateCow(record, t);
        const hasError = errors.some((err) => err.field === 'bodyLength' && err.message === t('Body Length is required'));
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.bodyLength || '-'}</span>
        );
      },
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
              onClick={() => handleSave(record)}
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

  const handleSave = (record: Cow) => {
    const errors = validateCow(record, t);
    if (errors.length > 0) {
      toast.error(errors[0].message);
      return;
    }
    setReviewData((prev) =>
      prev.map((item) => (item.key === record.key ? { ...item, ...record } : item))
    );
    setEditingKey(null);
    setReviewErrors([]);
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
              errorStrings: (item.errorStrings || []).filter((err) => {
                if (field === 'cowOrigin' && value) return err !== t('Cow Origin is required');
                if (field === 'cowTypeName' && value) return err !== t('Cow Type is required');
                if (field === 'cowStatus' && value) return err !== t('Cow Status is required');
                if (field === 'dateOfBirth' && value) {
                  return err !== t('Date of Birth is required') && err !== t('Cow must be at least 10 months old');
                }
                if (field === 'dateOfEnter' && value) {
                  return (
                    err !== t('Date of Enter is required') &&
                    err !== t('Date of Enter must be today or in the future')
                  );
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.heartRate) {
                  return err !== t('Heart Rate is required');
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.ruminateActivity) {
                  return err !== t('Ruminate Activity is required');
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.chestCircumference) {
                  return err !== t('Chest Circumference is required');
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.bodyLength) {
                  return err !== t('Body Length is required');
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.respiratoryRate) {
                  return err !== t('Respiratory Rate is required');
                }
                return true;
              }),
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
          dataSource={successfulData ? formatSTT(successfulData) : []}
          onDataChange={handleDataChange}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
        {successfulData.length > 0 && (
          <FloatButtonComponent.Group>
            {validateCows && validateHealthRecords && (!isErrorModalVisible || successfulData.length > 0) ? (
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
                        - {t('Some cows have invalid or missing fields (name, status, gender, origin, type, dates)')}
                      </span>
                    )}
                    {!validateHealthRecords && (
                      <span className="text-red-500">
                        - {t('Some health records have invalid or missing statuses')}
                      </span>
                    )}
                    {isErrorModalVisible && (
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
          <CreateBulkAfterImportCow
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