import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import Title from '@components/UI/Title';
import { FormInstance } from 'antd';

interface InjectionFormProps {
  form: FormInstance;
  onBack: () => void;
}

const InjectionForm = ({ form }: InjectionFormProps) => {
  return (
    <div>
      <Title className="mb-5">Injection Record:</Title>
      <div className="flex flex-col gap-2 w-full">
        <FormItemComponent
          name="vaccineName"
          label={
            <LabelForm>
              <span className="text-red-500">*</span> Vaccine Name
            </LabelForm>
          }
        >
          <p
            className="border border-gray-300 rounded p-2 bg-white text-sm text-gray-800"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {form.getFieldValue('vaccineName') || 'N/A'}
          </p>
        </FormItemComponent>

        <FormItemComponent
          name="date"
          label={
            <LabelForm>
              <span className="text-red-500">*</span> Injection Date
            </LabelForm>
          }
        >
          <p
            className="border border-gray-300 rounded p-2 bg-white text-sm text-gray-800"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {form.getFieldValue('date')?.format('DD/MM/YYYY') || 'N/A'}
          </p>
        </FormItemComponent>

        <FormItemComponent
          name="administeredBy"
          label={
            <LabelForm>
              <span className="text-red-500">*</span> Injected by
            </LabelForm>
          }
        >
          <p
            className="border border-gray-300 rounded p-2 bg-white text-sm text-gray-800"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {form.getFieldValue('administeredBy') || 'N/A'}
          </p>
        </FormItemComponent>

        <FormItemComponent
          name="dosage"
          label={
            <LabelForm>
              <span className="text-red-500">*</span> Dosage
            </LabelForm>
          }
        >
          <p
            className="border border-gray-300 rounded p-2 bg-white text-sm text-gray-800"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {form.getFieldValue('dosage') || 'N/A'}
          </p>
        </FormItemComponent>

        <FormItemComponent
          name="injectionSite"
          label={
            <LabelForm>
              <span className="text-red-500">*</span> Injection site
            </LabelForm>
          }
        >
          <p
            className="border border-gray-300 rounded p-2 bg-white text-sm text-gray-800"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {form.getFieldValue('injectionSite') || 'N/A'}
          </p>
        </FormItemComponent>
      </div>
    </div>
  );
};

export default InjectionForm;
