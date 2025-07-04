import { useState } from 'react';
import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import ModalAddCategory from './components/ModalAddCategory';
import ModalDetailCategory from './components/ModalDetailCategory';
import { useTranslation } from 'react-i18next';
import { CategoryType } from '@model/Warehouse/category';
import { CATEGORY_PATH } from '@service/api/Storage/categoryApi';
import { validateNameCategory } from '@utils/validate/categoryValidate';

const Category = () => {
  const { data, isLoading, mutate } = useFetcher<CategoryType[]>(
    CATEGORY_PATH.CATEGORIES,
    'GET'
  );
  const [id, setId] = useState('');
  const toast = useToast();
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'categories',
    'DELETE'
  );
  const modal = useModal();
  const modalDetail = useModal();
  const { t } = useTranslation();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: CATEGORY_PATH.CATEGORY_DELETE(id) });
      toast.showSuccess(t('Delete success'));
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
    },
    {
      dataIndex: 'categoryId',
      key: 'action',
      title: t('Action'),
      render: (data, record) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
          {!validateNameCategory(record.name) && (
            <PopconfirmComponent
              title={undefined}
              onConfirm={() => onConfirm(data)}
            >
              <ButtonComponent type="primary" danger>
                {t('Delete')}
              </ButtonComponent>
            </PopconfirmComponent>
          )}
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
            {t('Create Category')}
          </ButtonComponent>
          <TableComponent
            dataSource={data || []}
            columns={column}
            loading={isLoading}
          />
        </div>
        <ModalAddCategory modal={modal} mutate={mutate} />
        {id !== '' && (
          <ModalDetailCategory id={id} modal={modalDetail} mutate={mutate} />
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default Category;
