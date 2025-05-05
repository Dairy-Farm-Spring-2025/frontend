import { DeleteOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import CardComponent from '@components/Card/CardComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { EquipmentType } from '@model/Warehouse/equipment';
import { EQUIPMENT_PATH } from '@service/api/Equipment/equipmentApi';
import { formatStatusWithCamel } from '@utils/format';
import { getEquipmentStatusTag } from '@utils/statusRender/equipmentStatusRender';
import { Tooltip } from 'antd';
import { t } from 'i18next';

interface CardEquipmentWarehouse {
  element: EquipmentType;
  mutateEquipment: any;
  openModal: any;
}

const CardEquipmentWarehouse = ({
  element,
  mutateEquipment,
  openModal,
}: CardEquipmentWarehouse) => {
  const { isLoading: isLoadingDeleteItem, trigger: triggerDeleteItem } =
    useFetcher(`items/delete`, 'DELETE');
  const toast = useToast();
  const handleDelete = async (id: string) => {
    try {
      const response = await triggerDeleteItem({
        url: EQUIPMENT_PATH.DELETE_EQUIPMENT(id),
      });
      toast.showSuccess(response?.message);
      mutateEquipment();
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
        <Tooltip title={t('Quantity')}>
          <TagComponents color="blue">
            {element?.quantity} {t('equipments')}
          </TagComponents>
        </Tooltip>
        <Tooltip title={t('Type')}>
          <TagComponents>
            {t(formatStatusWithCamel(element?.type))}
          </TagComponents>
        </Tooltip>
        <Tooltip title={t('Status')}>
          <TagComponents color={getEquipmentStatusTag(element?.status)}>
            {t(formatStatusWithCamel(element?.status))}
          </TagComponents>
        </Tooltip>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <PopconfirmComponent
          onConfirm={() =>
            handleDelete(element ? Number(element?.equipmentId).toString() : '')
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
          onClick={() => openModal(element?.equipmentId)}
          className="text-blue-500 hover:opacity-70 duration-150 cursor-pointer underline underline-offset-2 font-semibold"
        >
          {t('View detail')}
        </p>
      </div>
    </CardComponent>
  );
};

export default CardEquipmentWarehouse;
