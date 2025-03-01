import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi, EventContentArg, EventInput } from '@fullcalendar/core'; // Correct import for EventInput
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Plugin for date click
import './calendar.scss';
import ButtonComponent from '@components/Button/ButtonComponent';
import { motion } from 'framer-motion';

interface CustomCalendarProps {
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  headerToolbar?: {
    start?: string;
    center?: string;
    end?: string;
  };
  events?: EventInput[];
  height?: string | number;
  slotMinTime?: string;
  slotMaxTime?: string;
  eventContentRenderer?: (eventInfo: EventContentArg) => React.ReactNode;
  className?: string;
}

const CalendarComponent: React.FC<CustomCalendarProps> = ({
  initialView = 'timeGridWeek',
  headerToolbar = {
    start: 'today prev,next',
    center: 'title',
    end: 'dayGridMonth timeGridWeek timeGridDay',
  },
  events = [],
  height = '90vh',
  slotMinTime = '00:00:00',
  slotMaxTime = '24:00:00',
  eventContentRenderer,
  ...props
}) => {
  const mainCalendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState(initialView);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [toogleDate, setToogleDate] = useState<any>();

  const handleDateClick = (dateInfo: { dateStr: string; date: Date }) => {
    const localDate = new Date(
      dateInfo.date.getTime() - dateInfo.date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];

    console.log('Converted localDate:', localDate);

    setToogleDate(localDate);

    const calendarApi: CalendarApi | any = mainCalendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(localDate);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  };

  const handleClose = () => {
    setPopoverVisible(!popoverVisible);
    setToogleDate(undefined);
  };

  return (
    <div className="">
      {currentView === 'timeGridDay' && (
        <div>
          <ButtonComponent onClick={handleClose}>
            {popoverVisible ? 'Close' : 'Open'} pick day
          </ButtonComponent>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: popoverVisible ? 1 : 0,
              scale: popoverVisible ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            {popoverVisible && (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height={500}
                dayCellClassNames={(date) =>
                  date.date.toLocaleDateString('fr-CA') === toogleDate
                    ? 'selected-date'
                    : ''
                }
                headerToolbar={{
                  start: 'prev,next',
                  center: 'title',
                  right: '',
                }}
                dateClick={handleDateClick}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* Main Calendar */}
      <div className={`p-4 bg-white rounded-md shadow-lg calendar w-full`}>
        <FullCalendar
          ref={mainCalendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={initialView}
          headerToolbar={headerToolbar}
          height={height}
          views={{
            timeGridWeek: {
              slotMinTime,
              slotMaxTime,
            },
          }}
          events={events}
          eventContent={(eventInfo) =>
            eventContentRenderer ? eventContentRenderer(eventInfo) : null
          }
          datesSet={(dateInfo) => handleViewChange(dateInfo.view.type)}
          {...props}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
