import { USER_PATH } from '@service/api/User/userApi';
import useFetcher from './useFetcher';
import { t } from 'i18next';
import useToast from './useToast';
import { UserProfileData } from '@model/User';

interface Props {
  availableAreas: any;
}

export const useGetAssignees = ({ availableAreas }: Props) => {
  const toast = useToast();
  const { trigger } = useFetcher('', 'GET');

  const getAssignees = async (
    taskType: string,
    area: string,
    fromDate: string,
    toDate: string
  ): Promise<{ value: number; label: string }[]> => {
    try {
      const normalizedTaskType = taskType || 'Chưa rõ loại công việc';
      let url = '';

      if (
        ['Cho bò ăn', 'Dọn chuồng bò', 'Lấy sữa bò'].includes(
          normalizedTaskType
        )
      ) {
        const areaName = availableAreas.find(
          (a: any) => a.value === area
        )?.value;
        if (!areaName) {
          toast.showError(t('Area not found'));
          return [];
        }
        url = USER_PATH.USERS_FREE_IMPORT({
          roleId: '4',
          fromDate,
          toDate,
          areaName,
        });
      } else if (normalizedTaskType === 'Trực ca đêm') {
        url = USER_PATH.NIGHT_USERS_FREE({ fromDate, toDate });
      } else if (normalizedTaskType === 'Khám định kì') {
        url = USER_PATH.VETERINARIANS_AVAILABLE(fromDate);
      } else {
        return [];
      }

      const response = await trigger({ url });
      return response.map((user: UserProfileData) => ({
        value: user.id,
        label: `${user.name} - ${user.employeeNumber}`,
      }));
    } catch {
      toast.showError(t('Failed to fetch assignees'));
      return [];
    }
  };

  return getAssignees;
};
