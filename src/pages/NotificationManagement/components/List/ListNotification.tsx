import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TagComponents from '@components/UI/TagComponents';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal, { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Notification } from '@model/Notification/Notification';
import { NOTIFICATION_PATH } from '@service/api/Notification/notificationApi';
import { formatToTitleCase } from '@utils/format';
import { getCategoryNotificationColor } from '@utils/statusRender/categoryNotificationRender';
import { Divider } from 'antd';
import { t } from 'i18next';
import CreateNotificationModal from '../components/CreateNotificationModal';
import { Link } from 'react-router-dom';

const ListNotification = () => {
  const toast = useToast();
  const modal = useModal<ModalActionProps>();
  const {
    data: dataNotification,
    isLoading,
    mutate,
  } = useFetcher<Notification[]>(NOTIFICATION_PATH.GET_NOTIFICATIONS, 'GET');
  const { isLoading: isLoadingDelete, trigger: triggerDelete } = useFetcher(
    'delete',
    'DELETE'
  );

  const handleDeleteNotification = async (id: number) => {
    try {
      const response = await triggerDelete({
        url: NOTIFICATION_PATH.DELETE_NOTIFICATION(id),
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const column: Column[] = [
    {
      title: t('Title'),
      key: 'title',
      dataIndex: 'title',
      searchable: true,
    },
    {
      title: t('Description'),
      key: 'description',
      dataIndex: 'description',
      width: 400,
    },
    {
      title: t('Link'),
      key: 'link',
      dataIndex: 'link',
      render: (data, _, index) => (
        <Link to={data} key={index} className="text-secondary">
          {data}
        </Link>
      ),
    },
    {
      title: t('Category Notification'),
      key: 'category',
      dataIndex: 'category',
      render: (data, _, index) => (
        <TagComponents key={index} color={getCategoryNotificationColor(data)}>
          {formatToTitleCase(data)}
        </TagComponents>
      ),
      align: 'center',
    },
    // {
    //   title: t('User Notification'),
    //   key: 'userNotifications',
    //   dataIndex: 'userNotifications',
    //   render: (data: UserNotification[]) => (
    //     <div className="grid grid-cols-2 gap-3">
    //       {data.map((element) => (
    //         <Tooltip title={element.read ? t('Read') : t('Unread')}>
    //           <TagComponents
    //             color={element.read ? 'green-inverse' : 'red'}
    //             className="w-fit"
    //           >
    //             {element.user.name} - {t(element.user.roleId.name)}
    //           </TagComponents>
    //         </Tooltip>
    //       ))}
    //     </div>
    //   ),
    //   width: 500,
    // },
    {
      title: t('Action'),
      key: 'notificationId',
      dataIndex: 'notificationId',
      render: (data) => (
        <div key={data} className="flex gap-2 flex-wrap">
          <PopconfirmComponent
            title={undefined}
            onConfirm={() => handleDeleteNotification(data)}
          >
            <ButtonComponent
              key={'delete'}
              type="primary"
              danger
              loading={isLoadingDelete}
            >
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <div>
          <ButtonComponent type="primary" onClick={modal.openModal}>
            {t('Create notification')}
          </ButtonComponent>
          <Divider />
          <TableComponent
            columns={column}
            dataSource={dataNotification as Notification[]}
            loading={isLoading}
          />
          <CreateNotificationModal modal={modal} mutate={mutate} />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListNotification;
