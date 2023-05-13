import { User } from 'firebase/auth';

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


// User Auth state

export const USER_LOADING = 'USER_LOADING';
export const USER_LOADED = 'USER_LOADED';

export const userLoading = () => ({
  type: USER_LOADING,
});

export const userLoaded = (user: User) => ({
  type: USER_LOADED,
  payload: user,
});
