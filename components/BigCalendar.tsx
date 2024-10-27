"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

interface BigCalendarProps {
  events: Array<{
    title: string;
    fullTitle: string;
    start: Date;
    end: Date;
    allDay?: boolean;
  }>;
}

const BigCalendar = ({ events }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: 'rgba(94, 84, 142, 0.8)', // mainColor.default with some transparency
      borderRadius: '5px',
      color: 'white ',
      border: '0px',
      display: 'block', 
      padding: '2px 5px',
    };
    return {
      style: style
    };
  };
  const dayPropGetter = (date: Date) => {
    if (moment(date).isSame(moment(), 'day')) {
      return {
        style: {
          backgroundColor: 'rgba(94, 84, 142, 0.4)', // mainColor.light
        },
      };
    }
    return {};
  };

  return (
    <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    views={["month", "week", "day"]}
    view={view}
    onView={handleOnChangeView}
    style={{ height: "500px" }}
    eventPropGetter={eventStyleGetter}
    dayPropGetter={dayPropGetter}
    formats={{
      eventTimeRangeFormat: () => "",
    }}
    components={{
      event: (props) => {
        const shortTitle = props.title.length > 10 ? props.title.substring(0, 10) + '...' : props.title;
        return (
          <div
            title={props.event.fullTitle}
            style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem',
              lineHeight: '1.2' }}
          >
            {shortTitle}
          </div>
        );
      },
    }}
    />
  );
};

export default BigCalendar;
