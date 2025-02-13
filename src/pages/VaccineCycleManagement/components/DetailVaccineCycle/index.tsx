import { Divider, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import {
  VaccineCycle,
  VaccineCycleDetails,
} from '../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import GeneralVaccineCycle from './components/GeneralVaccineCycle';
import Title from '../../../../components/UI/Title';
import DetailInformationVaccineCycle from './components/DetailInformationVaccineCycle';

const DetailVaccineCycle = () => {
  const { id } = useParams();
  const { data: vaccineCycleDetailData, isLoading: isLoadingDetailCycle } =
    useFetcher<VaccineCycle>(`vaccinecycles/${id}`);

  if (isLoadingDetailCycle) return <Spin />;
  return (
    <AnimationAppear>
      <WhiteBackground>
        <Title>{vaccineCycleDetailData?.name}</Title>
        <Divider />
        <div className="flex flex-col gap-10">
          <GeneralVaccineCycle data={vaccineCycleDetailData as VaccineCycle} />
          <div>
            <Title className="!text-xl">Detail Information</Title>
            <Divider />
            <div className="flex flex-col">
              {vaccineCycleDetailData?.vaccineCycleDetails?.map(
                (element: VaccineCycleDetails, index: number) => (
                  <div>
                    <DetailInformationVaccineCycle data={element} />
                    {vaccineCycleDetailData?.vaccineCycleDetails?.length - 1 !==
                      index && <Divider />}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailVaccineCycle;
