import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../../components/Popconfirm/PopconfirmComponent';
import TableComponent, {
  Column,
} from '../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { FeedType } from '../../../../../model/Feed/Feed';
import { formatStatusWithCamel } from '../../../../../utils/format';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const FeedMealList = () => {
  const { data, isLoading, mutate } = useFetcher<FeedType[]>(
    'feedmeals',
    'GET'
  );
  const toast = useToast();
  const navigate = useNavigate();
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'feedmeals',
    'DELETE'
  );
  const { t } = useTranslation();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: `feedmeals/${id}` });
      toast.showSuccess(t('Delete success'));
      mutate();
    } catch (error: any) {
      toast.showError(t(error.message));
    }
  };

  const column: Column[] = [
    {
      dataIndex: 'feedMealId',
      key: 'feedMealId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      // render: (data) => <p className="text-base font-bold">{data}</p>,
    },
    {
      dataIndex: 'cowTypeEntity',
      key: 'cowTypeEntity',
      title: t('Cow Type'),
      render: (data) => data.name,
    },
    {
      title: t('Cow Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      render: (data) => formatStatusWithCamel(data ? data : t('No status')),
    },
    {
      title: t('Shift'),
      dataIndex: 'shift',
      key: 'shift',
      render: (data) => formatStatusWithCamel(data ? data : t('No shift')),
    },
    {
      dataIndex: 'feedMealId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent onClick={() => navigate(`../${data}`)}>
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title={'Delete?'}
            onConfirm={() => onConfirm(data)}
          >
            <ButtonComponent type="primary" danger>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        {loadingDelete ? (
          <Spin />
        ) : (
          <div className="flex flex-col gap-5">
            <TableComponent
              dataSource={data || []}
              columns={column}
              loading={isLoading}
            />
          </div>
        )}
        {/* <ModalAddSupplier modal={modal} mutate={mutate} />
                {id !== '' && (
                    <ModalDetailSupplier id={id} modal={modalDetail} mutate={mutate} />
                )} */}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default FeedMealList;
