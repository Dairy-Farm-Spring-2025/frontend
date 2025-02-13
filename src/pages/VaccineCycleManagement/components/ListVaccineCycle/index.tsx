import { Divider } from 'antd';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import { VaccineCycle } from '../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatDateHour } from '../../../../utils/format';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import useModal from '../../../../hooks/useModal';
import CreateVaccineCycleModal from './components/CreateVaccineCycleModal';
import PopconfirmComponent from '../../../../components/Popconfirm/PopconfirmComponent';
import useToast from '../../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const ListVaccineCycle = () => {
  const navigate = useNavigate();
  const {
    data: vaccineCycle,
    isLoading: isLoadingVaccine,
    mutate,
  } = useFetcher<VaccineCycle[]>('vaccinecycles', 'GET');
  const { isLoading: isLoadingDelete, trigger } = useFetcher(
    'vaccinecycles/delete',
    'DELETE'
  );
  const modal = useModal();
  const toast = useToast();

  const handleDelete = async (id: number) => {
    try {
      const response = await trigger({ url: `vaccinecycles/${id}` });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'vaccineCycleId',
      key: 'vaccineCycleId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'Created At',
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'vaccineCycleId',
      key: 'action',
      title: 'Action',
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => navigate(`../${data}`)}
          >
            View Detail
          </ButtonComponent>
          <PopconfirmComponent
            onConfirm={() => handleDelete(data)}
            title={'Are you sure to delete this?'}
          >
            <ButtonComponent loading={isLoadingDelete} danger type="primary">
              Delete
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
          Create Vaccine Cycle
        </ButtonComponent>
        <Divider />
        <TableComponent
          columns={columns}
          loading={isLoadingVaccine}
          dataSource={vaccineCycle as VaccineCycle[]}
        />
        <CreateVaccineCycleModal modal={modal} mutate={mutate} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListVaccineCycle;
