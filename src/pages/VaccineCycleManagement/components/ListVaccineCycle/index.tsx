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

const ListVaccineCycle = () => {
  const {
    data: vaccineCycle,
    isLoading: isLoadingVaccine,
    mutate,
  } = useFetcher<VaccineCycle[]>('vaccinecycles', 'GET');
  const modal = useModal();
  const columns: Column[] = [
    {
      dataIndex: 'vaccineCycleID',
      key: 'vaccineCycleID',
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
