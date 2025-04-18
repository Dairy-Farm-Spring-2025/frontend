import TagComponents from '@components/UI/TagComponents';
import { EQUIPMENT_PATH } from '@service/api/Equipment/equipmentApi';
import { getEquipmentStatusTag } from '@utils/statusRender/equipmentStatusRender';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import useModal from '../../../../hooks/useModal';
import useToast from '../../../../hooks/useToast';
import { EquipmentType } from '../../../../model/Warehouse/equipment';
import {
  formatAreaType,
  formatStatusWithCamel,
} from '../../../../utils/format';
import ModalAddEquipment from './components/ModalAddEquipment';
import ModalDetailEquipment from './components/ModalDetailEquipment';

const Equipment = () => {
  const { data, isLoading, mutate } = useFetcher<EquipmentType[]>(
    EQUIPMENT_PATH.GET_ALL_EQUIPMENT,
    'GET'
  );
  const [id, setId] = useState('');
  const toast = useToast();
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'equipment',
    'DELETE'
  );
  const modal = useModal();
  const modalDetail = useModal();
  const { t } = useTranslation();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: EQUIPMENT_PATH.DELETE_EQUIPMENT(id) });
      toast.showSuccess('Delete success');
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleOpenModalAdd = () => {
    modal.openModal();
  };

  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modalDetail.openModal();
  };

  const column: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      render: (data) => <p>{data}</p>,
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: t('Type'),
      render: (data) => <p>{t(formatAreaType(data))}</p>,
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (
        <TagComponents color={getEquipmentStatusTag(data)}>
          {t(formatStatusWithCamel(data))}
        </TagComponents>
      ),
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: t('Quantity'),
      render: (data) => <p>{data}</p>,
    },
    {
      dataIndex: 'warehouseLocationEntity',
      key: 'warehouseLocationEntity',
      title: t('Storage'),
      render: (data) => <p>{data.name}</p>,
    },
    {
      dataIndex: 'equipmentId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title={t('Delete?')}
            onConfirm={() => onConfirm(data)}
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
        <div className="flex flex-col gap-5">
          <ButtonComponent
            loading={loadingDelete}
            type="primary"
            onClick={handleOpenModalAdd}
          >
            {t('Create Equipment')}
          </ButtonComponent>
          <TableComponent
            dataSource={data || []}
            columns={column}
            loading={isLoading}
          />
        </div>
        <ModalAddEquipment modal={modal} mutate={mutate} />
        {id !== '' && (
          <ModalDetailEquipment id={id} modal={modalDetail} mutate={mutate} />
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default Equipment;
