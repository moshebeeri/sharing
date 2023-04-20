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
// EventItem.tsx