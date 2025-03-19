import { Empty } from 'antd';
import { t } from 'i18next';

const EmptyComponent = () => {
  return (
    <Empty
      className="flex flex-col items-center justify-center"
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      description={t('No data found')}
    />
  );
};

export default EmptyComponent;
