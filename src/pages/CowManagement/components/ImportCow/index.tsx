import {
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { Cow } from '@model/Cow/Cow';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { formatDateHour, formatStatusWithCamel, formatSTT } from '@utils/format';
import ButtonComponent from '@components/Button/ButtonComponent';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import InputComponent from '@components/Input/InputComponent';
import SelectComponent from '@components/Select/SelectComponent';
import { CowType } from '@model/Cow/CowType';
import CreateBulkModal from '@pages/CowPenManagement/components/MoveCowManagement/components/ListCowNotInPen/components/CreateBulk/CreateBulk';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import { Divider, InputNumber, message, Modal } from 'antd'; // Thêm Modal
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import ConfirmImport from './components/ConfirmImport';
import ReviewImportCow from './components/ReviewImportCow';

const ListCowImport = () => {
    const { t } = useTranslation();
    const [reviewData, setReviewData] = useState<Cow[]>([]);
    const [reviewErrors, setReviewErrors] = useState<any[]>([]);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const { data: dataCowType } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
    const { data: importTimes, trigger: fetchImportTimes } = useFetcher<number>(
        COW_TYPE_PATH.IMPORT_TIME,
        'GET'
    );
    const [importedCowIds, setImportedCowIds] = useState<number[]>([]);
    const [importSuccess, setImportSuccess] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const modalControl = {
        open: isBulkModalOpen,
        openModal: () => setIsBulkModalOpen(true),
        closeModal: () => setIsBulkModalOpen(false),
    };

    const availableCows = importedCowIds.map((id, index) => ({
        cowId: id,
        name: reviewData[index]?.name || `Cow ${id}`,
        cowStatus: reviewData[index]?.cowStatus || 'active',
    }));

    const { handleConfirmImport, isImporting } = ConfirmImport({
        reviewData,
        dataCowType,
        onImportSuccess: (cowIds, success) => {
            setImportedCowIds(cowIds);
            setImportSuccess(success);
            // Hiển thị popup xác nhận thay vì mở modal ngay lập tức
            Modal.confirm({
                title: t('Xác nhận di chuyển bò'),
                content: t('Bạn có muốn di chuyển các con bò vừa import không?'),
                okText: t('Có'),
                cancelText: t('Không'),
                onOk: () => {
                    setIsBulkModalOpen(true); // Chỉ mở modal nếu người dùng đồng ý
                },
                onCancel: () => {
                    // Không làm gì nếu người dùng từ chối
                },
            });
        },
        onFetchImportTimes: fetchImportTimes,
    });

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
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' },
            ],
            editable: true,
            render: (data, record) =>
                editingKey === record.key ? (
                    <SelectComponent
                        value={data}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
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
                        value={data?.status}
                        options={HEALTH_RECORD_STATUS()}
                        onChange={(value) =>
                            handleChange(record.key, 'healthRecord', {
                                ...data,
                                status: value,
                            })
                        }
                    />
                ) : (
                    data?.status || '-'
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
                                style={{ marginLeft: 8 }}
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
        window.location.href =
            'https://api.dairyfarmfpt.website/api/v1/cows/templates/download/cow-bulk-excel';
        message.success('Đã bắt đầu tải template!');
    };

    const handleReviewData = (data: any[], errors: any[]) => {
        const dataWithKeys = data.map((item, index) => ({
            ...item,
            key: index.toString(),
            name: item.name || '',
            dateOfBirth: item.dateOfBirth || '',
            dateOfEnter: item.dateOfEnter || '',
            cowOrigin: item.cowOrigin || '',
            gender: item.gender || '',
            cowTypeName: item.cowTypeName || null,
            cowStatus: item.cowStatus || '',
            healthRecord: item.healthRecord || {},
            description: item.description || '',
        }));
        setReviewData(dataWithKeys);
        setReviewErrors(errors);
        setImportSuccess(false); // Reset importSuccess khi review lại
        if (errors.length > 0) {
            message.error(`Có lỗi trong dữ liệu: ${errors.join(', ')}`);
        }
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
                                : value,
                    }
                    : item
            )
        );
    };

    const handleDataChange = (newData: any[]) => {
        setReviewData(newData);
    };

    const mutateCows = () => {
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
                    {reviewData.length > 0 && (
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <ButtonComponent
                                type="primary"
                                onClick={handleConfirmImport}
                                loading={isImporting}
                                disabled={isImporting || reviewErrors.length > 0}
                            >
                                {isImporting ? 'Đang lưu...' : 'Confirm Import'}
                            </ButtonComponent>
                        </div>
                    )}
                </div>
                <Divider className="my-4" />
                <TableComponent
                    loading={false}
                    columns={columns}
                    dataSource={reviewData ? formatSTT(reviewData) : []}
                    onDataChange={handleDataChange}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 5, position: ['bottomCenter'] }}
                />
                {importSuccess && (
                    <CreateBulkModal
                        modal={modalControl}
                        availableCows={availableCows as any}
                        mutateCows={mutateCows}
                    />
                )}
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default ListCowImport;