import { Divider } from 'antd';
import CardComponent from '../../../../../components/Card/CardComponent';
import TagComponents from '../../../../../components/UI/TagComponents';
import TextTitle from '../../../../../components/UI/TextTitle';
import { VaccineCycleDetails } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatInjectionSite } from '../../../../../utils/format';
import QuillRender from '../../../../../components/UI/QuillRender';

interface DetailInformationVaccineCycleProps {
  data: VaccineCycleDetails;
}
const DetailInformationVaccineCycle = ({
  data,
}: DetailInformationVaccineCycleProps) => {
  return (
    <CardComponent title={data?.name}>
      <div>
        <QuillRender description={data?.description} />
        <Divider />
        <div className="flex flex-col">
          <div className="grid grid-cols-4">
            <TextTitle
              title="Dosage"
              description={
                <p>
                  {data?.dosage} ({data?.dosageUnit})
                </p>
              }
            />
            <TextTitle
              title="Injection Site"
              description={formatInjectionSite(data?.injectionSite)}
            />
            <TextTitle title="Age in months" description={data?.ageInMonths} />
          </div>
          <Divider />
          <div>
            <div className="flex flex-col gap-4">
              <p className="flex gap-3 items-center text-lg">
                <span className="font-normal">Item:</span>
                <span>{data?.itemEntity?.name}</span>
                <TagComponents>{data?.itemEntity?.status}</TagComponents>
                <TagComponents color="blue" className="flex gap-2">
                  <p>{data?.itemEntity?.quantity}</p>
                  <p>({data?.itemEntity?.unit})</p>
                </TagComponents>
              </p>
              <p>
                {data?.itemEntity?.description
                  ? data?.itemEntity?.description
                  : 'No Description'}
              </p>
            </div>
            <Divider />
            <div className="flex justify-between items-start gap-5">
              <CardComponent className="w-1/2 h-fit" title={'Category'}>
                {data?.itemEntity?.categoryEntity?.name}
              </CardComponent>
              <CardComponent
                className="w-1/2 h-fit"
                title={
                  <p className="flex gap-2">
                    <span className="font-normal">Warehouse: </span>
                    <span>
                      {data?.itemEntity?.warehouseLocationEntity?.name}
                    </span>
                  </p>
                }
              >
                {data?.itemEntity?.warehouseLocationEntity?.description}
              </CardComponent>
            </div>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default DetailInformationVaccineCycle;
