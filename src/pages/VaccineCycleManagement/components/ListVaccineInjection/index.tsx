import { VaccineInjection } from '@model/Vaccine/VaccineCycle/VaccineInjection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import {
  formatDateHour,
  formatStatusWithCamel,
} from '../../../../utils/format';
import { Tag } from 'antd';

const ListVaccineInjection = () => {
  const navigate = useNavigate();
  const {
    data: vaccineInjection,
    isLoading: isLoadingVaccine,
    mutate,
  } = useFetcher<VaccineInjection[]>('vaccine-injections', 'GET');
  const { isLoading: isLoadingDelete, trigger } = useFetcher(
    'vaccine-injections/delete',
    'DELETE'
  );

  const toast = useToast();
  const { t } = useTranslation();
  const handleDelete = async (id: number) => {
    try {
      const response = await trigger({ url: `vaccine-injections/${id}` });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'injectionDate',
      key: 'injectionDate',
      title: t('Injection Date'),
      render: (data) => formatDateHour(data),
      sorter: (a, b) => a?.injectionDate - b?.injectionDate,
    },
    {
      dataIndex: 'cowEntity',
      key: 'cowEntity',
      title: t('Cow'),
      render: (cowEntity) => cowEntity?.name || 'N/A',
      searchable: true,
      objectKeyFilter: 'name',
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (status: string) => {
        let color = 'blue';
        if (status === 'pending') color = 'yellow';
        if (status === 'inProgress') color = 'orange';
        if (status === 'completed') color = 'green';
        if (status === 'cancelled') color = 'red';
        return (
          <Tag color={color}>{t(formatStatusWithCamel(status)) || 'N/A'}</Tag>
        );
      },
    },
    {
      dataIndex: 'id',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => navigate(`../injection/${data}`)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            onConfirm={() => handleDelete(data)}
            title={t('Are you sure to delete this?')}
          >
            <ButtonComponent loading={isLoadingDelete} danger type="primary">
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
        <TableComponent
          columns={columns}
          loading={isLoadingVaccine}
          dataSource={vaccineInjection as VaccineInjection[]}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListVaccineInjection;
