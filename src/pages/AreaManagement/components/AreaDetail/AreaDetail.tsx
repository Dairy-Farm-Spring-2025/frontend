import useFetcher from '@hooks/useFetcher';
import { Area } from '@model/Area';
import { Pen } from '@model/Pen';
import { useParams } from 'react-router-dom';
import AreaDimension from './components/AreaDimension';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import TableComponent, { Column } from '@components/Table/TableComponent';
import { formatDateHour, formatSTT } from '@utils/format';
import {
  penFilter,
  penStatus,
  penStatusFilter,
  penType,
} from '@service/data/pen';
import { Divider, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '@components/Button/ButtonComponent';
import useModal from '@hooks/useModal';
import ModalCreatePen from '../ModalCreatePen';

const AreaDetail = () => {
  const { id } = useParams();
  const modal = useModal();

  const {
    data: area,
    isLoading: isLoadingArea,
    mutate,
  } = useFetcher<Area>(`areas/${id}`);
  const {
    data: pens,
    isLoading: isLoadingPens,
    mutate: mutatePen,
  } = useFetcher<Pen[]>(`pens/area/${id}`);
  const { t } = useTranslation();

  const columns: Column[] = [
    {
      dataIndex: 'penId',
      key: 'penId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Pen Name'),
      render: (element: string) => (
        <p className="text-blue-600 underline underline-offset-1 cursor-pointer">
          {element}
        </p>
      ),
      searchable: true,
    },
    {
      dataIndex: 'penType',
      key: 'penType',
      title: t('Pen Type'),
      render: (typeValue: string) => {
        const type = penType.find((type) => type.value === typeValue);

        return type ? <Tag color="blue">{type.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penFilter,
    },
    {
      dataIndex: 'length',
      key: 'length',
      title: t('Dimensions'),
      render: (_: any, data) => (
        <Tooltip
          className="tooltip-content"
          placement="top"
          title={
            <div className="dimensions flex flex-col">
              <p>
                <strong>{t('Length')}: </strong> {data?.areaBelongto?.penLength}{' '}
                m
              </p>{' '}
              <p>
                <strong> {t('Width')}: </strong>
                {data?.areaBelongto?.penWidth} m{' '}
              </p>
            </div>
          }
        >
          <span>
            {data?.areaBelongto?.penLength} m x {data?.areaBelongto?.penWidth} m
          </span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'penStatus',
      key: 'penStatus',
      title: t('Status'),
      render: (statusValue: string) => {
        // Find the label for the given statusValue
        const status = penStatus.find((status) => status.value === statusValue);
        // Return the Tag with the status label
        return status ? <Tag color="green">{status.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penStatusFilter,
    },
  ];
  if (isLoadingArea || isLoadingPens) return <p>Loading...</p>;
  if (!area) return <p>Area not found!</p>;

  const numPensX = Math.floor(area.width / area.penWidth);
  const numPensY = Math.floor(area.length / area.penLength);

  const handleOpen = () => {
    modal.openModal();
  };

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="p-4">
          <div className="flex flex-col">
            <div>
              <h2 className="text-2xl font-bold">{area.name}</h2>

              <p>
                <strong>Kích thước:</strong> {area.width}m x {area.length}m
              </p>
              <p>
                <strong>Pen Size:</strong> {area.penWidth}m x {area.penLength}m
              </p>
              <p>
                <strong>Số Pen có thể chứa:</strong> {numPensX * numPensY}
              </p>
            </div>
            <div className="h-full">
              <AreaDimension area={area} pens={pens as Pen[]} />
            </div>{' '}
          </div>
          <Divider />

          <ButtonComponent
            className="mb-5"
            onClick={handleOpen}
            disabled={
              pens && numPensX * numPensY <= pens?.length ? true : false
            }
          >
            {t('Create New Pen')}
          </ButtonComponent>
          <TableComponent
            columns={columns}
            dataSource={pens ? formatSTT(pens) : []}
            loading={isLoadingPens}
            pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          />
          <ModalCreatePen
            mutatePen={mutatePen}
            areaId={id}
            modal={modal}
            mutate={mutate}
          />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaDetail;
