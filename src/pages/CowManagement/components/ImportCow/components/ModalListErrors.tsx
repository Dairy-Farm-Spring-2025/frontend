import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import { formatStatusWithCamel } from '@utils/format';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { COW_TYPE_FILTER } from '@service/data/cowType';
import toast from 'react-hot-toast';
import { Cow, HealthResponse } from '@model/Cow/Cow';

interface ValidationError {
  field: string;
  message: string;
}

interface ModalListErrorProps {
  visible: boolean;
  errors: { source: string; message: string }[];
  data: Cow[];
  onClose: () => void;
  onSave: (updatedData: Cow[]) => void;
}

const validateCow = (cow: Cow): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!cow.cowOrigin) errors.push({ field: 'cowOrigin', message: 'Cow Origin is required' });
  if (!cow.cowTypeName) errors.push({ field: 'cowTypeName', message: 'Cow Type is required' });
  if (!cow.gender) errors.push({ field: 'gender', message: 'Gender is required' });
  if (!cow.healthInfoResponses[0]?.health?.heartRate) {
    errors.push({ field: 'heartRate', message: 'Heart Rate is required' });
  }
  if (!cow.healthInfoResponses[0]?.health?.ruminateActivity) {
    errors.push({ field: 'ruminateActivity', message: 'Ruminate Activity is required' });
  }
  if (!cow.healthInfoResponses[0]?.health?.chestCircumference) {
    errors.push({ field: 'chestCircumference', message: 'Chest Circumference is required' });
  }
  if (!cow.healthInfoResponses[0]?.health?.bodyLength) {
    errors.push({ field: 'bodyLength', message: 'Body Length is required' });
  }
  return errors;
};

