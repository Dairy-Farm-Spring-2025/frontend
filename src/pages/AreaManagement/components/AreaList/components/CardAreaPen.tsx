import CardComponent from '@components/Card/CardComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import { formatDateHour, formatSTT } from '@utils/format';
import { Button, Divider, Tooltip } from 'antd';
import { t } from 'i18next';
import { LiaChartAreaSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { DataGroupAreaPen } from '../AreaList';
import {
  penFilter,
  penStatus,
  penStatusFilter,
  penType,
} from '@service/data/pen';
import TagComponents from '@components/UI/TagComponents';

interface CardAreaPenProps {
  element: DataGroupAreaPen;
  handleEdit: any;
}

const CardAreaPen = ({ element, handleEdit }: CardAreaPenProps) => {
  const navigate = useNavigate();

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
      render: (element: string, data) => (
        <p
          onClick={() => handleEdit(data.penId)}
          className="text-blue-600 underline underline-offset-1 cursor-pointer"
        >
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

        return type ? (
          <TagComponents color="blue">{type.label}</TagComponents>
        ) : null;
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
                <strong>{t('Length')}: </strong> {data.area.penLength} m
              </p>{' '}
              <p>
                <strong> {t('Width')}: </strong>
                {data.area.penWidth} m{' '}
              </p>
            </div>
          }
        >
          <span>
            {data.area.penLength} x {data.area.penWidth} m
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
        return status ? (
          <TagComponents color="green">{status.label}</TagComponents>
        ) : null;
      },
      filterable: true,
      filterOptions: penStatusFilter,
    },
  ];
  return (
    <CardComponent key={element.area?.areaId} className="!h-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <LiaChartAreaSolid size={50} />
              <div className="flex flex-col">
                <Title>{element.area?.name}</Title>
                <p className="text-gray-400">
                  {t('Created At')}: {formatDateHour(element?.area?.createdAt)}
                </p>
              </div>
            </div>
            <Tooltip title={t('Move to detail')}>
              <Button
                onClick={() => navigate(`${element?.area?.areaId}`)}
                shape="circle"
                type="primary"
                icon={<ArrowRightOutlined />}
                size="large"
              />
            </Tooltip>
          </div>
          <div className="grid grid-cols-4 gap-y-5">
            <TextTitle
              title={t('Area dimension')}
              description={
                <p>
                  {element?.area?.width} (m) x {element?.area?.length} (m)
                </p>
              }
            />
            <TextTitle
              title={t('Pen dimension')}
              description={
                <p>
                  {element?.area?.penWidth} (m) x {element?.area?.penLength} (m)
                </p>
              }
            />
            <TextTitle
              title={t('Max pen')}
              description={
                <p>{element?.area?.maxPen ? element?.area?.maxPen : 'N/A'}</p>
              }
            />
            <TextTitle
              title={t('Number in row')}
              description={
                <p>
                  {element?.area?.numberInRow
                    ? element?.area?.numberInRow
                    : 'N/A'}
                </p>
              }
            />
            <TextTitle
              title={t('Occupied pens')}
              description={
                <p>
                  {element?.area?.occupiedPens
                    ? element?.area?.occupiedPens
                    : 'N/A'}
                </p>
              }
            />
            <TextTitle
              title={t('Empty pens')}
              description={
                <p>
                  {element?.area?.emptyPens ? element?.area?.emptyPens : 'N/A'}
                </p>
              }
            />
            <TextTitle
              title={t('Damaged pens')}
              description={
                <p>
                  {element?.area?.damagedPens
                    ? element?.area?.damagedPens
                    : 'N/A'}
                </p>
              }
            />
          </div>
        </div>
        <Divider />
        <TableComponent
          className="!shadow-none"
          columns={columns}
          dataSource={element?.pens ? formatSTT(element?.pens) : []}
          pagination={false}
        />
      </div>
    </CardComponent>
  );
};

export default CardAreaPen;
