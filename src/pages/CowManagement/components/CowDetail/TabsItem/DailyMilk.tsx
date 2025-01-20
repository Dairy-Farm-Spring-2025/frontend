import { EventInput } from '@fullcalendar/core/index.js';
import { Form, Spin } from 'antd';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { PiPencil } from 'react-icons/pi';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import CalendarComponent from '../../../../../components/Calendar/CalendarComponent';
import DescriptionComponent from '../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import PopconfirmComponent from '../../../../../components/Popconfirm/PopconfirmComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useModal from '../../../../../hooks/useModal';
import useToast from '../../../../../hooks/useToast';
import { Cow } from '../../../../../model/Cow/Cow';
import { DailyMilkModel } from '../../../../../model/DailyMilk/DailyMilk';
import CreateDailyMilkModal from './components/CreateDailyMilkModal';

interface DailyMilkProps {
  id: string;
  dataMilk: DailyMilkModel[];
  isLoading: boolean;
  mutateDaily: any;
  detailCow: Cow;
}

const classNameStyle = '!text-xs lg:!text-sm !text-center !p-2';

const DailyMilk = ({
  id,
  dataMilk = [],
  isLoading,
  mutateDaily,
  detailCow,
}: DailyMilkProps) => {
  const modal = useModal();
  const toast = useToast();
  const { trigger } = useFetcher(`dailymilks`, 'DELETE');
  const { trigger: triggerEdit, isLoading: isLoadingEdit } = useFetcher(
    'dailymilks/volume',
    'PUT'
  );
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const events: EventInput[] | any = dataMilk?.map((entry: DailyMilkModel) => {
    let start = entry.milkDate;
    let end = entry.milkDate;

    if (entry.shift === 'shiftOne') {
      start = `${entry.milkDate}T08:00:00`;
      end = `${entry.milkDate}T15:00:00`;
    } else if (entry.shift === 'shiftTwo') {
      start = `${entry.milkDate}T18:00:00`;
      end = `${entry.milkDate}T24:00:00`;
    }

    return {
      id: entry.dailyMilkId.toString(),
      title: `${entry.cow.name}`,
      start,
      end,
      extendedProps: {
        shift: entry.shift === 'shiftOne' ? 'Shift One' : 'Shift Two',
        cowName: entry.cow.name,
        cowStatus: entry.cow.cowStatus,
        worker: {
          name: entry.worker.name,
          employeeId: entry.worker.employeeNumber,
        },
        volume: entry.volume,
      },
    };
  });

  const openModal = () => {
    modal.openModal();
  };

  const toogleEdit = (id: string, volume: number) => {
    setEdit(!edit);
    if (edit === false) {
      form.setFieldsValue({
        newVolume: volume,
        id: id,
      });
    } else {
      form.resetFields();
    }
  };

  const onFinish = async (values: any) => {
    const data = {
      id: values.id,
      volume: values.newVolume,
    };
    try {
      await triggerEdit({
        url: `dailymilks/volume/${data.id}?newVolume=${data.volume}`,
      });
      toast.showSuccess('Edit Success');
      form.resetFields();
      setEdit(false);
      mutateDaily();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: `dailymilks/${id}` });
      toast.showSuccess('Delete success');
      mutateDaily();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div>
      <div className="flex gap-5 mb-5">
        {detailCow?.cowStatus === 'milkingCow' && (
          <ButtonComponent onClick={openModal} type="primary">
            Create Daily Milk
          </ButtonComponent>
        )}
      </div>

      <CreateDailyMilkModal id={id} modal={modal} mutate={mutateDaily} />
      <CalendarComponent
        events={events}
        initialView="dayGridMonth"
        eventContentRenderer={(eventInfo) => (
          <div className="relative w-full text-xs lg:text-base text-wrap !h-fit cursor-default flex flex-col gap-2">
            <PopconfirmComponent
              title="Delete?"
              onConfirm={() => onConfirm(eventInfo.event.id)}
            >
              <IoMdClose
                className="absolute right-0 hover:opacity-50 duration-100 cursor-pointer"
                size={20}
              />
            </PopconfirmComponent>
            <p className="mt-3">
              <strong>{eventInfo.event.title}</strong>
            </p>
            <DescriptionComponent
              className="!bg-white overflow-auto w-full"
              items={[
                {
                  label: <p>Worker</p>,
                  children: (
                    <div>
                      <p className="font-bold">
                        {eventInfo.event.extendedProps?.worker.name}
                      </p>
                      <p className="text-gray-400">
                        ID: {eventInfo.event.extendedProps?.worker.employeeId}
                      </p>
                    </div>
                  ),
                  className: classNameStyle,
                  span: 3,
                },
                {
                  label: <p>Shift</p>,
                  children: eventInfo.event.extendedProps?.shift,
                  className: classNameStyle,
                  span: 3,
                },
                {
                  label: (
                    <div className="flex gap-2 justify-center items-center">
                      <p>
                        Volume <span className="text-orange-500">(lit)</span>
                      </p>
                      <PiPencil
                        size={20}
                        className="cursor-pointer hover:opacity-50 duration-100"
                        onClick={() =>
                          toogleEdit(
                            eventInfo.event.id,
                            eventInfo.event.extendedProps.volume
                          )
                        }
                      />
                    </div>
                  ),
                  children: !edit ? (
                    <p>{eventInfo.event.extendedProps?.volume}</p>
                  ) : (
                    <FormComponent form={form} onFinish={onFinish}>
                      <FormItemComponent name="id" hidden>
                        <InputComponent />
                      </FormItemComponent>
                      <FormItemComponent
                        name="newVolume"
                        rules={[{ required: true }]}
                      >
                        <InputComponent />
                      </FormItemComponent>
                      <ButtonComponent
                        loading={isLoadingEdit}
                        htmlType="submit"
                        type="primary"
                        className="!text-sm"
                      >
                        Submit
                      </ButtonComponent>
                    </FormComponent>
                  ),
                  className: classNameStyle,
                },
              ]}
            />
          </div>
        )}
      />
    </div>
  );
};

export default DailyMilk;
