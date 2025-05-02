import { Spin } from 'antd';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import AnimationAppear from '../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../hooks/useFetcher';
import useModal from '../../../../../../hooks/useModal';
import { Item } from '../../../../../../model/Warehouse/items';
import ItemInformation from './components/ItemInformation';
import ModalEditItem from './components/ModalEditItem';

const ItemDetail = () => {
  const { id } = useParams();
  const { data, isLoading, mutate } = useFetcher<Item>(`items/${id}`, 'GET');
  const modal = useModal();
  if (isLoading) return <Spin />;
  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="flex justify-end flex-wrap gap-5">
          <ItemInformation data={data as Item} />
          <ButtonComponent
            onClick={modal.openModal}
            type="primary"
            buttonType="warning"
          >
            {t('Edit')}
          </ButtonComponent>
          <ModalEditItem data={data as Item} modal={modal} mutate={mutate} />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ItemDetail;
