import Text from '@components/UI/Text';
import { t } from 'i18next';

const StatusTask = () => {
  return (
    <div className="flex gap-10 items-center">
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 border-[1px] border-yellow-400 rounded-xl bg-[#FEF9C3]"></div>
        <Text>{t('Pending')}</Text>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 border-[1px] border-blue-400 rounded-xl bg-[#DBEAFE]"></div>
        <Text>{t('Processing')}</Text>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 border-[1px] border-green-400 rounded-xl bg-[#D1FAE5]"></div>
        <Text>{t('Closed')}</Text>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 border-[1px] border-gray-400 rounded-xl bg-[#DEDEDE]"></div>
        <Text>{t('Not Start')}</Text>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 border-[1px] border-red-400 rounded-xl bg-[#FFAFAF]"></div>
        <Text>{t('Misssing')}</Text>
      </div>
    </div>
  );
};

export default StatusTask;
