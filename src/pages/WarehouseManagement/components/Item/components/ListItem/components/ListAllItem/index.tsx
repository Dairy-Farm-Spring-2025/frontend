import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../../../../../../components/Table/TableComponent';
import useModal from '../../../../../../../../hooks/useModal';
import { Item } from '../../../../../../../../model/Warehouse/items';
import ModalAddItem from '../ModalAddItem/ModalAddItem';

interface ListAllItemProps {
  itemData: Item[];
  isLoading: boolean;
  column: Column[];
  mutate: any;
}

const ListAllItem = ({
  itemData,
  isLoading,
  column,
  mutate,
}: ListAllItemProps) => {
  const modal = useModal();

  return (
    <div className="flex flex-col gap-5">
      <ButtonComponent type="primary" onClick={modal.openModal}>
        Create Item
      </ButtonComponent>
      <TableComponent
        columns={column}
        dataSource={itemData}
        loading={isLoading}
      />
      <ModalAddItem modal={modal} mutate={mutate} />
    </div>
  );
};

export default ListAllItem;
