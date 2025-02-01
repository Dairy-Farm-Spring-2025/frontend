import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi, EventContentArg, EventInput } from '@fullcalendar/core'; // Correct import for EventInput
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Plugin for date click
import './calendar.scss';

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

  const handleDateClick = (dateInfo: { dateStr: string }) => {
    const calendarApi: CalendarApi | any = mainCalendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(dateInfo.dateStr);
    }
  };

  const handleViewChange = (view: string) => {
    console.log(view);
    setCurrentView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  };

  return (
    <div className="flex">
      {currentView === 'timeGridDay' && (
        <div className="w-1/5 p-2 bg-gray-100 rounded-md shadow-md">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{
              left: '',
              center: 'title',
              right: '',
            }}
            dateClick={handleDateClick}
          />
        </div>
      )}

      {/* Main Calendar */}
      <div
        className={`p-4 bg-white rounded-md shadow-lg calendar ${
          currentView === 'timeGridDay' ? 'w-4/5' : 'w-full'
        }`}
      >
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
