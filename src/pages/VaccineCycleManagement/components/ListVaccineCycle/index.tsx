import { Divider } from 'antd';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { VaccineCycle } from '@model/Vaccine/VaccineCycle/vaccineCycle';
import { formatDateHour } from '@utils/format';
import ButtonComponent from '@components/Button/ButtonComponent';
import useModal from '@hooks/useModal';
import CreateVaccineCycleModal from './components/CreateVaccineCycleModal';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import useToast from '@hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VACCINE_CYCLE_PATH } from '@service/api/VaccineCycle/vaccineCycleApi';

const ListVaccineCycle = () => {
  const navigate = useNavigate();
  const {
    data: vaccineCycle,
    isLoading: isLoadingVaccine,
    mutate,
  } = useFetcher<VaccineCycle[]>(
    VACCINE_CYCLE_PATH.GET_ALL_VACCINE_CYCLE,
    'GET'
  );
  const { isLoading: isLoadingDelete, trigger } = useFetcher(
    'vaccinecycles/delete',
    'DELETE'
  );
  const modal = useModal();
  const toast = useToast();
  const { t } = useTranslation();
  const handleDelete = async (id: number) => {
    try {
      const response = await trigger({
        url: VACCINE_CYCLE_PATH.DELETE_VACCINE_CYCLE(id),
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created At'),
      render: (data) => formatDateHour(data),
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      searchable: true,
    },
    {
      dataIndex: 'vaccineCycleId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => navigate(`../${data}`)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            onConfirm={() => handleDelete(data)}
            title={t('Are you sure to delete this?')}
          >
            <ButtonComponent danger type="primary">
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
        <ButtonComponent type="primary" onClick={() => modal.openModal()}>
          {t('Create Vaccine Cycle')}
        </ButtonComponent>
        <Divider />
        <TableComponent
          columns={columns}
          loading={isLoadingVaccine || isLoadingDelete}
          dataSource={vaccineCycle as VaccineCycle[]}
        />
        <CreateVaccineCycleModal modal={modal} mutate={mutate} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListVaccineCycle;
