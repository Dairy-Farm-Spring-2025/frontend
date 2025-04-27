import InputComponent from '@components/Input/InputComponent';
import useGetRole from '@hooks/useGetRole';
import useModal from '@hooks/useModal';
import { Area } from '@model/Area';
import { Divider, Pagination, PaginationProps, Spin } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';
import '../../index.scss';
import ModalCreateArea from '../ModalCreateArea/ModalCreateArea';
import CardAreaPen from './components/CardAreaPen';

export type DataGroupAreaPen = {
  area: Area;
};

const ITEMS_PER_PAGE = 6;

interface AreaListProps {
  dataGroup: DataGroupAreaPen[];
  mutate: any;
  isLoading: boolean;
}

const AreaList = ({ dataGroup, mutate, isLoading }: AreaListProps) => {
  const role = useGetRole();
  const modalCreate = useModal();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  //Handle filter
  const filteredData = dataGroup.filter(({ area }) =>
    area.name.toLowerCase().includes(searchText.toLowerCase())
  );

  //Handle Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const showTotal: PaginationProps['showTotal'] = (total) => {
    return (
      <p className="text-primary font-semibold">
        {t(`pagination.total_page`, { items: total })}
      </p>
    );
  };

  if (isLoading) return <Spin />;

  return (
    <>
      {role !== 'Veterinarians' && (
        <ModalCreateArea modal={modalCreate} mutate={mutate} />
      )}
      <Divider className="my-4" />
      <div className="flex flex-col gap-5 mb-5">
        <InputComponent.Search
          allowClear
          onSearch={(e) => setSearchText(e)}
          className="!w-[49%]"
        />
        {searchText !== '' && (
          <p className="text-blue-600">
            {filteredData.length}{' '}
            {filteredData.length > 1 ? t('results') : t('result')}
          </p>
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {paginatedData.map((element) => (
            <CardAreaPen element={element} />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={ITEMS_PER_PAGE}
          total={filteredData.length}
          showSizeChanger={false}
          showTotal={showTotal}
          onChange={(page) => setCurrentPage(page)}
          className="mt-5"
        />
      </div>
    </>
  );
};

export default AreaList;
