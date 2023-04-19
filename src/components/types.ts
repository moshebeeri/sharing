// types.ts
export interface CalendarEvent {
  event_id: number | string;
  title: string;
  start: Date;
  end: Date;
  disabled?: boolean;
  color?: string;
  editable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  allDay?: boolean;
}

export interface ScheduleProps {
  events: CalendarEvent[];
}