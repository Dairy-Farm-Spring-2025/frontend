import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { MyNotification } from '@model/Notification/Notification';
import { NOTIFICATION_PATH } from '@service/api/Notification/notificationApi';
import { Badge, Dropdown, Menu, Spin, Tooltip } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { TbReload } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const NotificationDropDown = () => {
  const {
    data: dataResponseNotification,
    mutate,
    isLoading,
  } = useFetcher<MyNotification[]>(NOTIFICATION_PATH.MY_NOTIFICATIONS, 'GET');
  const { trigger: triggerUpdate } = useFetcher('mark-read', 'PUT');
  const navigate = useNavigate();
  const toast = useToast();
  const [dataNotification, setDataNotification] = useState<MyNotification[]>(
    []
  );

  useEffect(() => {
    if (dataResponseNotification) {
      setDataNotification(dataResponseNotification);
    }
  }, [dataResponseNotification]);

  const handleMarkAsRead = async (
    id: number,
    userId: number,
    read: boolean,
    path: string
  ) => {
    const urlObj = new URL(path, window.location.origin); // Ensures path is parsed correctly
    const relativePath = urlObj.pathname + urlObj.search + urlObj.hash;
    if (read === true) {
      navigate(relativePath);
    } else {
      try {
        await triggerUpdate({
          url: NOTIFICATION_PATH.MARK_AS_READ(id, userId),
        });
        mutate();
        navigate(relativePath);
      } catch (error: any) {
        toast.showSuccess(error.message);
      }
    }
  };

  const menu = (
    <Menu
      style={{
        maxWidth: '500px',
        width: '300px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <div className="flex justify-end mb-1 px-2 !text-lg !text-blue-500">
        <Tooltip title={t('Refresh')}>
          <TbReload
            onClick={() => mutate()}
            className="hover:opacity-70 duration-150 cursor-pointer"
          />
        </Tooltip>
      </div>
      {isLoading ? (
        <div className="w-full !h-[100px] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        dataNotification.map((element) => (
          <Menu.Item
            key={element.id.notificationId}
            style={{ whiteSpace: 'normal' }}
            className={`!border-b-[1px]`}
            onClick={() =>
              handleMarkAsRead(
                element.id.notificationId,
                element.id.userId,
                element.read,
                element.notification.link
              )
            }
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 w-[90%]">
                <p className="font-bold">{element.notification.title}</p>
                <p className="text-sm text-gray-500">
                  {element.notification.category}
                </p>
                <Tooltip
                  title={element.notification.description}
                  placement="top"
                >
                  <p className="line-clamp-2 overflow-hidden text-ellipsis text-sm text-gray-700">
                    {element.notification.description}
                  </p>
                </Tooltip>
              </div>
              <div className="w-[1%]">
                {element.read ? (
                  <div />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={(triggerNode) => triggerNode.parentElement!}
    >
      <Badge
        count={
          dataNotification.filter((element) => element.read === false).length
        }
      >
        <IoIosNotifications
          className="cursor-pointer text-orange-600"
          size={32}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropDown;
