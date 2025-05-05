import { DeleteOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import CardComponent from '@components/Card/CardComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Item } from '@model/Warehouse/items';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import { formatStatusWithCamel } from '@utils/format';
import { getItemStatusColor } from '@utils/statusRender/itemStatusRender';
import { Tooltip } from 'antd';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface CardItemWarehouse {
  element: Item;
  mutateItem: any;
}

const CardItemWarehouse = ({ element, mutateItem }: CardItemWarehouse) => {
  const toast = useToast();
  const { isLoading: isLoadingDeleteItem, trigger: triggerDeleteItem } =
    useFetcher(`items/delete`, 'DELETE');
  const navigate = useNavigate();
  const handleDelete = async (id: string) => {
    try {
      const response = await triggerDeleteItem({
        url: ITEMS_PATH.ITEMS_DELETE(id),
      });
      toast.showSuccess(response?.message);
      mutateItem();
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };
  return (
    <CardComponent>
      <Tooltip title={element?.name ? element?.name : 'N/A'}>
        <p className="truncate font-bold text-base">
          {element?.name ? element?.name : 'N/A'}
        </p>
      </Tooltip>
      <div className="flex mt-2">
        <Tooltip title={t('Category')}>
          <TagComponents color="blue">
            {element?.categoryEntity?.name}
          </TagComponents>
        </Tooltip>
        <Tooltip title={t('Unit')}>
          <TagComponents>
            {t(formatStatusWithCamel(element?.unit))}
          </TagComponents>
        </Tooltip>
        <Tooltip title={t('Status')}>
          <TagComponents color={getItemStatusColor(element?.status)}>
            {t(formatStatusWithCamel(element?.status))}
          </TagComponents>
        </Tooltip>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <PopconfirmComponent
          onConfirm={() =>
            handleDelete(element ? Number(element?.itemId).toString() : '')
          }
          title={undefined}
        >
          <ButtonComponent
            loading={isLoadingDeleteItem}
            shape="circle"
            danger
            icon={<DeleteOutlined />}
          />
        </PopconfirmComponent>
        <p
          onClick={() => navigate(`../item-management/${element?.itemId}`)}
          className="text-blue-500 hover:opacity-70 duration-150 cursor-pointer underline underline-offset-2 font-semibold"
        >
          {t('View detail')}
        </p>
      </div>
    </CardComponent>
  );
};

export default CardItemWarehouse;
