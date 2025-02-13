import CardComponent from '../../../../../components/Card/CardComponent';
import QuillRender from '../../../../../components/UI/QuillRender';
import TagComponents from '../../../../../components/UI/TagComponents';
import { VaccineCycle } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';

interface GeneralVaccineCycleProps {
  data: VaccineCycle;
}
const GeneralVaccineCycle = ({ data }: GeneralVaccineCycleProps) => {
  return (
    <div className="flex justify-between gap-5">
      <CardComponent className="w-1/2" title={'Description'}>
        <QuillRender description={data?.description} />
      </CardComponent>
      <CardComponent
        className="w-1/2"
        title={
          <p className="flex gap-2">
            <span className="font-normal">Cow Type:</span>
            <span>{data?.cowTypeEntity?.name}</span>
            <TagComponents>{data?.cowTypeEntity?.status}</TagComponents>
          </p>
        }
      >
        {data?.cowTypeEntity?.description}
      </CardComponent>
    </div>
  );
};

export default GeneralVaccineCycle;
