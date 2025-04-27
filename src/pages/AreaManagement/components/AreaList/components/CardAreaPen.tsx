import { ArrowRightOutlined } from '@ant-design/icons';
import CardComponent from '@components/Card/CardComponent';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import { formatAreaType, formatDateHour } from '@utils/format';
import { Button, Tooltip } from 'antd';
import { t } from 'i18next';
import { LiaChartAreaSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { DataGroupAreaPen } from '../AreaList';
import { cowStatus } from '@service/data/cowStatus'; // Import cowStatus
import TagComponents from '@components/UI/TagComponents';

interface CardAreaPenProps {
  element: DataGroupAreaPen;
}

const CardAreaPen = ({ element }: CardAreaPenProps) => {
  const navigate = useNavigate();

  // Helper function to get cowStatus label
  const getCowStatusLabel = (status: string | null) => {
    if (!status) return 'N/A';
    const statusOption = cowStatus().find((s) => s.value === status);
    return statusOption ? statusOption.label : status; // Fallback to raw status if not found
  };

  return (
    <CardComponent key={element.area?.areaId} className="!h-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <LiaChartAreaSolid size={50} />
              <div className="flex flex-col">
                <div className="flex gap-3">
                  <Title>{element.area?.name}</Title>
                  <TagComponents
                    color={
                      element?.area?.areaType === 'quarantine' ? 'red' : 'blue'
                    }
                  >
                    {element?.area?.areaType === 'quarantine' ? '🏥' : '🏡'}{' '}
                    {t(formatAreaType(element?.area?.areaType))}
                  </TagComponents>
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-y-5">
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
              description={<p>{element?.area?.maxPen ?? 0}</p>}
            />
            <TextTitle
              title={t('Number in row')}
              description={<p>{element?.area?.numberInRow ?? 0}</p>}
            />
            <TextTitle
              title={t('Occupied pens')}
              description={<p>{element?.area?.occupiedPens ?? 0}</p>}
            />
            <TextTitle
              title={t('Empty pens')}
              description={<p>{element?.area?.emptyPens ?? 0}</p>}
            />
            <TextTitle
              title={t('Damaged pens')}
              description={<p>{element?.area?.damagedPens ?? 0}</p>}
            />
            <TextTitle
              title={t('Cow Status')}
              description={<p>{getCowStatusLabel(element?.area?.cowStatus)}</p>}
            />
            <TextTitle
              title={t('Cow Type')}
              description={<p>{element?.area?.cowTypeEntity?.name ?? 'N/A'}</p>}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default CardAreaPen;
