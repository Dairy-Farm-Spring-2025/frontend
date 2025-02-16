import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import DateRangeItem from '../../../../../../../components/Form/Item/DateRangeItem/DateRangeItem';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import TextTitle from '../../../../../../../components/UI/TextTitle';
import Title from '../../../../../../../components/UI/Title';
import { IllnessCow } from '../../../../../../../model/Cow/Illness';
import { SEVERITY_OPTIONS } from '../../../../../../../service/data/severity';

interface IllnessRecordFormProps {
  loading: boolean;
  data: IllnessCow;
}

const IllnessRecordForm = ({ loading, data }: IllnessRecordFormProps) => {
  return (
    <div>
      <Title className="!text-2xl mb-5">Illness Record: </Title>
      <div className="grid grid-cols-3">
        <TextTitle title="User" description={data?.userEntity?.name} />
        <TextTitle
          title="Veterinarian"
          description={
            data?.veterinarian ? data?.veterinarian?.name : 'No veterinarian'
          }
        />
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-5">
          <FormItemComponent
            rules={[{ required: true }]}
            name="severity"
            label={<LabelForm>Severity</LabelForm>}
          >
            <SelectComponent options={SEVERITY_OPTIONS} disabled={loading} />
          </FormItemComponent>
          <DateRangeItem disable={loading} />
        </div>
        <div className="w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            name="symptoms"
            label={<LabelForm>Symptoms</LabelForm>}
          >
            <ReactQuillComponent readOnly={loading} />
          </FormItemComponent>
        </div>
        <div className="w-full">
          <FormItemComponent
            rules={[{ required: true }]}
            name="prognosis"
            label={<LabelForm>Prognosis</LabelForm>}
          >
            <ReactQuillComponent readOnly={loading} />
          </FormItemComponent>
        </div>
        <FormItemComponent name="cowId" hidden>
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent name="illnessId" hidden>
          <InputComponent />
        </FormItemComponent>
        <div>
          <ButtonComponent loading={loading} type="primary" htmlType="submit">
            Save
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default IllnessRecordForm;
