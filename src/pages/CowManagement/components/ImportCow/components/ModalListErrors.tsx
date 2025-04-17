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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { COW_TYPE_FILTER } from '@service/data/cowType';
import toast from 'react-hot-toast';

interface ModalListErrorProps {
    visible: boolean;
    errors: { source: string; message: string | string[] }[];
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

    // Log errors and data for debugging
    useEffect(() => {
        console.log('Errors in ModalListError:', errors);
        console.log('Data in ModalListError:', data);
        console.log('Error Cow Names:', errors.map((err) => err.message));
    }, [errors, data]);

    // Initialize localData when modal opens
    useEffect(() => {
        if (visible) {
            let formattedData: any[] = [];
            if (data.length > 0) {
                formattedData = data.map((item, index) => ({
                    ...item,
                    key: item.key || index.toString(),
                    errorMessage: item.errorStrings
                        ? item.errorStrings.join(', ')
                        : item.errorMessage || '-',
                }));
            } else {
                // Construct data from errors if data prop is empty
                const cowNames = errors
                    .map((err) => {
                        let message = '';
                        if (typeof err.message === 'string') {
                            message = err.message;
                        } else if (Array.isArray(err.message)) {
                            message = err.message.join(', ');
                        }
                        const [cowName] = message.split(':').map((s) => s.trim());
                        return cowName || '';
                    })
                    .filter((name) => name);
                formattedData = Array.from(new Set(cowNames)).map((name, index) => {
                    const cowError = data.find((item) => item.name === name) || {};
                    const healthError = data.find((item) => item.name === name)?.healthRecord || {};
                    return {
                        name,
                        key: index.toString(),
                        cowStatus: cowError.cowStatus || '',
                        dateOfBirth: cowError.dateOfBirth || '',
                        dateOfEnter: cowError.dateOfEnter || '',
                        cowOrigin: cowError.cowOrigin || '',
                        gender: cowError.gender || '',
                        cowTypeName: cowError.cowTypeName || '',
                        healthRecord: {
                            status: healthError.status || healthError.healthRecordStatus || '',
                            size: healthError.size || null,
                            bodyTemperature: healthError.bodyTemperature || null,
                            heartRate: healthError.heartRate || null,
                            respiratoryRate: healthError.respiratoryRate || null,
                            ruminateActivity: healthError.ruminateActivity || null,
                            chestCircumference: healthError.chestCircumference || null,
                            bodyLength: healthError.bodyLength || null,
                            description: healthError.description || null,
                        },
                        errorStrings: errors
                            .filter((err) => {
                                let message = '';
                                if (typeof err.message === 'string') {
                                    message = err.message;
                                } else if (Array.isArray(err.message)) {
                                    message = err.message.join(', ');
                                }
                                return message.startsWith(`${name}:`);
                            })
                            .map((err) => {
                                let message = '';
                                if (typeof err.message === 'string') {
                                    message = err.message;
                                } else if (Array.isArray(err.message)) {
                                    message = err.message.join(', ');
                                }
                                return message.split(':').slice(1).join(':').trim();
                            }),
                    };
                });
            }
            setLocalData(formattedData);
            console.log('Initialized localData:', formattedData);
        }
    }, [visible, data, errors]);

    // Filter errors and extract cow names
    const errorCowNames = errors
        .filter((err) => err.source === 'health' || err.source === 'cow')
        .map((err) => {
            let message = '';
            if (typeof err.message === 'string') {
                message = err.message;
            } else if (Array.isArray(err.message)) {
                message = err.message.join(', ');
            }
            const [cowName] = message.split(':').map((s) => s.trim());
            return cowName || '';
        })
        .filter((name) => name);

    console.log('Extracted errorCowNames:', errorCowNames);

    // Filter data to show only rows with errors and attach error messages
    const errorData = localData
        .filter((item) => errorCowNames.includes(item.name) || item.errorStrings?.length > 0)
        .map((item) => {
            const errorForCow = errors.filter((err) => {
                let message = '';
                if (typeof err.message === 'string') {
                    message = err.message;
                } else if (Array.isArray(err.message)) {
                    message = err.message.join(', ');
                }
                return message.startsWith(`${item.name}:`);
            });
            return {
                ...item,
                errorMessage: item.errorStrings
                    ? item.errorStrings.join(', ')
                    : errorForCow.length > 0
                        ? errorForCow
                            .map((err) =>
                                typeof err.message === 'string'
                                    ? err.message.split(':').slice(1).join(':').trim()
                                    : Array.isArray(err.message)
                                        ? err.message.join(', ')
                                        : '-'
                            )
                            .join('; ')
                        : '-',
            };
        });

    console.log('Computed errorData:', errorData);

    const handleEdit = (key: string) => setEditingKey(key);

