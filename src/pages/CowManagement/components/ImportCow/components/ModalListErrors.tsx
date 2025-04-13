import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from '@components/Modal/ModalComponent';
import ButtonComponent from '@components/Button/ButtonComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import InputComponent from '@components/Input/InputComponent';
import SelectComponent from '@components/Select/SelectComponent';
import InputNumber from 'antd/es/input-number';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import dayjs from 'dayjs';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';

interface ModalListErrorProps {
    visible: boolean;
    errors: { source: string; message: string }[];
    data: any[]; // Dữ liệu từ reviewData
    onClose: () => void;
    onSave: (updatedData: any[]) => void; // Callback để cập nhật reviewData
}

const ModalListError = ({ visible, errors, data, onClose, onSave }: ModalListErrorProps) => {
    const { t } = useTranslation();
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [localData, setLocalData] = useState<any[]>([]);

    // Lọc dữ liệu chỉ hiển thị các dòng có lỗi
    const errorCowNames = errors
        .filter((err) => err.source === 'health')
        .map((err) => err.message.split(':')[0].trim()); // Lấy tên bò từ lỗi, ví dụ: "Cow2" từ "Cow2: Body Length is required"
    const errorData = data.filter((item) => errorCowNames.includes(item.name));

    // Khởi tạo localData khi modal mở
    if (visible && localData.length === 0 && errorData.length > 0) {
        setLocalData(errorData);
    }

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
                                : value,
                    }
                    : item
            )
        );
    };

    const handleSaveAll = () => {
        onSave(localData); // Gọi callback để cập nhật reviewData
        setLocalData([]); // Reset localData
        onClose(); // Đóng modal
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
            sorter: (a: any, b: any) =>
                new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
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
            sorter: (a: any, b: any) =>
                new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
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
            render: (data, record) =>
                editingKey === record.key ? (
                    <InputNumber
                        min={0}
                        value={data?.bodyLength}
                        onChange={(value) =>
                            handleChange(record.key, 'healthRecord', {
                                ...data,
                                bodyLength: value,
                            })
                        }
                    />
                ) : (
                    data?.bodyLength || '-'
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
                    <>
                        <ButtonComponent
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.key)}
                            style={{ marginRight: 8 }}
                            shape="circle"
                            type="primary"
                        />
                    </>
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
                dataSource={localData}
                scroll={{ x: 'max-content' }}
                pagination={false}
            />
        </ModalComponent>
    );
};

export default ModalListError;