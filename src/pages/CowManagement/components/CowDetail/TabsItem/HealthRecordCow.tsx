import { Divider, Form, Spin } from 'antd';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import Title from '../../../../../components/UI/Title';
import { cowStatus } from '../../../../../service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '../../../../../service/data/healthRecordStatus';
import useFetcher from '../../../../../hooks/useFetcher';
import { useEffect, useState } from 'react';
import { IllnessCow } from '../../../../../model/Cow/Illness';
import CalendarComponent from '../../../../../components/Calendar/CalendarComponent';
import IllnessModalDetail from './components/ModalIllness/IllnessModalDetail';
import useModal from '../../../../../hooks/useModal';

interface HealthRecordCowProps {
  cowId: string;
}

const HealthRecordCow = ({ cowId }: HealthRecordCowProps) => {
  const [form] = Form.useForm();
  const [showIllness, setShowIllness] = useState(false);
  const [eventData, setEventData] = useState<any[]>([]);
  const [illnessDetail, setIllnessDetail] = useState(null);
  const modal = useModal();
  const {
    data: illnessData,
    isLoading: illnessLoading,
    mutate: mutateIllness,
  } = useFetcher<IllnessCow[]>(`illness/cow/${cowId}`, 'GET');
  const handleVisibleIllness = () => {
    setShowIllness(!showIllness);
  };
  const handleOpenModal = (data: any) => {
    setIllnessDetail(data);
    modal.openModal();
  };
  useEffect(() => {
    if (illnessData) {
      setEventData(
        illnessData.map((element: IllnessCow) => {
          return {
            id: element?.illnessId,
            title: `${element?.severity} - ${element?.userEntity?.name} - ${
              element?.veterinarian
                ? element?.veterinarian?.name
                : 'No Veterinarian'
            }`,
            start: element?.startDate,
            end: new Date(
              new Date(element?.endDate).getTime() +
                24 * 60 * 60 * 1000 -
                24 * 60 * 60 * 1000
            ),
            extendedProps: {
              startDate: element?.startDate,
              endDate: element?.endDate,
              prognosis: element?.prognosis,
              cow: element?.cowEntity,
              user: element?.userEntity,
              veterinarian: element?.veterinarian,
              severity: element?.severity,
              symptoms: element?.symptoms,
            },
          };
        })
      );
    }
  }, [illnessData]);
  return (
    <div className="flex flex-col">
      <FormComponent form={form} className="w-full">
        <Title className="!text-2xl mb-5">Health Record: </Title>
        <div className="flex flex-col gap-8 w-full">
          <div className="grid grid-cols-4 gap-5">
            <FormItemComponent
              name="status"
              label={<LabelForm>Status:</LabelForm>}
            >
              <SelectComponent options={HEALTH_RECORD_STATUS} />
            </FormItemComponent>
            <FormItemComponent
              name="period"
              label={<LabelForm>Period:</LabelForm>}
            >
              <SelectComponent options={cowStatus} />
            </FormItemComponent>
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <div className="grid grid-cols-4 gap-5">
            <FormItemComponent
              name="weight"
              label={<LabelForm>Weight:</LabelForm>}
            >
              <div className="flex items-center gap-2">
                <InputComponent.Number />
                <p>(kilogram)</p>
              </div>
            </FormItemComponent>
            <FormItemComponent name="size" label={<LabelForm>Size:</LabelForm>}>
              <div className="flex items-center gap-2">
                <InputComponent.Number />
                <p>(meter)</p>
              </div>
            </FormItemComponent>
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          <ButtonComponent htmlType="submit" type="primary">
            Save
          </ButtonComponent>
        </div>
      </FormComponent>
      <Divider className="!underline !underline-offset-4 !font-bold !text-blue-500">
        <div onClick={handleVisibleIllness}>
          <p className="cursor-pointer hover:opacity-65 duration-200">
            {showIllness ? 'Hide' : 'Show'} Illness
          </p>
        </div>
      </Divider>
      {illnessLoading ? (
        <Spin />
      ) : (
        showIllness && (
          <div className="flex flex-col gap-5">
            <Title className="!text-2xl mb-5">Illness Record</Title>
            <p className="text-base bg-green-600 w-fit text-white p-2 rounded-md">
              (Mild - User - Veterinarian)
            </p>
            <CalendarComponent
              events={eventData}
              initialView="dayGridMonth"
              headerToolbar={{
                start: 'today prev,next',
                center: 'title',
                end: 'dayGridMonth',
              }}
              eventContentRenderer={(eventInfo) => (
                <div
                  className="text-left !text-wrap"
                  onClick={() => handleOpenModal(eventInfo.event)}
                >
                  {eventInfo?.event?.title}
                </div>
              )}
            />
            <IllnessModalDetail
              data={illnessDetail}
              modal={modal}
              mutate={mutateIllness}
            />
          </div>
        )
      )}
    </div>
  );
};

export default HealthRecordCow;
