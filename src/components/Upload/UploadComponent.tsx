import { PlusOutlined } from '@ant-design/icons';
import useToast from '@hooks/useToast';
import { GetProp, Image, Upload, UploadFile, UploadProps } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface UploadComponentProps {
  file?: UploadFile[];
  setFile?: any;
  validateLengthFile?: number;
}
const UploadComponent = ({
  file = [],
  setFile,
  validateLengthFile,
}: UploadComponentProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const toast = useToast();

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({
    fileList: newFileList,
    file,
  }) => {
    // Kiểm tra khi file upload thành công
    if (file.status === 'done') {
      const updatedFileList = newFileList.map((file: any) => {
        if (file.response && file.response.url) {
          // Nếu response có url, chúng ta sẽ gán url vào thumbUrl
          file.thumbUrl = file.response.url;
        }
        return file;
      });
      setFile(updatedFileList);
    } else {
      // Nếu file chưa upload thành công, chỉ đơn giản là cập nhật lại list file
      setFile(newFileList);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('Upload')}</div>
    </button>
  );

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      toast.showError('Chỉ nhận file jpg/png/jpeg');
      return isJpgOrPng || Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={file}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        {(!validateLengthFile || file.length < validateLengthFile) &&
          uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default UploadComponent;
