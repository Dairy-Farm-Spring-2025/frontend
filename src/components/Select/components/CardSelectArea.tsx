import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import { Area } from '@model/Area';
import { formatStatusWithCamel } from '@utils/format';
import { Divider } from 'antd';
import { t } from 'i18next';
import { LiaChartAreaSolid } from 'react-icons/lia';

interface CardSelectAreaProps {
  area: Area;
}

const CardSelectArea = ({ area }: CardSelectAreaProps) => {
  return (
    <div className="py-5">
      <div className="flex gap-3 items-center">
        <LiaChartAreaSolid size={20} />
        <p className="font-bold text-base">{area?.name}</p>
        <TagComponents color="blue" className="!text-sm">
          {formatStatusWithCamel(area?.areaType)}
        </TagComponents>
      </div>
      <Divider className="my-1" />
      <div className="grid grid-cols-3">
        <TextTitle
          title={t('Pen size')}
          description={`${area?.penLength}(m) x ${area?.penWidth}(m)`}
        />
        <TextTitle
          title={t('Dimension')}
          description={`${area?.length}(m) x ${area?.width}(m)`}
        />
      </div>
      <div className="grid grid-cols-3 mt-2 ">
        <TextTitle
          title={t('Occupied')}
          description={`${area?.occupiedPens} pen`}
        />
        <TextTitle title={t('Empty')} description={`${area?.emptyPens} pen`} />
        <TextTitle
          title={t('Damaged')}
          description={`${area?.damagedPens} pen`}
        />
      </div>
    </div>
  );
};

export default CardSelectArea;
