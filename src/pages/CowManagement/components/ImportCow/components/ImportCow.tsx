import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useFetcher from '@hooks/useFetcher';
import { COW_PATH } from '@service/api/Cow/cowApi';

interface ImportCowProps {
    onReviewData: (data: any[], errors: any[]) => void; // Callback để truyền dữ liệu review
}

const ImportCow = ({ onReviewData }: ImportCowProps) => {
    const { trigger, isLoading } = useFetcher(COW_PATH.REVIEW_IMPORT_COW, 'POST', 'multipart/form-data');

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await trigger({ body: formData });
            // Kiểm tra xem response.data có tồn tại và có thuộc tính successes/errors không
            const data = response.data || response; // Nếu API trả về trực tiếp dữ liệu, bỏ qua .data
            const successes = data?.successes || []; // Mặc định là mảng rỗng nếu không có
            const errors = data?.errors || []; // Mặc định là mảng rỗng nếu không có

            onReviewData(successes, errors); // Truyền dữ liệu review lên component cha
            message.success("Dữ liệu đã được review thành công!");
        } catch (error: any) {
            console.error("Lỗi khi review:", error);
            message.error(`Lỗi khi review: ${error.message || "Có lỗi xảy ra!"}`);
            onReviewData([], [error.message]); // Nếu lỗi, truyền mảng rỗng cho successes và lỗi vào errors
        }
    };

    return (
        <Upload
            beforeUpload={async (file) => {
                await handleUpload(file);
                return false; // Ngăn upload mặc định của Ant Design
            }}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />} loading={isLoading} disabled={isLoading} type="primary">
                {isLoading ? "Đang xử lý..." : "Import Cow"}
            </Button>
        </Upload>
    );
};

export default ImportCow;