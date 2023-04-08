import { Scheduler } from "@aldabil/react-scheduler";
import { EVENTS } from "./events";

export default function EventsViewer() {
  return <Scheduler events={EVENTS} />;
}
