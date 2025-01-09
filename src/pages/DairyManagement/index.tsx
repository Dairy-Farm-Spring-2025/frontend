import React from "react";
import CalendarComponent from "../../components/Calendar/CalendarComponent";

const DairyManagement: React.FC = () => {
  const events = [
    {
      title: "Morning Shift",
      start: "2025-01-07T05:00:00",
      end: "2025-01-07T12:00:00",
      jobs: [
        { title: "Prepare Inventory", duration: "05:00-07:00" },
        { title: "Daily Briefing", duration: "07:00-08:00" },
      ],
    },
  ];

  return (
    <CalendarComponent
      events={events}
      slotMinTime="05:00:00"
      slotMaxTime="23:59:59"
      eventContentRenderer={(eventInfo: any) => {
        const { title, extendedProps } = eventInfo.event;
        const jobs = extendedProps.jobs || [];
        return (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-2 rounded-md">
            <div className="font-bold text-sm">{title}</div>
            <ul className="text-xs mt-1 space-y-1">
              {jobs.map((job: any, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-blue-600 font-medium">
                    {job.duration}
                  </span>
                  <span className="ml-2">{job.title}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
};

export default DairyManagement;
