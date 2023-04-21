import React from "react";
import Schedule from "./Schedule";
import { EVENTS } from "./events";
import { getLocale } from "./getLocale";


const ScheduleView = () => {
  const userLocale = getLocale();

  return (
    <div>
      <h4>Upcoming Events</h4>
      <Schedule events={EVENTS} />
    </div>
  );
};

export default ScheduleView;
