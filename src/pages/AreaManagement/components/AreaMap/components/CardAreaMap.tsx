import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import { formatDateHour } from '@utils/format';
import { t } from 'i18next';
import { LiaChartAreaSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { DataGroupAreaPen } from '../../AreaList/AreaList';
import { Tooltip } from 'antd';

interface CardAreaMapProps {
  element: DataGroupAreaPen;
}
const CardAreaMap = ({ element }: CardAreaMapProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip title={t('Move to detail')}>
      <div
        onClick={() => navigate(`${element.area.areaId}`)}
        className="flex flex-col gap-4 hover:!bg-gray-200 cursor-pointer"
      >
        <div className="flex justify-between items-center !text-left">
          <div className="flex gap-2 items-center">
            <LiaChartAreaSolid size={50} />
            <div className="flex flex-col">
              <Title>{element.area?.name}</Title>
              <p className="text-gray-400">
                {t('Created At')}: {formatDateHour(element?.area?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 !text-left">
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
        </div>
      </div>
    </Tooltip>
  );
};

export default CardAreaMap;