    const handleCancel = () => setEditingKey(null);

    const handleSave = (record: any) => {
        // Validate required fields
        if (!record.cowOrigin && errorData.some((item) => item.errorMessage.includes('Cow Origin is required'))) {
            toast.error(t('Cow Origin is required'));
            return;
        }
        if (!record.healthRecord?.heartRate && errorData.some((item) => item.errorMessage.includes('Heart Rate is required'))) {
            toast.error(t('Heart Rate is required'));
            return;
        }
        if (!record.healthRecord?.ruminateActivity && errorData.some((item) => item.errorMessage.includes('Ruminate Activity is required'))) {
            toast.error(t('Ruminate Activity is required'));
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
        // Validate all records before saving
        const hasErrors = localData.some((record) => {
            if (!record.cowOrigin && errorData.some((item) => item.errorMessage.includes('Cow Origin is required'))) {
                return true;
            }
            if (!record.healthRecord?.heartRate && errorData.some((item) => item.errorMessage.includes('Heart Rate is required'))) {
                return true;
            }
            if (!record.healthRecord?.ruminateActivity && errorData.some((item) => item.errorMessage.includes('Ruminate Activity is required'))) {
                return true;
            }
            return false;
        });

        if (hasErrors) {
            toast.error(t('Please fix all errors before saving.'));
            return;
        }

        onSave(localData);
        setLocalData([]);
        onClose();
    };

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
                        style={hasError ? { borderColor: 'red', width: '100px' } : { width: '100px' }} // Tăng chiều rộng mặc định
                        dropdownStyle={{ minWidth: '120px' }} // Tăng kích thước dropdown khi mở
                    />
                ) : (
                    <span style={hasError ? { color: 'red' } : {}}>
                        {formatStatusWithCamel(data) || '-'}
                    </span>
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
                const hasError = record.errorMessage?.includes('Gender is required'); // Thêm kiểm tra lỗi nếu cần
                return editingKey === record.key ? (
                    <SelectComponent
                        value={data}
                        options={[
                            { value: 'male', label: 'Đực' },
                            { value: 'female', label: 'Cái' },
                        ]}
                        onChange={(value) => handleChange(record.key, 'gender', value)}
                        style={hasError ? { borderColor: 'red', width: '100px' } : { width: '100px' }}
                        dropdownStyle={{ minWidth: '120px' }}
                    />
                ) : data === 'male' ? (
                    <IoMdMale className="text-blue-600" size={20} />
                ) : data === 'female' ? (
                    <IoMdFemale className="text-pink-600" size={20} />
                ) : (
                    '-'
                );
            },
        },
        {
            dataIndex: 'cowTypeName',
            key: 'cowType',
            title: t('Cow Type'),
            render: (data) => data || '-',
            filterable: true,
            filterOptions: COW_TYPE_FILTER(),
        },
        {
            dataIndex: 'cowStatus',
            key: 'cowStatus',
            title: t('Cow Status'),
            editable: true,
            render: (data, record) => {
                const hasError = record.errorMessage?.includes('Cow Status is required'); // Thêm kiểm tra lỗi nếu cần
                return editingKey === record.key ? (
                    <SelectComponent
                        value={formatStatusWithCamel(data)}
                        options={cowStatus()}
                        onChange={(value) => handleChange(record.key, 'cowStatus', value)}
                        style={hasError ? { borderColor: 'red', width: '100px' } : { width: '100px' }}
                        dropdownStyle={{ minWidth: '120px' }}
                    />
                ) : (
                    formatStatusWithCamel(data) || '-'
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
            render: (data, record) => {
                const hasError = record.errorMessage?.includes('Heart Rate is required');
                return editingKey === record.key ? (
                    <InputNumber
                        min={0}
                        value={data?.heartRate}
                        onChange={(value) =>
                            handleChange(record.key, 'healthRecord', {
                                ...data,
                                heartRate: value,
                            })
                        }
                        style={hasError ? { borderColor: 'red' } : {}}
                    />
                ) : (
                    <span style={hasError ? { color: 'red' } : {}}>
                        {data?.heartRate || '-'}
                    </span>
                );
            },
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
            render: (data, record) => {
                const hasError = record.errorMessage?.includes('Ruminate Activity is required');
                return editingKey === record.key ? (
                    <InputNumber
                        min={0}
                        value={data?.ruminateActivity}
                        onChange={(value) =>
                            handleChange(record.key, 'healthRecord', {
                                ...data,
                                ruminateActivity: value,
                            })
                        }
                        style={hasError ? { borderColor: 'red' } : {}}
                    />
                ) : (
                    <span style={hasError ? { color: 'red' } : {}}>
                        {data?.ruminateActivity || '-'}
                    </span>
                );
            },
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