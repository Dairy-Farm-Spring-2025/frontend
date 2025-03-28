import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useFetcher from '@hooks/useFetcher';
import { COW_PATH } from '@service/api/Cow/cowApi';



const ImportCow = () => {
    const { trigger, isLoading } = useFetcher(COW_PATH.IMPORT_COW, 'POST', 'multipart/form-data');

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            await trigger({ body: formData });
            message.success("Import thành công!");
        } catch (error: any) {
            console.error("Lỗi khi import:", error);
            message.error(`Lỗi khi import: ${error.message || "Có lỗi xảy ra!"}`);
        }
    };

    return (
        <Upload
            beforeUpload={async (file) => {
                await handleUpload(file);
                return false; // Ngăn chặn upload mặc định của Ant Design
            }}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />} loading={isLoading} disabled={isLoading} type='primary'>
                {isLoading ? "Đang xử lý..." : "Import Cow"}
            </Button>
        </Upload>
    );
};

export default ImportCow;
