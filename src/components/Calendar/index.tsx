import React from "react";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg, EventInput } from "@fullcalendar/core"; // Correct import for EventInput
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import ".//calendar.scss";

interface CustomCalendarProps {
  initialView?: string;
  headerToolbar?: {
    start: string;
    center: string;
    end: string;
  };
  events?: EventInput[];
  height?: string | number;
  slotMinTime?: string;
  slotMaxTime?: string;
  eventContentRenderer?: (eventInfo: EventContentArg) => React.ReactNode;
}

const CalendarComponent: React.FC<CustomCalendarProps> = ({
  initialView = "timeGridWeek",
  headerToolbar = {
    start: "today prev,next",
    center: "title",
    end: "dayGridMonth timeGridWeek timeGridDay",
  },
  events = [],
  height = "90vh",
  slotMinTime = "00:00:00",
  slotMaxTime = "24:00:00",
  eventContentRenderer,
}) => {
  return (
    <div className="p-4 bg-white min-h-screen rounded-md shadow-lg calendar">
      <FullCalendar
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
      />
    </div>
  );
};

export default CalendarComponent;
