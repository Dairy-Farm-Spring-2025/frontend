import { EventInput } from '@fullcalendar/core/index.js';
import { Spin } from 'antd';
import { useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import CalendarComponent from '../../../../../components/Calendar/CalendarComponent';
import useModal from '../../../../../hooks/useModal';
import { Cow } from '../../../../../model/Cow/Cow';
import { DailyMilkModel } from '../../../../../model/DailyMilk/DailyMilk';
import CreateDailyMilkModal from './components/CreateDailyMilkModal';
import ModalDetailDailyMilk from './components/ModalDetailDailyMilk';
import DailyMilkRecord from './DailyMilkRecord';
import { t } from 'i18next';

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
  const modalDailyMilk = useModal();
  const [dailyMilk, setDailyMilk] = useState(null);
  const events: EventInput[] | any = dataMilk?.map((entry: DailyMilkModel) => {
    let start = entry.milkDate;
    let end = entry.milkDate;

    if (entry.shift === 'shiftOne') {
      start = `${entry.milkDate}T00:00:00`;
      end = `${entry.milkDate}T05:59:59`;
    } else if (entry.shift === 'shiftTwo') {
      start = `${entry.milkDate}T06:00:00`;
      end = `${entry.milkDate}T11:59:59`;
    } else if (entry.shift === 'shiftThree') {
      start = `${entry.milkDate}T12:00:00`;
      end = `${entry.milkDate}T17:59:59`;
    } else if (entry.shift === 'shiftFour') {
      start = `${entry.milkDate}T18:00:00`;
      end = `${entry.milkDate}T23:59:59`;
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

  const openDailyModal = (dailyMilk: any) => {
    setDailyMilk(dailyMilk);
    modalDailyMilk.openModal();
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div>
      <div className="flex gap-5 mb-5">
        {detailCow?.cowStatus === 'milkingCow' && (
          <ButtonComponent onClick={openModal} type="primary">
            {t('Create daily milk')}
          </ButtonComponent>
        )}
      </div>
      <div className="flex flex-col gap-10">
        <div className="">
          <CalendarComponent
            eventClick={(info: any) => openDailyModal(info.event)} // Handle click event
            events={events}
            initialView="dayGridMonth"
            eventContentRenderer={(eventInfo) => (
              <div className="text-center w-full">
                <p>{eventInfo.event.extendedProps.volume} (lit)</p>
              </div>
            )}
            height={700}
          />
        </div>
        <div className="">
          <DailyMilkRecord id={id} />
        </div>
      </div>
      {modalDailyMilk.open && (
        <ModalDetailDailyMilk
          dailyMilk={dailyMilk}
          modal={modalDailyMilk}
          mutateDaily={mutateDaily}
        />
      )}

      <CreateDailyMilkModal id={id} modal={modal} mutate={mutateDaily} />
    </div>
  );
};

export default DailyMilk;
