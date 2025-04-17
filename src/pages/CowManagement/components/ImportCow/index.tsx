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
import { Cow, HealthResponse } from '@model/Cow/Cow';
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
import { Divider, InputNumber, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import ConfirmImport from './components/ConfirmImport';
import ReviewImportCow from './components/ReviewImportCow';
import ModalListError from './components/ModalListErrors';

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
            Modal.success({
                title: t('Đã nhập bò thành công'),
                okText: t('Tiếp theo'),
                onOk: () => {
                    setIsBulkModalOpen(true);
                },
                onCancel: () => { },
            });
        },
        onFetchImportTimes: fetchImportTimes,
    });

    // Only include relevant changes for brevity
    const handleReviewData = (data: Cow[], errors: { source: string; message: string }[]) => {
        const dataWithKeys = data.map((item, index) => ({
            ...item,
            key: item.key || index.toString(),
            name: item.name || '',
            dateOfBirth: item.dateOfBirth || '',
            dateOfEnter: item.dateOfEnter || '',
            cowOrigin: item.cowOrigin || '',
            gender: item.gender || '',
            cowTypeName: item.cowTypeName || item.cowType?.name || '', // Ensure cowTypeName is preserved
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

        if (errors.length > 0) {
            setIsErrorModalVisible(true);
        }
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

    // Rest of the component remains unchanged
    // Include columns, handleEdit, handleSave, handleDelete, handleCancel, handleChange, handleDataChange, mutateCows, and JSX as in the previous version
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
            filterOptions: [
                { text: 'Ayrshire', value: 'Ayrshire' },
                // Add more as needed
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
                    pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                />
                {importSuccess && (
                    <CreateBulkModal modal={modalControl} availableCows={availableCows as any} mutateCows={mutateCows} />
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