import { STORAGE_PATH } from '@service/api/Storage/storageApi';
import { formatStatusWithCamel } from '@utils/format';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { WarehouseType } from '../../../../model/Warehouse/warehouse';
import ModalAddWarehouse from './components/ModalAddWarehouse';

const Warehouse = () => {
  const { data, isLoading, mutate } = useFetcher<WarehouseType[]>(
    STORAGE_PATH.STORAGES,
    'GET'
  );
  const navigate = useNavigate();
  const toast = useToast();
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'warehouses',
    'DELETE'
  );
  const modal = useModal();
  const { t } = useTranslation();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: STORAGE_PATH.STORAGE_DELETE(id) });
      toast.showSuccess('Delete success');
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleOpenModalAdd = () => {
    modal.openModal();
  };

  const column: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      render: (data) => data,
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: t('Type'),
      render: (data) => t(formatStatusWithCamel(data)),
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: t('Description'),
    },
    {
      dataIndex: 'warehouseLocationId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent type="primary" onClick={() => navigate(`${data}`)}>
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title={undefined}
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
            {t('Create storage')}
          </ButtonComponent>
          <TableComponent
            dataSource={data || []}
            columns={column}
            loading={isLoading}
          />
        </div>
        <ModalAddWarehouse modal={modal} mutate={mutate} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default Warehouse;
