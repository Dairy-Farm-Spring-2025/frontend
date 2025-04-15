import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { TaskType } from '@model/Task/task-type';
import { UseEquipmentType } from '@model/UseEquipment/UseEquipment';
import { EquipmentType } from '@model/Warehouse/equipment';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { formatStatusWithCamel } from '@utils/format';
import { Divider } from 'antd';
import { t } from 'i18next';
import ModalCreateEquipmentRequired from './components/ModalCreateEquipmentRequired';
import { EQUIPMENT_PATH } from '@service/api/Equipment/equipmentApi';
import { useMemo } from 'react';
import TagComponents from '@components/UI/TagComponents';
import { getColorByRole, RoleRender } from '@utils/statusRender/roleRender';
import useToast from '@hooks/useToast';

const EquipmentRequired = () => {
  const toast = useToast();
  const {
    data: dataUseEquipment,
    isLoading: isLoadingDataUseEquipment,
    mutate,
  } = useFetcher<UseEquipmentType[]>(TASK_TYPE_PATH.USE_EQUIPMENTS, 'GET');
  const { data: dataEquipment } = useFetcher<EquipmentType[]>(
    EQUIPMENT_PATH.GET_ALL_EQUIPMENT,
    'GET'
  );
  const { data: dataTaskType } = useFetcher<TaskType[]>(
    TASK_TYPE_PATH.GET_ALL_TASKTYPES,
    'GET'
  );
  const { trigger: triggerDelete, isLoading: isLoadingDelete } = useFetcher(
    'delete',
    'DELETE'
  );
  const modal = useModal();

  const optionsEquipment = useMemo(
    () =>
      dataEquipment?.map((element) => ({
        value: element.equipmentId,
        label: (
          <p>
            {element.name} - {element.quantity} ({t('equipments')}) -{' '}
            {t(formatStatusWithCamel(element?.type))}
          </p>
        ),
        searchLabel: element.name,
        desc: element,
      })),
    [dataEquipment]
  );
  const optionTaskType = useMemo(
    () =>
      dataTaskType?.map((element) => ({
        value: element.taskTypeId,
        label: (
          <p>
            {element.name} -{' '}
            <TagComponents
              color={getColorByRole(
                element?.roleId
                  ? (formatStatusWithCamel(element?.roleId?.name) as RoleRender)
                  : ('Worker' as RoleRender)
              )}
            >
              {t(formatStatusWithCamel(element.roleId?.name))}
            </TagComponents>
          </p>
        ),
        searchLabel: element.name,
        desc: element,
      })),
    [dataTaskType]
  );

  const handleDelete = async (equipmentId: number, taskTypeId: number) => {
    try {
      const response = await triggerDelete({
        url: TASK_TYPE_PATH.DELETE_USE_EQUIPMENT(equipmentId, taskTypeId),
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const column: Column[] = [
    {
      key: 'equipment-name',
      title: t('Equipment name'),
      dataIndex: 'equipment',
      render: (data: EquipmentType) => data.name,
    },
    {
      key: 'equipment-type',
      title: t('Equipment type'),
      dataIndex: 'equipment',
      render: (data: EquipmentType) => t(formatStatusWithCamel(data.type)),
    },
    {
      key: 'equipment-status',
      title: t('Equipment status'),
      dataIndex: 'equipment',
      render: (data: EquipmentType) => t(formatStatusWithCamel(data.status)),
    },
    {
      key: 'task-type-name',
      title: t('Task type'),
      dataIndex: 'taskType',
      render: (data: TaskType) => data.name,
    },
    {
      key: 'required-quantity',
      title: t('Required quantity'),
      dataIndex: 'requiredQuantity',
      render: (data) => data,
    },
    {
      key: 'note',
      title: t('Note'),
      dataIndex: 'note',
      render: (data) => data,
    },
    {
      key: 'action',
      title: t('Action'),
      dataIndex: 'action',
      render: (_, record: UseEquipmentType) => (
        <div className="flex gap-2">
          <ButtonComponent type="primary">{t('View detail')}</ButtonComponent>
          <PopconfirmComponent
            title={undefined}
            onConfirm={() =>
              handleDelete(record.id.equipmentId, record.id.taskTypeId)
            }
          >
            <ButtonComponent type="primary" danger>
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
        <ButtonComponent type="primary" onClick={modal.openModal}>
          {t('Create equipment required')}
        </ButtonComponent>
        <Divider className="!my-2" />
        <TableComponent
          columns={column}
          dataSource={
            dataUseEquipment ? (dataUseEquipment as UseEquipmentType[]) : []
          }
          loading={isLoadingDelete || isLoadingDataUseEquipment}
        />
        <ModalCreateEquipmentRequired
          mutate={mutate}
          modal={modal}
          optionsEquipment={optionsEquipment}
          optionsTaskType={optionTaskType}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default EquipmentRequired;
