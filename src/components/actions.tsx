interface ScheduleResourceAction {
  type: typeof SCHEDULE_RESOURCE;
  user: string;
  start: string;
  end: string;
  slotLength: number;
}

interface DeleteScheduleAction {
  type: typeof DELETE_SCHEDULE;
  user: string;
}

export const SCHEDULE_RESOURCE = "SCHEDULE_RESOURCE";
export const DELETE_SCHEDULE = "DELETE_SCHEDULE";

export type ScheduleActionTypes = ScheduleResourceAction | DeleteScheduleAction;

export const scheduleResource = (
  user: string,
  start: string,
  end: string,
  slotLength: number,
): ScheduleResourceAction => ({
  type: SCHEDULE_RESOURCE,
  user,
  start,
  end,
  slotLength,
});

export const deleteSchedule = (user: string): DeleteScheduleAction => ({
  type: DELETE_SCHEDULE,
  user,
});
