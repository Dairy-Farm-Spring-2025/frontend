import DescriptionComponent from '@components/Description/DescriptionComponent';
import TimelineComponent from '@components/Timeline/TimelineComponent';
import QuillRender from '@components/UI/QuillRender';
import TagComponents from '@components/UI/TagComponents';
import { formatStatusWithCamel } from '@utils/format';
import { Divider, Spin } from 'antd';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import Title from '../../../../components/UI/Title';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../hooks/useFetcher';
import {
  VaccineCycle,
  VaccineCycleDetails,
} from '../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import DetailInformationVaccineCycle from './components/DetailInformationVaccineCycle';
import EmptyComponent from '@components/Error/EmptyComponent';
import { VACCINE_CYCLE_PATH } from '@service/api/VaccineCycle/vaccineCycleApi';

const DetailVaccineCycle = () => {
  const { id } = useParams();
  const { data: vaccineCycleDetailData, isLoading: isLoadingDetailCycle } =
    useFetcher<VaccineCycle>(
      VACCINE_CYCLE_PATH.GET_VACCINE_CYCLE(id as any),
      'GET'
    );

  if (isLoadingDetailCycle) return <Spin />;
  return (
    <AnimationAppear>
      <WhiteBackground>
        {vaccineCycleDetailData === undefined ||
        vaccineCycleDetailData === null ? (
          <EmptyComponent />
        ) : (
          <>
            <div className="flex flex-col gap-5">
              <Title>{t('Vaccine cycle detail')}</Title>
              <DescriptionComponent
                layout="horizontal"
                labelStyle={{
                  width: '15%',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
                items={[
                  {
                    label: t('Name'),
                    children: (
                      <Title className="!text-base">
                        {vaccineCycleDetailData?.name}
                      </Title>
                    ),
                    span: 3,
                  },
                  {
                    label: t('For cow type'),
                    span: 3,
                    children: (
                      <div className="flex items-center gap-3 !text-base">
                        <p>
                          {vaccineCycleDetailData?.cowTypeEntity?.name} -{' '}
                          {vaccineCycleDetailData?.cowTypeEntity?.maxWeight}{' '}
                          (killogram)
                        </p>
                        <TagComponents
                          color={
                            vaccineCycleDetailData?.cowTypeEntity?.status ===
                            'exist'
                              ? 'green-inverse'
                              : 'red-inverse'
                          }
                        >
                          {t(
                            formatStatusWithCamel(
                              vaccineCycleDetailData?.cowTypeEntity
                                ?.status as string
                            )
                          )}
                        </TagComponents>
                      </div>
                    ),
                  },
                  {
                    label: t('Description'),
                    children: (
                      <QuillRender
                        description={
                          vaccineCycleDetailData?.description as string
                        }
                      />
                    ),
                  },
                ]}
              />
            </div>
            <Divider />
            <div className="flex flex-col gap-10">
              <div>
                <Title className="!text-xl">
                  {t('Vaccine cycle informations list of {{name}}', {
                    name: vaccineCycleDetailData?.name,
                  })}
                </Title>
                <Divider />
                <div className="pr-10">
                  <TimelineComponent
                    mode="right"
                    items={
                      vaccineCycleDetailData?.vaccineCycleDetails?.map(
                        (element: VaccineCycleDetails, index: number) => ({
                          children: (
                            <div key={index}>
                              <DetailInformationVaccineCycle data={element} />
                            </div>
                          ),
                          label: (
                            <div className="flex flex-col gap-2">
                              <Title>{element.name}</Title>
                              <QuillRender
                                description={
                                  element?.description || 'No Description'
                                }
                                className="prose max-w-full p-4 bg-gray-50 rounded-lg"
                              />
                            </div>
                          ),
                        })
                      ) || []
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailVaccineCycle;
