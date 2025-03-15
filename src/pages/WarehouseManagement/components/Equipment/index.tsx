import { useState } from 'react';
import useFetcher from '../../../../hooks/useFetcher';
import { WarehouseType } from '../../../../model/Warehouse/warehouse';
import useToast from '../../../../hooks/useToast';
import useModal from '../../../../hooks/useModal';
import { useTranslation } from 'react-i18next';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import { EquipmentType } from '../../../../model/Warehouse/equipment';
import ModalAddEquipment from './components/ModalAddEquipment';
import ModalDetailEquipment from './components/ModalDeatialEquipment';
import { formatAreaType } from '../../../../utils/format';

const Equipment = () => {
  const { data, isLoading, mutate } = useFetcher<EquipmentType[]>(
    'equipment',
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
      await trigger({ url: `equipment/${id}` });
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
      render: (data) => <p className="text-base font-bold">{data}</p>,
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: t('Type'),
      render: (data) => (
        <p className="text-base font-bold">{formatAreaType(data)}</p>
      ),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (
        <p className="text-base font-bold">{formatAreaType(data)}</p>
      ),
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: t('quantity'),
      render: (data) => <p className="text-base font-bold">{data}</p>,
    },
    {
      dataIndex: 'warehouseLocationEntity',
      key: 'warehouseLocationEntity',
      title: t('Warehouse'),
      render: (data) => <p className="text-base font-bold">{data.name}</p>,
    },
    {
      dataIndex: 'equipmentId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <PopconfirmComponent
            title={t('Delete?')}
            onConfirm={() => onConfirm(data)}
          >
            <ButtonComponent type="primary" danger>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
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
