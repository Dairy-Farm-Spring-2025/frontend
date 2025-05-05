import { EquipmentType } from '@model/Warehouse/equipment';
import { Item } from '@model/Warehouse/items';
import { WarehouseTypeName } from '@model/Warehouse/warehouse';
import CardItemWarehouse from './components/CardItemWarehouse';
import EmptyComponent from '@components/Error/EmptyComponent';
import CardEquipmentWarehouse from './components/CardEquipmentWarehouse';
import useModal from '@hooks/useModal';
import { useState } from 'react';
import ModalDetailEquipment from '@pages/WarehouseManagement/components/Equipment/components/ModalDetailEquipment';

interface ItemWarehouseProps {
  typeWarehouse: WarehouseTypeName;
  data: Item[];
  mutateItem: any;
  dataEquipment: EquipmentType[];
  mutateEquipment: any;
}
const ItemWarehouse = ({
  data,
  mutateItem,
  typeWarehouse,
  dataEquipment,
  mutateEquipment,
}: ItemWarehouseProps) => {
  const modal = useModal();
  const [id, setId] = useState('');
  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modal.openModal();
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {typeWarehouse === 'equipment' && (
        <>
          {dataEquipment.length > 0 ? (
            dataEquipment.map((element) => (
              <CardEquipmentWarehouse
                element={element}
                mutateEquipment={mutateEquipment}
                openModal={handleOpenModalDetail}
              />
            ))
          ) : (
            <div className="col-span-2">
              <EmptyComponent />
            </div>
          )}
        </>
      )}
      {typeWarehouse !== 'equipment' && (
        <>
          {data.length > 0 ? (
            data.map((element) => (
              <CardItemWarehouse element={element} mutateItem={mutateItem} />
            ))
          ) : (
            <div className="col-span-2">
              <EmptyComponent />
            </div>
          )}
        </>
      )}
      {typeWarehouse === 'equipment' && (
        <ModalDetailEquipment id={id} modal={modal} mutate={mutateEquipment} />
      )}
    </div>
  );
};

export default ItemWarehouse;
