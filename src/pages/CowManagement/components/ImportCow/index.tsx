import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { Cow } from '@model/Cow/Cow';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { formatDateHour, formatSTT } from '@utils/format';
import { getLabelByValue } from '@utils/getLabel';
import { Button, Divider, message } from 'antd';
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




const ListCowImport = () => {
    const { t } = useTranslation();
    const [reviewData, setReviewData] = useState<Cow[]>([]);
    const [reviewErrors, setReviewErrors] = useState<any[]>([]);
    const { trigger: importTrigger, isLoading: isImporting } = useFetcher(COW_PATH.CREATE_BULK, 'POST', 'application/json');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const { data: dataCowType } = useFetcher<CowType[]>(
        COW_TYPE_PATH.COW_TYPES,
        'GET'
    );
    const [importedCowIds, setImportedCowIds] = useState<number[]>([]);
    const [importSuccess, setImportSuccess] = useState(false);

    const columns: Column[] = [
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
                        value={data ? dayjs(data) : null} // Ensure the value passed is a dayjs object
                        onChange={(date) => handleChange(record.key, 'dateOfBirth', date)} />

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
                        value={data ? dayjs(data) : null} // Ensure the value passed is a dayjs object
                        onChange={(date) => handleChange(record.key, 'dateOfEnter', date)} />
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
                        value={data}
                        options={cowOrigin()}
                        onChange={(value) => handleChange(record.key, 'cowOrigin', value)}
                    />


                ) : (
                    getLabelByValue(data, cowOrigin()) || '-'
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
                ) : (
                    data === 'male' ? (
                        <IoMdMale className="text-blue-600" size={20} />
                    ) : (
                        <IoMdFemale className="text-pink-600" size={20} />
                    )
                ),
        }
        ,
        {
            dataIndex: 'cowType',
            key: 'cowType',
            title: t('Cow Type'),
            render: (data, record) =>
                editingKey === record.key ? (
                    <SelectComponent
                        value={data?.cowTypeId} // Use the cowTypeId for value
                        options={dataCowType?.map((type) => ({
                            value: type.cowTypeId,
                            label: type.name, // Display name of the cow type
                        })) || []} // Mapping cow types for options
                        onChange={(value) => {
                            const selectedCowType = dataCowType?.find((item) => item.cowTypeId === value);
                            handleChange(record.key, 'cowType', selectedCowType);
                        }}
                    />
                ) : (
                    <p>{data?.name || '-'}</p>
                ),
        }
        ,
        {
            dataIndex: 'cowStatus',
            key: 'cowStatus',
            title: t('Cow Status'),
            editable: true,
            render: (data, record) =>
                editingKey === record.key ? (
                    <SelectComponent
                        value={data}
                        options={cowStatus()}
                        onChange={(value) => handleChange(record.key, 'cowStatus', value)}
                    />
                ) : (
                    getLabelByValue(data, cowStatus()) || '-'
                ),
        },
        {
            dataIndex: 'description',
            key: 'description',
            title: t('Description'),
            editable: true,
            render: (data, record) =>
                editingKey === record.key ? (
                    <InputComponent value={data} onChange={(e) => handleChange(record.key, 'description', e.target.value)} />
                ) : (
                    data || '-'
                ),
        },
        {
            title: "Action",
            key: "action",
            dataIndex: "action",
            render: (_, record) =>
                editingKey === record.key ? (
                    <>
                        <ButtonComponent icon={<SaveOutlined />} onClick={handleSave} style={{ marginRight: 8 }} />
                        <ButtonComponent icon={<CloseOutlined />} onClick={handleCancel} />
                    </>
                ) : (
                    <>
                        <ButtonComponent icon={<EditOutlined />} onClick={() => handleEdit(record.key)} style={{ marginRight: 8 }} />
                        <ButtonComponent style={{ marginLeft: 8 }}
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.key)}
                            danger
                        />
                    </>
                ),
        },
    ];

    const handleReviewData = (data: any[], errors: any[]) => {
        // Đảm bảo dữ liệu có các thuộc tính cần thiết
        const dataWithKeys = data.map((item, index) => ({
            ...item,
            key: index.toString(),
            dateOfBirth: item.dateOfBirth || '',
            dateOfEnter: item.dateOfEnter || '',
            cowOrigin: item.cowOrigin || '',
            gender: item.gender || '',
            cowType: item.cowType || null,
            cowStatus: item.cowStatus || '',
            description: item.description || '',
        }));
        setReviewData(dataWithKeys);
        setReviewErrors(errors);
        if (errors.length > 0) {
            message.error(`Có lỗi trong dữ liệu: ${errors.join(', ')}`);
        }
    };
    // Bắt đầu chỉnh sửa 1 dòng
    const handleEdit = (key: string) => setEditingKey(key);

    // Lưu thay đổi
    const handleSave = () => {
        setEditingKey(null);
        message.success("Đã lưu thay đổi!");
    };
    const handleDelete = (key: string) => {
        setReviewData((prev) => prev.filter(item => item.key !== key));
        message.success("Dữ liệu đã được xóa!");
    };
    // Hủy chỉnh sửa
    const handleCancel = () => setEditingKey(null);

    // Cập nhật dữ liệu khi chỉnh sửa
    const handleChange = (key: string, field: string, value: any) => {
        setReviewData(prev =>
            prev.map(item => (item.key === key ? { ...item, [field]: value } : item))
        );
    };
    const handleDataChange = (newData: any[]) => {
        setReviewData(newData);
    };

    const handleConfirmImport = async () => {
        if (reviewData.length === 0) {
            message.error("Không có dữ liệu để import!");
            return;
        }

        try {
            const formattedData = reviewData.map((cow: Cow) => ({
                cowStatus: cow.cowStatus || "",
                dateOfBirth: cow.dateOfBirth ? cow.dateOfBirth.split(" ")[0] : "",
                dateOfEnter: cow.dateOfEnter ? cow.dateOfEnter.split(" ")[0] : "",
                cowOrigin: cow.cowOrigin || "",
                gender: cow.gender || "",
                cowTypeId: cow.cowType?.cowTypeId || "",
                description: cow.description || "",
            }));

            const response = await importTrigger({ body: JSON.stringify(formattedData) });

            console.log("API Response:", response); // Log phản hồi API để debug

            if (response?.data?.successes?.length > 0) {
                message.success(`Đã nhập thành công ${response.data.successes.length} con bò!`);
                setImportedCowIds(response.data.successes.map((cow: { cowId: number }) => cow.cowId));
                setImportSuccess(true);
            } else {
                message.error("Import thất bại! Không có dữ liệu nào được nhập.");
            }

            if (response?.data?.errors?.length > 0) {
                console.warn("Danh sách lỗi import:", response.data.errors);
                message.warning(`Có ${response.data.errors.length} lỗi xảy ra. Kiểm tra console để biết thêm chi tiết.`);
            }
        } catch (error: any) {
            console.error("Lỗi khi import:", error);
            message.error(`Lỗi khi import: ${error.message || "Có lỗi xảy ra!"}`);
        }
    };



    return (
        <AnimationAppear duration={0.5}>
            <WhiteBackground>
                <div style={{ marginBottom: 16 }}>
                    <ImportCow onReviewData={handleReviewData} />
                    {reviewData.length > 0 && (
                        <div style={{ textAlign: 'right', marginTop: 16 }}>
                            <ButtonComponent
                                type="primary"
                                onClick={handleConfirmImport}
                                loading={isImporting}
                                disabled={isImporting || reviewErrors.length > 0}
                            >
                                {isImporting ? "Đang lưu..." : "Confirm Import"}
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
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default ListCowImport;