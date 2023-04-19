// Schedule.tsx
import React, { FC } from "react";
import { List, ListItem } from "@mui/material";
import { CalendarEvent } from "./types";
import EventItem from "./EventItem";

interface ScheduleProps {
  events: CalendarEvent[];
}

const Schedule: FC<ScheduleProps> = ({ events }) => {
  const sortedEvents = events.slice().sort((a, b) => a.start.valueOf() - b.start.valueOf());
  const upcomingEvents = sortedEvents.slice(0, 10);

  return (
    <List>
      {upcomingEvents.map((event) => (
        <ListItem key={event.event_id} disablePadding>
          <EventItem event={event} />
        </ListItem>
      ))}
    </List>
  );
};

export default Schedule;
// import React from "react";
// import { format } from "date-fns";
// import { Typography } from "@mui/material";
// import EventItem from "./EventItem";
// import "./Schedule.css"; // Add this line to import the CSS styles

// const getUpcomingEvents = (events) => {
//   const now = new Date();
//   const upcomingEvents = events
//     .filter((event) => event.start >= now)
//     .sort((a, b) => a.start - b.start)
//     .slice(0, 10);
//   return upcomingEvents;
// };

// const Schedule = ({ events, locale }) => {
//   const hFormat = "HH:mm";
//   const upcomingEvents = getUpcomingEvents(events);

//   return (
//     <div className="schedule">
//       {upcomingEvents.map((event) => {
//         const startTime = format(event.start, hFormat, { locale });
//         const endTime = format(event.end, hFormat, { locale });
//         const date = format(event.start, "P", { locale });

//         return (
//           <div key={event.event_id} className="schedule-event">
//             <div className="schedule-event-date">
//               <Typography variant="subtitle1">{date}</Typography>
//             </div>
//             <div className="schedule-event-time">
//               <Typography variant="caption">
//                 {startTime} - {endTime}
//               </Typography>
//             </div>
//             <EventItem event={event} />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Schedule;
