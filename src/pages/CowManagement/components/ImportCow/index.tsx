import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { Cow } from '@model/Cow/Cow';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { formatDateHour, formatSTT } from '@utils/format';

import { Button, Divider, message, InputNumber } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import ImportCow from './components/ImportCow';
import ButtonComponent from '@components/Button/ButtonComponent';
import InputComponent from '@components/Input/InputComponent';
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import SelectComponent from '@components/Select/SelectComponent';
import dayjs from 'dayjs';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import CreateBulkModal from '@pages/CowPenManagement/components/MoveCowManagement/components/ListCowNotInPen/components/CreateBulk/CreateBulk';

const ListCowImport = () => {
    const { t } = useTranslation();
    const [reviewData, setReviewData] = useState<Cow[]>([]);
    const [reviewErrors, setReviewErrors] = useState<any[]>([]);
    const { trigger: importTrigger, isLoading: isImporting } = useFetcher(COW_PATH.CREATE_BULK, 'POST', 'application/json');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const { data: dataCowType } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
    const { data: importTimes, trigger: fetchImportTimes } = useFetcher<number>(COW_TYPE_PATH.IMPORT_TIME, 'GET');
    const [importedCowIds, setImportedCowIds] = useState<number[]>([]);
    const [importSuccess, setImportSuccess] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); // Trạng thái mở/đóng CreateBulkModal

    // Modal control object cho CreateBulkModal
    const modalControl = {
        open: isBulkModalOpen,
        openModal: () => setIsBulkModalOpen(true),
        closeModal: () => setIsBulkModalOpen(false),
    };

    // Tạo danh sách availableCows từ importedCowIds và reviewData
    const availableCows = importedCowIds.map((id, index) => ({
        cowId: id,
        name: reviewData[index]?.name || `Cow ${id}`,
        cowStatus: reviewData[index]?.cowStatus || 'active',
    }));

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
            // render: (data, record) =>
            //     editingKey === record.key ? (
            //         <SelectComponent
            //             value={data}
            //             options={cowOrigin()}
            //             onChange={(value) => handleChange(record.key, 'cowOrigin', value)}
            //         />
            //     ) : (
            //         getLabelByValue(data, cowOrigin()) || '-'
            //     ),
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
                ) : (
                    data === 'male' ? (
                        <IoMdMale className="text-blue-600" size={20} />
                    ) : (
                        <IoMdFemale className="text-pink-600" size={20} />
                    )
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
            render: (data) => data || '-',
            // render: (data, record) =>
            //     editingKey === record.key ? (
            //         <SelectComponent
            //             value={data}
            //             options={cowStatus()}
            //             onChange={(value) => handleChange(record.key, 'cowStatus', value)}
            //         />
            //     ) : (
            //         getLabelByValue(data, cowStatus()) || '-'
            //     ),
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
                            handleChange(record.key, 'healthRecord', { ...data, status: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, bodyTemperature: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, heartRate: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, respiratoryRate: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, ruminateActivity: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, chestCircumference: value })
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
                            handleChange(record.key, 'healthRecord', { ...data, bodyLength: value })
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
            render: (_, record) =>
                editingKey === record.key ? (
                    <>
                        <ButtonComponent
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            style={{ marginRight: 8 }}
                        />
                        <ButtonComponent icon={<CloseOutlined />} onClick={handleCancel} />
                    </>
                ) : (
                    !importSuccess && ( // Chỉ hiển thị Edit và Delete nếu chưa import thành công
                        <>
                            <ButtonComponent
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record.key)}
                                style={{ marginRight: 8 }}
                            />
                            <ButtonComponent
                                style={{ marginLeft: 8 }}
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.key)}
                                danger
                            />
                        </>
                    )
                ),
        },
    ];

    const handleDownloadTemplate = () => {
        window.location.href = "https://api.dairyfarmfpt.website/api/v1/cows/templates/download/cow-bulk-excel";
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
                        [field]: field === 'dateOfBirth' || field === 'dateOfEnter'
                            ? (value ? dayjs(value).format('YYYY-MM-DD') : '')
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
        // Hàm này có thể được dùng để cập nhật lại danh sách bò nếu cần
        console.log('Cows data mutated');
    };

    const handleConfirmImport = async () => {
        if (reviewData.length === 0) {
            message.error('Không có dữ liệu để import!');
            return;
        }

        try {
            const validCowOrigins = cowOrigin().map((origin: any) => origin.value);
            const validCowStatuses = cowStatus().map((status: any) => status.value);
            const validCowTypes = dataCowType?.map((type: any) => type.name) || [];

            const invalidCows = reviewData.filter((cow: any) => {
                return (
                    !cow.name?.trim() ||
                    !cow.cowStatus || !validCowStatuses.includes(cow.cowStatus) ||
                    !cow.gender || !['male', 'female'].includes(cow.gender) ||
                    !cow.cowOrigin || !validCowOrigins.includes(cow.cowOrigin) ||
                    !cow.cowTypeName || !validCowTypes.includes(cow.cowTypeName)
                );
            });

            if (invalidCows.length > 0) {
                console.error('Invalid cows:', invalidCows);
                message.error('Một số con bò có thông tin không hợp lệ (name, cowStatus, gender, cowOrigin, cowTypeName)!');
                return;
            }

            const invalidHealthRecords = reviewData.filter((cow: any) => {
                return (
                    !cow.healthRecord?.status ||
                    !['good', 'poor', 'critical', 'fair', 'recovering'].includes(cow.healthRecord.status)
                );
            });

            if (invalidHealthRecords.length > 0) {
                console.error('Invalid health records:', invalidHealthRecords);
                message.error('Một số hồ sơ sức khỏe có thông tin không hợp lệ (status)!');
                return;
            }

            const mapCowOrigin = (origin: string) => {
                if (origin === 'indian') {
                    return 'asian';
                }
                return origin;
            };

            const cows = reviewData.map((cow: any) => ({
                name: cow.name || '',
                cowStatusStr: cow.cowStatus || '',
                dateOfBirth: cow.dateOfBirth || '',
                dateOfEnter: cow.dateOfEnter || '',
                cowOriginStr: mapCowOrigin(cow.cowOrigin || ''),
                genderStr: cow.gender || '',
                cowTypeName: cow.cowTypeName || '',
                description: cow.description || 'No description',
            }));

            const healthRecords = reviewData.map((cow: any) => ({
                cowName: cow.name || '',
                status: cow.healthRecord?.status || '',
                size: Math.round(cow.healthRecord?.size || 0),
                period: cow.cowStatus || '',
                bodyTemperature: Math.round(cow.healthRecord?.bodyTemperature || 0),
                heartRate: Math.round(cow.healthRecord?.heartRate || 0),
                respiratoryRate: Math.round(cow.healthRecord?.respiratoryRate || 0),
                ruminateActivity: Math.round(cow.healthRecord?.ruminateActivity || 0),
                chestCircumference: Math.round(cow.healthRecord?.chestCircumference || 0),
                bodyLength: Math.round(cow.healthRecord?.bodyLength || 0),
                description: cow.healthRecord?.description || 'No description',
            }));

            const payload = { cows, healthRecords };
            console.log('Payload being sent to CREATE_BULK API:', JSON.stringify(payload, null, 2));

            const response = await importTrigger({ body: JSON.stringify(payload) });
            console.log('API Response:', response);

            if (response?.data?.cowsResponse?.successes?.length > 0) {
                message.success(`Đã nhập thành công ${response.data.cowsResponse.successes.length} con bò!`);
                setImportedCowIds(response.data.cowsResponse.successes.map((cow: { cowId: number }) => cow.cowId));
                setImportSuccess(true);

                // Gọi lại API để cập nhật importTimes
                await fetchImportTimes();
                // Mở CreateBulkModal sau khi import thành công
                setIsBulkModalOpen(true);
            } else {
                message.error('Import thất bại! Không có dữ liệu nào được nhập.');
            }

            const cowErrors = response?.data?.cowsResponse?.errors || [];
            const healthRecordErrors = response?.data?.healthRecordsResponse?.errors || [];
            const allErrors = [...cowErrors, ...healthRecordErrors];

            if (allErrors.length > 0) {
                console.warn('Danh sách lỗi import:', allErrors);
                message.warning(`Có ${allErrors.length} lỗi xảy ra. Kiểm tra console để biết thêm chi tiết.`);
            }
        } catch (error: any) {
            console.error('Lỗi khi import:', error);
            console.error('Error details:', error.response?.data || error.message);
            message.error(`Lỗi khi import: ${error.response?.data?.message || error.message || 'Có lỗi xảy ra!'}`);
        }
    };

    return (
        <AnimationAppear duration={0.5}>
            <WhiteBackground>
                <div style={{ marginBottom: 16 }}>
                    <ImportCow onReviewData={handleReviewData} />
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
                />
                {/* Thêm CreateBulkModal */}
                {importSuccess && (
                    <CreateBulkModal
                        modal={modalControl}
                        availableCows={availableCows}
                        mutateCows={mutateCows}
                    />
                )}
            </WhiteBackground>
        </AnimationAppear>
    );
};
export default ListCowImport;