import { UploadOutlined } from '@ant-design/icons';
import { Avatar, Upload, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import useFetcher from '../../../hooks/useFetcher';
import useToast from '../../../hooks/useToast';
import { getAvatar } from '../../../utils/getImage';
import { RootState } from '../../../core/store/store';
import { useSelector } from 'react-redux';
import { t } from 'i18next';

interface AvatarProfileProp {
  avatar: string;
  mutate: any;
}

const AvatarProfile = ({ avatar, mutate }: AvatarProfileProp) => {
  const [avatarSrc, setAvatarSrc] = useState<string>(
    avatar !== 'default.jpg'
      ? getAvatar(avatar)
      : 'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png'
  );
  const avatarFunction = useSelector(
    (state: RootState) => state.avatar.avatarFunction
  );
  const { trigger } = useFetcher('users/update', 'PUT', 'multipart/form-data');
  const toast = useToast();
  const handleUpload = (file: RcFile) => {
    const reader = new FileReader();
    const formData = new FormData();
    reader.onload = async () => {
      if (reader.result && typeof reader.result === 'string') {
        formData.append('imageAvatar', file);
        await trigger({ body: formData });
        setAvatarSrc(reader.result);
        toast.showSuccess('Image uploaded successfully!');
        mutate();
        if (avatarFunction) {
          avatarFunction();
        }
      }
    };
    reader.onerror = () => {
      toast.showError('Failed to upload image.');
    };
    reader.readAsDataURL(file);
  };

  // Validation before uploading the file
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage || Upload.LIST_IGNORE; // Accept or ignore the file
  };

  const handleCustomRequest: UploadProps['customRequest'] = ({ file }) => {
    const uploadFile = file as RcFile; // Ensure type is RcFile
    handleUpload(uploadFile); // Handle base64 conversion
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar
        size={100}
        src={avatarSrc}
        className="shadow-md !object-contain"
      />
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={handleCustomRequest}
        className="flex justify-center"
      >
        <ButtonComponent
          icon={<UploadOutlined />}
          type="primary"
          style={{ marginTop: '16px' }}
        >
          {t('Upload')}
        </ButtonComponent>
      </Upload>
    </div>
  );
};

export default AvatarProfile;
