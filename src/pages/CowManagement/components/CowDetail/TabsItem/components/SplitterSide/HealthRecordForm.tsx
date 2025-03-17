import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../../components/LabelForm/LabelForm';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import Title from '../../../../../../../components/UI/Title';
import { cowStatus } from '../../../../../../../service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '../../../../../../../service/data/healthRecordStatus';

interface HealthRecordFormProps {
  loading: boolean;
}

const HealthRecordForm = ({ loading }: HealthRecordFormProps) => {
  return (
    <div>
      <Title className="!text-2xl mb-5">Health Record: </Title>
      <div className="flex flex-col gap-2 w-full">
        <FormItemComponent
          rules={[{ required: true }]}
          name="status"
          label={<LabelForm>Status:</LabelForm>}
        >
          <SelectComponent disabled={loading} options={HEALTH_RECORD_STATUS} />
        </FormItemComponent>
        <FormItemComponent
          rules={[{ required: true }]}
          name="period"
          label={<LabelForm>Period:</LabelForm>}
        >
          <SelectComponent disabled={loading} options={cowStatus} />
        </FormItemComponent>
        <FormItemComponent
          rules={[{ required: true }]}
          name="size"
          label={<LabelForm>Size (meter):</LabelForm>}
        >
          <InputComponent.Number disabled={loading} />
        </FormItemComponent>
      </div>
      <FormItemComponent name="cowId" hidden>
        <InputComponent />
      </FormItemComponent>
      <FormItemComponent name="healthId" hidden>
        <InputComponent />
      </FormItemComponent>
      <div className="flex justify-start items-center gap-3">
        <ButtonComponent loading={loading} htmlType="submit" type="primary">
          Save
        </ButtonComponent>
      </div>
    </div>
  );
};

export default HealthRecordForm;
