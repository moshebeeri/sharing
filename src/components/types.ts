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
  userId?: string;
}

export interface ScheduleProps {
  events: CalendarEvent[];
}

export class Event implements CalendarEvent {
  event_id: string | number;
  title: string;
  start: Date;
  end: Date;
  disabled?: boolean | undefined;
  color?: string | undefined;
  editable?: boolean | undefined;
  deletable?: boolean | undefined;
  draggable?: boolean | undefined;
  allDay?: boolean | undefined;
  userId?: string | undefined;

  constructor(
    event_id: string | number,
    title: string,
    start: Date,
    end: Date,
    disabled?: boolean | undefined,
    color?: string | undefined,
    editable?: boolean | undefined,
    deletable?: boolean | undefined,
    draggable?: boolean | undefined,
    allDay?: boolean | undefined,
    userId?: string | undefined) {
      this.event_id    = event_id;
      this.title       = title;
      this.start       = start;
      this.end         = end;
      this.disabled    = disabled;
      this.color       = color;
      this.editable    = editable;
      this.deletable   = deletable;
      this.draggable   = draggable;
      this.allDay      = allDay;
      this.userId      = userId;
    }
}


export  interface Invite {
  userId: string;
  resourceId: string;
  email: string;
}