const ModalListError = ({ visible, errors, data, onClose, onSave }: ModalListErrorProps) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [localData, setLocalData] = useState<Cow[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      const formattedData = data.map((item, index) => {
        // Extract health errors for this cow from the errors prop
        const healthErrors = errors
          .filter((err) => err.source === 'health' && err.message.startsWith(`${item.name}:`))
          .map((err) => err.message.split(':').slice(1).join(':').trim());

        return {
          ...item,
          key: item.key || index.toString(),
          errorStrings: [...(item.errorStrings || []), ...healthErrors], // Combine cow and health errors
          healthInfoResponses: item.healthInfoResponses || [],
          cowTypeName: item.cowTypeName || item.cowType?.name || '',
        };
      });
      setLocalData(formattedData);
      console.log('Initialized localData:', formattedData);
      console.log('Errors:', errors);
    }
  }, [visible, data, errors]);

  const errorData = useMemo(() => {
    const errorCowNames = errors
      .filter((err) => err.source === 'health' || err.source === 'cow')
      .map((err) => err.message.split(':')[0].trim())
      .filter((name) => name);

    return localData
      .filter((item) => errorCowNames.includes(item.name) || (item.errorStrings && item.errorStrings.length > 0))
      .map((item) => ({
        ...item,
        errorMessage: item.errorStrings?.join('; ') || '-', // Use combined errorStrings
      }));
  }, [localData, errors]);

  const handleEdit = (key: string) => setEditingKey(key);

  const handleCancel = () => setEditingKey(null);

  const handleSave = (record: Cow) => {
    const errors = validateCow(record);
    if (errors.length > 0) {
      toast.error(t(errors[0].message));
      return;
    }
    setEditingKey(null);
  };

  const handleChange = (key: string, field: string, value: any) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [field]: field === 'dateOfBirth' || field === 'dateOfEnter'
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
                if (field === 'cowOrigin' && value) return err !== 'Cow Origin is required';
                if (field === 'cowTypeName' && value) return err !== 'Cow Type is required';
                if (field === 'gender' && value) return err !== 'Gender is required';
                if (field === 'healthInfoResponses' && value[0]?.health?.heartRate) {
                  return err !== 'Heart Rate is required';
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.ruminateActivity) {
                  return err !== 'Ruminate Activity is required';
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.chestCircumference) {
                  return err !== 'Chest Circumference is required';
                }
                if (field === 'healthInfoResponses' && value[0]?.health?.bodyLength) {
                  return err !== 'Body Length is required';
                }
                return true;
              }),
            }
          : item
      )
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const invalidCows = localData.filter((record) => validateCow(record).length > 0);
      if (invalidCows.length > 0) {
        toast.error(t('Please fix all errors before saving.'));
        return;
      }
      await onSave(localData);
      setLocalData([]);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const cowTypeFilterOptions = COW_TYPE_FILTER().length > 0
    ? COW_TYPE_FILTER()
    : [{ text: 'Ayrshire', value: 'Ayrshire' }];

  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Cow Name'),
      render: (data) => data || '-',
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      filterable: true,
      filterOptions: cowOriginFiltered(),
      editable: true,
      render: (data, record) => {
        const hasError = record.errorMessage?.includes('Cow Origin is required');
        return editingKey === record.key ? (
          <SelectComponent
            value={formatStatusWithCamel(data)}
            options={cowOrigin()}
            onChange={(value) => handleChange(record.key, 'cowOrigin', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{formatStatusWithCamel(data) || '-'}</span>
        );
      },
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
      render: (data, record) => {
        const hasError = record.errorMessage?.includes('Gender is required');
        return editingKey === record.key ? (
          <SelectComponent
            value={data}
            options={[
              { value: 'male', label: 'Đực' },
              { value: 'female', label: 'Cái' },
            ]}
            onChange={(value) => handleChange(record.key, 'gender', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : data === 'male' ? (
          <IoMdMale className="text-blue-600" size={20} />
        ) : data === 'female' ? (
          <IoMdFemale className="text-pink-600" size={20} />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>-</span>
        );
      },
    },
    {
      dataIndex: 'cowTypeName',
      key: 'cowType',
      title: t('Cow Type'),
      filterable: true,
      filterOptions: cowTypeFilterOptions,
      editable: true,
      render: (data, record) => {
        const hasError = record.errorMessage?.includes('Cow Type is required');
        return editingKey === record.key ? (
          <SelectComponent
            value={data || ''}
            options={cowTypeFilterOptions}
            onChange={(value) => handleChange(record.key, 'cowTypeName', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow Status'),
      editable: true,
      render: (data, record) => {
        const hasError = record.errorMessage?.includes('Cow Status is required');
        return editingKey === record.key ? (
          <SelectComponent
            value={formatStatusWithCamel(data)}
            options={cowStatus()}
            onChange={(value) => handleChange(record.key, 'cowStatus', value)}
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{formatStatusWithCamel(data) || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      title: t('Date of Birth'),
      editable: true,
      render: (data, record) =>
        editingKey === record.key ? (
          <DatePicker
            value={data ? dayjs(data) : null}
            onChange={(value) => handleChange(record.key, 'dateOfBirth', value)}
            format="YYYY-MM-DD"
          />
        ) : (
          data ? dayjs(data).format('YYYY-MM-DD') : '-'
        ),
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'healthRecordStatus',
      title: t('Health Status'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Health Status');
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red', minWidth: '120px' } : { minWidth: '120px' }}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>
            {formatStatusWithCamel(data[0]?.health?.status) || '-'}
          </span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'healthRecordSize',
      title: t('Size (m)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Size is required');
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>{data[0]?.health?.size || '-'}</span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'bodyTemperature',
      title: t('Body Temperature (°C)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Body Temperature is required');
        return editingKey === record.key ? (
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
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>
            {data[0]?.health?.bodyTemperature || '-'}
          </span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'heartRate',
      title: t('Heart Rate (bpm)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Heart Rate is required');
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
        const hasError = record.errorMessage?.includes('Respiratory Rate is required');
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
          <span style={hasError ? { color: 'red' } : {}}>
            {data[0]?.health?.respiratoryRate || '-'}
          </span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'ruminateActivity',
      title: t('Ruminate Activity (min/day)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Ruminate Activity is required');
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
          <span style={hasError ? { color: 'red' } : {}}>
            {data[0]?.health?.ruminateActivity || '-'}
          </span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'chestCircumference',
      title: t('Chest Circumference (m)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Chest Circumference is required');
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
          <span style={hasError ? { color: 'red' } : {}}>
            {data[0]?.health?.chestCircumference || '-'}
          </span>
        );
      },
    },
    {
      dataIndex: 'healthInfoResponses',
      key: 'bodyLength',
      title: t('Body Length (m)'),
      render: (data: HealthResponse[], record) => {
        const hasError = record.errorMessage?.includes('Body Length is required');
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
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      title: t('Error Message'),
      render: (data) => <span style={{ color: 'red' }}>{data || '-'}</span>,
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
          <ButtonComponent
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key)}
            style={{ marginRight: 8 }}
            shape="circle"
            type="primary"
          />
        ),
    },
  ];

  return (
    <ModalComponent
      title={t('Fix Import Errors')}
      open={visible}
      onCancel={onClose}
      footer={[
        <ButtonComponent key="cancel" onClick={onClose} disabled={isSaving}>
          {t('Cancel')}
        </ButtonComponent>,
        <ButtonComponent key="save" type="primary" onClick={handleSaveAll} loading={isSaving}>
          {t('Save')}
        </ButtonComponent>,
      ]}
      width={2000}
      aria-label="Fix import errors modal"
    >
      <TableComponent
        loading={false}
        columns={columns}
        dataSource={errorData}
        scroll={{ x: 'max-content' }}
        pagination={false}
        aria-label="Cow import error table"
      />
    </ModalComponent>
  );
};

export default ModalListError;