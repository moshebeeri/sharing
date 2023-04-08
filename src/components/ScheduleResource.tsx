import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  scheduleResource,
  deleteSchedule,
  ScheduleActionTypes,
} from "./actions";

interface Schedule {
  [key: string]: { startTime: string; endTime: string };
}

const ScheduleResource: React.FC = () => {
  const [user, setUser] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSlotLength, setTimeSlotLength] = useState(2);
  const [schedule, setSchedule] = useState<Schedule>({});

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      scheduleResource(user, startTime, endTime, timeSlotLength)
    );
    setUser("");
    setStartTime("");
    setEndTime("");
    setTimeSlotLength(2);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter start time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter end time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <select
          value={timeSlotLength}
          onChange={(e) => setTimeSlotLength(+e.target.value)}
        >
          <option value={2}>2 hours</option>
          <option value={3}>3 hours</option>
        </select>
        <button type="submit">Schedule Resource</button>
      </form>
      <ul>
        {Object.keys(schedule).map((user) => (
          <li key={user}>
            {user} ({schedule[user].startTime} - {schedule[user].endTime})
            <button onClick={() => dispatch(deleteSchedule(user))}>
              Delete Schedule
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleResource;
