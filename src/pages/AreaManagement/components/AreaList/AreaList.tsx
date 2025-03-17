import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { Pen } from '@model/Pen';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { PEN_PATH } from '@service/api/Pen/penApi';
import { Divider, Pagination, PaginationProps, Spin } from 'antd';
import { useEffect, useState } from 'react';
import '../../index.scss';
import ModalCreateArea from '../ModalCreateArea/ModalCreateArea';
import ModalEditPens from '../ModalEditPen';
import CardAreaPen from './components/CardAreaPen';
import { t } from 'i18next';
import InputComponent from '@components/Input/InputComponent';

export type DataGroupAreaPen = {
  area: Area;
  pens: Pen[];
};

const ITEMS_PER_PAGE = 6;

const AreaList = () => {
  const modalEdit = useModal();
  const modalCreate = useModal();
  const { data, isLoading, mutate } = useFetcher<Pen[]>(PEN_PATH.PENS, 'GET');
  const { data: dataArea, error } = useFetcher<Area[]>(AREA_PATH.AREAS, 'GET');
  const [id, setId] = useState<number>(0);
  const [dataGroup, setDataGroup] = useState<DataGroupAreaPen[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    if (dataArea) {
      const groupedData: DataGroupAreaPen[] = dataArea.map((area) => ({
        area,
        pens:
          data?.filter((pen) => pen.area?.areaId === area.areaId).slice(0, 5) ||
          [],
      }));
      setDataGroup(groupedData);
    }
  }, [data, dataArea]);

  useEffect(() => {
    if (error) {
      toast.showError(error.message);
    }
  }, [error]);

  const handleEdit = (id: number) => {
    setId(id);
    modalEdit.openModal();
  };

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
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalCreateArea modal={modalCreate} mutate={mutate} />
        <ModalEditPens id={id} modal={modalEdit} mutate={mutate} />
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
          <div className="grid grid-cols-2 gap-10">
            {paginatedData.map((element) => (
              <CardAreaPen element={element} handleEdit={handleEdit} />
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
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaList;
