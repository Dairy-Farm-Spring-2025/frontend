import { EventInput } from '@fullcalendar/core/index.js';
import { Spin } from 'antd';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import CalendarComponent from '../../../../../components/Calendar/CalendarComponent';
import DescriptionComponent from '../../../../../components/Description/DescriptionComponent';
import useModal from '../../../../../hooks/useModal';
import { DailyMilkModel } from '../../../../../model/DailyMilk/DailyMilk';
import CreateDailyMilkModal from './components/CreateDailyMilkModal';
import { Cow } from '../../../../../model/Cow/Cow';

interface DailyMilkProps {
  id: string;
  dataMilk: DailyMilkModel[];
  isLoading: boolean;
  mutateDaily: any;
  detailCow: Cow;
}

const DailyMilk = ({
  id,
  dataMilk = [],
  isLoading,
  mutateDaily,
  detailCow,
}: DailyMilkProps) => {
  const modal = useModal();
  const classNameStyle = '!text-xs lg:!text-sm !text-center !p-2';

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

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div>
      {detailCow?.cowStatus === 'milkingCow' && (
        <ButtonComponent onClick={openModal} type='primary'>
          Create Daily Milk
        </ButtonComponent>
      )}

      <CreateDailyMilkModal id={id} modal={modal} mutate={mutateDaily} />
      <CalendarComponent
        events={events}
        initialView='dayGridMonth'
        eventContentRenderer={(eventInfo) => (
          <div className='w-full text-xs lg:text-base text-wrap h-full'>
            <p className='!mb-1'>
              <strong>{eventInfo.event.title}</strong>
            </p>
            <DescriptionComponent
              className='!bg-white overflow-auto w-full'
              items={[
                {
                  label: <p>Worker</p>,
                  children: (
                    <div>
                      <p className='font-bold'>
                        {eventInfo.event.extendedProps?.worker.name}
                      </p>
                      <p className='text-gray-400'>
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
                  span: 1.5,
                },
                {
                  label: (
                    <p>
                      Volume <span className='text-orange-500'>(lit)</span>
                    </p>
                  ),
                  children: (
                    <p>
                      {eventInfo.event.extendedProps?.volume}
                      <span className='text-orange-500'>(lit)</span>
                    </p>
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
