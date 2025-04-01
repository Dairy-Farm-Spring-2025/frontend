import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
import { Button, Divider, Image, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import cowImage from '../../../../assets/cow.jpg';
import ImportCow from './components/ImportCow';

const ListCowImport = () => {
    const { t } = useTranslation();
    const [reviewData, setReviewData] = useState<Cow[]>([]); // Dữ liệu hợp lệ từ review
    const [reviewErrors, setReviewErrors] = useState<any[]>([]); // Dữ liệu lỗi từ review
    const { trigger: importTrigger, isLoading: isImporting } = useFetcher(COW_PATH.IMPORT_COW, 'POST', 'application/json'); // Đổi content-type thành JSON

    const columns: Column[] = [
        {
            dataIndex: 'image',
            key: 'image',
            title: t('Image'),
            render: () => <Image width={200} src={cowImage} />,
            width: 200,
        },
        {
            dataIndex: 'name',
            key: 'name',
            title: t('Name'),
            render: (element: string) => element || '-',
            searchText: true,
        },
        {
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            title: t('Date Of Birth'),
            render: (data) => (data ? formatDateHour(data) : '-'),
            sorter: (a: any, b: any) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
            filteredDate: true,
        },
        {
            dataIndex: 'dateOfEnter',
            key: 'dateOfEnter',
            title: t('Date Of Enter'),
            render: (data) => (data ? formatDateHour(data) : '-'),
            sorter: (a: any, b: any) => new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
            filteredDate: true,
        },
        {
            dataIndex: 'dateOfOut',
            key: 'dateOfOut',
            title: t('Date Of Out'),
            render: (data) => (data ? formatDateHour(data) : '-'),
        },
        {
            dataIndex: 'cowOrigin',
            key: 'cowOrigin',
            title: t('Origin'),
            render: (data) => getLabelByValue(data, cowOrigin()),
            filterable: true,
            filterOptions: cowOriginFiltered(),
        },
        {
            dataIndex: 'gender',
            key: 'gender',
            title: t('Gender'),
            render: (data) =>
                data === 'male' ? (
                    <IoMdMale className="text-blue-600" size={20} />
                ) : (
                    <IoMdFemale className="text-pink-600" size={20} />
                ),
            filterable: true,
            filterOptions: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' },
            ],
        },
        {
            dataIndex: 'cowType',
            key: 'cowType',
            title: t('Cow Type'),
            render: (data) => <p>{data?.name || data || '-'}</p>,
        },
        {
            dataIndex: 'cowStatus',
            key: 'cowStatus',
            title: t('Cow Status'),
            render: (data) => getLabelByValue(data, cowStatus()),
        },
        {
            dataIndex: 'inPen',
            key: 'inPen',
            title: t('In Pen'),
            render: (data) =>
                data ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
    ];

    // Xử lý khi nhận dữ liệu review từ ImportCow
    const handleReviewData = (data: any[], errors: any[]) => {
        setReviewData(data); // Lưu dữ liệu hợp lệ vào state
        setReviewErrors(errors); // Lưu lỗi (nếu có)
        if (errors.length > 0) {
            message.error(`Có lỗi trong dữ liệu: ${errors.join(', ')}`);
        }
    };

    // Xác nhận import và lưu dữ liệu từ state vào database
    const handleConfirmImport = async () => {
        if (reviewData.length === 0) {
            message.error("Không có dữ liệu để import!");
            return;
        }

        try {
            // Gửi dữ liệu từ state dưới dạng JSON
            const response = await importTrigger({ body: JSON.stringify(reviewData) });
            console.log("Import response:", response);
            message.success("Dữ liệu đã được lưu vào hệ thống!");
            setReviewData([]); // Xóa dữ liệu review sau khi lưu thành công
            setReviewErrors([]); // Xóa lỗi
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
                            <Button
                                type="primary"
                                onClick={handleConfirmImport}
                                loading={isImporting}
                                disabled={isImporting || reviewErrors.length > 0} // Vô hiệu hóa nếu đang import hoặc có lỗi
                            >
                                {isImporting ? "Đang lưu..." : "Confirm Import"}
                            </Button>
                        </div>
                    )}
                </div>
                <Divider className="my-4" />
                <TableComponent
                    loading={false}
                    columns={columns}
                    dataSource={reviewData ? formatSTT(reviewData) : []}
                />
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default ListCowImport;