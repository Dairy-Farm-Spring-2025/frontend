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
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

interface ModalListErrorProps {
  visible: boolean;
  errors: { source: string; message: string }[];
  data: any[];
  onClose: () => void;
  onSave: (updatedData: any[]) => void;
}

const ModalListError = ({
  visible,
  errors,
  data,
  onClose,
  onSave,
}: ModalListErrorProps) => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [localData, setLocalData] = useState<any[]>([]);

  // Log errors for debugging
  useEffect(() => {
    console.log('Errors in ModalListError:', errors);
    console.log('Data in ModalListError:', data);
  }, [errors, data]);

  // Initialize localData when modal opens
  useEffect(() => {
    if (visible && localData.length === 0 && data.length > 0) {
      setLocalData(
        data.map((item, index) => ({
          ...item,
          key: item.key || index.toString(),
        }))
      );
    }
  }, [visible, data, localData.length]);

  // Filter errors and extract cow names
  const errorCowNames = errors
    .filter((err) => err.source === 'health' && typeof err.message === 'string')
    .map((err) => {
      const [cowName] = err.message.split(':').map((s) => s.trim());
      return cowName || '';
    })
    .filter((name) => name);

  // Filter data to show only rows with errors and attach error messages
  const errorData = localData
    .filter((item) => errorCowNames.includes(item.name))
    .map((item) => {
      const errorForCow = errors.find((err) =>
        err.message.startsWith(`${item.name}:`)
      );
      return {
        ...item,
        errorMessage: errorForCow
          ? errorForCow.message.split(':').slice(1).join(':').trim()
          : '-',
      };
    });

  const handleEdit = (key: string) => setEditingKey(key);

  const handleCancel = () => setEditingKey(null);

  const handleSave = () => {
    setEditingKey(null);
  };

  const handleChange = (key: string, field: string, value: any) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [field]:
                field === 'dateOfBirth' || field === 'dateOfEnter'
                  ? value
                    ? dayjs(value).format('YYYY-MM-DD')
                    : ''
                  : field === 'healthRecord'
                  ? { ...item.healthRecord, ...value }
                  : value,
            }
          : item
      )
    );
  };

  const handleSaveAll = () => {
    onSave(localData);
    setLocalData([]);
    onClose();
  };

  const columns: Column[] = [
    {
      dataIndex: 'key',
      key: 'key',
      title: '#',
      render: (_, __, index) => (index + 1).toString(),
    },
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
      filterOptions: [
        { text: 'Đực', value: 'male' },
        { text: 'Cái', value: 'female' },
      ],
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
      dataIndex: 'healthRecord',
      key: 'healthRecordStatus',
      title: t('Health Status'),
      render: (data, record) =>
        editingKey === record.key ? (
          <SelectComponent
            value={formatStatusWithCamel(data?.status)}
            options={HEALTH_RECORD_STATUS()}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                status: value,
              })
            }
          />
        ) : (
          formatStatusWithCamel(data?.status) || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'healthRecordSize',
      title: t('Size (m)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.size}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', { ...data, size: value })
            }
          />
        ) : (
          data?.size || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'bodyTemperature',
      title: t('Body Temperature (°C)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.bodyTemperature}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                bodyTemperature: value,
              })
            }
          />
        ) : (
          data?.bodyTemperature || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'heartRate',
      title: t('Heart Rate (bpm)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.heartRate}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                heartRate: value,
              })
            }
          />
        ) : (
          data?.heartRate || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'respiratoryRate',
      title: t('Respiratory Rate (breaths/min)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.respiratoryRate}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                respiratoryRate: value,
              })
            }
          />
        ) : (
          data?.respiratoryRate || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'ruminateActivity',
      title: t('Ruminate Activity (min/day)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.ruminateActivity}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                ruminateActivity: value,
              })
            }
          />
        ) : (
          data?.ruminateActivity || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'chestCircumference',
      title: t('Chest Circumference (m)'),
      render: (data, record) =>
        editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.chestCircumference}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                chestCircumference: value,
              })
            }
          />
        ) : (
          data?.chestCircumference || '-'
        ),
    },
    {
      dataIndex: 'healthRecord',
      key: 'bodyLength',
      title: t('Body Length (m)'),
      render: (data, record) => {
        const hasError = record.errorMessage?.includes('Body Length');
        return editingKey === record.key ? (
          <InputNumber
            min={0}
            value={data?.bodyLength}
            onChange={(value) =>
              handleChange(record.key, 'healthRecord', {
                ...data,
                bodyLength: value,
              })
            }
            style={hasError ? { borderColor: 'red' } : {}}
          />
        ) : (
          <span style={hasError ? { color: 'red' } : {}}>
            {data?.bodyLength || '-'}
          </span>
        );
      },
    },
    // {
    //     dataIndex: 'errorMessage',
    //     key: 'errorMessage',
    //     title: t('Error Message'),
    //     render: (data) => <span style={{ color: 'red' }}>{data || '-'}</span>,
    // },
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
        <ButtonComponent key="cancel" onClick={onClose}>
          {t('Cancel')}
        </ButtonComponent>,
        <ButtonComponent key="save" type="primary" onClick={handleSaveAll}>
          {t('Save')}
        </ButtonComponent>,
      ]}
      width={2000}
    >
      <TableComponent
        loading={false}
        columns={columns}
        dataSource={errorData}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    </ModalComponent>
  );
};

export default ModalListError;
