import TagComponents from '@components/UI/TagComponents';
import { getPenColor } from '@utils/statusRender/penStatusRender';
import { DataGroupAreaPen } from '../../AreaList/AreaList';
import { t } from 'i18next';
import { Divider } from 'antd';

interface CardPenMapProps {
  data: DataGroupAreaPen;
}

const CardPenMap = ({ data }: CardPenMapProps) => {
  return (
    <div className="w-auto min-w-[150px] max-w-full">
      <div className="flex flex-col gap-2">
        <p>
          {t('Max pen')}:{' '}
          <span className="font-bold text-secondary">{data.area.maxPen}</span>
        </p>
        <div className="text-left">
          <p>
            {t('Number in row')}:{' '}
            <span className="font-bold text-secondary">
              {data.area.numberInRow ? data.area.numberInRow : 'N/A'}
            </span>
          </p>
          <p>
            {t('Occupied pens')}:{' '}
            <span className="font-bold text-secondary">
              {data.area.occupiedPens ? data.area.occupiedPens : 0}
            </span>
          </p>
          <p>
            {t('Empty pens')}:{' '}
            <span className="font-bold text-secondary">
              {data.area.emptyPens ? data.area.emptyPens : 0}
            </span>
          </p>
          <p>
            {t('Damaged pens')}:{' '}
            <span className="font-bold text-secondary">
              {data.area.damagedPens ? data.area.damagedPens : 0}
            </span>
          </p>
        </div>
      </div>

      <Divider className="!my-2" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(2, 1fr)`,
          gap: 5,
        }}
      >
        {data.pens.map((pen) => (
          <TagComponents
            key={pen.penId}
            color={getPenColor(pen.penStatus)}
            className="!text-center"
          >
            {pen.name}
          </TagComponents>
        ))}
      </div>
    </div>
  );
};

export default CardPenMap;
