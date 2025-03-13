import useToast from '@hooks/useToast';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../../../service/api/User/userApi';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';

interface BanUnbanUserProps {
  userId: number;
  isActive: boolean;
  onStatusChange?: () => void;
}

const BanUnbanUser: React.FC<BanUnbanUserProps> = ({
  userId,
  isActive,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const handleAction = async () => {
    try {
      if (isActive) {
        const response = await userApi.banUser(userId);
        toast.showSuccess(response.message);
      } else {
        const response = await userApi.unBanUser(userId);
        toast.showSuccess(response.message);
      }
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <PopconfirmComponent title={undefined} onConfirm={handleAction}>
      <Button type={'primary'} danger={isActive}>
        {isActive ? t('Deactivate') : t('Activate')}
      </Button>
    </PopconfirmComponent>
  );
};

export default BanUnbanUser;
